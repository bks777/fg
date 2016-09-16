import ServiceInterface from "./serviceInterface.es6.js";
import MemoryService from "./memoryService.es6";
import ProtocolService from "./protocolService.es6.js";

export default class BetService extends ServiceInterface {

    constructor(data = {}){
        super();

        this.memory = new MemoryService();
        this.protocol = new ProtocolService();

        this.nameCurrentBet = "currentBet";
    }

    /**
     * Set bet range
     * @param bets
     */
    setBetRange (bets = []){
        this.memory.set("betRange", bets);
    }

    /**
     * Get bet range
     * @returns {*}
     */
    getBetRange (){
        return this.memory.get("betRange");
    }

    /**
     * Get current protocol value of bet per lines
     * @returns {*}
     */
    getCurrentProtocolValue (){
        var data = this.protocol.getCurrentReelsData();

        if(!data){
            data = this.protocol.getCurrentReelsData("spins");
        }

        if(data == undefined){
            return 0;
        }
        return data.bet_per_line;
    }

    /**
     * Check to backward
     * @returns {boolean}
     */
    checkBackward() {
        return this.getBetRange().indexOf(this.getCurrentValue()) > 0;
    }

    /**
     * Check to forward
     * @returns {boolean}
     */
    checkForward() {
        var list = this.getBetRange();
        return (list.indexOf(this.getCurrentValue()) < (list.length - 1));
    }

    /**
     * Change to backward
     * @returns {boolean}
     */
    changeToBackward() {

        if(this.checkBackward()){
            let list = this.getBetRange();
            let find = list.indexOf(this.getCurrentValue());
            this.setCurrentValue(list[find - 1]);
            return true;
        }

        return false;
    }

    /**
     * Change to forward
     * @returns {boolean}
     */
    changeToForward() {

        if(this.checkForward()){
            let list = this.getBetRange();
            let find = list.indexOf(this.getCurrentValue());
            this.setCurrentValue(list[find + 1]);
            return true;
        }

        return false;
    }

    /**
     * Change to max bet
     */
    changeToMaxValue (){
        let list = this.getBetRange();
        this.setCurrentValue(list[list.length - 1]);
    }

    /**
     * Set current value
     * @param value
     * @returns {*}
     */
    setCurrentValue (value = 1){
        return this.memory.set(this.nameCurrentBet, value);
    }

    /**
     * Get current value of bet
     * @returns {number}
     */
    getCurrentValue() {
        if(this.memory.get(this.nameCurrentBet) === null){
            this.setCurrentValue(this.getCurrentProtocolValue());
        }

        /**
         * If FreeBets actives
         */
        if(this.getService("ProtocolService").hasFreeBets()){
            let data = this.getService("ProtocolService").getFreeBetsLast();

            if(data && data.bet_per_line !== undefined){
                return data.bet_per_line
            }
        }

        return this.memory.get(this.nameCurrentBet);
    }

    /**
     * Update bet value from protocol
     */
    updateFromProtocol () {
        this.setCurrentValue(this.getCurrentProtocolValue());
    }


}