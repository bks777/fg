/**
 * This Class explain for send action message to parent window with structures
 * @constructor
 */
export default class EventTranslationToParent {

    constructor(data = {}){

        /**
         * Global
         * @type {null}
         */
        this.global = null;

        /**
         * Size game frame
         * @type {null}
         */
        this.sizeGame = null;

        /**
         * Map access
         * @type {null}
         */
        this.mapsAccess = null;

        /**
         * Is connected with parent frame
         * @type {boolean}
         * @private
         */
        this._connected = false;
        this._connectedDomain = null;
        this._typeParentConnected = null;

        /**
         * Accessed event
         * @type {Array}|string
         * @private
         */
        this._listAccessMaps = [];

        /**
         * List of accessed events for listener
         * @type {Array}
         * @private
         */
        this._listAccessEvents = [];

        this.init(data);
    }

    /**
     * Set service data to listener
     */
    init (data = {}) {

        for(let _key in data){
            this[_key] = data[_key];
        }

        this._checkConnectWithParent();
    };

    /**
     * Check connected transfer with parent window
     * @private
     */
    _checkConnectWithParent () {

        var _data = {
            method: "init",
            data: location.protocol + "//" + location.host
        };

        try{
            this._subscribeToListener();
        } catch(e){
            $_log.error('Transfer log not subscribe to parent window...');
        }

        try{
            window.parent.postMessage(JSON.stringify(_data), "*");
            this._typeParentConnected = true;

        } catch (e){

            try{
                window.opener.postMessage(JSON.stringify(_data), "*");
                this._typeParentConnected = false;

            } catch(e){
                $_log.error('Transfer log not connected to parent window...');
            }
        }
    };

    /**
     * Subscribe for listeners event auth for log transfer
     * @private
     */
    _subscribeToListener () {
        return ;

        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        var _core = this;

        eventer(messageEvent, e => {
            var key = e.message ? "message" : "data";
            var data = JSON.parse(e[key]);

            if(data.domain && data.actions){
                this._connected = true;

                this._connectedDomain = data.domain;

                /**
                 * @type {Array|string}
                 * @private
                 */
                this._listAccessEvents = data.actions;

                if(this._listAccessEvents != "*" && ( !this._listAccessEvents || !(this._listAccessEvents instanceof Array))){
                    this._listAccessEvents = [];
                }

                $_event_translation._convertToListAccessed(this._listAccessEvents);
            }

        },false);
    };

    /**
     * Convert access methods
     * @param _list
     * @private
     */
    _convertToListAccessed (_list) {

        var _objects = Object.keys(this.mapsAccess);

        for(var _i = 0, _l = _objects.length; _i < _l; _i++){

            /**
             * Data event
             */
            var _data = this.mapsAccess[ _objects[_i] ];
            if(_list == "*" || _list.indexOf(_data.alias) != -1){
                this._listAccessMaps.push(_objects[_i]);
            }

        }

        /**
         * Sent start events data to log transfers
         */
        if(_list == "*" || _list.indexOf(this.mapsAccess["showSizeGame"].alias) != -1){
            this._setEventSize();
        }
    };

    /**
     * Sent event game size
     * @private
     */
    _setEventSize () {
        this.setLogActions("showSizeGame", this.sizeGame);
    };

    /**
     * Event data
     * @param eventName
     * @param eventData
     */
    setLogActions (eventName, eventData) {

        if(this._connected === false){
            return null;
        }

        if(typeof this._listAccessMaps == "undefined"){
            return ;
        }

        if(this._listAccessMaps.indexOf(eventName) == -1){
            return null;
        }

        setTimeout($_event_translation._send.call($_event_translation, eventName, eventData), 0);
    };

    /**
     * Send data
     * @param eventName
     * @param eventData
     * @private
     */
    _send (eventName, eventData) {

        var _data = {
            action  : this.mapsAccess[eventName].alias,
            data    : eventData
        };

        if(this._typeParentConnected === true){
            window.parent.postMessage(JSON.stringify(_data), this._connectedDomain);
        } else {
            window.opener.postMessage(JSON.stringify(_data), this._connectedDomain);
        }
    };

}