<?php

require_once 'Cache/BufferCache.php';

if(isset($_GET['path']) && isset($_GET['id'])){
    $data = json_encode(array("data"=>file_get_contents(__DIR__ . "/../../" . $_GET['path'][\make\Cache\BufferCache::PATH_ABS])));

    echo "\$_view_html.setTemplate(\"{$_GET['id']}\", {$data}.data);";
}