import StateEvent from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateEvent.es6";
import StateMachine from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateMachine.es6";
import StateInterface from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateInterface.es6";
import ComponentInterface from "../../../../bower_components/html5-game-kernel/interfaces/component/componentInterface.es6";

import rules from "./rules";

export default class RouterState extends StateEvent {

    constructor(){
        super();

        this._fromState = null;

        this.stateMachine = null;

        //this.listOrders = [SpinsOrders, FreeSpinsOrders, BonusOrders];

        this.component = new ComponentInterface;

        this._restartGame = false;

        this.callbackEndFreeBet = null;
    }

    set restartGame(value){
        this._restartGame = value;
    }

    get restartGame(){
        return this._restartGame;
    }

    /**
     * Subscribe events for router
     */
    subscribe(){
        this.on(StateMachine.ROUTER_NEXT, this._routeNextState);

        this.stateMachine.initRules(rules);
    }

    /**
     * Find current state in queue
     * @param stateName
     * @returns {*}
     * @private
     */
    _findCurrentStateIdOrders(stateName){

        let orders = this.stateMachine.orders;

        for(let i = 0, l = orders.length; i < l; i++){

            let result = orders[i].indexOf(stateName);

            if(result != -1){
                return [orders, i, result];
            }

        }

        return [orders, null, null];
    }

    /**
     * Next game action
     * @returns {*}
     * @private
     */
    __findNextProtocolAction(){

        switch(this.component.getController("protocol").actions.current){
            case "spins":
                return "STATE_SPINS_INTRO";
                break;

            case "freespin_init":
            case "freespins":
            case "freespin_end":
                return "STATE_FREE_SPINS_INTRO";
                break;

            case "bonus_init":
            case "bonus":
            case "bonus_end":
                return "STATE_BONUS_INTRO";
                break;
        }
    }

    _routeNextState(){

        if(this.stateMachine.getStateComponent("FREEBETS").isActive() && this.stateMachine.getStateComponent("FREEBETS").isFinished() && this.stateMachine.currentState.indexOf("_OUTRO") != -1){

            this.component.getController("protocol").sendData("updateStartAction", ()=>{

                this.component.getService("AutoPlayService").stopAutoSpins();

                let nextState = this.__findNextProtocolAction();
                if(!nextState){
                    $_log.error("Not found Next action");
                    return ;
                }

                let state = null;

                /**
                 * If do not choose element in freeSpins and reload with freeBets
                 */
                if(nextState == "STATE_SPINS_INTRO" && ["freespin_init", "bonus_init"].indexOf(this.component.getController("protocol").actions.available[0]) != -1){

                    this.component.getHandler("reels").getLayout().visible = true;

                    this.stateMachine.getStateComponent("FREEBETS").showPopupEnd(()=>{

                        this.component.getHandler("popup").querySelector("gameBlockPopup").visible = true;

                        this.stateMachine.router.restartGame = true;

                        HelperFlags.set("justStarted", true);

                        this.component.getHandler("reels").updateReelsSets();
                        this.component.getHandler("control").changeWinValue(null);
                        this.component.getHandler("lines").stopSpinAction(()=>{
                            this._routeNextState();
                            HelperFlags.set("justStarted", null);
                        });
                    });

                    this.component.getState("STATE_SPINS_INTRO")._enterTransition();

                    this.component.getHandler("popup").querySelector("gameBlockPopup").visible = false;
                    this.component.getHandler("popup").updateBlur();

                    return;
                } else {
                    state = this.stateMachine.getState(nextState);

                    this.stateMachine.router.restartGame = true;

                    /**
                     * Finish freeBets
                     * @param resolve
                     * @param reject
                     * @private
                     */
                    this._finishFreeBets = (resolve, reject) => {

                        this.stateMachine.getStateComponent("FREEBETS").showPopupEnd(()=>{
                            resolve();
                            state.off(StateInterface.BEFORE_ENTER_STATE_TRANSITION, this._finishFreeBets);
                            this._finishFreeBets = null;
                        });

                        setTimeout(()=>{
                            this.component.getHandler("popup").updateBlur(true);
                        }, 10);
                    };

                    state.on(StateInterface.BEFORE_ENTER_STATE_TRANSITION, this._finishFreeBets);

                    this._routeNextState();
                }
            });

            return ;

        } else if(this.stateMachine.getStateComponent("FREEBETS").isActive() && this.stateMachine.getStateComponent("FREEBETS").isDeleted()){

            this.stateMachine.finishStateMethods();
            this.stateMachine.finishState();

            this.stateMachine.getStateComponent("FREEBETS").showPopupEnd(() => {

                this.component.getController("protocol").sendData("updateStartAction", ()=>{

                    if(this.stateMachine.currentState.indexOf("STATE_BONUS_") != -1){
                        this.stateMachine.getState("STATE_BONUS_OUTRO")._bonusCloseTransition();
                        this.stateMachine._currentState = null;

                    } else if(this.stateMachine.currentState.indexOf("STATE_SPINS_") != -1) {
                        this.stateMachine.getState("STATE_SPINS_OUTRO")._closeSpinTransition();
                        this.stateMachine._currentState = null;

                    } else if(this.stateMachine.currentState.indexOf("STATE_FREE_SPINS_") != -1){
                        this.stateMachine.getState("STATE_FREE_SPINS_OUTRO")._transitionOutro();
                        this.stateMachine._currentState = null;

                    } else {
                        $_log.error("Not found case from remove state", this.stateMachine.currentState);
                    }

                    let nextState = this.__findNextProtocolAction();
                    if(!nextState){
                        $_log.error("Not found Next action");
                        return ;
                    }

                    this.stateMachine.goToState(nextState, true);

                });
            });

            return ;
        }

        if(this.stateMachine.currentState.indexOf("_OUTRO") != -1){
            console.debug(this.component.getController("protocol").actions);

            /**
             * To Free Spin game
             * @type {string[]}
             */
            let freespins = ["freespin_init", "freespin", "freespin_end"];


            if((this.stateMachine.currentState.indexOf("STATE_SPINS_") != -1 || this.stateMachine.currentState.indexOf("STATE_BONUS_") != -1) &&
                freespins.indexOf(this.component.getController("protocol").actions.available[0]) != -1){

                this.stateMachine.goToState("STATE_FREE_SPINS_INTRO");
                return ;
            }


            /**
             * To Spin game
             */
            if((this.stateMachine.currentState.indexOf("STATE_FREE_SPINS_") != -1 || this.stateMachine.currentState.indexOf("STATE_BONUS_") != -1) &&
                "spin" == this.component.getController("protocol").actions.available[0]){

                this.stateMachine.goToState("STATE_SPINS_INTRO");
                return ;
            }

            /**
             * To bonus game
             * @type {string[]}
             */
            let bonus = ["bonus_init", "bonus_pick", "bonus_end"];

            if((this.stateMachine.currentState.indexOf("STATE_SPINS_") != -1 || this.stateMachine.currentState.indexOf("STATE_FREE_SPINS_") != -1) &&
                bonus.indexOf(this.component.getController("protocol").actions.available[0]) != -1){

                this.stateMachine.goToState("STATE_BONUS_INTRO");
                return ;
            }

            //return ;
        }

        console.debug(`----- ROUTER from - >${this.stateMachine.currentState}`);

        let [listOrders, queueID, queuePosition] = this._findCurrentStateIdOrders(this.stateMachine.currentState);

        if(queueID === null){
            console.error("Queue not found!", this.stateMachine.currentState, this.stateMachine.orders);
            return ;
        }

        let next = queuePosition + 1;

        if(listOrders[queueID][next] == undefined){
            next = 0;
        }

        console.debug('----- ROUTER to -> ', listOrders[queueID][next]);
        this.stateMachine.goToState(listOrders[queueID][next]);
    }
}