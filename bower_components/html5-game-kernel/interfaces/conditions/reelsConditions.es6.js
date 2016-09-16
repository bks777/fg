import ConditionInterface from "./conditionInterface.es6.js"

/**
 * Reels condition
 * @param conditions
 * @param instanceName
 * @constructor
 */
export default class ReelsConditions extends ConditionInterface {

    constructor(conditions, instanceName){
        super({});

        this.context = instanceName;

        this.parseCondition(conditions);
    }

    /**
     * Set params
     * @param params
     */
    setParams (params) {
        this.execute(params.list, params.scatter);
    };

    /**
     * Parse params
     * @param list
     * @param scatter
     */
    execute (list, scatter) {
        var _typesSymbols = {};

        // reels
        for(var _i = 0, _l = list.length; _i < _l; _i++){

            // rows
            for(var _j = 0, _lj = list[_i].length; _j < _lj; _j++){

                // condition explanation
                for(var _e = 0, _le = this.getCondition().length; _e < _le; _e++){

                    var _symbol = list[_i][_j];
                    if(this.executeCondition(_e, _symbol, _i, _j, scatter)){
                        var _data = this.getExecutive(_e);

                        if(_typesSymbols[_i] == undefined){
                            _typesSymbols[_i] = {};
                        }

                        if(_typesSymbols[_i][_j] == undefined){
                            _typesSymbols[_i][_j] = {};
                        }

                        _typesSymbols[_i][_j][_symbol] = _data[1];
                    }
                }

            }

        }

        this.runCallback(ConditionInterface._DEFAULT, list, _typesSymbols);
    };
}