<?php
/**
 * Buffer data class
 * @author Antony Lavrenko
 */

namespace make\Cache;


use make\Cache\Connections\ComponentFinder;
use make\Cache\Connections\CssFinder;
use make\Cache\Connections\ImagesFinder;
use make\Cache\Connections\LibsFinder;
use make\Cache\Connections\StatesFinder;
use make\Cache\Console\Console;
use make\Types\SignalCombination;

class BufferCache {

    protected $data = array();

    const LIBS = 'l';
    const SCRIPT_FILE = 'sf';
    const SCRIPT_FOR_WEBPACK = "sw";
    const SCRIPT_EXTEND = 'se';
    const VIEWS_CON = 'vc';
    const VIEWS_FILE = 'vf';
    const CSS_FILE = 'cs';
    const TITLE = 't';
    const FRAME_SIZE = 'fs';
    const LOAD_START = 'sl';
    const LOAD_QUEUE = 'rs';
    const LIST_EVENTS_INST = 'li';
    const LIST_EVENTS_INST_PART = 'lv';
    const SCRIPT_QUEUE = 'sq';
    const IMAGES_QUEUE = 'iq';
    const AUDIO_QUEUE = 'aq';
    const AUDIO_SPRITE_QUEUE = 'ai';
    const GAME_SETTING = 'gs';
    const GAME_FRAME = 'gf';
    const TRANSLATIONS = 'tr';
    const TRANS_LANG = 'tl';
    const LIBS_NEED = 'ln';
    const AUDIO_SETTING = 'as';
    const AUDIO_SET_ALIAS = 'aa';
    const STATE_ROUTES = 'sr';
    const CLASS_INSTANCE = 'ci';
    const GAMES_PARTITIONS = 'gp';
    const LIST_PARTITIONS = 'lp';
    const LINK_NAMESPACES = 'ls';
    const COMPLETE_COMPONENTS = 'cc';
    const LINKS_COMPONENTS = 'lc';
    const LINK_PARTIAL_TREES = 'pt';

    protected $info = array(
        "l"  => "Библиотек",
        "sf" => "Файлов скриптов",
        "sw" => "Скриптов для WebPack",
        "se" => "Инициализованных скриптов",
        "vc" => "Контент шаблонов",
        "vf" => "Файлов шаблонов",
        "cs" => "Файлов стилей",
        "t"  => "Название игры",
        "sl" => "Прелоадер",
        "rs" => "Ресурсы компонентов",
        "li" => "Список Event классов для инициализации ивентов",
        "lv" => "Список Частей Event классов для инициализации ивентов",
        "sq" => "Количество скриптов в очереди загрузок",
        "iq" => "Количество изображений",
        "fs" => "Размер фрейма игры",
        "aq" => "Количество аудиозаписей",
        "ai" => "Количество спрайт аудиозаписей",
        "gs" => "Игровые настройки",
        "gf" => "Игровые фреймы",
        "tr" => "Алиасов переводов",
        "tl" => "Языков переводов",
        "ln" => "Разрешенно библиотек",
        "as" => "Настроек звука",
        "aa" => "Компонентов со звуками",
        "sr" => "Видов роутинга",
        "ci" => "Инстансов классов",
        "gp" => "Игровых разделений",
        "lp" => "Список разделов",
        "ls" => "Линков на неймспейсы",
        "cc" => "Расширено компонентов",
        "lc" => "Пролинкованых компонентов",
        "pt" => "Древо наследований"
    );

    const L_ALIAS = "alias";
    const L_NAME = "name";
    const L_INST = "instanceName";
    const L_PATH = "path";
    const L_MD5  = "md5";
    const L_GROUP  = "group";
    const L_SIZE = "sizeBytes";
    const L_TYPE = "type";
    const L_SIZE_W = "size";
    const L_TIME_L = "time";
    const L_PARTITION = "partition";
    const L_COMPLETE = "complete";

    const NAME_SCRIPT = "js";

    protected $typesLoading = array("preloader", "main", "overload");

    const TYPE_LOAD_PRELOAD = "preloader";
    const TYPE_LOAD_MAIN = "main";
    const TYPE_LOAD_OVER = "overload";

    const F_WIDTH = "width";
    const F_HEIGHT = "height";

    const PATH_REAL = "pr";
    const PATH_ABS = "pa";

    const F_NAME = "f_n";
    const F_PATH = "f_p";
    const F_JS_LIST = "f_j";

    const JS_MINIFY = "minified";

    const FILE_ALIAS = "fla";

    const GS_LANG = "language";
    const GL_DEF_LANG = "en";

    const PARTIAL_DEFAULT = "common";

    const STATE_ORDERS = "orders";
    const STATE_ROUTER = "router";
    const STATE_STATES = "s_s";
    const STATE_ADD_COMPONENT = "s_a_c";


    private $realPath;

    protected $maskEcmaScript = array(6=>".es6.",7=>".es7.");

    /**
     * Init buffer
     */
    public function __construct()
    {
        $this->realPath = realpath(__DIR__ . REAL_PATH);
    }

    /**
     * Get real path
     * @param $path
     * @return mixed
     */
    private function getPath($path)
    {
        return ".." . str_replace($this->realPath, "", realpath($path));
    }

    /**
     * Set name game
     * @param $name
     */
    public function setTitle($name)
    {
        $this->data[self::TITLE] = $name;
    }

    /**
     * Set Frame game size
     *
     * @param     $sizeData
     */
    public function setFrameSize($sizeData)
    {
        $this->data[self::FRAME_SIZE] = $sizeData;
    }

    /**
     * Set game settings
     * @param $data
     */
    public function setGameSettings($data)
    {
        if(empty($this->data[self::GAME_SETTING])){

            if(empty($data[self::GS_LANG])){
                $data[self::GS_LANG] = self::GL_DEF_LANG;
            }

            $this->data[self::GAME_SETTING] = $data;
        } else {
            foreach($data as $key => $value){
                $this->data[self::GAME_SETTING][$key] = $value;
            }
        }
    }

    /**
     * Set Css files for application
     * @param $name
     * @param $path
     * @param $main
     * @param $clone
     */
    public function setCss($name, $path, $main, $clone)
    {
        if(empty($this->data[self::CSS_FILE])){
            $this->data[self::CSS_FILE] = array();
        }

        if(array_search($path, $this->data[self::CSS_FILE]) === false){
            $this->data[self::CSS_FILE][] = array(
                self::L_NAME        =>  $name,
                self::PATH_ABS      =>  $this->getPath($path),
                self::L_PATH        =>  $path,
                CssFinder::C_MAIN   =>  $main,
                CssFinder::C_CLONE  =>  $clone
            );
        }

    }

    /**
     * Set images
     * @param $type
     * @param $aliasName
     * @param $path
     * @param $sizeBytes
     * @param $sizeWH
     * @param $lang
     * @param $partition
     * @param $alternative
     */
    public function setImages($type, $aliasName, $path, $sizeBytes, $sizeWH, $lang, $partition = "common", $alternative = null)
    {
        if(empty($this->data[self::IMAGES_QUEUE])){
            $this->data[self::IMAGES_QUEUE] = array();
        }

        if(empty($this->data[self::IMAGES_QUEUE][$type])){
            $this->data[self::IMAGES_QUEUE][$type] = array();
        }

        $aliasTypeName = $partition . "_" . $aliasName;

        if($lang == false){

            if(array_key_exists($aliasTypeName, $this->data[self::IMAGES_QUEUE][$type]) !== false){
               // Console::error(sprintf("Image \"%s\" has been already set to buffer", $aliasName));
            }

            $this->data[self::IMAGES_QUEUE][$type][$aliasTypeName] = array(
                self::L_ALIAS               => $aliasName,
                self::L_PATH                => $this->getPath($path),//$path,
                self::PATH_ABS              => $this->getPath($path),
                self::L_SIZE                => $sizeBytes,
                self::L_SIZE_W              => $sizeWH,
                self::L_TYPE                => NAME_IMG,
                self::L_PARTITION           => $partition,
                ImagesFinder::ALTERNATIVE   => $alternative
            );
        } else {

            if(empty($this->data[self::IMAGES_QUEUE][$type][$aliasTypeName])){

                $this->data[self::IMAGES_QUEUE][$type][$aliasTypeName] = array(
                    $lang   => array(
                        self::L_ALIAS               => $aliasName,
                        self::L_PATH                => $this->getPath($path),//$path,
                        self::PATH_ABS              => $this->getPath($path),
                        self::L_SIZE                => $sizeBytes,
                        self::L_SIZE_W              => $sizeWH,
                        self::L_TYPE                => NAME_IMG,
                        self::L_PARTITION           => $partition,
                        ImagesFinder::ALTERNATIVE   => $alternative
                    )
                );
            } else if(array_key_exists($lang, $this->data[self::IMAGES_QUEUE][$type][$aliasTypeName])){
               // Console::error(sprintf("Image \"%s\" has been already set to multilang buffer", $aliasName));

                $this->data[self::IMAGES_QUEUE][$type][$aliasTypeName][$lang] = array(
                    self::L_ALIAS               => $aliasName,
                    self::L_PATH                => $this->getPath($path),//$path,
                    self::PATH_ABS              => $this->getPath($path),
                    self::L_SIZE                => $sizeBytes,
                    self::L_SIZE_W              => $sizeWH,
                    self::L_TYPE                => NAME_IMG,
                    self::L_PARTITION           => $partition,
                    ImagesFinder::ALTERNATIVE   => $alternative
                );

            } else {
                $this->data[self::IMAGES_QUEUE][$type][$aliasTypeName][$lang] = array(
                    self::L_ALIAS               => $aliasName,
                    self::L_PATH                => $this->getPath($path),//$path,
                    self::PATH_ABS              => $this->getPath($path),
                    self::L_SIZE                => $sizeBytes,
                    self::L_SIZE_W              => $sizeWH,
                    self::L_TYPE                => NAME_IMG,
                    self::L_PARTITION           => $partition,
                    ImagesFinder::ALTERNATIVE   => $alternative
                );
            }
        }
    }

    /**
     * Set script to queue load
     * @param $typeLoading
     * @param $aliasName
     * @param $path
     * @param $sizeBytes
     * @param string $partition
     * @param $lang
     */
    public function setScriptToLoad($typeLoading, $aliasName, $path, $sizeBytes, $partition = "common", $lang = false)
    {

        if(empty($this->data[self::SCRIPT_QUEUE])){
            $this->data[self::SCRIPT_QUEUE] = array();
        }

        if(empty($this->data[self::SCRIPT_QUEUE][$typeLoading])){
            $this->data[self::SCRIPT_QUEUE][$typeLoading] = array();
        }

        if($lang === false){
            $this->data[self::SCRIPT_QUEUE][$typeLoading][$aliasName] = array(
                "a" =>  $aliasName,
                "u" =>  $this->getPath($path),
                "s" =>  $sizeBytes,
                "f" =>  self::NAME_SCRIPT,
                "p" =>  $partition
            );


        } else {

            if(empty($this->data[self::SCRIPT_QUEUE][$typeLoading][$aliasName][$lang])){
                $this->data[self::SCRIPT_QUEUE][$typeLoading][$aliasName][$lang] = array();
            }

            $this->data[self::SCRIPT_QUEUE][$typeLoading][$aliasName][$lang] = array(
                "a" =>  $aliasName,
                "u" =>  $this->getPath($path),
                "s" =>  $sizeBytes,
                "f" =>  self::NAME_SCRIPT,
                "p" =>  $partition
            );
        }
    }

    /**
     * Get list of queue scripts in front load
     * @return array
     */
    public function getScriptToLoad()
    {
        if(empty($this->data[self::SCRIPT_QUEUE])){
            return array();
        }

        return $this->data[self::SCRIPT_QUEUE];
    }

    /**
     * Set audio to buffer
     *
     * @param $type
     * @param $typeAudio
     * @param $aliasName
     * @param $path
     * @param $sizeBytes
     * @param $timeLength
     * @param $partition
     */
    public function setAudios($type, $typeAudio, $aliasName, $path, $sizeBytes, $timeLength, $partition)
    {
        if(empty($this->data[self::AUDIO_QUEUE])){
            $this->data[self::AUDIO_QUEUE] = array();
        }

        if(empty($this->data[self::AUDIO_QUEUE][$type])){
            $this->data[self::AUDIO_QUEUE][$type] = array();
        }

        if(empty($this->data[self::AUDIO_QUEUE][$type][$typeAudio])){
            $this->data[self::AUDIO_QUEUE][$type][$typeAudio] = array();
        }

        if(array_key_exists($aliasName, $this->data[self::AUDIO_QUEUE][$type][$typeAudio]) !== false){
            Console::error(sprintf("Audio \"%s\" has been already set to buffer", $aliasName));
        }

        $this->data[self::AUDIO_QUEUE][$type][$typeAudio][$aliasName] = array(
            self::L_PATH    =>  $this->getPath($path),//$path,
            self::PATH_ABS  =>  $this->getPath($path),
            self::L_SIZE    =>  $sizeBytes,
            self::L_TYPE    =>  "audio",
            self::L_TIME_L  =>  $timeLength,
            self::L_PARTITION => $partition
        );

    }

    /**
     * Set WAW audio for audio sprite generator
     * @param $typeLoading
     * @param $groupName
     * @param $aliasName
     * @param $path
     * @param $md5Hash
     */
    public function setWawAudioForSprite($typeLoading, $groupName, $aliasName, $path, $md5Hash)
    {
        if(empty($this->data[self::AUDIO_SPRITE_QUEUE])){
            $this->data[self::AUDIO_SPRITE_QUEUE] = array();
        }

        $nameSprite = sprintf("au_sp_%s_%s", $typeLoading, $groupName);

        if(empty($this->data[self::AUDIO_SPRITE_QUEUE][$nameSprite])){
            $this->data[self::AUDIO_SPRITE_QUEUE][$nameSprite] = array();
        }

        $this->data[self::AUDIO_SPRITE_QUEUE][$nameSprite][$aliasName] = array(
            self::L_PATH    =>  $path,
            self::L_TYPE    =>  $typeLoading,
            self::L_MD5     =>  $md5Hash,
            self::L_GROUP   =>  $groupName
        );
    }

    /**
     * Get WAW audio for sprite generation
     * @return array
     */
    public function getWawAudioForSprite()
    {
        if(empty($this->data[self::AUDIO_SPRITE_QUEUE])){
            return array();
        }

        return $this->data[self::AUDIO_SPRITE_QUEUE];
    }

    /**
     * Set Libs for application
     * @param $alias
     * @param $path
     * @param $mainLoad
     * @param $minify
     * @param $always
     */
    public function setLibs($alias, $path, $mainLoad, $minify, $always = false)
    {
        if(empty($this->data[self::LIBS])){
            $this->data[self::LIBS] = array();
        }

        if(array_search($path, $this->data[self::LIBS]) === false){
            $this->data[self::LIBS][] = array(
                self::FILE_ALIAS        =>  $alias,
                self::PATH_ABS          =>  $this->getPath($path),
                self::L_PATH            =>  $path,
                LibsFinder::L_MAIN      =>  $mainLoad,
                self::JS_MINIFY         =>  $minify,
                LibsFinder::ALWAYS      =>  $always
            );
        }
    }

    /**
     * Need libs
     * @param $list
     */
    public function setNeedLibs($list)
    {
        if(empty($this->data[self::LIBS_NEED])){
            $this->data[self::LIBS_NEED] = $list;
        } else {
            foreach ($list as $lib)
            {
                if(array_key_exists($lib, $this->data[self::LIBS_NEED]) == false){
                    $this->data[self::LIBS_NEED][] = $lib;
                }
            }
        }
    }

    /**
     * Scripts list
     *
     * @param $alias
     * @param $path
     * @param $className
     * @param $mainLoad
     */
    public function setScript($alias, $path, $className, $mainLoad)
    {
        if(empty($this->data[self::SCRIPT_FILE])){
            $this->data[self::SCRIPT_FILE] = array();
        }

        if(($type = $this->findScriptForWebPack($path)) !== false){
            $this->setScriptForWebPack($type, $alias, $path, $className);
            return ;
        }

        $classes = $this->getScriptFiles();

        if(empty($className) && array_key_exists($alias . ".js", $classes) === false){
            Console::error("Script \"{$path}\" can not set to Buffer");
        }


//        if(array_key_exists($className, $this->data[self::SCRIPT_FILE]) === false){
            $this->data[self::SCRIPT_FILE][$className] = array(
                self::FILE_ALIAS    => $alias,
                self::PATH_ABS      => $this->getPath($path),
                self::L_PATH        => $path,
                LibsFinder::L_MAIN  => $mainLoad
            );
  //      }
    }

    /**
     * Find script for webpack
     * @param $path
     * @return bool|int|string
     */
    public function findScriptForWebPack($path)
    {
        foreach($this->maskEcmaScript as $key => $mask){
            if(stripos($path, $mask) !== false){
                return $key;
            }
        }

        return false;
    }

    /**
     * Set script ty Buffer for WebPack manager
     * @param $type
     * @param $alias
     * @param $path
     * @param $className
     */
    public function setScriptForWebPack($type, $alias, $path, $className)
    {
        if(empty($this->data[self::SCRIPT_FOR_WEBPACK])){
            $this->data[self::SCRIPT_FOR_WEBPACK] = array();
        }

        if(empty($this->data[self::SCRIPT_FOR_WEBPACK][$type])){
            $this->data[self::SCRIPT_FOR_WEBPACK][$type] = array();
        }

        $this->data[self::SCRIPT_FOR_WEBPACK][$type][$className] = array(
            self::FILE_ALIAS    => $alias,
            self::PATH_ABS      => $this->getPath($path),
            self::L_PATH        => $path
        );
    }

    /**
     * Set script instance
     *
     * @param $name
     * @param $data
     * @param $priority
     * @param array|boolean $partition
     */
    public function setScriptInstance($name, $data, $priority, $partition = false)
    {
        if(empty($this->data[self::SCRIPT_EXTEND])){
            $this->data[self::SCRIPT_EXTEND] = array();
        }

        if(empty($this->data[self::SCRIPT_EXTEND][$priority])){
            $this->data[self::SCRIPT_EXTEND][$priority] = array();
        }

//        if(empty($data['instanceName'])){
//            return false;
//        }

        if($partition === false){

            if(array_key_exists($name, $this->data[self::SCRIPT_EXTEND][$priority]) === false) {
                $this->data[self::SCRIPT_EXTEND][$priority][$name] = $data;
            } elseif(!empty($data[COMP_INS_DATA])){

                $this->data[self::SCRIPT_EXTEND][$priority][$name][COMP_INS_DATA] = $data[COMP_INS_DATA];
            }

        } else {

            foreach ($partition as $part) {


                if(empty($this->data[self::SCRIPT_EXTEND][$priority][$name])){
                    $this->data[self::SCRIPT_EXTEND][$priority][$name] = array(
                        self::L_ALIAS => $data[self::L_ALIAS],
                        "extend"      => !empty($data["extend"]) ? $data["extend"] : false,
                        COMP_INS_DATA        => !empty($data[COMP_INS_DATA]) ? $data[COMP_INS_DATA] : array(
                            self::L_INST        => $data[self::L_INST],
                            self::L_ALIAS       => $data[self::L_ALIAS]
                        ),
                        self::L_INST  => !empty($data[self::L_INST]) ? $data[self::L_INST] : null
                    );
                }

                if(empty($this->data[self::SCRIPT_EXTEND][$priority][$name][self::L_PARTITION])){
                    $this->data[self::SCRIPT_EXTEND][$priority][$name][self::L_PARTITION] = array();
                }

                if(empty($this->data[self::SCRIPT_EXTEND][$priority][$name][self::L_PARTITION][$part])){
                    $this->data[self::SCRIPT_EXTEND][$priority][$name][self::L_PARTITION][$part] = array(
                        self::L_INST        => $data[self::L_INST],
                        COMP_INS_DATA              => !empty($data[COMP_INS_DATA]) ? $data[COMP_INS_DATA] : array(
                            self::L_INST        => $data[self::L_INST],
                            self::L_ALIAS       => $data[self::L_ALIAS]
                        ),
                        self::L_PARTITION   => $part
                    );
                } elseif(!empty($data[COMP_INS_DATA])) {
                    $this->data[self::SCRIPT_EXTEND][$priority][$name][self::L_PARTITION][$part][COMP_INS_DATA] = $data[COMP_INS_DATA];
                }
            }
        }
    }

    /**
     * Change script instance data
     * @param $priority
     * @param $name
     * @param array|boolean $partitions
     * @param null $instanceName
     * @param null $alias
     */
    public function setChangeScriptInstance($priority, $name, $partitions = false, $instanceName = null, $alias)
    {
        if(empty($this->data[self::SCRIPT_EXTEND])){
            $this->data[self::SCRIPT_EXTEND] = array();
        }

        if(empty($this->data[self::SCRIPT_EXTEND][$priority])){
            $this->data[self::SCRIPT_EXTEND][$priority] = array();
        }

        if(empty($this->data[self::SCRIPT_EXTEND][$priority][$name])){
            $this->data[self::SCRIPT_EXTEND][$priority][$name] = array();
        }

        if($partitions === false){
            $this->data[self::SCRIPT_EXTEND][$priority][$name][self::L_INST] = $instanceName;

        } else {

            foreach ($partitions as $part) {
                if(empty($this->data[self::SCRIPT_EXTEND][$priority][$name][self::L_PARTITION])){
                    $this->data[self::SCRIPT_EXTEND][$priority][$name][self::L_PARTITION] = array();
                }

                if(empty($this->data[self::SCRIPT_EXTEND][$priority][$name][self::L_PARTITION][$part])){
                    $this->data[self::SCRIPT_EXTEND][$priority][$name][self::L_PARTITION][$part] = array();
                }

                $this->data[self::SCRIPT_EXTEND][$priority][$name][self::L_PARTITION][$part][self::L_INST] = $instanceName;
                $this->data[self::SCRIPT_EXTEND][$priority][$name][self::L_PARTITION][$part][COMP_INS_DATA][self::L_INST] = $instanceName;
                $this->data[self::SCRIPT_EXTEND][$priority][$name][self::L_PARTITION][$part][COMP_INS_DATA][self::L_ALIAS] = $alias;
            }
        }
    }

    /**
     * Set instance name all classes in one namespace component
     * @param $className
     * @param $alias
     * @param array|boolean $partition
     * @param $instanceName
     */
    public function setLinkComponentClass($className, $alias, $partition, $instanceName)
    {
        if(empty($this->data[self::LINKS_COMPONENTS])){
            $this->data[self::LINKS_COMPONENTS] = array();
        }

        if(empty($this->data[self::LINKS_COMPONENTS][$alias])){
            $this->data[self::LINKS_COMPONENTS][$alias] = array();
        }

        if($partition === false){
            $partition = array(self::PARTIAL_DEFAULT);
        }

        foreach ($partition as $part) {

            if(empty($this->data[self::LINKS_COMPONENTS][$alias][$part])){
                $this->data[self::LINKS_COMPONENTS][$alias][$part] = array();
            }

            if($part != self::PARTIAL_DEFAULT && !empty($this->data[self::LINKS_COMPONENTS][$alias][self::PARTIAL_DEFAULT][$className])){
                //unset($this->data[self::LINKS_COMPONENTS][$alias][self::PARTIAL_DEFAULT][$className]);
            }

            $this->data[self::LINKS_COMPONENTS][$alias][$part][$className] = ComponentFinder::changeNameInstance($instanceName, $part);
        }

    }

    /**
     * Set class instance name
     * @param $classAlias
     * @param $nameInstance
     */
    public function setScriptNameInstance($classAlias, $nameInstance)
    {
        if(empty($this->data[self::CLASS_INSTANCE])){
            $this->data[self::CLASS_INSTANCE] = array();
        }

        $this->data[self::CLASS_INSTANCE][$classAlias] = $nameInstance;
    }

    /**
     * Complete version Class component
     * @param $nameClassTo
     * @param $nameClassFrom
     * @param $priority
     * @param array|boolean $partition
     */
    public function setScriptCompleteClass($nameClassTo, $nameClassFrom, $priority, $partition)
    {
        if(empty($this->data[self::COMPLETE_COMPONENTS])){
            $this->data[self::COMPLETE_COMPONENTS] = array();
        }

        if(empty($this->data[self::SCRIPT_EXTEND][$priority])){
            $this->data[self::SCRIPT_EXTEND][$priority] = array();
        }

        if(empty($this->data[self::SCRIPT_EXTEND][$priority][$nameClassTo])){
            $this->data[self::SCRIPT_EXTEND][$priority][$nameClassTo] = array();
        }

        if($partition === false){
            $this->data[self::SCRIPT_EXTEND][$priority][$nameClassTo][self::L_COMPLETE] = $nameClassFrom;
        } else {

            if(empty($this->data[self::SCRIPT_EXTEND][$priority][$nameClassTo][self::L_PARTITION])){
                $this->data[self::SCRIPT_EXTEND][$priority][$nameClassTo][self::L_PARTITION] = array();
            }

            foreach ($partition as $part) {

                if(empty($this->data[self::SCRIPT_EXTEND][$priority][$nameClassTo][self::L_PARTITION][$part])){
                    $this->data[self::SCRIPT_EXTEND][$priority][$nameClassTo][self::L_PARTITION][$part] = array();
                }

                $this->data[self::SCRIPT_EXTEND][$priority][$nameClassTo][self::L_PARTITION][$part][self::L_COMPLETE] = $nameClassFrom;
            }
        }
    }

    /**
     * Set namespace for cross linked
     * @param $className
     * @param $alias
     * @param array|boolean $partition
     * @param $instanceName
     */
    public function setNameSpaceInstanceClass($className, $alias, $partition = false, $instanceName)
    {
        if(empty($this->data[self::LINK_NAMESPACES])){
            $this->data[self::LINK_NAMESPACES] = array();
        }

        if($partition === false){
            $partition = array(self::PARTIAL_DEFAULT);
        }

        foreach ($partition as $part) {
            $this->data[self::LINK_NAMESPACES][$className . "_" . $alias . "_" . $part] = ComponentFinder::changeNameInstance($instanceName, $part);
        }
    }

    /**
     * Set Instance of all Event classes
     *
     * @param $name
     * @param $nameFile
     * @param $alias
     * @param array|boolean $partitions
     */
    public function setEventInstanceName($name, $nameFile, $alias, $partitions = false)
    {//print_r(array($name, $nameFile, $alias, $partitions));

        if(empty($this->data[self::LIST_EVENTS_INST])){
            $this->data[self::LIST_EVENTS_INST] = array();
        }

        if(empty($this->data[self::LIST_EVENTS_INST][$alias])){
            $this->data[self::LIST_EVENTS_INST][$alias] = array();
        }

        if(empty($this->data[self::LIST_EVENTS_INST][$alias][self::PARTIAL_DEFAULT])){
            $this->data[self::LIST_EVENTS_INST][$alias][self::PARTIAL_DEFAULT] = array();
        }




        if($partitions === false){
            $this->data[self::LIST_EVENTS_INST][$alias][self::PARTIAL_DEFAULT][$nameFile] = ComponentFinder::changeNameInstance($name, BufferCache::PARTIAL_DEFAULT);

        } else {

            foreach ($partitions as $part) {

                if(empty($this->data[self::LIST_EVENTS_INST][$alias][$part])){
                    $this->data[self::LIST_EVENTS_INST][$alias][$part] = array();
                }

                $this->data[self::LIST_EVENTS_INST][$alias][$part][$nameFile] = ComponentFinder::changeNameInstance($name, $part);
            }
        }

    }

    /**
     * Set data of templates for contents
     *
     * @param $alias
     * @param $data
     * @param $partitions
     */
    public function setViewContent($alias, $data, $partitions = false)
    {
        if(empty($this->data[self::VIEWS_CON])){
            $this->data[self::VIEWS_CON] = array();
        }

        if($partitions === false){
            $partitions = self::PARTIAL_DEFAULT;
        }

        if(array_key_exists($partitions . "_" . $alias, $this->data[self::VIEWS_CON]) === false){
            $this->data[self::VIEWS_CON][$partitions . "_" . $alias] = $data;
        }

    }

    /**
     * Set data of template for files
     *
     * @param $alias
     * @param $name
     * @param $path
     * @param $partitions
     */
    public function setViewFile($alias, $name, $path, $partitions = false)
    {
        if(empty($this->data[self::VIEWS_FILE])){
            $this->data[self::VIEWS_FILE] = array();
        }

        if($partitions === false){
            $partitions = self::PARTIAL_DEFAULT;
        }

        $id = $partitions . "_" . $alias . "_" . $name;

        if(array_key_exists($id, $this->data[self::VIEWS_FILE]) === false){
            $this->data[self::VIEWS_FILE][$id] = array(
                self::PATH_ABS => $this->getPath($path),
                self::L_PATH   => $path
            );
        }
    }

    /**
     * Set "preloader" to queue for start application
     *
     * @param $alias
     * @param $name
     * @param $initEventInstanceName
     * @param $partition
     * @throws \Exception
     */
    public function setStartPreLoader($alias, $name, $initEventInstanceName, $partition)
    {
        if(!empty($this->data[self::LOAD_START])){
            //throw new \Exception(sprintf("Preloader is already registered! Name preloader - %s", $this->data[self::LOAD_START][self::L_NAME]));
        }

        $this->data[self::LOAD_START] = array(
            self::L_ALIAS       => $alias,
            self::L_NAME        => $name,
            self::L_INST        => $initEventInstanceName,
            self::L_PARTITION   => $partition
        );
    }

    /**
     * Set frame in buffer
     *
     * @param $name
     * @param $data
     */
    public function setGameFrame($name, $data)
    {
        if(empty($this->data[self::GAME_FRAME])){
            $this->data[self::GAME_FRAME] = array();
        }

        if(array_key_exists($name, $this->data[self::GAME_FRAME]) === false){
            $this->data[self::GAME_FRAME][$name] = $data;
        }
    }

    /**
     * Set translation file for game
     *
     * @param $languages
     * @param $pathFile
     */
    public function setTranslationFile($languages, $pathFile)
    {
        if(!is_array($languages)){
            Console::error("Translations config languages was not set to config.json! Key - \"translation\" : {\"path\": \"translation.json\",\"languages\": [\"ru\", \"en\"]}");
        }

        $dir = dirname(__DIR__) . '/' . $pathFile;

        if(!file_exists($dir)){
            Console::error("Translation config \"{$dir}\" not found!");
        }

        $fileSet = file_get_contents($dir);

        $fileJSON = \HelperJSON::decode($fileSet, true, $dir);

        if(!is_array($fileJSON)){
            Console::error("Translation config can not be converted to Array, file has error! ");
        }

        if(empty($fileJSON["typeLoading"])){
            $fileJSON["typeLoading"] = "main";
        }

        if(!isset($fileJSON['data'])){
            Console::error("Translate file has not found main key of \"data\":{}! Must be that - Example: {'data':{'Spin':{'en':'Spin','ru':'Спин'}} ");
        }

        if(empty($this->data[self::TRANS_LANG])){
            $this->data[self::TRANS_LANG] = $languages;
        } else {
            foreach($languages as $l){
                if(in_array($l, $this->data[self::TRANS_LANG]) === false){
                    $this->data[self::TRANS_LANG][] = $l;
                }
            }
        }

        if(empty($this->data[self::TRANSLATIONS])){
            $this->data[self::TRANSLATIONS] = array();
        }

        foreach($fileJSON['data'] as $key => $value){

            if(!empty($value["aliases"])){

                foreach ($value["aliases"] as $alias) {
                    if($fileJSON["typeLoading"] == "preloader" && !empty($value["en"])){
                        $this->addAliasTranslation($alias, array("en"=>$value["en"]), "preloader");
                    }

                    $this->addAliasTranslation($alias, $value, "main");
                }
            }

            if($fileJSON["typeLoading"] == "preloader" && !empty($value["en"])){
                $this->addAliasTranslation($key, array("en"=>$value["en"]), "preloader");
            }

            $this->addAliasTranslation($key, $value, "main");
        }
    }

    /**
     * Add alias language
     * @param $alias
     * @param $configs
     * @param $typeLoading
     */
    protected function addAliasTranslation($alias, $configs, $typeLoading)
    {
        $key = strtolower($alias);

        if(empty($this->data[self::TRANSLATIONS][$typeLoading])){
            $this->data[self::TRANSLATIONS][$typeLoading] = array();
        }

        foreach($configs as $lang => $config){

            if(strlen($lang) > 2){
                continue;
            }

            if(empty($this->data[self::TRANSLATIONS][$typeLoading][$lang])){
                $this->data[self::TRANSLATIONS][$typeLoading][$lang] = array(
                    $key => $config
                );
            } else {
                if(array_key_exists($key, $this->data[self::TRANSLATIONS][$typeLoading][$lang]) !== false){
                    //Console::error("Duplicate keys \"". $key ."\" in translations file in " . $pathFile);
                }

                $this->data[self::TRANSLATIONS][$typeLoading][$lang][$key] = $config;
            }

        }
    }

    /**
     * Set to buffer audio configs with mergins
     * @param $baseDir
     * @param $config
     * @param $alias
     * @param $partition
     */
    public function setAudioConfig($baseDir, $config, $alias, $partition)
    {
        if(empty($this->data[self::AUDIO_SETTING])){
            $this->data[self::AUDIO_SETTING] = array();
        }

        if(empty($this->data[self::AUDIO_SET_ALIAS])){
            $this->data[self::AUDIO_SET_ALIAS] = array();
        }

        if(array_key_exists($alias, $this->data[self::AUDIO_SET_ALIAS]) === false){
            $this->data[self::AUDIO_SET_ALIAS][$alias] = $baseDir;
        }

        $this->data[self::AUDIO_SETTING] = \MergeArrays::arrayMergeRecursive($this->data[self::AUDIO_SETTING], $config);
    }

    /**
     * Set orders list of state
     * @param array $listOrders
     */
    public function setStateOrdersComponent($listOrders = array()){

        if(empty($this->data[self::STATE_ORDERS])){
            $this->data[self::STATE_ORDERS] = array();
        }

        $this->data[self::STATE_ORDERS][] = $listOrders;
    }

    /**
     * Set states components
     * @param $alias
     * @param $nameFile
     * @param $aliasState
     */
    public function setStateComponent($alias, $nameFile, $aliasState){

        if(empty($this->data[self::STATE_STATES])){
            $this->data[self::STATE_STATES] = array();
        }

        $this->data[self::STATE_STATES][$aliasState] = array(
            self::L_ALIAS   => $alias,
            self::L_NAME    => $nameFile
        );
    }

    /**
     * Set additional state components
     * @param $alias
     * @param $nameFile
     * @param $aliasState
     */
    public function setStateAdditionalComponent($alias, $nameFile, $aliasState){

        if(empty($this->data[self::STATE_ADD_COMPONENT])){
            $this->data[self::STATE_ADD_COMPONENT] = array();
        }

        $this->data[self::STATE_ADD_COMPONENT][$aliasState] = array(
            self::L_ALIAS   => $aliasState,
            self::L_NAME    => $nameFile
        );
    }

    /**
     * Set router of states
     * @param $nameFile
     */
    public function setRouterStateComponent($nameFile){

        if(empty($this->data[self::STATE_ROUTER])){
            $this->data[self::STATE_ROUTER] = array();
        }

        $this->data[self::STATE_ROUTER][] = $nameFile;
    }

    /**
     * Get state configs
     * @return array
     */
    public function getStateConfigs(){

        if(empty($this->data[self::STATE_ORDERS])){
            $this->data[self::STATE_ORDERS] = array();
        }

        if(empty($this->data[self::STATE_STATES])){
            $this->data[self::STATE_STATES] = array();
        }

        if(empty($this->data[self::STATE_ROUTER])){
            $this->data[self::STATE_ROUTER] = array();
        }

        return array(
            self::STATE_ORDERS          => $this->data[self::STATE_ORDERS],
            self::STATE_STATES          => $this->data[self::STATE_STATES],
            self::STATE_ROUTER          => $this->data[self::STATE_ROUTER],
            StatesFinder::S_COMPONENT   => $this->data[self::STATE_ADD_COMPONENT] ? $this->data[self::STATE_ADD_COMPONENT]: array()
        );
    }

    /**
     * Set data config of router game actions
     * @param $alias
     * @param $dataConfig
     * @param array|boolean $partition
     */
    public function setSignalRouter($alias, $dataConfig, $partition = false)
    {
        if(empty($this->data[self::STATE_ROUTES])){
            $this->data[self::STATE_ROUTES] = array();
        }

        /**
         * Common states
         */
        if($partition === false){

            if(empty($this->data[self::STATE_ROUTES][self::PARTIAL_DEFAULT])){
                $this->data[self::STATE_ROUTES][self::PARTIAL_DEFAULT] = $dataConfig;
            } else {

                $this->data[self::STATE_ROUTES][self::PARTIAL_DEFAULT][SignalCombination::LIST_SIGNALS] =
                    \MergeArrays::arrayMergeRecursive(
                        $this->data[self::STATE_ROUTES][self::PARTIAL_DEFAULT][SignalCombination::LIST_SIGNALS],
                        $dataConfig[SignalCombination::LIST_SIGNALS]
                    );
            }

        } else {

            /**
             * Partials states
             */

            foreach ($partition as $part) {

                if(empty($this->data[self::STATE_ROUTES][$part])){
                    $this->data[self::STATE_ROUTES][$part] = $dataConfig;
                } else {

                    $this->data[self::STATE_ROUTES][$part][SignalCombination::LIST_SIGNALS] =
                        \MergeArrays::arrayMergeRecursive(
                            $this->data[self::STATE_ROUTES][$part][SignalCombination::LIST_SIGNALS],
                            $dataConfig[SignalCombination::LIST_SIGNALS]
                        );

                }
            }

        }

    }

    /**
     * Set game instance conditions
     * @param $conditions
     */
    public function setGamesPartitionsConditions($conditions)
    {
        if(empty($this->data[self::GAMES_PARTITIONS])){
            $this->data[self::GAMES_PARTITIONS] = array();
        }

        $this->data[self::GAMES_PARTITIONS] = $conditions;
    }

    /**
     * Set to list partitions
     * @param $namePartition
     * @param $alias
     */
    public function setListPartitions($namePartition, $alias)
    {
        if($namePartition === null){
            $namePartition = array('common');
        }

        if(empty($this->data[self::LIST_PARTITIONS])){
            $this->data[self::LIST_PARTITIONS] = array();
        }

        if(in_array($alias, array_keys($this->data[self::LIST_PARTITIONS])) === false){
            $this->data[self::LIST_PARTITIONS][$alias] = $namePartition;
        } else {

            foreach ($namePartition as $partition) {

                if(in_array($partition, $this->data[self::LIST_PARTITIONS][$alias]) === false){
                    $this->data[self::LIST_PARTITIONS][$alias][] = $partition;
                }
            }
        }
    }


    /**
     * Get init application preloader
     *
     * @return bool
     */
    public function getStartPreloader()
    {
        if(empty($this->data[self::LOAD_START])){
            return false;
        }

        return $this->data[self::LOAD_START];
    }

    /**
     * Get list of instance Events classes for run
     * @param $alias
     * @return array
     */
    public function getEventInstancesByAlias($alias)
    {
        if(empty($this->data[self::LIST_EVENTS_INST])){
            return array();
        }

        if(empty($this->data[self::LIST_EVENTS_INST][$alias])){
            return false;
        }

        return $this->data[self::LIST_EVENTS_INST][$alias];
    }

    /**
     * Get list of instance Events classes for run
     * @param $part
     * @return array
     */
    public function getEventInstances($part)
    {
        if(empty($this->data[self::LIST_EVENTS_INST])){
            return array();
        }

        $list = array();

        foreach($this->data[self::LIST_EVENTS_INST] as $aliases => $dataAliases){
            foreach($dataAliases as $type => $components){

                if(empty($list[$type])){
                    $list[$type] = array();
                }

                $list[$type] = array_merge($list[$type], $components);
            }
        }

        //print_r(array($part, $list));

        $common = $list[self::PARTIAL_DEFAULT];
        $current = $list[$part];

        if(empty($common)){
            $common = array();
        }

        if(empty($current)){
            $current = array();
        }

        $merged = array_merge($common, $current);

        //print_r(array($part,",",$merged));

        return array_values($merged);
    }

    /**
     * Set to qieue of loading component resources
     *
     * @param $alias
     * @param $name
     * @param $typeLoading
     * @param $path
     * @throws \Exception
     */
    public function setToQueueLoader($alias, $name, $typeLoading, $path)
    {
        if(array_search($typeLoading, $this->typesLoading) === false){
            throw new \Exception(sprintf("Type of loading must be \"%s\" for add to buffer", implode(", ", $this->typesLoading)));
        }

        if(empty($this->data[self::LOAD_QUEUE])){
            $this->data[self::LOAD_QUEUE] = array();
        }

        if(empty($this->data[self::LOAD_QUEUE][$typeLoading])){
            $this->data[self::LOAD_QUEUE][$typeLoading] = array();
        }

        if(self::TYPE_LOAD_OVER != $typeLoading){

            if(!array_key_exists($name, $this->data[self::LOAD_QUEUE][$typeLoading]) === false){
                $this->data[self::LOAD_QUEUE][$typeLoading][$name] = array(
                    self::L_ALIAS   =>  $alias,
                    self::L_NAME    =>  $name,
                    self::L_PATH    =>  $this->getPath($path),//$path,
                    self::PATH_ABS  =>  $this->getPath($path)
                );
            }

        } else {

            if(empty($this->data[self::LOAD_QUEUE][self::TYPE_LOAD_OVER][$alias])){
                $this->data[self::LOAD_QUEUE][self::TYPE_LOAD_OVER][$alias] = array();
            }

            if(!array_key_exists($name, $this->data[self::LOAD_QUEUE][self::TYPE_LOAD_OVER][$alias]) === false){
                $this->data[self::LOAD_QUEUE][self::TYPE_LOAD_OVER][$alias] = array(
                    self::L_ALIAS   =>  $alias,
                    self::L_NAME    =>  $name,
                    self::L_PATH    =>  $this->getPath($path),//$path,
                    self::PATH_ABS  =>  $this->getPath($path)
                );
            }
        }

    }

    /**
     * Get game title
     *
     * @return string
     */
    public function getTitle()
    {
        if(empty($this->data[self::TITLE])){
            return "Game ...";
        }

        return $this->data[self::TITLE];
    }

    /**
     * Get Css list
     *
     * @return array
     */
    public function getCss()
    {
        if(empty($this->data[self::CSS_FILE])){
            return array();
        }

        return $this->data[self::CSS_FILE];
    }

    /**
     * Get Images list of QUEUE
     *
     * @return array
     */
    public function getImages()
    {
        if(empty($this->data[self::IMAGES_QUEUE])){
            return array();
        }

        return $this->data[self::IMAGES_QUEUE];
    }

    /**
     * Get libs list
     *
     * @return array
     */
    public function getLibs()
    {
        if(empty($this->data[self::LIBS])){
            return array();
        }

        return $this->data[self::LIBS];
    }

    /**
     * Get list access libs for compiler
     *
     * @return bool|array
     */
    public function getNeedLibs()
    {
        if(empty($this->data[self::LIBS_NEED])){
            return false;
        }

        return $this->data[self::LIBS_NEED];
    }

    /**
     * Get game settings
     * @return array
     */
    public function getGameSettings ()
    {
        if(empty($this->data[self::GAME_SETTING])){
            return array();
        }

        return $this->data[self::GAME_SETTING];
    }

    /**
     * Get game setting by name
     * @param $name
     * @return null
     */
    public function getGameSetting($name)
    {
        if(empty($this->data[self::GAME_SETTING]) || empty($this->data[self::GAME_SETTING][$name]) ){
            return null;
        }

        return $this->data[self::GAME_SETTING][$name];
    }

    /**
     * Set game instance conditions
     * @return bool
     */
    public function getInstanceGamesConditions()
    {
        if(empty($this->data[self::GAME_SETTING])){
            return false;
        }

        return $this->data[self::GAME_SETTING];
    }

    /**
     * Get script files list
     *
     * @return array
     */
    public function getScriptFiles()
    {
        if(empty($this->data[self::SCRIPT_FILE])){
            return array();
        }

        \FindClass::check();

        return $this->data[self::SCRIPT_FILE];
    }

    /**
     * Is exist script name for webpack
     * @param null $className
     * @return bool
     */
    public function existScriptInWebPack($className = null)
    {
        foreach ($this->getScriptForWebPack() as $version => $listVersion) {

            foreach ($listVersion as $filename => $values) {

                if($values[self::FILE_ALIAS] == $className){
                    return true;
                }
            }
         }

        return false;
    }

    /**
     * Get scripts for webpack with keys by versions {6,7}
     * @return array
     */
    public function getScriptForWebPack()
    {
        if(empty($this->data[self::SCRIPT_FOR_WEBPACK])){
            return array();
        }

        return $this->data[self::SCRIPT_FOR_WEBPACK];
    }

    /**
     * Get script extends list
     *
     * @return array
     */
    public function getScriptExtends()
    {
        if(empty($this->data[self::SCRIPT_EXTEND])){
            return array();
        }

        ksort($this->data[self::SCRIPT_EXTEND]);

        return $this->data[self::SCRIPT_EXTEND];

        /**$list = array();

        foreach($this->data[self::SCRIPT_EXTEND] as $values){
            foreach($values as $key => $value){
                $list[$key] = $value;
            }

        }

        return $list;*/
    }

    /**
     * Get script complete class for components
     * @param $nameClassComponent
     * @return null
     */
    public function getScriptCompleteClass($nameClassComponent)
    {
        if(empty($this->data[self::COMPLETE_COMPONENTS]) || empty($this->data[self::COMPLETE_COMPONENTS][$nameClassComponent])){
            return null;
        }

        \FindClass::check();

        return $this->data[self::COMPLETE_COMPONENTS][$nameClassComponent];
    }

    /**
     * Set class instance name
     * @param $classAlias
     * @return null
     */
    public function getScriptNameInstance($classAlias)
    {
        if(empty($this->data[self::CLASS_INSTANCE]) || empty($this->data[self::CLASS_INSTANCE][$classAlias])){
            return null;
        }

        return $this->data[self::CLASS_INSTANCE][$classAlias];
    }

    /**
     * Get instance link of component use partials
     * @param $classAlias
     * @param null $partial
     * @return null
     */
    public function getSortLinkComponent($classAlias, $partial = null)
    {
        if($partial === null){
            $partial = self::PARTIAL_DEFAULT;
        }

        $list = array();

        foreach ($this->data[self::LINKS_COMPONENTS] as $items) {

            foreach ($items as $part => $elements) {
                if(empty($list[$part])){
                    $list[$part] = array();
                }

                $list[$part] = array_merge($list[$part], $elements);
            }
        }

        if(empty($list[$partial])){
            return null;
        }

        if(!empty($list[$partial][$classAlias])){
            return $list[$partial][$classAlias];
        } else if(!empty($list[self::PARTIAL_DEFAULT][$classAlias])){
            return $list[self::PARTIAL_DEFAULT][$classAlias];
        }

        return $this->getScriptNameInstance($classAlias);
    }

    /**
     * Get Link components for Classes
     * @param $alias
     * @param $part
     * @return array
     */
    public function getLinkComponentClass($alias, $part)
    {
        if(empty($this->data[self::LINKS_COMPONENTS])){
            return array();
        }

        if(empty($this->data[self::LINKS_COMPONENTS][$alias])){
            return array();
        }

        $list = $this->data[self::LINKS_COMPONENTS][$alias];

        if(empty($list[BufferCache::PARTIAL_DEFAULT])){
            $list[BufferCache::PARTIAL_DEFAULT] = array();
        }

        if(count($list) == 1){
            return $list[BufferCache::PARTIAL_DEFAULT];
        }

        if($part == BufferCache::PARTIAL_DEFAULT){
            return $list[BufferCache::PARTIAL_DEFAULT];
        }

        $mainList = $list;
        unset ($mainList[BufferCache::PARTIAL_DEFAULT]);

        $newList = $list[BufferCache::PARTIAL_DEFAULT];

        if(!empty($mainList[$part])){
            $newList = array_merge($list[BufferCache::PARTIAL_DEFAULT], $mainList[$part]);
        }

        \FindClass::check();
        //print_r(array($part, $newList));
        return $newList;
    }

    public function isCreateInstanceClass($alias, $className, $instanceName)
    {
        //$data = $this->
    }

    /**
     * Get namespaces for cross linked
     * @return array
     */
    public function getNameSpaceInstanceClass()
    {
        if(empty($this->data[self::LINK_NAMESPACES])){
            return array();
        }

        return $this->data[self::LINK_NAMESPACES];
    }

    /**
     * Get last instance name of current class
     * @param $className
     * @param $alias
     * @param $part
     * @param $oldNameInstance
     * @return mixed
     */
    public function getNameSpaceClassInstanceName($className, $alias, $part, $oldNameInstance){

        $list = $this->getNameSpaceInstanceClass();

        $name = "{$className}_{$alias}_{$part}";
        if(empty($list) || empty($list[$name])){
            return $oldNameInstance;
        }

        return $list[$name];
    }

    /**
     * Find file by alias
     *
     * @param $alias
     * @return null|array
     */
    public function findScriptFile($alias)
    {
        $scripts = $this->getScriptFiles();

        foreach($scripts as $data){

            if($data[self::FILE_ALIAS] == $alias){
                return $data;
            }
        }

        $libs = $this->getLibs();

        \FindClass::check();

        foreach($libs as $data){

            if($data[self::FILE_ALIAS] == $alias){
                return $data;
            }
        }

        return null;
    }

    /**
     * Get View Contents list
     *
     * @return array
     */
    public function getViewContents()
    {
        if(empty($this->data[self::VIEWS_CON])){
            return array();
        }

        \FindClass::check();

        return $this->data[self::VIEWS_CON];
    }

    /**
     * Get View Files list
     *
     * @return array
     */
    public function getViewFiles()
    {
        if(empty($this->data[self::VIEWS_FILE])){
            return array();
        }

        return $this->data[self::VIEWS_FILE];
    }

    /**
     * Get audio array
     * @return array
     */
    public function getAudio()
    {
        if(empty($this->data[self::AUDIO_QUEUE])){
            return array();
        }

        return $this->data[self::AUDIO_QUEUE];
    }

    /**
     * Get full list of MP3 Audio's
     *
     * @return array|mixed
     */
    public function getMp3AudioList()
    {
        $list = $this->getAudio(); $newList = array();

        foreach($list as $queue){
            if(array_key_exists("mp3", $queue)){
                $newList = \MergeArrays::arrayMergeRecursive($newList, $queue["mp3"]);
            }
        }

        return $newList;
    }

    /**
     * Get list game frames
     * @return array
     */
    public function getFrames()
    {
        if(empty($this->data[self::GAME_FRAME])){
            return array();
        }

        \FindClass::check();

        return $this->data[self::GAME_FRAME];
    }

    /**
     * Get list of translations for game
     *
     * @return array
     */
    public function getTranslation()
    {
        if(empty($this->data[self::TRANSLATIONS])){
            return array();
        }

        return $this->data[self::TRANSLATIONS];
    }

    /**
     * Get audio config
     */
    public function getAudioConfig()
    {
        if (empty($this->data[self::AUDIO_SETTING])) {
            $this->data[self::AUDIO_SETTING] = array();
        }

        return $this->data[self::AUDIO_SETTING];
    }

    /**
     * Get list aliases for audio
     *
     * @return mixed
     */
    public function getAudioConfigAliases()
    {
        if(empty($this->data[self::AUDIO_SET_ALIAS])){
            $this->data[self::AUDIO_SET_ALIAS] = array();
        }

        return $this->data[self::AUDIO_SET_ALIAS];
    }

    /**
     * Get state router with partial combinations
     * @return array
     */
    public function getSignalRouter()
    {
        if(empty($this->data[self::STATE_ROUTES])){
            return array();
        }

        $listPartials = $this->getGamesPartitionsConditions();

        if($listPartials === false){

            $_list = new SignalCombination($this->data[self::STATE_ROUTES][self::PARTIAL_DEFAULT], $this);
            return array(self::PARTIAL_DEFAULT  =>  $_list->execute());
        }

        $listPartials = array_map(function($value){
            return $value["exec"][0];
        }, $listPartials);

        $combineStates = array();

        $commonStates = $this->data[self::STATE_ROUTES][self::PARTIAL_DEFAULT];

        if(empty($commonStates)){
            $commonStates = array();
        }

        foreach($listPartials as $partial){
            $partialStates = $this->data[self::STATE_ROUTES][$partial];

            if(empty($partialStates)){
                $partialStates = array();
            }

            $combination = new SignalCombination(\MergeArrays::arrayMergeRecursive($commonStates, $partialStates), $this, $partial);
            $combineStates[$partial] = $combination->execute();
        }

        return $combineStates;
    }

    /**
     * Set game instance conditions
     * @return bool|array
     */
    public function getGamesPartitionsConditions()
    {
        if(empty($this->data[self::GAMES_PARTITIONS])){
            return false;
        }

        return $this->data[self::GAMES_PARTITIONS];
    }

    /**
     * Get list partitions
     * @return bool
     */
    public function getListPartitions()
    {
        if(empty($this->data[self::LIST_PARTITIONS])){
            return false;
        }

        return $this->data[self::LIST_PARTITIONS];
    }


    /**
     * Info data
     */
    public function info()
    {
        foreach($this->data as $k=>$l){

            if($k == self::IMAGES_QUEUE || $k == self::AUDIO_QUEUE || $k == self::SCRIPT_FOR_WEBPACK){
                $c = 0;

                foreach($l as $p){
                    $c += count($p);
                }

            } else if($k == self::TRANSLATIONS) {

                foreach($l as $lang=>$p){
                    Console::write(" -- Добавленно в обработку: LANG :\"" . $lang . "\"(" . count($p) . ") елементов", Console::SUCCESS);
                }

            } else {
                $c = count($l);
            }

            if($k != self::TRANSLATIONS){
                Console::write(" -- Добавленно в обработку: \"" . $this->info[$k] . "\": " . $c . " елементов", Console::SUCCESS);
            }
        }
    }

    /**
     * Get Class CONST
     * @param $const
     * @return mixed
     */
    private function getConst($const){
        \FindClass::check();
        return constant(sprintf('%s::%s', get_class($this), $const));
    }

    /**
     * Get const Data
     *
     * @param $name
     * @return mixed
     */
    public function getConstData($name)
    {
        $const = $this->getConst($name);

        if(empty($const))
        {
            return $name;
        }

        if(empty($this->data[$const])){
            return null;
        }

        return $this->data[$const];
    }

    /**
     * Debug
     */
    public function debug()
    {
        print_r($this->data);
    }
} 
