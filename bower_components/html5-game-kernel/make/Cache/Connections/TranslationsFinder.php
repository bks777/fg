<?php
/**
 * Translations linking component to buffer
 * @author Antony Lavrenko
 */

namespace make\Cache\Connections;

use make\Cache\Console\Console;
use make\Cache\Interfaces\FindConnectionsInterface;

class TranslationsFinder extends FindConnectionsInterface
{
    const LIST_LANG = 'languages';

    public function execute($data = null)
    {
        if(!empty($data[self::DATA][self::FILES]) && count($data[self::DATA][self::FILES]) > 0){

            foreach($data[self::DATA][self::FILES] as $nameFile => $dataClass)
            {
                /**
                 * If not found in config file setting of - language with array list of isset language in file
                 */
                if(empty($dataClass[self::LIST_LANG])){
                    Console::error("Translation flag for check count languages alias \"%s\" has not been found in config file");
                }

                $this->getBuffer()->setTranslationFile($dataClass[self::LIST_LANG], $data[self::BASE_DIR] . "/" . $dataClass[self::PATH]);
            }
        }
    }
} 