import Controller from "../../../../bower_components/html5-game-kernel/interfaces/controllers/Controller.es6.js";
import ProtocolService from "../../../../bower_components/html5-game-kernel/interfaces/services/protocolService.es6.js";
import ProtocolConnect from "../required/connect.es6.js"
import BetService from "../../../../bower_components/html5-game-kernel/interfaces/services/betService.es6.js";
import LinesService from "../../../../bower_components/html5-game-kernel/interfaces/services/linesService.es6.js";
import SlotMachineService from "../../../../bower_components/html5-game-kernel/interfaces/services/slotMachineService.es6.js";
import BonusService from "../../../../bower_components/html5-game-kernel/interfaces/services/bonusService.es6.js";
import PayTableService from "../../../../bower_components/html5-game-kernel/interfaces/services/payTableService.es6.js";
import MemoryService from "../../../../bower_components/html5-game-kernel/interfaces/services/memoryService.es6.js";

import {default as config} from "json!./config.json";

/**
 * Protocol Controller
 * @constructor
 */
export default class ProtocolLuckyController extends Controller
{
    constructor (data = {}){
        super(data);

        this.init(config);

        this.settingsService = new GameSettingsService();

        this.connect = new ProtocolConnect(this.settingsService);

        this.protocolData = {};
        this.protocolService = new ProtocolService();

        this.betService = new BetService();
        this.linesService = new LinesService();
        this.slotService = new SlotMachineService();
        this.bonusService = new BonusService();
        this.payTableService = new PayTableService();

        this.memory = new MemoryService();

        this.token = null;
        this.requestID = null;
        this.sessionID = null;

        this.typeModes = []; // modes of game commands

        this.initProtocol = false;
        this.initCallback = null;

        this.timeIntervalSync = 3000;
        this.intervalSync = null;

        this.activeRequest = true;

        visibly.onVisible( () => {
            this.syncAction();
        });

        this.updateBalance = true;

        this._startState = [];

        this.actions = {
            "last"      : null,
            "current"   : null,
            "available" : []
        };
    }

    /**
     * Get game token
     * @returns {null|*}
     */
    getToken () {

        if(this.token === null){

            /**
             * Test mode
             */
            if($_args.token == false){
                this.settingsService.setSetting("test", true);

                var user = "{0}_user@gg.ua".format(this.connect.generateHash());

                var memoryStorage = this.getService("MemoryService");

                if(memoryStorage.has("userToken", MemoryService.MEMORY_COOKIES_STORAGE)){
                    user = memoryStorage.get("userToken", MemoryService.MEMORY_COOKIES_STORAGE);
                } else {
                    memoryStorage.set("userToken", user, MemoryService.MEMORY_COOKIES_STORAGE);
                }

                this.token = `test:${this.settingsService.getSetting("alias")}-${user}`;
            } else {
                this.token = decodeURIComponent($_args.token);
            }
        }

        return this.token;
    }

    /**
     * Generate Request ID
     * @returns {*}
     */
    generateRequestID () {
        this.requestID = this.connect.generateHash();
        this.memory.set("protocolRequestID", this.requestID);
        return this.requestID;
    }

    /**
     * Get Request ID
     * @returns {null|*}
     */
    getRequestID () {
        return this.requestID
    }

    /**
     * Get current lang
     * @returns {null|*}
     */
    getLang () {
        return $_t.getLanguage();
    }

    /**
     * Restart protocol session
     */
    restartSession(){
        this.authAction(()=>{
            $_signal.goTo("!popup.errors.hideAllSystem");
        });
    }

    /**
     * Init game protocol
     * @param callback
     */
    authAction (callback = null) {
        this.activeRequest = false;

        this.connect.send(
            {
                "command"   : "login",
                "request_id": this.generateRequestID(),
                "token"     : this.getToken(),
                "language"  : this.getLang()
            },
            (response) => {

                this.activeRequest = true;

                this.requestID = response.request_id; //request_id
                this.sessionID = response.session_id; //session_id

                this.protocolService.setFreeBets(response.freebets);    // setFreeBets
                this.protocolService.setModes(response.modes);          // setModes
                this.protocolService.setUserData(response.user);        // setUserData

                this.startAction(callback);
            },
            (error) => {
                setTimeout(()=>{
                    this.authAction(callback)
                }, 1000);
            }
        )
    };

    /**
     * Init game start protocol
     * @param callback
     */
    startAction (callback = null) {

        this.activeRequest = false;

        this.connect.send(
            {
                "command"       : "start",
                "request_id"    : this.generateRequestID(),
                "session_id"    : this.sessionID,
                "mode"          : this.protocolService.hasFreeBets() ? "freebet" : "play",
                "freebet_id"    : null
            },
            (response) => {
                this.activeRequest = true;

                this.requestID = response.request_id; //request_id
                this.sessionID = response.session_id; //session_id

                this.protocolService.setAvailableActions(response.context.actions);
                this.protocolService.setCurrentAction(response.context.current);

                this.actions.last = response.context.last_action;
                this.actions.current = response.context.current;
                this.actions.available = response.context.actions;

                this.protocolService.setLastAction(response.context.last_action);

                this.protocolService.setSpinsReelsData(response.context.spins);
                this.protocolService.setFreeSpinsReelsData(response.context.freespins);
                this.bonusService.setBonusContext(response.context.bonus);
                this.protocolService.setReSpinsReelsData(response.context.respins);


                this.protocolService.setUserData(response.user);

                this.protocolService.setFreeBets(response.freebet);

                //console.debug ("protocol start action", response.settings.bets, response.settings.paylines);

                this.betService.setBetRange(response.settings.bets);
                this.betService.updateFromProtocol();

                this.linesService.setLinesRange(response.settings.lines);
                this.linesService.setPayLines(response.settings.paylines);
                this.linesService.updateFromProtocol();

                this.linesService.setToZeroCounter(); // zero counter line

                this.slotService.setColumns(response.settings.cols);
                this.slotService.setRows(response.settings.rows);
                this.slotService.setDefaultSymbols(response.settings.symbols);
                this.slotService.setReelSamples(response.settings.reelsamples);

                this.payTableService.setPayTable(response.settings.paytable);

                this.bonusService.setBonusSettings(response.settings.bonus);

                this._startState = [[`!protocol.ready.${response.context.current}`]];
                //this._startState = [[`!protocol.ready.${this.protocolService.getCurrentAction()}`]];

                /**if(["bonus_end", "freespin_end"].indexOf(this.protocolService.getNextAction()) !== -1){
                    this._startState.push([`!protocol.readyCloseGame.${this.protocolService.getNextAction()}`]);
                }*/

                if(this.protocolService.isAvailableStartBonusGame()){
                    //this._startState.push([`!protocol.ready.bonus_inits`]);
                }

                if(this.protocolService.isAvailableFreeSpinsEnd()){
                    //this._startState.push([`!protocol.freespins_end.init`]);
                }

                

                this.initProtocol = true;

                $_signal.goTo('preloader.initGame');

                this.checkSync();

                if(callback !== null){
                    callback();
                }

            },
            (error) => {
                this.checkSync();

                setTimeout(()=>{
                    this.startAction(callback);
                }, 1000);
            }
        )
    };


    /**
     * Ready game
     */
    readyGame(){

        /**
         * Has freeBets
         */
        if(this.protocolService.hasFreeBets()){
            let freebets = this.protocolService.getFreeBets();

            this._startState.push([`!protocol.ready.freebets`,
                freebets.bet_per_line,
                freebets.left_spins,
                freebets.lines,
                freebets.total_bet,
                freebets.total_spins,
                freebets.total_win
            ]);
        }


        this.executeReadyState()
    }


    /**
     * Execute Ready state
     */
    executeReadyState(){
        for(let i = 0, l = this._startState.length; i < l; i++){
            $_signal.goTo.apply($_signal, this._startState[i]);
        }
    }

    /**
     * Check init protocol
     */
    checkInitProtocol (){

        if(this.initProtocol === true){
            //$_signal.goTo('preloader.initGame');
        } else {
            this.initCallback = true;
        }

        this.initCallback = true;

    };

    /**
     * Send data protocol
     * @param linkFunc
     * @param resolve
     * @param args
     */
    sendData(linkFunc, resolve, ...args){
        if(!linkFunc){
            resolve();
            return ;
        }

        /**
         * Send data protocol
         * @param resolveProtocol
         */
        const sendData = (resolveProtocol) => {

            var promise = new Promise((res, rej) => {
                this[linkFunc].apply(this, [...args, res, rej]);
            });

            promise = promise.then(resolveProtocol);

            promise.catch(()=>{
                setTimeout(()=>{
                    sendData(resolveProtocol);
                }, 1000);
            });
        };

        sendData(resolve);
    }

    /**
     * Send Spin to server
     * @param nextAction
     * @param resolve
     * @param reject
     */
    spinSendAction (nextAction = this.protocolService.getNextAction(), resolve = ()=>{}, reject = ()=>{}){
        this.activeRequest = false;

        let requestData = {
            "command": "play",
            "request_id": this.generateRequestID(),
            "session_id": this.sessionID,
            "set_denominator": this.protocolService.getCurrentDenominator(),
            "freebet_id": null,
            "action": {
                "name": nextAction,
                "params": {

                }
            }
        };

        if(this.protocolService.getNextAction() == "spin"){
            requestData.action.params = {
                "bet_per_line": this.betService.getCurrentValue(),
                "lines": this.linesService.getCurrentValue()
            }
        }

        this.updateBalance = false;

        this.connect.send(requestData,
            (response) => {
                this.responseSpinAction(response, null);//this.protocolService.getCurrentAction());

                resolve();
            },
            (error) => {
                this.checkSync();

                reject();
            }
        );
    };

    /**
     * FreeSpin init action
     */
    freeSpinInitSendAction(number, resolve = () => {}, reject = () => {}){

        if(this.getService("GameActionService").get() != "freespin_init"){
            $_signal.goTo(`protocol.freespin_init.stop`);
            return null;
        }

        this.activeRequest = false;

        this.updateBalance = false;

        this.connect.send(
            {
                "command": "play",
                "request_id": this.generateRequestID(),
                "session_id": this.sessionID,
                "set_denominator": this.protocolService.getCurrentDenominator(),
                "freebet_id": null,
                "action": {
                    "name": "freespin_init",
                    "params": {
                        "selected": number
                    }
                }
            },
            (response) => {
                $_signal.goTo(`!protocol.freespins.init`);
                this.responseSpinAction(response, null);//this.protocolService.getCurrentAction());

                resolve();
            },
            (error) => {
                this.checkSync();

                reject();
            }
        );
    }

    /**
     * FreeSpin init action
     */
    freeSpinEndSendAction(resolve, reject){

        this.activeRequest = false;

        this.updateBalance = false;

        this.connect.send(
            {
                "command": "play",
                "request_id": this.generateRequestID(),
                "session_id": this.sessionID,
                "set_denominator": this.protocolService.getCurrentDenominator(),
                "freebet_id": null,
                "action": {
                    "name": "freespin_stop",
                    "params": {}
                }
            },
            (response) => {
                this.responseSpinAction(response, null);
                //this.getService("GameActionService").next();

                resolve();
            },
            (error) => {
                this.checkSync();

                reject();
            }
        );
    }

    /**
     * Send freeSpin to server
     * @private
     */
    freespinSendAction (){
        this.activeRequest = false;

        let requestData = {
            "command": "play",
            "request_id": this.generateRequestID(),
            "session_id": this.sessionID,
            "set_denominator": this.protocolService.getCurrentDenominator(),
            "freebet_id": null,
            "action": {
                "name": this.protocolService.getNextAction(),
                "params": {}
            }
        };

        if(this.protocolService.getNextAction() == "spin"){
            requestData.action.params = {
                "bet_per_line": this.betService.getCurrentValue(),
                "lines": this.linesService.getCurrentValue()
            }
        }

        this.updateBalance = false;

        this.connect.send(
            requestData,
            (response) => {
                this.responseSpinAction(response, null);//this.protocolService.getCurrentAction());
            },
            (error) => {
                this.checkSync();
            }
        );
    }

    bonusInitState (state = null) {

        /*

        this.getService("BonusService").startBonusGame();

        if(this.getService("ProtocolService").getAvailableActions().indexOf("bonus_init") > -1){
            $_signal.goTo(`protocol.bonus.start`);
        } else if(this.getService("ProtocolService").getAvailableActions().indexOf("bonus_pick") > -1){
            $_signal.goTo(`protocol.bonus.picks`);
        } else if(this.getService("ProtocolService").getAvailableActions().indexOf("bonus_stop") > -1){
            $_signal.goTo(`protocol.bonus.sendEnd`);
        }*/
    }

    /**
     * Bonus start send to serves
     * @returns {null}
     */
    bonusStartSendAction (resolve, reject) {

        this.activeRequest = false;

        this.updateBalance = false;

        this.connect.send(
            {
                "command": "play",
                "request_id": this.generateRequestID(),
                "session_id": this.sessionID,
                "set_denominator": this.protocolService.getCurrentDenominator(),
                "freebet_id": null,
                "action": {
                    "name": "bonus_init",
                    "params": {

                    }
                }
            },
            (response) => {
                this.responseSpinAction(response, null);

                resolve();
            },
            (error) => {
                this.checkSync();

                reject();
            }
        );
    }

    /**
     * Send bonus choose to server
     * @param choose
     * @param resolve
     * @param reject
     */
    bonusSendAction (choose, resolve = () => {}, reject = () => {}) {

        this.activeRequest = false;

        this.updateBalance = false;

        this.connect.send(
            {
                "command": "play",
                "request_id": this.generateRequestID(),
                "session_id": this.sessionID,
                "set_denominator": this.protocolService.getCurrentDenominator(),
                "freebet_id": null,
                "action": {
                    "name": "bonus_pick",
                    "params": {
                        "selected": parseInt(choose)
                    }
                }
            },
            (response) => {
                this.responseSpinAction(response, "bonus");

                resolve();
            },
            (error) => {
                this.checkSync();

                reject();
            }
        );
    }

    bonusCheckSpinResultAction () {
        //if (!this.getService("BonusService").isStarted()) {
        //    $_signal.goTo ("+protocol.bonus_stop.init");
        //} else {
            $_signal.goTo ("bonus.showResult");
        //}
    }

    /**
     * Bonus end send to server
     * @param resolve
     * @param reject
     */
    bonusEndSendAction (resolve = () => {}, reject = () => {}){

        this.activeRequest = false;

        this.updateBalance = false;

        this.connect.send(
            {
                "command": "play",
                "request_id": this.generateRequestID(),
                "session_id": this.sessionID,
                "set_denominator": this.protocolService.getCurrentDenominator(),
                "freebet_id": null,
                "action": {
                    "name": "bonus_stop",
                    "params": {

                    }
                }
            },
            (response) => {
                this.responseSpinAction(response, "bonus_stop");

                resolve();
            },
            (error) => {
                this.checkSync();

                reject();
            }
        );
    }

    /**
     * Response spin action
     * @param response
     * @param responseAction
     */
    responseSpinAction (response, responseAction = null){

        this.activeRequest = true;

        if(response && response.command == "sync"){
            return ;
        }


        this.requestID = response.request_id; //request_id
        this.sessionID = response.session_id; //session_id

        this.linesService.setToZeroCounter(); // zero counter line

        if(response.context) {

            this.actions.last = response.context.last_action;
            this.actions.current = response.context.current;
            this.actions.available = response.context.actions;

            this.protocolService.setAvailableActions(response.context.actions);
            this.protocolService.setCurrentAction(response.context.current);
            this.protocolService.setLastAction(response.context.last_action);

            if(response.context.spins){
                this.protocolService.setSpinsReelsData(response.context.spins);
            }

            this.protocolService.setReSpinsReelsData(response.context.respins);
            this.protocolService.setFreeSpinsReelsData(response.context.freespins);
            this.bonusService.setBonusContext(response.context.bonus);
        }

        if (this.protocolService.getAvailableActions().indexOf("bonus_stop") > -1) {
            this.bonusService.endBonusGame ();
        }


        this.protocolService.setUserData(response.user);

        if(response.freebet !== null){
            this.protocolService.setFreeBets(response.freebet);
        } else {
            this.protocolService.setFreeBets([]);
        }

        /**
         * Execute history states
         */

        /*if(responseAction !== null){
            $_signal.goTo(`protocol.${responseAction}.stop`);
        } else {
            $_signal.goTo(`protocol..stop`);
        }

        this.protocolService.checkNextGame();*/

        this.updateBalance = true;

        this.checkSync();
    }

    /**
     * SYNC
     */

    /**
     * Run sync action
     */
    syncAction (){

        if(this.intervalSync !== null){
            clearTimeout(this.intervalSync);
        }

        if(this.activeRequest === false){
            this.checkSync();
            return null;
        }

        this.activeRequest = false;

        this.connect.send(
            {
                "command": "sync",
                "request_id": this.generateRequestID(),
                "session_id": this.sessionID
            },
            (response) => {
                this.activeRequest = true;

                this.requestID = response.request_id; //request_id
                this.sessionID = response.session_id; //session_id

                if(HelperFlags.get("gameLoaded") && this.protocolService.getCurrentBalance() != response.user.balance && this.updateBalance === true){
                    this.protocolService.setUserData(response.user);

                    $_signal.goTo("!protocol.async.changeBalance");
                }

                this.checkSync();
            },
            (error) => {
                this.checkSync();
            }
        )
    };

    /**
     * Sync response action
     */
    checkSync (){
        if(this.intervalSync !== null){
            clearTimeout(this.intervalSync);
        }

        this.intervalSync = setTimeout(this.syncAction.bind(this), this.timeIntervalSync);
    }

    /**
     * Update Start
     */
    updateStartAction(resolve, reject){

        this.connect.send(
            {
                "command"       : "start",
                "request_id"    : this.generateRequestID(),
                "session_id"    : this.sessionID,
                "mode"          : "play",//this.protocolService.hasFreeBets() ? "freebet" : "play",
                "freebet_id"    : null
            },
            (response) => {

                let currentState = $_signal_history.getCurrentState();

                HelperFlags.set("noSpin", null);

                this.activeRequest = true;

                this.actions.last = response.context.last_action;
                this.actions.current = response.context.current;
                this.actions.available = response.context.actions;

                this.requestID = response.request_id; //request_id
                this.sessionID = response.session_id; //session_id

                this.protocolService.setAvailableActions(response.context.actions);
                this.protocolService.setCurrentAction(response.context.current);
                this.protocolService.setLastAction(response.context.last_action);

                if(response.context.spins){
                    this.protocolService.setSpinsReelsData(response.context.spins);
                }

                if(response.context.freespins){
                    this.protocolService.setFreeSpinsReelsData(response.context.freespins);
                }

                if(response.context.bonus){
                    this.bonusService.setBonusContext(response.context.bonus);
                }

                if(response.context.respins){
                    this.protocolService.setReSpinsReelsData(response.context.respins);
                }

                this.protocolService.setUserData(response.user);

                this.protocolService.setFreeBets(response.freebet);

                //console.debug ("protocol update start action", response.settings.bets, response.settings.paylines);

                this.betService.setBetRange(response.settings.bets);
                this.betService.updateFromProtocol();

                this.linesService.setLinesRange(response.settings.lines);
                this.linesService.setPayLines(response.settings.paylines);
                this.linesService.updateFromProtocol();

                this.linesService.setToZeroCounter(); // zero counter line

                this.slotService.setColumns(response.settings.cols);
                this.slotService.setRows(response.settings.rows);
                this.slotService.setDefaultSymbols(response.settings.symbols);
                this.slotService.setReelSamples(response.settings.reelsamples);

                this.payTableService.setPayTable(response.settings.paytable);

                this.bonusService.setBonusSettings(response.settings.bonus);

                if(this.protocolService.hasFreeBets()){

                } else {

                    if ($_signal_history.find("reels.autoSpins.stopAnimation") > 0 ) {
                        this.getService("AutoPlayService").suspend();
                    }
                }


                resolve();
            },
            () => {
                reject();
            }
        );
    }

    /**
     * Check free bets
     * @param inc
     * @returns {null}
     */
    checkFreeBets(inc = false){

        if(this.protocolService.hasFreeBets()){

            let freebets = this.protocolService.getFreeBets();

            if(freebets === undefined ||freebets.left_spins === undefined){
                return null;
            }

            $_signal.goTo("-control.freebets.change",
                freebets.bet_per_line,
                (inc && freebets.left_spins > 0 ? freebets.left_spins - 1 : freebets.left_spins),
                freebets.lines,
                freebets.total_bet,
                freebets.total_spins,
                freebets.total_win
            );
        }
    }

    removeFreeBets(){

        alert("BreeBets was deleted");
    }

};

