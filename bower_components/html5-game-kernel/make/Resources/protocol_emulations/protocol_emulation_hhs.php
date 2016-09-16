<?php
/**
 * Protocol emulation
 */

class Protocol {

    public $token = "7b2230223a2231393332363932222c2231223a22222c2232223a2230222c2273223a223264656139316134646562333762346565323333316333666538646561326135227d";

    public $mainInit = '{"balance":"1000.000000000000","ranges":{"bet_extended":{"1":[1,2,3,4,5,10,15,20,30,40,50,100,200],"10":[10,15,20,30,40,50,100]},"bet":[1,2,3,4,5,10,15,20,30,40,50,100,200],"denomination":[1,10]},"lines":9,"bet":1,"limits":{"double":[]},"symbols":[[8,1,10],[1,8,11],[1,9,0],[2,1,0],[7,4,0]],"freespin_count":null,"freespin_winnings":null,"denomination":1}';
    public $mainGame = array(
        '{"balance":91,"symbols":[[3,4,1],[5,1,4],[3,7,5],[2,4,11],[5,3,7]],"winnings":null,"bonus_game":null}',
        '{"balance":82,"symbols":[[2,3,8],[4,5,3],[7,8,4],[4,3,7],[1,5,6]],"winnings":null,"bonus_game":null}',
        '{"balance":73,"symbols":[[6,2,3],[11,5,9],[5,3,7],[4,8,5],[2,4,1]],"winnings":null,"bonus_game":null}',
        '{"balance":64,"symbols":[[10,4,2],[2,5,3],[1,0,11],[8,3,6],[6,7,3]],"winnings":null,"bonus_game":null}',
        '{"balance":59,"symbols":[[10,4,2],[3,12,9],[4,3,0],[4,7,5],[0,7,3]],"winnings":{"lines":[{"line":3,"symbols":[{"0":0,"1":0},{"0":1,"1":1}],"winning":4}],"total":4},"bonus_game":null}',
        '{"balance":50,"symbols":[[1,5,6],[1,2,0],[4,2,10],[7,4,10],[9,1,3]],"winnings":null,"bonus_game":null}',
        '{"balance":87,"symbols":[[2,9,1],[3,2,0],[8,0,2],[0,5,6],[2,0,9]],"winnings":{"lines":[{"line":3,"symbols":[{"0":0,"1":0},{"0":1,"1":1},{"0":2,"1":2}],"winning":5}],"total":5},"bonus_game":null}',
        '{"balance":62,"symbols":[[8,10,0],[8,10,2],[5,6,2],[3,1,8],[4,1,5]],"winnings":{"lines":[{"line":0,"symbols":[{"0":0,"1":1},{"0":1,"1":1}],"winning":2}],"total":2},"bonus_game":null}',
        '{"balance":44,"symbols":[[7,11,4],[3,5,1],[3,7,11],[5,3,10],[7,2,0]],"winnings":{"scatters":[{"symbols":[[0,1],[2,2]],"winning":18}],"total":18},"bonus_game":null}',
        '{"balance":15,"symbols":[[0,4,1],[2,0,1],[6,10,1],[10,7,11],[2,1,7]],"winnings":{"lines":[{"line":2,"symbols":[{"0":0,"1":2},{"0":1,"1":2},{"0":2,"1":2}],"winning":5},{"line":3,"symbols":[{"0":0,"1":0},{"0":1,"1":1}],"winning":2}],"total":7},"bonus_game":null}',
        '{"balance":109,"symbols":[[3,6,0],[8,2,0],[4,3,0],[2,9,0],[5,6,8]],"winnings":{"lines":[{"line":2,"symbols":[{"0":0,"1":2},{"0":1,"1":2},{"0":2,"1":2},{"0":3,"1":2}],"winning":25},{"line":7,"symbols":[{"0":0,"1":2},{"0":1,"1":2}],"winning":2}],"total":27},"bonus_game":null}',
        '{"balance":92,"symbols":[[7,0,8],[5,12,7],[10,0,11],[3,1,5],[3,7,4]],"winnings":{"lines":[{"line":0,"symbols":[{"0":0,"1":1},{"0":1,"1":1},{"0":2,"1":1}],"winning":10}],"total":10},"bonus_game":null}',
        '{"balance":66,"symbols":[[7,11,0],[7,5,4],[3,7,11],[0,1,4],[4,1,5]],"winnings":{"lines":[{"line":8,"symbols":[{"0":0,"1":0},{"0":1,"1":0},{"0":2,"1":1}],"winning":15}],"scatters":[{"symbols":[[0,1],[2,2]],"winning":18}],"total":33},"bonus_game":null}'
    );

    public $doubleInit = '{"balance":"66.000000000000","winnings":{"total":33},"step":1,"cards":[{"suit":"hearts","rank":14},{"suit":"spades","rank":14},{"suit":"spades","rank":14},{"suit":"diamonds","rank":14},{"suit":"hearts","rank":14}]}';
    public $doubleGame = array(
        '{"balance":33,"winnings":{"total":0},"step":1,"cards":[{"suit":"hearts","rank":14},{"suit":"hearts","rank":14},{"suit":"spades","rank":14},{"suit":"spades","rank":14},{"suit":"diamonds","rank":14}],"open_card":{"suit":"hearts","rank":14},"status":0}',
        '{"balance":34,"winnings":{"total":10},"step":2,"cards":[{"suit":"clubs","rank":14},{"suit":"hearts","rank":14},{"suit":"hearts","rank":14},{"suit":"spades","rank":14},{"suit":"spades","rank":14}],"open_card":{"suit":"clubs","rank":14},"status":1}',
        '{"balance":24,"winnings":{"total":0},"step":2,"cards":[{"suit":"diamonds","rank":14},{"suit":"clubs","rank":14},{"suit":"hearts","rank":14},{"suit":"hearts","rank":14},{"suit":"spades","rank":14}],"open_card":{"suit":"diamonds","rank":14},"status":0}',
        '{"balance":6,"winnings":{"total":0},"step":1,"cards":[{"suit":"spades","rank":14},{"suit":"diamonds","rank":14},{"suit":"clubs","rank":14},{"suit":"hearts","rank":14},{"suit":"hearts","rank":14}],"open_card":{"suit":"spades","rank":14},"status":0}'
    );

    /**
     * Construct data to protocol emulation
     *
     * @param $method
     * @param $data
     * @return mixed
     */
    public static function get($method, $data)
    {
        $instance = new self();

        if(!method_exists($instance, $method)){
            throw new RuntimeException(404, sprintf("Method \"%s\" not found!", $method));
        }

        return $instance->$method($data);
    }

    /**
     * Get token
     * @return string
     */
    protected function getToken()
    {
        return $this->token;
    }

    protected function getFabric($data)
    {
        $methodName = $data["action"] . "_Fabric";

        if(method_exists($this, $methodName)){
            return $this->$methodName($data);
        } else {
            print_r($data);
        }
    }

    /**
     * Init main game
     * @return string
     */
    protected function init_Fabric()
    {
        return $this->mainInit;
    }

    /**
     * Spin main game
     * @return string
     */
    protected function spin_Fabric()
    {
        return $this->mainGame[rand(0, count($this->mainGame) - 1)];
    }

    /**
     * Spin main game
     * @return string
     */
    protected function get_double_Fabric()
    {
        return $this->doubleInit;
    }

    /**
     * Spin main game
     * @return string
     */
    protected function set_double_Fabric()
    {
        return $this->doubleGame[rand(0, count($this->doubleGame) - 1)];
    }


}

if(!empty($_GET['url'])){
    header('Content-Type: application/json');
    //sleep(1);
    echo Protocol::get("getFabric", json_decode($_POST["data"], true));
}

if(empty($_GET['url'])){
    echo Protocol::get("getToken", array());
}

