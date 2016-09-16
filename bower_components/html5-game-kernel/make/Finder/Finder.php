<?php
/**
 * Finder elements in filesystem
 * @author Antony Lavrenko
 */
namespace make\Finder;

use DirectoryIterator;
use make\Cache\Console\Console;

class Finder {

    /**
     * @var $di DirectoryIterator
     */
    protected $di = null;
    protected $configName = CONF_NAME;

    protected $bowerComponent = array("bower_components");
    protected $kernelName = "kernel";
    public static $bowerComponents = array();

    public static $canNotRemoved = array(".hot-update.", "bundle.js", "is_prod.bundle.js");

    /**
     * Get instance of DirectoryIterator with current Path
     *
     * @param $path
     * @return DirectoryIterator
     */
    public function getDI($path)
    {
        try{
            return new DirectoryIterator($path);
        } catch(\Exception $e){
            throw new \Exception($e->getMessage());
            //return null;
        }

    }

    /**
     * Get Last DI
     *
     * @return DirectoryIterator
     */
    public function getLastDI()
    {
        return $this->di;
    }

    /**
     * Get files in current path
     *
     * @param $di
     * @return array|null
     */
    public function getFiles(DirectoryIterator $di)
    {
        $list = array();

        if($di === null){
            return null;
        }

        foreach($di as $files){
            if($files->isDot()) continue;
            $list[] = $files->getFilename();
        }

        return $list;
    }

    /**
     * Get config file in current folder
     *
     * @param DirectoryIterator $di
     * @return mixed|null
     */
    public function getConfig(DirectoryIterator $di)
    {
        $file = null; $noConfigFolder = false; $folders = array();
        foreach($di as $files){
            if($files->getFilename() == $this->configName){
                $file = $files;
                continue;
            }

            if($files->isDot()) continue;
            if($files->isDir()){
                $folders[] = $files->getFilename();
            }

            $folders = $this->filterByKernelList($folders);

            if(in_array($files->getFilename(), $this->bowerComponent)){

                foreach($this->getDI($files->getPath() . '/' . $files->getFilename()) as $filesN){
                    if($filesN->isDot()) continue;
                    if($filesN->isDir()){
                        self::$bowerComponents[] = $filesN->getFilename();
                    }
                }

                self::$bowerComponents = $this->filterByKernelList(self::$bowerComponents);
            }


            if(in_array($files->getFilename(), self::$bowerComponents)){
                $noConfigFolder = true;
                continue;
            }
        }

        if($file !== null){
            $fileName = $file->getPath() . '/' . $this->configName;

            $jsonString = file_get_contents($fileName);

            return \HelperJSON::decode($jsonString, true, realpath($fileName));
        }

        if($noConfigFolder === true && count($folders) > 0){
            return array(
                "name" => "Vendor folders of kernel game application",
                "type" => "folder",
                "folders" => $folders
            );
        }

        return null;
    }

    /**
     * Filter components by priorities
     * @param $list
     * @return array
     */
    protected function filterByKernelList($list)
    {
        $array = array(); $array2 = array();

        foreach ($list as $nameFolder) {
            if(strpos($nameFolder, $this->kernelName) === false){
                $array[] = $nameFolder;
            } else {
                $array2[] = $nameFolder;
            }
        }

        return array_merge($array2, $array);
    }

    /**
     * Clear folder from files
     *
     * @param $path
     */
    public function clearFolder($path)
    {
        foreach (new DirectoryIterator($path) as $fileInfo) {
            if(!$fileInfo->isDot() && !$fileInfo->isDir()) {

                $find = false;
                foreach (self::$canNotRemoved as $noRemoved) {

                    if(strpos($fileInfo->getPathname(), $noRemoved) !== false){
                        $find = true;
                    }
                }

                if($find === false){
                    unlink($fileInfo->getPathname());
                }

            } elseif(!$fileInfo->isDot() && $fileInfo->isDir()) {
                $this->clearFolder($fileInfo->getPathname());
            }
        }
    }

    /**
     * Create directory
     *
     * @param $path
     */
    public static function createDir($path)
    {
        if (!mkdir($path, ACC_DIR, true)) {
            Console::error(sprintf("Can not was created directory: %s", $path));
        }
    }

    /**
     * Is directory exists
     * @param $path
     * @param $directoryName
     */
    public static function isDirectory($path, $directoryName)
    {
        $dirPath = $path . "/" . $directoryName;
        if(!is_dir($dirPath)){
            Console::error(sprintf("Directory \"%s\" not found in path \"%s\"", $directoryName, $path));
        }
    }

} 