<?php
/**
 * Make cache class
 * @author Antony Lavrenko
 */

namespace make\Cache;

use make\Cache\Connections\FolderFinder;
use make\Cache\Console\Console;
use make\Cache\CreateCache\CreateInterface;
use make\Cache\CreateCache\CreateDevCache;
use make\Cache\CreateCache\CreateProdCache;
use make\Cache\Fabric\Fabric;
use make\Finder\Finder;

class MakeCache {

    const MODE_DEV = "dev";
    const MODE_TEST = "test";
    const MODE_PROD = "prod";

    public static $mode = "dev";

    protected $config = null;

    protected $baseDir = "../../../";
    protected $cacheFolder = "../../app";

    /**
     * @var BufferCache
     */
    public $buffer = null;

    /**
     * @var $finder Finder
     */
    protected $finder = null;

    public function __construct()
    {
        $this->finder = new Finder();
    }

    /**
     * Set console arguments
     *
     * @param $args
     * @throws \Exception
     */
    public function setArguments($args)
    {
        if(array_search('help', $args) !== false || array_search('--help', $args) !== false){
            $this->consoleHelp();

            return;
        }

        if(array_search('--' . self::MODE_DEV, $args) !== false){
            self::$mode = self::MODE_DEV;

            $this->make();

            return;
        }

        if(array_search('--' . self::MODE_PROD, $args) !== false){
            self::$mode = self::MODE_PROD;

            $this->make();

            return;
        }

        if(array_search('--' . self::MODE_TEST, $args) !== false){
            self::$mode = self::MODE_TEST;

            $this->make();

            return;
        }

        Console::write('ERROR: Choose mode "--dev" or "--prod" or "--test" ', Console::FAILURE);
    }

    /**
     * Console Help
     */
    protected function consoleHelp()
    {
        Console::write("Console arguments:", Console::WARNING);
        Console::write("  --dev: Dev mode application with symlink for all resources files", Console::WARNING);
        Console::write("  --test: Prod mode application with squeeze all scripts and styles and include View on Page client and Shifter", Console::WARNING);
        Console::write("  --prod: Prod mode application with squeeze all scripts and styles and include View on Page client", Console::WARNING);
    }

    /**
     * Set buffer Cache
     *
     * @param BufferCache $bufferCache
     */
    public function setBuffer(BufferCache $bufferCache)
    {
        $this->buffer = $bufferCache;
    }

    /**
     * Save all structures data to cache
     */
    public function save()
    {
        /**
         * @var $save CreateInterface
         */
        $save = null;

        if(self::$mode == self::MODE_DEV){
            $save = new CreateDevCache($this->buffer);
            $save->generate();
        }

        if(self::$mode == self::MODE_PROD){
            $save = new CreateProdCache($this->buffer);
            $save->generate();
        }

        if(self::$mode == self::MODE_TEST){
            $save = new CreateProdCache($this->buffer);
            $save->generate();
        }
    }

    /**
     * Get base config
     * @return array|mixed|null
     */
    protected function getConfig()
    {
        if(null !== $this->config){
            return $this->config;
        }

        $di = $this->finder->getDI($this->baseDir);
        return $this->config = $this->finder->getConfig($di);
    }

    public function make()
    {
        if(!is_dir(dirname(__DIR__) . "/../../../dist")){
            Finder::createDir(dirname(__DIR__) . "../../../../assets/");
            Finder::createDir(dirname(__DIR__) . "../../../../dist/");
        }

        if(!is_dir(dirname(__DIR__) . "/../../../app")){
            Finder::createDir(dirname(__DIR__) . "../../../../app/");
        }

        /**
         * Clear Cache Folder
         */
        $this->clearCache();

        $config = $this->getConfig();

        if(empty($config)){
            Console::error("File config.json not found in base directories!", 404);
        }

        /**
         * Set title of Game
         */
        if(!empty($config['title'])){
            $this->buffer->setTitle($config['title']);
        }

        if(empty($config['folders'])){
            Console::error("File config.json not have a directory list for scan of components cache!", 404);
        }

        if(empty($config['type'])){
            Console::error("File config.json not have type handler!", 404);
        }

        Fabric::setFinder($this->finder);
        Fabric::setBuffer($this->buffer);

        Fabric::getResult($config['type'], array(
            FolderFinder::DATA      =>  $config,
            FolderFinder::BASE_DIR  =>  "../../.."
        ));

//
//        if(false === $this->buffer->getStartPreloader()){
//            Console::error("Preloader for application NOT FOUND!");
//        }

        $this->save();
    }

    protected function clearCache()
    {
        if(self::$mode == self::MODE_DEV){
            $this->finder->clearFolder("../../../app");
        } else {
            $this->finder->clearFolder("../../../dist");
        }

    }

} 