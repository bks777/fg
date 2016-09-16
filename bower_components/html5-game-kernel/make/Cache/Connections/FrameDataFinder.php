<?php
/**
 * Class created cached data for frame game
 * @author Antony Lavrenko
 */

namespace make\Cache\Connections;

use make\Cache\BufferCache;
use make\Cache\Fabric\Fabric;
use make\Cache\Interfaces\FindConnectionsInterface;

class FrameDataFinder  extends FindConnectionsInterface
{
    const F_L = "frameData";
    const F_P = "path";
    const F_JS = "js";

    /**
     * Find settings of frame for game
     * @param null $data
     */
    public function execute($data = null)
    {
        if(!empty($data[self::DATA][self::F_L]) && count($data[self::DATA][self::F_L]) > 0){

            foreach($data[self::DATA][self::F_L] as $nameFile => $dataClass){

                $this->getBuffer()->setGameFrame($nameFile, array(
                    self::F_P   =>  $data[self::BASE_DIR] . "/" . $dataClass[self::PATH],
                    self::F_JS  =>  $dataClass[self::F_JS]
                ));
            }
        }
    }

} 