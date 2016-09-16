import ServiceInterface from "./serviceInterface.es6.js";
import MemoryService from "./memoryService.es6";
import ProtocolService from "./protocolService.es6.js";

export default class LinesService extends ServiceInterface {

    static get TYPE_SORT_MIN_MAX () { return "WinLinesMinToMax"; }
    static get TYPE_SORT_START_TRIGGER () {return "WinStartTrigger";}

    constructor(data = {}){
        super();

        this.memory = new MemoryService();
        this.protocol = new ProtocolService();

        this.nameCurrentValue = "currentLines";
        this.nameCounter = "linesCounter";
        this.nameUpdateCounter = "linesUpdateCounter";
    }

    /**
     * Set lines range
     * @param lines
     */
    setLinesRange (lines = []){
        this.memory.set("linesRange", lines);
    }

    /**
     * Get lines range
     * @returns {*}
     */
    getLinesRange (){
        return this.memory.get("linesRange");
    }

    /**
     * Set paylines
     * @param payLines
     */
    setPayLines (payLines = []){
        this.memory.set("payLinesRange", payLines);
    }

    /**
     * Get paylines
     * @returns {*}
     */
    getPayLines (){
        return this.memory.get("payLinesRange");
    }

    /**
     * Get current protocol value of count lines
     * @returns {*}
     */
    getCurrentProtocolValue (){
        let data = this.protocol.getCurrentReelsData();

        if(!data){
            data = this.protocol.getCurrentReelsData("spins");
        }

        if(data == undefined){
            return 0;
        }
        return data.lines;
    }

    /**
     * Set to zero a counter
     */
    setToZeroCounter(){
        this.memory.set(this.nameCounter, 0);
        this.memory.set(this.nameUpdateCounter, false);
    }

    /**
     * Get counter
     * @param length
     * @returns {number}
     */
    getCounter(length = 0){
        let count = this.memory.get(this.nameCounter);

        if(!this.memory.has(this.nameUpdateCounter)){
            this.memory.set(this.nameUpdateCounter, false);
        }

        let clone = count;//.toString();

        if(count < (length - 1)){
            count++;
        } else {
            count = 0;
            this.memory.set(this.nameUpdateCounter, true);
        }

        this.memory.set(this.nameCounter, count);

        return clone;//parseInt(clone);
    }

    /**
     * Is update by cycle
     * @returns {*}
     */
    isUpdateCounter (){
        return this.memory.get(this.nameUpdateCounter);
    }

    /**
     * Check to backward
     * @returns {boolean}
     */
    checkBackward() {
        return this.getLinesRange().indexOf(this.getCurrentValue()) > 0;
    }

    /**
     * Check to forward
     * @returns {boolean}
     */
    checkForward() {
        var list = this.getLinesRange();
        return (list.indexOf(this.getCurrentValue()) < (list.length - 1));
    }

    /**
     * Change to backward
     * @returns {boolean}
     */
    changeToBackward() {
        if(this.checkBackward()){
            let list = this.getLinesRange();
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
            let list = this.getLinesRange();
            let find = list.indexOf(this.getCurrentValue());
            this.setCurrentValue(list[find + 1]);
            return true;
        }

        return false;
    }

    /**
     * Change to max lines
     */
    changeToMaxValue (){
        let list = this.getLinesRange();
        this.setCurrentValue(list[list.length - 1]);
    }

    /**
     * Set current value
     * @param value
     * @returns {*}
     */
    setCurrentValue (value = 1){
        return this.memory.set(this.nameCurrentValue, value);
    }

    /**
     * Get current value of bet
     * @returns {number}
     */
    getCurrentValue() {
        if(this.memory.get(this.nameCurrentValue) === null){
            this.setCurrentValue( this.getCurrentProtocolValue());
        }

        /**
         * If FreeBets actives
         */
        if(this.getService("ProtocolService").hasFreeBets()){
            let data = this.getService("ProtocolService").getFreeBetsLast();

            if(data && data.lines !== undefined){
                return data.lines; // если wl выбрал не валидное значение линий, игра ломается, и это нормально!
            }
        }

        return this.memory.get(this.nameCurrentValue);
    }

    /**
     * Get winLines
     * @returns {*}
     */
    getWinLines (){
        var data = this.protocol.getCurrentReelsData();

        if(data === null || this._clearHistory === true){
            return [];
        }

        return [
            ...this._checkEmpty(data.winrespins),
            ...this._checkEmpty(data.winlines),
            ...this._checkEmpty(data.winscatters),
            ...this._checkEmpty(data.winbonus)
        ];
    }

    /**
     * Check if empty
     * @param data
     * @returns {Array}
     * @private
     */
    _checkEmpty(data = []){
        if(data === undefined || data === null){
            return [];
        }

        if(data instanceof Array && data.length == 0){
            return [];
        }

        return data;
    }

    /**
     * Get winLines with sort by min to max of amount win lines
     * @returns {*}
     */
    getWinLinesMinToMax (){

        var list = this.getWinLines();
        if(!(list instanceof Array) || list.length == 0){
            return false;
        }

        return list.sort((a, b)=>{

            if (a.trigger !== undefined) return 1;
            if (b.trigger !== undefined) return -1;

            if (a.amount > b.amount) return -1;
            if (a.amount < b.amount) return 1;
            if (a.amount == b.amount) {
                if (a.line < b.line) {
                    return -1;
                } else {
                    return 1;
                }
            }

        });
    }

    /**
     * Get only trigger data
     * @returns {*}
     */
    getWinStartTrigger(){

        var list = this.getWinLines();
        if(!(list instanceof Array) || list.length == 0){
            return false;
        }

        list = list.filter((el) => {
            if(!el.trigger) return false;
            return true;
        });

        return list.sort((a, b)=>{

            if (a.amount > b.amount) return -1;
            if (a.amount < b.amount) return 1;
            if (a.amount == b.amount) {
                if (a.line < b.line) {
                    return -1;
                } else {
                    return 1;
                }
            }
        })
    }

    /**
     * Get next line with data [{data}, true|false(for audio)]
     * @param name
     * @returns {*}
     */
    getNextLine(name = LinesService.TYPE_SORT_MIN_MAX){
        let method = `get${name}`;

        if(typeof this[method] != 'function'){
            return false;
        }

        let data = this[method]();

        if(data === false){
            return false;
        }

        let isUpdateCounter = this.isUpdateCounter();
        let count = this.getCounter(data.length);

        return [data[count], !isUpdateCounter];
    }

    /**
     * Update history from protocol service
     */
    updateHistory(){
        this._clearHistory = false;
    }

    /**
     * Clear history if animations of lines was stopped
     */
    clearHistory(){
        this._clearHistory = true;
    }

    /**
     * Update bet value from protocol
     */
    updateFromProtocol () {
        this.setCurrentValue(this.getCurrentProtocolValue());
    }
}