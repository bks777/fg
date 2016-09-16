import GameSettingsService from "../../../../bower_components/html5-game-kernel/interfaces/services/gameSettingsService.es6.js";
import TransferJSONP from "../../../../bower_components/html5-game-kernel/interfaces/transfers/transferJSONP.es6.js";
import TransferFetch from "../../../../bower_components/html5-game-kernel/interfaces/transfers/transferFetch.es6.js";
import MemoryService from "../../../../bower_components/html5-game-kernel/interfaces/services/memoryService.es6.js";

export default class ProtocolConnect {

    constructor(settingService = {}){

        this.testCurlUrl = "http://localhost:8090/app/curl_request.php?url={0}";
        this.settingService = settingService;

        this.memory = new MemoryService();

        this._urlHash = null;

        this.testMode = false;

        this.protocol = null;

        this.countFails = 0;
        this.maxFails = $_services.getService("GameSettingsService").getSetting("max_fails");

        if(this.maxFails <= 0){
            this.maxFails = 5;
        }

        this.maxTimeout = $_services.getService("GameSettingsService").getSetting("max_timeout");

        if(this.maxTimeout <= 0){
            this.maxTimeout = 3000;
        }

        this.contextFails = null;
        this.FailsDump = null;

        this.incRequest = 0;
    }

    /**
     * Connect to transfer type data
     * @returns {*}
     */
    connectToTransfer () {

        if(this.protocol !== null){
            return this.protocol;
        }

        if(this.settingService.hasSetting("test") && this.settingService.getSetting("test")){
            //return this.protocol = new TransferJSONP(this.settingService.getSettings());
        }

        return this.protocol = new TransferFetch(this.settingService.getSettings());
    }

    /**
     * Generate hash
     * @returns {*}
     */
    generateHash () {
        return Crypto.MD5((new Date()).getTime().toString());
    };

    /**
     * Update request ID
     * @returns {*}
     */
    updateRequestID(){
        return $_component_instances.getInstance("ProtocolLuckyController", "protocol").generateRequestID();
    }

    /**
     * Get last request ID
     * @returns {number}
     */
    getLastRequestID(){
        return this.memory.get("protocolRequestID");
    }

    /**
     * Get url request
     */
    getUrlRequest () {

        if($_args.token == false) {

            if (this._urlHash === null) {
                this._urlHash = this.generateHash();
            }

            return this.settingService.getSetting("endpoint").format(
                this.settingService.getSetting("alias"), this._urlHash);
        } else {
            return decodeURIComponent($_args.endpoint);
        }
    }

    /**
     * Check request failed
     * @param data
     * @param callback
     */
    checkFailed (data, callback){
        this.clearCheckFailed();

        this.FailsDump = [data, callback];

        this.contextFails = setTimeout(() => {

            if(typeof this.FailsDump[0] != "object"){
                $_log.error('Protocol data for reconnect is not valid!', this.FailsDump);
                return null;
            }

            this.FailsDump[0].request_id = this.updateRequestID();

            if(this.incRequest > this.maxFails){
                //this.getService("PopupService").addInfoPopup("max_tries", {message: $_t.getText("Max tries to reconnect.")});
                //$_event.setEvent("showSystemInfoPopup", {message: $_t.getText("Max tries to reconnect.")});
                return null;
            }

            this.tryReconnect();
            this.incRequest++;

        }, this.maxTimeout);
    }

    /**
     * Try to reconnect
     */
    tryReconnect(){
        this.send(this.FailsDump[0], this.FailsDump[1]);
    }

    /**
     * Clear check failed
     * @private
     */
    clearCheckFailed(){

        if(this.contextFails !== null){
            clearTimeout(this.contextFails);
            this.contextFails = null;
        }
    }

    /**
     * Get cheats
     * @returns {*}
     */
    getCheats(){

        if(typeof $_shifter == "object" && typeof $_shifter.getProtocolCheats == "function"){
            return $_shifter.getProtocolCheats();
        }

        return undefined;
    }

    /**
     * Send to server
     * @param data
     * @param callback
     * @param errorCallback
     */
    send (data, callback, errorCallback) {

        this.incRequest = 0;

        this.connectToTransfer();

        /**
         * Set promise success
         */
        this.protocol.setPromiseSuccess( (json) => {
            /**
             * Response data JSON to game
             */
            if(typeof callback == "function") {

                /*if (json.request_id != this.getLastRequestID()) {
                    $_event.setEvent("showSystemInfoPopup", {message: $_t.get("Request ID is not valid!")});

                    return null;
                }*/

                this.clearCheckFailed();
                this.incRequest = 0;

                callback(json);
            }
        });

        /**
         * Set promise error
         */

        this.protocol.setPromiseError( (json) => {

            this.clearCheckFailed();

            if(this.incRequest > this.maxFails){
                debugger;
                return ;
            }

            this.checkFailed(data, callback);

            $_log.error(`Protocol error - catch`, json);

            if(typeof errorCallback == "function"){
                errorCallback(json);
            }
        });


        if(data.command == "play"){

            /**
             * Set cheat
             * @type {*}
             */
            let cheats = this.getCheats();
            if(cheats !== undefined && ["respin", "freespin_stop", "bonus_stop"].indexOf(data.action.name) == -1){
                data.action.params.hack = cheats;
            }

        }

        //this.checkFailed(data, callback);
        this.protocol.send(this.getUrlRequest(), data);
    }
}