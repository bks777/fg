<?php
/**
 * Interface for component make finder cache
 * @author Antony Lavrenko
 */

namespace make\Cache\Interfaces;

use make\Cache\BufferCache;
use make\Finder\Finder;
use DirectoryIterator;

class FindConnectionsInterface implements InterfaceCache{

    const DATA = 'data';
    const NAME = 'name';
    const BASE_DIR = 'base_dir';
    const FOLDERS = 'folders';
    const CLASSES = 'classes';
    const FILES = 'files';
    const TYPE = 'type';
    const PATH = 'path';
    const INST_NAME = 'instanceName';
    const CONTROLLERS = 'controllers';
    const EVENTS = 'events';
    const VIEWS = 'views';
    const ALIAS = 'alias';
    const LIBS = 'libs';
    const VIEW_HANDLE = 'viewHandlers';
    const COMPLETE_CLASS = 'complete';
    const CSS = "css";
    const RESOURCES = "resources";
    const REQUIRED = "required";
    const IMAGES = "images";
    const AUDIO = "audio";
    const FRAME_SIZE = "frameSize";
    const GAME_SETTINGS = "gameSettings";

    const GAME_SETTING_EMULATION = "protocolEmulator";

    const GAME_PARTITIONS = "gamePartitions";
    const TYPE_PARTITION = "partition";
    const CONDITIONS = "conditions";

    const AUDIO_SETTING = "audio";

    const COMPILE_SETTINGS = "compile";
    const COMP_LIBS = "libs";

    const TYPE_LOADING = "typeLoading";

    public $typesLoading = array("preloader", "main", "overload");

    const LOADING_PRELOADER = "preloader";
    const LOADING_MAIN = "main";
    const LOADING_OVERLOAD = "overload";

    const AUDIO_SIZE = 'audio_size';

    const TRANSLATIONS = 'translations';

    const ONLY_DEV = 'onlyTestDev';
    const HAS_INIT = 'init';

    const ROUTER_DATA = "routes";
    const STATES = "states";
    const SIGNALS = "signals";
    const REDUCERS = "reducers";
    const SIGNALS_PARENT = "parent";

    const ORDERS = "orders";

    const ROUTERS = "routers";

    /**
     * @var Finder
     */
    protected $finder = null;
    protected $folderDi = null;

    /**
     * @var BufferCache
     */
    protected $buffer = null;

    /**
     * @param Finder $finder
     * @return mixed|void
     */
    final function setFinder(Finder $finder)
    {
        $this->finder = $finder;
    }

    /**
     * Set Buffer instance
     *
     * @param BufferCache $bufferCache
     * @return mixed|void
     */
    final function setBuffer(BufferCache $bufferCache)
    {
        $this->buffer = $bufferCache;
    }

    /**
     * Get instance of Buffer Cache
     * @return BufferCache
     */
    final function getBuffer()
    {
        return $this->buffer;
    }

    /**
     * Set folder
     *
     * @param $path
     */
    final function setFolder($path)
    {
        $this->folderDi = $this->finder->getDI($path);
    }

    /**
     * Get folder DI
     * @return DirectoryIterator
     */
    final function getFolder()
    {
        return $this->folderDi;
    }

    /**
     * Get auth data
     * @return mixed|string
     */
    final static function getAuth()
    {
        return base64_decode(_gl_e());
    }

    public function execute($data = null){

    }
} 