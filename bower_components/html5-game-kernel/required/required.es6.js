/**
 * Required files for application
 * @constructor
 */
export default class Required {

    static get _ALIAS () {      return "a";}
    static get _PATH () {       return "u";}
    static get _SIZE_FILE () {  return "s";}
    static get _SIZE_IMAGE () { return "x";}
    static get _TYPE () {       return "f";}
    static get _TIME () {       return "t";}
    static get _PARTITION () {  return "p";}
    static get _ALTERNATIVE () {return "l";}


    constructor(data = {}){

        /**
         * File queue
         * @type {{}}
         */
        this.queue = {};

        this._scriptsQueue = {};

        /**
         * Image Buffer
         * @type {{}}
         */
        this.imageBuffer = {};

        this.imageBufferCreated = {};

        this.imageBufferPath = {};
        this.imageRawData = {}; //raw image after new Image().load
        this.imageRawAlternative = {};

        this.imageHashCounter = {};

        /**
         * Audio Buffer
         * @type {{}}
         */
        this.audioBuffer = {};

        this.audioBufferSize = {};

        this.audioArrayBuffer = {};

        this._audioBufferUrls = {};

        this._audioBufferTime = {};

        this.sizeBuffer = {};

        this.countSetImage = 0;

        this._oldQueueName = null;

        this.listQueueFinished = [];

        this._audioLists = null;

        this._audioChecked = false;

        this._audioSpriteConfig = {};
    }

    /**
     * Set queue of files to queue loader
     * @param data
     */
    setQueue (data) {
        this.queue["im"] = data;

        setTimeout(function(){
            //$_signal.goTo("preloader.startLoading")
            $_required.startLoadingEvent();
        }, 1);
    };

    /**
     * Set audio
     * @param list
     */
    setAudio (list) {
        this.queue["au"] = list;

        this.checkAudioFormat($_services.getService("SoundService").checkSupport());
    };

    /**
     * Set sprite audio config
     * @param config
     */
    setSpriteAudioConfig(config){
        $_services.getService("SoundService").setSoundConfig(config);
    }

    /**
     * Set script list
     * @param list
     */
    setScripts(list = null){
        this.queue["sc"] = list;
        //this._scriptsQueue = list;

        //this.setScriptsToQueueController();
    }

    /**
     * Check audio format
     * @param typeName
     */
    checkAudioFormat (typeName) {
        this._audioChecked = typeName;

        //this.setAudioToQueueController();
    };

    /**
     * Set to buffer audio URLS
     */
    setToBufferAudioUrls (list) {

        var _keys = Object.keys(list);

        for(var _i= 0, _l=_keys.length; _i<_l; _i++){

            if(typeof this._audioBufferUrls[_keys[_i]] == 'undefined'){
                this._audioBufferUrls[_keys[_i]] = list[_keys[_i]][Required._PATH];
            }
        }
    };

    /**
     * Get Audio Url
     * @param name
     */
    getBufferAudioUrl (name) {

        if(typeof this._audioBufferUrls[name] != 'undefined'){
            return $_settingService.getSetting("game_path") + this._audioBufferUrls[name].substr(3);
        }

        return null;
    };

    /**
     * Set to buffer mp3 length of files
     * @param list
     */
    setToBufferAudioTimeLength (list) {

        var _keys = Object.keys(list);

        for(var _i= 0, _l=_keys.length; _i<_l; _i++){

            if(typeof this._audioBufferTime[_keys[_i]] == 'undefined' && list[_keys[_i]][Required._TIME] > 0){
                this._audioBufferTime[_keys[_i]] = list[_keys[_i]][Required._TIME];
            }
        }
    };

    /**
     * Set checked audio format to controller queue
     */
    setAudioToQueueController () {

        if(this._audioLists !== null && this._audioChecked !== null && this._audioChecked.length > 0 && Object.keys(this._audioLists).length > 0)
        {
            for(let _queueName in this._audioLists){
                this.setToBufferAudioTimeLength(this._audioLists[_queueName]["mp3"]);
                this.setToBufferAudioUrls(this._audioLists[_queueName][this._audioChecked]);
            }
        }
    };

    /**
     * Set checked audio format to controller queue
     */
    setScriptsToQueueController ()
    {
        for(let _queueName in $_required._scriptsQueue){

            for(let key in $_required._scriptsQueue[_queueName]){

                let $_data = $_required._scriptsQueue[_queueName][key];

                if(typeof $_data[Required._PATH] == 'undefined' && Object.keys($_data).indexOf($_t.getLanguage()) != -1){

                    $_required_controller.unShiftToQueue(_queueName, $_data[$_t.getLanguage()]);
                } else {
                    $_required_controller.unShiftToQueue(_queueName, $_data);
                }
            }

        }

    };

    /**
     * Get from queue all elements
     * @returns {{}}
     */
    getQueue () {
        return this.queue;
    };

    /**
     * Get Event fo start loading
     */
    startLoadingEvent () {
        /**
         * Sent queue to Controller Required(s)
         */
        $_required_controller.run(this.getQueue());
    };

    /**
     * Send Loaded to Event
     * @param queueName
     */
    sendLoaded (queueName) {

        if(this.listQueueFinished.indexOf(queueName) == -1 && queueName !== null){
            $_event.setEvent(queueName + 'FinishedLoading');
            this.listQueueFinished.push(queueName);
        }
    };

    /**
     * If queue is checkout of new queue, this send event to EventListener
     * @param queueName
     */
    checkoutOfQueue (queueName) {

        if(queueName == 'undefined' || typeof queueName == 'undefined'){
            return false;
        }

        if(queueName !== this._oldQueueName){

            if(null !== this._oldQueueName && this._oldQueueName != 'undefined'){
                this.sendLoaded(this._oldQueueName);
            }

            this._oldQueueName = queueName;
        }
    };

    /**
     * Set alternative alias for Sprite animation
     * @param alias
     * @param alternativeAlias
     */
    setAlternativeImages(alias, alternativeAlias){
        this.imageRawAlternative[alias] = alternativeAlias;
    }

    /**
     * Get alternative alias for Sprite animation
     * @param name
     * @param alias
     * @returns {*}
     */
    getAlternativeImageRaw(name, alias){
        var _aliasName = `${alias}_${name}`;

        if(Object.keys(this.imageRawAlternative).indexOf(_aliasName) == -1){
            return null;
        }

        let raw = this.getImageRawData(this.imageRawAlternative[_aliasName], alias);

        delete this.imageRawAlternative[_aliasName];

        return raw;
    }

    /**
     * Set BLOB data buffer for images
     * @param name
     * @param data
     * @param size
     * @param queueName
     * @param path
     */
    setImageBuffer (name, data, size, queueName, path) {

        if(Object.keys(this.imageBuffer).indexOf(name) == -1){
            this.imageBuffer[name] = data;
            this.imageBufferPath[name] = path;
        }

        if(Object.keys(this.sizeBuffer).indexOf(name) == -1){
            this.sizeBuffer[name] = size;
        }

        //this.checkoutOfQueue(queueName);
    };

    /**
     * Get BLOB data from buffer
     * @param name
     * @returns {*}
     */
    getimageBuffer (name) {

        if(Object.keys(this.imageBuffer).indexOf(name) == -1){
            return null;
        }

        return this.imageBuffer[name];
    };

    /**
     * Set Raw Image from downloading
     * @param name
     * @param data
     */
    setImageRawData  (name, data) {

        if(Object.keys(this.imageRawData).indexOf(name) == -1){
            this.imageRawData[name] = data;
        }
    };

    /**
     * Get Image by raw from new Image()
     * @param name
     * @param alias
     * @returns {*}
     */
    getImageRawData (name, alias) {

        var _aliasName = `${alias}_${name}`;

        var result = null;

        if(Object.keys(this.imageRawData).indexOf(_aliasName) != -1){
            result = this.imageRawData[_aliasName];
        }

        if(result === null){
            result = this.getAlternativeImageRaw(name, alias);
        }

        //delete this.imageRawData[_aliasName];

        return result;
    };

    /**
     * Is loaded Raw image
     * @param name
     * @param alias
     * @returns {boolean}
     */
    isLoadedRawImage(name, alias){
        var _aliasName = `${alias}_${name}`;
        return Object.keys(this.imageRawData).indexOf(_aliasName) != -1;
    }

    /**
     * Set Image or Canvas raw data for cache
     * @param name
     * @param alias
     * @param canvas
     * @returns {*}
     */
    setImageCacheRawData (name, alias, canvas){

        if(!(canvas instanceof HTMLCanvasElement) && !(canvas instanceof HTMLImageElement) ){
            $_log.error(`Set image to buffer can not be! Format data must be -> HTMLCanvasElement or HTMLImageElement! Current -> `, canvas);
            return null;
        }

        var _aliasName = `${alias}_${name}`;

        this.imageRawData[_aliasName] = canvas;
    }



    /**
     * Get image path
     * @param name
     */
    getImagePath (name) {

        if(Object.keys(this.imageBufferPath).indexOf(name) == -1){
            return null;
        }

        return this.imageBufferPath[name];
    };

    /**
     * Get Image from buffer
     * @param name
     * @returns {*}
     */
    getBufferImage (name) {

        if(Object.keys(this.imageBuffer).indexOf(name) == -1){
            return null;
        }

        if(typeof this.imageBufferCreated[name] != 'undefined'){
            return this.imageBufferCreated[name];
        }

        try{
            this.imageBufferCreated[name] = window.URL.createObjectURL(this.imageBuffer[name]);

            return this.imageBufferCreated[name];
        } catch(e){
            $_log.error(e);
        }
    };

    /**
     * Get size image
     * @param name
     * @returns {*}
     */
    getImageSize (name) {

        if(Object.keys(this.sizeBuffer).indexOf(name) == -1){
            return {width: 0, height: 0};
        }

        return this.sizeBuffer[name];
    };

    /**
     * Get count of image
     * @returns {number}
     */
    getCountImage () {
        return this.countSetImage++;
    };



    /**
     * Set ARRAYBUFFER data buffer for audio
     * @param name
     * @param data
     * @param size
     * @param queueName
     * @param arrayBuffer
     */
    setAudioBuffer (name, data, size, queueName, arrayBuffer) {

        if(Object.keys(this.audioBuffer).indexOf(name) == -1){
            this.audioBuffer[name] = data;
        }

        if(Object.keys(this.audioBufferSize).indexOf(name) == -1){
            this.audioBufferSize[name] = size;
        }

        if(Object.keys(this.audioArrayBuffer).indexOf(name) == -1){
            this.audioArrayBuffer[name] = arrayBuffer;
        }

        this.checkoutOfQueue(queueName);

        $_services.getService("SoundService").subscribeSound(name, data);
    };

    /**
     * Get audio from audio collection buffer
     * @param name
     * @returns {*}
     */
    getBufferAudio (name) {

        if(Object.keys(this._audioBufferUrls).indexOf(name) == -1){
            $_log.error('Audio with alias "' + name + '" not found!');
        }

        var _result = {
            path    :  this.getBufferAudioUrl(name),
            time    :  this._audioBufferTime[name],
            buffer  :  null
        };

        if(Object.keys(this.audioBuffer).indexOf(name) == -1){
            return _result;
        }

        try{
            _result.path = $_settingService.getSetting("game_path") + this.audioBuffer[name];
            _result.buffer = this.audioArrayBuffer[name];

            return _result;
        } catch(e){
            $_log.error(e);
        }
    };

    /*
     * @param audioTag
     * @returns boolean
     */
    isAudioTagInConfig  (audioTag) {
        return (Object.keys(this._audioBufferUrls).indexOf(audioTag) > -1);
    };

}


//iframe.contentWindow