import StateInterface from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateInterface.es6.js";

export default class BonusResultState extends StateInterface {

    constructor(){
        super();

        this.on(StateInterface.AFTER_EXECUTE_STATE, this.nextAction);
    }

    execute(resolve, reject){

        this.getHandler("control").showBonusPanel();

        this.getHandler().showResult(resolve);
    }

    nextAction(resolve, reject){
        this.nextState();

        resolve();
    }
}