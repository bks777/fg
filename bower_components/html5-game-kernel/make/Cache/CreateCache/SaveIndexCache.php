<?php
/**
 * Save index cache of start page for game
 * @author Antony Lavrenko
 */

namespace make\Cache\CreateCache;

use make\Cache\BufferCache;
use make\Cache\Console\Console;
use make\Cache\Fabric\Fabric;
use make\Cache\Interfaces\FindConnectionsInterface;
use make\Cache\MakeCache;
use make\Finder\Finder;

class SaveIndexCache {

    protected $pageContent;

    protected $nameVariableRoot = '{$games_root}{$game_short_name}/app/';

    /**
     * For WebPack
     */
    protected $fileNameImports = "imports_js_%s.js";
    protected $fileNameDI = "dependency_es%s.js";

    protected $templateImports = "import \"%s\";";

    protected $templateDIImports = "import %s from \"%s\";";
    protected $templateDIWindow = "window.%s = %s;";

    protected $contentAllJS = "";
    protected $contentLibsNoPack = "";
    protected $contentBabbleAllJS = "";

    protected $audioFormats = array("ogg", "m4a", "mp3", "ac3");

    /**
     * @var BufferCache
     */
    protected $bufferCache;

    /**
     * Get Buffer Data
     *
     * @return BufferCache
     */
    public function getBuffer()
    {
        return $this->bufferCache;
    }

    /**
     * Html set data
     */
    public function saveIndexPage()
    {
        $this->_saveHtmlIndexPage();
        //$this->_saveTplIndexPage();

        if(MakeCache::$mode != MakeCache::MODE_DEV){
            $this->_saveProdInitJS();
        }
    }

    /**
     * Save index.html version with config data for testing
     */
    private function _saveHtmlIndexPage()
    {
        $html = $this->pageContent;

        $html = str_replace('{{ root }}', '', $html);

        if(MakeCache::$mode == MakeCache::MODE_DEV){

            preg_match('/{% tpl %}(.*?){% else %}/s', $html, $matches);

            $html = str_replace($matches, '', $html);
            $html = str_replace('{% end %}', '', $html);
        } else {

            $html = str_replace('{% tpl %}', '', $html);

            preg_match('/{% else %}(.*?){% end %}/s', $html, $matches);

            $html = str_replace($matches, '', $html);
        }


        $html = preg_replace_callback('/{{s(.*)s}}/m', function($matches){
            $const = str_replace('buffer::', '', trim($matches[1]));

            if(strpos($const, '.') === false){
                $data = $this->bufferCache->getConstData($const);
            } else {
                $r = explode('.', $const);
                $d = $this->bufferCache->getConstData($r[0]);

                if(array_key_exists($r[1], $d)=== false){
                    Console::error('Can not found data in array of settings with key :' . $r[1]);
                }

                $data = $d[ $r[1] ];
            }

            return $data;
        }, $html);

        if(MakeCache::$mode == MakeCache::MODE_DEV){
            file_put_contents(dirname(__DIR__) . "/../../../../app/index.html", $html);
        } else {
            file_put_contents(dirname(__DIR__) . "/../../../../dist/index.html", $html);
        }

    }

    /**
     * Save prod init.js
     */
    private function _saveProdInitJS() {
        $html = file_get_contents(dirname(__DIR__) . "/../Resources/init.js");

        $html = preg_replace_callback('/{{s(.*)s}}/m', function($matches){
            $const = str_replace('buffer::', '', trim($matches[1]));

            if(strpos($const, '.') === false){
                $data = $this->bufferCache->getConstData($const);
            } else {
                $r = explode('.', $const);
                $d = $this->bufferCache->getConstData($r[0]);

                if(array_key_exists($r[1], $d)=== false){
                    Console::error('Can not found data in array of settings with key :' . $r[1]);
                }

                $data = $d[ $r[1] ];
            }

            return $data;
        }, $html);

        file_put_contents(dirname(__DIR__) . "/../../../../dist/init.js", $html);
    }

    /**
     * Save game.tpl for real gaming in production env.
     */
    private function _saveTplIndexPage()
    {
        $html = $this->pageContent;

        $html = str_replace('{{ root }}', $this->nameVariableRoot, $html);

        $html = str_replace('{% tpl %}', '', $html);

        preg_match('/{% else %}(.*?){% end %}/s', $html, $matches);

        $html = str_replace($matches, '', $html);

        file_put_contents(dirname(__DIR__) . "/../../../../app/game.tpl", $html);
    }

    /**
     * Clone curl file to cache
     */
    protected function cloneCurlToCache()
    {
        $emulation = $this->getBuffer()->getGameSetting(FindConnectionsInterface::GAME_SETTING_EMULATION);
        if($emulation === null){

            /**
             * Default curl data
             */
            $curlFile = file_get_contents(dirname(__DIR__) . "/../Resources/curl_request.php");
        } else {

            /**
             * Use protocol emulator
             */
            $file = dirname(__DIR__) . "/../Resources/protocol_emulations/protocol_emulation_". $emulation .".php";

            if(!file_exists($file)){
                Console::error("Emulation protocol Class not found! " . $file);
            }

            $curlFile = file_get_contents($file);
        }

        file_put_contents(dirname(__DIR__) . "/../../../../app/curl_request.php", $curlFile);
    }

    /**
     * Translation Helper View
     */
    protected function closeTranslationViewToCache(){

        $curlFile = file_get_contents(dirname(__DIR__) . "/../Resources/translations.php");
        file_put_contents(dirname(__DIR__) . "/../../../../app/translations.php", $curlFile);
    }

    /**
     * Make audio settings
     */
    protected function makeAudioSettings()
    {
        $settings = $this->getBuffer()->getAudioConfig();

        foreach ($settings as $method => $listData){

            $instance = \FindClass::createInstance('\make\Types\\', array("Audio", $method, "Link"), array(
                $listData,
                $this->bufferCache,
                MakeCache::$mode
            ));

            if(!method_exists($instance, 'execute')){
                Console::error(sprintf("Method \"execute\" not found in Class \"%s\"", \FindClass::getCamelCaseClassName(array("Audio", $method, "Link"))));
            }

            /**
             * Run method
             */
            $instance->execute();
        }

    }

    /**
     * Make dependencies for WebPack compressions
     */
    protected function makeDependencyForWebPack()
    {
        $list = $this->getBuffer()->getScriptForWebPack(); $output = array(); $errors = 0;

        foreach($list as $version => $files){

            $dependencies = ""; $listImports = "";

            foreach ($files as $file) {
                $listImports .= sprintf($this->templateImports, $file[BufferCache::PATH_ABS]) . "\n";
                $dependencies .= sprintf($this->templateDIImports, $file[BufferCache::FILE_ALIAS], $file[BufferCache::PATH_ABS]) . "\n";
                $dependencies .= sprintf($this->templateDIWindow, $file[BufferCache::FILE_ALIAS], $file[BufferCache::FILE_ALIAS]) . "\n";
            }

            //file_put_contents(dirname(__DIR__) . "/../../../../app/". sprintf($this->fileNameImports, $version), $listImports);
            file_put_contents(dirname(__DIR__) . "/../../../../app/". sprintf($this->fileNameDI, $version), $dependencies);
        }

        if(!empty($list)){

            /**
             * If make from prod | test to dev, need to update bundle settings
             */
            if(file_exists(dirname(__DIR__) . "/../../../../app/is_prod.bundle.js") && MakeCache::$mode == MakeCache::MODE_DEV){
                unlink(dirname(__DIR__) . "/../../../../app/bundle.js");
                unlink(dirname(__DIR__) . "/../../../../app/is_prod.bundle.js");
            }

            if(!file_exists(dirname(__DIR__) . "/../../../../app/bundle.js") || MakeCache::$mode != MakeCache::MODE_DEV){

                Console::write("==============WEBPACK======START=================", Console::WARNING);

                if(MakeCache::$mode == MakeCache::MODE_DEV){
                    exec("cd ../../../ && npm run build 2>&1", $output, $errors);
                } else {
                    exec("cd ../../../ && npm run prod 2>&1", $output, $errors);
                }

                Console::writeOutputArray($output, $errors);

                Console::write("==============WEBPACK======END=================", Console::WARNING);

                if(MakeCache::$mode != MakeCache::MODE_DEV){
                    file_put_contents(dirname(__DIR__) . "/../../../../app/is_prod.bundle.js", sprintf("var updateProd = %d;",time()));
                }

                $this->getBuffer()->setScript("bundle", "../../../app/bundle.js", "Bundle", true);
            } else {
                $this->getBuffer()->setScript("bundle", "../../../app/bundle.js", "Bundle", true);
            }

            if(MakeCache::$mode != MakeCache::MODE_DEV){

                $this->contentBabbleAllJS .= "\n". file_get_contents(dirname(__DIR__) . "/../../../../app/bundle.js");
            }
        }

    }

    /**
     * Make AudioSprite
     * @return null
     */
    public function makeAudioSprite(){

        $list = $this->getBuffer()->getWawAudioForSprite();

        if(empty($list)){
            return null;
        }

        $dir = dirname(__DIR__) . "/../../../../assets/audio_sprite";

        if(!is_dir($dir)){
            Finder::createDir($dir . "/");
        }

        $fileHash = dirname(__DIR__) . "/../../../../assets/audio_sprite/au_sp_hash.json";

        $fileHashArray = array();

        if(file_exists($fileHash)){
            $fileHashArray = json_decode(file_get_contents($fileHash), true);
        }

        $listBuffer = array(); $spriteMap = array();

        foreach ($list as $nameSprite => $listElements) {

            $output = array(); $errors = 0;

            $list = array();

            if(empty($fileHashArray[$nameSprite])){
                $fileHashArray[$nameSprite] = array();
            }

            $change = false; $typeLoading = null;

            $pathScript = realpath(dirname(__DIR__) . "/../Resources/node_modules/audiosprite");

            foreach ($listElements as $aliasName => $dataElement) {

                if($dataElement[BufferCache::L_MD5] != $fileHashArray[$nameSprite][$aliasName]){
                    $change = true;
                }

                $typeLoading = $dataElement[BufferCache::L_TYPE];
                $listBuffer[$nameSprite][$aliasName] = array(
                    BufferCache::L_PATH     => basename($dataElement[BufferCache::L_PATH]),
                    BufferCache::L_GROUP    => $dataElement[BufferCache::L_GROUP]
                );
                $list[] = realpath(dirname(__DIR__) . "/../" . $dataElement[BufferCache::L_PATH]);
                $fileHashArray[$nameSprite][$aliasName] = $dataElement[BufferCache::L_MD5];
            }

            if($change === true){

                Console::write(sprintf("+++ UPDATE AUDIO SPRITE => %s", $nameSprite), Console::WARNING);

                exec(sprintf("cd Resources/node_modules/audiosprite && node audioSpriteGenerator.js \"%s\" \"%s\" \"%s\" \"%s\" 2>&1",
                    $nameSprite,
                    realpath(dirname(__DIR__) . "/../../../../assets/audio_sprite/"),
                    $pathScript,
                    implode("\" \"", $list)
                ), $output, $errors);

                Console::writeOutputArray($output, $errors);
            }

            $spriteMap = \MergeArrays::arrayMergeRecursive($spriteMap, $this->_changeAudioSpriteMap($nameSprite, $dir . "/" . $nameSprite, $listBuffer[$nameSprite]));

            $this->_addAudioSpriteToLoad($dir, $nameSprite, $typeLoading);
        }

        file_put_contents($fileHash, json_encode($fileHashArray, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));


        $config = sprintf("\$_required.setSpriteAudioConfig(%s);", json_encode($spriteMap, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        file_put_contents(sprintf("%s/audio_sprite.js", $dir), $config);

        $this->getBuffer()->setScriptToLoad(
            BufferCache::TYPE_LOAD_PRELOAD,
            "audio_sprite",
            sprintf("%s/audio_sprite.js", $dir),
            sprintf("%u", filesize(sprintf("%s/audio_sprite.js", $dir)))
        );
    }

    /**
     * Change config audio sprite
     * @param $name
     * @param $filename
     * @param $listBuffer
     * @return array
     */
    protected function _changeAudioSpriteMap($name, $filename, $listBuffer){

        if(!file_exists($filename . ".json")){
            Console::error(sprintf("File \"%s\" with config sprite audio not found!", $filename . ".json"));
        }

        $content = json_decode(file_get_contents($filename . ".json"), true);

        $keys = array_keys($listBuffer);

        $finds = array_map(function($res){
            return preg_replace("/\.[^.]+$/", "", $res[BufferCache::L_PATH]);
        }, array_values($listBuffer));

        $newSpriteMap = array();

        foreach ($content["spritemap"] as $oldKey => $audio) {

            $find = array_search($oldKey, $finds);

            if($find !== false){
                $newSpriteMap[ $keys[$find] ] = \MergeArrays::arrayMergeRecursive($audio, array(
                    "startTime"     => $audio["start"],
                    "resource"      => $name,
                    "duration"      => $audio["end"] - $audio["start"],
                    "group"         => empty($listBuffer[ $keys[$find] ][BufferCache::L_GROUP]) ? "main": $listBuffer[ $keys[$find] ][BufferCache::L_GROUP]
                ));

                unset($newSpriteMap[ $keys[$find] ]["start"]);
                unset($newSpriteMap[ $keys[$find] ]["end"]);
            }
        }

        return $newSpriteMap;
    }

    /**
     * Set audio to queue loading
     * @param $path
     * @param $nameSprite
     * @param $typeLoading
     */
    protected function _addAudioSpriteToLoad($path, $nameSprite, $typeLoading){

        foreach ($this->audioFormats as $audioFormat) {

            $this->getBuffer()->setAudios(
                $typeLoading,
                $audioFormat,
                $nameSprite,
                sprintf("%s/%s.%s", $path, $nameSprite, $audioFormat),
                sprintf("%u", filesize(sprintf("%s/%s.%s", $path, $nameSprite, $audioFormat))),
                false,
                BufferCache::PARTIAL_DEFAULT
            );
        }
    }


} 