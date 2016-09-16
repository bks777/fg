import ServiceInterface from "./serviceInterface.es6.js";

/**
 * Service PayTable
 */
export default class PayTableService extends ServiceInterface {

    constructor(data = {}){
        super(data);

        this.memory = this.getService("MemoryService");
    }

    /**
     * Set payTable
     * @param payTable
     */
    setPayTable (payTable = {}){
        this.memory.set("payTable", payTable);
    }

    /**
     * Get payTable
     * @returns {*}
     */
    getPayTable (){
        return this.memory.get("payTable");
    }

}