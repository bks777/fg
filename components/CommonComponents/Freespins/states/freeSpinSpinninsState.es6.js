import StateInterface from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateInterface.es6.js";

export default class FreeSpinSpinningState extends StateInterface {

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
        this.getHandler("control").changeFreeCounterBeforeSpin();

        this.getHandler("lines").startSpinAction();

        this.getHandler("settings").showFastToolbarMessage("fast_click_spin_message");

        resolve();
    }

    /**
     * Execute spinning
     * @param resolve
     * @param reject
     */
    execute(resolve, reject){

        $_event.setEvent("spinAction");

        this.getHandler("reels").startReels();

        this.getService("SoundService").stopGroup("main");
        this.getService("SoundService").play("audio_freespin_numbers");
        this.getService("SoundService").play("audio_reel_rotate", null, {"loop": true});

        let promise = new Promise( (res, rej) => {
            this.getController("protocol").sendData("spinSendAction", res, "freespin");
        });

        promise.then( () => {
            //this.getHandler("reels").stopReels(resolve);

            this.getHandler("reels").stopFreeSpinReels(resolve);
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