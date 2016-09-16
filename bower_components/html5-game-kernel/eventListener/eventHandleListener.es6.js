/**
 * Event Listener
 * @constructor
 */
export default class EventHandleListener {

    constructor(data = {}){

        this.stateEvents = [];
        this.events = {};

        this._stop = false;

        this.postLog = null;

        this.init(data);
    }

    /**
     * Set service data to listener
     */
    init (data = {}) {
        for(let _key in data){
            this[_key] = data[_key];
        }
    };

    /**
     * Set to eventListener with callback for application
     * @param name
     * @param instanceName
     */
    setSubscriber (name, instanceName) {
        var keys = Object.keys(this.events);
        if(keys.indexOf(name) == -1){
            this.events[name] = [instanceName];
        } else if(this.events[name].indexOf(instanceName) == -1) {
            this.events[name].push(instanceName);
        }
    };

    /**
     * Set state events
     * @param name
     */
    setStateSubscriber(name){

        if(this.stateEvents.indexOf(name) == -1){
            this.stateEvents.push(name);
        }
    }

    /**
     * Pause work worker event
     */
    stopEvent () {
        this._stop = true;
    };

    /**
     * Start work worker event
     */
    startEvent () {
        this._stop = false;
    };

    /**
     * GEt all subscribers
     * @returns {{}}
     */
    getEvents () {
        return this.events;
    };

    /**
     * Unset from eventListener event from component event of application
     * @param name
     * @param instanceName
     */
    unsetSubscriber (name, instanceName) {

        var keys = Object.keys(this.events);
        var k = keys.indexOf(name);
        if(k != -1){

            var ks = this.events[name].indexOf(instanceName);

            if(ks != -1){

                var na = [];

                for(var i=0; i<this.events[name].length; i++){
                    if(this.events[name][i] != instanceName){
                        na.push(this.events[name][i]);
                    }
                }

                this.events[name] = na;
            }
        }
    };

    /**
     * Set Event to application for listening all listeners
     * @param name
     * @param _data
     * @returns {null}
     */
    setEvent (name, ..._data) {

        if(this._stop === true){
            return null;
        }

        /**
         * Execute states events
         */
        if(this.stateEvents.indexOf(name) != -1){
            $_stateMachine.setEvent(name);
        }

        /**
         * Send data to event translation service
         */
        if(typeof this.postLog == 'function'){
            this.postLog.apply(this, [name].concat(_data));
        }

        var keys = Object.keys(this.events);

        $_log.warning('EVENT: ', name, ':', _data);

        var _len = 0;

        if(keys.indexOf(name) != -1 && (_len = this.events[name].length) > 0){

            /**
             * Send for all listeners for all components application who subscribe to current event
             */

            for(let i=0; i<_len; i++){

                if(typeof window[ this.events[name][i] ] == "undefined"){
                    $_log.error(`No found class "${this.events[name][i]}" for Event -> name "${name}"`);
                    continue;
                }

                if(typeof window[ this.events[name][i] ][name + 'Event'] == "undefined"){
                    $_log.error(`No found class method "${name}Event" in class "${this.events[name][i]}"`);
                    continue;
                }

                try{

                    setTimeout(e => {

                        try{
                            $_log.write(`-> EVENT  "${name}" send to:  "${this.events[name][i]} :: ${name}Event"`);

                            window[ this.events[name][i] ][`${name}Event`].apply(window[ this.events[name][i] ], _data);

                        } catch(e){
                            $_log.error(e);
                        }

                    }, 25);

                } catch(e) {
                    //$_log.error(e);
                }
            }
        }
    };


}