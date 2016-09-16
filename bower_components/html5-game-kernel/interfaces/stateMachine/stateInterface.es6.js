import StateEvent from "./stateEvent.es6";
import StateMachine from "./stateMachine.es6";
import ComponentInterface from "../component/componentInterface.es6";
/**
 * @class State Machine Interface
 */
export default class StateInterface extends StateEvent {

    /**
     * Entering state const
     * @returns {string}
     * @constructor
     */
    static get BEFORE_ENTER_STATE_TRANSITION () { return "best";   }
    static get ENTER_STATE_TRANSITION () { return "est";   }
    static get AFTER_ENTER_STATE_TRANSITION () { return "aest";   }

    /**
     * Execute state const
     * @returns {string}
     * @constructor
     */
    static get BEFORE_EXECUTE_STATE () { return "bes";   }
    static get EXECUTE_STATE () { return "es";   }
    static get AFTER_EXECUTE_STATE () { return "aes";   }

    /**
     * Leave state const
     * @returns {string}
     * @constructor
     */
    static get BEFORE_LEAVE_STATE_TRANSITION () { return "blst";   }
    static get LEAVE_STATE_TRANSITION () { return "lst";   }
    static get AFTER_LEAVE_STATE_TRANSITION () { return "alst";   }

    /**
     * From another states const
     * @returns {string}
     * @constructor
     */
    static get BEFORE_ENTER_STATE_TRANSITION_AFTER_NEXT () { return "bestn";   }
    static get ENTER_STATE_TRANSITION_AFTER_NEXT () { return "estan";   }

    /**
     * Types transitions
     * @returns {string}
     * @constructor
     */
    static get TYPE_ENTER_TRANSITION () { return "enter";   }
    static get TYPE_EXECUTIVE () { return "execute";   }
    static get TYPE_LEAVE_TRANSITION () { return "leave";   }

    /**
     * Event const
     * @returns {string}
     * @constructor
     */
    static get BEFORE_EVENT () { return "before_event";   }
    static get AFTER_EVENT () { return "after_event";   }

    /**
     * Constructor
     */
    constructor() {
        super();

        this._stateName = null;

        this._alias = null;

        this._from = null;
        this._to = null;

        this._stateMachine = null;

        /**
         * Orders execute transition
         * @type {{enter: *[], leave: *[]}}
         */
        this.TRANSITION_ORDERS = {
            "enter": [
                StateInterface.BEFORE_ENTER_STATE_TRANSITION,
                [StateMachine.STATE_FROM, StateInterface.BEFORE_ENTER_STATE_TRANSITION_AFTER_NEXT],
                StateInterface.ENTER_STATE_TRANSITION,
                [StateMachine.STATE_FROM, StateInterface.ENTER_STATE_TRANSITION_AFTER_NEXT],
                StateInterface.AFTER_ENTER_STATE_TRANSITION
            ],
            "execute": [StateInterface.BEFORE_EXECUTE_STATE, StateInterface.EXECUTE_STATE, StateInterface.AFTER_EXECUTE_STATE],
            "leave": [StateInterface.BEFORE_LEAVE_STATE_TRANSITION, StateInterface.LEAVE_STATE_TRANSITION, StateInterface.AFTER_LEAVE_STATE_TRANSITION]
        };

        /**
         * Default main execute parameters
         */
        if(typeof this.execute == "function"){
            this.on(StateInterface.EXECUTE_STATE, this.execute);
        }
    }

    /**
     * Set alias
     * @param value
     */
    set alias ( value ){
        this._alias = value;

        this.component = new ComponentInterface({alias: value});
    }

    /**
     * Get state machine
     * @returns {StateMachine}
     */
    get stateMachine(){
        return this._stateMachine;
    }

    /**
     * Get State Machine instance
     * @param name
     * @returns {*}
     */
     goToState(name = null){
        this.stateMachine.goToState(name);
    }

    /**
     * Get list of orders transitions
     * @param type
     * @returns {*}
     */
    getTransitionOrders(type = null){
        return this.TRANSITION_ORDERS[type];
    }

    /**
     * Get state Name
     * @returns {*}
     */
    get name (){
        return this._stateName;
    }

    /**
     * Transition from
     * @returns {*}
     */
    get from(){
        return this._from;
    }

    set from (name){
        this._from = name;
    }

    /**
     * Transition to
     */
    get to(){
        return this._to;
    }

    set to(name){
        this._to = name;
    }

    /**
     * Execute context transition
     * @param context
     * @param type
     * @param resolve
     * @param reject
     * @private
     */
    __executeTransition(context, type, resolve, reject){
        let promises = [];

        try{

            for(let i = 0, l = context.getEvents()[type].length; i < l; i++){

                promises.push(new Promise((res, rej) => {
                    context.getEvents()[type][i].call(context, res, rej);
                }));
            }

        } catch(e){
            reject(e);
        }

        Promise.all(promises)
            .then(resolve)
            .catch((e)=>{
                reject(e);
            });
    }

    /**
     * Execute state
     * @param type
     * @param resolve
     * @param reject
     */
    executeTransition(type, resolve, reject){

        /**
         * Events another States
         */
        if(this.from !== null && type instanceof Array){

            let [stateName, typeName] = type;

            let stateAlias = this[stateName];
            if(!stateAlias) return resolve();

            let context = this.stateMachine.getState(stateAlias);
            if(!context) return resolve();

            /**
             * Events from current State
             */
            if(!context.getEvents()[typeName]){
                resolve();
                return;
            }

            this.__executeTransition(context, typeName, resolve, reject);

        } else {

            /**
             * Events from current State
             */
            if(!this.getEvents()[type]){
                resolve();
                return;
            }

            this.__executeTransition(this, type, resolve, reject);
        }

    }

    /**
     * Go to next action
     * @param important
     */
    nextState(important = false){
        this._stateMachine.goToRouter(undefined, important);
    }

    continue(){
        this._stateMachine.finishStateMethods();
    }

    /**
     * Get controller
     * @param alias
     * @returns {*}
     */
    getController(alias = this._alias){
        return this.component.getController(alias);
    }

    /**
     * Get event
     * @param alias
     * @returns {*}
     */
    getEvent(alias = this._alias){
        return this.component.getEvent(alias);
    }

    /**
     * Get handler
     * @param alias
     * @returns {*}
     */
    getHandler(alias = this._alias){
        return this.component.getHandler(alias);
    }

    /**
     * Get Service
     * @param serviceName
     * @returns {*}
     */
    getService(serviceName = null){
        return this.component.getService(serviceName);
    }

    /**
     * Get stateMachine component
     * @param stateComponentName
     * @returns {*}
     */
    getStateComponent(stateComponentName = null){
        return this._stateMachine.getStateComponent(stateComponentName);
    }

    /**
     * Execute State
     * @param resolve
     * @param reject
     * @data execute(resolve, reject){}
     */
}
