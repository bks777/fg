import SignalRouterInterface from "../interface/signalRouterInterface.es6.js";
import SignalReducer from "../reducer/signalReducer.es6.js"

var _stateData = {};

var _METHODS = "m";
var _EXECUTE_SIGNALS = "x";
var _EXECUTE_ORDERS = "o";
var _EVENTS = "e";
var _FLAGS = "f";
var _SERVICES = "s";

var _DEFAULT_ORDERS = ["services", "executeStates", "flags", "methods", "events"];

/**
 * State Router
 */
export default class SignalRouter extends SignalRouterInterface {

    constructor(data = {}){
        super(data);

        this.history = $_signal_history;

        this._hidden = false;

        this.reducer = new SignalReducer(this);
    }

    /**
     * To to data state
     * @param namespace
     * @param args
     * @returns {null}
     */
    goTo (namespace = null, ...args) {
        //$_log.error("goto", namespace, args);

        let changeHistory = false;

        namespace = this._findVariableState(namespace);
        namespace = this.shortNamespace(namespace);

        [namespace, changeHistory] = this._lastState(namespace, args);

        var _routerData = this.checkReduce(namespace, args);

        if(changeHistory === true){
            this.writeLastHistory(namespace, args);
        }

        if(_routerData === false){
            $_log.error(`Reducer is blocked state - ${namespace} after execute current state of "${this.history.getLastAlias()}"`);
            return null;
        }

        if(!this._hidden){
            $_log.log.apply($_log, ([`-- SIGNAL: ${namespace} `, ...args]));
        }

        if(!_routerData){
            $_log.error(`Router with "${namespace}" namespace not found!`);
            return null;
        }

        /**
         * Execute actions
         */
        this.executeActions (_routerData, args);
    };

    exec(namespace = null, ...args){

        this._hidden = true;

        this.goTo.apply(this, [namespace,...args]);

        this._hidden = false;
    }

    /**
     * Find short namespace
     * @param namespace
     * @returns {*}
     */
    shortNamespace (namespace = null){

        if((namespace.indexOf('.') !== 0 && namespace.indexOf('..') == -1) || this.history.empty()){
            return namespace;
        }

        let [currAlias, currParent, currChild] = this.history.getLastAlias().split('.');
        let [alias, parent, child] = namespace.split('.');

        /**
         * If $_signal.goTo("...");
         */
        if(!child && !parent && !alias){
            return `${currAlias}.${currParent}.${currChild}`;
        } else
        /**
         * If $_signal.goTo("..child");
         */
        if(child && !parent && !alias){
            return `${currAlias}.${currParent}.${child}`;
        } else
        /**
         * If $_signal.goTo(".parent");
         */
        if(!child && parent && !alias){
            return `${currAlias}.${parent}`;
        } else

        /**
         * If $_signal.goTo(".parent.child");
         */
        if(child && parent && !alias){
            return `${currAlias}.${parent}.${child}`;
        } else
        /**
         * If $_signal.goTo("parent..child")
         */
        if(child && !parent && alias){
            return `${alias}.${currParent}.${child}`;
        }


        $_log.error(`No found child "${namespace}" of history`);

        return namespace;
    }

    /**
     * Find variable in state
     * @param namespace
     * @returns {*}
     * @private
     */
    _findVariableState(namespace){

        if(namespace.indexOf("{") == -1){
            return namespace;
        }

        let protocolNextAction = $_services.getService("ProtocolService").getProtocolNextAction();

        if(namespace.indexOf("{protocolNextAction}") != -1){
            return namespace.replace("{protocolNextAction}", protocolNextAction);
        }

        let nextAction = $_services.getService("ProtocolService").getNextAction();

        if(namespace.indexOf("{nextAction}") != -1){
            return namespace.replace("{nextAction}", nextAction);
        }

        let currentAction = $_services.getService("ProtocolService").getCurrentAction();

        if(namespace.indexOf("{currentAction}") != -1){
            return namespace.replace("{currentAction}", currentAction);
        }

        $_log.error(`Not found variable in state execute! In state -> ${namespace}`);

        return ;
    }

    /**
     * If program execute route
     * @param namespace
     * @param args
     * @returns {*}
     */
    _lastState (namespace, args){

        let changeHistory = false;

        if(namespace.indexOf('+') == 0){
            namespace = namespace.substr(1);
        }

        if(namespace.indexOf('!+') == 0){
            namespace = namespace.substr(2);
        }

        if(namespace.indexOf('!') == 0 || namespace.indexOf('-') == 0){
            namespace = namespace.substr(1);
        } else {
            changeHistory = true;
        }

        return [namespace, changeHistory];
    }

    /**
     * Write last history
     * @param namespace
     * @param args
     */
    writeLastHistory(namespace, args){
        this.history.push(namespace, args);

        $_log.warning(` =>=>=>=>= Change CURRENT SIGNAL to -> ${namespace}`);
    }

    /**
     * Check for reduce methods
     * @param namespace
     * @param args
     * @returns {*}
     */
    checkReduce (namespace, args){

        let data = this.getRouter(namespace);

        if(namespace.indexOf('!') == 0 || this.history.empty()){
            return data;
        }

        if(data === null){
            return null;
        }

        if(data.reducers === undefined || this.reducer === null){
            return data;
        }

        this.reducer.lastReduce = namespace;

        if(this.reducer.execute(data.reducers.type, data.reducers.execute, args) === true){
            return false;
        }

        return data;
    }

    /**
     * Execute actions
     * @param _routerData
     * @param args
     * @returns {null}
     */
    executeActions (_routerData, args){
        var _listOrders = getClone(_DEFAULT_ORDERS);

        try{

            /**
             * Use custom list of executes
             */
            if(this.getArrayType(_routerData, _EXECUTE_ORDERS) !== null){
                _listOrders = _routerData[_EXECUTE_ORDERS];
            }

            for(var i = 0, l = _listOrders.length; i < l; i++){

                var _methodName = `_${_listOrders[i]}Execute`;

                if(typeof this[_methodName] != 'function'){
                    $_log.error(`Method "${_methodName}" in SIGNAL Router not found!`);
                    return null;
                }

                this[_methodName](_routerData, args);
            }

        } catch(e){
            $_log.error(e);
        }
    }

    /**
     * Execute FLAGS
     * @param _routerData
     * @param _args
     * @private
     */
    _flagsExecute (_routerData, _args) {

        if(this.getArrayType(_routerData, _FLAGS) === null){
            return ;
        }

        var _length = _routerData[_FLAGS].length;

        for(var _j = 0; _j < _length; _j++){
            if(!this._hidden){
                $_log.log('SET SIGNAL -> _FLAGS', _routerData[_FLAGS][_j][0], this._parseBoolean(this._getArguments(_args, _routerData[_FLAGS][_j][1])));
            }

            HelperFlags.set(_routerData[_FLAGS][_j][0], this._parseBoolean(this._getArguments(_args, _routerData[_FLAGS][_j][1])), HelperFlags.GLOBAL);
        }
    };

    /**
     * Execute METHODS
     * @param _routerData
     * @param _args
     * @private
     */
    _methodsExecute (_routerData, _args) {

        if(this.getArrayType(_routerData, _METHODS) === null){
            return ;
        }

        var _length = _routerData[_METHODS].length;

        for(var _i = 0; _i < _length; _i++){
            var _ev = _routerData[_METHODS][_i];

            if(_ev.length == 0){
                return ;
            }

            if(_ev[0].indexOf("::") == -1){
                var _e = _ev[0].split('.');

                var _context = window[_e[0]];

                if(_routerData[_METHODS][_i][1] !== undefined && _routerData[_METHODS][_i][1].length > 0){

                    if(!this._hidden){
                        $_log.log(`SET SIGNAL -> _METHODS => "${_e[0]}::${_e[1]}"`, _args, this._getArguments(_args, _routerData[_METHODS][_i][1]));
                    }

                    if(typeof _context[_e[1]] == "function"){
                        _context[_e[1]].apply(_context, this._getArguments(_args, _routerData[_METHODS][_i][1]));
                    } else {
                        $_log.error(`Can not find method - "${_e[0]}::${_e[1]}" in Class!`);
                    }

                } else {

                    if(!this._hidden){
                        $_log.log(`SET SIGNAL -> _METHODS => "${_e[0]}::${_e[1]}"`);
                    }

                    if(typeof _context[_e[1]] == "function"){
                        _context[_e[1]]();
                    } else {
                        $_log.error(`Can not find method - "${_e[0]}::${_e[1]}" in Class!`);
                    }

                }

            }

        }
    };


    /**
     * Execute SERVICES
     * @param _routerData
     * @param _args
     * @private
     */
    _servicesExecute (_routerData, _args) {

        if(this.getArrayType(_routerData, _SERVICES) === null){
            return ;
        }

        var _length = _routerData[_SERVICES].length;

        for(var _i = 0; _i < _length; _i++){
            var _ev = _routerData[_SERVICES][_i];

            if(_ev.length == 0){
                return ;
            }

            var _e = _ev[0].split('.');

            var _context = $_services.getService(_e[0]);

            if(_context === null){
                $_log.error(`State for "getService('${_e[0]}')" not found!`);
                return null;
            }

            if(_routerData[_SERVICES][_i][1] !== undefined && _routerData[_SERVICES][_i][1].length > 0){

                if(!this._hidden){
                    $_log.log(`SET SIGNAL -> _SERVICES => "${_e[0]}::${_e[1]}"`, _args, this._getArguments(_args, _routerData[_SERVICES][_i][1]));
                }

                if(typeof _context[_e[1]] == "function"){
                    _context[_e[1]].apply(_context, this._getArguments(_args, _routerData[_SERVICES][_i][1]));
                } else {
                    $_log.error(`Can not find method - "${_e[0]}::${_e[1]}" in Class!`);
                }

            } else {

                if(!this._hidden){
                    $_log.log(`SET SIGNAL -> _SERVICES => "${_e[0]}::${_e[1]}"`);
                }

                if(typeof _context[_e[1]] == "function"){
                    _context[_e[1]]();
                } else {
                    $_log.error(`Can not find method - "${_e[0]}::${_e[1]}" in Class!`);
                }

            }

        }
    };

    /**
     * Execute EVENTS
     * @param _routerData
     * @param _args
     * @private
     */
    _eventsExecute (_routerData, _args) {

        if(this.getArrayType(_routerData, _EVENTS) === null){
            return ;
        }

        var _length = _routerData[_EVENTS].length;

        for(var _u = 0; _u < _length; _u++){

            if(!this._hidden){
                $_log.log('SET SIGNAL -> _EVENTS', _routerData[_EVENTS][_u][0], this._parseBoolean(this._getArguments(_args, _routerData[_EVENTS][_u][1])));
            }

            $_event.setEvent.apply($_event, [_routerData[_EVENTS][_u][0], ...this._getArguments(_args, _routerData[_EVENTS][_u][1])]);
        }
    };

    /**
     * Execute SIGNALS
     * @param _routerData
     * @param _args
     * @private
     */
    _executeStatesExecute (_routerData, _args) {

        if(this.getArrayType(_routerData, _EXECUTE_SIGNALS) === null){
            return ;
        }

        var _length = _routerData[_EXECUTE_SIGNALS].length;

        for(var _u = 0; _u < _length; _u++){

            if(!this._hidden){
                $_log.log(`SET SIGNAL -> _SIGNALS => "${_routerData[_EXECUTE_SIGNALS][_u][0]}"`, this._getArguments(_args, _routerData[_EXECUTE_SIGNALS][_u][1]));
            }

            this.goTo.apply(this, [ `!${_routerData[_EXECUTE_SIGNALS][_u][0]}`, ...this._getArguments(_args, _routerData[_EXECUTE_SIGNALS][_u][1]) ]);
        }
    };

    /**
     * Get arguments function and send to closures or events or flags
     * @param args
     * @param list
     * @returns {Array}
     * @private
     */
    _getArguments (args, list) {

        var _data = [];

        if(!(list instanceof Array) || (!(list instanceof Array) && list.length == 0)){
            return _data;
        }

        for(var _i = 0, _l = list.length; _i < _l; _i++){
            if(typeof list[_i] == "number"){
                _data.push(args[ list[_i] ]);
            } else {
                _data.push(this._parseBoolean(list[_i]));
            }
        }

        return _data;
    };

    /**
     * Get array type
     * @param routerData
     * @param type
     * @returns {*}
     */
    getArrayType(routerData, type){

        if(routerData === null || routerData[type] === undefined){
            return null;
        }

        if(!(routerData[type] instanceof Array) || routerData[type].length == 0){
            return null;
        }

        return routerData[type];
    }


    /**
     * Parse boolean data
     * @param string
     * @returns {*}
     * @private
     */
    _parseBoolean (string) {
        try{
            return JSON.parse(string);
        } catch (e){
            return string;
        }
    };

    /**
     * Go to back state
     */
    back () {
        if(this.history.empty()){
            return null;
        }

        let history = this.history.getLast();

        try{
            this.goTo.apply(this, [history.alias, ...history.args ] );
        } catch(e){
            $_log.error("Error in back forward state", e);
        }

    };

}