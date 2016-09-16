<?php
/**
 * AudioSprite queue component finder
 * @author Antony Lavrenko
 */

namespace make\Cache\Connections;


use make\Cache\Console\Console;
use make\Cache\Interfaces\FindConnectionsInterface;
use make\Cache\MakeCache;
use make\Finder\Finder;


class AudioSpriteFinder extends FindConnectionsInterface
{
    const GROUP_NAME_SPRITE = "groupSpriteName";

    public function execute($data = null)
    {
        $this->setAudioToBuffer(
            $data[self::DATA][self::AUDIO],
            $data[self::BASE_DIR],
            empty($data[self::DATA][self::TYPE_LOADING]) ? $data[self::TYPE_LOADING] : $data[self::DATA][self::TYPE_LOADING],
            empty($data[self::DATA][self::GROUP_NAME_SPRITE]) ? "main" : $data[self::DATA][self::GROUP_NAME_SPRITE],
            $data[self::ALIAS]
        );
    }

    /**
     * Set audio list to buffer for sprite generator
     * @param $listAudio
     * @param $baseDir
     * @param $typeLoading
     * @param $groupName
     * @param $alias
     */
    protected function setAudioToBuffer($listAudio, $baseDir, $typeLoading, $groupName, $alias)
    {
        foreach ($listAudio as $aliasName => $audio) {

            $audioPath = $baseDir . "/" . $audio[self::PATH];

            if(!is_file($audioPath)){
                Console::error("File not found! File: " . $audioPath . "; Alias:" . $aliasName);
            }

            /*if(strpos($audioPath, " ") !== false){
                Console::error("Error path rules!! Path does not have a space = \" \" " . $audioPath . "; Alias:" . $aliasName);
            }*/

            $md5Hash = md5(file_get_contents($audioPath));

            $this->getBuffer()->setWawAudioForSprite($typeLoading, $groupName,
                sprintf("%s_%s", $alias, $aliasName), $audioPath, $md5Hash);
        }

    }
}