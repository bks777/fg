import ServiceInterface from "./serviceInterface.es6.js";

/**
 * Service memory for save data in session game
 */
export default class MemoryService extends ServiceInterface {

    static get MEMORY_LOCAL () {            return "local";   }
    static get MEMORY_LOCAL_STORAGE () {    return "localStorage";   }
    static get MEMORY_SESSION_STORAGE () {  return "sessionStorage";   }
    static get MEMORY_COOKIES_STORAGE () {  return MemoryService.MEMORY_LOCAL_STORAGE;/*"cookiesStorage";*/   }

    constructor(){
        super();

        if(this.service._localMemory !== undefined){
            this._localMemory = this.service._localMemory;
        } else {
            this._localMemory = {};
        }

        this._checkAvailableCookiesFlag = null;
        this._isLocalStorageAvailable = null;
        this._isSessionStorageAvailable = null;
    }

    /**
     * Set key with values to memory
     * @param key
     * @param value
     * @param type
     * @returns {*}
     */
    set(key = null, value = null, type = MemoryService.MEMORY_LOCAL) {

        let method = `_${type}Set`;

        if(this[method] !== undefined){
            return this[method](key, value);
        }

        $_log.error(`SET - Type of save data - "${type}" Not found! For key - "${key}"`);

        return null;
    }

    /**
     * Get values from key
     * @param key
     * @param type
     * @returns {*}
     */
    get (key = null, type = MemoryService.MEMORY_LOCAL) {

        let method = `_${type}Get`;

        if(this[method] !== undefined){
            return this[method](key);
        }

        $_log.error(`GET - Type of save data - "${type}" Not found! For key - "${key}"`);

        return null;
    }

    /**
     * Has values with value from key
     * @param key
     * @param type
     * @returns {*}
     */
    has (key = null, type = MemoryService.MEMORY_LOCAL){
        return this.get(key, type) != undefined;
    }

    /**
     * VARIABLE STORAGE
     */

    /**
     * Set to local memory
     * @param key
     * @param value
     * @private
     */
    _localSet (key = null, value = null) {
        return this._localMemory[key] = value;
    }

    /**
     * Get from local memory
     * @param key
     * @returns {*}
     * @private
     */
    _localGet (key = null) {
        if(this._localMemory[key] === undefined){
            return null;
        }

        return this._localMemory[key];
    }

    /**
     * COOKIES STORAGE
     */

    /**
     * Check available cookies
     * @returns {boolean}
     * @private
     */
    _checkAvailableCookies(){

        if ( this._checkAvailableCookiesFlag !== null ) {
            return this._checkAvailableCookiesFlag;
        }

        Cookies.set('_test', 1);
        var _res = Cookies.get('_test');

        if (_res != 1) {
            return this._checkAvailableCookiesFlag = false;
        }

        Cookies.set('_test', 2);
        _res = Cookies.get('_test');

        Cookies.remove('_test');

        return this._checkAvailableCookiesFlag = (_res == 2);
    }

    /**
     * Set cookie data
     * @param key
     * @param value
     * @private
     */
    _cookiesStorageSet(key = null, value = null){

        if(this._checkAvailableCookies()){
            Cookies.set(key, JSON.stringify(value), {expires: 360, path: "/"});
        } else {
            this._localSet(key, value);
        }
    }

    /**
     * Get cookie data
     * @param key
     * @returns {*}
     * @private
     */
    _cookiesStorageGet(key = null){

        if(this._checkAvailableCookies()){
            try{
                return JSON.parse(Cookies.get(key));
            } catch (e){
                return undefined;
            }
        } else {
            return this._localGet(key);
        }
    }

    /**
     * LOCAL STORAGE
     */

    /**
     * Try to get if is supported local storage in browser
     * @private
     */
    _isLocalStorageSupported () {
        if ( this._isLocalStorageAvailable !== null ) {
            return this._isLocalStorageAvailable;
        }

        var testKey = 'test', storage = window.localStorage;

        try {
            storage.setItem(testKey, '1');
            storage.removeItem(testKey);
            this._isLocalStorageAvailable = true;
        }
        catch (error) {
            this._isLocalStorageAvailable = false;
        }

        return this._isLocalStorageAvailable;
    };

    /**
     * Set to localStorage
     * @param key
     * @param value
     * @private
     */
    _localStorageSet(key = null, value = null){
        if(this._isLocalStorageSupported()){
            window.localStorage.setItem(key, JSON.stringify(value));
        } else {
            this._localSet(key, value);
        }
    }

    /**
     * Get from localStorage
     * @param key
     * @returns {null}
     * @private
     */
    _localStorageGet(key = null){
        if(this._isLocalStorageSupported()){
            if(!window.localStorage.hasOwnProperty(key)){
                return null;
            }

            return JSON.parse(window.localStorage.getItem(key));
        } else {
            return this._localGet(key);
        }
    }

    /**
     * SESSION STORAGE
     */

    /**
     * Try to get if is supported session storage in browser
     * @private
     */
    _isSessionStorageSupported () {
        if ( this._isSessionStorageAvailable !== null ) {
            return this._isSessionStorageAvailable;
        }

        var testKey = 'test', storage = window.sessionStorage;

        try {
            storage.setItem(testKey, '1');
            storage.removeItem(testKey);
            this._isSessionStorageAvailable = true;
        }
        catch (error) {
            this._isSessionStorageAvailable = false;
        }

        return this._isSessionStorageAvailable;
    };

    /**
     * Set to sessionStorage
     * @param key
     * @param value
     * @private
     */
    _sessionStorageSet(key = null, value = null){
        if(this._isSessionStorageSupported()){
            window.sessionStorage.setItem(key, JSON.stringify(value));
        } else {
            this._localSet(key, value);
        }
    }

    /**
     * Get from sessionStorage
     * @param key
     * @returns {null}
     * @private
     */
    _sessionStorageGet(key = null){
        if(this._isSessionStorageSupported()){
            if(!window.sessionStorage.hasOwnProperty(key)){
                return null;
            }

            return JSON.parse(window.sessionStorage.getItem(key));
        } else {
            return this._localGet(key);
        }
    }
}