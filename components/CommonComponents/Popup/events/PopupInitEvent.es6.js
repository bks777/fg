import Events from "../../../../bower_components/html5-game-kernel/interfaces/events/Events.es6.js";

/**
 * Popup Event manager
 * @constructor
 */
export default class PopupInitEvent extends Events {

    constructor(data = {}) {
        super(data);
    }

    run() {
        this.handler = this.getHandler();//this.getInst('PopupViewHandler');
        this.controller = this.getController();//this.getInst('PopupController');

        //this.setSubscriber('initGame');
        this.setSubscriber("showSystemErrorPopup");
        this.setSubscriber("showSystemInfoPopup");
        this.setSubscriber("showGameInfoPopup");
        this.setSubscriber("showCustomPopup");
        this.setSubscriber("hideCustomPopup");

        this.setSubscriber('preloaderFinishedLoading');

        this.setSubscriber("showPopupBonusStart");

        this.setSubscriber("showPopupFreeSpinsStart");
        this.setSubscriber("showPopupFreeSpinsAdditional");
        this.setSubscriber("showPopupFreeSpinsFinish");

        this.setSubscriber("showPopupAutoSpinFinish");

        this.setSubscriber("verticalMode");
        this.setSubscriber("horizontalMode");

        this.setSubscriber("resize");

        this.setSubscriber("clearBlockAction");

        this.ready = false;
        this._lastSystemInfo = null;

        this.subscribeErrors = {};
    }

    /**
     * Add errors for preloading
     * @param name
     * @param context
     * @param method
     * @param _arguments
     */
    addErrorsToSubscribe(name, context, method, _arguments){
        this.subscribeErrors[name] = [context, method, _arguments];
    }

    /**
     * Remove errors from subscribe
     * @param name
     */
    removeErrorsFromSubscribe(name){
        if(this.subscribeErrors[name] !== undefined){
            delete this.subscribeErrors[name];
        }
    }

    /**
     * Dispatch subscribe events
     */
    dispatchSubscribeErrors(){
        if(Object.keys(this.subscribeErrors).length == 0){
            return ;
        }

        for(let key in this.subscribeErrors){
            let [context, method, _arguments] = this.subscribeErrors[key];

            context[method].apply(context, _arguments);
        }

        this.subscribeErrors = {};
    }


    horizontalModeEvent () {
        setTimeout (() => {
            this.handler.updateBlur();
        },0);
    }


    verticalModeEvent () {
        setTimeout (() => {
            this.handler.updateBlur();
        },0);
    }


    preloaderFinishedLoadingEvent(){

        this.ready = true;

        if(this._lastSystemInfo !== null){
            let [name, data] = this._lastSystemInfo;

            this[name](data);
            this._lastSystemInfo = null;
        }

        this.dispatchSubscribeErrors();
    }


    /**
     * Init Game
     */
   /* initGameEvent () {
        this.handler.initHandler();
        this.controller.initController();
    }*/

    showSystemInfoPopupEvent (data) {

        if(this.ready === false){
            this._lastSystemInfo = ["showSystemInfoPopupEvent", data];
            return ;
        }

        this.handler.showSystemInfoPopup(data);
    }

    /**
     * Show system errors
     * @param data
     */
    showSystemErrorPopupEvent (data) {
        if(this.ready === false){
            this._lastSystemInfo = ["showSystemErrorPopupEvent", data];
            return ;
        }

        this.handler.showSystemErrorPopup(data);
    }

    showGameInfoPopupEvent (data) {
        if(this.ready === false){
            this._lastSystemInfo = ["showGameInfoPopupEvent", data];
            return ;
        }

        this.handler.showGameInfoPopup(data);
    }

    showCustomPopupEvent (data) {
        if(this.ready === false){
            this._lastSystemInfo = ["showCustomPopupEvent", data];
            return ;
        }

        this.handler.showCustomPopup(data);
    }

    hideCustomPopupEvent (data) {
        if(this.ready === false){
            this._lastSystemInfo = ["hideCustomPopupEvent", data];
            return ;
        }

        this.handler.hideCustomPopup(data);
    }


    /**
     * GAME POPUPS
     */

    /**
     * Show popup for end autoSpins with confirm of retry
     * @param config
     */
    showPopupAutoSpinFinishEvent(config = {}){

        this.handler.querySelector ("message_auto_game_end.winValue").text = config.lastCount.toString();

        this.handler.showGameInfoPopup({
            //message         : $_t.get("auto_game_end_{0}", config.lastCount),
            messageAlias    : "auto_game_end",
            state           : config.state,
            okButtonName    : "ans_no",
            nextButtonName  : "ans_yes",
            OkRetry         : true,
            retryAction     : config.retryFunc
        });
    }

    /**
     * Show popup of bonus start
     */
    showPopupBonusStartEvent(){

        this.getService("SoundService").stopGroup("main");

        if (this.getService("AutoPlayService").isActive() && this.getService("AutoPlayService").isStopOnBonusEnabled()) {
            this.getService("AutoPlayService").stopAutoSpins();
        }

        this.handler.showGameInfoPopup({
            messageAlias    : "bonus_start",
            //message: $_t.get("bonus_popup_start"),
            states: [`protocol.{protocolNextAction}s.nextAction`]
        });

        $_signal.goTo("!settings.toolbar.fastMessage", "fast_bonus_popup_start");
    }

    /**
     * Show popup of freeSpins start
     * @param countFreeSpins
     */
    showPopupFreeSpinsStartEvent(countFreeSpins = 0){
        this.getService("SoundService").stopGroup("main");

        this.handler.querySelector ("message_free_spins_start.winValue").text = countFreeSpins.toString();

        this.handler.showGameInfoPopup({
            messageAlias: "free_spins_start",
            //message: $_t.get("free_spins_start_{0}", countFreeSpins),
            //state  : `protocol.freespin_inits.nextAction`,
            state: "!freespins.game.start",
            okButtonName: "free_spins_ok"
        });

        $_signal.goTo("!settings.toolbar.fastMessage", "fast_freespin_init");
    }

    /**
     * Show popup of additional freeSpins
     * @param countAdd
     */
    showPopupFreeSpinsAdditionalEvent(countAdd = 0){

        this.handler.querySelector ("message_free_spins_add.winValue").text = countAdd.toString();

        this.handler.showGameInfoPopup({
            messageAlias: "free_spins_add",
            //message: $_t.get("free_spins_add_{0}", countAdd),
            state  : `control.freespins.hideAddition`,
            okButtonName: "free_spins_ok"
        });

        $_signal.goTo("!settings.toolbar.fastMessage", "fast_freespin_add");
    }

    /**
     * Show popup of FreeSpins Finished
     * @param amountWin
     * @param state
     */
    showPopupFreeSpinsFinishEvent(amountWin = 0, state = []){
        this.handler.querySelector ("message_free_spins_end.winValue").text = number_format(amountWin / 100, 2, ".", ",").toString();

        this.showGameInfoPopupEvent({
            messageAlias: amountWin > 0 ? "free_spins_end" : "free_spins_end_zero",
            //message: amountWin > 0 ? $_t.get("free_spin_end_{0}", number_format(amountWin / 100, 2, ".", ",")) : $_t.get("free_spin_end_no_win"),
            states  : [state/*, `protocol.spins.init`*/],
            okButtonName: "free_spins_hide"
        });

        $_signal.goTo("!settings.toolbar.fastMessage", "fast_win");
    }

    /**
     * Clear blocked active popup
     */
    clearBlockActionEvent(){
        this.getController().activeGameAction = true;
    }

    resizeEvent(){
        this.getHandler().updateOpenedBlurBg();
    }
}