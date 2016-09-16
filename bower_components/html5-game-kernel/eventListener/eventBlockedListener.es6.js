/**
 * Event listener for blocked and unlocked elements in application with some event for block and unblock
 * @constructor
 */
export default class EventBlockedListener {

    constructor(){
        /**
         * Listeners for activate elements game or not active elements game
         * @type {Object}
         * @private
         */
        this._listeners = {};

        this._lastEvent = {};
    }

    /**
     * Set handlers who work where
     * @param name
     * @param callbackBlock
     * @param callbackResume
     * @param {null|Object} objectClass
     */
    addListeners (name, callbackBlock, callbackResume, objectClass) {

        if(typeof this._listeners[name] == 'undefined'){
            this._listeners[name] = {
                block : callbackBlock,
                resume: callbackResume,
                owner : objectClass
            };
        }
    };

    /**
     * Unset listeners for change elements by activate fullscreen in ios 9
     * @param name
     */
    removeListeners (name) {

        if(typeof  this._listeners[name] != 'undefined'){

            var _n = {};

            for(let _k in this._listeners){

                if(_k != name){
                    _n[_k] = this._listeners[_k];
                }
            }

            this._listeners = _n;
        }

    };

    /**
     * Set action for handler change listeners
     * @param type
     * @returns {null}
     */
    setEvent (type) {

        var _list = Object.keys(this._listeners);

        if(_list.length == 0){
            return null;
        }

        for(var _i = 0, _l = _list.length; _i < _l; _i++){

            if(typeof this._lastEvent[ _list[_i]] != 'undefined' && this._lastEvent[ _list[_i]] == type){
                return null;
            }

            this._lastEvent[ _list[_i]] = type;

            var _el = _listeners[ _list[_i]];

            try{
                switch (type){
                    case 1:
                        if(typeof _el.resume == 'function'){
                            _el.resume(_el.owner ? _el.owner : null);
                        }
                        break;

                    case 0:
                    default:

                        if(typeof _el.block == 'function'){
                            _el.block(_el.owner ? _el.owner : null);
                        }
                }
            } catch(e){
                $_log.error("Can not explain: ", e);
            }
        }
    };
}