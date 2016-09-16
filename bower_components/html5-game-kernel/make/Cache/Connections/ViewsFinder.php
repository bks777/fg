<?php
/**
 * Views Finder cache
 * @author Antony Lavrenko
 */

namespace make\Cache\Connections;

use make\Cache\BufferCache;
use make\Cache\Interfaces\FindConnectionsInterface;

class ViewsFinder extends FindConnectionsInterface
{
    public function execute($data = null)
    {
        /**
         * Information of list classes
         */
        if(!empty($data[self::DATA][self::CLASSES]) && count($data[self::DATA][self::CLASSES]) > 0){

            foreach($data[self::DATA][self::CLASSES] as $nameFile => $dataClass){
                $this->getBuffer()->setScript($nameFile, $data[self::BASE_DIR] . "/" . $dataClass[self::PATH], ucfirst($dataClass[self::PATH]), true);
                $this->getBuffer()->setScriptInstance($nameFile, $dataClass, 2);
            }
        }
    }
} 