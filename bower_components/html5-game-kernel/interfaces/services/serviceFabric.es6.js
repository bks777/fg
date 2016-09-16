import ServiceInterface from "./serviceInterface.es6.js";

export default class ServiceFabric {

    constructor(){
        this._services = {};
    }

    /**
     * Set service instance
     * @param name
     * @param service
     */
    setService(name = null, service = null){

        if(name === null){
            $_log.error(`Service name can not be empty!`, service);
            return null;
        }

        if(!(service instanceof ServiceInterface)){
            $_log.error(`Service can not be instance - "${name}"`, service);
            return null;
        }

        if(this._services[name] === undefined){
            this._services[name] = service;
        }
    }

    /**
     * Get service instance
     * @param name
     * @returns {*}
     */
    findService (name = null){

        if(this._services[name] === undefined){
            return null;
        }

        return this._services[name];
    }

    /**
     * Get instance of service
     * @param name
     * @returns {*}
     */
    getService (name = null){

        if(this.hasService(name) === false){
            if(this.createService(name) === true){
                return this.getService(name);
            }
        } else {
            return this.findService(name);
        }

        return null;
    }

    /**
     * Create Service
     * @param name
     * @returns {boolean}
     */
    createService (name = null) {

        if(this._services[name] === undefined && typeof window[name] == "function" ){
            new window[name]();

            return true;
        }

        return false;
    }

    /**
     * Has service class
     * @param name
     * @returns {boolean}
     */
    hasService (name = null){
        return this.findService(name) !== null;
    }

    /**
     * Set Service by name
     * @param name
     * @returns {*}
     */
    get (name = null) {
        return this.findService(name);
    }

    /**
     * Get All Services classes instances
     * @returns {{}|*}
     */
    getAll () {
        return this._services;
    }
}