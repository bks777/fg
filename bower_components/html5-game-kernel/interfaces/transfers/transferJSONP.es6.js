import TransferInterface from "./transferInterface.es6.js";

export default class TransferJSONP extends TransferInterface {

    constructor(data = {}) {
        super(data);

        this.jsonpLink = this.actionCurlUrl;

        this.instanceName = `$_transfer_JSONP_${this.createCountOfInstance()}`;

        /**
         * Create instance in window scope for callbacks
         * @type {TransferJSONP}
         */
        window[this.instanceName] = this;

        this.cacheScript = null;
    }

    /**
     * Create script for send async data to server
     * @param url
     * @param data
     * @param method
     * @private
     */
    _createScript (url = null, data = {}, method = "post") {
        this.cacheScript = document.createElement("script");
        this.cacheScript.type = "text/javascript";
        this.cacheScript.async = true;
        this.cacheScript.onerror = this.error.bind(this);
        this.cacheScript.src = `${this.jsonpLink.format(url)}&type=JSONP&callback=${this.instanceName}.callback&method=${method}&data=${encodeURIComponent(JSON.stringify(data))}`;
        document.body.appendChild(this.cacheScript);
    }

    /**
     * Clean script for jsonp
     * @private
     */
    _cleanScript () {
        if(this.cacheScript !== null){
            document.body.removeChild(this.cacheScript);
            this.cacheScript = null;
        }
    }

    /**
     * Check status from protocol response
     * @param response
     * @returns {*}
     * @private
     */
    _checkStatusProtocol (response) {
        if(response != null && response.status !== undefined && response.status.code == "OK"){
            return true;
        } else if(response != null && this.ifStatusRestart(response.status.code)) {
            $_signal.goTo('!popup.errors.system', {message: $_t.get(response.status.code), name: "protocol"});
            $_log.error(`Response - "protocol" error - Status: code - ${response.status.code}, message: ${response.status.message}`);
        } else {
            $_signal.goTo('!popup.errors.system', {message: $_t.get("problem with player's Internet connection"), name: "protocol"});
        }

        return false;
    }

    /**
     * Send data to server
     * @param url
     * @param data
     * @param type
     */
    send (url = null, data = null, type = TransferInterface.TYPE_POST) {
        this._createScript(url, data, type.toLowerCase());
    }

    /**
     * Callback
     * @param response
     */
    callback (response) {
        this._cleanScript();

        if(this.noStatus === undefined && this._checkStatusProtocol(response) && this.promiseSuccess !== null){
            $_signal.goTo('!popup.errors.hideSystem', {name: "protocol"});
            this.promiseSuccess(response);
        }
    }

    /**
     * Error callback
     * @param response
     */
    error(response){

        if(response){
            this._checkStatusProtocol(response);
        } else {
            $_signal.goTo('!popup.errors.system', {message: $_t.getText("404"), name: "protocol"});
        }

        this.promiseError(response);
    }

}