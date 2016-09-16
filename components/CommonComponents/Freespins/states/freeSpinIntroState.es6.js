import StateInterface from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateInterface.es6.js";

export default class FreeSpinIntroState extends StateInterface {

    constructor(){
        super();

        this.on(StateInterface.ENTER_STATE_TRANSITION, this.checkFreeSpinActive);
        this.on(StateInterface.AFTER_ENTER_STATE_TRANSITION, this.enterFreeSpin);

        this.on(StateInterface.BEFORE_EXECUTE_STATE, this.afterEnterFreeSpin);

        this.on(StateInterface.AFTER_EXECUTE_STATE, this.startGamePlay);
    }

    /**
     * Transition enter to free spins
     * @private
     */
    _transitionFreeSpinInit(){

        HelperFlags.set("freeSpinsEnabled", true);

        this.getHandler("control").enableAllButtons();
        this.getHandler("control").showFreePanel();
        this.getHandler("control").changeTotalWinValue();

        this.getHandler("reels").showLayout();
        this.getHandler("reels").showDefaultMask();
        this.getHandler("reels").showFreeSpinBackground();

        this.getHandler("lines").showLayout();

        this.getHandler("control").changeWinValue(null);

        this.getHandler("control").changeFreeCounterBeforeSpin();

        if(this.getService("FreeSpinService").getFreeSpinLeft() > 0){
            this.getHandler("control").setSpinCounterValue( this.getService("FreeSpinService").getFreeSpinLeft() - 1);
        } else {
            this.getHandler("control").setSpinCounterValue(0);
        }

        this.getController("audio").changeBackgroundSound("freespins");

        this.getService("TickerTapeService").freeSpinGameInfo();

        this.getHandler().showLayout();
        this.getHandler().showSelectedHeader();

        if(__RunPartialApplication.type == "mobile"){
            setTimeout(()=>{
                this.getHandler("background").showFreeSpinBackground();
            }, 10);
        } else {
            this.getHandler("background").showFreeSpinBackground();
        }



    }

    checkFreeSpinActive(resolve, reject){

        if(this.stateMachine.router.restartGame == true && this.from.indexOf("STATE_SPINS_") == -1){
            return resolve();
        }

        if(this.stateMachine.router.restartGame == true){
            this._transitionFreeSpinInit();
        }

        let actions = this.getController("protocol").actions;
        if(this.stateMachine.router.restartGame === false && actions.current == "freespins" && (!this.from || this.from.indexOf("STATE_FREE_SPINS") == -1) ){
            this._transitionFreeSpinInit();

        } else if(actions.current == "freespins" && __RunPartialApplication.type == "mobile"){
            this.getHandler("control").changeSpinState();

            if(this.getService("FreeSpinService").getFreeSpinLeft() > 0){
                this.getHandler("control").setSpinCounterValue( this.getService("FreeSpinService").getFreeSpinLeft() - 1);
            } else {
                this.getHandler("control").setSpinCounterValue(0);
            }
        }

        resolve();
    }

    /**
     * Enter transition
     * @param resolve
     * @param reject
     */
    enterFreeSpin(resolve, reject){

        let actions = this.getController("protocol").actions;

        if(this.stateMachine.router.restartGame === true && this.from.indexOf("STATE_SPINS_") == -1){
            this.stateMachine.router.restartGame = false;

            if(actions.current != "freespins"){
                this.getHandler().showStartPopup (()=>{
                    resolve();
                    this._transitionFreeSpinInit();
                });

            } else {

                if(this.getService("FreeSpinService").getFreeSpinLeft() > 0){
                    this.getHandler("control").setSpinCounterValue( this.getService("FreeSpinService").getFreeSpinLeft() - 1);
                } else {
                    this.getHandler("control").setSpinCounterValue(0);
                }

                this.getController().restoreGame(resume => {

                    if(!resume){
                        this.goToState("STATE_FREE_SPINS_OUTRO");

                        this.continue();
                    }

                    resolve();
                });
            }
            return ;
        }


        if(this.stateMachine.router.restartGame === false && this.from.indexOf("STATE_FREE_SPINS") != -1){
            resolve();
            return ;
        }

        this.stateMachine.router.restartGame = false;

        this.getController().startIntro();

        if(actions.current == "freespins"){

            this.getController().restoreGame(resume => {

                if(!resume){
                    this.goToState("STATE_FREE_SPINS_OUTRO");

                    this.continue();
                }

                resolve();
            });

            return ;
        } else {

            this.getHandler().showStartPopup (()=>{
                resolve();
            });
        }



    }

    /**
     * After show popup enter
     * @param resolve
     * @param reject
     */
    afterEnterFreeSpin(resolve, reject){

        let actions = this.getController("protocol").actions;
        if(actions.current == "freespins"){
            resolve();
            return ;
        }

        let accessEnterTransition = ["START_ROUTER", "STATE_BONUS_OUTRO", "STATE_SPINS_OUTRO"];

        /**
         * No execute transform
         */
        if(accessEnterTransition.indexOf(this.from) == -1){
            resolve();
            return ;
        }

        this._transitionFreeSpinInit();

        resolve();

    }

    /**
     * Execute entering to free Spins
     * @param resolve
     * @param reject
     */
    execute(resolve, reject){

        let actives = this.getController("protocol").actions;

        if(actives.available.indexOf("freespin_init") != -1){

            let counts = {
                10: 15, 11: 10, 12: 5
            };

            this.getHandler("control").setSpinCounterValue(counts[this.getController().chooseIdle] - 1);

            var promise = new Promise((res, rej) => {
                this.getController("protocol").sendData("freeSpinInitSendAction", res, this.getController().chooseIdle);
            });

            promise = promise.then(()=>{
                return new Promise((res, rej)=> {
                    this.getController().chooseIdle = null;
                    this.getController().endIntro(res);
                });
            });

            promise.then(resolve);

        } else if(actives.available.indexOf("freespin_stop") != -1){

            this.goToState("STATE_FREE_SPINS_OUTRO");

            this.continue();
            resolve();

        } else {
            this.getController().endIntro(resolve);
        }
    }

    /**
     * Start free spin play
     * @param resolve
     * @param reject
     */
    startGamePlay(resolve, reject){

        this.nextState();

        resolve();
    }

}