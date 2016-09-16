import ConditionInterface from "./conditionInterface.es6.js"

/**
 * Reels condition
 * @param conditions
 * @param instanceName
 * @constructor
 */
export default class ReelsAnimationConditions extends ConditionInterface {
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
        this.execute(params.list, params.countWin, params.reels, params.scatter);
    };

    /**
     * Parse params
     * @param list
     * @param countWin
     * @param reels
     * @param scatter
     */
    execute (list, countWin, reels, scatter) {
        var _newArray = [];

        for(var _i = 0, _l = list.length; _i < _l; _i++){

            var _position = list[_i];
            var _count = countWin[_i][0];
            var _countWin = countWin[_i][1];
            var _symbol = reels[_position[0]][_position[1]];

            var _exec = false; var _data = null;

            for(var i = 0, l = this.getCondition().length; i < l; i++){
                if(this.executeCondition(i, _symbol, _count, _countWin, scatter)){
                    _data = this.getExecutive(i);
                    _position[2] = _data[1];
                    _exec = true;
                    break;
                } else {
                    _position[2] = ModelSlotMachine._DEFAULT_ANIMATION;
                }
            }

            _newArray.push(_position);
        }

        if(_exec === true && _data !== null){
            _data = this.parseArguments(_data, this._bufferDataCondition);

            this.runCallback(_data[0] != null ? _data[0] : ConditionInterface._DEFAULT, _newArray, _data[2] !== undefined ?  _data[2] : undefined);
        } else {
            this.runCallback(ConditionInterface._DEFAULT, list);
        }

    };
}