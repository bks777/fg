import TransferInterface from "./transferInterface.es6.js";
import ComponentInterface from "./../../interfaces/component/componentInterface.es6";

let core;

export default class TransferFetch extends TransferInterface {

    constructor(data = {}){
        super(data);

        this._requestTimeout = null;
        this._timeRequestTimeout = 10 * 1000;

        core = this;

        this._noInternetMessage = "problem with player's Internet connection";

        this._startGameError = false;

        this.requestID = null;


        this._timeLastSuccessRequest = 0;
        this._noInternetFlag = false;
        this._timeMaxLastRequest = 10 * 1000;
        this._timeMaxFailRequest = 60 * 1000;

        this.component = new ComponentInterface();

        /*const oldfetch = self.fetch;
        this.fetch = function(input, opts) {
            return new Promise((resolve, reject) => {
                setTimeout(()=>{
                    reject((new Error()).response = "500");
                }, 10 * 1000);
                oldfetch(input, opts).then(resolve, reject);
            });
        }*/
    }

    /**
     * Check status
     * @param response
     * @returns {*}
     */
    checkStatusResponse (response) {

        if(response.status == 503){
            throw new Error(503);
        }

        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            $_log.error(`Response error - StatusCode : ${response.status}`, response.statusText);

            core.clearRequestTimeout();

            let error = new Error(response.status);
            error.response = response.status.toString();

            //core._timeLastSuccessRequest = +new Date();

            throw error;
        }
    };

    /**
     * Parse JSON
     * @param response
     * @returns {*}
     */
    parseJSON (response) {
        return response.json();
    }

    /**
     * Check status from protocol response
     * @param response
     * @returns {*}
     */
    checkStatusProtocol (response, reject) {
        if(response !== null && response.status !== undefined && response.status.code == "OK") {
            return response;
        }
        else if (response.status.code !== "OK"){

            core._timeLastSuccessRequest = +new Date();
            core._noInternetFlag = false;

            let error = new Error(response.status.code);
            error.message = response.status.message;
            error.response = response.status.code;
            error.type = response.status.type;
            error.data = response;
            throw error;
        } else if(response != null){
            throw new Error($_t.get(response.status.code));
        } else {
            let error = new Error("404");
            error.response = core._noInternetMessage;
            throw error;
        }

        return response;
    }

    /**
     * Check protocol errors
     * @param response
     */
    checkProtocolError(response){

        if(response.context === null && response.status.code == "OK"){
            let error = new Error();
            error.message = null;
            error.response = "API_PROTOCOL_ERROR";
            error.type = "crit";
            error.data = response;

            throw error;
        }

        return response;
    }

    /**
     * Clear request timeout
     */
    clearRequestTimeout(hide = true){

        if(hide && !core._noInternetFlag){
            $_services.getService("PopupService").removeInfoPopup("internet");
            $_services.getService("PopupService").removeInfoPopup("protocol");

            $_services.getService("PopupService").removeErrorPopup("protocol");
            $_services.getService("PopupService").removeErrorPopup("internet");

            $_services.getService("PopupService").removeErrorPopup("server");
        }

        if(this._requestTimeout !== null){
            clearTimeout(this._requestTimeout);

            this._requestTimeout = null;
        }
    }

    /**
     * Request timeout
     */
    requestTimeout(){

        this._requestTimeout = setTimeout(()=>{
            if(!$_services.getService("PopupService").hasCritError()){
                $_services.getService("PopupService").addInfoPopup("internet", { message: $_t.getText(core._noInternetMessage),name: `protocol-nocrit`});
            }

        }, this._timeRequestTimeout);
    }

    /**
     * Send data to server
     * @param url
     * @param data
     * @param type
     */
    send (url = null, data = null, type = TransferInterface.TYPE_POST) {

        /**
         * If start game protocol send error in start - blocked game
         */
        if(this._startGameError){
            return ;
        }

        this.clearRequestTimeout(false);

        this.requestTimeout();

        self.fetch(
            url,
            {
                method: type,
                /*headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },*/
                //credentials: 'same-origin',
                //mode: 'no-cors',
                body: JSON.stringify(data)
            }
            )
            .then(this.checkStatusResponse)
            .then(this.parseJSON)
            //.then(this.ifStatusRestart)
            .then(this.checkStatusProtocol)
            //.then(this.checkProtocolError)
            .then((response)=>{

                core._timeLastSuccessRequest = +new Date();
                core._noInternetFlag = false;

                //$_services.getService("PopupService").removeInfoPopup("server");

                $_services.getService("PopupService").removeInfoPopup("internet");

                core.clearRequestTimeout();
                //$_signal.exec('!popup.errors.hideAllSystem');

                return response;
            })
            .then(this.promiseSuccess)
            .catch(this.protocolError);
    }

    /**
     * Must be
     * @param response
     */
    error(response){
        core.protocolError(response);
    }

    /**
     * Error callback
     * @param response
     */
    protocolError(response){

        core.clearRequestTimeout();

        if(response instanceof TypeError){
            response.response = core._noInternetMessage;

            core.requestTimeout();
        }

        if(response.response === "RESTART"){

            HelperFlags.set("noSpin", true);

            if(response.data && response.data.freebet){

                core.component.getStateComponent("FREEBETS").setFinished();

            } else if(response.data && !response.data.freebet){

                if(!core.component.getStateComponent("FREEBETS").isFinished()){
                    core.component.getStateComponent("FREEBETS").setDeleted();
                }

                return ;
            }

            core.promiseSuccess(response.data);
            return ;
        }

        HelperFlags.set("noSpin", null);

        $_log.warning('no internet', $_log.getTimeLog(((+new Date()) - core._timeLastSuccessRequest)));

        /**
         * If internet connection was fail and session was closed
         */
        if(core._timeLastSuccessRequest < ((+new Date()) - core._timeMaxFailRequest)){
            $_services.getService("PopupService").removeInfoPopup("internet");
            $_services.getService("PopupService").addErrorPopup("internet", {message: $_t.get("PLAYER_DISCONNECTED")});

            core._startGameError = true;
            core._noInternetFlag = true;

            core.promiseError(response.data);
            return ;
        }

        /**
         * If internet connection was failed but session was available
         */
        if(core._timeLastSuccessRequest < ((+new Date()) - core._timeMaxLastRequest)){

            if(!$_services.getService("PopupService").hasCritError()){
                $_services.getService("PopupService").addInfoPopup("internet", { message: $_t.getText(core._noInternetMessage),name: `protocol-nocrit`});
            }

            core._noInternetFlag = true;

            core.promiseError(response.data);
            return ;
        }

        if(response.response == core._noInternetMessage){
            core.promiseError(response.data);
            return ;
        }

        if(response.response == "PLAYER_DISCONNECTED"){
            core._startGameError = true;
        }

        if(response instanceof Error){
            if(response.type == "crit"){
                core._startGameError = true;
                $_services.getService("PopupService").removeInfoPopup("internet");
                $_services.getService("PopupService").addErrorPopup("server", {message: $_t.get(response.response, response.message)});
                core.promiseError(response.data);
            } else {
                $_services.getService("PopupService").addInfoPopup("server", {message: $_t.get(response.response, response.message)});
                core.promiseSuccess(response.data);
                return ;
            }
        }


        if(response.data && response.data.command == "start" && response.type == "crit"){
            core._startGameError = true;
            return false;
        }

        /**
         * If error but with action data - need execute
         */
        if(response instanceof Error && response.data && response.data.context){
            core.promiseSuccess(response.data);
        }

        core.promiseError(response);
    }
}