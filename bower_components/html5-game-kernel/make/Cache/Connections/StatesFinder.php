<?php
/**
 * Classes constructor Finder
 * @author Antony Lavrenko
 */

namespace make\Cache\Connections;

use make\Cache\BufferCache;
use make\Cache\Console\Console;
use make\Cache\Interfaces\FindConnectionsInterface;
use make\Types\StateCombination;

class StatesFinder extends FindConnectionsInterface
{
    const S_COMPONENT = "component";

    public function execute($data = null)
    {
        if(!empty($data[self::DATA][self::STATES]) && count($data[self::DATA][self::STATES]) > 0){
            $_data = $data[self::DATA];

            if(!empty($_data[self::ORDERS])){
                $this->getBuffer()->setStateOrdersComponent($_data[self::ORDERS]);
            }

            if(!empty($_data[self::STATES])){

                foreach($data[self::DATA][self::STATES] as $nameFile => $dataClass){

                    if(empty($dataClass[self::ALIAS])){
                        Console::error(sprintf("Not found in config state \"alias\" in %s class!", $nameFile));
                    }

                    if(empty($dataClass[self::TYPE])){
                        $this->getBuffer()->setStateComponent($data[self::ALIAS], $nameFile, $dataClass[self::ALIAS]);
                    } else if($dataClass[self::TYPE] == self::S_COMPONENT) {
                        $this->getBuffer()->setStateAdditionalComponent($data[self::ALIAS], $nameFile, $dataClass[self::ALIAS]);
                    }

                    $this->getBuffer()->setScript($nameFile, $data[self::BASE_DIR] . "/" . $dataClass[self::PATH], ucfirst($dataClass[self::PATH]), true);
                }
            }

        }

        if(!empty($data[self::DATA][self::ROUTERS]) && count($data[self::DATA][self::ROUTERS]) > 0) {

            foreach ($data[self::DATA][self::ROUTERS] as $nameFile => $dataClass) {
                $this->getBuffer()->setRouterStateComponent($nameFile);
                $this->getBuffer()->setScript($nameFile, $data[self::BASE_DIR] . "/" . $dataClass[self::PATH], ucfirst($dataClass[self::PATH]), true);
            }
        }

    }

} 