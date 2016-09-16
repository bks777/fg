<?php
/**
 * Audio Merge Link Class
 * @author Antony Lavrenko
 */

namespace make\Types;


use make\Cache\BufferCache;
use make\Cache\Connections\AudioFinder;
use make\Cache\Connections\ComponentFinder;
use make\Cache\Console\Console;
use make\Cache\Fabric\Fabric;
use make\Cache\Interfaces\FindConnectionsInterface;
use make\Finder\Finder;

class AudioMergeLink {

    protected $list;

    protected $aliases = array();
    protected $listAudio = array();

    protected $linkResources = "/resources/audio/merge_mp3/";
    protected $linkConfig = "/resources/audio/merge_mp3";
    protected $nameConfig = "/config.json";

    protected $config = array(
        "name" => "Audio for application",
        "type" => "audio",
        "audio" => array()
    );

    protected $configFolders = array();

    /**
     * @var BufferCache
     */
    protected $buffer;

    protected $env;

    /**
     * Init start settings
     *
     * @param $list
     * @param BufferCache $buffer
     * @param $env
     */
    public function __construct($list, BufferCache $buffer, $env)
    {
        $this->list = $list;
        $this->buffer = $buffer;
        $this->env = $env;

        $this->aliases = $this->buffer->getAudioConfigAliases();
        $this->listAudio = $this->buffer->getMp3AudioList();
    }

    /**
     * Execute merge's
     */
    public function execute()
    {

        foreach ($this->list as $fileName => $listMerges) {
            $this->mergeAudio($fileName, $listMerges);
        }

        $this->saveConfig();
    }

    /**
     * Find file from list with aliases
     *
     * @param $fileName
     * @return mixed
     */
    protected function findAudioFile($fileName)
    {
        foreach ($this->aliases as $alias => $namespace) {

            $aliasName = $alias . "_" . $fileName;

            if(array_key_exists($aliasName, $this->listAudio) !== false){
                return array(
                    "alias" =>  $alias,
                    "file"  =>  $this->listAudio[$aliasName]
                );
            }

        }

        Console::error(sprintf("Audio file not found from list Merging audio files: config-\"%s\"", $fileName));
    }

    /**
     * Merge files
     *
     * @param $fileName
     * @param $listMerges
     */
    protected function mergeAudio($fileName, $listMerges)
    {
        $list = array(); $aliases = array();

        foreach ($listMerges as $audio) {

            $result = $this->findAudioFile($audio);

            if(in_array($result["alias"], $aliases) === false){
                $aliases[] = $result["alias"];
            }

            $list[] = "../../" . $result["file"]["path"];
        }

        $path = $this->aliases[ $aliases[0] ] . $this->linkResources;

        if(!is_dir($path)){
            Finder::createDir($path);
        }

        $_filename = $path . $fileName . ".mp3";

        if(!is_file($_filename)){
            \mp3::mp3merge($list, $_filename);
        }

        if(empty($this->configFolders[$aliases[0]])){
            $this->configFolders[$aliases[0]] = $this->config;
        }

        $this->configFolders[$aliases[0]]["audio"][$fileName] = array(
            "mp3" => array(
                "path"  => $fileName . ".mp3"
            )
        );
    }

    /**
     * Save config file for folder
     */
    protected function saveConfig()
    {
        foreach ($this->configFolders as $alias => $dataConfig) {
            file_put_contents($this->aliases[$alias] . $this->linkConfig . $this->nameConfig, json_encode($this->configFolders["audio"]));

            ComponentFinder::$lastAliasComponent = $alias;

            Fabric::getResult("audio", array(
                FindConnectionsInterface::DATA          =>  $this->configFolders["audio"],
                FindConnectionsInterface::BASE_DIR      =>  $this->aliases[$alias] . $this->linkConfig,
                FindConnectionsInterface::ALIAS         =>  $alias,
                FindConnectionsInterface::TYPE_LOADING  =>  "overload"
            ));
        }

    }


} 