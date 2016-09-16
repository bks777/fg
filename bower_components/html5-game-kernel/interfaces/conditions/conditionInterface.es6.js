/**
 * Condition interface
 * @constructor
 */
export default class ConditionInterface {

    static get _DEFAULT () {  return "default";   }

    constructor(data = {}){

        this.context = null;

        this.condition = [];
        this.executives = [];
        this.params = [];

        this._lastID = 0;

        this._bufferDataCondition = [];

        this._callbacksStatement = {};
    }

    /**
     * Parse condition
     * @param listConditions
     * @param def
     */
    parseCondition (listConditions, def = {}) {

        for(var i in listConditions){

            var _params = listConditions[i].params !== undefined ? listConditions[i].params.join(',') :
                (def.params !== undefined ? (def.params instanceof Array ? def.params.join(",") : def.params) : '');

            var _condition = listConditions[i].condition !== undefined ? listConditions[i].condition : 'false';
            var _exec = listConditions[i].exec !== undefined ? listConditions[i].exec : (def.exec !== undefined ? def.exec : null);

            this.params.push(_params.split(','));
            this.executives.push(_exec);
            this.condition.push(new Function(_params, 'return ' + this._parseFlagsInString(_condition)));
        }
    };

    /**
     * Get params
     * @param id
     * @returns []
     */
    getParams (id = this._lastID) {
        return this.params[id] == undefined ? [] : this.params[id];
    };

    /**
     * Get condition functions
     * @returns {Array}
     */
    getCondition () {
        return array_range(0,this.condition.length, 1);
    };

    /**
     * Get executives
     * @param id
     * @returns {null}
     */
    getExecutive (id) {
        this._lastID = id;
        return this.executives[id] == undefined ? null : this.executives[id];
    };

    /**
     * Parse string with condition and rewrite method get and set global flags
     * @param str
     * @returns {*}
     * @private
     */
    _parseFlagsInString (str) {

        var re = /global\.(.*?)(\s{1})/g;
        var m;

        while ((m = re.exec(str)) !== null) {

            str = str.replace(m[0], "HelperFlags.getGlobal(\""+m[1]+"\")");

            if (m.index === re.lastIndex) {
                re.lastIndex++;
            }
        }
        return str;
    };

    /**
     * Run condition
     * @param idCondition
     * @param args
     * @returns {*}
     */
    executeCondition (idCondition, ...args) {

        this._bufferDataCondition = args;

        try{
            return this.condition[idCondition].apply(null, args);
        } catch(e){ $_log.error('Error Condition', e);
            return false;
        }
    };

    /**
     * Find arguments and replace with rules
     * @param args
     * @param data
     * @returns {Array}
     */
    parseArguments (args, data) {

        var _startParams = this.getParams(null);

        var re = /{([^\{\}]*.[^\{\}]*)}/gmi;

        var _args = [];
        for(var _o = 0, _ol = args.length; _o < _ol; _o++){

            if(typeof args[_o] == "string" && args[_o].indexOf('{') != -1){

                var _str = args[_o];
                var m;

                while ((m = re.exec(_str)) !== null) {
                    if (m.index === re.lastIndex) {
                        re.lastIndex++;
                    }

                    var _func = new Function(_startParams, 'return ' + m[1]);
                    _str = _str.replace(m[0], _func.apply(null, data));
                }

                _args.push(_str);
            } else {
                _args.push(args[_o]);
            }
        }

        return _args;
    };

    /**
     * Set callback for expresion
     * @param idCallback
     * @param callbackStatements
     */
    setCallback (idCallback, callbackStatements) {
        this._callbacksStatement[idCallback] = callbackStatements;
    };

    /**
     * Run callback
     * @param idCallback
     * @param args
     * @returns {null}
     */
    runCallback (idCallback, ...args) {

        if(this._callbacksStatement[idCallback] == undefined){
            return null;
        }

        /**
         * Run callback with parameters
         */
        this._callbacksStatement[idCallback].apply(
            this.context !== null ? (window[this.context] != undefined ? window[this.context] : null) : null,
            args
        );

    };
}
