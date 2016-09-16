<?php
/**
 * Create Cache for Prod mode
 * @author Antony Lavrenko
 */

namespace make\Cache\CreateCache;

use make\Cache\BufferCache;
use make\Cache\Connections\CssFinder;
use make\Cache\Connections\FrameDataFinder;
use make\Cache\Connections\LibsFinder;
use make\Cache\Console\Console;
use make\Cache\MakeCache;
use make\Types\ClassesLink;

class CreateProdCache extends SaveIndexCache implements CreateInterface {

    protected $templateCssFile = "<link rel=\"stylesheet\" href=\"{{ root }}%s\">\n";
    protected $templateScriptFile = "<script type=\"text/javascript\" src=\"{{ root }}%s\"></script>\n";
    protected $templateScriptContent = "<script type=\"text/javascript\">%s</script>\n";
    protected $templateViewFile = "<script id=\"%s\" type=\"text/x-jquery-tmpl\">%s</script>\n";

    protected $nameAllCss = "game.css";
    protected $nameAllJS = "game.js";

    protected $finishedLibs = "";
    protected $finishedFiles = "";

    protected $pageContent = "";

    protected $variableCache = "?_v=";

    protected $linkToApp = "/../../../../dist/";

    protected $imageCacheFolder = "images";
    protected $audioCacheFolder = "audio";

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
        $connection = new ClassesLink($list, $this->bufferCache, "prod");
        $connection->getStartApplication();
        $connection->addRun();
        $this->contentAllJS .= $connection->getContent();
    }

    /**
     * Insert title of game
     */
    protected function makeTitle()
    {
        $this->replace('game_title', $this->getBuffer()->getTitle());
    }

    /**
     * Create all CSS of all css files
     */
    protected function makeCss()
    {
        $list = $this->getBuffer()->getCss();

        $css = "";

        foreach ($list as $path) {
            if($path[CssFinder::C_MAIN] === true ) {
                $css .= file_get_contents($path[BufferCache::L_PATH]) . "\n";
            }

            if($path[CssFinder::C_CLONE] === true){
                file_put_contents(dirname(__DIR__) . $this->linkToApp . $path[BufferCache::L_NAME], file_get_contents($path[BufferCache::L_PATH]));
            }
        }

        file_put_contents(dirname(__DIR__) . $this->linkToApp . $this->nameAllCss, $css);

        $this->replace('css_links', '');//sprintf($this->templateCssFile, $this->nameAllCss . $this->variableCache . md5($css)));
    }

    /**
     * Insert JS Libs files links
     */
    protected function makeLibs()
    {
        $list = $this->getBuffer()->getLibs();

        $access = $this->getBuffer()->getNeedLibs();

        //$contentAllJSNoPack

        foreach ($list as $path) {

            $currentJS = "";

            if($access === false && $path[LibsFinder::L_MAIN] === true){
                $currentJS = file_get_contents($path[BufferCache::L_PATH]) . "\n";
            } elseif($access !== false && array_search($path[BufferCache::FILE_ALIAS], $access) !== false){
                $currentJS = file_get_contents($path[BufferCache::L_PATH]) . "\n";
            } elseif($path[LibsFinder::ALWAYS] === true){
                $currentJS = file_get_contents($path[BufferCache::L_PATH]) . "\n";
            }

            if($path[BufferCache::JS_MINIFY] === true){
                $this->contentLibsNoPack .= $currentJS;
            } else {
                $this->contentAllJS .= $currentJS;
            }

        }

        $this->replace('js_libs', "");
    }

    /**
     * Insert JS files and components
     */
    protected function makeFiles()
    {
        $list = $this->getBuffer()->getScriptFiles();

        foreach ($list as $path) {
            if($path[LibsFinder::L_MAIN] === true && $path[BufferCache::FILE_ALIAS] != "bundle"){
                $this->contentAllJS .= file_get_contents($path[BufferCache::L_PATH]) . "\n";
            }
        }
    }

    /**
     * Insert View files links
     */
    protected function makeViews()
    {
        $this->replace('tpl_links', "");
    }

    /**
     * Write all JS files in One
     */
    protected function writeAllJS()
    {
        $compression = \JSMin::minify($this->contentAllJS);

        $compression = $this->contentLibsNoPack . $compression;

        file_put_contents(dirname(__DIR__) . $this->linkToApp . $this->nameAllJS, $compression);

        $this->replace('js_links', '');//sprintf($this->templateScriptFile, $this->nameAllJS . $this->variableCache . md5($compression)));
    }

    /**
     * Run Java applet for compile all.js to mini js file
     */
    protected function makeClosure()
    {
        //shell_exec('/Compression/closure/run.sh');
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
            $js = ""; $jsNotMinify = "";

            foreach ($dataFrame[FrameDataFinder::F_JS] as $jsAlias) {
                $result = $this->getBuffer()->findScriptFile($jsAlias);
                if($result !== null){

                    $path = dirname(__DIR__) . '/../' . $result[BufferCache::L_PATH];
                    if(!file_exists($path)){
                        Console::error('JS file for frame not found! ' . $path);
                    }

                    $fileContent = file_get_contents($path);
                    if(!empty($result[BufferCache::JS_MINIFY]) && $result[BufferCache::JS_MINIFY] === true){
                        $jsNotMinify .= "\n" . $fileContent;
                    } else {
                        $js .= "\n" . $fileContent;
                    }
                }
            }

            $nameJSFile = 'js_' . $nameFile . '.js';

            file_put_contents(dirname(__DIR__) . $this->linkToApp . $nameJSFile, $jsNotMinify . "\n" .\JSMin::minify($js));

            $html = str_replace("{{ js }}", sprintf($this->templateScriptFile, $nameJSFile . "?_=" . md5($js)), $html);

            $html = str_replace('{{ root }}', '', $html);

            file_put_contents(dirname(__DIR__) . $this->linkToApp . $nameFile .".html", $html);
        }

    }

    /**
     * Minimize game.js for text or prod env
     * @url https://www.npmjs.com/package/uglify-js
     */
    public function minimizeGameJs(){

        if(MakeCache::$mode != MakeCache::MODE_DEV){

            $filePath = dirname(__DIR__) . $this->linkToApp . $this->nameAllJS;

            $beforeMin = sprintf("%u", filesize($filePath));

            Console::write("============== MINIMIZE ./dist/game.js ==============", Console::WARNING);

            exec("cd ../../../dist/ && uglifyjs --compress --mangle --keep-fnames --output game.js  -- game.js 2>&1", $output, $errors);

            Console::writeOutputArray($output, $errors);

            clearstatcache(true);

            $afterMin = sprintf("%u", filesize($filePath));
            Console::write(sprintf("============== MINIMIZE (./dist/game.js): from %s byte -> %s byte", $beforeMin, $afterMin), Console::WARNING);
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

        $this->makeTitle();

        $this->makeCss(); // write all css

        $this->makeLibs();
        $this->makeFiles();

        $this->contentAllJS .= $this->contentBabbleAllJS;

        $this->makeConnections();

        $this->makeViews(); //write to DOM all views

        $this->writeAllJS(); // write all js

        $this->saveIndexPage();

        //$this->makeFrames();

        if(MakeCache::$mode == MakeCache::MODE_TEST){
            $this->cloneCurlToCache();
        } else {
            $this->minimizeGameJs();
        }
    }
} 