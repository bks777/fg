<?php
/**
 * Merge audio file
 */


/**
 * Default Class for Merge audio files
 *
 * Class mp3
 */
class mp3{

    var $str;
    var $time;
    var $frames;

    public function mp3($path=""){
        if($path!="") {
            $this->str = file_get_contents($path);
        }
    }

    public function mergeBehind($mp3){
        $this->str .= $mp3->str;
    }

    public function getIdvEnd(){
        $strlen = strlen($this->str);
        $str = substr($this->str,($strlen-128));
        $str1 = substr($str,0,3);
        if(strtolower($str1) == strtolower('TAG'))
        {
            return $str;
        }
        else
        {
            return false;
        }
    }

    public function getStart(){
        $strlen = strlen($this->str);
        for($i=0;$i<$strlen;$i++)
        {
            $v = substr($this->str,$i,1);
            $value = ord($v);
            if($value == 255)
            {
                return $i;
            }
        }
    }

    public function striptags(){
        $newStr = '';
        $s = $start = $this->getStart();
        if($s===false)
        {
            return false;
        }
        else
        {
            $this->str = substr($this->str,$start);
        }

        $end = $this->getIdvEnd();
        if($end!==false)
        {
            $this->str = substr($this->str,0,(strlen($this->str)-129));
        }
    }

    public function error($msg){
        die('<strong>audio file error: </strong>'.$msg);
    }

    public function output($path){
        if(ob_get_contents()){
            $this->error('Some data has already been output, can\'t send mp3 file');
        }

        if(php_sapi_name()!='cli') {
            header('Content-Type: audio/mpeg3');
            if(headers_sent())
                $this->error('Some data has already been output to browser, can\'t send mp3 file');
            header('Content-Length: '.strlen($this->str));
            header('Content-Disposition: attachment; filename="'.$path.'"');
        }
        echo $this->str;
        return '';
    }

    /**
     * Save audio to path
     * @param $path
     */
    public function save($path){
        try{
            file_put_contents($path, $this->str);
        } catch(Exception $e){
            throw new RuntimeException($e->getMessage(), 500);
        }
    }

    /**
     * Merge
     * @param $mp3s
     * @param $savePath
     */
    static function mp3merge($mp3s, $savePath){

        if(count($mp3s) == 0){
            return null;
        }

        $mp3 = new mp3(array_shift($mp3s));
        $mp3->striptags();

        foreach($mp3s as $audio){
            $piece = new mp3($audio);
            $mp3->mergeBehind($piece);
            $mp3->striptags();
        }

        $mp3->save($savePath);
    }
}
