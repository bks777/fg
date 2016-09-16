import StateInterface from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateInterface.es6.js";

export default class BonusIntroState extends StateInterface {

    constructor(){
        super();

        this.on(StateInterface.BEFORE_ENTER_STATE_TRANSITION, this.checkBonusActive);
        this.on(StateInterface.ENTER_STATE_TRANSITION, this.enterBonus);

        this.on(StateInterface.AFTER_ENTER_STATE_TRANSITION, this.afterEnterBonus);

        this.on(StateInterface.AFTER_EXECUTE_STATE, this.startGamePlay);
    }

    /**
     * Transitions to enter
     * @private
     */
    _transitionBonusInit(){

        this.getHandler("control").showBonusPanel();

        this.getHandler("reels").hideLayout();

        try{
            this.getHandler("paytable").hideMiniPaytable();
        } catch(e){

        }

        this.getHandler("lines").hideLayout();

        this.getController("audio").changeBackgroundSound("bonus");

        this.getHandler().initBonusGame();

        this.getService("TickerTapeService").bonusGameInfo();
    }

    /**
     * Check bonus active
     * @param resolve
     * @param reject
     */
    checkBonusActive(resolve, reject){

        if(this.stateMachine.router.restartGame == true && this.from.indexOf("STATE_SPINS_") == -1){
            return resolve();
        }

        if(!this.from || this.stateMachine.router.restartGame === true){
            this._transitionBonusInit();
            resolve();
            return ;
        }

        let actions = this.getController("protocol").actions;
        if(this.from.indexOf("STATE_BONUS") == -1 && actions.current == "bonus"){
            this._transitionBonusInit();
        }


        /*if(this.stateMachine.router.restartGame == true){
            this.getHandler().endBonus();
            this._transitionBonusInit();
        }*/

        resolve();
    }


    /**
     * Try to enter to intro bonus
     * @param resolve
     * @param reject
     */
    enterBonus(resolve, reject){

        let actions = this.getController("protocol").actions;

        if(this.stateMachine.router.restartGame === true && this.from.indexOf("STATE_SPINS_") == -1){
            this.stateMachine.router.restartGame = false;

            if(actions.current != "bonus"){
                this.getHandler().startIntro (()=>{
                    resolve();
                    this._transitionBonusInit();
                });

            } else {

                this.getController().restoreGame(resume => {

                    if(!resume){
                        this.goToState("STATE_BONUS_OUTRO");

                        this.continue();
                    }

                    resolve();
                });
            }
            return ;
        }

        if(this.stateMachine.router.restartGame === false && this.from.indexOf("STATE_BONUS") != -1){
            resolve();
            return ;
        }

        this.stateMachine.router.restartGame = false;

        if(!this.from || ["bonus", "bonus_end"].indexOf(actions.current) != -1){

            /**
             * Restore bonus game
             */
            new Promise( res => {
                this.getController().restoreGame(res);
            })
                .then(()=>{
                    return new Promise( res => {

                        if(!this.from){
                            this.getHandler().getLayout().visible = true;
                        }

                        res();
                        resolve();
                    })
                });

        } else {

            /**
             * Start info bonus
             */
            new Promise( res => {
                this.getController().startIntro(res);
            })
                .then(resolve);
        }
    }

    /**
     * After enter to bonus
     * @param resolve
     * @param reject
     */
    afterEnterBonus(resolve, reject){

        let actions = this.getController("protocol").actions;
        if(actions.current == "bonus"){

            resolve();
            return ;
        }

        let accessEnterTransition = ["START_ROUTER", "STATE_FREE_SPINS_OUTRO", "STATE_SPINS_OUTRO"];

        /**
         * No execute transform
         */
        if(accessEnterTransition.indexOf(this.from) == -1){
            resolve();
            return ;
        }

        this._transitionBonusInit();

        resolve();
    }

    /**
     * Execute entering to bonus
     * @param resolve
     * @param reject
     */
    execute(resolve, reject){

        let actives = this.getController("protocol").actions;

        if(actives.available.indexOf("bonus_init") != -1){

            /**
             * Init
             */
            var promise = new Promise((res, rej) => {
                this.getController("protocol").sendData("bonusStartSendAction", res);
            });

            promise = promise.then(()=>{
                return new Promise( res => {
                    this.getController().endIntro(res);
                })
            });

            promise = promise.then(()=>{
                return new Promise( res => {
                    this.getHandler().initGameState(false);
                    res();
                })
            });

            promise.then(()=>{
                return new Promise((res => {
                    this.getHandler("control").showBonusPanel();
                    resolve();
                    res();
                }))
            });

        } else if(actives.available.indexOf("bonus_stop") != -1){

            /**
             * End
             */
            this.goToState("STATE_BONUS_OUTRO");

            this.continue();
            resolve();

        } else {

            /**
             * Resume
             */

            if(this.from.indexOf("STATE_BONUS_") != -1){
                resolve();
                return ;
            }

            resolve();
        }

    }

    /**
     * Start game play
     * @param resolve
     * @param reject
     */
    startGamePlay(resolve, reject){

        this.nextState();
        resolve();
    }

}