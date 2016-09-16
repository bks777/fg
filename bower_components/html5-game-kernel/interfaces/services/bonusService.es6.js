import ServiceInterface from "./serviceInterface.es6.js";
import MemoryService from "./memoryService.es6";

export default class BonusService extends ServiceInterface {

    constructor(data = {}){
        super(data);

        this.memory = new MemoryService();

        this._serviceName = "bonus";
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
     * Set bonus info
     * @param bonusInfo
     */
    setBonusSettings (bonusInfo = {}){
        this.memory.set(this.getName("settings"), bonusInfo);
    }

    /**
     * Get bonus info
     * @returns {*}
     */
    getBonusSettings (){
        return this.memory.get(this.getName("settings"));
    }

    /**
     * Set bonus context
     * @param bonusContext
     */
    setBonusContext (bonusContext = null){
        if(bonusContext !== null){
            this.memory.set(this.getName("context"), bonusContext);
        }
    }

    /**
     * Get bonus context
     * @returns {*}
     */
    getBonusContext (){
        return this.memory.get(this.getName("context"));
    }

    /**
     * end bonus game
     */
    endBonusGame() {
        this.started = false;
    }

    /**
     * start bonus game
     */
    startBonusGame() {
        this.started = true;
    }

    /**
     * check if bonus game is started
     * @returns {boolean}
     */
    isStarted() {
        return this.started;
    }
}