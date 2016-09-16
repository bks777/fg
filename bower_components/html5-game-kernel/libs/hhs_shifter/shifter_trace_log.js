/**
 * Shifter trace log with websockets
 * Maked for debug mobile phones
 * @constructor
 */
var HHSShifterTraceLog = function()
{
    this.port = 5001;
    this.path = "http://" + (location.origin.replace("http://", "").split(":")[0]);

    this._ws = null;

    var _enableSocket = false;

    var _traceToProtocol = false;
    var _traceToConsole = false;

    var _traceFunction = null;

    this._controllTrace = {
        "refresh;": "window.location.reload();"
    };

    /**
     * Init Trace
     * @param data
     */
    this.init = function (data)
    {
        for(var _key in data){
            this[_key] = data[_key];
        }
    };

    /**
     * Connect to server
     */
    this.connect = function()
    {
        var host = this.path.replace(/^http/, 'ws') + ":" + this.port;

        try{

            if(typeof MozWebSocket == 'undefined'){
                this._ws = new WebSocket(host);
            } else {
                this._ws = new MozWebSocket(host);
            }

            this._ws.onmessage = $_shifter.trace._writeToConsole;
            /*this._ws.onmessage = function (e) {
             try{
             (e);
             } catch(e){
             console.log("!!", e);
             }
             };*/

            this._ws.onclose = $_shifter.trace._writeClose;
            this._ws.onerror = $_shifter.trace._writeError;
            this._ws.onopen = $_shifter.trace._writeOpen;

        } catch(e){
            alert("Current browser not support WebSocket!!");
            console.log('ERROR WEBSOCKET', e);
        }


    };

    /**
     * Close connections
     */
    this.close = function()
    {
        $_log.traceLog = null;
        _traceFunction = null;

        _traceToProtocol = false;
        _traceToConsole = false;
    };

    /**
     * Transmit trace to server
     */
    this.transmit = function()
    {
        _traceToProtocol = true;

        if(_traceFunction == null){
            _traceFunction = true;

            $_log.traceLog = $_shifter.trace._sendToProtocol;

            /**
             * Rewrite command error
             */
            window.console.error = function(e) {
                $_shifter.trace._sendToProtocol('error', {
                    message: e.message,
                    name: e.name,
                    filename: e.fileName,
                    line: e.lineNumber,
                    column: e.columnNumber,
                    stack: e.stack
                });
            };

            window.console.log = function(){
                $_shifter.trace._sendToProtocol('log', arguments);
            };
        }
    };

    /**
     * Received logs from server to console log current device
     */
    this.receive = function()
    {
        _traceToConsole = true;

        $('#' + $_shifter._id_block).append($_shifter.template.render('traceConsole'));

        console.clear();

        var _input = $('#_trace_console');

        var _controllKeys = Object.keys(this._controllTrace);

        var _textLast = _input.text(); var _send = false;

        _input.bind("keydown", function (e) {
            if(e.ctrlKey && e.keyCode == 13){

                _textLast = _input.text();

                if(_controllKeys.indexOf($.trim(_textLast)) != -1){
                    $_shifter.trace._ws.send($_shifter.trace._JSONStringify(["control", $.trim(_textLast)]));
                } else {
                    $_shifter.trace._ws.send($_shifter.trace._JSONStringify(["console", _textLast]));
                }

                _input.text("");
                _send = true;

            } else if(e.keyCode == 38 && _input.text() == "") {
                _input.text(_textLast);
            } else {
                _send = false;
            }

        })
    };


    /**
     * Realization
     */

    /**
     * Converter from object TO string
     * @param obj
     * @returns {*}
     * @private
     */
    this._JSONStringify = function(obj)
    {
        return JSON.stringify(obj,function(key, value) {
            return (typeof value === 'function' ) ? value.toString() : value;
        });
    };

    /**
     * Convert from string to object
     * @param str
     * @returns {*}
     * @private
     */
    this._JSONParse = function(str)
    {
        return JSON.parse(str,function(key, value){
            if(typeof value != 'string') return value;
            return ( value.substring(0,8) == 'function') ? eval('('+value+')') : value;
        });
    };

    /**
     * Write to console
     * @param e
     * @private
     */
    this._writeToConsole = function(e)
    {
        var data = $_shifter.trace._JSONParse(e.data);

        if(_traceToConsole === true && data[0] == "log"){

            //console.log('!!!', data);

            if(typeof data[2] == 'string' || (typeof data[2] == 'object' && !(data[2] instanceof Array))){
                console[data[1]](data[2]);
            } else {
                console[data[1]].apply(console, data[2]);
            }
        }

        if(_traceToConsole === false && data[0] == "control"){
            eval($_shifter.trace._controllTrace[data[1]]);

            if(data[1] == "refresh;"){
                $_shifter._listCookies["_trace_connect"] = "1";

                ModelMemory.set($_shifter._memoryName, JSON.stringify($_shifter._listCookies), ModelMemory.LOCAL_STORAGE);
            }
        }

        if(_traceToConsole === false && data[0] == "console"){
            try{
                eval(data[1]);
            } catch(e){
                $_shifter.trace._sendToProtocol("error", {
                    message: e.message,
                    name: e.name,
                    filename: e.fileName,
                    line: e.lineNumber,
                    column: e.columnNumber,
                    stack: e.stack
                });
            }
        }
    };

    /**
     * Write to close socket
     * @param e
     * @private
     */
    this._writeClose = function(e)
    {
        _enableSocket = false;
        console.log("TRACE CLOSE" + (e.reason ? ":     " + e.reason : ""));

        setTimeout(function () {
            this.connect();
        }.bind(this), 50);
    };

    /**
     * Write to open socket
     * @param e
     * @private
     */
    this._writeOpen = function(e)
    {
        _enableSocket = true;
        console.log("TRACE OPEN" + (e.reason ? ":     " + e.reason : ""));
    };

    /**
     * Write errors by socket
     * @param e
     * @private
     */
    this._writeError = function(e)
    {
        console.error("TRACE ERROR" + (e.error ? ":     " + e.error : ""));
    };

    /**
     * Send to protocol
     * @param type
     * @param list
     * @private
     */
    this._sendToProtocol = function(type, list)
    {
        if(_traceToProtocol === true){
            try{
                $_shifter.trace._ws.send($_shifter.trace._JSONStringify(["log", type, list]));
            } catch(e){
                $_log.error("Sent to protocol ERROR", e);
            }

        }
    };
};