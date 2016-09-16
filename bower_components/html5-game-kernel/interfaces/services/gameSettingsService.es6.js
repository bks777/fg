import ServiceInterface from "./serviceInterface.es6.js";
import MemoryService from "./memoryService.es6";

export default class GameSettingsService extends ServiceInterface {

    constructor(data = {}){
        super({});

        this.memory = new MemoryService();
        this.keyMemory = "gameSettings";

        var _variable = typeof $_args.variablePageSettings != "undefined" ? $_args.variablePageSettings : "$_args";

        if(typeof window[_variable] != "undefined"){
            Object.assign(data, window[_variable]);
        }

        if(typeof window[_variable] != "undefined" && typeof window[_variable].sound != "undefined"){
            //this.getService("SoundService").setGameSound($_args.sound);
            //this.getService("SoundService").setGameEffects($_args.sound);
        }

        this.setSettings(data);
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
     * Set settings
     * @param settings
     */
    setSettings (settings = {}) {
        this.memory.set(this.keyMemory, settings, MemoryService.MEMORY_LOCAL);
    }

    /**
     * Get settings
     * @returns {*}
     */
    getSettings () {
        var setting = this.memory.get(this.keyMemory, MemoryService.MEMORY_LOCAL);

        if(setting === null){
            setting = {};
        }

        return setting;
    }

    /**
     * Set settings
     * @param settings
     */
    setLocalSettings (key, value) {
        this.memory.set(key, value, MemoryService.MEMORY_COOKIES_STORAGE);
    }

    /**
     * Get settings
     * @returns {*}
     */
    getLocalSettings (key) {
        let value = this.memory.get(key, MemoryService.MEMORY_COOKIES_STORAGE);

        return value;
    }

    /**
     * Set setting to base
     * @param key
     * @param value
     */
    setSetting(key = null, value = null){

        var setting = this.getSettings();

        setting[key] = value;

        this.setSettings(setting);
    }

    /**
     * Get setting
     * @param key
     * @returns {*}
     */
    getSetting (key = null){

        var setting = this.getSettings();

        if(setting[key] === undefined){
            return null;
        }

        return setting[key];
    }

    /**
     * Has setting
     * @param key
     * @returns {boolean}
     */
    hasSetting (key = null){
        return this.getSetting(key) !== null;
    }

    /**
     * Get exit url
     * @returns {null}
     */
    getExitUrl(){
        return this.getSetting("exit_url") === "undefined" ? null : this.getSetting("exit_url");
    }
}