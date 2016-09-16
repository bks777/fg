import ServiceInterface from "./serviceInterface.es6.js";
import SlotMachine from "../modelsUI/SlotMachine.es6.js";
import MemoryService from "./memoryService.es6";
import ProtocolService from "./protocolService.es6.js";

export default class SlotMachineService extends ServiceInterface {

    constructor(data = {}){
        super(data);

        this._serviceName = "slot";

        this.memory = new MemoryService();
        this.protocol = new ProtocolService();
    }

    /**
     * Get name
     * @param name
     * @returns {*}
     */
    getName (name = ""){
        return `${this._serviceName}-${name}`;
    }

    /**
     * Set instance from SlotMachine
     * @param instance
     */
    setInstance (instance = null) {

        if(instance instanceof SlotMachine){
            this.memory.set("slotMachine", instance);
        }
    }

    /**
     * Get instance from SlotMachine
     @returns {null|SlotMachine|}
     */
    getInstance () {
        return this.memory.get("slotMachine");
    }

    /**
     * SETTINGS
     */

    /**
     * Set count of columns
     * @param cols
     */
    setColumns (cols = 5){
        this.memory.set(this.getName("columns"), cols);
    }

    /**
     * Get count of columns
     * @returns {*}
     */
    getColumns (){
        return this.memory.get(this.getName("columns"));
    }

    /**
     * Set count of rows
     * @param rows
     */
    setRows (rows = 3){
        this.memory.set(this.getName("rows"), rows);
    }

    /**
     * Get count of rows
     * @returns {*}
     */
    getRows (){
        return this.memory.get(this.getName("rows"));
    }

    /**
     * SYMBOLS
     */

    /**
     * Set default symbols
     * @param symbols
     */

    /**
     * Set default symbols
     * @param symbols
     */
    setDefaultSymbols (symbols = []){
        this.memory.set(this.getName("defaultSymbols"), symbols);
    }

    /**
     * Get default symbols
     * @returns {*}
     */
    getDefaultSymbols (){
        return this.memory.get(this.getName("defaultSymbols"));
    }

    /**
     * Set reel samples
     * @param reelSamples
     */
    setReelSamples (reelSamples = {}){
        this.memory.set(this.getName("reelSamples"), reelSamples);
    }

    /**
     * Get reel sample
     * @param name
     * @returns {*}
     */
    getReelSample (name = "spins"){
        var list = this.memory.get(this.getName("reelSamples"));
        if(list[name] === undefined){
            $_log.error(`Not fount - "${name}" reel sample in SlotMachineService`);
            return null;
        }

        return list[name];
    }

    /**
     * REELS ============
     */

    /**
     * Get current reels matrix
     * @returns {*}
     */
    getMatrix (){
        let data = this.protocol.getCurrentReelsData();
        if(data === null || data.board === undefined){
            return [];
        }

        return data.board;
    }

    /**
     * Set paused
     * @param value
     */
    setPaused(value = false){
        this._paused = value;
    }

    /**
     * Get paused
     * @returns {boolean|*}
     */
    getPaused(){
        return this._paused;
    }
}