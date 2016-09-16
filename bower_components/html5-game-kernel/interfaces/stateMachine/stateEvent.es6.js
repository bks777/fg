/**
 * State Event
 */
export default class StateEvent {

    constructor(){

        /**
         * Get list of subscribe events
         * @returns {{}|*}
         */
        this._events = {};
    }

    /**
     * Subscribe to state events or transitions
     * @param name
     * @param func
     */
    on(name, func){

        if(this._events[name] == undefined){
            this._events[name] = [];
        }

        if(typeof func != "function"){
            console.error(`Subscribe to transition ${name} with out a function! Type entered - `, func);
        }

        if(createjs.indexOf(this._events[name], func) == -1){
            this._events[name].push(func);
        }
    }

    /**
     * UnSubscribe from state events or transitions
     * @param name
     * @param func
     */
    off(name, func){

        if(this._events[name] == undefined){
            return ;
        }

        let index = createjs.indexOf(this._events[name], func);

        if(index != -1){
            this._events[name].splice(index, 1);
        }

    }

    /**
     * Get events
     * @returns {{}|*}
     */
    getEvents(){
        return this._events;
    }
}