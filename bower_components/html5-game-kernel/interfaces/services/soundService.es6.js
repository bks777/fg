import ServiceInterface from "./serviceInterface.es6.js";

export default class SoundService extends ServiceInterface {

    static get SOUND_BACKGROUND () {    return "background";   }
    static get SOUND_MAIN () {          return "main";   }

    constructor(data = {}){
        super(data);

        this.gameSound = null;
        this.gameEffects = null;

        this.memory = this.getService("MemoryService");

        this.checkedSupportFormat = null;

        this.backgroundLoad = false;
        this.backgroundLoadSubscribe = false;
        this._backgroundPlay = {};

        /**
         * Volumes for groups
         * @type {{background: {min: number, max: number}, main: {min: number, max: number}}}
         */
        this.volumesSound = {
            "background": {
                "min": 0.2,
                "max": 0.4
            },
            "main": {
                "min": 1,
                "max": 1
            }
        };

        this.currentGroupVolume = {
            "background": 0.4,
            "main": 1
        };

        this.sounds = [];

        this._twinGroup = {}; this.messageTweenGroup = {};

        visibly.onVisible( ()=> {

            if(this.getGameEffects()){
                this.raiseGroup("main");
            }

            if(this.getGameSound()){
                this.raiseGroup("background");
            }
        });

        visibly.onHidden( ()=> {

            if(this.getGameEffects()){
                this.muteGroup("main");
            }

            if(this.getGameSound()){
                this.muteGroup("background");
            }
        });

        this.maxVolumeElements = {};
    }

    /**
     * Set volume settings
     * @param settings
     */
    setVolumeAudio(settings = {}){
        this.maxVolumeElements = settings;
    }

    /**
     * Set game sound
     * @param enable
     */
    setGameSound(enable = false){
        this.gameSound = enable;
        this.memory.set("sound-gameSound", enable, MemoryService.MEMORY_COOKIES_STORAGE);

        if(enable === true){
            this.raiseGroup(SoundService.SOUND_BACKGROUND);
        } else {
            this.muteGroup(SoundService.SOUND_BACKGROUND);
        }
    }

    /**
     * Get game sound state
     * @returns {boolean|*}
     */
    getGameSound(){

        if(this.gameSound === null){

            let el = this.memory.get("sound-gameSound", MemoryService.MEMORY_COOKIES_STORAGE);
            if(el == null){
                el = true;
                this.setGameSound(el);
            }

            this.gameSound = el;
        }

        return this.gameSound;
    }

    /**
     * Set game effects
     * @param enable
     */
    setGameEffects(enable = false){

        this.gameEffects = enable;
        this.memory.set("sound-gameEffects", enable, MemoryService.MEMORY_COOKIES_STORAGE);

        if(enable === true){
            this.raiseGroup(SoundService.SOUND_MAIN);
        } else {
            this.muteGroup(SoundService.SOUND_MAIN);
        }
    }

    /**
     * Get game effects state
     * @returns {boolean|*}
     */
    getGameEffects(){

        if(this.gameEffects === null){

            let el = this.memory.get("sound-gameEffects", MemoryService.MEMORY_COOKIES_STORAGE);
            if(el == null){
                el = true;
                this.setGameEffects(el);
            }

            this.gameEffects = el;
        }

        return this.gameEffects;
    }

    /**
     * Check by support browser a AudioContext or WebKitAudioContext
     * @private
     */
    checkSupport () {

        if(this.checkedSupportFormat !== null){
            return this.checkedSupportFormat;
        }

        let formats = [
            ["audio/mp3", "", "mp3"],
            ["audio/m4a","", "m4a"],
            ["audio/ogg", "", "ogg"],
            ["audio/ogg", "vorbis", "ogg"],
            ["audio/ac3", "", "ac3"]
        ];

        let answers = ["", "probably", "maybe"];

        try{
            var vid = document.createElement('audio');

            let accessed = {}; let max = 0; let maxFormat = 0;

            for(let i = 0, l = formats.length; i < l; i++){
                let [formatType, codecs, format] = formats[i];

                let answ = vid.canPlayType(`${formatType};codecs=${codecs}`);

                accessed[i] = answers.indexOf(answ);

                if(accessed[i] > max){
                    max = accessed[i];
                    maxFormat = i;
                }
            }

            this.checkedSupportFormat = formats[maxFormat][2];

        } catch(e){
            $_log.error(e);
        }


        return this.checkedSupportFormat;
    };

    /**
     * Set init config by sound
     * @param config
     */
    setSoundConfig(config = {}){
        this.memory.set("audio_configs", config);
    }

    /**
     * Get sound setting
     * @param nameAlias
     * @returns {*}
     */
    getSoundConfig(nameAlias = null){
        let list = this.memory.get("audio_configs");

        if(list[nameAlias] === undefined){
            return null;
        }

        return list[nameAlias];
    }

    /**
     * Subscribe sound to SoundJS
     * @param alias
     * @param path
     */
    subscribeSound(alias, path){
        createjs.Sound.registerSound($_settingService.getSetting("game_path") + path.substr(3), alias);

        if(alias === "au_sp_overload_background"){
            this.backgroundLoaded();
        }
    }

    /**
     *
     */
    backgroundLoaded(){
        this.backgroundLoad = true;
        this.setBackgroundSound();
    }

    /**
     * Is background sound loaded
     * @returns {*}
     */
    isBackgroundLoaded(){
        return this.backgroundLoad;
    }

    /**
     *
     * @returns {null}
     */
    setBackgroundSound(){
        if(this.backgroundLoad !== true){
            return null;
        }

        if(this.backgroundLoadSubscribe !== false){
            $_signal.goTo('!audio.background.change', this.backgroundLoadSubscribe);
        }
    }

    /**
     * Set props for Sound
     * @param config
     * @param configObject
     * @returns {*}
     */
    setProps(config = {}, configObject = {}){

        if(config.loop !== undefined && config.loop === true) {
            config.loop = -1;
        }

        let configOrigin = {
            interrupt   : createjs.Sound.PLAY_FINISHED,
            loop        : null,
            volume      : 1,
            startTime   : (configObject.startTime * 1000),
            duration    : (configObject.duration * 1000)
        };

        return new createjs.PlayPropsConfig().set(Object.assign({}, configOrigin, config));
    }

    /**
     * Remove instance from queue
     * @param instance
     * @private
     */
    removeInstance(instance){

        let key = createjs.indexOf(this.sounds, instance);
        if(key >= 0){
            this.sounds.splice(key, 1);
        }

        var index = createjs.indexOf(createjs.Sound._instances, instance);
        if (index > -1) {
            createjs.Sound._instances.splice(index, 1);
        }
    }

    /**
     * Play sound with Promise
     * @param name
     * @param alias
     * @param config
     */
    playPromise(name, alias, config = {}){

        return new Promise((a,b)=>{
            let elem = this.play(name, alias, config);

            elem.on("complete", ()=>{
                a();
            });

            let aliasName = `${alias}_${name}`;

            if(!alias){
                aliasName = `${name}`;
            }

            let el = this.getSoundConfig(aliasName);

            if(elem.playState === createjs.Sound.PLAY_FAILED){

                setTimeout(a, el.duration);
                return ;
            }

            elem.on("error", ()=> {
                b();
            })
        });
    }

    /**
     * Play sound
     * @param name
     * @param alias
     * @param config
     * @returns {*}
     */
    play(name, alias = null, config = {}){

        let aliasName = `${alias}_${name}`;

        if(alias === null){
            aliasName = `${name}`;
        }

        let el = this.getSoundConfig(aliasName);

        if(el === null) return;

        if(el.group == SoundService.SOUND_BACKGROUND && !this.gameSound){
            config.volume = 0;
        }

        if(el.group == SoundService.SOUND_MAIN && !this.gameEffects){
            config.volume = 0;
        }

        var ppc = this.setProps(config, el);

        let sound = createjs.Sound.play(el.resource, ppc);
        sound._groupName = el.group;
        sound._aliasName = name;

        if(this.volumesSound[el.group] !== undefined && config.volume == null){
            sound.setVolume(this.volumesSound[el.group].max);
        }

        if(this.maxVolumeElements[aliasName] !== undefined){
            sound.setVolume(this.maxVolumeElements[aliasName]);
        }

        if(!this.getGameSound() && el.group == SoundService.SOUND_BACKGROUND){
            sound.setVolume(0);
        }

        if(!this.getGameEffects() && el.group == SoundService.SOUND_MAIN){
            sound.setVolume(0);
        }

        var key = createjs.indexOf(this.sounds, sound);
        if(key < 0){
            this.sounds.push(sound);
        }

        if(config.loop == undefined || config.loop === false){

        }

        sound.on("complete", ()=>{
            this.removeInstance(sound);
        });

        sound.on("interrupted", () => {
            this.removeInstance(sound);
        });


        if(ppc.on){

            if(ppc.loop === false){
                ppc.on("complete", ()=>{
                    this.removeInstance(sound);
                });
            }

            ppc.on("failed", ()=> {
                this.removeInstance(sound);
            });
        }

        return sound;
    }

    /**
     * Stop sound by name
     * @param name
     * @param paused
     */
    stop(name = null, paused = false){

        for(let i = 0, l = this.sounds.length; i < l; i++){

            let el = this.sounds[i];

            if(el && el._aliasName === name){

                el.setPaused(true);

                if(paused === false){
                    el.stop();

                    this.removeInstance(el);
                }
            }
        }

    }

    /**
     * Stop all in group
     * @param groupName
     * @param paused
     */
    stopGroup(groupName = null, paused = false){

        for(let i = 0, l = this.sounds.length; i < l; i++){

            let el = this.sounds[i];

            if(el && el._groupName === groupName){
                el.setPaused(true);

                if(paused === false){
                    if(el._loop != -1){
                        el.loop = -1;
                    }

                    el.stop();

                    setTimeout(()=>{ //@TODO убрать таймер если получится =(
                        this.removeInstance(el);
                    }, 10);

                }
            }
        }
    }

    /**
     * Resume all in group
     * @param groupName
     */
    resumeGroup(groupName = null){

        for(let i = 0, l = this.sounds.length; i < l; i++){

            let el = this.sounds[i];

            if(el && el._groupName === groupName){
                el.setPaused(false);
            }
        }
    }

    /**
     * Mute group sound
     * @param groupName
     */
    muteGroup(groupName = null){

        for(let i = 0, l = this.sounds.length; i < l; i++){

            let el = this.sounds[i];

            if(el && el._groupName === groupName){
                el.setVolume(0);
                el.volume = 0;
                //el.setMute(true);
            }
        }
    }

    /**
     * Raise group sound
     * @param groupName
     */
    raiseGroup(groupName = null){

        for(let i = 0, l = this.sounds.length; i < l; i++){

            let el = this.sounds[i];

            if(el && el._groupName === groupName){
                //el.setMute(false);

                el.setVolume(this.volumesSound[groupName].max);
                el.volume = this.volumesSound[groupName].max;
            }
        }
    }

    /**
     * Fade Sound
     * @param name
     * @param fadeIn
     * @param time
     * @param resolve
     * @param to
     */
    fadeSound(name = null, fadeIn = "in", time = 1000, resolve = null, to = null){

        const _execute = (q) => {

            for(let i = 0, l = this.sounds.length; i < l; i++){

                let el = this.sounds[i];

                if(el && el.__name === name){

                    if(q.currentTarget !== undefined){
                        el.volume = q.currentTarget.target.x
                    }

                }
            }

            this.currentGroupVolume[name] = q.currentTarget.target.x;
        };

        let volumeTo = null;

        try{
            volumeTo = this.volumesSound[name][(fadeIn == "in" ? "max": "min")];
        } catch(e){
            volumeTo = 1;
        }

        if(to === null){
            to = volumeTo;
        }

        this.messageTweenGroup[name] = createjs.Tween.get({x: this.currentGroupVolume[name]},  {loop: false} ).to ({x: to}, time).call(() => {

            this.currentGroupVolume[name] = to;

            let _last = {currentTarget:{target:{x:to}}};

            _execute(_last);

            if(this.messageTweenGroup[name] !== null){

                this.messageTweenGroup[name] = null;
            }
        });

        if(resolve !== null){
            this.messageTweenGroup[name].call(()=>{
                resolve();
            });
        }

        this.messageTweenGroup[name].addEventListener("change", _execute);
    }

    /**
     * Fade Group
     * @param groupName
     * @param fadeIn
     * @param time
     * @param resolve
     * @param to
     */
    fadeGroup(groupName = null, fadeIn = "in", time = 1000, resolve = null, to = null){

        const _execute = (q) => {

            for(let i = 0, l = this.sounds.length; i < l; i++){

                let el = this.sounds[i];

                if(el && el._groupName === groupName){

                    if(q.currentTarget !== undefined){
                        el.volume = q.currentTarget.target.x
                    }
                }
            }

            this.currentGroupVolume[groupName] = q.currentTarget.target.x;
        };

        let volumeTo = this.volumesSound[groupName][(fadeIn == "in" ? "max": "min")];

        if(to === null){
            to = volumeTo;
        }

        this.messageTweenGroup[groupName] = createjs.Tween.get({x: this.currentGroupVolume[groupName]},  {loop: false} ).to ({x: to}, time).call(() => {

            this.currentGroupVolume[groupName] = to;

            let _last = {currentTarget:{target:{x:to}}};

            _execute(_last);

            if(this.messageTweenGroup[groupName] !== null){

                this.messageTweenGroup[groupName] = null;
            }
        });

        if(resolve !== null){
            this.messageTweenGroup[groupName].call(()=>{
                resolve();
            });
        }

        this.messageTweenGroup[groupName].addEventListener("change", _execute);
    }
}
