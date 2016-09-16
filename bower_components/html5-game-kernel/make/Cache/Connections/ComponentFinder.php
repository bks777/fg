<?php
/**
 * Components Finder Class
 * @author Antony Lavrenko
 */

namespace make\Cache\Connections;

use make\Cache\BufferCache;
use make\Cache\Fabric\Fabric;
use make\Cache\Interfaces\FindConnectionsInterface;
use make\Cache\Console\Console;
use make\Cache\MakeCache;
use make\Finder\Finder;

class ComponentFinder extends FindConnectionsInterface
{
    const CLASS_ABSTRACT = "abstract";

    protected $preFix = "\$_";
    protected $prefixController = "_c_";
    protected $prefixEvents = "_e_";
    protected $prefixView = "_v_";
    protected $prefixHandler = "_h_";

    protected $content = array();

    protected $controllers = null;
    protected $events = null;
    protected $viewHandlers = null;

    protected $typeLoading = null;
    protected $nameComponent = null;

    protected $alias = null;
    protected $partitionDefault = array('common');
    protected $partitionChange = false;
    protected $partition = null;

    public static $lastAliasComponent = "";

    public function execute($data = null)
    {
        $this->content = $content = $data[self::DATA];

        $this->alias = self::$lastAliasComponent = $alias = $content[self::ALIAS];

        if(!empty($content[self::TYPE_PARTITION])){

            $this->partition = $content[self::TYPE_PARTITION];

            if(!is_array($this->partition)){
                $this->partition = array($this->partition);
            }

            $this->partitionChange = true;

        } else {
            $this->partition = $this->partitionDefault;
            $this->partitionChange = false;
        }

        $this->getBuffer()->setListPartitions($this->partition, $this->alias);

        $this->controllers = null;
        $this->events = null;
        $this->viewHandlers = null;

        $this->getNameComponent($content);
        $this->getTypeLoading($content);

        if(!empty($content[self::CONTROLLERS])){
            $this->controllers = $this->getControllers($content[self::CONTROLLERS], $alias);
        }

        /*if(empty($content[self::EVENTS])){print_r($this->getBuffer()->getScriptExtends());die;
            Console::error(sprintf('Component %s must have a Events classes!', $this->nameComponent));
        }*/

        if(!empty($content[self::EVENTS])) {
            $this->events = $this->getEvents($content[self::EVENTS], $alias);
        }

        if(!empty($content[self::VIEW_HANDLE])){
            $this->viewHandlers = $this->getViewHandlers($content[self::VIEW_HANDLE], $alias);
        }

        if(!empty($content[self::CONTROLLERS])) {
            $this->setControllers($content[self::CONTROLLERS], $data[self::BASE_DIR], $alias);
        }

        if(!empty($content[self::EVENTS])) {
            $this->setEvents($content[self::EVENTS], $data[self::BASE_DIR], $alias);
        } elseif($this->partitionChange === true){

            $events = $this->getBuffer()->getEventInstancesByAlias($alias);

            if(empty($events[BufferCache::PARTIAL_DEFAULT])){
                $events[BufferCache::PARTIAL_DEFAULT] = array();
            }

            foreach ($events[BufferCache::PARTIAL_DEFAULT] as $nameFile => $inv) {
                $this->events[$nameFile] = $this->getNameInstance($nameFile, COMP_TYPES_E, $alias);
                $this->getBuffer()->setEventInstanceName($this->events[$nameFile], $nameFile, $alias, $this->getPartialAlias());

                //TODO @Resolved

                $this->getBuffer()->setChangeScriptInstance(3, $nameFile, $this->getPartialAlias(), $this->events[$nameFile], $alias);
                $this->getBuffer()->setLinkComponentClass($nameFile, $alias, $this->getPartialAlias(), $this->events[$nameFile]);
                $this->getBuffer()->setNameSpaceInstanceClass($nameFile, $alias, $this->getPartialAlias(), $this->events[$nameFile]);
            }

        }

        $this->setStartPreLoader();

        if(!empty($content[self::VIEW_HANDLE])) {
            $this->setViewHandlers($content[self::VIEW_HANDLE], $data[self::BASE_DIR], $alias);
        }

        if(!empty($content[self::REQUIRED])){
            $this->setRequired($content[self::REQUIRED], $data[self::BASE_DIR]);
        }

        if(!empty($content[self::VIEWS])){
            $this->setViews($content[self::VIEWS]['list'], $content[self::VIEWS]['format'], $data[self::BASE_DIR], $alias);
        }

        if(!empty($content[self::RESOURCES])){
            $this->setResources($content[self::RESOURCES][self::FOLDERS], $data[self::BASE_DIR], $alias);
        }

        if(!empty($content[self::TRANSLATIONS]) && $content[self::TRANSLATIONS] === true){
            $this->setTranslations($data[self::BASE_DIR], $alias);
        }

        if(!empty($content[self::SIGNALS]) && $content[self::SIGNALS] === true){
            $this->setSignals($data[self::BASE_DIR], $alias);
        }

        if(!empty($content[self::STATES]) && $content[self::STATES] === true){
            $this->setStates($data[self::BASE_DIR], $alias);
        }

        if(!empty($content[self::AUDIO_SETTING])){
            $this->setAudioSettings($data[self::BASE_DIR], $content[self::AUDIO_SETTING], $alias);
        }
    }

    /**
     * Get name of component
     *
     * @param $content
     * @throws \Exception
     */
    protected function getNameComponent($content)
    {
        if(!array_key_exists(self::NAME, $content) || empty($content[self::NAME])){
            Console::error(sprintf('undefined key "%s" in component config.json! Component must have a name!', self::NAME), 404);
        }

        $this->nameComponent = $content[self::NAME];
    }

    /**
     * Get type of loading component
     *
     * @param $content
     * @throws \Exception
     */
    protected function getTypeLoading($content)
    {
        if(!array_key_exists(self::TYPE_LOADING, $content) || empty($content[self::TYPE_LOADING])){
            Console::error(sprintf('undefined key "%s" in component config.json! Can be exist and not empty!', self::TYPE_LOADING), 404);
        }

        if(array_search($content[self::TYPE_LOADING], $this->typesLoading) === false){
            Console::error(sprintf("Type of loading must be \"%s\" in component \"%s\"", implode(", ", $this->typesLoading), $this->nameComponent));
        }

        $this->typeLoading = $content[self::TYPE_LOADING];
    }

    /**
     *  Set start preloader init
     *
     * @throws \Exception
     */
    protected function setStartPreLoader()
    {
        if(empty($this->content[self::EVENTS])){
            return null;
        }

        if($this->typeLoading == self::LOADING_PRELOADER)
        {
            if(array_key_exists(ucfirst($this->alias) . "InitEvent", $this->content[self::EVENTS]) === false){
                Console::error(sprintf("Component \"%s\" must have \"%sInitEvent\" class! They used for start application!", $this->nameComponent, $this->alias));
            }

            $this->getBuffer()->setStartPreLoader($this->content[self::ALIAS], $this->content[self::NAME], $this->events[ucfirst($this->alias) . "InitEvent"], $this->partition);
        }
    }

    /**
     * Get names
     *
     * @param $nameFile
     * @param $type
     * @param $alias
     * @return string
     */
    protected function getNameInstance($nameFile, $type, $alias)
    {
        $last = stripos($nameFile, $type);
        return $this->preFix . strtolower($alias) . "_\$_" . ($this->partition !== null ? "_" . implode("_", $this->partition) . "_" : "") . "_\$_" .  $this->{'prefix' . $type} . strtolower( substr($nameFile, 0, ($last > 0 ? $last : strlen($nameFile))));
    }

    /**
     * Replace component instance name
     * @param $oldName
     * @param null $part
     * @return mixed
     */
    public static function changeNameInstance($oldName, $part = null)
    {
        if($part === null){
            return $oldName;
        }

        $res = preg_replace_callback("/\\_\\$\\_[^\\_]*?(.*?)\\_\\$\\_/", function($mathes) use ($part){
            return "_{$part}";
        }, $oldName);

        //print_r(array($oldName, $part, $res));

        return $res;
    }

    /**
     * Get list controllers
     *
     * @param $controllers
     * @param $alias
     * @return array
     */
    protected function getControllers($controllers, $alias)
    {
        $list = array();

        if(count($controllers) > 0){

            foreach($controllers as $nameFile => $dataClass){
                $list[$nameFile] = $this->getNameInstance($nameFile, COMP_TYPES_C, $alias);
            }
        }

        return $list;
    }

    /**
     * Get Partial alias
     * @return bool|string
     */
    protected function getPartialAlias()
    {
        if($this->partitionChange === false){
            return false;
        }

        return /*implode("_", */$this->partition;//);
    }

    /**
     * Set Controllers
     * @param $controllers
     * @param $baseDir
     * @param $alias
     */
    protected function setControllers($controllers, $baseDir, $alias)
    {
        if(count($controllers) > 0){

            if(empty($this->events)){$this->events = array();}
            if(empty($this->viewHandlers)){$this->viewHandlers = array();}

            foreach($controllers as $nameFile => $dataClass){

                if(!empty($dataClass[self::PATH])){
                    Finder::isDirectory($baseDir, "controllers");
                    $this->getBuffer()->setScript($nameFile, $baseDir . "/controllers/" . $dataClass[self::PATH], ucfirst($dataClass[self::PATH]), true);
                }

                if(!empty($dataClass[self::CLASS_ABSTRACT]) && $dataClass[self::CLASS_ABSTRACT] === true){
                    return ;
                }

                $this->controllers[$nameFile] = $this->getNameInstance($nameFile, COMP_TYPES_C, $alias);

                if(empty($dataClass[self::COMPLETE_CLASS])){

                    $this->getBuffer()->setScriptInstance($nameFile, array_merge_recursive($dataClass, array(
                        self::ALIAS => $alias,
                        self::INST_NAME => $this->controllers[$nameFile],
                        //"initFunction" => array_merge($this->events, $this->viewHandlers, $this->controllers),
                        COMP_INS_DATA=>array(
                            "instanceName"=>$this->controllers[$nameFile],
                            self::ALIAS => $alias
                        ),
                        self::TYPE_PARTITION => $this->getPartialAlias()
                    )), 3, $this->getPartialAlias());

                    $this->getBuffer()->setLinkComponentClass($nameFile, $alias, $this->getPartialAlias(), $this->controllers[$nameFile]);

                    $this->getBuffer()->setNameSpaceInstanceClass($nameFile, $alias, $this->getPartialAlias(), $this->controllers[$nameFile]);
                    $this->getBuffer()->setScriptNameInstance($nameFile, $this->controllers[$nameFile]);

                    if(!empty($dataClass["extend"])){
                        $this->getBuffer()->setLinkComponentClass($dataClass["extend"], $alias, $this->getPartialAlias(), $this->controllers[$nameFile]);
                    }

                } else {

                    $this->getBuffer()->setScriptCompleteClass($dataClass[self::COMPLETE_CLASS], $nameFile, 3, $this->getPartialAlias());
                }

            }
        }
    }

    /**
     * Get list Events
     *
     * @param $events
     * @param $alias
     * @return array
     */
    protected function getEvents($events, $alias)
    {
        $list = array();

        if(count($events) > 0){

            foreach($events as $nameFile => $dataClass){
                $list[$nameFile] = $this->getNameInstance($nameFile, COMP_TYPES_E, $alias);
            }
        }

        return $list;
    }

    /**
     * Set Events
     *
     * @param $events
     * @param $baseDir
     * @param $alias
     */
    protected function setEvents($events, $baseDir, $alias)
    {
        if(count($events) > 0){

            if(empty($this->controllers)){$this->controllers = array();}
            if(empty($this->viewHandlers)){$this->viewHandlers = array();}

            foreach($events as $nameFile => $dataClass){

                if(!empty($dataClass[self::PATH])) {
                    Finder::isDirectory($baseDir, "events");
                    $this->getBuffer()->setScript($nameFile, $baseDir . "/events/" . $dataClass[self::PATH], ucfirst($dataClass[self::PATH]), true);
                }

                if(!empty($dataClass[self::CLASS_ABSTRACT]) && $dataClass[self::CLASS_ABSTRACT] === true){
                    return ;
                }

                $this->events[$nameFile] = $this->getNameInstance($nameFile, COMP_TYPES_E, $alias);

                if(empty($dataClass[self::COMPLETE_CLASS])) {

                    $this->getBuffer()->setScriptInstance($nameFile, array_merge_recursive($dataClass, array(
                        self::INST_NAME => $this->events[$nameFile],
                        self::ALIAS => $alias,
                        //"initFunction" => array_merge($this->controllers, $this->viewHandlers, $this->events),
                        COMP_INS_DATA=>array(
                            "instanceName"=>$this->events[$nameFile],
                            self::ALIAS => $alias
                        ),
                        self::TYPE_PARTITION => $this->getPartialAlias()
                    )), 3, $this->getPartialAlias());

                    $this->getBuffer()->setLinkComponentClass($nameFile, $alias, $this->getPartialAlias(), $this->events[$nameFile]);

                    $this->getBuffer()->setNameSpaceInstanceClass($nameFile, $alias, $this->getPartialAlias(), $this->events[$nameFile]);

                    if(!empty($dataClass["extend"])){
                        $this->getBuffer()->setLinkComponentClass($dataClass["extend"], $alias, $this->getPartialAlias(), $this->events[$nameFile]);
                    }

                    $this->getBuffer()->setEventInstanceName($this->events[$nameFile], $nameFile, $alias, $this->getPartialAlias());
                    $this->getBuffer()->setScriptNameInstance($nameFile, $this->events[$nameFile]);

                } else {

                    $this->getBuffer()->setScriptCompleteClass($dataClass[self::COMPLETE_CLASS], $nameFile, 3, $this->getPartialAlias());
                }

            }
        }
    }

    /**
     * Set others Scripts with out Instance
     *
     * @param $required
     * @param $baseDir
     */
    protected function setRequired($required, $baseDir)
    {
        if(count($required) > 0){
            foreach($required as $nameFile => $dataClass){//self::ONLY_DEV
                if(!isset($dataClass[self::ONLY_DEV]) || (isset($dataClass[self::ONLY_DEV]) && MakeCache::$mode == MakeCache::MODE_DEV)){
                    Finder::isDirectory($baseDir, "required");
                    $this->getBuffer()->setScript($nameFile, $baseDir . "/required/" . $dataClass[self::PATH], ucfirst($dataClass[self::PATH]), true);

                    if(isset($dataClass[self::HAS_INIT])){
                        $this->getBuffer()->setScriptInstance($nameFile, $dataClass, 2);
                    }
                }
            }
        }
    }


    /**
     * Get list view handlers
     *
     * @param $viewHandlers
     * @param $alias
     * @return array
     */
    protected function getViewHandlers($viewHandlers, $alias)
    {
        $list = array();

        if(count($viewHandlers) > 0){

            foreach($viewHandlers as $nameFile => $dataClass){
                $list[$nameFile] = $this->getNameInstance($nameFile, COMP_TYPES_W, $alias);
            }
        }

        return $list;
    }

    /**
     * Set View Handlers
     *
     * @param $viewHandlers
     * @param $baseDir
     * @param $alias
     */
    protected function setViewHandlers($viewHandlers, $baseDir, $alias)
    {
        if(count($viewHandlers) > 0){

            if(empty($this->events)){$this->events = array();}
            if(empty($this->controllers)){$this->controllers = array();}

            foreach($viewHandlers as $nameFile => $dataClass){

                if(!empty($dataClass[self::PATH])) {
                    Finder::isDirectory($baseDir, "viewHandler");
                    $this->getBuffer()->setScript($nameFile, $baseDir . "/viewHandler/" . $dataClass[self::PATH], ucfirst($dataClass[self::PATH]), true);
                }

                if(!empty($dataClass[self::CLASS_ABSTRACT]) && $dataClass[self::CLASS_ABSTRACT] === true){
                    return ;
                }

                $this->viewHandlers[$nameFile] = $this->getNameInstance($nameFile, COMP_TYPES_W, $alias);

                if(empty($dataClass[self::COMPLETE_CLASS])) {

                    $this->getBuffer()->setScriptInstance($nameFile, array_merge_recursive($dataClass, array(
                        self::INST_NAME => $this->viewHandlers[$nameFile],
                        self::ALIAS => $alias,
                        //"initFunction" => array_merge($this->controllers, $this->events, $this->viewHandlers),
                        COMP_INS_DATA=>array(
                            self::ALIAS => $alias,
                            "instanceName"=>$this->viewHandlers[$nameFile]
                        ),
                        self::TYPE_PARTITION => $this->getPartialAlias()
                    )), 3, $this->getPartialAlias());

                    $this->getBuffer()->setLinkComponentClass($nameFile, $alias, $this->getPartialAlias(), $this->viewHandlers[$nameFile]);

                    $this->getBuffer()->setNameSpaceInstanceClass($nameFile, $alias, $this->getPartialAlias(), $this->viewHandlers[$nameFile]);

                    if(!empty($dataClass["extend"])){
                        $this->getBuffer()->setLinkComponentClass($dataClass["extend"], $alias, $this->getPartialAlias(), $this->viewHandlers[$nameFile]);
                    }

                    $this->getBuffer()->setScriptNameInstance($nameFile, $this->viewHandlers[$nameFile]);

                } else {
                    $this->getBuffer()->setScriptCompleteClass($dataClass[self::COMPLETE_CLASS], $nameFile, 3, $this->getPartialAlias());
                }
            }
        }
    }

    /**
     * Set Views
     *
     * @param $views
     * @param $format
     * @param $baseDir
     * @param $alias
     */
    protected function setViews($views, $format, $baseDir, $alias)
    {
        if(count($views) == 0){
            return false;
        }

        foreach($views as $view){

            $absolute = $baseDir . "/views/" . $view . "." . $format;
            $file = dirname(__DIR__) . "/../" . $absolute;

            if(file_exists($file)){
                $this->getBuffer()->setViewContent("theme_" . $this->getNameInstance($view, COMP_TYPES_V, $alias), file_get_contents($file), $this->getPartialAlias());
                $this->getBuffer()->setViewFile($alias, $view, $absolute, $this->getPartialAlias());
            }

        }
    }

    /**
     * Set Resources to component of application
     *
     * @param $folders
     * @param $baseDir
     * @param $alias
     * @throws \Exception
     */
    protected function setResources($folders, $baseDir, $alias)
    {
        foreach($folders as $folder)
        {
            $directory = $baseDir . "/" . self::RESOURCES . "/" . $folder;

            $di = $this->finder->getDI($directory);

            $config = $this->finder->getConfig($di);

            if(null !== $config && !empty($config[self::TYPE])){

                Fabric::getResult($config[self::TYPE], array(
                    self::DATA              =>  $config,
                    self::BASE_DIR          =>  $directory,
                    self::ALIAS             =>  $alias,
                    self::TYPE_LOADING      =>  $this->typeLoading,
                    self::TYPE_PARTITION    =>  $this->getPartialAlias()
                ));
            }

        }
    }

    /**
     * Set translations for component
     *
     * @param $baseDir
     * @param $alias
     * @throws \Exception
     */
    protected function setTranslations($baseDir, $alias)
    {
        $directory = $baseDir . "/" . self::TRANSLATIONS;

        $di = $this->finder->getDI($directory);

        $config = $this->finder->getConfig($di);

        if(null !== $config && !empty($config[self::TYPE])){

            Fabric::getResult($config[self::TYPE], array(
                self::DATA              =>  $config,
                self::BASE_DIR          =>  $directory,
                self::ALIAS             =>  $alias,
                self::TYPE_LOADING      =>  $this->typeLoading,
                self::TYPE_PARTITION    =>  $this->getPartialAlias()
            ));
        }
    }

    /**
     * Set states for component
     *
     * @param $baseDir
     * @param $alias
     * @throws \Exception
     */
    protected function setStates($baseDir, $alias)
    {
        $directory = $baseDir . "/" . self::STATES;

        $di = $this->finder->getDI($directory);

        $config = $this->finder->getConfig($di);

        if(null !== $config && !empty($config[self::TYPE])){

            Fabric::getResult($config[self::TYPE], array(
                self::DATA              =>  $config,
                self::BASE_DIR          =>  $directory,
                self::ALIAS             =>  $alias,
                self::TYPE_LOADING      =>  $this->typeLoading,
                self::TYPE_PARTITION    =>  $this->getPartialAlias()
            ));
        }
    }

    /**
     * Set signals for component
     *
     * @param $baseDir
     * @param $alias
     * @throws \Exception
     */
    protected function setSignals($baseDir, $alias)
    {
        $directory = $baseDir . "/" . self::SIGNALS;

        $di = $this->finder->getDI($directory);

        $config = $this->finder->getConfig($di);

        if(null !== $config && !empty($config[self::TYPE])){

            Fabric::getResult($config[self::TYPE], array(
                self::DATA              =>  $config,
                self::BASE_DIR          =>  $directory,
                self::ALIAS             =>  $alias,
                self::TYPE_LOADING      =>  $this->typeLoading,
                self::TYPE_PARTITION    =>  $this->getPartialAlias()
            ));
        }
    }

    /**
     * Set audio configs
     * @param $baseDir
     * @param $config
     * @param $alias
     */
    protected function setAudioSettings($baseDir, $config, $alias)
    {
        if(!empty($config)){
            $this->getBuffer()->setAudioConfig($baseDir, $config, $alias, $this->partition);
        }
    }

} 