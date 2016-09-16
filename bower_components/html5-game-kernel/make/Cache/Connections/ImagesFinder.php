<?php
/**
 * Images queue component finder
 * @author Antony Lavrenko
 */

namespace make\Cache\Connections;


use make\Cache\BufferCache;
use make\Cache\Console\Console;
use make\Cache\Interfaces\FindConnectionsInterface;
use make\Cache\MakeCache;
use make\Finder\Finder;

//MakeCache::$mode

class ImagesFinder extends FindConnectionsInterface
{
    const M_LANG = "multilanguage";
    const ALTERNATIVE = "alternative";

    const I_MD5 = "md5";
    const I_ORIGINAL = "original";

    protected $path = "/../../../app/";

    protected $toPath = "/../../../../app/";
    protected $toPathDir = "/../../../../assets/images/";


    public function execute($data = null)
    {//print_r($data); die;
        $alias = ComponentFinder::$lastAliasComponent;

        if(!empty($data[self::DATA][self::IMAGES]) && count($data[self::DATA][self::IMAGES]) > 0){

            if(MakeCache::$mode != MakeCache::MODE_DEV){
                //$data[self::DATA] = $this->compressFinderImages($data[self::BASE_DIR], $data[self::DATA]);
            }

            foreach($data[self::DATA][self::IMAGES] as $aliasName => $dataPath){

                if(isset($dataPath[self::M_LANG])){
                    foreach($dataPath as $key => $value){
                        if($key != self::M_LANG){
                            $this->addImage($data, $value, $aliasName, $key, $alias, $data[self::TYPE_PARTITION],
                                !empty($dataPath[self::ALTERNATIVE]) ? $dataPath[self::ALTERNATIVE] : null,
                                !empty($dataPath[self::TYPE_LOADING]) ? $dataPath[self::TYPE_LOADING] : null);
                        }
                    }

                } else {
                    $this->addImage($data, $dataPath, $aliasName, false, $alias, $data[self::TYPE_PARTITION],
                        !empty($dataPath[self::ALTERNATIVE]) ? $dataPath[self::ALTERNATIVE] : null,
                        !empty($dataPath[self::TYPE_LOADING]) ? $dataPath[self::TYPE_LOADING] : null);
                }

            }
        }
    }

    /**
     * Auto config compress image
     * @param $path
     * @param $data
     */
    protected function compressFinderImages($path, $data)
    {
        $cData = $data;

        foreach ($data[self::IMAGES] as $key => $file) {

            if(isset($file[self::M_LANG])){

                foreach ($file as $k => $item) {
                    if($k != self::M_LANG){
                        $cData[self::IMAGES][$key][$k] = $this->compressImage($path, $item);
                    }
                }
            } else if($key != self::M_LANG){
                $cData[self::IMAGES][$key] = $this->compressImage($path, $file);
            }

        }

        file_put_contents($path . "/config.json", json_encode($cData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        return $cData;
    }

    /**
     * Compress image
     * @param $path
     * @param $dataImage
     * @return mixed
     * @throws \Exception
     */
    protected function compressImage($path, $dataImage)
    {
        $imagePath = $path . "/" . $dataImage[self::I_ORIGINAL];

        if(empty($dataImage[self::I_MD5])){
            $dataImage[self::I_MD5] = null;
            $imagePath = $path . "/" . $dataImage[self::PATH];
        }

        if(!file_exists($imagePath)){
            Console::error("File not found! File: " . $imagePath);
        }

        $file = file_get_contents($imagePath);

        $md5 = md5($file);

        if($dataImage[self::I_MD5] == $md5){
             //return $dataImage;
        }

        $format = $this->getImageFormat($imagePath);

        if($format != "png"){
            return $dataImage;
        }

        $dataImage[self::I_MD5] = $md5;
        $dataImage[self::I_ORIGINAL] = $dataImage[self::PATH];

        if(strpos($imagePath, "_opt") === false){
            $newName = basename($imagePath, ".".$format) . "_opt." . $format;
        } else {
            $newName = basename($imagePath);
        }

        $im =  \PNGQuant::compress_png($imagePath, 30);
        file_put_contents($path . "/" . $newName, $im);

        $dataImage[self::PATH] = $newName;

        return $dataImage;
    }

    /**
     * Get image format
     * @param $imagePath
     * @return mixed
     */
    protected function getImageFormat($imagePath){
        $data = getimagesize($imagePath);
        $list = explode("/", $data["mime"]);
        return end($list);
    }

    /**
     * Add image to buffer
     *
     * @param $data
     * @param $dataPath
     * @param $aliasName
     * @param $multiLang
     * @param $alias
     * @param $partition
     * @param $alternative
     * @param $typeLoading
     */
    private function addImage($data, $dataPath, $aliasName, $multiLang, $alias, $partition = false, $alternative = null, $typeLoading = null)
    {
        if(!is_file($data[self::BASE_DIR] . "/" . $dataPath[self::PATH])){
            Console::error("File not found! File: " . $data[self::BASE_DIR] . "/" . $dataPath[self::PATH]);
        }

        //$im =  \PNGQuant::compress_png($data[self::BASE_DIR] . "/" . $dataPath[self::PATH], 80);
        //file_put_contents($data[self::BASE_DIR] . "/" . $dataPath[self::PATH] . ".png", $im);

        $size = getimagesize($data[self::BASE_DIR] . "/" . $dataPath[self::PATH]);

        $imagePath = $data[self::BASE_DIR] . "/" . $dataPath[self::PATH];

        if($partition === false || $partition === null){
            $partition = BufferCache::PARTIAL_DEFAULT;
        } else {
            $partition = implode("_", $partition);
        }

        /**
         * If Prod mode all images copy to /app/ folder
         */
        if(MakeCache::$mode == MakeCache::MODE_PROD || MakeCache::$mode == MakeCache::MODE_TEST){

            $path = dirname(__DIR__) . "/../" .$data[self::BASE_DIR] . "/" . $dataPath[self::PATH];
            $dir = dirname(__DIR__) . $this->toPathDir;

            $newName = $partition . "_" . trim($alias) . "_" . $aliasName . "_" . trim($dataPath[self::PATH]);

            if(!file_exists($path)){
                Console::error(sprintf("Image not found \"%s\"", $dataPath[self::PATH]));
            }

            $copy = file_get_contents($path);

            if(!is_dir($dir)){
                Finder::createDir($dir);
            }

            file_put_contents(dirname(__DIR__) . $this->toPathDir . $newName, $copy);

            $imagePath = "../../../assets/images/" . $newName;
        }

        $this->getBuffer()->setImages(
            $typeLoading !== null ? $typeLoading : $data[self::TYPE_LOADING],
            $data[self::ALIAS] . "_" . $aliasName,
            $imagePath,
            sprintf("%u", filesize($data[self::BASE_DIR] . "/" . $dataPath[self::PATH])),
            array(
                "width"     =>  $size[0],
                "height"    =>  $size[1]
            ),
            $multiLang,
            $partition,
            $alternative
        );
    }
} 