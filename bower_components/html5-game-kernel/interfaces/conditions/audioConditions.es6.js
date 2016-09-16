import ConditionInterface from "./conditionInterface.es6.js";

/**
 * Audio fabric conditions
 */
export default class AudioConditions extends ConditionInterface {

    constructor(conditions, params, defParams = {}){
        super({});

        this._params = params;
        this.context = null;

        this.parseCondition(conditions, defParams);
    }

    /**
     * Execute rules for audio combinations
     */
    execute(){

        for(let i = 0, l = this.getCondition().length; i < l; i++){

            if(this.executeCondition.apply(this, [i,...this._params])){

                let [nameCallback, listAudio] = this.getExecutive(i);
                this.runCallback(nameCallback, listAudio, this._params);
                return;
            }
        }

        this.runCallback(ConditionInterface._DEFAULT);
    }
}