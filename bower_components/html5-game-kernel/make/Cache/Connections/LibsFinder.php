<?php
/**
 * Connect Libs for application
 * @author Antony Lavrenko
 */

namespace make\Cache\Connections;

use make\Cache\BufferCache;
use make\Cache\Interfaces\FindConnectionsInterface;
use make\Cache\MakeCache;

class LibsFinder extends FindConnectionsInterface{

    const L_MAIN = "main";
    const L_WITH = "with";

    const ALWAYS = "always";

    public function execute($data = null)
    {
        if(!empty($data[self::DATA][self::LIBS]) && count($data[self::DATA][self::LIBS]) > 0){

            foreach($data[self::DATA][self::LIBS] as $nameFile => $dataClass){

                if(!isset($dataClass[self::ONLY_DEV]) || (isset($dataClass[self::ONLY_DEV]) && MakeCache::$mode != MakeCache::MODE_PROD)) {
                    $this->getBuffer()->setLibs(
                        $nameFile,
                        $data[self::BASE_DIR] . "/" . $dataClass[self::PATH],
                        isset($dataClass[self::L_MAIN]) ? $dataClass[self::L_MAIN] : true,
                        isset($dataClass[BufferCache::JS_MINIFY]) ? $dataClass[BufferCache::JS_MINIFY] : false,
                        isset($dataClass[self::ALWAYS]) ? $dataClass[self::ALWAYS] : false
                    );

                    $listAccess = $this->getBuffer()->getNeedLibs();

                    if (in_array($nameFile, $listAccess) !== false) {

                        if (isset($dataClass[self::HAS_INIT]) || isset($dataClass[self::INST_NAME])) {
                            $this->getBuffer()->setScriptInstance($nameFile, $dataClass, 1);
                        }

                        /**
                         * If lib need hidden lib
                         */
                        if (isset($dataClass[self::L_WITH])) {
                            $this->getBuffer()->setNeedLibs($dataClass[self::L_WITH]);
                        }
                    }
                }
            }
        }
    }

} 