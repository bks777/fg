import StateInterface from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateInterface.es6.js";

export default class SpinOutroState extends StateInterface {

    constructor(){
        super();

        this.on(StateInterface.BEFORE_LEAVE_STATE_TRANSITION, this._beforeExecute);
        this.on(StateInterface.LEAVE_STATE_TRANSITION, this.leaveFromSpin);
    }

    execute(resolve, reject){

        this.nextState();
        resolve();
    }

    _beforeExecute(resolve, reject){

        if(__RunPartialApplication.type == "mobile" && ["STATE_FREE_SPINS_INTRO", "STATE_BONUS_INTRO"].indexOf(this.to) != -1){
            this.getHandler("control").disableAllButtons();
            resolve();
        } else {
            resolve();
        }
    }

    /**
     * Close transition
     * @private
     */
    _closeSpinTransition(){
        this.getHandler("reels").hideLayout();
        this.getHandler("paytable").hideMiniPaytable();

        this.getHandler("lines").hideLayout();
    }

    /**
     * Leave from state Spin to other
     * @param resolve
     * @param reject
     */
    leaveFromSpin(resolve, reject){

        let accessEnterTransition = ["STATE_BONUS_INTRO", "STATE_FREE_SPINS_INTRO"];

        /**
         * No execute transform
         */
        if(accessEnterTransition.indexOf(this.from) == -1){
            resolve();
            return ;
        }

        this._closeSpinTransition();

        resolve();
    }
}