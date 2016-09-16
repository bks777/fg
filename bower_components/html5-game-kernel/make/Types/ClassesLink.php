<?php
/**
 * Classes create link
 * @author Antony Lavrenko
 */

namespace make\Types;

use make\Cache\BufferCache;
use make\Cache\Connections\ComponentFinder;
use make\Cache\Connections\ImagesFinder;
use make\Cache\Connections\StatesFinder;
use make\Cache\Console\Console;
use make\Cache\Interfaces\FindConnectionsInterface;
use make\Cache\MakeCache;

class ClassesLink {

    protected $js = "";

    /**
     * @var BufferCache
     */
    protected $buffer = null;

    protected $path = "/../../../app/";
    protected $distPath = "/../../../dist/";
    protected $assetsPath = "/../../../assets/";

    protected $imageCacheFolder = "images";
    protected $audioCacheFolder = "audio";

    protected $list = array();

    protected $nameConnection = "connection.js";
    protected $nameTranslationFiles = "translation_%s.js";

    protected $env = null;

    const NAME_TYPE_PARTITION = "typePart";

    /**
     * Constructor connection.js
     *
     * @param $list
     * @param BufferCache $buffer
     * @param $env
     */
    public function __construct($list, BufferCache $buffer, $env)
    {
        $this->env = $env;

        $this->buffer = $buffer;
        $this->list = $list;


        foreach ($this->list as $level) {

            foreach($level as $className => $data){
                $this->handler($className, $data);
            }

        }

        $this->makeTranslations();

        $this->setToQueueFilesImages();
        $this->setToQueueAudio();
        $this->makeViews();

        $this->setInstanceNamespaces();
        $this->setGameSettings();

        $this->setStatesConfig();

        $this->setInstanceRouterSignal();
    }

    /**
     * Handler for Connection all Scripts
     *
     * @param $className
     * @param $data
     */
    protected function handler($className, $data)
    {
        /*if(!empty($data['extend'])){
            $this->js .= "extend({$className},{$data['extend']});\n";

            $this->setSuperClassToClass($className, $data['extend'], !empty($data['alias']) ? $data['alias'] : "");
        }*/

        if(empty($data['instanceName']) && empty($data[BufferCache::L_COMPLETE])){
            return;
        }

        /**
         * Default Class name
         */
        $classInstance = $className;

        /*if(!empty($data[BufferCache::L_COMPLETE])){

            $this->setSuperClassToClass($data[BufferCache::L_COMPLETE], $className, !empty($data['alias']) ? $data['alias'] : "");

            $this->js .= "\nextend({$data[BufferCache::L_COMPLETE]},{$className});\n";

            $classInstance = $data[BufferCache::L_COMPLETE];
        }*/

        /**
         * If Class have not a partition pieces
         */
        if(empty($data[BufferCache::L_PARTITION])){

            $initSettings = array();

            if(!empty($data["instanceName"]) && !empty($data['alias'])){
                $data["instanceName"] = $this->buffer->getNameSpaceClassInstanceName($className, $data['alias'], BufferCache::PARTIAL_DEFAULT, $data["instanceName"]);
            }

            if(!empty($data['init']))
            {
                $initSettings = $this->_convertDataInit($data['init'], true, $data["instanceName"]);
            }

            if(!empty($data['alias'])){

                $componentLinks = $this->buffer->getLinkComponentClass($data['alias'], BufferCache::PARTIAL_DEFAULT); //die;

                if(!empty($componentLinks))
                {
                    $list = $this->_convertDataLinks($componentLinks);

                    /**
                     * Subscribe to component type of partition construction
                     */
                    $list[] = self::NAME_TYPE_PARTITION . ":\"" . BufferCache::PARTIAL_DEFAULT . "\"";

                    $initSettings = array_merge($initSettings, $list);
                }
            }

            if(!empty($initSettings)){
                $this->js .= "var {$data['instanceName']} = new {$classInstance}({". implode(",", $initSettings) ."});\n";
            } else {
                $this->js .= "var {$data['instanceName']} = new {$classInstance}();\n";
            }

        } else {

            foreach ($data[BufferCache::L_PARTITION] as $aliasPart => $partialData) {

                $classInstancePartial = $classInstance;

                if(!empty($partialData[BufferCache::L_COMPLETE])){


                    /**
                     * Complete component
                     */
                    $this->setSuperClassToClass($partialData[BufferCache::L_COMPLETE], $classInstance, !empty($data['alias']) ? $data['alias'] : "");

                    $this->js .= "\nextend({$partialData[BufferCache::L_COMPLETE]},{$classInstance});\n";

                    $classInstancePartial = $partialData[BufferCache::L_COMPLETE];
                }

                $initSettings = array();

                if(!empty($partialData["instanceName"]) && !empty($data['alias'])){
                    $partialData["instanceName"] = $this->buffer->getNameSpaceClassInstanceName($classInstancePartial, $data['alias'], $aliasPart, $partialData["instanceName"]);
                }

                if(!empty($partialData['init']))
                {
                    $initSettings = $this->_convertDataInit($partialData['init'], true, $partialData["instanceName"]);
                }

                if(!empty($data['alias'])){

                    $componentLinks = $this->buffer->getLinkComponentClass($data['alias'], $aliasPart);

                    if(!empty($componentLinks))
                    {
                        $list = $this->_convertDataLinks($componentLinks, $aliasPart);

                        /**
                         * Subscribe to component type of partition construction
                         */
                        $list[] = self::NAME_TYPE_PARTITION . ":\"" . $aliasPart . "\"";

                        $initSettings = array_merge($initSettings, $list);
                    }
                }

                if(!empty($initSettings)){
                    $this->js .= "var {$partialData['instanceName']} = new {$classInstancePartial}({". implode(",", $initSettings) ."});\n";
                } else {
                    $this->js .= "var {$partialData['instanceName']} = new {$classInstancePartial}();\n";
                }

            }


        }




        $this->js .= "\n\n";
    }

    /**
     * Convert data init
     * @param $init
     * @param bool $toArray
     * @param $instanceName
     * @return string
     */
    protected function _convertDataInit($init, $toArray = false, $instanceName)
    {
        $list = array();

        foreach($init as $k=>$v){

            if($k == "instanceName"){
                $v = $instanceName;
            }

            if(is_numeric($v)) {
                $list[] = "{$k}: {$v}";
            } elseif(is_array($v)) {
                $list[] = "{$k}: " . json_encode($v);
            }  elseif(is_string($v) && stripos($v, 'buffer::') !== false) {
                $const = substr($v, 8); $value = array();

                $vs = strpos($const, '.');
                if($vs === false){
                    $value = $this->buffer->getConstData($const);
                } else {
                    $arr = $this->buffer->getConstData(substr($const, 0, $vs));

                    $key_ = substr($const, ($vs + 1));

                    if(array_key_exists($key_, $arr)){
                        $value = $arr[$key_];
                    } else {
                        $value = NULL;
                    }
                }

                if(is_array($value)){
                    $list[] = "{$k}: " . json_encode($value);
                } else if(is_numeric($value)){
                    $list[] = "{$k}: " . $value;
                } else {
                    $list[] = "{$k}: \"" . $value . "\"";
                }


            }  elseif(is_string($v) && stripos($v, 'script::') !== false) {
                $list[] = "{$k}: " . substr($v, 8);
            } else {
                $list[] = "{$k}: \"{$v}\"";
            }

        }

        if($toArray === true){
            return $list;
        }

        return implode(",", $list);
    }

    /**
     * Convert data for linked component elements
     * @param $componentLinks
     * @return array
     */
    protected function _convertDataLinks($componentLinks)
    {
        $list = array();
        foreach($componentLinks as $k=>$v){
            $list[] = "get" . ucfirst($k) . ": function(){return window['{$v}'];}";
        }

        return $list;
    }

    /**
     * Set to current class extend component
     *
     * @param $class
     * @param $extendClass
     * @param $alias
     * @return bool
     */
    protected function setSuperClassToClass($class, $extendClass, $alias)
    {
        $template = "{$class}.superclass.constructor.apply(this, {$extendClass});";

        $file = $class . ".js";

        if(array_key_exists($file, $this->buffer->getScriptFiles()) === false){
            Console::error("File \"{$file}\" not found in file script list! Alias: \"{$alias}\"");
        }

        $listArray = $this->buffer->getScriptFiles();
        $pathArray = $listArray[$file];

        if(!is_array($pathArray)){
            Console::error("Data of {$pathArray} is not array!");
        }

        $path = dirname(__DIR__) . "/" . $pathArray[BufferCache::L_PATH];

        if(!is_file($path)){
            Console::error("File {$path} not found!");
        }

        $content = file_get_contents($path);

        if(stripos($content, $template) !== false){
            return false;
        }

        $start = stripos($content, "function()");

        if($start === false){
            $start = stripos($content, "function ()");
            if($start === false){
                Console::error(sprintf("Can not found start \"function(){\" in class \"%s\"", $path));
            }
        }

        $newContent = substr($content,0, $start + 12) . "\n    " . $template . "\n\n" . substr($content, $start + 12);

        file_put_contents($path,  $newContent);
    }

    /**
     * Set to queue files images for Require.js
     */
    public function setToQueueFilesImages()
    {
        $queue = $this->buffer->getImages();

        if(empty($queue)){
            return false;
        }

        foreach ($queue as $type => $items) {

            foreach ($items as $name => $item) {

                if(!empty($item[BufferCache::L_ALIAS])){

                    $queue[$type][$name] = array(
                        "a" =>  $item[BufferCache::L_ALIAS],
                        "u" =>  $item[BufferCache::L_PATH],
                        "s" =>  $item[BufferCache::L_SIZE],
                        "x" =>  array(
                            "w"=>$item[BufferCache::L_SIZE_W]["width"],
                            "h"=>$item[BufferCache::L_SIZE_W]["height"]
                        ),
                        "f" =>  $item[BufferCache::L_TYPE],
                        "p" =>  $item[BufferCache::L_PARTITION],
                        "l" =>  $item[ImagesFinder::ALTERNATIVE]
                    );

                } else {

                    $queue[$type][$name] = array();

                    foreach ($item as $lang => $itemLang) {

                        $queue[$type][$name][$lang] = array(
                            "a" =>  $itemLang[BufferCache::L_ALIAS],
                            "u" =>  $itemLang[BufferCache::L_PATH],
                            "s" =>  $itemLang[BufferCache::L_SIZE],
                            "x" =>  array(
                                "w"=>$itemLang[BufferCache::L_SIZE_W]["width"],
                                "h"=>$itemLang[BufferCache::L_SIZE_W]["height"]
                            ),
                            "f" =>  $itemLang[BufferCache::L_TYPE],
                            "p" =>  $itemLang[BufferCache::L_PARTITION],
                            "l" =>  $itemLang[ImagesFinder::ALTERNATIVE]
                        );
                    }

                }


            }
        }

        $this->js .= "\n\$_required.setQueue(". json_encode($queue) .");";
    }

    /**
     * Insert View files links
     */
    protected function makeViews()
    {
        if($this->env == 'dev'){
            return false;
        }

        $list = $this->buffer->getViewFiles();

        foreach ($list as $id => $path) {
            //$data = json_encode(array("data"=>file_get_contents($path[BufferCache::L_PATH])));
           // $this->js .= "\n\$_view_html.setTemplate(\"{$id}\", {$data}.data);\n";
        }
    }

    /**
     * Create links for namespaces
     */
    protected function setInstanceNamespaces()
    {
        $this->js .= "\n\$_component_instances.setAll(". json_encode($this->buffer->getNameSpaceInstanceClass()) .");\n";
    }

    /**
     * Set audio queue with others formats
     */
    protected function setToQueueAudio()
    {
        $queue = $this->buffer->getAudio();
        if(empty($queue)){
            return false;
        }

        foreach ($queue as $type => $items) {

            foreach ($items as $format => $listAudio) {

                foreach ($listAudio as $name => $item) {

                    $queue[$type][$format][$name] = array(
                        "a" =>  $name,
                        "u" =>  $item[BufferCache::L_PATH],
                        "s" =>  $item[BufferCache::L_SIZE],
                        "f" =>  $item[BufferCache::L_TYPE],
                        "t" =>  $item[BufferCache::L_TIME_L],
                        "p" =>  $item[BufferCache::L_PARTITION]
                    );
                }

            }
        }

        $this->js .= "\n\$_required.setAudio(". json_encode($queue) .");";
    }

    /**
     * Set translations data to game
     */
    protected function makeTranslations()
    {
        $list = array();

        $typesFiles = array();

        foreach ($this->buffer->getTranslation() as $nameTypeLoading => $listConfigs) {
            $typesFiles[$nameTypeLoading] = $listConfigs;
        }

        if(!empty($typesFiles["preloader"])){
            $this->js .= "\n\n\$_t.setTranslations(". json_encode($typesFiles["preloader"]["en"]).");";
        }


        if(!empty($typesFiles["main"])){

            foreach ($typesFiles["main"] as $lang => $configs) {

                $name = dirname(__DIR__) . $this->path . sprintf($this->nameTranslationFiles, $lang);
                $nameDist = dirname(__DIR__) . $this->assetsPath . sprintf($this->nameTranslationFiles, $lang);

                file_put_contents($name, "\$_t.setTranslations(". json_encode($configs) .");");
                file_put_contents($nameDist, "\$_t.setTranslations(". json_encode($configs) .");");
                $list[$lang] = sprintf("%u", filesize($name));

                $this->buffer->setScriptToLoad(
                    ComponentFinder::LOADING_PRELOADER,
                    "translations",
                    MakeCache::$mode == MakeCache::MODE_DEV ? $name : $nameDist,
                    sprintf("%u", filesize($name)),
                    BufferCache::PARTIAL_DEFAULT,
                    $lang
                );
            }
        }

        $this->js .= "\n\n\$_t.setAvailableLanguages(". json_encode(array_keys($this->buffer->getTranslation())) .", ". json_encode($list).");";
        $this->js .= "\n\n\$_required.setScripts(". json_encode($this->buffer->getScriptToLoad()) .");";
    }

    /**
     * Set instance of router signals
     */
    protected function setInstanceRouterSignal()
    {
        $this->js .= "\n\n\$_signal_init.setRouters(". json_encode($this->buffer->getSignalRouter()).");";
    }

    /**
     * Set game settings
     */
    protected function setGameSettings ()
    {
        if($this->buffer->existScriptInWebPack("GameSettingsService") === true){
            $this->js .= "\n \$_settingService = new GameSettingsService(". \HelperJSON::encode($this->buffer->getGameSettings())."); ";
        }
    }

    /**
     * Set State config to connection
     */
    protected function setStatesConfig(){
        $config = $this->buffer->getStateConfigs();

        $this->js .= "\n\$_stateMachine = new StateMachine();\n";

        $this->js .= "\$_stateMachine.initOrders(". \HelperJSON::encode($config[FindConnectionsInterface::ORDERS]) .");";

        $states = array();

        foreach ($config[BufferCache::STATE_STATES] as $alias => $data) {
            $states[] = sprintf('"%s":[%s,"%s"]', $alias, $data[BufferCache::L_NAME], $data[BufferCache::L_ALIAS]);
        }

        $this->js .= "\$_stateMachine.initStates({". implode(",", $states) ."});";

        if($config[BufferCache::STATE_ROUTER] && count($config[BufferCache::STATE_ROUTER]) == 1){
            $this->js .= "\$_stateMachine.setRouter( new ". current($config[BufferCache::STATE_ROUTER]) ."());";
        }

        if(!empty($config[StatesFinder::S_COMPONENT])){

            foreach($config[StatesFinder::S_COMPONENT] as $alias => $stateComponent){
                $this->js .= sprintf("\$_stateMachine.setStateComponent(\"%s\", new %s());",
                    $stateComponent[BufferCache::L_ALIAS], $stateComponent[BufferCache::L_NAME]);
            }
        }
    }

    /**
     * Start application
     */
    public function getStartApplication()
    {
        if(MakeCache::$mode == MakeCache::MODE_DEV || MakeCache::$mode == MakeCache::MODE_TEST){
            $this->js .= "\n\n//Run logs in console\n\$_log.dev = true;\n";
        }

        $partitions = $this->buffer->getGamesPartitionsConditions();

        if($partitions === false){
            $this->js .= "var __RunPartialApplication = {type: \"common\"};";

            $this->js .= "\n __RunApplication.list = " . json_encode($this->buffer->getEventInstances("common")) . ";";
        } else {

            /**
             * Run application by partial condition
             */
            $this->js .= "var __RunPartialApplication = new StartConditions(". \HelperJSON::encode($partitions) .", null);";

            foreach($partitions as $part)
            {
                if(!empty($part['exec'][0])){
                    $this->js .= "__RunPartialApplication.setCallback(\"". $part['exec'][0] ."\", function(){__RunPartialApplication.type=\"". $part['exec'][0] ."\"; ".
                     "__RunApplication.list = " . json_encode($this->buffer->getEventInstances($part['exec'][0])) . "; });";
                }
            }

            $this->js .= "__RunPartialApplication.execute();";

            //$this->js .= "\n __RunApplication.list = " . json_encode($this->buffer->getEventInstances()) . ";";
        }


    }

    /**
     * Add run script for application
     */
    public function addRun()
    {
        $this->js .= "\n __RunApplication.run();";
    }

    /**
     * Return content of connection.js
     *
     * @return string
     */
    public function getContent()
    {
        return $this->js;
    }

    /**
     * Save Connection to File
     */
    public function save()
    {
        file_put_contents(dirname(__DIR__) . $this->path . $this->nameConnection, $this->js);
        $this->buffer->setScript('connectionJS', substr($this->path, 1) . $this->nameConnection, $this->nameConnection, true);
    }

} 