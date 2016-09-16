import Events from "../../../../bower_components/html5-game-kernel/interfaces/events/Events.es6.js";

/**
 * Control Event manager
 * @constructor
 */
export default class ControlDesktopEvent extends Events {

    constructor(data = {}){
        super(data);

        this._dataControllInit = false;
        this._dataInitGame = false;

        this._controlInit = false;

        this.keySpinActive = false;
        this.callbackActiveFast = null;

        this._endAnimationReel = false;

        this._protocolData = {};
    }

    run () {
        this._handler = this.getInst('ControlDesktopViewHandler');
        this._controller = this.getInst('ControlDesktopController');

        //this.setSubscriber('initGame');

        this.setSubscriber('protocolReady');
        //this.setSubscriber('spinAction');
        this.setSubscriber('spinResult');
        this.setSubscriber('endAnimationReels');
        this.setSubscriber('keysDisabled');

        this.setSubscriber('frameReelsInit');

        this.setSubscriber('toMatchBetToBalance');
        this.setSubscriber('toMatchBetToBalanceHide');

        this.setSubscriber('readyToSpin');

        this.setSubscriber('startDoubleResult');
        this.setSubscriber('sendGetDoubleGame');
        this.setSubscriber('setWinningCount');
        this.setSubscriber('hideDoubleGame');
        this.setSubscriber('playDoubleResult');

        this.setSubscriber('setWinBlock');

        this.setSubscriber('hideKeys');
        this.setSubscriber('setKeys');

        this.setSubscriber('startFreeGame');
        this.setSubscriber('showKeyStartFreeGame');
        this.setSubscriber('showKeyEndFreeGame');
        this.setSubscriber('hideKeyFreeGame');

        this.setSubscriber('clickSpinAction');

        this.setSubscriber('enableTurboMode');
        this.setSubscriber('disableTurboMode');

        this.setSubscriber('enableAutoMode');
        this.setSubscriber('stopAutoMode');
        this.setSubscriber('setPauseAutoMode');
        this.setSubscriber('resumePauseAutoMode');
        this.setSubscriber('resumeAutoSpin');
    };

    /**
     * Init Game
     */
    initGameEvent () {
        //this._handler.initControl();
        //this._controller.initController();
        /*if(this._controlInit === false){
            this._controlInit = true;
            this.getInst('ControlDesktopViewHandler').initControl();

            if(this.keySpinActive === false){
                this.getInst('ControlDesktopViewHandler').hideAllButton();
            }
        }

        if(this._dataControllInit !== true){
            this._dataInitGame = true;
        }*/

    };

    /**
     * Frame reels is load
     */
    frameReelsInitEvent () {

        if(this._controlInit === true && this.keySpinActive !== true){
            this.getInst('ControlDesktopViewHandler').showAllButton();
            this.getInst('ControlDesktopViewHandler').unDisabledSpinKey();

            if(this.callbackActiveFast !== null && typeof this.callbackActiveFast == 'function'){
                this.callbackActiveFast();
                this.callbackActiveFast = null;
            }
        }

        this._canvas = document.getElementById('canvas_cl');

        this.keySpinActive = true;
    };

    /**
     * Protocol Ready
     * @param data
     */
    protocolReadyEvent (data) {
        this.getInst('ControlDesktopViewHandler').initBalance(data);
    };

    /**
     * Spin Action
     */
    spinActionEvent () {

        this._endAnimationReel = false;

        if(this.getInst('ControlDesktopViewHandler')._balance <= 0){
            setTimeout(function(){
                $_event.setEvent('zeroBalance');
            }, 1000);

        }

        this.getInst('ControlDesktopViewHandler').hideAllButton();
        this.getInst('ControlDesktopViewHandler').hideWinBlock();

        this.getInst('ControlDesktopViewHandler').totalWinBlock(0, null);

        this.getInst('ControlDesktopViewHandler').getBetFromBalance();
    };

    /**
     * Show keys
     */
    spinResultEvent (data = {}) {
        this._protocolData = data;
        //this.getInst('ControlDesktopViewHandler').showAllButton();
    };

    /**
     * Keys disable
     */
    keysDisabledEvent () {
        this.getInst('ControlDesktopViewHandler').hideAllButton();
    };

    /**
     * Show data after animate reels
     * @param data
     */
    endAnimationReelsEvent (data = {}) {
        this._protocolData = data;

        this.keySpinActive = true;
        this._endAnimationReel = true;

        this.getInst('ControlDesktopViewHandler').showAllButton();
        this.getInst('ControlDesktopViewHandler').initBalance(data);

        this.getInst('ControlDesktopController').checkMatchBetToBalance();

        if(typeof data.winning != 'undefined'){
            this.getInst('ControlDesktopViewHandler').totalWinBlock(data.winning, data.balance);
        }

        if(typeof data.winnings != 'undefined' && data.winnings != null){

            if(data.winnings.total > 0){
                this.getInst('ControlDesktopViewHandler').totalWinBlock(data.winnings.total, data.balance);
                this.getInst('ControlDesktopViewHandler').winBlock(data.winnings.total);

            } else {
                this.resumeAutoSpinEvent();
            }
        } else if(data.winnings == null && data.balance > 0){
            this.resumeAutoSpinEvent();
        }

    };

    /**
     * Set winning count balance
     * @param count
     */
    setWinningCountEvent (count = 0) {
        //this.getInst('ControlDesktopViewHandler').winBlock(count);
    };

    /**
     * Set win block for other games
     * @param count
     */
    setWinBlockEvent (count = 0) {
        var _iv = this.getInst('ControlDesktopViewHandler');

        if(count > 0){
            _iv.winBlock(count);
        } else {
            _iv.hideWinBlock();
        }
    };

    /**
     * Ready to spin with show available key Spin
     * @param data
     */
    readyToSpinEvent (data = {}) {

        this._protocolData = data;

        this.getInst('ControlDesktopViewHandler').initBalance(data);

        if(this.keySpinActive === true){
            this.getInst('ControlDesktopViewHandler').unDisabledSpinKey();
        }

        this.getInst('ControlDesktopController').init({
            bet             : data.bet,
            denomination    : data.denomination,
            lines           : data.lines,
            ranges          : data.ranges
        });

        this._dataControllInit = true;

        if(this._dataInitGame === true){
            this.getInst('ControlDesktopViewHandler').initControl();
        }
    };

    sendGetDoubleGameEvent () {
        this._openDouble = true;

        var _h = this.getInst('ControlDesktopViewHandler');
        _h._doubleKey.setBlocked();
        _h._betKey.setBlocked();
    };

    /**
     * Start double game
     */
    startDoubleResultEvent () {
        $_event.setEvent('stopAutoMode');
    };

    /**
     * Show data from double
     * @param data
     */
    playDoubleResultEvent (data = {}) {
        this._protocolData = data;
    };

    /**
     * Hide double key button
     */
    hideDoubleGameEvent (_win = 0) {

        var _h = this.getInst('ControlDesktopViewHandler');

        _h.initBalance(this._protocolData);
        _h.winBlock(this._protocolData.winnings.total);
        _h.totalWinBlock(0, this._protocolData.balance);
        _h.hideDoubleButton();
        _h._doubleAction = false;

        this._openDouble = false;

        this.setWinBlockEvent(parseInt(_win));

        if(this.getInst('ControlDesktopController')._activeAutoMode === false){
            _h._betKey.setUnBlocked();
        }

        this.getInst('ControlDesktopController').checkMatchBetToBalance(_win);
    };

    /**
     * Hide all keys
     */
    hideKeysEvent () {
        this.getInst('ControlDesktopViewHandler').hideAllButton();
    };

    /**
     * Show all keys
     */
    showKeysEvent () {
        this.getInst('ControlDesktopViewHandler').showAllButton();
    };

    /**
     * Set to control that a freegame start
     */
    startFreeGameEvent () {
        this.getInst('ControlDesktopViewHandler')._freeGameStartFlag = true;
        this.getInst('ControlDesktopViewHandler').startFreeGameBlock();
    };

    /**
     * Start free game
     */
    showKeyStartFreeGameEvent () {
        this.getInst('ControlDesktopViewHandler').showKeyStartFreeGame();
    };

    /**
     * End free game
     */
    showKeyEndFreeGameEvent () {
        this.getInst('ControlDesktopViewHandler').showKeyEndFreeGame();
    };

    /**
     * Hide free game
     * @param addToCache
     */
    hideKeyFreeGameEvent (addToCache) {

        if(addToCache !== false){
            this.getInst('ControlDesktopViewHandler').winBlock(this._protocolData.winnings.free_spins.all_winning);
            this.getInst('ControlDesktopViewHandler').totalWinBlock(0, this._protocolData.balance);
        }

        this.getInst('ControlDesktopViewHandler').hideKeyFreeGame(addToCache);
    };

    /**
     * Click Spin Action Event
     */
    clickSpinActionEvent () {
        this.getInst('ControlDesktopController').clickSpinAction();
    };

    /**
     * To match bet by balance Show
     */
    toMatchBetToBalanceEvent () {
        this.getInst('ControlDesktopViewHandler').toMatchBetToBalanceShow();
    };

    /**
     * To match bet by balance Hide
     */
    toMatchBetToBalanceHideEvent () {
        this.getInst('ControlDesktopViewHandler').toMatchBetToBalanceHide();
    };

    /**
     * Turbo Mode
     */

    /**
     * Enable Turbo mode
     */
    enableTurboModeEvent () {

        if(this._controlInit === true){
            this.getInst('ControlDesktopController').enableTurboMode();
        } else {
            this.callbackActiveFast = function(){
                this.getInst('ControlDesktopController').enableTurboMode();
            }.bind(this);
        }
    };

    /**
     * Disable Turbo mode
     */
    disableTurboModeEvent () {
        this.getInst('ControlDesktopController').disableTurboMode();
    };

    /**
     * Start Auto mode
     */
    enableAutoModeEvent () {
        this.getInst('ControlDesktopController').startAutoMode();
    };

    /**
     * Stop Auto mode
     */
    stopAutoModeEvent () {
        this.getInst('ControlDesktopController').stopAutoMode();
    };

    /**
     * Resume Turbo Spin Action
     */
    resumeAutoSpinEvent () {
        this.getInst('ControlDesktopController').resumeAutoSpin();
    };

    /**
     * Set pause auto mode
     */
    setPauseAutoModeEvent () {
        this.getInst('ControlDesktopController').setPauseAutoSpin();
    };

    /**
     * Resume pause auto mode
     */
    resumePauseAutoModeEvent () {
        this.getInst('ControlDesktopController')._pauseAutoMode = false;
        this.resumeAutoSpinEvent();
    };

}


