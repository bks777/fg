<?php
/**
 * Classes constructor Finder
 * @author Antony Lavrenko
 */

namespace make\Cache\Connections;

use make\Cache\Interfaces\FindConnectionsInterface;

class ClassesFinder extends FindConnectionsInterface{

    public function execute($data = null)
    {
        if(!empty($data[self::DATA][self::CLASSES]) && count($data[self::DATA][self::CLASSES]) > 0){

            foreach($data[self::DATA][self::CLASSES] as $nameFile => $dataClass){
                $this->getBuffer()->setScript($nameFile, $data[self::BASE_DIR] . "/" . $dataClass[self::PATH], ucfirst($dataClass[self::PATH]), isset($dataClass[LibsFinder::L_MAIN]) ? $dataClass[LibsFinder::L_MAIN] : true);
                $this->getBuffer()->setScriptInstance($nameFile, $dataClass, 0);
            }
        }
    }

} 