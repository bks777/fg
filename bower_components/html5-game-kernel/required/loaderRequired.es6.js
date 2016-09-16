window.URL = window.URL || window.webkitURL;  // Take care of vendor prefixes.

/**
 * Loader ins for files
 * @constructor
 */
export default class LoaderRequired {

    constructor(){
        this._name = null;
        this._path = null;
        this._size = null;
        this._queueName = null;
        this._typeFile = null;

        this._isLoading = false;

        this._streamNumber = 0;

        this._log = false;

        if(typeof $_shifter != "undefined"){
            this._log = true;
        }
    }

    /**
     * Set Stream number
     * @param number
     */
    setStreamNumber (number){
        this._streamNumber = number;
    };

    /**
     * Get Stream number
     * @returns {number}
     */
    getStreamNumber (){
        return this._streamNumber;
    };

    /**
     * Set data loading
     * @param loaded
     */
    setProgress (loaded) {
        $_required_controller.setDataLoading(this._name, this._queueName, loaded);
    };

    /**
     * Set Path for load file
     * @param _name
     * @param _path
     * @param _size
     * @param _queueName
     * @param type
     */
    setPath (_name, _path, _size, _queueName, type) {
        this._name = _name;
        this._path = _path;
        this._size = _size;
        this._queueName = _queueName;
        this._typeFile = type;

        if(this._log){
            $_shifter.setLoadingStart(_name, _size, this._streamNumber);
        }
    };

    /**
     * Load file
     */
    load () {
        this._proccess(this._name, this._path, this._size, this._queueName, this._typeFile);
        $_required_controller.busyStreamLoad(this.getStreamNumber());
    };

    /**
     * Process Loading
     * @param name
     * @param path
     * @param size
     * @param queueName
     * @param typeFile
     * @returns {boolean}
     * @private
     */
    _proccess (name, path, size, queueName, typeFile) {
        if(this._isLoading === true){
            return false;
        }

        var core = this;

        var url = `${$_settingService.getSetting("game_path")}${path.substr(3)}?build_ts=${$_settingService.getSetting("build_ts")}`;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        switch (typeFile){
            case "audio":
                xhr.responseType = 'arraybuffer';
                break;
            case "js":
                xhr.responseType = 'text';
                break;

            default:
                xhr.responseType = 'blob';
                break;
        }

        xhr.timeout = 60 * 50 * 1000;//120000; // 30 second

        /**
         * Error timeout
         */
        xhr.ontimeout = function() {
            $_log.error('Sorry, the request has exceeded the maximum time! File: ' + path);
        };

        /**
         * Count loaded bytes
         * @param event
         */
        xhr.onprogress = function(event) {
            core.setProgress(event.loaded);
        };

        /**
         * Load file success
         * @param e
         */
        xhr.onload = function(e) {
            if (this.status == 200) {

                if(core._log){
                    $_shifter.setLoadingEnd(name);
                }

                if(typeFile == 'img'){

                    /**
                     * Set images to image buffer images
                     */

                    var $img = new Image();
                    $img.src = window.URL.createObjectURL(xhr.response);
                    $img._xhr = xhr;
                    $img._name = name;
                    $img._size = size;
                    $img._queueName = queueName;
                    $img._path = path;

                    $img.onload = function () {

                        window.URL.revokeObjectURL($img.src);

                        $_required.setImageRawData($img._name, this);
                        //$_required.setImageBuffer($img._name, $img._xhr.response, $img._size, $img._queueName, $img._path);

                        $_required_controller.finishedStreamLoad(core.getStreamNumber());
                        $_required_controller.pushLoadedFileQueue($img._queueName, $img._name);
                    };

                    $img.onerror = function (e) {
                        $_log.error("Error load image", e);

                        $_required_controller.finishedStreamLoad(core.getStreamNumber());
                    };
                }

                if(typeFile == 'js'){

                    /**
                     * Set <script type="text/javascript">*.INNER.*</script> to head
                     * @type {Element}
                     */
                    let script = document.createElement("script");
                    script.type = "text/javascript";
                    script.innerText = xhr.response;
                    document.head.appendChild(script);

                    $_required_controller.finishedStreamLoad(core.getStreamNumber());
                    $_required_controller.pushLoadedFileQueue(queueName, name);
                }

                if(typeFile == 'audio'){

                    /**
                     * Set audio to audio buffer audio collection
                     */
                    $_required.setAudioBuffer(name, path, size, queueName, xhr.response);
                    $_required_controller.finishedStreamLoad(core.getStreamNumber());
                    $_required_controller.pushLoadedFileQueue(queueName, name);
                }

                xhr = null;
            }
        };

        /**
         * Error load
         */
        xhr.onerror = function(event) {
            $_log.error('Error load file ' + core._path, event);
        };

        xhr.send();
    };
}