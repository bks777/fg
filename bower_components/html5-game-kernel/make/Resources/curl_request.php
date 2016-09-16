<?php
/**
 * CURL proxy for game requests
 * @author Antony Lavrenko
 */

/**
 * Send curl data to server
 * @param null $url
 * @param $data
 * @return mixed
 */
function sendCurl($url = null, $data) {
    if($curl = curl_init()){

        session_start();

        $_COOKIE[session_name()] = session_id();

        $cookie_str = "";

        foreach($_COOKIE as $key => $value){
            $cookie_str .= "$key=$value;";
        }

        curl_setopt($curl, CURLOPT_URL, urldecode($url));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_COOKIE, $cookie_str);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data );

        $out = curl_exec($curl);
        curl_close($curl);

        return $out;
    }
}

if(isset($_POST) && $_GET['url'] && !isset($_GET['type'])){

    echo sendCurl($_GET['url'], file_get_contents("php://input"));

} elseif(isset($_POST['get'])){
    echo file_get_contents($_POST['get']);
}

elseif(isset($_GET['type']) && $_GET['type'] == "JSONP" && $_GET['callback']){

    if(isset($_GET["method"]) && $_GET["method"] == "get"){
        $response = file_get_contents($_GET['url']);
    } else {
        $response = $_GET['callback'] . "(" . sendCurl($_GET['url'], $_GET['data']) . ")";
    }

    file_put_contents(dirname(__DIR__) . "/app/curl_response.js", $response);

    header("Location: curl_response.js");
}
