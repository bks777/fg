import ServiceInterface from "./serviceInterface.es6.js";
import MemoryService from "./memoryService.es6";
import ProtocolService from "./protocolService.es6.js";

/**
 * Game Action Class
 */
export default class GameActionService extends ServiceInterface {

    constructor(data = {}){
        super(data);

        this.memory = this.getService("MemoryService");
        this.protocol = this.getService("ProtocolService");

        this.nameAction = "gameAction";
        this.notUsed = ["restore"];

        this.active = false;
    }

    /**
     * Set activate
     */
    setActivate(){
        this.active = true;
    }

    /**
     * Set actions
     * @param actions
     */
    setActions (actions = []) {
        let clear = [];

        for(let i = 0, len = actions.length; i < len; i++){

            if(this.notUsed.indexOf(actions[i]) == -1){
                clear.push(actions[i]);
            }
        }

        this.set(clear);
    }

    /**
     * Set next action
     * @param action
     */
    set(action = this.protocol.getNextAction()){
        this.memory.set(this.nameAction, action);
    }

    has(actionName = null) {

        if(actionName !== null){
            return false;
        }

        return this.get
    }

    /**
     * Get
     * @returns {Array}
     */
    getActions(){

        let list = this.memory.set(this.nameAction);
        if(list instanceof Array && list.length > 0){
            return list;
        }

        return [];
    }

    /**
     * Get next action
     * @returns {*}
     */
    get(){
        let list = this.memory.get(this.nameAction);
        if(list instanceof Array && list.length > 0){
            return `${list[0]}`;
        }

        return this.protocol.getCurrentAction();
    }

    /**
     * Next action
     * @param childState
     * @param from
     * @private
     */
    _next(childState, from){

        if(!this.active){
            return null;
        }

console.debug (childState, from, this.get());

        if (from === "freespins" && this.get() === "freespin") {
            return 'freespins.game.wait';
        }

        if(this.get() != from){
            return `protocol.${this.get()}.init`;
        } else {
            return 'control..wait';
        }
    }

    /**
     * Execute next action
     * @param childState
     * @param from
     */
    next(childState = "wait", from = this.protocol.getCurrentAction()){// wait

        let action = this._next(childState, from);

        if(!action){
            return ;
        }

        $_signal.goTo(action);
    }


}