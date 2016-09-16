<?php
/**
 * Audio queue component finder
 * @author Antony Lavrenko
 */

namespace make\Cache\Connections;


use make\Cache\Console\Console;
use make\Cache\Interfaces\FindConnectionsInterface;
use make\Cache\MakeCache;
use make\Finder\Finder;

class AudioFinder extends FindConnectionsInterface
{
    const AUTO_CONFIG = "autoConfig";
    const AUTO_FORMAT = "format";

    protected $formats = array("mp3", "ogg");

    protected $path = "/../../../app/";

    protected $toPath = "/../../../../app/";
    protected $toPathDir = "/../../../../assets/audio/";

    public function execute($data = null)
    {
        $alias = ComponentFinder::$lastAliasComponent;

        if(!empty($data[self::DATA][self::AUTO_CONFIG]) && $data[self::DATA][self::AUTO_CONFIG] === true){
            $data[self::DATA] = $this->autoFinderAudio($data[self::BASE_DIR], $data[self::DATA], $data[self::DATA][self::AUTO_FORMAT]);
        }

        if(!empty($data[self::DATA][self::AUDIO]) && count($data[self::DATA][self::AUDIO]) > 0){

            foreach($data[self::DATA][self::AUDIO] as $aliasName => $dataPath){

                foreach($dataPath as $typeAudio=>$path){
                    $this->setAudio($data, $typeAudio, $aliasName, $dataPath, $alias, $data[self::TYPE_PARTITION]);
                }

            }
        }
    }

    /**
     * Auto config
     * @param $path
     * @param $data
     * @param $formatData
     */
    protected function autoFinderAudio($path, $data, $formatData)
    {
        $cp = array(); // isset in config audio find

        foreach ($data[self::AUDIO] as $file) {
            foreach ($file as $audio) {
                $cp[] = $audio[self::PATH];
            }
        }

        $finder = new Finder();

        $unFind = array();

        foreach($finder->getDI($path) as $au){

            $format = false;
            $filename = $au->getFilename();

            for($i=0; $i < count($this->formats); $i++){
                if(strpos($filename, $formatData) !== false){
                    $format = $formatData;
                }
            }

            if($format === false){
                continue;
            }

            if(in_array($filename, $cp) === false){
                $unFind[] = $filename;
            }
        }

        foreach($unFind as $el){
            $filename = basename($el, "." . $formatData);

            $data[self::AUDIO][$filename][$formatData][self::PATH] = $el;
        }

        unset($data[self::AUTO_CONFIG]);

        file_put_contents($path . "/config.json", json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        return $data;
    }

    /**
     * Set audio to application
     *
     * @param $data
     * @param $typeAudio
     * @param $aliasName
     * @param $dataPath
     * @param $alias
     * @param $partition
     */
    protected function setAudio($data, $typeAudio, $aliasName, $dataPath, $alias, $partition){

        if(!is_file($data[self::BASE_DIR] . "/" . $dataPath[$typeAudio][self::PATH])){
	    Console::error("File not found! File: " . $data[self::BASE_DIR] . "/" . $dataPath[$typeAudio][self::PATH] . "; Alias:" . $aliasName);
        }

        $audioPath = $data[self::BASE_DIR] . "/" . $dataPath[$typeAudio][self::PATH];

        /**
         * If Prod mode all images copy to /app/ folder
         */
        if(MakeCache::$mode == MakeCache::MODE_PROD || MakeCache::$mode == MakeCache::MODE_TEST){

            $path = dirname(__DIR__) . "/../" .$data[self::BASE_DIR] . "/" . $dataPath[$typeAudio][self::PATH];
            $dir = dirname(__DIR__) . $this->toPathDir;

            $newName = trim($alias) . "_" . trim($dataPath[$typeAudio][self::PATH]);

            if(!file_exists($path)){
                Console::error(sprintf("Audio not found \"%s\"", $dataPath[$typeAudio][self::PATH]));
            }

            $copy = file_get_contents($path);

            if(!is_dir($dir)){
                Finder::createDir($dir);
            }

            file_put_contents(dirname(__DIR__) . $this->toPathDir . $newName, $copy);

            $audioPath = "../../../assets/audio/" . $newName;
        }

        $this->getBuffer()->setAudios(
            !empty($dataPath[self::TYPE_LOADING]) ? $dataPath[self::TYPE_LOADING] : $data[self::TYPE_LOADING],
            $typeAudio,
            $data[self::ALIAS] . "_" . $aliasName,
            $audioPath,
            sprintf("%u", filesize($data[self::BASE_DIR] . "/" . $dataPath[$typeAudio][self::PATH])),
            $typeAudio == "mp3" ? $this->getMp3TimeData($data[self::BASE_DIR] . "/" . $dataPath[$typeAudio][self::PATH]) : false,
            $partition
        );
    }

    /**
     * Get audio time length
     * @param $path
     * @return int
     */
    protected function getMp3TimeData($path)
    {
        $data = \GetAudioData::readframe($path);

        if(!empty($data)){
            return (int)($data['lengths'] * 1000);
        }

        return 0;
    }
} 
