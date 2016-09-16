import TransferJSONP from "./transferJSONP.es6.js";

export default class TransferShifter {

    constructor(){

        this.protocol = new TransferJSONP({actionCurlUrl: "http://localhost/game_kernel_v2_creates/app/curl_request.php?url={0}"});
    }


}