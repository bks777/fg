import ServiceInterface from "./serviceInterface.es6.js";
import MemoryService from "./memoryService.es6";

export default class ProtocolService extends ServiceInterface {

    constructor(data = {}){
        super(data);

        this.memory = new MemoryService();
        this.keyMemory = "gameProtocol";
    }

    /**
     * Get name
     * @param name
     * @returns {*}
     */
    getName (name = "") {
        return `${this.keyMemory}-${name}`;
    }

    /**
     * FREE BETS
     */

    /**
     * Set free Bets
     * @param freeBets
     */
    setFreeBets (freeBets = []) {
        this.memory.set(this.getName("freeBets"), freeBets);

        if(freeBets){
            this.memory.set(this.getName("freeBetsLast"), freeBets);
        }
    }

    /**
     * Has free Bets
     * @returns {boolean}
     */
    hasFreeBets (){
        let list = this.getFreeBets();
        return (list instanceof Array && list.length > 0) || (list instanceof Object && Object.keys(list).length > 0);
    }

    /**
     * Get free Bets
     * @returns {*}
     */
    getFreeBets (){
        return this.memory.get(this.getName("freeBets"));
    }

    /**
     * Get freebets last
     * @returns {*}
     */
    getFreeBetsLast(){
        return this.memory.get(this.getName("freeBetsLast"));
    }

    /**
     * Get Free Bets Left
     * @returns {*}
     */
    getFreeBetsLeft(){
        let freeBets = this.getFreeBets();

        if(freeBets && freeBets.left_spins !== undefined){
            return freeBets.left_spins;
        }

        return 0;
    }

    /**
     * MODES
     */

    /**
     * Set modes
     * @param listModes
     */
    setModes (listModes = ["play"]){
        this.memory.set(this.getName("modes"), listModes);
    }

    /**
     * USER DATA
     */

    /**
     * Set user data
     * @param user
     */
    setUserData (user = {}) {
        this.memory.set(this.getName("userData"), user);
    }

    /**
     * Get user data
     * @returns {*}
     */
    getUserData (){
        return this.memory.get(this.getName("userData"));
    }

    /**
     * Get current balance
     * @returns {number}
     */
    getCurrentBalance (){
        let data = this.getUserData();
        if(data && data.balance != null){
            return data.balance / 100;
        }

        return 0;
    }

    /**
     * Get current balance version
     * @returns {*}
     */
    getCurrentBalanceVersion (){
        return this.getUserData().balance_version;
    }

    /**
     * Get current currency
     * @returns {*}
     */
    getCurrentCurrency (short = false){

        if(!this.getUserData()){
            return null;
        }

        if(!this.memory.get(this.getName("currency"))){

            let curCurrency = this.getUserData().currency;

            if(!curCurrency || $_service_ticker_tape._demo === true){
                curCurrency = "";
            }

            if(short === true){
                return $_t.getText(curCurrency);
            }

            this.memory.set(this.getName("currency"), curCurrency);
        }

        return this.memory.get(this.getName("currency"));
    }

    /**
     * Get current denominator
     * @returns {*}
     */
    getCurrentDenominator (){
        return this.getUserData().denominator ? this.getUserData().denominator : 1;
    }

    /**
     * AVAILABLE ACTIONS
     */

    /**
     * Set available actions
     * @param actions
     */
    setAvailableActions (actions = []) {
        this.getService("GameActionService").setActions(actions);
        this.memory.set(this.getName("availableActions"), actions);
    }

    /**
     * Get available actions
     * @returns {*}
     */
    getAvailableActions (){
        return this.memory.get(this.getName("availableActions"));
    }

    /**
     * Is available spins
     * @returns {boolean}
     */
    isAvailableSpins (){
        return this.getAvailableActions().indexOf("spin") != -1;
    }

    /**
     * Is available freespins init
     * @returns {boolean}
     */
    isAvailableFreeSpinsInit(){
        return this.getAvailableActions().indexOf("freespin_init") != -1;
    }
    /**
     * Is available freespins init
     * @returns {boolean}
     */
    isAvailableFreeSpinsEnd(){
        return this.getAvailableActions().indexOf("freespin_stop") != -1;
    }

    /**
     * Is available end freeSpins
     * @returns {boolean}
     */
    isAvailableFreeSpins(){
        return this.getAvailableActions().indexOf("freespin") != -1;
    }

    /**
     * Is available bonus game
     * @returns {boolean}
     */
    isAvailableBonusGame(){
        return this.getAvailableActions().indexOf("bonus_init") != -1 ||
            this.getAvailableActions().indexOf("bonus_start") != -1 ||
            this.getAvailableActions().indexOf("bonus_pick") != -1 ||
            this.getAvailableActions().indexOf("bonus_stop") != -1;
    }

    /**
     * Start bonus game
     * @returns {boolean}
     */
    isAvailableStartBonusGame(){
        return this.getAvailableActions().indexOf("bonus_init") != -1;
    }

    /**
     * Close bonus game
     * @returns {boolean}
     */
    isAvailableEndBonusGame(){
        return this.getAvailableActions().indexOf("bonus_stop") != -1;
    }

    /**
     * Is available reSpin game
     * @returns {boolean}
     */
    isAvailableReSpinGame(){
        return this.getAvailableActions().indexOf("respin") != -1;
    }

    /**
     * Get next action for play game
     * @returns {*}
     */
    getNextAction (){
        if(this.isAvailableSpins() === true)        return "spin";
        if(this.isAvailableFreeSpinsInit() === true)    return "freespin_init";
        if(this.isAvailableFreeSpinsEnd() === true)    return "freespin_stop";
        if(this.isAvailableFreeSpins() === true)    return "freespin";
        if(this.isAvailableEndBonusGame() === true)    return "bonus_end";
        if(this.isAvailableBonusGame() === true)    return "bonus";
        if(this.isAvailableReSpinGame() === true)    return "respin";
    }

    /**
     * Get protocol next action
     * @returns {*}
     */
    getProtocolNextAction(){
        return this.getAvailableActions()[0];
    }

    /**
     * Set current action
     * @param currentAction
     */
    setCurrentAction (currentAction = "spins"){
        this.memory.set(this.getName("currentAction"), currentAction);
    }

    /**
     * Get current action
     * @returns {*}
     */
    getCurrentAction (){
        return this.memory.get(this.getName("currentAction"));
    }

    /**
     * Set last action
     * @param lastAction
     */
    setLastAction(lastAction = null){
        this.memory.set(this.getName("lastAction"), lastAction);
    }

    /**
     * Get last action
     * @returns {*}
     */
    getLastAction(){
        return this.memory.get(this.getName("lastAction"));
    }


    /**
     * Data of fabric reels by current action ====== REELS
     */

    /**
     * Set freeSpins reels data
     * @param freeSpinReelsData
     */
    setFreeSpinsReelsData ( freeSpinReelsData = {}){
        this.getService("LinesService").updateHistory();

        this.memory.set(this.getName("freespins_ReelsData"), freeSpinReelsData);
    }

    /**
     * Set spins reels data
     * @param spinsReelsData
     */
    setSpinsReelsData (spinsReelsData = {}){
        this.getService("LinesService").updateHistory();

        this.memory.set(this.getName("spins_ReelsData"), spinsReelsData);
    }

    /**
     * Set reSpins reels data
     * @param reSpinsReelsData
     */
    setReSpinsReelsData(reSpinsReelsData = {}){
        this.getService("LinesService").updateHistory();

        this.memory.set(this.getName("respins_ReelsData"), reSpinsReelsData);
    }

    /**
     * Get current reels data
     * @param current
     * @returns {*}
     */
    getCurrentReelsData (current = this.getCurrentAction()){
        if(current === "respin") current = "spins";

        var method = `${current}_ReelsData`;

        return this.memory.get(this.getName(method));
    }

    /**
     * Get current win
     * @param current
     * @returns {*}
     */
    getCurrentWin (current = this.getCurrentAction()){

        if(current === "respin") current = "spin";

        let data = this.getCurrentReelsData(current);

        if(data !== null && data.round_win != undefined){
            return data.round_win;
        }

        return 0
    }

    /**
     * Check of type next game
     */
    checkNextGame (){

    }
}