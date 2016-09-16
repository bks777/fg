/**
 * Initialization of state routing
 * @constructor
 */
export default class SignalInitializationInterface {

    constructor(data = {}){

        /**
         * Routers
         * @type {{}}
         * @private
         */
        this._routers = {};
        this._defaultState = "main";
    }

    /**
     * Set routers
     * @param data
     */
    setRouters (data) {
        this._routers = data;
    };

    /**
     * Has router
     * @param namespace
     * @returns {boolean}
     */
    hasRouter (namespace = null) {
        return this._routers[__RunPartialApplication.type].signals[namespace] !== undefined;
    };

    /**
     * Get router
     * @param namespace
     * @returns {*}
     */
    getRouter (namespace = null) {
        if(!this.hasRouter(namespace)){
            return null;
        }

        return this._routers[__RunPartialApplication.type].signals[namespace];
    };

    /**
     * Get default state
     * @returns {*}
     */
    getDefault () {
        return this.getRouter(this._defaultState);
    };

    /**
     * Show all routers
     * @returns {{}}
     */
    showAll () {
        return this._routers;
    };
}