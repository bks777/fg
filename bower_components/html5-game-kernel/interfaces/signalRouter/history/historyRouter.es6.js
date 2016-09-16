/**
 * History collection for router
 */
export default class HistoryRouter {

    constructor(data = {}){

        this.localHistoryRoutes = [];
        this.localHistoryArgs = [];

        this.maxLength = 5;

        this.init(data);
    }

    /**
     * Init data for Class
     * @param data
     */
    init(data = {}){
        for(let key in data){
            this[key] = data[key];
        }
    }

    /**
     * Push last route to history
     * @param aliasRoute
     * @param args
     */
    push(aliasRoute = null, args = []){

        if(aliasRoute === null){
            return null;
        }

        this.localHistoryRoutes.unshift(aliasRoute);
        this.localHistoryArgs.unshift(args);

        this.localHistoryRoutes.splice(this.maxLength);
        this.localHistoryArgs.splice(this.maxLength);
    }

    /**
     * Find in max length of history
     * @param aliasRoute
     * @returns {number}
     */
    find(aliasRoute = null){
        return this.localHistoryRoutes.indexOf(aliasRoute);
    }

    /**
     * Is empty
     * @returns {boolean}
     */
    empty(){
        return this.localHistoryRoutes.length == 0;
    }

    /**
     * Get by name
     * @param aliasRoute
     * @returns {*}
     */
    getByName(aliasRoute = null){
        let find = this.find(aliasRoute);

        if(find == -1){
            return null;
        }

        return {
            alias   : this.localHistoryRoutes[find],
            args    : this.localHistoryArgs[find]
        }
    }

    /**
     * Get last route with
     * @returns {*}
     */
    getLast(){

        if(this.localHistoryRoutes.length == 0){
            return null;
        }

        return {
            alias   : this.localHistoryRoutes[0],
            args    : this.localHistoryArgs[0]
        }
    }

    /**
     * Ge last alias
     * @returns {*}
     */
    getLastAlias(){
        if(this.localHistoryRoutes.length == 0){
            return null;
        }

        return this.localHistoryRoutes[0];
    }

    /**
     * Get current state
     */
    getCurrentState(){
        let [component, parent] = this.getLastAlias().split('.');
        return parent;
    }

    /**
     * Get current subState
     */
    getCurrentSubState(){
        let [component, parent, children] = this.getLastAlias().split('.');
        return children;
    }

    getStateByIndex (index) {
        if (this.localHistoryRoutes.length <= index) {
            return null;
        }

        return this.localHistoryRoutes;
    }
}
