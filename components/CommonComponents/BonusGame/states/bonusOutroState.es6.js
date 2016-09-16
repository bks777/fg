import StateInterface from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateInterface.es6.js";

export default class BonusOutroState extends StateInterface {

    constructor(){
        super();

        this.on(StateInterface.AFTER_EXECUTE_STATE, this.nextBonusAction);
    }

    execute(resolve, reject){

        let actives = this.getController("protocol").actions;

        if(actives.available.indexOf("bonus_stop") != -1){

            var promise_ = new Promise( res => {
                this.getController().startOutro(res);
            });

            promise_ = promise_.then(()=>{
                new Promise((res, rej) => {
                    this.getController("protocol").sendData("bonusEndSendAction", res);
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
     * Bonus close transition
     * @private
     */
    _bonusCloseTransition(){
        this.getHandler().endBonus();
        this.getHandler().getLayout().visible = false;
        //this.getHandler().hideEndPopup();
    }

    /**
     *
     * @param resolve
     * @param reject
     */
    nextBonusAction(resolve, reject){

        this.nextState();
        resolve();
    }

}