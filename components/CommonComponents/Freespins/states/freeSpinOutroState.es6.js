import StateInterface from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateInterface.es6.js";

export default class FreeSpinOutroState extends StateInterface {

    constructor(){
        super();

        this.on(StateInterface.AFTER_EXECUTE_STATE, this.nextFreeSpinAction);

        this.on(StateInterface.LEAVE_STATE_TRANSITION, this.leaveOutro);
    }

    /**
     * Hide freespin data
     * @private
     */
    _transitionOutro(){
        this.getHandler("reels").hideFreeSpinBackground();

        this.getHandler().hideLayout();

        HelperFlags.set("freeSpinsEnabled", null);

        if(__RunPartialApplication.type == "mobile"){
            this.getHandler("control").hideFreePanel();
        }
    }

    execute(resolve, reject){

        let actives = this.getController("protocol").actions;

        if(actives.available.indexOf("freespin_stop") != -1){

            var promise_ = new Promise( res => {
                this.getController().startOutro(res);
            });

            promise_ = promise_.then(()=>{
                return new Promise((res, rej) => {
                    this.getController("protocol").sendData("freeSpinEndSendAction", res);
                })
            });

            promise_ = promise_.then(()=>{
                return new Promise( res =>{
                    this.getController().endOutro(res);
                });
            });

            promise_.then(resolve);
        } else {
            resolve();
        }

    }

    /**
     *
     * @param resolve
     * @param reject
     */
    nextFreeSpinAction(resolve, reject){

        this.nextState();
        resolve();
    }

    /**
     * Leave from outro
     * @param resolve
     * @param reject
     */
    leaveOutro(resolve, reject){

        if(this.to.indexOf("STATE_FREE_SPINS") == -1){
            this._transitionOutro();
        }

        resolve();
    }
}