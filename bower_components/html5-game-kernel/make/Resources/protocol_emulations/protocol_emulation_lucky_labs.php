<?php
/**
 * Protocol emulation
 */

session_start();

header('Content-Type: application/javascript');

class Protocol {

    public $logLogin = '{"session_id": "7ac45f5a07cc11e6b9174e2464f8da93", "user": {"balance": 99858940, "huid": "2542", "denominator": 1, "nick": "", "currency": "USD", "balance_version": 1491}, "command": "login", "status": {"code": "OK", "message": ""}, "request_id": "393226e77a67c852bff4f88e0d7a2e8a", "freebets": [], "modes": ["auto", "play", "freebet"], "game_version": null}';

    public $logStart = '{"freebet": null, "user": {"denominator": 1, "huid": "2542", "nick": "", "balance": 99858940, "balance_version": 1491, "currency": "USD"}, "session_id": "7ac45f5a07cc11e6b9174e2464f8da93", "context": {"bonus": {"from_state": "spins", "selected": 6, "symbols": 5, "round_bet": null, "tier": 2, "round_win": 241000, "picks": [0, 0, 0, 1, 0, 0, 1], "items": [-1, 164000, 361000, 241000, 164000, 398000, -1], "total_win": 241000}, "spins": {"winscatters": [], "lines": 1, "round_bet": 1000, "round_win": 0, "winlines": [], "matrix": [[2, 10, 8], [7, 2, 1], [3, 2, 11], [2, 10, 1], [6, 10, 2]], "bet_per_line": 1000}, "version": null, "freespins": {"winscatters": [], "lines": 1, "round_bet": null, "bet_per_line": 1000, "winlines": [], "matrix": [[1, 3, 3], [1, 1, 3], [1, 1, 1], [2, 4, 4], [5, 11, 1]], "round_win": 0, "left": 0, "total_win": 10000}, "current": "spins", "available_actions": ["restore", "spin"]}, "status": {"code": "OK", "message": ""}, "game_version": null, "request_id": "35343caae17f055a7e21bdfbb516e5ca", "command": "start", "settings": {"bonus": [{"min": 70, "symbols": 3, "items": 5, "max": 92}, {"min": 100, "symbols": 4, "items": 5, "max": 140}, {"min": 164, "symbols": 5, "items": 5, "max": 400}], "paytable": {"1": [{"multiplier": 5, "occurrences": 3}, {"multiplier": 10, "occurrences": 4}, {"multiplier": 100, "occurrences": 5}], "2": [{"multiplier": 5, "occurrences": 3}, {"multiplier": 15, "occurrences": 4}, {"multiplier": 100, "occurrences": 5}], "3": [{"multiplier": 10, "occurrences": 3}, {"multiplier": 15, "occurrences": 4}, {"multiplier": 150, "occurrences": 5}], "4": [{"multiplier": 10, "occurrences": 3}, {"multiplier": 25, "occurrences": 4}, {"multiplier": 200, "occurrences": 5}], "5": [{"multiplier": 15, "occurrences": 3}, {"multiplier": 50, "occurrences": 4}, {"multiplier": 250, "occurrences": 5}], "6": [{"multiplier": 15, "occurrences": 3}, {"multiplier": 75, "occurrences": 4}, {"multiplier": 500, "occurrences": 5}], "7": [{"multiplier": 5, "occurrences": 2}, {"multiplier": 15, "occurrences": 3}, {"multiplier": 100, "occurrences": 4}, {"multiplier": 500, "occurrences": 5}], "8": [{"multiplier": 10, "occurrences": 2}, {"multiplier": 40, "occurrences": 3}, {"multiplier": 300, "occurrences": 4}, {"multiplier": 750, "occurrences": 5}], "9": [{"trigger": "freespins", "freespins": 15, "multiplier": 0, "occurrences": 3}, {"trigger": "freespins", "freespins": 20, "multiplier": 0, "occurrences": 4}, {"trigger": "freespins", "freespins": 25, "multiplier": 0, "occurrences": 5}], "10": [{"trigger": "bonus", "multiplier": 0, "occurrences": 3}, {"trigger": "bonus", "multiplier": 0, "occurrences": 4}, {"trigger": "bonus", "multiplier": 0, "occurrences": 5}], "12": [{"trigger": "multiply", "coefficient": 5, "multiplier": 0, "occurrences": 2}, {"trigger": "multiply", "coefficient": 10, "multiplier": 0, "occurrences": 3}, {"trigger": "multiply", "coefficient": 15, "multiplier": 0, "occurrences": 4}, {"trigger": "multiply", "coefficient": 20, "multiplier": 0, "occurrences": 5}]}, "symbols": [{"type": "regular", "id": 1}, {"type": "regular", "id": 2}, {"type": "regular", "id": 3}, {"type": "regular", "id": 4}, {"type": "regular", "id": 5}, {"type": "regular", "id": 6}, {"type": "regular", "id": 7}, {"type": "regular", "id": 8}, {"type": "scatter", "id": 9}, {"type": "regular", "id": 10}, {"type": "wild", "id": 11}, {"type": "scatter", "id": 12}], "reelsamples": {"spins": [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]], "freespins": [[1, 2, 3, 4, 5, 6, 7, 8, 9, 11], [1, 2, 3, 4, 5, 6, 7, 8, 9, 11], [1, 2, 3, 4, 5, 6, 7, 8, 9, 11], [1, 2, 3, 4, 5, 6, 7, 8, 9, 11], [1, 2, 3, 4, 5, 6, 7, 8, 9, 11]]}, "lines": [1, 5, 10, 15, 20], "cols": 5, "rows": 3, "version": "a", "bets": [1, 10, 100, 1000], "paylines": [[2, 2, 2, 2, 2], [1, 1, 1, 1, 1], [3, 3, 3, 3, 3], [1, 2, 3, 2, 1], [3, 2, 1, 2, 3], [1, 1, 2, 1, 1], [3, 3, 2, 3, 3], [2, 1, 1, 1, 2], [2, 3, 3, 3, 2], [1, 2, 1, 2, 1], [3, 2, 3, 2, 3], [1, 2, 2, 2, 1], [3, 2, 2, 2, 3], [2, 1, 2, 1, 2], [2, 3, 2, 3, 3], [2, 2, 3, 2, 2], [2, 2, 1, 2, 2], [1, 1, 1, 2, 3], [3, 3, 3, 2, 1], [3, 1, 3, 1, 3]]}}';

    public $logSync = '{"modes": ["auto", "play", "freebet"], "user": {"denominator": 1, "huid": "2542", "nick": "", "balance": 99858940, "balance_version": 1491, "currency": "USD"}, "session_id": "c903dc3a07d211e6bfd94e2464f8da93", "status": {"code": "OK", "message": ""}, "game_version": null, "request_id": "57461d8a25621fb295223e7cece11c85", "command": "sync", "freebets": []}';

    public $cyclePlay = array(
        array(
            "request_id" => "dkjfncwejnicjwneiucw",
            "session_id" => "ddkfwiejwiefwfewef",
            "freebets"=> null,
            "user"=> array(
                "balance"=> 10000,
                "balance_version" => 1,
                "currency" => "USD"
            ),
            "status"=> array(
                "code"=>"OK"
            ),
            "context" => array(
                "available_actions"=>array("restore", "spin"),
                "current"=>"spins",
                "spins"=> array(
                    "bet_per_line"=>1,
                    "lines"=>20,
                    "matrix"=>array(
                        array(1,2,3),
                        array(2,3,6),
                        array(4,7,2),
                        array(3,6,1),
                        array(4,4,5)
                    ),
                    "round_win"=>0
                ),
                "freespins"=>array(
                    "bet_per_line"=>1,
                    "lines"=>20,
                    "matrix"=>array(
                        array(1,2,3),
                        array(2,3,6),
                        array(4,7,2),
                        array(3,6,1),
                        array(4,4,5)
                    ),
                    "round_win"=>0,
                    "left"=>0
                )
            )
        ),
        array(
            "request_id" => "dkjfncwejnicjwneiucw",
            "session_id" => "ddkfwiejwiefwfewef",
            "freebets"=> null,
            "user"=> array(
                "balance"=> 10000,
                "balance_version" => 1,
                "currency" => "USD"
            ),
            "status"=> array(
                "code"=>"OK"
            ),
            "context" => array(
                "available_actions"=>array("restore", "bonus_start"),
                "current"=>"spins",
                "spins"=> array(
                    "bet_per_line"=>1,
                    "lines"=>20,
                    "matrix"=>array(
                        array(8,1,3),
                        array(8,3,4),
                        array(8,2,1),
                        array(8,9,1),
                        array(8,3,5)
                    ),
                    "round_win"=>10,
                    "winlines"=>array(
                        array(
                            "line"=>2,
                            "amount"=>10,
                            "positions"=>array(1,1,1,1,1)
                        )
                    )
                ),
                "freespins"=>array(
                    "bet_per_line"=>1,
                    "lines"=>20,
                    "matrix"=>array(
                        array(8,1,3),
                        array(8,3,4),
                        array(8,2,1),
                        array(8,9,1),
                        array(8,3,5)
                    ),
                    "round_win"=>0,
                    "left"=>0
                )
            )
        ),
        /**
         * BONUS
         */
        array(
            "request_id" => "dkjfncwejnicjwneiucw",
            "session_id" => "ddkfwiejwiefwfewef",
            "freebets"=> null,
            "user"=> array(
                "balance"=> 10000,
                "balance_version" => 1,
                "currency" => "USD"
            ),
            "status"=> array(
                "code"=>"OK"
            ),
            "context" => array(
                "available_actions"=>array("restore", "bonus_pick"),
                "current"=>"bonus",
                "bonus"=>array(
                    "picks"=>array(1,0,0,0,0,0),
                    "items"=>array(32,0,0,0,0,0)
                )
            )
        ),array(
            "request_id" => "dkjfncwejnicjwneiucw",
            "session_id" => "ddkfwiejwiefwfewef",
            "freebets"=> null,
            "user"=> array(
                "balance"=> 10000,
                "balance_version" => 1,
                "currency" => "USD"
            ),
            "status"=> array(
                "code"=>"OK"
            ),
            "context" => array(
                "available_actions"=>array("restore", "bonus_pick"),
                "current"=>"bonus",
                "bonus"=>array(
                    "picks"=>array(1,0,1,0,0,0),
                    "items"=>array(32,0,100,0,0,0)
                )
            )
        ),
        array(
            "request_id" => "dkjfncwejnicjwneiucw",
            "session_id" => "ddkfwiejwiefwfewef",
            "freebets"=> null,
            "user"=> array(
                "balance"=> 10000,
                "balance_version" => 1,
                "currency" => "USD"
            ),
            "status"=> array(
                "code"=>"OK"
            ),
            "context" => array(
                "available_actions"=>array("restore", "bonus_pick"),
                "current"=>"bonus",
                "bonus"=>array(
                    "picks"=>array(1,0,1,1,0,0),
                    "items"=>array(32,0,100,12,0,0)
                )
            )
        ),
        array(
            "request_id" => "dkjfncwejnicjwneiucw",
            "session_id" => "ddkfwiejwiefwfewef",
            "freebets"=> null,
            "user"=> array(
                "balance"=> 10000,
                "balance_version" => 1,
                "currency" => "USD"
            ),
            "status"=> array(
                "code"=>"OK"
            ),
            "context" => array(
                "available_actions"=>array("restore", "bonus_stop"),
                "current"=>"bonus",
                "bonus"=>array(
                    "picks"=>array(1,0,1,1,1,0),
                    "items"=>array(130,0,100,12,32,0)
                )
            )
        ),
        array(
            "request_id" => "dkjfncwejnicjwneiucw",
            "session_id" => "ddkfwiejwiefwfewef",
            "freebets"=> null,
            "user"=> array(
                "balance"=> 10000,
                "balance_version" => 1,
                "currency" => "USD"
            ),
            "status"=> array(
                "code"=>"OK"
            ),
            "context" => array(
                "available_actions"=>array("restore", "spin"),
                "current"=>"spins",
                "spins"=> array(
                    "bet_per_line"=>1,
                    "lines"=>20,
                    "matrix"=>array(
                        array(5,2,3),
                        array(2,3,6),
                        array(4,7,2),
                        array(3,6,1),
                        array(4,4,5)
                    ),
                    "round_win"=>0
                ),
                "freespins"=>array(
                    "bet_per_line"=>1,
                    "lines"=>20,
                    "matrix"=>array(
                        array(6,2,3),
                        array(2,3,6),
                        array(4,7,2),
                        array(3,6,1),
                        array(4,4,5)
                    ),
                    "round_win"=>0,
                    "left"=>0
                )
            )
        ),
        array(
            "request_id" => "dkjfncwejnicjwneiucw",
            "session_id" => "ddkfwiejwiefwfewef",
            "freebets"=> null,
            "user"=> array(
                "balance"=> 10000,
                "balance_version" => 1,
                "currency" => "USD"
            ),
            "status"=> array(
                "code"=>"OK"
            ),
            "context" => array(
                "available_actions"=>array("restore", "spin"),
                "current"=>"spins",
                "spins"=> array(
                    "bet_per_line"=>1,
                    "lines"=>20,
                    "matrix"=>array(
                        array(2,2,3),
                        array(2,3,6),
                        array(4,7,2),
                        array(3,6,1),
                        array(4,4,5)
                    ),
                    "round_win"=>0
                ),
                "freespins"=>array(
                    "bet_per_line"=>1,
                    "lines"=>20,
                    "matrix"=>array(
                        array(4,2,3),
                        array(2,3,6),
                        array(4,7,2),
                        array(3,6,1),
                        array(4,4,5)
                    ),
                    "round_win"=>0,
                    "left"=>0
                )
            )
        ),
        array(
            "request_id" => "dkjfncwejnicjwneiucw",
            "session_id" => "ddkfwiejwiefwfewef",
            "freebets"=> null,
            "user"=> array(
                "balance"=> 10000,
                "balance_version" => 1,
                "currency" => "USD"
            ),
            "status"=> array(
                "code"=>"OK"
            ),
            "context" => array(
                "available_actions"=>array("restore", "spin"),
                "current"=>"spins",
                "spins"=> array(
                    "bet_per_line"=>1,
                    "lines"=>20,
                    "matrix"=>array(
                        array(1,2,3),
                        array(2,3,6),
                        array(4,7,2),
                        array(3,6,1),
                        array(4,4,5)
                    ),
                    "round_win"=>0
                ),
                "freespins"=>array(
                    "bet_per_line"=>1,
                    "lines"=>20,
                    "matrix"=>array(
                        array(1,2,3),
                        array(2,3,6),
                        array(4,7,2),
                        array(3,6,1),
                        array(4,4,5)
                    ),
                    "round_win"=>0,
                    "left"=>0
                )
            )
        )
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
     * Init main game
     * @return string
     */
    protected function login()
    {
        if(is_string($this->logLogin)){
            return $this->logLogin;
        }

        return json_encode($this->logLogin);
    }

    protected function start(){
        if(!empty($_SESSION['counter'])){
            $_SESSION['counter'] = 0;
        }

        if(is_string($this->logStart)){
            return $this->logStart;
        }

        return json_encode($this->logStart);
    }

    protected function sync(){
        if(is_string($this->logSync)){
            return $this->logSync;
        }

        return json_encode($this->logSync);
    }

    /**
     * Play cycle
     * @return string
     */
    protected function play(){

        if(empty($_SESSION['counter'])){
            $_SESSION['counter'] = 0;
        }

        $result = $this->cyclePlay[ $_SESSION['counter'] ];

        if($_SESSION['counter'] == count($this->cyclePlay) - 1){
            $_SESSION['counter'] = 0;
        } else {
            $_SESSION['counter']++;
        }

        return json_encode($result);
    }
}

if(isset($_GET['type']) && $_GET['type'] == "JSONP" && $_GET['callback']){

    $data = json_decode($_GET["data"], true);
    $response = $_GET['callback'] . "(" . Protocol::get($data["command"], $data) . ")";

    file_put_contents(dirname(__DIR__) . "/app/curl_response.js", $response);

    header("Location: curl_response.js");
}



/*
$matrix = array(
    array(
        3,
        2,
        1,
    ),array(
        3,
        2,
        1,
    ),array(
        3,
        2,
        1,
    ),array(
        3,
        2,
        1,
    ),array(
        3,
        2,
        1,
    )
);


$lines = array(
    array(1,1,1,1,1),
    array(0,0,0,0,0),
    array(2,2,2,2,2)
);

$result = array(
    $matrix[0][ 0 ][ $lines[0][0] ],
    $matrix[0][ 1 ][ $lines[0][1] ],
    $matrix[0][ 2 ][ $lines[0][2] ],
    $matrix[0][ 3 ][ $lines[0][3] ],
    $matrix[0][ 4 ][ $lines[0][4] ],
);
*/
