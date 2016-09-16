
/**
 * List of translations of components
 * @type {{}}
 * @private
 */
var _translations = {};

/**
 * Translations class for application
 * @constructor
 */
export default class Translations {

    constructor(data = {}){
        this.language = null;
        this._defLang = "en";
        this.availableLanguages = [];
        this.langSize = {};
    }

    /**
     * Init data to class
     * @param data
     */
    init (data) {
        for(let key in data){
            this[key] = data[key];
        }

        this.language = typeof $_args.lang == 'undefined' ? 'en': $_args.lang;
    };

    /**
     * Set available languages
     * @param list
     * @param size
     */
    setAvailableLanguages (list = [], size = {}){
        this.availableLanguages = list;
        this.langSize = size;
    }

    /**
     * Is available language
     * @param aliasLang
     * @returns {boolean}
     */
    isAvailableLanguage(aliasLang = "en"){
        return this.availableLanguages.indexOf(aliasLang) != -1;
    }

    /**
     * Get size of file translations
     * @param alias
     * @returns {*}
     */
    getSizeLang(alias = "en"){
        return this.langSize[alias];
    }

    /**
     * Set list of translations
     * @param _list
     */
    setTranslations (_list) {
        _translations = _list;
    };

    /**
     * Return current language
     * @returns {null|*}
     */
    getLanguage () {

        if(this.language === null || typeof this.language == 'undefined'){
            let lang = typeof $_args.lang != 'undefined' ? $_args.lang : this._defLang;

            this.language = this.isAvailableLanguage(lang) ? lang : this._defLang;
        }

        return this.language;
    };

    /**
     * Decode char code to string symbol
     * @param num
     * @returns {string}
     */
    decodeCharCodeToString(num = 0){
        return String.fromCharCode(num);
    }

    /**
     * Get translate for component
     * @param aliasTranslate
     * @param args
     * @returns {*}
     */
    get (aliasTranslate = null, ...args) {

        if(Number.isFinite(aliasTranslate)){
            return aliasTranslate;
        }

        if(aliasTranslate === null){
            return "";
        }

        var _alias = "";

        try{
             _alias = aliasTranslate.toLowerCase();
        } catch(e){
            $_log.error(e, aliasTranslate);

            return "";
        }

        this.language = typeof $_args.lang != 'undefined' ? $_args.lang : this._defLang;

        if(typeof _translations[_alias] != 'undefined'){

            let find = getClone(_translations[_alias]);//args
            if(find instanceof Object && find.text !== undefined){
                find.text = find.text.format(args);
            }

            return find;
        } else if(args.length > 0 && aliasTranslate) {


            return aliasTranslate.format(args);
        }

        if(aliasTranslate.indexOf(":char:") === 0){
            return this.decodeCharCodeToString(aliasTranslate.substr(6));
        }

        return aliasTranslate;
    };

    /**
     * Get filter text
     * @param aliasTranslate
     * @param args
     * @returns {*}
     */
    getText (aliasTranslate = null, ...args){

        let result = this.get.apply(this, [aliasTranslate,...args]);

        if(result instanceof Object){
            return result.text;
        }

        return result;
    }
}