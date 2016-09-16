/**
 * Controller for Loader required
 * @constructor
 */
export default class ControllerRequired {

    constructor(data = {}){

        /**
         * Type loading components files
         * @type {string[]}
         */
        this.typeQueueName = ["preloader", "main", "overload"];
        this.countQueueFiles = {};
        this.loadedCountQueueFiles = {};

        this.countStreams = 0;

        this._baseQueue = {};

        this._queueName = [];
        this._queueFiles = {};
        this._queueSize = {};

        this._countFiles = 0;

        this._oldQueueName = "preloader";

        /**
         * Process Data
         * @type {Array}
         */
        this.streams = [];
        this._freeStreams = [];
        this._countFreeStreams = 0;

        this._dataStreamLoading = {};

        this.isAllLoaded = false;

        this._lang = typeof $_args.lang == 'undefined' ? 'en': $_args.lang;
        this._defLang = 'en';

        this._accessLoad = ["common"];

        this._filesQueue = [];
        this._loadedQueues = {};

        this.init(data);
    }

    /**
     * Init data for settings
     * @param data
     */
    init (data = {}) {
        for(let key in data){
            this[key] = data[key];
        }
    }

    /**
     * Run queue loading
     * @param queue
     * @returns {boolean}
     */
    run(queue = {}){
        if(Object.keys(queue).length == 0){
            return false;
        }

        this._baseQueue = queue;
        this._queueName = ["preloader", "main", "overload"];

        if(__RunPartialApplication.type){
            this._accessLoad.push(__RunPartialApplication.type);
        }

        for(let typeLoader in this._baseQueue){

            let namePackage = `_${typeLoader}PushPackages`;

            if(this[namePackage] === undefined){
                continue;
            }
            for(let _queueName in this._baseQueue[typeLoader]){

                if(this._queueFiles[_queueName] === undefined){
                    this._queueFiles[_queueName] = [];
                }

                let $_list = this._baseQueue[typeLoader][_queueName];

                /**
                 * For audio need to check loading format
                 */
                if(typeLoader == "au"){
                    $_list = this._baseQueue[typeLoader][_queueName][$_required._audioChecked];
                }

                for(let el in $_list){

                    /**
                     * Run types of loading data explanation
                     */
                    let $_data = this[namePackage]($_list[el]);
                    //continue;

                    /**
                     * If image usage in current game version
                     */
                    if($_data[Required._PARTITION] && this._checkedPartitions($_data[Required._PARTITION]) === false){
                        continue;
                    }

                    /**
                     * If image has alternative image in main queue
                     */
                    if($_data[Required._ALTERNATIVE] !== undefined){
                        $_required.setAlternativeImages($_data[Required._ALIAS], $_data[Required._ALTERNATIVE]);
                    }

                    /**
                     * Set to queue list a filename with path
                     */
                    this._queueFiles[_queueName].push({filename: $_data[Required._ALIAS], path: $_data[Required._PATH], type: $_data[Required._TYPE], size: $_data[Required._SIZE_IMAGE]});

                    if(typeof this._queueSize[_queueName] == 'undefined'){
                        this._queueSize[_queueName] = 0;
                    }

                    this._queueSize[_queueName] += parseInt($_data[Required._SIZE_FILE]);

                    if(this.countQueueFiles[_queueName] === undefined){
                        this.countQueueFiles[_queueName] = 0;
                    }

                    this.countQueueFiles[_queueName]++;
                    this._countFiles++;

                }

            }

        }

        /**
         * Make normal queue
         */
        for(let u = 0, ul = this.typeQueueName.length; u < ul; u++){

            let _ul = this._queueFiles[this.typeQueueName[u]];

            for(let j = 0, lj = _ul.length; j < lj; j++){

                let _file = _ul[j];
                _file.queueName = this.typeQueueName[u];
                this._filesQueue.push(_file);

                if(this._loadedQueues[this.typeQueueName[u]] == undefined){
                    this._loadedQueues[this.typeQueueName[u]] = [];
                }

                this._loadedQueues[this.typeQueueName[u]].push(_file.filename);
            }
        }

        delete this._queueFiles;

        if(this._countFiles > 0){
            this.createStreams();
        }


    }

    /**
     * Find access loading
     * @param current
     * @returns {boolean}
     * @private
     */
    _checkedPartitions(current = []){

        if(this._accessLoadLength === undefined){
            this._accessLoadLength = this._accessLoad.length;
        }

        for(let i = 0, l = this._accessLoadLength; i < l; i++){
            if(current.indexOf(this._accessLoad[i]) != -1){
                return true;
            }
        }

        return false;
    }

    /**
     * Push images
     * @param _file
     * @returns {*}
     * @private
     */
    _imPushPackages(_file){

        if(typeof _file[Required._PATH] == 'undefined' && typeof _file[this._lang] != 'undefined'){
            return _file[this._lang];
        } else if(typeof _file[Required._PATH] == 'undefined' && typeof _file[this._defLang] != 'undefined') {
            return _file[this._defLang];
        }

        return _file;
    }

    /**
     * Push scripts
     * @param _file
     * @returns {*}
     * @private
     */
    _scPushPackages(_file){

        if(typeof _file[Required._PATH] == 'undefined' && typeof _file[this._lang] != 'undefined'){
            return _file[this._lang];
        } else if(typeof _file[Required._PATH] == 'undefined' && typeof _file[this._defLang] != 'undefined') {
            return _file[this._defLang];
        }

        return _file;
    }

    /**
     * Push audio
     * @param _file
     * @returns {*}
     * @private
     */
    _auPushPackages(_file){
        return _file;
    }

    /**
     * Push loaded queue
     * @param queueName
     * @param filename
     */
    pushLoadedFileQueue(queueName, filename){

        if(this._loadedQueues[queueName] && this._loadedQueues[queueName].length > 0){

            let index = this._loadedQueues[queueName].indexOf(filename);

            if(index >= 0){
                this._loadedQueues[queueName].splice(index, 1);
            }

        }

        if(this._loadedQueues[this._oldQueueName].length == 0){

            $_required.sendLoaded(this._oldQueueName);

            let index = this.typeQueueName.indexOf(queueName);

            let nextIndex = index + 1;
            if(this.typeQueueName[nextIndex]){
                this._oldQueueName = this.typeQueueName[nextIndex];
            }
        }

        if(this._loadedQueues[this.typeQueueName[0]].length == 0 && this._loadedQueues[this.typeQueueName[1]].length == 0){

            setTimeout(()=>{

                if(this.isAllLoaded === true){
                    return ;
                }

                this.isAllLoaded = true;

                $_event.setEvent('loadingProcess', 100);
                $_event.setEvent('queueFinished');

                $_signal.goTo('!preloader.endPreload');
            }, 30);
        }

    }

    /**
     * Get next file for downloading
     * @returns {*}
     */
    getNextSortQueueFiles(){

        if(this._loadedQueues.preloader.length == 0 && $_services.getService("PopupService").hasCritError()){
            return false;
        }

        let shift = this._filesQueue.shift();

        if(shift){
            return shift;
        }

        return false;
    }

    /**
     * Create List Streams for downloading
     */
    createStreams () {

        this.streams = []; this._freeStreams = [];

        var core = this;

        for(let i=0; i<this.countStreams; i++){

            this._freeStreams.push(false);

            //setTimeout(()=>{
                var pr = new LoaderRequired();
                pr.setStreamNumber(i);

                var file = core.getNextSortQueueFiles();

                if(false !== file) {
                    pr.setPath(file.filename, file.path, file.size, file.queueName, file.type);
                    pr.load();
                }

                core.streams.push(pr);
            //}, 20);

        }


    };

    /**
     * Destroy all streams of downloading files
     */
    dropStreams () {

        for(var i=0; this.streams.length; i++){
            delete this.streams[i];
        }
    };

    /**
     * Flag of Stream busy
     * @param streamNumber
     */
    busyStreamLoad(streamNumber){

        this._freeStreams[streamNumber] = false;

        this._countFreeStreams--;
    }


    /**
     * Flag fo Stream to check them a free for next loading
     * @param streamNumber
     */
    finishedStreamLoad (streamNumber) {

        this._freeStreams[streamNumber] = true;

        this._countFreeStreams++;

        this._freeNextLoad();
    };

    /**
     * Find free Stream for downloading next file
     * @returns {*}
     */
    findFreeStreams () {

        if(this._freeStreams.indexOf(true) != -1){
            return this._freeStreams.indexOf(true);
        }

        return false;
    };

    /**
     * Free next load
     * @returns {boolean}
     * @private
     */
    _freeNextLoad(){

        var streamID = this.findFreeStreams();

        if(false === streamID){
            return false;
        }

        var file = this.getNextSortQueueFiles();

        if(false === file ) {
            return false;
        }

        var pr = this.streams[streamID];
        pr.setPath(file.filename, file.path, file.size, file.queueName, file.type);
        pr.load();
    }


    /**
     * Status loading
     */

    /**
     * Count all loaded files
     * @returns {number}
     */
    countDataLoading (queueName) {

        if(typeof this._dataStreamLoading != 'object' || typeof this._dataStreamLoading[queueName] != 'object'
            || Object.keys(this._dataStreamLoading[queueName]).length == 0){
            return 0;
        }

        var _count = 0;
        for(var _name in this._dataStreamLoading[queueName]){
            _count += parseInt(this._dataStreamLoading[queueName][_name]);
        }

        return _count;
    };

    /**
     * Set data load
     * @param nameFile
     * @param queueName
     * @param load
     */
    setDataLoading (nameFile, queueName, load) {

        if(typeof this._dataStreamLoading[queueName] == 'undefined'){
            this._dataStreamLoading[queueName] = {};
        }

        this._dataStreamLoading[queueName][nameFile] = load;


        var _fullSize = this._queueSize[this._oldQueueName];
        var _loaded = this.countDataLoading(this._oldQueueName);

        var proc = Math.ceil((_loaded * 100)/_fullSize);

        $_event.setEvent('loadingProcess', proc);
    };

}