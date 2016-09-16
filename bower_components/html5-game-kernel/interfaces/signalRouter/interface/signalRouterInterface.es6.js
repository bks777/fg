/**
 * State router Interface
 * @constructor
 */
export default class SignalRouterInterface {

    constructor(data = {}){
        /**
         * Link to $_signal_init.getRouter() function
         * @type {null}
         */
        this._getRouter = null;

        this.init(data);
    }

    /**
     * Init constructor data to Class
     * @param data
     */
    init (data = {}) {
        for(let key in data){
            this[key] = data[key];
        }
    };

    /**
     * Get router
     * @param namespace
     * @returns {*}
     */
    getRouter (namespace = null) {
        return this._getRouter.call($_signal_init, namespace);
    };

    /**
     * Go to state
     * @param namespace
     * @param args
     */
    goTo (namespace = null, ...args) {
        // realization in Class
    };

    /**
     * Back to forward state
     */
    back () {
        // realization in Class
    };
}