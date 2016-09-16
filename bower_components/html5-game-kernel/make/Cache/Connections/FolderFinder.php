<?php
/**
 * Scan all folders
 * @author Antony Lavrenko
 */

namespace make\Cache\Connections;

use make\Cache\BufferCache;
use make\Cache\Console\Console;
use make\Cache\Fabric\Fabric;
use make\Cache\Interfaces\FindConnectionsInterface;
use make\Types\StateCombination;


class FolderFinder extends FindConnectionsInterface
{
    const DIST_ENABLE = "dist";
    const DIST_FILE = "config.dist.json";

    /**
     * Execute folders
     *
     * @param null $data
     * @return array|bool|void
     * @throws \Exception
     */
    public function execute($data = null)
    {
        $results = array();

        if(!empty($data[self::DATA]) && !empty($data[self::DATA][self::DIST_ENABLE]) && $data[self::DATA][self::DIST_ENABLE] === true){

            $distFilename = dirname(__DIR__) . "/../" . $data[self::BASE_DIR] . "/" . self::DIST_FILE;

            if(file_exists($distFilename)){

                $dist = file_get_contents($distFilename);

                try{
                    $data[self::DATA] = \MergeArrays::arrayMergeRecursive($data[self::DATA], \HelperJSON::decode($dist, true));
                } catch(\Exception $e){
                    Console::error($e->getMessage());
                }
            }
        }

        /**
         * Isset information of Frame game size
         */
        if(!empty($data[self::DATA][self::FRAME_SIZE]))
        {
            $this->getBuffer()->setFrameSize($data[self::DATA][self::FRAME_SIZE]);
        }

        if(!empty($data[self::DATA][self::COMPILE_SETTINGS])){

            /**
             * Set need libs
             */
            if(!empty($data[self::DATA][self::COMPILE_SETTINGS][self::COMP_LIBS])){
                $this->getBuffer()->setNeedLibs($data[self::DATA][self::COMPILE_SETTINGS][self::COMP_LIBS]);
            }
        }

        /**
         * Set game instance versions
         */
        if(!empty($data[self::DATA][self::GAME_PARTITIONS][self::CONDITIONS]))
        {
            $this->getBuffer()->setGamesPartitionsConditions($data[self::DATA][self::GAME_PARTITIONS][self::CONDITIONS]);
        }

        /**
         * Find settings for routes.json
         */
        if(!empty($data[self::DATA][self::ROUTER_DATA]) && $data[self::DATA][self::ROUTER_DATA] == true)
        {
            $routerJsonPath = $data[self::BASE_DIR] . "/routes.json";
            if(file_exists($routerJsonPath)){
                try{
                    $jsonState = (array) \HelperJSON::decode(file_get_contents($routerJsonPath), true, realpath($routerJsonPath));

                    $this->getBuffer()->setStateRouter(null, $jsonState);

                } catch(\Exception $e){
                    Console::error($e->getMessage());
                }
            }

        }

        /**
         * Inset game settings
         */
        if(!empty($data[self::DATA][self::GAME_SETTINGS]))
        {
            $this->getBuffer()->setGameSettings($data[self::DATA][self::GAME_SETTINGS]);
        }
        //print "====\n";print_r($data); print "====\n";
        foreach($data[self::DATA][self::FOLDERS] as $key => $folders)
        {
            $directory = $data[self::BASE_DIR] . "/" . $folders;

            $di = $this->finder->getDI($directory);

            $config = $this->finder->getConfig($di);

            if(null !== $config && !empty($config[self::TYPE])){

                $response = Fabric::getResult($config[self::TYPE], array(
                    self::DATA          =>  $config,
                    self::BASE_DIR      =>  $directory,
                    self::ALIAS         => !empty($data[self::ALIAS]) ? $data[self::ALIAS] : null,
                    self::TYPE_LOADING  => !empty($data[self::TYPE_LOADING]) ? $data[self::TYPE_LOADING] : null,
                    self::TYPE_PARTITION => !empty($data[self::TYPE_PARTITION]) ? $data[self::TYPE_PARTITION] : null,
                ));

                $results[$directory] = $response;
            }

        }

        return $results;
    }

} 