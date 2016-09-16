import ViewCanvasHandler from "../../../../bower_components/html5-game-kernel/views/interfaces/ViewCanvasHandler.es6";

import config from "./config.js";
import {freeGameControlConfig, mainGameControlConfig, bonusGameControlConfig,
    freeBetsGameControlConfig, freeBetsFreeGameControlConfig, freeBetsBonusGameControlConfig} from "./controlStyles.config";

/**
 * Control View Handler
 * @constructor
 */
export default class ControlDesktopViewHandler extends ViewCanvasHandler {
    constructor(data = {}) {
        super(data);
        this.init(config);

        this.ready = false;
        this.callbackReady = null;

    }


    /**
     * Convert balance
     * @param number
     * @param _with
     * @returns {string}
     */
    _convertBalance (number, _with)
    {
        return number_format(number, (_with === true ? 2 : 0), '.', ' ');
    };

    /**
     * Init Game Control
     */
    initControl ()
    {
        if(this.ready === true){
            return null;
        }

        this.initLayout(config);

        let controller = this.getInst("ControlDesktopController");

        this.initChildren(config.children);

        /**
         * Mouse over event
         */
        const btnMouseOver = () => {
              this.getService("SoundService").play("audio_button_all_onMouseOver");
        };

        /**
         *  Init Event Handlers for control elements
         */
        this.querySelector("spinBtn").addEventListener('click', controller.spinButtonClickAction.bind(controller));
        this.querySelector("spinBtn").addEventListener('mouseover', btnMouseOver);

        //this.querySelector("freeSpinBtn").addEventListener('click', controller.freeButtonClickAction.bind(controller));

        this.querySelector("infoBtn").addEventListener('click', controller.infoButtonClickAction.bind(controller));
        this.querySelector("infoBtn").addEventListener('mouseover', btnMouseOver);

        this.querySelector("maxBetBtn").addEventListener('click', controller.maxBetButtonClickAction.bind(controller));
        this.querySelector("maxBetBtn").addEventListener('mouseover', btnMouseOver);

        this.querySelector("autoPlayBtn").addEventListener('click', controller.autoPlayButtonClickAction.bind(controller));
        this.querySelector("autoPlayBtn").addEventListener('mouseover', btnMouseOver);

        this.querySelector("autoStopBtn").addEventListener('click', controller.autoStopButtonClickAction.bind(controller));
        this.querySelector("autoStopBtn").addEventListener('mouseover', btnMouseOver);

        this.querySelector("containerOfQuickSpin.background").addEventListener('click', controller.quickSpinBackgroundClickAction.bind(controller));
        this.querySelector("containerOfQuickSpin").addEventListener('mouseover', (e)=>{
            if(e.target instanceof Button){
                btnMouseOver();
            }
        });

        this.querySelector("containerOfQuickSpin.onBtn").addEventListener('click', controller.quickSpinOnButtonClickAction.bind(controller));
        this.querySelector("containerOfQuickSpin.offBtn").addEventListener('click', controller.quickSpinOffButtonClickAction.bind(controller));

        this.querySelector("decBetBtn").addEventListener('click', controller.decBetButtonClickAction.bind(controller));
        this.querySelector("decBetBtn").addEventListener('mouseover', btnMouseOver);

        this.querySelector("incBetBtn").addEventListener('click', controller.incBetButtonClickAction.bind(controller));
        this.querySelector("incBetBtn").addEventListener('mouseover', btnMouseOver);

        this.querySelector("decLinesBtn").addEventListener('click', controller.decLinesButtonClickAction.bind(controller));
        this.querySelector("decLinesBtn").addEventListener('mouseover', btnMouseOver);

        this.querySelector("incLinesBtn").addEventListener('click', controller.incLinesButtonClickAction.bind(controller));
        this.querySelector("incLinesBtn").addEventListener('mouseover', btnMouseOver);

        this.querySelector("advancedSettingsContainer").addEventListener('click', controller.advancedSettingsContainerClickAction.bind(controller));

        for(let _i = 1, _l = 8; _i <= _l; _i++){
            this.querySelector(`autoPlayValueContainer${_i}`).addEventListener('click', () => {controller.autoPlayValueContainerClickAction(_i)});
        }

        this.querySelector("onAnyWinCheckBox").addEventListener("click", (e) => {
            if (e.target.checked) {
                this.getService("AutoPlayService").enableStopOnAnyWin();
            } else {
                this.getService("AutoPlayService").disableStopOnAnyWin();
            }
        });

        this.querySelector("ifFreeWavesIsWonCheckBox").addEventListener("click", (e) => {
            if (e.target.checked) {
                this.getService("AutoPlayService").enableStopOnFreeGame();
            } else {
                this.getService("AutoPlayService").disableStopOnFreeGame();
            }
        });

        this.querySelector("ifBonusIsWonCheckBox").addEventListener("click", (e) => {
            if (e.target.checked) {
                //this.getService("AutoPlayService").enableStopOnBonus();
            } else {
                //this.getService("AutoPlayService").disableStopOnBonus();
            }
        });

        let targets = [ {
                checkBox: "ifSingleWinExceedsCheckBox",
                input: "ifSingleWinExceedsCurrency.valueContainer",
                enable: this.getService("AutoPlayService").enableStopIfWinExceed,
                disable: this.getService("AutoPlayService").disableStopIfWinExceed
            },
            {
                checkBox: "ifCashIncreasesByCheckBox",
                input: "ifCacheIncreasesByCurrency.valueContainer",
                enable: this.getService("AutoPlayService").enableStopIfCashIncrease,
                disable: this.getService("AutoPlayService").disableStopIfCashIncrease
            },
            {
                checkBox: "ifCashDecreasesByCheckBox",
                input: "ifCacheDecreasesByCurrency.valueContainer",
                enable: this.getService("AutoPlayService").enableStopIfCashDecrease,
                disable: this.getService("AutoPlayService").disableStopIfCashDecrease
            }
        ];

        for (let target in targets) {
            let inputContainer = this.querySelector(targets[target].input);
            let checkBox = this.querySelector(targets[target].checkBox);
            let enable = targets[target].enable;
            let disable = targets[target].disable;
            let prevLength;

            checkBox.addEventListener("click", () => {
                if (checkBox.checked) {
                    inputContainer.input.focus();

                    if (inputContainer.value.length > 0) {
                        enable(inputContainer.value);
                    }
                } else {
                    disable();
                }
            });

            inputContainer.onlyNumber = true;

            inputContainer.input.onkeyup(() => {
                if (inputContainer.value.length > 0) {
                    enable(inputContainer.value);
                    checkBox.checked = true;
                } else {
                    if (prevLength === 0) {
                        return;
                    }
                    disable();
                    checkBox.checked = false;
                }
            });
            inputContainer.input.onkeydown(() => {
                prevLength = inputContainer.value.length;
                //console.debug ("keydown", inputContainer.value.length);
                //checkBox.checked = (inputContainer.value.length > 0);
            });
        }

        this.checkDefaultStateKeys();
        this.checkDefaultStateLabels();

        this.ready = true;

        if(this.callbackReady !== null){
            this.callbackReady();
        }

        //this.cacheLayout();

        this.getLayout().visible = false;

    };

    /**
     * Check default state of control keys
     */
    checkDefaultStateKeys (){
        this.checkDefaultStatesBetBlock();
        this.checkDefaultStateLineBlock();
    }

    /**
     * Check default state of labels
     */
    checkDefaultStateLabels (){
        this.changeTotalBetValue();
        this.changeTotalWinValue();
        this.changeWinValue(null);
        this.changeBalanceValue();
    }

    initControlEventHandlers () {

    }

    showQuickSpinOnButton () {
        let target = this.querySelector("containerOfQuickSpin.onBtn");
        target.visible = true;
        this.requestUpdateTarget(target);
    }

    hideQuickSpinOnButton () {
        let target = this.querySelector("containerOfQuickSpin.onBtn");
        target.visible = false;
        this.requestUpdateTarget(target);
    }

    showQuickSpinOffButton () {
        let target = this.querySelector("containerOfQuickSpin.offBtn");
        target.visible = true;
        this.requestUpdateTarget(target);
    }

    hideQuickSpinOffButton () {
        let target = this.querySelector("containerOfQuickSpin.offBtn");
        target.visible = false;
        this.requestUpdateTarget(target);
    }

    showAutoPlayButton () {
        let target = this.querySelector("containerOfAutoPlay");
        target.visible = true;
        this.requestUpdateTarget(target);
    }

    hideAutoPlayButton () {
        let target = this.querySelector("containerOfAutoPlay");
        target.visible = false;
        this.requestUpdateTarget(target);
    }

    showAutoStopButton () {
        let target = this.querySelector("containerOfAutoStop");
        target.visible = true;
        this.requestUpdateTarget(target);
    }

    hideAutoStopButton () {
        let target = this.querySelector("containerOfAutoStop");
        target.visible = false;
        this.requestUpdateTarget(target);
    }

    showSpinButton (){
        let target = this.querySelector("spinBtn");
        target.visible = true;
        this.requestUpdateTarget(target);
    }

    hideSpinButton () {
        let target = this.querySelector("spinBtn");
        target.visible = false;
        this.requestUpdateTarget(target);
    }

    showFreeGameControls () {
        this.applyStyle(freeGameControlConfig);

        //let spinBtn = this.querySelector("spinBtn");
        //spinBtn.helper.downLable = spinBtn.helper.outLabel;
    }

    showMainGameControls () {
        this.applyStyle(mainGameControlConfig);

        this.getLayout().visible = true;

        this.checkDefaultStateLabels();

        if(this.getService("ProtocolService").hasFreeBets()){
            this.showFreeBetsGameControls();

            $_signal.goTo("!settings.toolbar.staticFreeBetMessage", this.getService("ProtocolService").getFreeBetsLeft());
        }

        //let spinBtn = this.querySelector("spinBtn");
        //spinBtn.helper.downLable = "clicked";
    }

    /**
     * Show free bets game controll
     */
    showFreeBetsGameControls(){
        this.applyStyle(freeBetsGameControlConfig);

        this.changeWinFreeBets(0);
    }

    showBonusGameControl () {
        this.applyStyle(bonusGameControlConfig);

        this.getLayout().visible = true;
    }

    showAutoPlayCounter () {
        this.changeAutoPlayValue();
        let target = this.querySelector("autoPlayCounterContainer");
        target.visible = true;
        this.requestUpdateTarget(target);
    }

    hideAutoPlayCounter () {
        let target = this.querySelector("autoPlayCounterContainer");
        target.visible = false;
        this.requestUpdateTarget(target);
    }

    hideAutoPlayInterface () {
        this.hideAutoPlayCounter();
        this.showAutoPlayButton();
        this.hideAutoStopButton();
    }

    stageAutoPlayClickHandler (e) {
        if (!this.closest(e.target, "autoPlaySettingsContainer") && !this.closest(e.target, "autoPlayAdvancedSettingsContainer")) {
            this.hideAutoPlaySettings () ;
            this.hideAdvancedAutoPlaySettings();
            this.getStage().removeEventListener ("click", this.stageAutoPlayClickHandler);
        }
    }

    showAutoPlaySettings () {
        let target = this.querySelector("autoPlaySettingsContainer");
        target.visible = true;
        this.requestUpdateTarget(target);

        setTimeout( () => {
            this.autoPlayListener = this.getStage().on ("click", this.stageAutoPlayClickHandler.bind(this));
        },0);
    }

    hideAutoPlaySettings () {
        let target = this.querySelector("autoPlaySettingsContainer");
        target.visible = false;
        this.requestUpdateTarget(target);

        let target2 = this.querySelector("autoPlayAdvancedSettingsContainer");
        if (target2.visible) {
            target2.visible = false;
            this.requestUpdateTarget(target2);
        }

        if (this.autoPlayListener) {
            this.getStage().off ("click", this.autoPlayListener);
        }
    }

    toggleVisibilityAutoPlaySettings () {
        let target = this.querySelector("autoPlaySettingsContainer");

        if (target.visible) {
            this.hideAutoPlaySettings();
        } else {
            this.showAutoPlaySettings();
        }
    }

    showAdvancedAutoPlaySettings () {
        let target = this.querySelector("autoPlayAdvancedSettingsContainer");
        target.visible = true;
        this.requestUpdateTarget(target);
    }

    hideAdvancedAutoPlaySettings () {
        let target = this.querySelector("autoPlayAdvancedSettingsContainer");
        target.visible = false;
        this.requestUpdateTarget(target);
    }

    toggleVisibilityAdvancedAutoPlaySettings () {
        let target = this.querySelector("autoPlayAdvancedSettingsContainer");
        target.visible = !target.visible;
        this.requestUpdateTarget(target);
    }

    setAutoPlayRangeSettingsValue (autoPlayRange = []) {
        for (let i = 0; i < 8; i ++) {
            if (autoPlayRange[i]) {
                this.querySelector(`autoPlayValueContainer${i+1}.autoPlayValue`).setText(autoPlayRange[i]);
            }
        }
        this.requestUpdate();
    }

    setAutoPlayCounterValue (value) {
        this.querySelector(`autoPlayCounterContainer.autoPlayValue`).setText(value);
        this.requestUpdate();
    }

    getAutoPlayValueContainer (containerNumber) {
        return this.querySelector(`autoPlayValueContainer${containerNumber}.autoPlayValue`).text;
    }

    changeAutoPlayValue (value = this.getService("AutoPlayService").getCurrentValue()) {
        let autoPlayValue = this.querySelector(`autoPlayCounterContainer.autoPlayValue`);
        if (value === -2) {
            value = $_t.decodeCharCodeToString(8734);
            autoPlayValue.font = "bold 28px Calibri"
        } else {
            autoPlayValue.font = "bold 14px Calibri"
        }
        autoPlayValue.setText(value);
        this.requestUpdate();
    }

    /**
     * Change total win value
     */
    changeTotalWinValue () {

        if(this.getService('ProtocolService').getNextAction() == "freespin_init"){
            this.querySelector("totalWinValue").setText("");
        } else
        if(["freespins","freespin"].indexOf(this.getService('ProtocolService').getCurrentAction()) != -1){

            let totalWin = this.getService('FreeSpinService').getTotalWin();

            this.querySelector("totalWinValue").setText(totalWin ? number_format(totalWin / 100, 2, ".", ",") + " " +
                this.getService("ProtocolService").getCurrentCurrency() : "");
        } else {
            this.querySelector("totalWinValue").setText(number_format(0, 2, ".", ",") + " " +
                this.getService("ProtocolService").getCurrentCurrency());
        }
        this.requestUpdate();
    }

    /**
     * Add win value (for respin)
     * @param value
     */
    addWinValue (value = this.getService("ProtocolService").getCurrentWin()) {

        let prevValue = (this.querySelector("winValue").text === "" ? 0 : parseFloat(this.querySelector("winValue").text));
        let newValue = prevValue*100 + value;

        this.changeWinValue(newValue);
    }

    /**
     * Change win value
     * @param value
     */
    changeWinValue (value = this.getService("ProtocolService").getCurrentWin()) {
        
        if(value == null || value == 0){
            this.querySelector("winValue").setText("");
        } else {
            this.querySelector("winValue").setText(
                number_format(value / 100, 2, ".", ",") + " " +
                this.getService("ProtocolService").getCurrentCurrency()
            );
        }
        this.requestUpdate();
    }

    /**
     * Change balance value
     * @param value
     */
    changeBalanceValue (value = this.getService("ProtocolService").getCurrentBalance()) {
        this.querySelector("balanceValue").setText(
            number_format(value, 2, ".", ",") + " " +
            this.getService("ProtocolService").getCurrentCurrency()
        );

        if(this.getService("ProtocolService").hasFreeBets()){
            this.changeWinFreeBets();
        }

        this.requestUpdate();
    }

    /**
     * Change balance value before spin
     */
    changeBalanceValueBeforeSpin (){
        this.changeBalanceValue(
            this.getService("ProtocolService").getCurrentBalance() - (
                this.getService("BetService").getCurrentValue() *
                this.getService("LinesService").getCurrentValue()
            ) / 100
        );
        this.requestUpdate();
    }

    setBetValue (value) {
        this.querySelector("betValue").setText(number_format(value / 100, 2, ".", ",") + " " +
            this.getService("ProtocolService").getCurrentCurrency());
        this.querySelector("betBonusValue").setText(number_format(value / 100, 2, ".", ",") + " " +
            this.getService("ProtocolService").getCurrentCurrency());
        this.requestUpdate();
    }

    /**
     * Change total bet value
     */
    changeTotalBetValue () {
        this.querySelector("totalBetValue").setText(number_format(
            (
                (this.getService("BetService").getCurrentValue() / 100 ) *
                this.getService("LinesService").getCurrentValue() *
                this.getService("ProtocolService").getCurrentDenominator()
            ), 2, ".", ",") + " " +
            this.getService("ProtocolService").getCurrentCurrency()
        );
        this.requestUpdate();
    }

    setLinesValue (value) {
        this.querySelector("linesValue").setText(value);
        this.requestUpdate();
    }

    setSpinCounterValue (value) {
        this.querySelector("spinCounter").setText(value);
        this.requestUpdate();
    }

    disableAllButtons () {

        let slotMachine = this.getService("SlotMachineService").getInstance();

        //if (slotMachine.isEnableQuickMode()) {
            //this.querySelector("spinBtn").disabled = true;
        //}

        //this.querySelector("freeSpinBtn").disabled = true;
        this.querySelector("infoBtn").disabled = true;
        this.querySelector("maxBetBtn").disabled = true;
        this.querySelector("autoPlayBtn").disabled = true;
        this.querySelector("decBetBtn").disabled = true;
        this.querySelector("incBetBtn").disabled = true;
        this.querySelector("decLinesBtn").disabled = true;
        this.querySelector("incLinesBtn").disabled = true;

        //this._disableBetButtons();
        this.requestUpdate();
    }

    enableAllButtons () {

        if(this.getService("ProtocolService").getNextAction() !== "spin" && $_signal_history.getLast().alias != "protocol.spins.init"){
            return ;
        }

        if (!this.getFlagGlobal("freeSpinsEnabled")) {
            this.querySelector("infoBtn").disabled = false;
        }

        this.querySelector("maxBetBtn").disabled = false;
        this.querySelector("autoPlayBtn").disabled = false;
        /**
         * Has freeBets
         */
        if(this.getService("ProtocolService").hasFreeBets()){

            this.querySelector("maxBetBtn").disabled = true;

        } else {
            //we have no need to call this here anymore
            this.checkDefaultStatesBetBlock();
            this.checkDefaultStateLineBlock();
        }

        this.requestUpdate();
    }

    /**
     * Enable Spin button
     */
    enableSpinButton(){
        this.querySelector("spinBtn").disabled = false;
    }

    /**
     * Disabled spin button
     */
    disabledSpinButton(){
        this.querySelector("spinBtn").disabled = true;
    }

    /**
     * CHANGE BET
     */

    /**
     * Check default states of keys
     */
    checkDefaultStatesBetBlock (){

        if (!this.querySelector("decBetBtn").visible) {
            return;
        }

        if (this.getService('BetService').checkBackward() === true) {
            this.querySelector("decBetBtn").disabled = false;
        } else {
            this.querySelector("decBetBtn").disabled = true;
        }

        if (this.getService('BetService').checkForward() === true) {
            this.querySelector("incBetBtn").disabled = false;
        } else {
            this.querySelector("incBetBtn").disabled = true;
        }
        this.setBetValue(this.getService("BetService").getCurrentValue());

        this.changeTotalBetValue();
        this.requestUpdate();

    }

    /**
     * Change bet to backward
     */
    changeDecBetButton(){
        if(this.getService('BetService').changeToBackward()){
            this.checkDefaultStatesBetBlock();
        }
        this.requestUpdate();
    }

    /**
     * Change bet to forward
     */
    changeIncBetButton (){
        if(this.getService('BetService').changeToForward()){
            this.checkDefaultStatesBetBlock();
        }
        this.requestUpdate();
    }

    /**
     * CHANGE LINES
     */

    /**
     * Check default states line block
     */
    checkDefaultStateLineBlock (){
        if (!this.querySelector("decLinesBtn").visible) {
            return;
        }

        if(this.getService('LinesService').checkBackward() === true) {
            this.querySelector("decLinesBtn").disabled = false;
        } else {
            this.querySelector("decLinesBtn").disabled = true;
        }

        if(this.getService('LinesService').checkForward() === true) {
            this.querySelector("incLinesBtn").disabled = false;
        } else {
            this.querySelector("incLinesBtn").disabled = true;
        }

        this.setLinesValue(this.getService("LinesService").getCurrentValue());

        this.changeTotalBetValue();
        this.requestUpdate();
    }


    /**
     * Change lines to backward
     */
    changeDecLineButton(){
        if(this.getService('LinesService').changeToBackward()){
            this.checkDefaultStateLineBlock();
        }
        this.requestUpdate();
    }

    /**
     * Change lines to forward
     */
    changeIncLineButton(){
        if(this.getService('LinesService').changeToForward()){
            this.checkDefaultStateLineBlock();
        }
        this.requestUpdate();
    }

    /**
     * Change to MAX BET
     */
    changeToMaxBet (){
        this.getService("BetService").changeToMaxValue();
        this.getService("LinesService").changeToMaxValue();
        this.checkDefaultStateKeys();
        this.requestUpdate();
    }

    /**
     * Change free counter before spin (decrement on 1)
     */
    changeFreeCounterBeforeSpin () {
        this.setSpinCounterValue(this.getService("FreeSpinService").getFreeSpinLeft() - 1);
    }


    /**
     * FREE SPINS
     */

    /**
     * Show freeSpin panel
     */
    showFreePanel (){

        if(this.ready === false){
            this.callbackReady = this.showFreePanel;
        } else {
            this.showFreeGameControls();
            this.setSpinCounterValue(this.getService("FreeSpinService").getFreeSpinLeft());
            this.changeTotalBetValue();

            if(this.getService("ProtocolService").hasFreeBets()){
                this.applyStyle(freeBetsFreeGameControlConfig);
            }
        }

        this.getLayout().visible = true;

    }

    /**
     * Hide freeSpin panel
     */
    hideFreePanel (){
        //this.getInst("ControlDesktopController").checkFreeSpinEnd();
        this.showMainGameControls();
    }

    /**
     * Show bonus panel
     */
    showBonusPanel () {
        this.showBonusGameControl();

        let data = this.getService("BonusService").getBonusContext();

        if(data !== null){
            this.querySelector("betBonusValue").setText(data.round_bet / 100 + " " +
                this.getService("ProtocolService").getCurrentCurrency());
            this.querySelector("totalWinValue").setText(data.total_win / 100 + " " +
                this.getService("ProtocolService").getCurrentCurrency());
        }

        if(this.getService("ProtocolService").hasFreeBets()){
            this.applyStyle(freeBetsBonusGameControlConfig);
        }
    }

    /**
     * Hide freeSpin panel
     */
    hideBonusPanel (){
        this.showMainGameControls();
    }

    /**
     * Show free bets panel
     * @param count
     */
    initFreeBets(count){
        this.getService("PopupService").addInfoPopup("freebets", {message: $_t.getText("free_bets_start", count), header: $_t.getText("free_bets_head")});
    }

    /**
     * Hide free bets panel
     */
    hideFreeBets(){

        let lastFreeBets = this.getService("ProtocolService").getFreeBets();

        this.getService("PopupService").removeInfoPopup("freebets");

        setTimeout(()=>{

            if(lastFreeBets && lastFreeBets.status == "finished"){
                this.getService("PopupService").addInfoPopup("freebets", {message: lastFreeBets.total_win > 0 ? $_t.getText("free_bets_end_{0}", number_format(lastFreeBets.total_win / 100, 2, ".", ",")) : $_t.getText("free_bets_end_no_win"), header: $_t.getText("free_bets_head")});
            } else {
                this.getService("PopupService").addInfoPopup("freebets", {message: $_t.getText("free_bets_deleted"), header: $_t.getText("free_bets_head")});
            }

            this.getService("ProtocolService").setFreeBets({status: "deleted"});
            $_stateMachine.router.restartGame = true;

            $_stateMachine.goToRouter();
        }, 50);
    }

    /**
     * Change win free bets
     * @param value
     */
    changeWinFreeBets(value = 0){

        let data = this.getService("ProtocolService").getFreeBets();

        if(data && data.total_win){
            value = data.total_win;
        }

        this.querySelector("containerOfFreeBetWins.balanceValue").setText(number_format(value / 100, 2, ".", ",") + " " +
            this.getService("ProtocolService").getCurrentCurrency());
    }

};
