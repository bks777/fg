import StateInterface from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateInterface.es6.js";

export default class StartState extends StateInterface {

    constructor(){
        super();

        this.on(StateInterface.AFTER_EXECUTE_STATE, this.skipKeyStart);
        this.on(StateInterface.LEAVE_STATE_TRANSITION, this._afterExecute);
        this.on(StateInterface.BEFORE_ENTER_STATE_TRANSITION_AFTER_NEXT, this._enteringNextState);

        this.popupFreeBets = false;
    }

    /**
     * Wait to click "preloader" key in desktop
     * @param resolve
     * @param reject
     */
    skipKeyStart(resolve, reject){

        if(this.getController("preloader").keyStart === false){
            resolve();
        } else {
            this.getController("preloader").keyStart = resolve;
        }
    }


    /**
     * Execute start game
     * @param resolve
     * @param reject
     */
    execute(resolve, reject){

        let actions = this.getController().actions;

        HelperFlags.set("gameReady", true);
        HelperFlags.set("gameLoaded", true);
        $_event.setEvent("initGame", true);


        this.getService("TickerTapeService").checkDemoMode();

        this.getHandler("reels").initGameReels();

        this.getHandler("lines").initHandler();

        /**
         * For allWinSymbol animation and animation scatters and bonus symbols
         */
        this.getHandler("reels").initOverheadContainer();

        /**
         * Set top reels before lines
         */
        //this.getHandler("reels").initTopLayout();



        this.getHandler("control").initControl();
        this.getController("control").initController();

        this.getHandler("freespins").initHandler();

        this.getHandler("bonus").initHandler();
        this.getHandler("win").initHandler();

        switch (actions.current){

            case "spin":
            case "spins":
                this.goToState("STATE_SPINS_INTRO");
                break;

            case "freespin":
            case "freespins":
                this.goToState("STATE_FREE_SPINS_INTRO");
                break;

            case "bonus":
                this.goToState("STATE_BONUS_INTRO");
                break;
        }

        resolve();

        $_view_canvas.getStage().addChild($_services.getService("SlotMachineService").getInstance().reels[0].elements[1].setSymbol(1, "def"));
    }

    /**
     * Check freeBets
     * @param resolve
     * @param reject
     * @private
     */
    _afterExecute(resolve, reject){

        if(this.to && this.to.indexOf("STATE_SPINS") != -1 && this.getStateComponent("FREEBETS").isActive()){
            this.popupFreeBets = true;
            this.getStateComponent("FREEBETS").showPopupStart(this.__popupClickAction.bind(this));
        }

        resolve();
    }

    /**
     * FreeBets popup click
     * @private
     */
    __popupClickAction(){
        this._startPopupFreebets();
    }

    /**
     * Execute after next State was enter
     * @param resolve
     * @param reject
     * @returns {*}
     * @private
     */
    _enteringNextState(resolve, reject){

        if(!this.popupFreeBets){
            return resolve();
        }

        this.popupFreeBets = false;

        this.getHandler("popup").updateBlur();
        this._startPopupFreebets = resolve;
    }
}