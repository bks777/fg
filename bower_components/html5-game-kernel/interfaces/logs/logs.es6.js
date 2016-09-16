/**
 * Logs Interface class
 * @constructor
 */
export default class LogApplication {

    constructor(){

        this._dev = false;

        this.time = null;

        this.traceLog = null;
        this._traceStart = false;
    }

    /**
     * Set value
     * @param value
     */
    set dev(value){
        this._dev = value;

        if(value === false){
            this.original = window.console;
            window.console = {};
        }
    }

    get dev () {
        return this._dev;
    }

    /**
     * Get value
     */
    get dev(){
        return this._dev;
    }

    /**
     * Get Time of init
     * @returns {number}
     */
    getTime () {
        var t = (new Date()).getTime();
        if(this.time === null){
            this.time = t;
        }

        return t - this.time;
    };

    /**
     * Get timelog in time mini format
     * @returns {string}
     */
    getTimeLog (t) {

        var c = 20;

        var r = "";

        if(t<1000){
            r = t + "ms";
        } else if(t>1000 && t<1000*60){
            r = (t/1000).toFixed(2) + "sec";
        } else if(t>1000*60 && t<1000*60*60){
            r = (t/1000/60).toFixed(2) + "min";
        } else {
            r = (t/1000/60/60).toFixed(2) + "hour";
        }

        if(r.length>c){
            return r;
        }

        var _c = c - r.length;

        var _r = "";
        for(var i=0; i<_c; i++){
            _r += " ";
        }

        return r + _r;
    };

    /**
     * Write log
     * @param method
     * @param args
     * @returns {null}
     */
    logWrite(method, args){

        if(this._dev === false){
            return null;
        }

        //setTimeout(()=>{

            let list = [this.getTimeLog(this.getTime()),...args];

            if(list instanceof Array){

                try{

                    console[method].apply(console, list);

                    args = null;

                } catch (e){
                    $_log.error(e);

                }
            }

        //}, 25);

    };

    /**
     * Write console.log
     */
    log (...args) {
        this.logWrite('log', args);
    };

    /**
     * Write console.error()
     */
    error (...args) {
        this.logWrite('error', args);
    };

    /**
     * Write console.warn()
     */
    warning (...args) {
        this.logWrite('warn', args);
    };

    /**
     * Write console.info()
     */
    write (...args) {
        this.logWrite('info', args);
    };

}