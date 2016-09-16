<?php
/**
 * Classes constructor Finder
 * @author Antony Lavrenko
 */

namespace make\Cache\Connections;

use make\Cache\BufferCache;
use make\Cache\Interfaces\FindConnectionsInterface;
use make\Types\SignalCombination;
use make\Types\StateCombination;

class SignalsFinder extends FindConnectionsInterface
{
    public function execute($data = null)
    {
        if(!empty($data[self::DATA][self::SIGNALS]) && count($data[self::DATA][self::SIGNALS]) > 0){

            $_data = $data[self::DATA];

            $_alias = !empty($_data[self::ALIAS]) ? $_data[self::ALIAS] : "";
            $_signal = !empty($_data[self::SIGNALS]) ? $_data[self::SIGNALS] : "";
            $_parent = !empty($_data[self::SIGNALS_PARENT]) ? $_data[self::SIGNALS_PARENT] : "";

            $list = array();

            if(empty($_signal[$_alias])){
                $list[$_alias] = $_signal;
            } else {
                $list = $_signal;
            }

            if(!empty($_data[self::REDUCERS])){

                $newList = &$list[$_alias];

                foreach ($_data[self::REDUCERS] as $reduceAlias => $issues) {

                    $nameReduce = $reduceAlias;

                    if(stripos($reduceAlias, ".") !== false){
                        $nameReduce = explode(".", $reduceAlias);
                    }


                    foreach ($list[$_alias] as $name => $values) {

                        if(!empty($values[SignalCombination::LIST_SUB_STATES]) && is_array($nameReduce) && $name == $nameReduce[0]){

                            foreach ($values[SignalCombination::LIST_SUB_STATES] as $subNames => $subValues) {

                                if($subNames === $nameReduce[1]){

                                    $newList[$name][SignalCombination::LIST_SUB_STATES][$subNames] = array_merge(
                                        array(
                                            SignalCombination::LIST_REDUCERS     =>  $issues
                                        ),
                                        $subValues
                                    );
                                }
                            }
                        } elseif(is_string($nameReduce) && $name == $nameReduce) {
                            $newList[$name] = array_merge(
                                array(
                                    SignalCombination::LIST_REDUCERS     =>  $issues
                                ),
                                $values
                            );
                        }
                    }

                }

            }

            $this->getBuffer()->setSignalRouter($_alias, array(
                self::SIGNALS               =>  $list,
                self::REDUCERS              =>  !empty($_data[self::REDUCERS]) ? $_data[self::REDUCERS] : array(),
                self::SIGNALS_PARENT        =>  !empty($_parent) ? $_parent : false
            ), $data[BufferCache::L_PARTITION]);

        }
    }

} 