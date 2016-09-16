import ServiceInterface from "./serviceInterface.es6.js";
import MemoryService from "./memoryService.es6";

/**
 * Popup Service
 */
export default class PopupService extends ServiceInterface {

    static get EMPTY_POPUP () {  return 0;   }
    static get GAME_POPUP () {   return 2;   }
    static get CUSTOM_POPUP () { return 1;   }
    static get INFO_POPUP () {   return 3;   }
    static get ERROR_POPUP () {  return 4;   }

    constructor(data = {}) {
        super(data);

        this.queuePopups = [];
        this.resolvePromise = null;

        this._actives = true;

        this._timers = {};
    }

    /**
     * Find object by name
     * @param name
     * @param type
     * @returns {*}
     * @private
     */
    _findByName(name = null, type = 0){

        for(let i = 0, l = this.queuePopups.length; i< l; i++){
            if(this.queuePopups[i].name == name && this.queuePopups[i].type == type){
                return this.queuePopups[i];
            }
        }

        return null;
    }

    /**
     * Find current active popup
     * @returns {*}
     * @private
     */
    _findActive(){

        for(let i = 0, l = this.queuePopups.length; i< l; i++){
            if(this.queuePopups[i].active === true){
                return this.queuePopups[i];
            }
        }

        return null;
    }

    /**
     * Find actives
     * @returns {Array}
     * @private
     */
    _findActives(){

        let actives = [];

        for(let i = 0, l = this.queuePopups.length; i< l; i++){
            if(this.queuePopups[i].active === true){
                actives.push(this.queuePopups[i]);
            }
        }

        return actives;
    }

    /**
     * Clear group actives
     * @param type
     * @private
     */
    _clearGroupActive(type = 0){

        for(let i = 0, l = this.queuePopups.length; i< l; i++){
            if(this.queuePopups[i].type == type && this.queuePopups[i].active !== true){
                this.queuePopups[i].active = null;
            }
        }
    }

    /**
     * Find key by object
     * @param object
     * @returns {number}
     * @private
     */
    _findKey(object = null){
        return this.queuePopups.indexOf(object);
    }

    /**
     * Check show next popup if added
     * @param name
     * @param type
     * @private
     */
    _checkShowPromise(name = null, type = 0){

        if(!(this.resolvePromise instanceof Promise)){
            this.resolvePromise = Promise.resolve();
        }

        this.resolvePromise = this.resolvePromise.then(()=>{
            return new Promise( res => {
                this._checkShow(name, type, res);
            });
        });

        this.resolvePromise = this.resolvePromise.then(()=>{
            //$_state.goTo("!popup.popups.updateBlur");
            return Promise.resolve();
        });
    }


    /**
     * Check show current popup
     * @param name
     * @param type
     * @param resolve
     * @private
     */
    _checkShow(name = null, type = 0, resolve){

        let current = this._findActive();

        let queue = this.queuePopups
            .map(_queue => _queue)
            .sort((a, b)=>{

                if(a.type > b.type) return -1;
                if(a.type < b.type) return 1;

                return 0;
            });

        let available = null;

        for(let i = 0, l = queue.length; i < l; i++){

            if(!current && queue[i].active !== true && queue[i].deleted === false){
                available = queue[i];
                break;
            }

            if(current && (queue[i].name !== current.name || queue[i].type || current.type) && queue[i].active !== true && queue[i].deleted === false){
                available = queue[i];
                break;
            }

        }

        if(!available || (available && current && current.type > available.type)){
            setTimeout( ()=> {
                resolve();
            }, 25);
            return;
        }

        this._hide(current, true)
            .then(()=>{
                this._show(available)
                    .then(resolve);
            });
    }

    /**
     * Check for hide popup
     * @param name
     * @param type
     * @returns {Promise}
     * @private
     */
    _checkHide(name = null, type = 0){

        let current = this._findByName(name, type);

        return new Promise((resolve, reject)=>{

            if(current == null){
                return resolve(null);
            }

            if(current.active !== true){
                return resolve(current);
            }

            //return resolve(current);

            let update = true;

            this._hide(current, update)
                .then(()=>{
                    resolve(current);
                })
                .catch((e)=>{
                    reject(e);
                });
        });
    }

    /**
     * Find show next popup with promise
     * @param current
     * @param resolved
     * @private
     */
    _findShowNextPromise(current = null, resolved){

        if(!(this.resolvePromise instanceof Promise)){
            this.resolvePromise = Promise.resolve();
        }

        this.resolvePromise = this.resolvePromise.then(()=>{
            return new Promise( res => {
                this._findShowNext(current, resolved, res);
            });
        });

        this.resolvePromise = this.resolvePromise.then(()=>{
            $_signal.goTo("!popup.popups.updateBlur");
            return Promise.resolve();
        });
    }

    /**
     * Find show next popup
     * @param current
     * @param resolved
     * @param resolveMain
     * @returns {*}
     * @private
     */
    _findShowNext(current = null, resolved, resolveMain){
        if(!current){
            resolved();
            return resolveMain();
        }

        let currentType = current.type;

        let queue = this.queuePopups
            .map(_queue => _queue)
            .sort((a, b)=>{

                if(a.type > b.type) return -1;
                if(a.type < b.type) return 1;

                return 0;
            });

        let available = null;

        for(let i = 0, l = queue.length; i < l; i++){

            if(queue[i].active !== true && (queue[i].name != current.name || queue[i].type != current.type) && queue[i].deleted === false){
                available = queue[i];
                break;
            }
        }

        if(available !== null && current.type > available.type && current.active === true){
            resolved();
            return resolveMain();
        }

        if(available === null && current !== null){
            $_signal.goTo("!popup.popups.hide", current.type, current, true, ()=>{
                resolved();
                resolveMain();
            });

            return null;
        }

        let update = true;

        this._hide(current, update)
            .then((context)=>{

                if(context === null){
                    //resolved();
                    //resolveMain();
                    //return ;
                }

                if(current !== null && current.type > available.type){
                    //return null;
                }

                /**
                 * If hidden popup exist of current group
                 */
                if(current !== null && current.type == available.type){
                    this._clearGroupActive(available.type);
                }

                if(available.deleted === true){

                    resolved();
                    return resolveMain();
                }

                this._show(available, update)
                    .then(()=>{
                        resolved();
                        resolveMain();
                    });
            });
    }

    /**
     * Show popup
     * @param object
     * @param showBG
     * @private
     */
    _show(object = {}, showBG = true){

        return new Promise(resolve => {

            if(object == null || object.active === true){
                return resolve();
            }

            if(object.active === null){

                for(let key in object.configs){

                    let method = `__${key}Exec`;

                    if(typeof this[method] == "function"){
                        this[method](object.configs[key], object.properties);
                    }
                }

            }

            object.active = true;

            //console.error('start show', object.name, object.type, object.active, object.deleted);

            $_signal.goTo("!popup.popups.show", object.type, object, showBG, ()=>{
                //console.error('end show', object.name, object.type);
                resolve();
                $_event.setEvent("clearBlockAction");
            });

        });
    }

    /**
     * Hide popup
     * @param object
     * @param hideBG
     * @returns {Promise}
     * @private
     */
    _hide(object = {}, hideBG = true){

        return new Promise(resolve => {

            if(object == null){
                return resolve();
            }

            if(object.active === true){

                //console.error('hide', object.name, object.type, object.active, object.deleted);

                $_signal.goTo("!popup.popups.hide", object.type, object, hideBG, ()=>{
                    object.active = false;
                    resolve();
                });
            } else {
                resolve(null);
            }

        })
    }

    /**
     * Delete popup
     * @param object
     * @private
     */
    _remove(object = {}){
        if(object == null){
            return ;
        }

        //this._hide(object);

        let current = this._findKey(object);

        if(current > -1){
            this.queuePopups.splice(current, 1);
        }
    }

    /**
     * Get current name of active popup
     * @param type
     * @returns {*}
     */
    getActiveName(type = null){

        if(type === null){
            return null;
        }

        for(let i = 0, l = this.queuePopups.length; i < l; i++){
            if(this.queuePopups[i].type == type && this.queuePopups[i].active === true && this.queuePopups[i].deleted !== true){
                return this.queuePopups[i].name;
            }
        }

        return null;
    }

    /**
     * ADD
     */

    /**
     * Add empty popup
     * @param name
     * @param configs
     */
    addEmptyPopup(name = null, configs = {}){

        let data = this._findByName(name, PopupService.EMPTY_POPUP);

        if(data === null){

            this.queuePopups.push({
                name        : name,
                type        : PopupService.EMPTY_POPUP,
                configs     : configs,
                properties  : {},
                active      : null,
                wait        : false,
                deleted     : false,
                resolve     : () => {}
            });
        }

        if(!data || data.active !== true){
            this._clearGroupActive(PopupService.EMPTY_POPUP);
            this._checkShowPromise(name, PopupService.EMPTY_POPUP);
        }
    }

    /**
     * Add game popup
     * @param name
     * @param configs
     * @param properties
     */
    addGamePopup(name = null, configs = {}, ...properties){

        let data = this._findByName(name, PopupService.GAME_POPUP);

        if(data === null){

            let element = {
                name        : name,
                type        : PopupService.GAME_POPUP,
                configs     : configs,
                properties  : properties,
                active      : null,
                wait        : false,
                deleted     : false,
                resolve     : () => {}
            };

            if(properties[1] && properties[1].resolve && typeof properties[1].resolve == "function"){
                element.resolve = properties[1].resolve
            }

            this.queuePopups.push(element);
        }

        if(!data || data.active !== true){
            this._clearGroupActive(PopupService.GAME_POPUP);
            this._checkShowPromise(name, PopupService.GAME_POPUP);
        }
    }

    /**
     * Add custom game popup
     * @param name
     * @param configs
     * @param properties
     */
    addCustomPopup(name = null, configs = {}, ...properties){

        let data = this._findByName(name, PopupService.CUSTOM_POPUP);

        if(data === null){

            let element = {
                name        : name,
                type        : PopupService.CUSTOM_POPUP,
                configs     : configs,
                properties  : properties,
                active      : null,
                wait        : false,
                deleted     : false,
                resolve     : () => {}
            };

            if(properties[1] && properties[1].resolve && typeof properties[1].resolve == "function"){
                element.resolve = properties[1].resolve
            }

            this.queuePopups.push(element);
        }

        if(!data || data.active !== true){
            this._clearGroupActive(PopupService.CUSTOM_POPUP);
            this._checkShowPromise(name, PopupService.CUSTOM_POPUP);
        }
    }

    /**
     * Add info popup
     * @param name
     * @param properties
     */
    addInfoPopup(name = null, ...properties){

        let data = this._findByName(name, PopupService.INFO_POPUP);

        if(data === null){

            let element = {
                name        : name,
                type        : PopupService.INFO_POPUP,
                configs     : {
                    states: [
                        ["popup.popups.systemInfo"]
                    ]
                },
                properties  : properties,
                active      : null,
                wait        : false,
                deleted     : false,
                resolve     : () => {}
            };

            if(properties[1] && properties[1].resolve && typeof properties[1].resolve == "function"){
                element.resolve = properties[1].resolve
            }

            this.queuePopups.push(element);
        }

        if(!data || data.active !== true){
            this._clearGroupActive(PopupService.INFO_POPUP);
            this._checkShowPromise(name, PopupService.INFO_POPUP);
        }
    }

    /**
     * Add error popup
     * @param name
     * @param properties
     */
    addErrorPopup(name = null, ...properties){

        let data = this._findByName(name, PopupService.ERROR_POPUP);

        if(data === null){

            let element = {
                name        : name,
                type        : PopupService.ERROR_POPUP,
                configs     : {
                    states: [
                        ["popup.popups.systemError"]
                    ]
                },
                properties  : properties,
                active      : null,
                wait        : false,
                deleted     : false,
                resolve     : () => {}
            };

            if(properties[1] && properties[1].resolve && typeof properties[1].resolve == "function"){
                element.resolve = properties[1].resolve
            }

            this.queuePopups.push(element);
        }

        if(!data || data.active !== true){
            this._clearGroupActive(PopupService.ERROR_POPUP);
            this._checkShowPromise(name, PopupService.ERROR_POPUP);
        }
    }

    /**
     * WAIT
     */

    /**
     * Add wait for game popup
     * @param name
     * @param countRemoves
     */
    addWaitGamePopup(name, countRemoves = 1){
        let context = this._findByName(name, PopupService.GAME_POPUP);

        if(context){
            context.wait = countRemoves;
        }
    }

    /**
     * Remove wait from game popup
     * @param name
     */
    removeWaitGamePopup(name){
        let context = this._findByName(name, PopupService.GAME_POPUP);

        if(context){

            if(context.wait > 0){
                context.wait--;
            } else {
                context.wait = false;
            }
        }
    }

    /**
     * Has wait blocker for game popup
     * @param name
     * @returns {*|boolean}
     */
    hasWaitGamePopup(name){
        let context = this._findByName(name, PopupService.GAME_POPUP);
        return context && context.wait !== false;
    }


    /**
     * Has active popup
     * @returns {boolean}
     */
    hasActivePopup(){
        return this._findActive() !== null;
    }

    /**
     * Has error popup
     * @returns {boolean}
     */
    hasCritError(){

        let empty = () => {};

        for(let i = 0, l = this.queuePopups.length; i< l; i++){
            if(this.queuePopups[i].active === true && this.queuePopups[i].type == PopupService.ERROR_POPUP){
                $_signal.goTo("!popup.popups.show", 4, this.queuePopups[i], true, empty);
                return true;
            }
        }

        return false;
    }

    /**
     * Get length of popups
     * @returns {Number}
     */
    getLength(){

        return this.queuePopups.length;
    }

    /**
     * REMOVE
     */

    /**
     * Remove empty popup
     * @param name
     */
    removeEmptyPopup(name = null){

        if(null === name){
            return;
        }

        let current = this._findActive();

        let find = this._findByName(name, PopupService.EMPTY_POPUP);

        if(!find){
            return ;
        }

        if(find.deleted === true){
            return ;
        }

        find.deleted = true;

        this._checkHide(name, PopupService.EMPTY_POPUP)
            .then((context) => {

                if(context){
                    context.deleted = true;

                    new Promise(res => {
                        this._findShowNextPromise(current, res);
                    }).then(()=>{
                        if(typeof context.resolve == "function"){
                            context.resolve();
                        }

                        this._remove(context);
                    }).catch(e => {
                        $_log.error(e);
                    });
                }
            });
    }

    /**
     * Remove game popup
     * @param name
     */
    removeGamePopup(name = null){
        //console.error("remove game" + name);
        if(null === name){
            return;
        }

        let find = this._findByName(name, PopupService.GAME_POPUP);

        if(!find){
            return ;
        }

        if(find.wait == true){
            return ;
        }

        if(find.deleted === true){
            return ;
        }

        find.deleted = true;

        let current = this._findActive();

        this._checkHide(name, PopupService.GAME_POPUP)
            .then((context)=>{
                if(context){
                    context.deleted = true;
                    new Promise(res => {
                        this._findShowNextPromise(current, res);
                    }).then(()=>{
                        if(typeof context.resolve == "function"){
                            context.resolve();
                        }

                        this._remove(context);
                    }).catch(e => {
                        $_log.error(e);
                    });
                }
            });
    }

    /**
     * Remove custom game popup
     * @param name
     */
    removeCustomPopup(name = null){

        if(null === name){
            return;
        }

        let find = this._findByName(name, PopupService.CUSTOM_POPUP);

        if(!find){
            return ;
        }

        if(find.deleted === true){
            return ;
        }

        find.deleted = true;

        let current = this._findActive();

        this._checkHide(name, PopupService.CUSTOM_POPUP)
            .then((context)=>{

                if(context){
                    context.deleted = true;

                    new Promise(res => {
                        this._findShowNextPromise(current, res);
                    }).then(()=>{
                        if(typeof context.resolve == "function"){
                            context.resolve();
                        }

                        this._remove(context);
                    }).catch(e => {
                        $_log.error(e);
                    });
                }
            });
    }

    /**
     * Remove all game popups
     * @param without
     */
    removeAllGamePopups(without = null){

        for(let i = 0, l = this.queuePopups.length; i < l; i++){
            let object = this.queuePopups[i];

            if([PopupService.EMPTY_POPUP, PopupService.GAME_POPUP, PopupService.CUSTOM_POPUP].indexOf(object.type) == -1){
                continue;
            }

            if(without != null && object.name == without){
                continue;
            }

            object.deleted = true;

            this._hide(object).then(()=>{
                object.deleted = true;
                this._remove(object);
            });
        }
    }

    /**
     * Remove info popup
     * @param name
     * @param callback
     */
    removeInfoPopup(name = null, callback = () => {}){

        if(null === name){
            return;
        }

        let find = this._findByName(name, PopupService.INFO_POPUP);

        if(!find){
            if(typeof callback == "function"){
                callback();
            }

            return ;
        }

        if(find.deleted === true){
            return ;
        }

        find.deleted = true;

        this._checkHide(name, PopupService.INFO_POPUP)
            .then((context)=>{

                if(context){
                    context.deleted = true;

                    new Promise(res => {
                        this._findShowNextPromise(context, res);
                    }).then(()=>{
                        if(typeof context.resolve == "function"){
                            context.resolve();
                        }

                        this._remove(context);

                        if(typeof callback == "function"){
                            callback();
                        }
                    }).catch(e => {
                        $_log.error(e);
                    });
                }
            });
    }

    /**
     * Remove error popup
     * @param name
     */
    removeErrorPopup(name = null){

        if(null === name){
            return;
        }

        let find = this._findByName(name, PopupService.ERROR_POPUP);

        if(!find){
            return ;
        }

        if(find.deleted === true){
            return ;
        }

        find.deleted = true;

        let current = this._findActive();

        this._checkHide(name, PopupService.ERROR_POPUP)
            .then((context)=>{

                if(context){
                    context.deleted = true;

                    new Promise(res => {
                        this._findShowNextPromise(current, res);
                    }).then(()=>{
                        if(typeof context.resolve == "function"){
                            context.resolve();
                        }

                        this._remove(context);
                    }).catch(e => {
                        $_log.error(e);
                    });
                }
            });
    }

    /**
     * EXECUTE
     */

    /**
     * States execute
     * @param states
     * @param args
     * @private
     */
    __statesExec(states = [], args = []){
        for(let i = 0, l = states.length; i < l; i++){

            let props = args;
            if(states[i][1]){
                props.unshift(states[i][1]);
            }

            $_signal.goTo.apply($_signal, [`!${states[i][0]}`,...props]);
        }
    }

    /**
     * Execute events
     * @param events
     * @param args
     * @private
     */
    __eventsExec(events = [], args = []){
        for(let i = 0, l = events.length; i < l; i++){
            $_event.setEvent.apply($_event, [events,...args]);
        }
    }

    /**
     * Show popup next
     */
    show(){
        this._actives = true;

        this._findShowNext();
    }

    /**
     * Hide current popup
     */
    hide(){
        if(this._findActive()){
            this._hide(this._findActive());
        }

        this._actives = false;
    }
}