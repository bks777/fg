import ServiceInterface from "./serviceInterface.es6.js";
import MemoryService from "./memoryService.es6";
import ProtocolService from "./protocolService.es6.js";

let self;

export default class AutoPlayService extends ServiceInterface {

    constructor(data = {}){
        super();
        self = this;
        this.memory = new MemoryService();
        this.protocol = new ProtocolService();

        this.nameCurrentAutoPlayValue = "currentAutoPlayValue";
        this._suspended = false;

        this.stopAutoSpins();

        this.lastStartValue = 0;
    }


    /**
     * Set auto play range
     * @param autoPlayRange
     */
    setAutoPlayRange (autoPlayRange = []){
        this.memory.set("autoPlayRange", autoPlayRange);
    }

    /**
     * Get auto play range
     * @returns {*}
     */
    getAutoPlayRange (){
        return this.memory.get("autoPlayRange");
    }

    /**
     * Set current value
     * @param value
     * @returns {*}
     */
    setCurrentValue (value = 1){
        if (value < -2) {
            value = -1;
        }
        return this.memory.set(this.nameCurrentAutoPlayValue, value);
    }

    /**
     * Get current value of auto play
     * @returns {number}
     */
    getCurrentValue() {
        return this.memory.get(this.nameCurrentAutoPlayValue);
    }

    /**
     * Set start value
     * @param value
     * @returns {*}
     */
    setStartValue (value = 1){
        if (value < -2) {
            value = -1;
        }

        this.lastStartValue = value;

        return this.memory.set("startAutoSpinValue", value);
    }
    /**
     * Set current value
     * @param value
     * @returns {*}
     */
    getStartValue (){
        return this.memory.get("startAutoSpinValue");
    }

    /**
     * Check status of auto game
     * @returns {boolean}
     */
    isActive () {
        if (this._stopOnWin) {
            if (this.getService("ProtocolService").getCurrentWin() > 0) {
                this.stopAutoSpins();
            }
        }
        if (this._stopIfWinExceeds !== -1) {
            if (this.getService("ProtocolService").getCurrentWin() >= this._stopIfWinExceeds) {
                this.stopAutoSpins();
            }
        }
        if (this._stopIfCashIncrease !== -1) {
            if (self.getService("ProtocolService").getCurrentBalance() - self.balanceOnStart  >= this._stopIfCashIncrease) {
                this.stopAutoSpins();
            }
        }
        if (this._stopIfCashDecrease !== -1) {
            if (self.balanceOnStart - self.getService("ProtocolService").getCurrentBalance() >= this._stopIfCashDecrease) {
                this.stopAutoSpins();
            }
        }

        return (this.getCurrentValue() >= 0 || this.getCurrentValue() === -2 );
    }

    /**
     * Is paused
     * @returns {boolean}
     */
    isSuspended(){
        return this._suspended;
    }

    /**
     * Suspended auto spins
     */
    suspend(){
        this._suspended = true;
    }

    /**
     * Resume auto spin
     */
    resume(){
        this._suspended = false;
    }

    /**
     * Next spin. Decrement current value of autospin. Or return false if autospins is disabled
     * @returns {*}
     */
    nextSpin () {

        if (this.isActive() && !this.isSuspended()) {

            if(this.getCurrentValue() !== -2){
                this.setCurrentValue(this.getCurrentValue() - 1);
            }

            return this.getCurrentValue();
        }
        return false;
    }

    /**
     * start auto spins
     * @param num
     */
    startAutoSpins (num) {
        self.balanceOnStart = self.getService("ProtocolService").getCurrentBalance();
        self.setStartValue (num);

        if(num !== -2){
            num--;
        }

        self.setCurrentValue(num);
    }

    retryAutoSpins () {
        self.startAutoSpins(self.getStartValue());
    }

    /**
     * stop auto spins
     */
    stopAutoSpins () {
        self.setCurrentValue(-1);
    }

    enableStopOnAnyWin () {
        self._stopOnWin = true;
    }

    disableStopOnAnyWin () {
        self._stopOnWin = false;
    }

    enableStopOnFreeGame () {
        self._stopOnFreeGame = true;
    }

    disableStopOnFreeGame () {
        self._stopOnFreeGame = false;
    }

    enableStopBonus () {
        self._stopOnBonus = true;
    }

    disableStopBonus () {
        self._stopOnBonus = false;
    }

    enableStopIfWinExceed (value = 0) {
        self._stopIfWinExceeds = parseInt(value);
    }

    disableStopIfWinExceed () {
        self._stopIfWinExceeds = -1;
    }

    enableStopIfCashIncrease (value = 0) {
        self._stopIfCashIncrease = parseInt(value);
    }

    disableStopIfCashIncrease () {
        self._stopIfCashIncrease = -1;
    }

    enableStopIfCashDecrease (value) {
        self._stopIfCashDecrease = parseInt(value);
    }

    disableStopIfCashDecrease () {
        self._stopIfCashDecrease = -1;
    }

    isStopOnFreeGameEnabled () {
        return self._stopOnFreeGame;
    }

    isStopOnBonusEnabled () {
        return self._stopOnBonus;
    }

    /**
     * Get last start value
     * @returns {*}
     */
    getLastStartValue(){
        return this.lastStartValue == -2 ? $_t.decodeCharCodeToString(8734) : this.lastStartValue;
    }

}