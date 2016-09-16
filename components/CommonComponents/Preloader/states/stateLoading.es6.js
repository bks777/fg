import StateInterface from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateInterface.es6.js";

export default class StateLoading extends StateInterface {

    constructor(){
        super();

        this.on(StateInterface.ENTER_STATE_TRANSITION, this.showPanel);
        this.on(StateInterface.LEAVE_STATE_TRANSITION, this.hidePanel);
    }

    showPanel(resolve, reject){
        this.getHandler().initHandler();

        this.getHandler("popup").initHandler();
        this.getController("popup").initController();

        resolve();
    }

    execute(resolve, reject){
        resolve();
    }

    hidePanel(resolve, reject){
        this.getHandler().hide();

        //this.getHandler().getLayout().visible = false;

        resolve();
    }

}