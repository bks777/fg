/**
 * HHS shifter for games
 * @constructor
 */
var HHSShifter = function(injections)
{
    this._id_key = 'hhs_shifter_key';
    this._id_block = 'hhs_shifter_block';
    this._id_popup = 'hhs_shifter_popup';

    this.trace = null;
    this._traceDOMActive = false;
    this.traceDOM = null;

    this.getCheats = null;
    this.addCheats = null;

    this._activeTraceLog = false;

    this.counters = {};

    this._rulesCheats = {
        "comb": 5,
        "board": 15
    };

    var _listCookie = {
        /*"getCheats": {"name": "Get cheats", "type":"button", "funcName": "$_shifter.luckyGetCheats"},*/
        /*"need_row": {"name":"Win to top line", "type": "text", "cookie": true, "queue": true},
        "free_need_row": {"name": "Win top line Free", "type": "text", "cookie": true, "queue": true},
        "dev_mode": {"name":"With out fullscreen", "type": "boolean", "cookie": true},
        "free_spins_count": {"name":"Count Free Spin", "type": "text", "cookie": true},
        "win_double": {"name":"Win in Double Game", "type": "boolean", "cookie": true},
        "lose_double": {"name":"Lose in Double Game", "type": "boolean", "cookie": true},
        "need_bar": {"name":"Full reels combinations", "type": "text", "cookie": true, "queue": true},
        "free_need_bar": {"name":"Full reels in free spin", "type": "text", "cookie": true},
        "save_token": {"name": "Save Game Token and Used after reload", "type": "boolean", "varName": "custom_vars.token", "init": true},
        "reconnect_disabled": {"name": "Reconnect disabled (API Cache)", "type": "boolean", "cookie": true},
        "balance": {"name": "Start balance of game", "type": "text", "cookie": true},*/
        /*"language": {"name": "Change language (ru|en)", "type": "text", "varName": "LANGUAGE", "init": true}*/
        "comb": {"name":"Need Row (s1,s2,...s5 or line_id:s1,s2,..s5)", "type": "text", "cookie": true, cheat: true},
        "board": {"name":"Need Bar (s1,s2,...s15) [priority][spin, freespin, bonus]", "type": "text", "cookie": true, cheat: true},
        "bonus_choise": {"name":"Bonus choise rip/life/n (цифровое значение сколько TB)", "type": "text", "cookie": true, cheat: true},
        "final_multiplier": {"name":"Bonus multiplier last round", "type": "text", "cookie": true, cheat: true},
        "_trace": {"name": "Trace domain (node server)", "type": "text", "varName": "$_shifter.trace.path", "init": true, "prompt": true},
        "_trace_connect": {"name": "Connect to trace after reload", "type": "boolean", "funcName": "$_shifter._reconnectTrace()", "init": true, "afterInit": null},
        "_trace_to_dom": {"name": "Save log DOM", "type": "boolean", "funcName": "$_shifter._saveLogToDOM()", "init": true},
        "_h": {"name": "Title popups", "type": "titles"},
        "sBP": {"name": "Show bonus popup", "type":"button", "execFunc": "$_shifter.closeShifter(); setTimeout(function(){$_signal.exec(\"popup.popups.bonusStart\");}, 500);"},
        "sFSSP": {"name": "Show FS Start popup", "type":"button", "execFunc": "$_shifter.closeShifter(); setTimeout(function(){$_signal.exec(\"popup.popups.freeSpinStart\", 15);}, 500);"},
        "sFSAP": {"name": "Show FS Add popup", "type":"button", "execFunc": "$_shifter.closeShifter(); setTimeout(function(){$_signal.exec(\"popup.popups.freeSpinAdd\", 15);}, 500);"},
        "sFSEP+": {"name": "Show FS End & win popup", "type":"button", "execFunc": "$_shifter.closeShifter(); setTimeout(function(){$_signal.exec(\"popup.popups.freeSpinFinish\", 600);}, 500);"},
        "sFSEP-": {"name": "Show FS End & no win popup", "type":"button", "execFunc": "$_shifter.closeShifter(); setTimeout(function(){$_signal.exec(\"popup.popups.freeSpinFinish\", 0);}, 500);"},
        "timeLoading-": {"name": "Show time loading", "type":"button", "execFunc": "$_shifter.openTimeLoad();"}
    };

    /**
     * Ready shifts
     * @type {{comb: *[]}}
     * @private
     */
    this._readyShifts = {
        "comb": [
            {
                "name": "FreeSpins",
                "data": "1,13,13,13"
            },
            {
                "name": "Bonus",
                "data": "1,14,1,14"
            },
            {
                "name": "Big Win",
                "data": "9,9,9,9"
            }
        ],
        "board": [
            {
                "name": "All win",
                "data": "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1"
            },
            {
                "name": "No win",
                "data": "1,2,3,4,5,6,7,1,2,3,4,5,6,7,1"
            }
        ]
    };

    this._noEmptyCoo = false;
    this._listCookies = {};

    this.titleGame = null;
    this.template = {};

    this._lastName = null;
    this._lastDataText = [];

    this._memoryName = "_shifter";

    var _scrollTop = 0;

    var _subscriteToSpin = false;

    var _queueCounter = {};
    var _queueNames = [];

    var _interfalFocus = null;

    var memory = $_services.getService("MemoryService");

    /**
     * Init shifter
     */
    this.init = function(data)
    {
        for(var _k in data){
            this[_k] = data[_k];
        }

        if(memory.has(this._memoryName, MemoryService.MEMORY_LOCAL_STORAGE)){
            this._listCookies = memory.get(this._memoryName, MemoryService.MEMORY_LOCAL_STORAGE);
        }

        for(var _key in _listCookie){
            if(memory.get(_key, MemoryService.MEMORY_COOKIES_STORAGE)){
                this._noEmptyCoo = true;

                if(typeof _listCookie[_key].cookie != 'undefined' && _listCookie[_key].cookie === true && !this._listCookies[_key] ){
                    this._listCookies[_key] = memory.get(_key, MemoryService.MEMORY_COOKIES_STORAGE);
                }

                if(this.checkQueue(this._listCookies[_key], _key)){
                    this.subscribeToSpin();

                    this.setToCookieQueue(_key);
                }

            } else if (this._listCookies[_key] && _listCookie[_key].cookie === true){
                if(this.checkQueue(this._listCookies[_key], _key)){
                    this.subscribeToSpin();

                    this.setToCookieQueue(_key);
                } else {
                    this.setMemory(_key, this._listCookies[_key]);
                }
            }

            if(typeof _listCookie[_key].init != 'undefined' && _listCookie[_key].init === true && this._listCookies[_key]){
                if(typeof _listCookie[_key].varName != 'undefined'){
                    eval('window.' + _listCookie[_key].varName + '="' + this._listCookies[_key] + '";');
                }

                if(typeof _listCookie[_key].funcName != 'undefined'){
                    setTimeout(function(){
                        eval('window.' + _listCookie[_key].funcName + ';');
                    }, 50);
                }

                if(typeof _listCookie[_key].afterInit != 'undefined'){
                    this._listCookies[_key] = _listCookie[_key].afterInit;
                }
            }
        }

        if(this._noEmptyCoo === true){
            memory.set(this._memoryName, this._listCookies, MemoryService.MEMORY_LOCAL_STORAGE);
        }

        this.template.appendHtml(document.body, this.template.render('init', {_id: this._id_key}));
    };

    /**
     * Open shifter
     */
    this.open = function()
    {
        this.template.initCss();

        if(document.getElementById(this._id_block) === null){
            this.template.appendHtml(document.body, this.template.render('main', {
                _id     : this._id_block,
                _title  : this.titleGame,
                _close  : '$_shifter.closeShifter();',
                _list   : _listCookie,
                _trace_key : '$_shifter.openTrace();',
                _data   : this._listCookies,
                _change : '$(\'\')'
            }));
        } else {
            document.getElementById(this._id_block).style.display = "block";
        }

        window.scrollTo(0,0);

        $_event_blocked.setEvent(0);

        $_view_canvas._freezeTicker = true;
    };

    /**
     * Open to change block
     * @param name
     */
    this.openChange = function(name)
    {
        this._lastName = name;

        if(typeof _listCookie[name].prompt != 'undefined' && _listCookie[name].prompt === true){

            var _valuePrompt = prompt(_listCookie[name].name);
            this._listCookies[name] = _valuePrompt;

            var el = document.getElementById("__shifter_" + name + " div");
            el.outerHTML = _valuePrompt;

            memory.set(this._memoryName, this._listCookies, MemoryService.MEMORY_LOCAL_STORAGE);

        } else {

            this.template.appendHtml(document.body, this.template.render('popupData', {
                _id     : this._id_popup,
                _name   : _listCookie[name].name,
                _shifts : typeof this._readyShifts[name] != "undefined"? this._readyShifts[name] : [],
                _value  : typeof this._listCookies[name] == 'undefined' ? '' : this._listCookies[name],
                _close  : '$_shifter.closeChange();'
            }));

            window.scrollTo(0,0);
        }
    };

    /**
     * Add shifts
     * @param id
     */
    this.addShifts = function (id) {

        var _el = document.getElementById("_shif_value");

        if(this._readyShifts[this._lastName][id]){
            if(!_el.value){
                _el.value = this._readyShifts[this._lastName][id].data;
            } else {
                _el.value = _el.value + "/" + this._readyShifts[this._lastName][id].data;
            }
        }
    };

    /**
     * Close shifter
     */
    this.closeShifter = function()
    {
        if(_interfalFocus !== null){
            clearInterval(_interfalFocus);
            _interfalFocus = null;
        }

        $_event_blocked.setEvent(1);

        document.getElementById(this._id_block).style.display = "none";

        $_view_canvas._freezeTicker = false;

        createjs.Ticker.paused = false;
    };

    /**
     * Change boolean type
     * @param name
     * @param object
     */
    this.changeBoolean = function(name, object)
    {
        var _typeData = typeof _listCookie[name].cookie == 'undefined' && typeof _listCookie[name].varName != 'undefined';

        if(typeof this._listCookies[name] == 'undefined' || this._listCookies[name] === null || this._listCookies[name] == ""){

            if(_typeData){
                this._saveVariable(name);
            } else {
                this.setMemory(name, '1');
            }

            this.template.addClass('_active_', object);
        } else {

            if(_typeData){
                this._removeVariable(name);
            } else {
                this.template.removeClass('_active_', object);
            }

            this.setMemory(name, null);
        }

        memory.set(this._memoryName, this._listCookies, MemoryService.MEMORY_LOCAL_STORAGE);
    };

    /**
     * Click to button
     * @param name
     * @param object
     */
    this.openButton = function (name, object) {

        if(typeof _listCookie[name].funcName == 'undefined' && typeof _listCookie[name].execFunc == 'undefined'){
            return ;
        }

        this.template.addClass('_active_', object);

        if(_listCookie[name].execFunc !== undefined){
            eval(_listCookie[name].execFunc);
        } else {
            var variable = _listCookie[name].funcName.split(".");

            window[ variable[0] ][ variable[1] ]();
        }

        setTimeout(function () {
            this.template.removeClass('_active_', object);
        }.bind(this), 200);
    };

    /**
     * Save value of text input
     */
    this.saveText = function()
    {
        var _old = this._lastDataText.join("");
        var _val = document.getElementById("_shif_value").value;

        if(_val !== _old){
            var _r = _val.split(',');
            var _n = [];

            for(var _i = 0; _i < _r.length; _i++){
                if(_i > 0){
                    _n.push(',');
                }

                _n.push(_r[_i]);
            }

            this._lastDataText = _n;
        }

        this._listCookies[this._lastName] = this._lastDataText.join("");

        if(this.checkQueue(this._listCookies[this._lastName], this._lastName)){
            _queueCounter[this._lastName] = 0;

            this.setToCookieQueue(this._lastName);
        } else {
            this.setMemory(this._lastName, this._lastDataText.join(""));
        }

        this.closeChange();

        memory.set(this._memoryName, this._listCookies, MemoryService.MEMORY_LOCAL_STORAGE);

        var last = $("#__shifter_" + this._lastName);

        if(this._lastDataText.length > 0){
            last.html(this.template.render('issetData.text', {_name: this._lastName, value: this._lastDataText.join("")}));
        } else {
            last.html(this.template.render('emptyData.text', {_name: this._lastName}));
        }

        this.counters = {};
    };

    /**
     * Remove value of text input
     */
    this.removeText = function()
    {
        this._lastDataText = [];
        document.getElementById("_shif_value").value = "";

        this.setMemory(this._lastName, null);
        this.closeChange();

        memory.set(this._memoryName, this._listCookies, MemoryService.MEMORY_LOCAL_STORAGE);

        $("#__shifter_" + this._lastName).html(this.template.render('emptyData.text', {_name: this._lastName}));

        this.counters = {};
    };

    /**
     * Close change
     */
    this.closeChange = function()
    {
        this.template.remove(this._id_popup);
    };

    /**
     * Set number to input
     * @param num
     */
    this.setNumber = function(num)
    {
        if(num == -1){
            this._lastDataText.pop();
        } else {
            this._lastDataText.push(num);
        }

        document.getElementById("_shif_value").value = this._lastDataText.join('');
    };

    /**
     * Save variable to memory
     * @param name
     */
    this._saveVariable = function(name)
    {
        var _el = _listCookie[name].varName.split('.');
        var _var = null;

        switch (_el.length){
            case 3:
                _var = window[ _el[0] ][ _el[1] ][ _el[2] ];
                break;
            case 2:
                _var = window[ _el[0] ][ _el[1] ];
                break;
            case 1:
                _var = window[ _el[0] ];
                break;

            default:
                $_log.error('Data not save!');
                return null;
        }

        this._listCookies[name] = _var;
        memory.set(this._memoryName, this._listCookies, MemoryService.MEMORY_LOCAL_STORAGE);

        $("#__shifter_" + name).html(this.template.render('issetData.boolean', {_name: name}));
    };

    /**
     * Remove variable in memory
     * @param name
     */
    this._removeVariable = function(name)
    {
        this._listCookies[name] = null;

        memory.set(this._memoryName, this._listCookies, MemoryService.MEMORY_LOCAL_STORAGE);

        $("#__shifter_" + name).html(this.template.render('emptyData.boolean', {_name: name}));
    };

    /**
     * Memory
     */

    this.setMemory = function(name, value, saveLocal)
    {
        name = $.trim(name);
        var _d = decodeURIComponent(value);

        memory.set(name, _d, MemoryService.MEMORY_COOKIES_STORAGE);

        if(!value){

            memory.set(name, "", MemoryService.MEMORY_COOKIES_STORAGE);
            this._listCookies[name] = "";

            memory.set(this._memoryName, this._listCookies, MemoryService.MEMORY_LOCAL_STORAGE);
        } else if(memory.get(name, MemoryService.MEMORY_COOKIES_STORAGE) == _d){
            if(saveLocal !== false){

                this._listCookies[name] = value;
                memory.set(this._memoryName, this._listCookies, MemoryService.MEMORY_LOCAL_STORAGE);
            }

        } else {
            alert('Data not save!');
        }
    };

    /**
     * QUEUE of result cookie
     */

    /**
     * Check type of queue
     * @param text
     * @param key
     * @returns {boolean}
     */
    this.checkQueue = function(text, key)
    {
        if(!text){
            return false;
        }

        var _res = text.indexOf('/') != -1;

        if(_res === false){
            return false;
        }

        if(typeof _queueCounter[key] == 'undefined'){
            _queueCounter[key] = 0;
        }

        if(_queueNames.indexOf(key) == -1){
            _queueNames.push(key);
        }

        return _res;
    };

    /**
     * Set to queue of cookie
     * @param key
     */
    this.setToCookieQueue = function(key)
    {
        var _list = this._listCookies[key];

        if(this.checkQueue(_list, key)){
            var _r = _list.split("/");

            this.setMemory(key, _r[ _queueCounter[key] ], false);

            if(_queueCounter[key] < _r.length - 1){
                _queueCounter[key]++;
            } else {
                _queueCounter[key] = 0;
            }
        }
    };

    /**
     * Subscribe to spin
     */
    this.subscribeToSpin = function()
    {
        if(_subscriteToSpin === true){
            return null;
        }

        _subscriteToSpin = true;

        $_event.setSubscriber("spinResult", "$_shifter");
    };

    /**
     * Get data from game to spin
     */
    this.spinResultEvent = function()
    {
        if(_queueNames.length == 0){
            return null;
        }

        for(var _i = 0; _i < _queueNames.length; _i++){
            this.setToCookieQueue(_queueNames[_i]);
        }
    };

    /**
     * Trace log
     */
    this.openTrace = function()
    {
        if(this._traceDOMActive === true){

            this.traceDOM.open();

            return false;
        }


        if(this._activeTraceLog === false){
            var _answer = confirm("You want to broadcast logs?");
            if(_answer === true){
                alert("Broadcast log to server");

                this.trace.close();
                this.trace.transmit();

            } else if(confirm("Do you want to receive logs from the server?")){
                alert("Listen logs from devices");

                this.trace.close();
                this.trace.receive();
            } else {

                this.trace.close();
                return null;
            }

            this._activeTraceLog = true;
            this.trace.connect();

        } else {
            alert("Broadcast is closed");

            this.trace.close();
            this._activeTraceLog = false;
        }
    };

    /**
     * Reconnect to trace transmit after reload
     * @private
     */
    this._reconnectTrace = function ()
    {
        //$_event.setSubscriber("startLoading", "$_shifter");
        this.startLoadingEvent();
    };

    /**
     * Subscribe to init event for connect to websocket trace
     */
    this.startLoadingEvent = function ()
    {
        $_log._traceStart = true;

        if(this._traceDOMActive === true){
            this.traceDOM.init();
        } else {
            this._activeTraceLog = true;
            this.trace.transmit();
            this.trace.connect();
        }
    };

    /**
     * Get protocol cheats
     * @returns {*}
     */
    this.getProtocolCheats = function () {

        var data = memory.get(this._memoryName, MemoryService.MEMORY_LOCAL_STORAGE);

        if(data == null){
            return undefined;
        }

        var cheats = {}; var saveCheats = {};

        for(var key in _listCookie){
            if(_listCookie[key].cheat !== undefined && _listCookie[key].cheat === true){

                if(data[key]){

                    var ch = data[key].split("/");

                    if(ch.length == 0){
                        continue;
                    }

                    var el = ch.shift();

                    saveCheats[key] = ch.join("/");


                    if(this._rulesCheats[key] != null){

                        /**
                         * Check rules
                         */
                        var rules = el.split(":");
                        var elRule = rules[rules.length - 1];

                        var elements = elRule.split(",");

                        var diff = this._rulesCheats[key] - elements.length;

                        for(var i = 0; i < diff; i++){
                            elements.push(getRandomInt(1,8));
                        }

                        elements.splice(this._rulesCheats[key]);

                        if(rules.length > 1){
                            el = [rules[0] , elements.join(",")].join(":");
                        } else {
                            el = elements.join(",");
                        }

                    }

                    cheats[key] = el;
                }

            }
        }

        memory.set(this._memoryName, saveCheats, MemoryService.MEMORY_LOCAL_STORAGE);

        return Object.keys(cheats).length > 0 ? cheats : undefined;
    };

    /**
     * DOM log trace
     */
    this._saveLogToDOM = function ()
    {
        this._traceDOMActive = true;
        this._reconnectTrace();
    };


    /**
     * Shifter lucky
     */

    /**
     * Get cheats
     * @param callback
     */
    this.luckyGetCheats = function (callback) {alert(1);

        this._transfer = new TransferJSONP({
            "actionCurlUrl": $_args.actionCurlUrl,
            noStatus: true
        });

        console.log('!!! this._transfer', this._transfer);

        this._transfer.callback(function (data) {
            console.log('!!! shifter callback', data);
        });

        this._transfer.send(this.getCheats.format($_args.alias), "", TransferInterface.TYPE_GET);
    };


    /**
     * Loading time
     */

    this._loadingTimes = {};
    this._loadingTimeMin = null;
    this._loadingTimeMax = 0;

    /**
     * Start loading
     * @param _name
     * @param _size
     * @param _streamNumber
     */
    this.setLoadingStart = function(_name, _size, _streamNumber){

        var time = +new Date();

        if(this._loadingTimeMin == null){
            this._loadingTimeMin = time;
        }

        this._loadingTimes[_name] = {
            "name"  : _name,
            "size"  : _size,
            "stream": _streamNumber,
            "start" : time
        };
    };

    /**
     * Set end loading time
     * @param _name
     */
    this.setLoadingEnd = function (_name) {

        var time = +new Date();

        if(this._loadingTimes[_name] !== undefined){
            this._loadingTimes[_name]["end"] = time;

            if(this._loadingTimeMax < time){
                this._loadingTimeMax = time;
            }
        }
    };

    /**
     * Open time loading
     */
    this.openTimeLoad = function () {
        this.template.appendHtml(document.body, this.template.render('timeLoading', {
            _min: this._loadingTimeMin,
            _max: this._loadingTimeMax,
            _list: this._loadingTimes,
            _update: "$_shifter._updateTimes();",
            _time: this._loadingTimeMax - this._loadingTimeMin,
            _close  : '$_shifter.closeChange();'
        }));

        window.scrollTo(0,0);
    };

    /**
     * Update times for logger
     * @private
     */
    this._updateTimes = function () {

        if(this._timesInt === undefined){

            this._timesInt = setInterval(function () {

                $("#hhs_shifter_popup").remove();

                this.template.appendHtml(document.body, this.template.render('timeLoading', {
                    _min: this._loadingTimeMin,
                    _max: this._loadingTimeMax,
                    _list: this._loadingTimes,
                    _update: "$_shifter._updateTimes();",
                    _time: this._loadingTimeMax - this._loadingTimeMin,
                    _close  : '$_shifter.closeChange();'
                }));

                //var height = document.getElementById("_time_list").style.height;
                //document.getElementById("_time_list").scrollTo(height,height);


            }.bind(this), 5 * 100);
        } else {
            clearInterval(this._timesInt);
            this._timesInt = undefined;
        }


    };


    this.init(injections);
};
