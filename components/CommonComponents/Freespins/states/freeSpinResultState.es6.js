import StateInterface from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateInterface.es6.js";

export default class FreeSpinResultState extends StateInterface {

    constructor(){
        super();

        this.on(StateInterface.AFTER_EXECUTE_STATE, this.leaveResult);
    }

    execute(resolve, reject){

        let promise = new Promise((res, rej)=>{
            this.getController("win").checkBigWin(res);
        });

        //this.getController("protocol").checkFreeBets();

        this.getHandler("reels").setWinElements();

        this.getHandler("control").enableAllButtons();
        this.getHandler("control").changeWinValue();
        this.getHandler("control").changeTotalWinValue();
        this.getHandler("control").changeBalanceValue();

        this.getService("SoundService").stop("audio_reel_rotate");

        promise = promise.then(()=>{
            return new Promise((res, rej)=>{
                this.getHandler("lines").stopFreeSpinsAction(res, rej);
            });
        });

        promise.then(resolve);
    }

    leaveResult(resolve, reject){
        this.nextState();
        resolve();
    }

}