/**
 * Component instance name cache
 * @constructor
 */
export default class ComponentInstanceCache {

    constructor(){
        this._instanceNameSpaces = {};
    }

    /**
     * Set all instances with namespaces
     * @param list
     */
    setAll (list = {}){
        this._instanceNameSpaces = list;
    }

    /**
     * Get curremt partial
     * @returns {*}
     * @private
     */
    _getCurrentPartial(){
        return __RunPartialApplication.type;
    }

    /**
     * Get and Find instance namespace in global scope
     * @param nameClass
     * @param alias
     * @param partial
     * @returns {*}
     */
    get (nameClass = null, alias = null, partial = "common") {

        var _key = `${nameClass}_${alias}_${partial}`;

        if(this._instanceNameSpaces[_key] != undefined){
            return this._instanceNameSpaces[_key];
        }

        _key = `${nameClass}_${alias}_common`;

        if(this._instanceNameSpaces[_key] != undefined){
            return this._instanceNameSpaces[_key];
        }

        return null;
    }

    /**
     * Get instance
     * @param nameClass
     * @param alias
     * @param partial
     * @returns {*}
     */
    getInstance(nameClass = null, alias = null, partial = this._getCurrentPartial()){
        let name = this.get(nameClass, alias, partial);
        if(typeof window[name] == "object"){
            return window[name];
        }

        return null;
    }

    /**
     * Get component instances
     * @param alias
     * @param instanceOf
     * @param partial
     * @returns {{}}
     */
    getComponentInstances(alias = null, instanceOf = null, partial = this._getCurrentPartial()){

        let exists = [], existElCount = {};
        let keys = Object.keys(this._instanceNameSpaces);

        for(let i = 0, l = keys.length; i < l; i++){

            if(keys[i].indexOf(`_${alias}_`) >= 0){

                let [className, _alias, _part] = keys[i].split("_");

                if(["common", partial].indexOf(_part) >= 0){
                    exists.push(keys[i]);
                }
            }
        }

        if(exists.length == 0){
            return {};
        }

        let instances = {};

        for(let j = 0, jl = exists.length; j < jl; j++){
            let el = this._instanceNameSpaces[ exists[j] ];
            if(typeof window[el] == "object"){

                if(instanceOf !== null && !(window[el] instanceof instanceOf)){
                    continue;
                }

                instances[el] = window[el];
            }
        }

        return instances;
    }
}