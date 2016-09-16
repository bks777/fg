import StateInterface from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateInterface.es6.js";

export default class SpinIntroState extends StateInterface {

    constructor(){
        super();

        this.on(StateInterface.BEFORE_ENTER_STATE_TRANSITION, this.enterTransition);
    }


    /**
     * Enter transition
     * @private
     */
    _enterTransition(){
        try{
            this.getHandler("background").showMainBackground();
        } catch(e){

        }

        this.getHandler("reels").showLayout();
        this.getHandler("reels").initDefaultBackground();
        this.getHandler("reels").updateReelsSets();

        this.getHandler("lines").showLayout();
        this.getHandler("lines").checkBetLinesShow();
        this.getHandler("lines").checkAnimationEnded();

        this.getHandler("control").showMainGameControls();

        setTimeout(()=>{
            this.getController("audio").changeBackgroundSound("spins");
        }, 50);

        this.getService("TickerTapeService").spinGameInfo(true);


        if(__RunPartialApplication.type == "mobile"){
            this.getHandler("control").changeWinValue();
        }
    }

    /**
     * Enter to state
     * @param resolve
     * @param reject
     */
    enterTransition(resolve, reject){

        let accessEnterTransition = ["START_ROUTER", "STATE_BONUS_OUTRO", "STATE_FREE_SPINS_OUTRO"];

        /**
         * For show trigger elements after reload game
         */
        if(this.from.indexOf("START_ROUTER") != -1){
            HelperFlags.set("justStarted", true);
        } else {
            HelperFlags.set("justStarted", null);
        }

        if(this.stateMachine.router.restartGame == true){
            this._enterTransition();
        }

        /**
         * No execute transform
         */
        if(this.stateMachine.router.restartGame == false && accessEnterTransition.indexOf(this.from) == -1){
            resolve();
            return ;
        }

        this._enterTransition();

        if(this.getStateComponent("FREEBETS").isActive()){
            this.getStateComponent("FREEBETS").showPopupStart();

            setTimeout(()=>{
                this.getHandler("popup").updateBlur(true);
            }, 20);
        }

        resolve();
    }

    /**
     * Execute next action
     * @param resolve
     * @param reject
     */
    execute(resolve, reject){

        /**
         * If we start game with last winnings
         */
        if(this.stateMachine.router.restartGame === true || this.from == "START_ROUTER" && this.getService("LinesService").getWinStartTrigger().length > 0){
            this.stateMachine.router.restartGame = false;
            this.goToState("STATE_SPINS_RESULT");

            resolve();
        } else {

            if(HelperFlags.get("justStarted")){
                this.getHandler("lines").showStartLines();
            }

            this.nextState();
            resolve();
        }
    }

}