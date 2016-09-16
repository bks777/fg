/**
 * @class State Machine Observer
 */
import StateInterface from "./stateInterface.es6.js";

let instance = null;

export default class StateMachine {

    static get ROUTER_NEXT () { return "router_next";   }
    static get ROUTER_BACK () { return "router_back";   }
    static get ROUTER_REPLY () { return "router_reply";   }

    static get STATE_FROM () { return "from";   }

    constructor(){

        if(instance){
           return instance;
        }

        instance = this;

        this.orders = [];
        this._states = {};
        this._components = {};

        this._lastState = null;
        this._currentState = null;
        this._nextState = null;

        this.promise = null;
        this._queuePromise = [];

        this._rules = {};
        this._rulesEvents = {};

        this.router = null;

        this.accessAll = "*";

        this._noContinue = false;
    }

    /**
     * Set component states
     * @param orders
     * @param states
     */
    setComponentStates(orders = [], states = {}){

        this.orders.push(orders);
        this.initStates(states);
    }

    /**
     * Init states to State Machine
     * @param config
     */
    initStates(config = {}){
        let key;

        for(key in config){

            let [classLink, alias] = config[key]

            if(classLink == null){
                console.error(`No found State class ${key}!`);
                continue;
            }

            this._states[key] = new classLink();
            this._states[key]._stateName = key;
            this._states[key].alias = alias;
            this._states[key]._stateMachine = this;

            if(!(this._states[key] instanceof StateInterface)){
                console.error(`State ${key} not implement from StateInterface!`);
            }
        }

    }

    /**
     * Init orders
     * @param orders
     */
    initOrders(orders = []){
        this.orders = orders;
    }

    /**
     * Set router
     * @param routerInstance
     */
    setRouter(routerInstance){
        this.router = routerInstance;
        this.router.stateMachine = this;
        this.router.subscribe();
    }

    /**
     * Get instance of router
     * @returns {*}
     */
    getRouter(){
        return this.router;
    }

    /**
     * Set state Machine component for routing
     * @param alias
     * @param instanceClass
     */
    setStateComponent(alias = null, instanceClass = null){
        instanceClass.stateMachine = this;
        this._components[alias] = instanceClass;
    }

    /**
     * Get state machine components
     * @param alias
     * @returns {*}
     */
    getStateComponent(alias = null){
        if(this._components[alias] == undefined) {
            return null;
        }

        return this._components[alias];
    }

    /**
     * Get state instance
     * @param name
     * @returns {*}
     */
    getState(name = null){
        let stateInstance = this._states[name];

        if(stateInstance){
            return stateInstance;
        }

        return null;
    }

    /**
     * Init transitions for State Machine
     * @param config
     */
    initRules(config = []){

        for(let i = 0, l = config.length; i < l; i++){

            let [_from, _to, _event] = config[i];

            if(this._rules[_from] == undefined){
                this._rules[_from] = [];
            }

            if(this._rules[_from].indexOf(_to) == -1){
                this._rules[_from].push(_to);
            }

            if(_event){

                $_event.setStateSubscriber(_event);

                if(!this._rulesEvents[_event]){
                    this._rulesEvents[_event] = {};
                }

                this._rulesEvents[_event][_from] = _to;
            }

        }

    }

    /**
     * Get current state
     * @returns {*}
     */
    get currentState(){
        return this._currentState;
    }

    /**
     * Get next state for transitions
     * @returns {*}
     */
    get nextState(){
        return this._nextState;
    }

    /**
     *
     * @returns {*}
     */
    get lastState(){
        return this._lastState;
    }

    setEvent(name = null){

        if(this._rulesEvents[name] == undefined){
            return ;
        }

        if(this._rulesEvents[name][this.currentState] == undefined){
            return ;
        }

        this.goToState(this._rulesEvents[name][this.currentState]);
    }

    /**
     * Check rules
     * @param nextState
     * @returns {boolean}
     */
    checkAccessRules(nextState = null){

        if(this.currentState === null){
            return true;
        }

        if(this._rules[this.accessAll].indexOf(nextState) != -1){
            return true;
        }

        if(nextState == this.accessAll){
            return true;
        }

        if(this._rules[this.currentState] == undefined){
            return false;
        }

        if(this._rules[this.currentState].indexOf(nextState) != -1){
            return true;
        }

        return false;
    }

    /**
     * Go to State
     * @param stateName
     * @param ignoreRules
     */
    goToState(stateName = null, ignoreRules = false){

        if(!ignoreRules && this.checkAccessRules(stateName) === false){
            console.error(`Access denied! From ${this.currentState} to ${stateName}`);
            return ;
        }

        if(this.promise == null){
            this._goToStateExecute(stateName);
            return ;
        }

        /**
         * If current state is still running, we write to the queue
         */
        if(this._queuePromise.indexOf(stateName) == -1){
            this._queuePromise.push(stateName);

            console.debug(`Add to history! ${stateName}`);
        }
    }

    /**
     * Check for next queue of state routes
     * @param resolve
     * @param reject
     * @private
     */
    _checkNextQueue(resolve, reject){

        let state = null;

        try{
            if(this._queuePromise.length > 0){
                state = this._queuePromise.shift();
            }

            this.promise = null;

            resolve();

            if(state){
                this._goToStateExecute(state);
            }
        } catch(e){
            reject(e);
        }
    }


    /**
     * Go to State
     * @param stateName
     */
    _goToStateExecute(stateName = null){

        this._nextState = stateName;

        console.log(`--> goto from ${this.currentState} to ${this.nextState}`);

        this.promise = null;

        this.promise = new Promise((resolve, reject) => {

            let promises = [];

            /**
             * Leave from last State
             */
            promises.push([this, this.leave, []]);

            /**
             * Enter to new State
             */
            promises.push([this, this.enter, []]);

            /**
             * Change global flags
             */
            promises.push([this, this.changeFlags, []]);

            /**
             * Execute main state method
             */
            promises.push([this, this.executeState, []]);

            /**
             * Check of next state action in queue with wait transitions
             */
            promises.push([this, this._checkNextQueue, []]);

            this.queuePromises(promises, resolve, reject, false);
        });

        this.promise.catch((e) => {
            console.error(e);
        });
    }

    /**
     * Leave from current State
     * @param resolve
     * @param reject
     */
    leave(resolve, reject){
        let toLeave = this.getState(this.currentState);

        if(!toLeave){
            resolve();
            return ;
        }

        toLeave.from = this.currentState;
        toLeave.to = this.nextState;

        try{
            this.executeTransition(toLeave, toLeave.getTransitionOrders(StateInterface.TYPE_LEAVE_TRANSITION), resolve, reject);
        } catch(e){
            reject(e);
        }

    }

    /**
     * Change main flags
     * @param resolve
     * @param reject
     */
    changeFlags(resolve, reject){
        this._lastState = this.currentState;
        this._currentState = this.nextState;
        this._nextState = null;
        resolve();
    }

    /**
     * Enter to new State
     * @param resolve
     * @param reject
     */
    enter(resolve, reject){
        let toEnter = this.getState(this.nextState);

        if(!toEnter){
            reject("No found next transition State!");
            return ;
        }

        toEnter.from = this.currentState;
        toEnter.to = this.nextState;

        try{
            this.executeTransition(toEnter, toEnter.getTransitionOrders(StateInterface.TYPE_ENTER_TRANSITION), resolve, reject);
        } catch(e){
            reject(e);
        }
    }

    /**
     * Execute state
     * @param resolve
     * @param reject
     */
    executeState(resolve, reject){

        let currentState = this.getState(this.currentState);

        currentState.from = this.lastState;
        currentState.to = this.currentState;

        try{
            this.executeTransition(currentState, currentState.getTransitionOrders(StateInterface.TYPE_EXECUTIVE), resolve, reject);
        } catch(e){
            reject(e);
        }
    }

    /**
     * Execute transitions
     * @param instance
     * @param listEvents
     * @param resolve
     * @param reject
     */
    executeTransition(instance, listEvents, resolve, reject){

        let promises = [];

        for(let i = 0, l = listEvents.length; i < l; i++){

            promises.push([
                instance, instance.executeTransition,
                [
                    listEvents[i]
                ]
            ]);
        }

        this.queuePromises(promises, resolve, reject, true);
    }

    /**
     * Go to router
     * @param type
     * @param important
     */
    goToRouter(type = StateMachine.ROUTER_NEXT, important = false){

        let router = this.getRouter();

        if(router === null){
            console.error('Router not found!');
            return;
        }

        let events = router.getEvents();

        if(!events[type]){
            console.error(`Router not found type of ${type}!`);
            return ;
        }

        for(let i = 0, l = events[type].length; i < l; i++){
            events[type][i].call(router, this.currentState, this._rules[this.currentState], important);
        }
    }

    /**
     * Finish execute methods in current state
     */
    finishStateMethods(){
        this._noContinue = true;
    }

    finishState(){
        this.promise = null;
    }

    /**
     * Queue Promise execute
     * @param queueList
     * @param resolve
     * @param reject
     * @param inState
     */
    queuePromises(queueList, resolve, reject, inState = false){

        this._noContinue = false;

        let _i = 0, _l = queueList.length;

        var promise = null;

        const executeQueue = () => {

            if(_i < _l){

                promise = new Promise((res, rej)=>{

                    let [context, method, variables] = queueList[_i];

                    try{
                        method.apply(context, [...variables, res, rej]);
                    } catch(e){
                        reject(e);
                    }

                });

                promise
                    .then(()=>{

                        if(inState === true && this._noContinue){
                            promise = null;
                            resolve();
                            return;
                        }

                        _i++;
                        executeQueue();

                    })
                    .catch((e)=>{
                        reject(e);
                    });

            } else {
                promise = null;
                resolve();
            }
        };

        executeQueue();
    }

    static get INSTANCE () { return this; }
}
