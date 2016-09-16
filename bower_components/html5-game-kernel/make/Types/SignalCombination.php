<?php
/**
 * Class for State combinations
 * @author Antony Lavrenko
 */

namespace make\Types;


use make\Cache\BufferCache;
use make\Cache\Console\Console;

class SignalCombination
{
    const DEFAULT_STATE = "defaultState";
    const LIST_STATES = "states";
    const LIST_SIGNALS = "signals";
    const LIST_REDUCERS = "reducers";
    const LIST_REDUCERS_C = "reducers";
    const LIST_SUB_STATES = "subStates";

    const DEPENDENCIES = "dependence";
    const ARGUMENTS = "arguments";
    const ARGUMENTS_C = "a";

    const PARENT = "parent";

    const LIST_EVENTS = "events";
    const LIST_EVENTS_C = "e";
    const LIST_CLOSURES = "closures";
    const LIST_METHODS = "methods";
    const LIST_METHODS_C = "m";
    const LIST_FLAGS = "flags";
    const LIST_FLAGS_C = "f";
    const LIST_SERVICES = "services";
    const LIST_SERVICES_C = "s";
    const LIST_EXECUTE_STATES = "executeStates";
    const LIST_EXECUTE_STATES_C = "x";
    const LIST_EXECUTE_ORDERS = "executeOrders";
    const LIST_EXECUTE_ORDERS_C = "o";

    const REDUCER_CURRENT = "current";
    const REDUCER_TYPE = "type";
    const REDUCER_BLOCKED = "execute";
    const REDUCE_RESUME = "resume";
    const REDUCE_INDEX = "indexHistory";

    /**
     * Data list
     * @var array
     */
    protected $data = array();
    protected $buffer = null;
    protected $partial = null;

    protected $dataAggregated = array();

    /**
     * Constructor
     * @param $data
     * @param $buffer
     * @param $partial
     */
    public function __construct($data, $buffer, $partial)
    {
        $this->partial = $partial;
        $this->data = $data;

        if($buffer instanceof BufferCache){
            $this->buffer = $buffer;
        }
    }

    /**
     * Execute routes list
     * @return array
     */
    public function execute()
    {//print_r($this->data);die;
        foreach ($this->data[self::LIST_SIGNALS] as $alias => $state) {

            /**
             * If component is a children of parent
             */
            if (!empty($state[self::PARENT])) {

                if (is_array($state[self::PARENT])) {
                    $alias = implode(".", $state[self::PARENT]) . "." . $alias;
                } else {
                    $alias = $state[self::PARENT] . "." . $alias;
                }

            }

            foreach ($state as $name => $item) {

                if (!empty($item[self::LIST_SUB_STATES])) {

                    foreach ($item[self::LIST_SUB_STATES] as $subAlias => $subState) {
                        $this->findConnections("{$alias}.{$name}.{$subAlias}", $subState, $alias);
                    }
                } else {
                    $this->findConnections("{$alias}.{$name}", $item, $alias);
                }

            }
        }

        $result = array(
            self::LIST_SIGNALS   =>  $this->dataAggregated
        );

        if(!empty($this->data[self::DEFAULT_STATE])){
            $result[self::DEFAULT_STATE] = $this->data[self::DEFAULT_STATE];
        }

        return $result;
    }

    /**
     * Find connections
     * @param $alias
     * @param $state
     * @param $aliasComponent
     */
    protected function findConnections($alias, $state, $aliasComponent)
    {
        $args = empty($state[self::ARGUMENTS]) ? array() : $state[self::ARGUMENTS];

        /*$this->dataAggregated[$alias] = array(
            self::ARGUMENTS_C             =>  $args,
            self::LIST_SERVICES_C         =>  $this->findServicesInstance($this->linkArgs($args, $this->isEmptySettings($state, self::LIST_SERVICES))),
            self::LIST_EXECUTE_STATES_C   =>  $this->linkArgs($args, $this->isEmptySettings($state, self::LIST_EXECUTE_STATES)),
            self::LIST_METHODS_C          =>  $this->findMethodsInstance($this->linkArgs($args, $this->isEmptySettings($state, self::LIST_METHODS))),
            self::LIST_EVENTS_C           =>  $this->linkArgs($args, $this->isEmptySettings($state, self::LIST_EVENTS)),
            self::LIST_FLAGS_C            =>  $this->linkArgs($args, $this->isEmptySettings($state, self::LIST_FLAGS)),
            self::LIST_EXECUTE_ORDERS_C   =>  $this->isEmptySettings($state, self::LIST_EXECUTE_ORDERS)
        );*/

        $this->dataAggregated[$alias] = array();

        if(!empty($args)){
            $this->dataAggregated[$alias][self::ARGUMENTS_C] = $args;
        }

        $_services = $this->findServicesInstance($this->linkArgs($args, $this->isEmptySettings($state, self::LIST_SERVICES)));

        if(!empty($_services)){
            $this->dataAggregated[$alias][self::LIST_SERVICES_C] = $_services;
        }

        $_signals = $this->linkArgs($args, $this->isEmptySettings($state, self::LIST_EXECUTE_STATES));

        if(!empty($_signals)){
            $this->dataAggregated[$alias][self::LIST_EXECUTE_STATES_C] = $_signals;
        }

        $_methods = $this->findMethodsInstance($this->linkArgs($args, $this->isEmptySettings($state, self::LIST_METHODS)), $aliasComponent);

        if(!empty($_methods)){
            $this->dataAggregated[$alias][self::LIST_METHODS_C] = $_methods;
        }

        $_events = $this->linkArgs($args, $this->isEmptySettings($state, self::LIST_EVENTS));

        if(!empty($_events)){
            $this->dataAggregated[$alias][self::LIST_EVENTS_C] = $_events;
        }

        $_flags = $this->linkArgs($args, $this->isEmptySettings($state, self::LIST_FLAGS));

        if(!empty($_flags)){
            $this->dataAggregated[$alias][self::LIST_FLAGS_C] = $_flags;
        }

        $_orders = $this->isEmptySettings($state, self::LIST_EXECUTE_ORDERS);

        if(!empty($_orders)){
            $this->dataAggregated[$alias][self::LIST_EXECUTE_ORDERS_C] = $_orders;
        }


        /**
         * If find reducers for state
         */
        if(!empty($state[self::LIST_REDUCERS])){
            $this->dataAggregated[$alias] = array_merge(
                array(
                    self::LIST_REDUCERS_C =>  $this->findReduceConfigurations($state[self::LIST_REDUCERS], $args, $aliasComponent)
                ),
                $this->dataAggregated[$alias]
            );
        }
    }

    /**
     * Find reducers configs
     * @param $issues
     * @param $args
     * @param $alias
     * @return array
     */
    protected function findReduceConfigurations($issues, $args, $alias)
    {
        if(!empty($issues[self::REDUCER_CURRENT]) && is_array($issues[self::REDUCER_CURRENT])){

            /**
             * Type for group combination
             *
             *   "gamble.choose": {
             *       "current": [".choose", ".spin"],
             *       "methods": [],
             *       "flags": [],
             *       "executeStates": []
             *   }
             */
            $config = array(
                self::REDUCER_CURRENT   =>  $issues[self::REDUCER_CURRENT],
                self::REDUCER_TYPE      =>  1,
                self::REDUCER_BLOCKED   =>  $this->findReduceConnections($issues, $args, $alias)
            );

        } else if((array_keys($issues) === array_filter(array_keys($issues), "is_int")) === true) {

            /**
             * Type of only blocked list [".choose", ".spin"]
             */
            $config = array(
                self::REDUCER_TYPE      => 0,
                self::REDUCER_BLOCKED   => $issues
            );
        } else {

            $list = array();
            /**
             * If many reducers from blockers with executives
             *
             * "gamble.start" : {
             *   ".choose" : {
             *       "methods": [],
             *       "events": [],
             *       "executeStates": [],
             *       "flags": []
             *   },
             *   ".spin": {
             *
             *   }
             * },
             */
            foreach ($issues as $from => $fromIssue) {
                $list[$from] = $this->findReduceConnections($fromIssue, $args, $alias);
            }

            $config = array(
                self::REDUCER_TYPE      => 2,
                self::REDUCER_BLOCKED   => $list
            );
        }

        return $config;
    }

    /**
     * Find connections for reducers
     * @param $state
     * @param array $args
     * @param $alias
     * @return array
     */
    protected function findReduceConnections($state, $args = array(), $alias)
    {
        $response = array();

        $_args = $args;

        if(!empty($_args)){
            $response[self::ARGUMENTS_C] = $_args;
        }

        $_resume = $this->isEmptySettings($state, self::REDUCE_RESUME);

        if(!empty($_resume)){
            $response[self::REDUCE_RESUME] = $_resume;
        }

        $_index_history = $this->isEmptySettings($state, self::REDUCE_INDEX);

        if(!empty($_index_history)){
            $response[self::REDUCE_INDEX] = $_index_history;
        }

        $_services = $this->findServicesInstance($this->linkArgs($args, $this->isEmptySettings($state, self::LIST_SERVICES)));

        if(!empty($_services)){
            $response[self::LIST_SERVICES_C] = $_services;
        }

        $_signals = $this->linkArgs($args, $this->isEmptySettings($state, self::LIST_EXECUTE_STATES));

        if(!empty($_signals)){
            $response[self::LIST_EXECUTE_STATES_C] = $_signals;
        }

        $_methods = $this->findMethodsInstance($this->linkArgs($args, $this->isEmptySettings($state, self::LIST_METHODS)), $alias);

        if(!empty($_methods)){
            $response[self::LIST_METHODS_C] = $_methods;
        }

        $_events = $this->linkArgs($args, $this->isEmptySettings($state, self::LIST_EVENTS));

        if(!empty($_events)){
            $response[self::LIST_EVENTS_C] = $_events;
        }

        $_flags = $this->linkArgs($args, $this->isEmptySettings($state, self::LIST_FLAGS));

        if(!empty($_flags)){
            $response[self::LIST_FLAGS_C] = $_flags;
        }

        $_orders = $this->isEmptySettings($state, self::LIST_EXECUTE_ORDERS);

        if(!empty($_orders)){
            $response[self::LIST_EXECUTE_ORDERS_C] = $_orders;
        }

        /*return array(
            self::ARGUMENTS_C             =>  $args,
            self::REDUCE_RESUME           =>  $this->isEmptySettings($state, self::REDUCE_RESUME),
            self::LIST_SERVICES_C         =>  $this->findServicesInstance($this->linkArgs($args, $this->isEmptySettings($state, self::LIST_SERVICES))),
            self::LIST_EXECUTE_STATES_C   =>  $this->linkArgs($args, $this->isEmptySettings($state, self::LIST_EXECUTE_STATES)),
            self::LIST_METHODS_C          =>  $this->findMethodsInstance($this->linkArgs($args, $this->isEmptySettings($state, self::LIST_METHODS))),
            self::LIST_EVENTS_C           =>  $this->linkArgs($args, $this->isEmptySettings($state, self::LIST_EVENTS)),
            self::LIST_FLAGS_C            =>  $this->linkArgs($args, $this->isEmptySettings($state, self::LIST_FLAGS)),
            self::LIST_EXECUTE_ORDERS_C   =>  $this->isEmptySettings($state, self::LIST_EXECUTE_ORDERS)
        );*/

        return $response;
    }

    /**
     * Is empty settings
     * @param $settings
     * @param $key
     * @return array
     */
    protected function isEmptySettings($settings, $key)
    {
        if(empty($settings[$key])){
            return array();
        }

        return $settings[$key];
    }

    /**
     * Find instance for closure modules
     * @param $list
     * @param $alias
     * @return mixed
     */
    protected function findMethodsInstance($list, $alias)
    {
        if($this->buffer === null){
            return $list;
        }

        $array = array();

        foreach ($list as $k => $methods) {

            if(strpos(current($methods), "::") !== false){
                $el = current($methods);
                $class = explode("::", $el);

                $newClass = $this->findSelfClass($class, $alias);

                if($newClass !== false){
                    $ins = reset($newClass);
                    $class = $newClass;
                } else {
                    $ins = $this->buffer->getSortLinkComponent(reset($class), $this->partial);
                }

                if($ins !== null){

                    $ar = array(
                        $ins . "." . end($class)
                    );

                    if(count(array_keys($methods)) > 1){
                        array_push($ar, end($methods));
                    }

                    $array[$k] = $ar;

                } else {
                    $array[$k] = $methods;
                }
            } else {

                $array[$k] = $methods;

            }
        }

        return $array;
    }

    /**
     * Find instance for closure modules
     * @param $list
     * @return mixed
     */
    protected function findServicesInstance($list)
    {
        if($this->buffer === null){
            return $list;
        }

        $array = array();

        foreach ($list as $k => $services) {

            if(strpos(current($services), "::") === false){
                Console::error(sprintf("Not the validity of the service record - \"%s\"", $services));
            }

            $el = current($services);
            $class = explode("::", $el);

            $ins = $this->buffer->existScriptInWebPack(current($class));

            if($ins === false){
                Console::error(sprintf("Class \"%s\" not found!! State system!", current($class)));
            }

            $this->buffer->getScriptNameInstance(current($class));

            $ar = array(
                current($class) . "." . end($class)
            );

            if(count(array_keys($services)) > 1){
                array_push($ar, end($services));
            }

            $array[$k] = $ar;
        }

        return $array;
    }

    /**
     * Linked arguments by position in insert array
     * @param $args
     * @param $list
     * @return array
     */
    protected function linkArgs($args, $list)
    {
        $array = array();

        foreach ($list as $k => $events) {

            if(count(array_keys($events)) == 2){
                $el = end($events);

                $listArgs = array();

                foreach($el as $e){
                    if(($val = array_search($e, $args)) !== false ){
                        $listArgs[] = $val;
                    } else {
                        $listArgs[] = $e;
                    }
                }

                $array[$k] = array(reset($events), $listArgs);
            } else {
                $array[$k] = $events;
            }
        }

        return $array;
    }

    /**
     * Find self:: classes
     *
     * @param $classList
     * @param $alias
     * @return array
     */
    protected function findSelfClass($classList, $alias)
    {
        if(reset($classList) !== "self"){
            return false;//$classList;
        }

        if(count($classList) < 3){
            Console::error("State with \"self\" invalid! Need self::Handler::initHandler");
        }

        $prefix = null;

        switch($classList[1]){
            case "Handler":
                $prefix = "_h_";
                break;

            case "Controller":
                $prefix = "_c_";
                break;

            case "Event":
                $prefix = "_e_";
                break;
        }

        $findClasses = array();

        $namespaces = $this->buffer->getNameSpaceInstanceClass();

        foreach ($namespaces as $className => $instance) {
            if(strpos($className, $alias) !== false && strpos($instance, $prefix) !== false){
                $findClasses[] = $className;
            }
        }

        if(count($findClasses) == 0){
            return false; //$classList;
        }

        if(count($findClasses) == 1){
            return array(
                $namespaces[reset($findClasses)],
                end($classList)
            );
        }

        /**
         * Find current partial
         */
        foreach ($findClasses as $findClass) {
            if(strpos($findClass, $this->partial) !== false){
                return array(
                    $namespaces[$findClass],
                    end($classList)
                );
            }
        }

        /**
         * Find in common
         */
        foreach ($findClasses as $findClass) {
            if(strpos($findClass, "common") !== false){;
                return array(
                    $namespaces[$findClass],
                    end($classList)
                );
            }
        }

    }

} 