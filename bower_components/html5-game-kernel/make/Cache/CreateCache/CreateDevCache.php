<?php
/**
 * Create Cache
 * @author Antony Lavrenko
 */

namespace make\Cache\CreateCache;


use make\Cache\BufferCache;
use make\Cache\Connections\FrameDataFinder;
use make\Cache\Connections\LibsFinder;
use make\Cache\Console\Console;
use make\Types\ClassesLink;

class CreateDevCache extends SaveIndexCache implements CreateInterface {

    protected $templateCssFile = "<link rel=\"stylesheet\" href=\"{{ root }}%s\">\n";
    protected $templateScriptFile = "<script type=\"text/javascript\" src=\"{{ root }}%s\"></script>\n";
    protected $templateViewFile = "<script id=\"%s\" type=\"text/x-jquery-tmpl\" src=\"{{ root }}%s\"></script>\n";

    protected $bufferLink = "../bower_components/html5-game-kernel/make/get_data.php?";

    protected $finishedLibs = "";
    protected $finishedFiles = "";

    protected $pageContent = "";


    /**
     * Init
     *
     * @param BufferCache $bufferCache
     */
    public function __construct(BufferCache $bufferCache)
    {
        $this->bufferCache = $bufferCache;

        $this->getIndexPageContent();
    }

    /**
     * Get content from index.html file
     */
    protected function getIndexPageContent()
    {
        $this->pageContent = file_get_contents(dirname(__DIR__) . "/../Resources/index.html");
    }

    /**
     * Replace content View in index.html
     *
     * @param $name
     * @param $content
     */
    protected function replace($name, $content)
    {
        $this->pageContent = str_replace("{{ $name }}", $content, $this->pageContent);
    }

    /**
     * Make Dependency Injection links of components with make connection.js in ../app/
     */
    protected function makeConnections()
    {
        $list = $this->getBuffer()->getScriptExtends();
        $connection = new ClassesLink($list, $this->bufferCache, "dev");
        $connection->getStartApplication();
        $connection->addRun();
        $connection->save();
    }

    /**
     * Insert title of game
     */
    protected function makeTitle()
    {
        $this->replace('game_title', $this->getBuffer()->getTitle());
    }

    /**
     * Insert CSS files links
     */
    protected function makeCss()
    {
        $list = $this->getBuffer()->getCss();

        $html = "";

        foreach ($list as $path) {
            $html .= sprintf($this->templateCssFile, $path[BufferCache::PATH_ABS]);
        }

        $this->replace('css_links', $html);
    }

    /**
     * Insert JS Libs files links
     */
    protected function makeLibs()
    {
        $list = $this->getBuffer()->getLibs();

        $access = $this->getBuffer()->getNeedLibs();

        $html = "";

        foreach ($list as $path) {

            if($access === false && $path[LibsFinder::L_MAIN] === true){
                $html .= sprintf($this->templateScriptFile, $path[BufferCache::PATH_ABS]);
            } elseif($access !== false && array_search($path[BufferCache::FILE_ALIAS], $access) !== false){
                $html .= sprintf($this->templateScriptFile, $path[BufferCache::PATH_ABS]); 
            } elseif($path[LibsFinder::ALWAYS] === true){
                $html .= sprintf($this->templateScriptFile, $path[BufferCache::PATH_ABS]);
            }

        }

        $this->replace('js_libs', $html);
    }

    /**
     * Insert JS files and components
     */
    protected function makeFiles()
    {
        $list = $this->getBuffer()->getScriptFiles();

        $html = "";

        foreach ($list as $path) {
            if($path[LibsFinder::L_MAIN] === true ){
                $html .= sprintf($this->templateScriptFile, $path[BufferCache::PATH_ABS]);
            }
        }

        $this->replace('js_links', $html);
    }

    /**
     * Insert View files links
     */
    protected function makeViews()
    {
        $list = $this->getBuffer()->getViewFiles();

        $html = "";

        foreach ($list as $id => $path) {
            $html .= sprintf($this->templateScriptFile, $this->bufferLink . http_build_query(array("path"=>$path, "id"=>$id)));
        }

        $this->replace('tpl_links', $html);
    }

    /**
     * Make frames for game
     */
    protected function makeFrames()
    {
        $list = $this->getBuffer()->getFrames();

        foreach ($list as $nameFile => $dataFrame) {

            $path = dirname(__DIR__) . '/../' . $dataFrame[BufferCache::L_PATH];
            if(!file_exists($path)){
                Console::error('Html file for frame not found! ' . $path);
            }

            $html = file_get_contents($path);
            $js = "";

            foreach ($dataFrame[FrameDataFinder::F_JS] as $jsAlias) {
                $result = $this->getBuffer()->findScriptFile($jsAlias);
                if($result !== null){
                    $js .= sprintf($this->templateScriptFile, $result[BufferCache::PATH_ABS]);
                }
            }

            $html = str_replace("{{ js }}", $js, $html);

            $html = str_replace('{{ root }}', '', $html);

            file_put_contents(dirname(__DIR__) . "/../../../../app/". $nameFile .".html", $html);
        }
    }

    /**
     * Generate
     *
     * @return mixed|void
     */
    public function generate()
    {
        $this->makeAudioSprite();

        $this->makeDependencyForWebPack();

        $this->makeAudioSettings();

        $this->makeConnections();

        $this->makeTitle();

        $this->makeCss();
        $this->makeLibs();
        $this->makeFiles();
        //$this->makeViews();

        $this->saveIndexPage();

        //$this->makeFrames();

        $this->cloneCurlToCache();
        $this->closeTranslationViewToCache();
    }
} 
