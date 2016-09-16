<?php
/**
 * Connect Css Styles for application
 * @author Antony Lavrenko
 */

namespace make\Cache\Connections;

use make\Cache\Interfaces\FindConnectionsInterface;

class CssFinder extends FindConnectionsInterface
{
    const C_MAIN = "main";
    const C_CLONE = "clone";

    public function execute($data = null)
    {
        if(!empty($data[self::DATA][self::CSS]) && count($data[self::DATA][self::CSS]) > 0){

            foreach($data[self::DATA][self::CSS] as $nameFile => $dataClass){
                $this->getBuffer()->setCss(
                    $dataClass[self::PATH],
                    $data[self::BASE_DIR] . "/" . $dataClass[self::PATH],
                    isset($dataClass[self::C_MAIN]) ? $dataClass[self::C_MAIN] : true,
                    isset($dataClass[self::C_CLONE]) ? $dataClass[self::C_CLONE] : false
                );
            }
        }
    }

} 