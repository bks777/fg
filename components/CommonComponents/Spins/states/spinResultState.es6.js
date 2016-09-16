import StateInterface from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateInterface.es6.js";

export default class SpinResultState extends StateInterface {

    constructor(){
        super();

        this.on(StateInterface.BEFORE_EXECUTE_STATE, this._beforeExecute);
        this.on(StateInterface.AFTER_EXECUTE_STATE, this.leaveResult);

        this.deleteFreeBets = false;
    }

    _beforeExecute(resolve, reject){
        if(__RunPartialApplication.type == "mobile" && ["freespin_init", "bonus_init"].indexOf(this.getController("protocol").actions.available[0]) != -1){
            this.getHandler("control").disableAllButtons();
            this.getHandler("control").hideHomeButton();
        }

        resolve();
    }

    execute(resolve, reject){

        let promise = new Promise((res, rej)=>{
            this.getController("win").checkBigWin(res);
        });

        this.getHandler("reels").setWinElements();

        this.getHandler("control").enableAllButtons();

        this.getHandler("control").changeWinValue();

        if(HelperFlags.get("justStarted")){
            this.getHandler("control").changeWinValue(null);
        }

        this.getHandler("control").changeBalanceValue();
        this.getController("control").checkSpinButtonActive();

        this.getService("SoundService").stop("audio_reel_rotate");

        if(this.deleteFreeBets === true) return ;

        if(this.getService("ProtocolService").hasFreeBets() && this.getService("ProtocolService").getFreeBets().status != "active"){

            this.deleteFreeBets = true;

            this.getHandler("lines").stopSpinAction(()=>{}, ()=>{}, ()=>{
                this.deleteFreeBets = false;

                setTimeout(()=>{
                    resolve();
                }, 1000);
            });

            return ;
        }

        promise = promise.then(()=>{
            return new Promise((res, rej)=>{
                this.getHandler("lines").stopSpinAction(res, rej, () => {
                    this.getHandler("lines").enableBetLinesShow();
                });
            })
        });

        promise.then(resolve);
    }

    leaveResult(resolve, reject){

        this.nextState();
        resolve();
    }
}