import ServiceInterface from "./serviceInterface.es6.js";
import MemoryService from "./memoryService.es6";

export default class FlagService extends ServiceInterface {

    /**
     * Global alias
     * @type {string}
     */
    static get GLOBAL () {  return "__GLOBAL__";   }

    constructor(data = {}){
        super();

        this.memory = new MemoryService();

        this._memoryName = "helper_flags";
    }

    /**
     * Set flag
     * @param name
     * @param value
     * @param alias
     */
    set (name = null, value = null, alias = FlagService.GLOBAL) {

        let data = this.memory.get(this._memoryName);

        if(!data){
            data = {};
        }

        if(typeof data[alias] == 'undefined'){
            data[alias] = {};
        }

        data[alias][name] = value;

        this.memory.set(this._memoryName, data);
    };

    /**
     * Get flag
     * @param name
     * @param alias
     */
    get  (name = null, alias = FlagService.GLOBAL) {

        let data = this.memory.get(this._memoryName);

        if(!data){
            return null;
        }

        if(typeof data[alias] == 'undefined'){
            data[alias] = {};
        }

        if(typeof data[alias][name] == 'undefined'){
            return null;
        }

        return data[alias][name];
    };

    /**
     * Show flags all
     * @param alias
     */
    showAll (alias = null) {

        let data = this.memory.get(this._memoryName);

        if(alias == null){
            return data;
        }

        if(typeof data[alias] == 'undefined'){
            data[alias] = {};
        }

        return data[alias];
    };
}
