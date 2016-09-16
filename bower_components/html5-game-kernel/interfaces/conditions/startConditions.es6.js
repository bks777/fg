import ConditionInterface from "./conditionInterface.es6.js";

/**
 * Reels condition
 * @param conditions
 * @param instanceName
 * @constructor
 */
export default class StartConditions extends ConditionInterface {

    constructor(conditions, instanceName){
        super({});

        this.context = instanceName;

        this.parseCondition(conditions);
    }

    /**
     * Parse params
     */
    execute () {
        var _typeStart = null;
        // condition explanation
        for(var _e = 0, _le = this.getCondition().length; _e < _le; _e++){

            if(this.executeCondition(_e)){
                var _data = this.getExecutive(_e);
                if(_data instanceof Array && _data[0] !== undefined){
                    _typeStart = _data[0];
                    break;
                }
            }
        }

        if(_typeStart === null){
            $_log.error("Can not check type of application headers");
            return null;
        }

        this.runCallback(_typeStart);
    };
}