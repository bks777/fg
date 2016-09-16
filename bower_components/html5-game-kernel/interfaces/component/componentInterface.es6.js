/**
 * Component Interface
 * @constructor
 */
export default class ComponentInterface {

    constructor(data = {}){

        this.instanceName = null;
        this.alias = null;
        this.typePart = "common";


        this.init(data);
    }

    init (data = {}){
        for(let key in data) {
            this.set(key, data[key]);
        }
    }

    /**
     * Set data values
     * @param key
     * @param data
     */
    set (key, data = null) {
        this[key] = data;
    };

    /**
     * Get data values
     * @param key
     * @returns {*}
     */
    get (key) {
        if(typeof this[key] == 'undefined'){
            return null;
        }

        return this[key];
    };

    /**
     * Get instance class in current component
     * @param nameClass
     * @returns {*}
     */
    getInst (nameClass) {
        if(typeof this[`get${nameClass}`] == 'function'){
            return this[`get${nameClass}`]();
        }

        return null;
    };

    /**
     * Get instance class by cross method
     * @param nameClass
     * @param alias
     */
    getInstCross (nameClass, alias = this.alias) {
        var _find = $_component_instances.get(nameClass, alias, this.typePart);
        if(_find === null){
            return null;
        }

        return window[_find];
    };

    /**
     * Get Flag by component
     * @param name
     * @returns {*}
     */
    getFlag (name) {
        return HelperFlags.get(name, this.alias);
    };

    /**
     * Set Flag by component
     * @param name
     * @param value
     * @returns {*}
     */
    setFlag (name, value = null) {
        return HelperFlags.set(name, value, this.alias);
    };

    /**
     * Get Flag by cross component
     * @param name
     * @param alias
     * @returns {*}
     */
    getFlagCross (name, alias = this.alias) {
        return HelperFlags.get(name, alias);
    };

    /**
     * Set Flag by cross component
     * @param name
     * @param value
     * @param alias
     * @returns {*}
     */
    setFlagCross (name, value, alias = this.alias) {
        return HelperFlags.set(name, value, alias);
    };

    /**
     * Get Flag in global storage
     * @param name
     * @returns {*}
     */
    getFlagGlobal (name) {
        return HelperFlags.get(name, HelperFlags.GLOBAL);
    };

    /**
     * Set Flag in global storage
     * @param name
     * @param value
     * @returns {*}
     */
    setFlagGlobal (name, value = null) {
        return HelperFlags.set(name, value, HelperFlags.GLOBAL);
    };

    /**
     * Get service instance
     * @param name
     * @returns {*}
     */
    getService (name = null){

        if($_services.hasService(name) === false){
            if($_services.createService(name) === true){
                return $_services.getService(name);
            }
        } else {
            return $_services.getService(name);
        }

        return null;
    }

    /**
     * Get handler
     * @param alias
     * @returns {*}
     */
    getHandler (alias = this.alias) {
        let instances = $_component_instances.getComponentInstances(alias);

        if (!instances || instances.length === 0) {
            return null;
        }

        if (instances.length > 1) {
            $_log.warn("WARNING: Using getHandler() while number of handlers > 1. May be incorrect result");
            return null;
        }

        //console.debug(instances);

        let handlers = [];
        for (let h in instances) {
            if (h.indexOf ("_h_") > -1) {
                handlers.push( {name: h, instance: instances[h]} );
            }
        }

        if (handlers.length > 1) {

            for (let h in handlers) {
                if (handlers[h].name.indexOf(__RunPartialApplication.type) >= 0) {
                    return handlers[h].instance;
                }
            }

            for (let h in handlers) {
                if (handlers[h].name.indexOf("common") >= 0) {
                    return handlers[h].instance;
                }
            }
        } else {
            return handlers[0].instance;
        }

    }

    /**
     * Get controller
     * @param alias
     * @returns {*}
     */
    getController (alias = this.alias) {
        let instances = $_component_instances.getComponentInstances(alias);

        if (!instances || instances.length === 0) {
            return null;
        }

        if (instances.length > 1) {
            $_log.warn("WARNING: Using getController() while number of handlers > 1. May be incorrect result");
            return null;
        }

        let handlers = [];
        for (let h in instances) {
            if (h.indexOf ("_c_") > -1) {
                handlers.push( {name: h, instance: instances[h]} );
            }
        }

        if (handlers.length > 1) {

            for (let h in handlers) {
                if (handlers[h].name.indexOf(__RunPartialApplication.type) >= 0) {
                    return handlers[h].instance;
                }
            }

            for (let h in handlers) {
                if (handlers[h].name.indexOf("common") >= 0) {
                    return handlers[h].instance;
                }
            }
        } else {
            return handlers[0].instance;
        }

    }

    /**
     * Ge event
     * @param alias
     * @returns {*}
     */
    getEvent (alias = this.alias) {
        let instances = $_component_instances.getComponentInstances(alias);

        if (!instances || instances.length === 0) {
            return null;
        }

        if (instances.length > 1) {
            $_log.warn("WARNING: Using getEvent() while number of handlers > 1. May be incorrect result");
            return null;
        }

        let handlers = [];
        for (let h in instances) {
            if (h.indexOf ("_e_") > -1) {
                handlers.push( {name: h, instance: instances[h]} );
            }
        }

        if (handlers.length > 1) {

            for (let h in handlers) {
                if (handlers[h].name.indexOf(__RunPartialApplication.type) >= 0) {
                    return handlers[h].instance;
                }
            }

            for (let h in handlers) {
                if (handlers[h].name.indexOf("common") >= 0) {
                    return handlers[h].instance;
                }
            }
        } else {
            return handlers[0].instance;
        }
    }

    /**
     * Get state
     * @param stateName
     * @returns {*|S|CodePathState}
     */
    getState(stateName = $_stateMachine.currentState){
        return $_stateMachine.getState(stateName);
    }

    /**
     * Get state Machine component
     * @param stateComponentName
     * @returns {*}
     */
    getStateComponent(stateComponentName = null){
        return $_stateMachine.getStateComponent(stateComponentName);
    }
}
