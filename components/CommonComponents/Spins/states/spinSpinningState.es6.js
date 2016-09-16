import StateInterface from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateInterface.es6.js";

export default class SpinSpinningState extends StateInterface {

    constructor(){
        super();

        this.on(StateInterface.ENTER_STATE_TRANSITION, this.startSpinning);
        this.on(StateInterface.AFTER_EXECUTE_STATE, this.showResult);
    }

    /**
     * Start to run reels
     * @param resolve
     * @param reject
     */
    startSpinning(resolve, reject){

        this.getHandler("control").disableAllButtons();
        this.getHandler("control").changeWinValue(null);
        this.getHandler("control").changeBalanceValueBeforeSpin();

        this.getHandler("lines").startSpinAction();

        if(this.getService("AutoPlayService").isActive()){
            this.getController("control").beforeStartAutoPlay();
        }

        this.getHandler("settings").showFastToolbarMessage("fast_click_spin_message");

        this.getController("protocol").checkFreeBets(true);

        if(HelperFlags.get("justStarted")){
            HelperFlags.set("justStarted", null);
        }

        resolve();
    }

    /**
     * Execute spinning
     * @param resolve
     * @param reject
     */
    execute(resolve, reject){

        this.getHandler("reels").startReels();
        this.getHandler("lines").disableBetLinesShow();

        this.getService("SoundService").stopGroup("main");

        if(this.getService("AutoPlayService").isActive()){
            this.getService("SoundService").play("audio_freespin_numbers");
        }

        this.getService("SoundService").play("audio_spin_mbet");
        this.getService("SoundService").play("audio_reel_rotate", null, {"loop": true});

        let promise = new Promise( (res, rej) => {
            this.getController("protocol").sendData("spinSendAction", res, "spin");
        });

        promise.then( () => {
            //this.getHandler("reels").stopReels(resolve);

            this.getHandler("reels").stopSpinReels(resolve);
        });

    }

    /**
     * Go to next state
     * @param resolve
     * @param reject
     */
    showResult(resolve, reject){
        this.nextState();
        resolve();
    }
}