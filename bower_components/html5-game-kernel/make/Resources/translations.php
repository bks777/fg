<?php

header('Content-Type: text/html; charset=utf-8');

include_once "../bower_components/html5-game-kernel/make/Finder/Finder.php";

class TranslationFinder {

    protected $path = "/app/";
    protected $defLang = "en";

    public $finds = array();
    public $dataTranslations = array();
    public $dataConcat = array();

    public function __construct(){

        $reg = "/translation_(.*?).js/";

        foreach(new DirectoryIterator(dirname(__DIR__) . $this->path) as $files){

            if($files->isDot()) continue;

            $filename = $files->getFilename();

            preg_match($reg, $filename, $matches);

            if($matches){
                $this->finds[$matches[1]] = dirname(__DIR__) . $this->path . $matches[0];
            }
        }
    }

    /**
     * Read JS file
     * @param $path
     * @return mixed
     * @throws Exception
     */
    public function readFile($path){
        if(!is_file($path)){
            throw new Exception(sprintf("File \"%s\" not found!", $path));
        }

        $jsFile = file_get_contents($path);

        return $this->getJSON($jsFile);
    }

    /**
     * Read JS file with translations
     * @param $jsFile
     * @return mixed
     * @throws Exception
     */
    protected function getJSON($jsFile){

        $re = "/\\\$_t\\.setTranslations\\((.*?)\\)/";

        preg_match($re, $jsFile, $matches);

        if(!$matches){
            throw new Exception("File can not be exist construction of \"\$_t.setTranslations(\"(.*?)\");\" not found!");
        }

        return $matches[1];
    }

    protected function convertJSON($string){
        return json_decode($string, true);
    }

    /**
     * Get translations
     * @throws Exception
     */
    public function getTranslationsData(){

        foreach($this->finds as $lang => $path){
            $this->dataTranslations[$lang] = $this->convertJSON($this->readFile($path));
        }
    }

    /**
     * Get lis of languages
     * @return array
     */
    public function getListLanguages(){
        return array_keys($this->dataTranslations);
    }

    /**
     * Concat to one tables
     */
    public function concatLanguages(){

        $langs = $this->getListLanguages();

        foreach ($this->dataTranslations[$this->defLang] as $alias => $dataTranslation) {

            $this->dataConcat[$alias] = array();
            foreach ($langs as $lang) {

                if(empty($this->dataTranslations[$lang][$alias])){
                    $this->dataConcat[$alias][$lang] = array("text"=>"");
                } else {
                    $this->dataConcat[$alias][$lang] = $this->dataTranslations[$lang][$alias];
                }

            }

        }

    }
}

$translations = new TranslationFinder();
$translations->getTranslationsData();
$translations->concatLanguages();
?>

<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body>
<table width="100%" cellpadding="0" cellspacing="0" border="1">
    <thead>
    <tr>
        <th>Alias (ID)</th>
        <?php foreach($translations->getListLanguages() as $lang):?>

            <th><?php echo $lang;?></th>

        <?php endforeach; ?>
    </tr>
    </thead>
    <tbody>

    <?php foreach ($translations->dataConcat as $alias => $values):?>

        <tr>
            <td><?php echo $alias; ?></td>

            <?php foreach ($values as $value):?>

                <?php if(empty($value["text"])):?>
                    <td><?php echo print_r($value);?></td>
                <?php else:?>
                    <td><?php echo $value["text"];?></td>
                <?php endif; ?>

            <?php endforeach; ?>

        </tr>

    <?php endforeach;?>

    </tbody>


</table>

</body>

</html>