import ServiceInterface from "./serviceInterface.es6.js";
import MemoryService from "./memoryService.es6";
import ProtocolService from "./protocolService.es6.js";

export default class FreeSpinService extends ServiceInterface {

    constructor(data = {}){
        super();

        this.memory = new MemoryService();
        this.protocol = $_services.getService("ProtocolService");
    }

    /**
     * Get freeSpins left
     * @returns {*}
     */
    getFreeSpinLeft () {
        let data = this.protocol.getCurrentReelsData();
        if (data === null) {
            return 0;
        }
        if(data.rounds_lefts !== undefined){

            return data.rounds_lefts;
        }

        if(data.winscatters !== undefined && data.winscatters.length > 0){
            return data.winscatters[0].freespins;
        }

        data = this.protocol.getCurrentReelsData("freespins");
        if(data.rounds_lefts !== undefined || data.rounds_lefts !== null){
            return data.rounds_lefts;
        }

        return 0;
    }

    /**
     * Get Total Win
     * @returns {*}
     */
    getTotalWin (){

        let data = this.protocol.getCurrentReelsData("freespins");
        if(data && data.total_win != null){
            return data.total_win;
        }

        return 0;
    }

    /**
     * Get additional freeSpins
     * @returns {*}
     */
    getAdditionalFreeSpins () {
        let data = this.protocol.getCurrentReelsData("freespins");

        if(data.winscatters && data.winscatters.length > 0 && data.winscatters[0].freespins){
            return data.winscatters[0].freespins;
        }

        return false;
    }


    isActive() {
        return this.protocol.getCurrentReelsData("freespins") !== null;
    }
}