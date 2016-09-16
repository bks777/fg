<?php

/**
 * Created by PhpStorm.
 * User: Anton
 * Date: 4/23/16
 * Time: 8:11 PM
 */
class ProtocolServer
{
    protected $columns = 0;
    protected $rows = 0;

    protected $symbols = array();
    protected $maskLines = array();

    public function __construct($columns = 5, $rows = 3)
    {
        $this->columns = $columns;
        $this->rows = $rows;
    }

    /**
     * Add symbols to server
     * @param array $list
     */
    public function addSymbols(array $list = array()){
        $this->symbols = $list;
    }

    /**
     * Add lines to mask
     * @param array $list
     */
    public function addLine(array $list = array()){
        $this->maskLines[] = $list;
    }

    /**
     * Generate random
     * @param int $count
     * @return int
     */
    private function random($count = 0){
        return rand(0, $count);
    }

}


$server = new ProtocolServer();
$server->addSymbols([1,2,3,4,5,6,7,8,9,10,11,12]);
$server->addLine([1,1,1,1,1]);
$server->addLine([0,0,0,0,0]);
$server->addLine([2,2,2,2,2]);
$server->addLine([0,1,2,1,0]);
$server->addLine([2,1,0,1,2]);
$server->addLine([1,2,2,2,1]);
$server->addLine([1,0,0,0,1]);
$server->addLine([1,0,0,0,1]);
$server->addLine([0,0,1,2,2]);