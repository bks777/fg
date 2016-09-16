import ViewCanvasHandler from "../../../../bower_components/html5-game-kernel/views/interfaces/ViewCanvasHandler.es6";

import config from "./config.js";
import verticalConfig from "./vertical";
import horizontalConfig from "./horizontal";

import paytableAtlasSpriteSheet from "../../../DesktopComponents/Paytable/viewHandler/paytableAtlasSpriteSheet";
import {numbersSmallSpriteSheet} from "../../../CommonComponents/BonusGame/viewHandler/elements/numbersSpriteSheet.js"

/**
 * Control View Handler
 * @constructor
 */
export default class ControlMobileViewHandler extends ViewCanvasHandler {
    constructor(data = {}) {

        super(data);

        this.config = config;

        this.init(this.config);

        this.ready = false;
        this.callbackReady = null;

        this.controller = null;

        this.spinButton = null;
        this.spinButtonContainer = null;
        this.spinStatePlay = null;

        this.gameSoundSlider = null;
        this.gameEffectsSlider = null;
        this.gameQuickSpinSlider = null;
        this.gameAutoPlaySlider = null;

        this.betSlider = null;
        this.linesSlider = null;

        this.lastChooseSettingMenu = null;
        this.activeMenu = {};

        this.panelButtons = {};

        this.quickSpinEnable = false;
        this.autoSpinActive = false;

        this.freeSpinActivePanel = false;
        this.bonusActivePanel = false;

        this.settingsOpened = false;

        this.inc = 1;

        this.beforeHorizontalPosition = true;

        this.autoPLayRange = [10, 25, 50, 100, 200, 500, -2];
        this._autoInfinite = $_t.decodeCharCodeToString(8734);

        this.controller = this.getInst("ControlMobileController");
        this.isInit = true;
        this.isFreeBets = false;

    }

    addWinValue() {
    }

    /**
     * Convert balance
     * @param number
     * @param _with
     * @returns {string}
     */
    _convertBalance(number, _with) {
        return number_format(number, 2, '.', ',');
    };

    /**
     * Init Game Control
     */
    initControl() {
        if (this.ready === true) {
            return null;
        }

        this.initLayout(this.config);

        this.inc++;

        this.initChildren(this.config.children);
        // this.initScatterPage();
        // this.initWildPage();
        // this.initBonusGamePage();
         this.initPaytableData();
         this.initPayLinesData();

        if (this.isVerticalMode()) {
            this.activateVerticalMode();
        } else {
            this.activateHorizontalMode();
        }

        /**
         * Spin button
         */
        this.spinActions();
        this.spinSettings();
        this.changeCountSetOfAutoPlay();

        this.settingsActivate();

        this.homeButton();

        this.changeSpinState();

        this.ready = true;

        if (this.callbackReady !== null) {
            this.callbackReady();
        }
    };

    /**
     * Home button
     */
    homeButton() {

        this.querySelector("main.homeButton").addEventListener("click", ()=> {

            this.getService("SoundService").play("audio_options");

            let url = this.getService("GameSettingsService").getExitUrl();

            if (url) {
                try {
                    window.parent.location = url;
                } catch (e) {
                    window.location = url;
                }
            }
        });
    }

    /**
     * Spin actions
     */
    spinActions() {

        this.spinButtonContainer = this.querySelector("main.SpinButton");
        this.spinButton = this.querySelector("main.SpinButton.defaultSpinBtn");
        this.spinStatePlay = this.querySelector("main.SpinButton.states.play");
        this.spinBtnStatesGl = this.querySelector("main.SpinButton.spinBtnStatesGl");
        //this.spinStatePlay.gotoAndStop("normal");

        /**
         * Spin button click
         */
        this.spinButton.addEventListener("mousedown", () => {

            if (this.settingsOpened) {
                this.hideExpand();
            }

            if (this.autoSpinActive === false) {
                this.controller.spinButtonClickAction();
            }

            if (this.getService("AutoPlayService").isActive()) {

                if (this.autoSpinActive === false) {
                    this.autoSpinActive = true;
                } else {
                    this.autoSpinActive = false;
                    this.getService("AutoPlayService").stopAutoSpins();

                    let elIcon = this.querySelector("main.SpinButton.expandSpinSettingsContainer.expandSpinSettings.autoBtn.autoIcon");
                    let elIconV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconV");
                    elIcon.x = 0;
                    elIcon.y = 0;
                    elIconV.x = 0;
                    elIconV.y = 0;

                    let elTextV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconTextV");
                    let elText = this.querySelector("main.SpinButton.expandSpinSettings.autoBtn.autoIconText");

                    let countAutoSpins = this.getService("AutoPlayService").getStartValue();

                    if(countAutoSpins == -2){
                        countAutoSpins = this._autoInfinite;
                    }

                    elText.setText(countAutoSpins);
                    elTextV.setText(countAutoSpins);

                    this.enableAllButtons();
                    this.changeSpinState();
                    return null;
                }
            }

            this.spinStatePlay.gotoAndStop(this.quickSpinEnable === false ? "clicked" : "fastClicked");
            this.spinBtnStatesGl.gotoAndStop(this.quickSpinEnable === false ? "clicked" : "fast");

            this.changeSpinState(true);
        });
    }

    changeFreespinCounterBeforeSpin () {
        this.setSpinCounterValue(this.getService("FreeSpinService").getFreeSpinLeft() - 1);
    }

    /**
     * Change spin state
     */
    changeSpinState(isQSAction = false) {
        let counter = this.querySelector("freeCounter");
        let statePlay = this.querySelector("main.SpinButton.states.play");

        if (this.freeSpinActivePanel === true) {

            this.hideHomeButton();

            $_view_canvas.disableClickActions();

            counter.visible = true;
            statePlay.visible = false;
            if (!isQSAction){
                counter.setText(this.getService("FreeSpinService").getFreeSpinLeft());
            }
            this.spinBtnStatesGl.gotoAndStop(this.quickSpinEnable === false ? "normal" : "fast");
            this.spinBtnStatesGl.visible = true;
            counter.color = "#16fcc3";

            this.disableAutospinButton();

            this.spinButtonContainer.setChildLeft(counter, 105);

        } else if (this.getService("AutoPlayService").isActive()) {

            this.enableAutospinButton();

            let countCurrent = this.getService("AutoPlayService").getCurrentValue();

            this.spinStatePlay.disabled = false;
            this.spinStatePlay.visible = false;
            statePlay.visible = false;

            if (this.autoSpinActive) {
                this.spinButtonContainer.setChildLeft(counter, 103);
                this.spinBtnStatesGl.gotoAndStop(this.quickSpinEnable === false ? "autoStop" : "autoStopFast");

                let elIcon = this.querySelector("main.SpinButton.expandSpinSettingsContainer.expandSpinSettings.autoBtn.autoIcon");
                let elIconV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconV");
                elIcon.x = -30;
                elIcon.y = -5;
                elIcon.gotoAndStop ("stop");

                elIconV.x = -30;
                elIconV.y = -5;
                elIconV.gotoAndStop ("stop");

                let elTextV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconTextV");
                let elText = this.querySelector("main.SpinButton.expandSpinSettings.autoBtn.autoIconText");

                elText.setText(countCurrent == -2 ? this._autoInfinite : countCurrent);
                elTextV.setText(countCurrent == -2 ? this._autoInfinite : countCurrent);
            } else {
                this.spinButtonContainer.setChildLeft(counter, 90);
                this.spinBtnStatesGl.gotoAndStop(this.quickSpinEnable === false ? "autoStart" : "autoStartFast");

                let elTextV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconTextV");
                let elText = this.querySelector("main.SpinButton.expandSpinSettings.autoBtn.autoIconText");

                let countAutoSpins = this.getService("AutoPlayService").getStartValue();

                if(countAutoSpins == -2){
                    countAutoSpins = this._autoInfinite;
                }

                elText.setText(countAutoSpins);
                elTextV.setText(countAutoSpins);
            }
            counter.visible = true;

            if (this.autoSpinActive === false) {
                countCurrent = this.controller.getCountAutoSpinValue();
            }

            counter.setText(countCurrent === -2 ? this._autoInfinite : countCurrent);


            counter.color = "#0c584c";
        } else {

            this.enableAutospinButton();

            counter.visible = false;
            statePlay.visible = true;
            this.spinStatePlay.disabled = true;
            this.spinStatePlay.visible = true;
            this.spinStatePlay.gotoAndStop(this.quickSpinEnable === false ? "normal" : "fast");
            this.spinBtnStatesGl.gotoAndStop(this.quickSpinEnable === false ? "normal" : "fast");

            let elTextV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconTextV");
            let elText = this.querySelector("main.SpinButton.expandSpinSettings.autoBtn.autoIconText");
            let elIcon = this.querySelector("main.SpinButton.expandSpinSettingsContainer.expandSpinSettings.autoBtn.autoIcon");
            let elIconV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconV");

            elIcon.x = 0;
            elIcon.y = 0;
            elIconV.x = 0;
            elIconV.y = 0;

            elIcon.gotoAndStop ("normal");
            elIconV.gotoAndStop ("normal");

            let countAutoSpins = this.controller.getCountAutoSpinValue();

            if(countAutoSpins == -2){
                countAutoSpins = this._autoInfinite;
            }

            elText.setText(countAutoSpins);
            elText.color = "#16fcc3";
            elTextV.setText(countAutoSpins);
            elTextV.color = "#16fcc3";
        }

    }

    /**
     * Spin settings
     */
    spinSettings() {
        let expandSpinButton = this.querySelector("main.SpinButton.expandSpinBtn");
        let spinButton = this.querySelector("main.SpinButton");

        let expandFast = this.querySelector("main.SpinButton.expandVerticalFastSettings");
        let expandNormal = this.querySelector("main.SpinButton.expandVerticalNormalSettings");

        let expandFastButton = this.querySelector("main.SpinButton.expandVerticalFastSettings.fast");
        let expandNormalButton = this.querySelector("main.SpinButton.expandVerticalNormalSettings.normal");

        let expandSpinSettings = this.querySelector("main.SpinButton.expandSpinSettings");
        let expandSpinSettingsContainer = this.querySelector("main.SpinButton.expandSpinSettingsContainer");
        let expandSpinBackground = this.querySelector("main.SpinButton.expandSpinSettings.bg");

        let tweenID = null;
        let spinBtnBounds = spinButton.getBounds();
        /* correction from rotation spin button */
        let spinButtonWidth;
        let spinButtonHeight;
        if (this.isVerticalMode()) {
            spinButtonWidth = spinBtnBounds.width;
            spinButtonHeight = spinBtnBounds.height;
        } else {
            spinButtonWidth = spinBtnBounds.height;
            spinButtonHeight = spinBtnBounds.width;
        }

        expandSpinSettingsContainer.left = -(expandSpinBackground.width - spinButtonHeight) - 30;
        expandSpinSettings.left = expandSpinBackground.width - spinButtonHeight;

        let fastClosePosition = -240;
        let fastOpenPosition = 0;
        let mask = new createjs.Shape();
        mask.graphics.drawRect(expandFast.x + expandFast.width, 0, expandFast.width, expandFast.height);
        expandFast.mask = mask;

        let normalClosePosition = spinBtnBounds.x;
        let normalOpenPosition = spinButtonWidth - expandNormal.width - 70;
        mask = new createjs.Shape();
        mask.graphics.drawRect(normalOpenPosition, 0, expandNormal.width, expandNormal.height);
        expandNormal.mask = mask;

        let horizontalClosePosition = expandSpinBackground.width - (spinButtonHeight - spinButtonWidth);
        let horizontalOpenPosition = 0;//spinButtonHeight - expandSpinSettings.width;

        mask = new createjs.Shape();
        mask.graphics.beginBitmapFill(expandSpinBackground.image).drawRect(-1, 0, expandSpinBackground.width - spinButtonWidth / 2, expandSpinBackground.height).endFill();
        mask.cache(-1, 0, expandSpinBackground.width - spinButtonWidth / 2, expandSpinBackground.height);

        /**
         * Hide expand
         */
        this.hideExpand = () => {

            if (/*this.isVerticalMode() || */this.beforeHorizontalPosition === false) {
                expandFast.x = fastClosePosition;
                expandFast.visible = false;

                expandNormal.x = normalClosePosition;
                expandNormal.visible = false;
            } else {
                expandSpinSettings.x = horizontalClosePosition;
                expandSpinSettings.visible = false;
            }

            /*this.spinButton.gotoAndStop("normal");
             this.spinStatePlay.gotoAndStop(this.quickSpinEnable === false ? "normal": "fast");
             this.spinBtnStatesGl.gotoAndStop(this.quickSpinEnable === false ? "normal": "fast");
             this.spinButton.disabled = false;*/

            expandSpinButton.outLabel = "normal";
            expandSpinButton.downLabel = "clicked";
            expandSpinButton.gotoAndStop("normal");

            expandSpinButton.visible = true;

            this.changeSpinState();

            this.requestUpdate();

            this.settingsOpened = false;
        };

        const closeVerticalExpand = () => {
            if (tweenID !== null) {
                this.endTween(tweenID);
                tweenID = null;
            }

            tweenID = this.startTween();
            createjs.Tween.get(expandNormal, {
                override: true,
                ignoreGlobalPause: true
            }).to({x: normalClosePosition}, 200);
            createjs.Tween.get(expandFast, {
                override: true,
                ignoreGlobalPause: true
            }).to({x: fastClosePosition}, 200).call(() => {
                this.endTween(tweenID);
                tweenID = null;
                expandFast.visible = false;
                expandNormal.visible = false;

                this.changeSpinState();

                expandSpinButton.outLabel = "normal";
                expandSpinButton.downLabel = "clicked";
                expandSpinButton.gotoAndStop("normal");
                this.requestUpdate();
            });
            expandSpinButton.normalLabel = "normal";
            expandSpinButton.clickedLabel = "clicked";
            this.settingsOpened = false;
        };

        const openVerticalExpand = () => {
            if (tweenID !== null) {
                this.endTween(tweenID);
                tweenID = null;
            }

            this.changeSpinState();

            expandSpinButton.normalLabel = "open";
            expandSpinButton.clickedLabel = "openClicked";

            expandFast.visible = true;
            expandNormal.visible = true;

            tweenID = this.startTween();
            createjs.Tween.get(expandNormal, {
                override: true,
                ignoreGlobalPause: true
            }).to({x: normalOpenPosition}, 200);
            createjs.Tween.get(expandFast, {
                override: true,
                ignoreGlobalPause: true
            }).to({x: fastOpenPosition}, 200).call(() => {
                this.endTween(tweenID);
                tweenID = null;
                this.requestUpdate()
            });

            this.settingsOpened = true;
        };

        const openHorizontalExpand = () => {
            if (tweenID !== null) {
                this.endTween(tweenID);
                tweenID = null;
            }

            expandSpinButton.visible = false;

            this.changeSpinState();

            expandSpinSettings.visible = true;

            expandSpinSettingsContainer.filters = [
                new createjs.AlphaMaskFilter(mask.cacheCanvas)
            ];
            expandSpinSettingsContainer.cache(0, 0, expandSpinBackground.width - spinButtonWidth / 2, expandSpinBackground.height);


            tweenID = this.startTween();
            createjs.Tween.get(expandSpinSettings, {
                override: true,
                ignoreGlobalPause: true
            }).to({x: horizontalOpenPosition}, 200).call(() => {
                this.endTween(tweenID);
                tweenID = null;
                expandSpinSettingsContainer.uncache();
                this.requestUpdate();
            }).addEventListener("change", () => {
                if (expandSpinSettingsContainer.cacheID) {
                    expandSpinSettingsContainer.updateCache();
                }
            });

            this.settingsOpened = true;
        };

        const closeHorizontalExpand = () => {
            if (tweenID !== null) {
                this.endTween(tweenID);
                tweenID = null;
            }

            expandSpinSettingsContainer.filters = [
                new createjs.AlphaMaskFilter(mask.cacheCanvas)
            ];
            expandSpinSettingsContainer.cache(0, 0, expandSpinBackground.width - spinButtonWidth  / 2, expandSpinBackground.height);

            tweenID = this.startTween();
            createjs.Tween.get(expandSpinSettings, {
                override: true,
                ignoreGlobalPause: true
            }).to({x: horizontalClosePosition}, 200).call(() => {
                this.endTween(tweenID);
                tweenID = null;

                expandSpinButton.visible = true;

                this.changeSpinState();

                expandSpinSettings.visible = false;

                expandSpinSettingsContainer.uncache();

                this.requestUpdate()
            }).addEventListener("change", () => {
                if (expandSpinSettingsContainer.cacheID) {
                    expandSpinSettingsContainer.updateCache();
                }
            });

            this.settingsOpened = false;
        };

        expandSpinButton.addEventListener("click", () => {

            this.getService("SoundService").play("audio_options");

            this.changeSpinState();

            if (!this.isVerticalMode()) {
                if (this.settingsOpened) {
                    closeHorizontalExpand();
                } else {
                    this.changeExpandKeysActives();
                    openHorizontalExpand();
                }

            } else {
                if (this.settingsOpened) {
                    closeVerticalExpand();
                } else {
                    this.changeExpandKeysActives();
                    openVerticalExpand();
                }
            }

        });

        /**
         * Horizontal close button
         */
        this.querySelector("main.SpinButton.expandSpinSettings.close").addEventListener("click", () => {
            this.getService("SoundService").play("audio_options");

            if (this.settingsOpened) {
                closeHorizontalExpand();
            }
        });

        /**
         * Horizontal autoSpin button
         */
        this.querySelector("main.SpinButton.expandSpinSettings.autoBtn").addEventListener("click", () => {

            this.getService("SoundService").play("audio_auto_play");

            let elIcon = this.querySelector("main.SpinButton.expandSpinSettingsContainer.expandSpinSettings.autoBtn.autoIcon");
            let elIconV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconV");
            let elTextV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconTextV");
            let elText = this.querySelector("main.SpinButton.expandSpinSettings.autoBtn.autoIconText");

            if (this.getService("AutoPlayService").isActive()) {
                this.getService("AutoPlayService").stopAutoSpins();

                elIcon.gotoAndStop("normal");
                elIconV.gotoAndStop("normal");
                elIcon.x = 0;
                elIcon.y = 0;
                elIconV.x = 0;
                elIconV.y = 0;
                elText.setText(this.getService("AutoPlayService").getStartValue());
                elTextV.setText(this.getService("AutoPlayService").getStartValue());

                elText.color = "#16fcc3";
            } else {

                this.changeCountSetOfAutoPlay(true);

                elIcon.gotoAndStop("clicked");
                elIcon.x = 0;
                elIcon.y = 0;
                elText.color = "#0c584c";
            }

            this.changeSpinState();
        });

        /**
         * Horizontal fast button
         */
        this.querySelector("main.SpinButton.expandSpinSettings.fastBtn").addEventListener("click", () => {

            this.getService("SoundService").play("audio_quick_spin");

            let el = this.querySelector("main.SpinButton.expandSpinSettings.fastBtn.fastButton");

            if (this.quickSpinEnable === true) {
                this.controller.quickSpinOffButtonClickAction();
                this.quickSpinEnable = false;
                el.gotoAndStop("normal");
            } else {
                this.controller.quickSpinOnButtonClickAction();
                this.quickSpinEnable = true;
                el.gotoAndStop("clicked");
            }

            this.changeSpinState(true);
        });

        /**
         * Vertical autoSpin button
         */
        this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV").addEventListener("click", () => {

            this.getService("SoundService").play("audio_auto_play");

            let elIcon = this.querySelector("main.SpinButton.expandSpinSettingsContainer.expandSpinSettings.autoBtn.autoIcon");
            let elIconV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconV");
            let elTextV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconTextV");
            let elText = this.querySelector("main.SpinButton.expandSpinSettings.autoBtn.autoIconText");

            if (this.getService("AutoPlayService").isActive()) {
                this.getService("AutoPlayService").stopAutoSpins();

                elIcon.gotoAndStop("normal");
                elIcon.x = 0;
                elIcon.y = 0;
                elText.color = "#16fcc3";
                elText.setText(this.getService("AutoPlayService").getStartValue());

                elIconV.gotoAndStop("normal");
                elIconV.x = 0;
                elIconV.y = 0;
                elTextV.setText(this.getService("AutoPlayService").getStartValue());
                elTextV.color = "#16fcc3";
            } else {

                this.changeCountSetOfAutoPlay(true);

                elIcon.gotoAndStop("clicked");
                elIcon.x = 0;
                elIcon.y = 0;
                elText.color = "#0c584c";

                elIconV.gotoAndStop("clicked");
                elIconV.x = 0;
                elIconV.y = 0;
                elTextV.color = "#0c584c";
            }

            this.changeSpinState();
        });

        /**
         * Vertical fast button
         */
        this.querySelector("main.SpinButton.expandVerticalFastSettings.fastBtnV").addEventListener("click", () => {

            this.getService("SoundService").play("audio_quick_spin");

            let el = this.querySelector("main.SpinButton.expandVerticalFastSettings.fastBtnV.fastButtonV");

            if (this.quickSpinEnable === true) {
                this.controller.quickSpinOffButtonClickAction();
                this.quickSpinEnable = false;
                el.gotoAndStop("normal");
            } else {
                this.controller.quickSpinOnButtonClickAction();
                this.quickSpinEnable = true;
                el.gotoAndStop("clicked");
            }
            this.changeSpinState(true);
        });

    }

    /**
     * Change Expand keys
     */
    changeExpandKeysActives() {

        let elIconH = this.querySelector("main.SpinButton.expandSpinSettings.autoBtn.autoIcon");
        let elTextH = this.querySelector("main.SpinButton.expandSpinSettings.autoBtn.autoIconText");

        let elIconV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconV");
        let elTextV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconTextV");

        if (this.getService("AutoPlayService").isActive() === true) {
            elIconH.gotoAndStop("clicked");
            elTextH.color = "#0c584c";

            elIconV.gotoAndStop("clicked");
            elTextV.color = "#0c584c";
        } else {
            elIconH.gotoAndStop("normal");
            elTextH.color = "#16fcc3";

            elIconV.gotoAndStop("normal");
            elTextV.color = "#16fcc3";
        }

        let elV = this.querySelector("main.SpinButton.expandVerticalFastSettings.fastBtnV.fastButtonV");
        let elH = this.querySelector("main.SpinButton.expandSpinSettings.fastBtn.fastButton");

        if (this.quickSpinEnable === true) {
            elV.gotoAndStop("clicked");
            elH.gotoAndStop("clicked");
        } else {
            elV.gotoAndStop("normal");
            elH.gotoAndStop("normal");
        }
    }

    /**
     * Settings activate
     */
    settingsActivate() {
        this.querySelector("main.settingsButton").addEventListener("click", () => {

            this.hideExpand();
            this.showSettingsPanel();

            this.getService("SlotMachineService").setPaused(true);
        });

        this.querySelector("settingsPanel.menuPanel.backMenu").addEventListener("click", () => {
            this.hideSettingsPanel();

            this.getService("SlotMachineService").setPaused(false);
        });
    }

    /**
     * Show settings panel
     */
    showSettingsPanel() {

        this.getService("SoundService").play("audio_paytable");

        $_event.setEvent("showSettingPanel");

        this.querySelector("main").visible = false;
        this.querySelector("settingsPanel").visible = true;

        this.panelButtons["soundMenu"] = this.querySelector("settingsPanel.menuPanel.soundMenu");
        this.panelButtons["fastMenu"] = this.querySelector("settingsPanel.menuPanel.fastMenu");
        this.panelButtons["payTableMenu"] = this.querySelector("settingsPanel.menuPanel.payTableMenu");
        this.panelButtons["betMenu"] = this.querySelector("settingsPanel.menuPanel.betMenu");
        this.panelButtons["infoMenu"] = this.querySelector("settingsPanel.menuPanel.infoMenu");


        if (this.lastChooseSettingMenu === null) {
            this.showBetSettingPanel();
        } else {
            this.lastChooseSettingMenu();
        }

        this.panelButtons["soundMenu"].addEventListener("click", ()=> {

            if(this.lastChooseSettingMenu != this.showSoundSettingPanel){
                this.getService("SoundService").play("audio_paytable_slide");

                this.showSoundSettingPanel();
            }

        }, false);
        this.panelButtons["fastMenu"].addEventListener("click", ()=> {

            if(this.lastChooseSettingMenu != this.showFastSettingPanel){
                this.getService("SoundService").play("audio_paytable_slide");

                this.showFastSettingPanel();
            }

        }, false);
        this.panelButtons["payTableMenu"].addEventListener("click", ()=> {

            if(this.lastChooseSettingMenu != this.showPayTableSettingPanel){
                this.getService("SoundService").play("audio_paytable_slide");

                this.showPayTableSettingPanel();
            }

        }, false);
        this.panelButtons["betMenu"].addEventListener("click", ()=> {

            if(this.lastChooseSettingMenu != this.showBetSettingPanel){
                this.getService("SoundService").play("audio_paytable_slide");

                this.showBetSettingPanel();
            }

        }, false);
        this.panelButtons["infoMenu"].addEventListener("click", ()=> {

            if(this.lastChooseSettingMenu != this.showInfoSettingPanel){
                this.getService("SoundService").play("audio_paytable_slide");

                this.showInfoSettingPanel();
            }

        }, false);

        this.showBetSettingPanel();
        this._scrollToBottom();
    }

    _scrollToBottom(){
        let panel = this.querySelector("settingsPanel.panel");

        panel.children.forEach ((scroller) => {
            scroller.scrollTo(0,0);
            scroller.updateDimensions();
        });
    }

    /**
     * Hide settings panel
     */
    hideSettingsPanel() {
        this.getService("SoundService").play("audio_paytable");

        $_event.setEvent("hideSettingPanel");

        this.querySelector("main").visible = true;
        this.querySelector("settingsPanel").visible = false;
    }

    /**
     * Active panel menu switcher
     * @param active
     */
    activePanelMenus(active = "") {
        let list = ["soundMenu", "fastMenu", "payTableMenu", "betMenu", "infoMenu"];
        let listPanels = ["settingsPanel.panel.panelSound", "settingsPanel.panel.panelFast",
            "settingsPanel.panel.panelPayTable", "settingsPanel.panel.panelBetMenu", "settingsPanel.panel.panelInfoMenu"];

        for (let i = 0, l = list.length; i < l; i++) {
            if (list[i] != active) {
                this.panelButtons[list[i]].gotoAndStop("normal");
                this.querySelector(listPanels[i]).visible = false;
            }
        }

        if (active) {
            this.querySelector(listPanels[list.indexOf(active)]).visible = true;
            this.panelButtons[active].gotoAndStop("active");
        }
    }

    /**
     * SETTING SOUND
     */

    /**
     * Init panel for sound once
     * @returns {null}
     */
    showSoundSettingPanel() {
        this.lastChooseSettingMenu = this.showSoundSettingPanel;

        this.activePanelMenus("soundMenu");
        
        if(this.activeMenu["showSoundSettingPanel"]){
            return null;
        }

        this.activeMenu["showSoundSettingPanel"] = true;

        if (this._initSound !== undefined) {
            return null;
        }

        this._initSound = true;

        /**
         * Game sound
         */
        this.gameSoundSlider = this.querySelector("settingsPanel.panel.panelSound.gameSoundButton");

        this.gameSoundSlider.addEventListener("change", () => {
            if (this.gameSoundSlider.value > 0) {
                this.gameSoundSlider.goToAndStop("active");
            } else {
                this.gameSoundSlider.goToAndStop("normal");
            }

            this.getService("SoundService").setGameSound(this.gameSoundSlider.value > 0);

            if (this.gameSoundSlider._checkChange('ss')) {
                this.getService("SoundService").play("audio_options");
            }
        });

        this.gameSoundSlider.value = this.getService("SoundService").getGameSound() ? 1 : 0;

        /**
         * Effects
         */

        this.gameEffectsSlider = this.querySelector("settingsPanel.panel.panelSound.gameEffectsButton");

        this.gameEffectsSlider.addEventListener("change", () => {

            if (this.gameEffectsSlider.value > 0) {
                this.gameEffectsSlider.goToAndStop("active");
            } else {
                this.gameEffectsSlider.goToAndStop("normal");
            }

            this.getService("SoundService").setGameEffects(this.gameEffectsSlider.value > 0);

            if (this.gameEffectsSlider._checkChange('se')) {
                this.getService("SoundService").play("audio_options");
            }
        });

        this.gameEffectsSlider.value = this.getService("SoundService").getGameEffects() ? 1 : 0;

        /**this.gameSoundSlider.addEventListener("changeThumb", (ev)=>{
            console.log('!! this.gameSoundSlider change thumb', this.gameSoundSlider.value);
        })*/
    }

    /**
     * Show fast menu
     * @returns {null}
     */
    showFastSettingPanel() {
        this.lastChooseSettingMenu = this.showFastSettingPanel;

        this.activePanelMenus("fastMenu");

        if(this.activeMenu["showFastSettingPanel"]){
            return null;
        }

        this.activeMenu["showFastSettingPanel"] = true;

        if (this._initFast !== undefined) {
            return null;
        }

        this._initFast = true;

        /**
         * Auto play
         */
        this.gameAutoPlaySlider = this.querySelector("settingsPanel.panel.panelFast.gameAutoPlayButton");

        this.gameAutoPlaySlider.addEventListener("mousedown", ()=> {
            this.gameAutoPlaySlider.goToAndStop("active");
        });

        this.gameAutoPlaySlider.addEventListener("pressup", ()=> {
            this.gameAutoPlaySlider.goToAndStop("normal");
        });

        var infoLabel = this.querySelector("settingsPanel.panel.panelFast.autoPlayInfoLabel");
        var infoLabelText = this.querySelector("settingsPanel.panel.panelFast.autoPlayInfoLabel.apIlText");

        this.gameAutoPlaySlider.addEventListener("changeThumb", ()=> {
            infoLabel.x = this.gameAutoPlaySlider.getThumbCenter() - (infoLabel.width / 2) + 10;

            let el = this.autoPLayRange[this.gameAutoPlaySlider.value];
            infoLabelText.setText(el === -2 ? this._autoInfinite : el);
        });

        this.gameAutoPlaySlider.addEventListener("change", () => {

            let val = this.autoPLayRange[this.gameAutoPlaySlider.value];
            this.getService("MemoryService").set("autoSpinCount", val, MemoryService.MEMORY_COOKIES_STORAGE);
            this.changeCountSetOfAutoPlay();

            if(this.getService("AutoPlayService").isActive()){
                this.autoSpinActive = false;

                this.getService("AutoPlayService").stopAutoSpins();
                this.enableAllButtons();
                this.changeSpinState();

                this.changeSpinState();
            }

            this.getService("SoundService").play("audio_options");

        });

        this.changeCountSetOfAutoPlay();

        let defaultCount = this.controller.getCountAutoSpinValue();

        this.gameAutoPlaySlider.value = this.autoPLayRange.indexOf(defaultCount);

        this.gameAutoPlaySlider.dispatchEvent("change");

        /**
         * Quick spin
         */
        this.gameQuickSpinSlider = this.querySelector("settingsPanel.panel.panelFast.gameQuickSpinButton");

        this.gameQuickSpinSlider.addEventListener("change", () => {

            if (this.gameQuickSpinSlider.value > 0) {
                this.gameQuickSpinSlider.goToAndStop("active");
            } else {
                this.gameQuickSpinSlider.goToAndStop("normal");
            }

            if (this.gameQuickSpinSlider._checkChange('ev')) {

                this.getService("SoundService").play("audio_options");

                if (this.gameQuickSpinSlider.value > 0) {
                    this.controller.quickSpinOnButtonClickAction();
                } else {
                    this.controller.quickSpinOffButtonClickAction();
                }
            }
        });

        this.gameQuickSpinSlider.value = this.getService("SlotMachineService").getInstance().isEnableQuickMode() ? 1 : 0;
    }

    /**
     * Change count set to memory of auto play
     * @param confirm
     */
    changeCountSetOfAutoPlay(confirm = false) {

        let val = this.controller.getCountAutoSpinValue();

        if (confirm) {
            this.getService("AutoPlayService").setCurrentValue(val);
            this.getService("AutoPlayService").startAutoSpins(val);
        }

        this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconTextV").setText(val === -2 ? this._autoInfinite : val);
        this.querySelector("main.SpinButton.expandSpinSettings.autoBtn.autoIconText").setText(val === -2 ? this._autoInfinite : val);

        this.changeSpinState();
    }

    /**
     * PayTable panel block
     * @returns {null}
     */
    showPayTableSettingPanel(){
        this.lastChooseSettingMenu = this.showPayTableSettingPanel;

        this.activePanelMenus("payTableMenu");

        if(!this._initPayTable){
            //return null;
        }

        this._initPayTable = true;

    }

    /**
     * Show Bet Settings panel
     * @returns {null}
     */
    showBetSettingPanel() {

        this.lastChooseSettingMenu = this.showBetSettingPanel;

        this.activePanelMenus("betMenu");

        if(this.activeMenu["showBetSettingPanel"]){
            return null;
        }

        this.activeMenu["showBetSettingPanel"] = true;


        //if (this._initBetPanel !== undefined) {
        //    return null;
        //}



        let betRange = this.getService("BetService").getBetRange();
        let linesRange = this.getService("LinesService").getLinesRange();

        /**
         * Bet slider
         */
        this.betSlider = this.querySelector("settingsPanel.panel.panelBetMenu.betSliderButton");

        this.betSlider.removeAllEventListeners("changeThumb");
        this.betSlider.removeAllEventListeners("change");

        var infoBetLabel = this.querySelector("settingsPanel.panel.panelBetMenu.betInfoLabel");
        var infoBetLabelText = this.querySelector("settingsPanel.panel.panelBetMenu.betInfoLabel.betIlText");

        this.betSlider.addEventListener("changeThumb", ()=> {
            infoBetLabel.x = this.betSlider.getThumbCenter() - (infoBetLabel.width / 2);
            infoBetLabelText.setText(betRange[this.betSlider.value] / 100);
        });

        this.betSlider.addEventListener("change", ()=> {

            //if (this.getService("BetService").getCurrentProtocolValue() != betRange[this.betSlider.value]) {
                this.getService("BetService").setCurrentValue(betRange[this.betSlider.value]);
                this.changeTotalBetValue();

                this.getService("SoundService").play("audio_line");
            //}
        });

        this.betSlider.len = betRange.length; //set len of slider
        this.betSlider.value = betRange.indexOf(this.getService("BetService").getCurrentValue());
        //if (!this._initBetPanel) {
        //    this.betSlider.value = betRange.indexOf(this.getService("BetService").getCurrentProtocolValue());
        //}

        this.querySelector("settingsPanel.panel.panelBetMenu.betFromLabel").setText(array_min(betRange) / 100);
        this.querySelector("settingsPanel.panel.panelBetMenu.betToLabel").setText(array_max(betRange) / 100);

        this.betSlider.dispatchEvent("change");

        if (linesRange.length <= 1) {
            this.querySelector("settingsPanel.panel.panelBetMenu.totalBetContainer").visible = true;
        } else {
            this.querySelector("settingsPanel.panel.panelBetMenu.lineContainer").visible = true;

            /**
             * Line slider
             */
            this.linesSlider = this.querySelector("settingsPanel.panel.panelBetMenu.lineContainer.linesSliderButton");

            var infoLinesLabel = this.querySelector("settingsPanel.panel.panelBetMenu.lineContainer.linesInfoLabel");
            var infoLinesLabelText = this.querySelector("settingsPanel.panel.panelBetMenu.lineContainer.linesInfoLabel.lineIlText");

            this.linesSlider.removeAllEventListeners("changeThumb");
            this.linesSlider.removeAllEventListeners("change");

            this.linesSlider.addEventListener("changeThumb", ()=> {
                infoLinesLabel.x = this.linesSlider.getThumbCenter() - (infoLinesLabel.width / 2);
                infoLinesLabelText.setText(linesRange[this.linesSlider.value]);
            });


            this.linesSlider.addEventListener("change", ()=> {
                if (this.getService("LinesService").getCurrentProtocolValue() != this.linesSlider.value) {
                    this.getService("LinesService").setCurrentValue(linesRange[this.linesSlider.value]);
                    this.changeTotalBetValue();

                    this.getService("SoundService").play("audio_line");
                }
            });

            this.linesSlider.len = linesRange.length; //set len of slider
            this.linesSlider.value = linesRange.indexOf(this.getService("LinesService").getCurrentValue());
            //if (!this._initBetPanel) {
            //    this.linesSlider.value = linesRange.indexOf(this.getService("LinesService").getCurrentProtocolValue());
            //}

            this.querySelector("settingsPanel.panel.panelBetMenu.lineContainer.linesFromLabel").setText(array_min(linesRange));
            this.querySelector("settingsPanel.panel.panelBetMenu.lineContainer.linesToLabel").setText(array_max(linesRange));

            this.linesSlider.dispatchEvent("change");
        }

        this._initBetPanel = true;

    }

    /**
     * Show Bet Settings panel
     * @returns {null}
     */
    showInfoSettingPanel() {
        this.lastChooseSettingMenu = this.showInfoSettingPanel;

        this.activePanelMenus("infoMenu");

        if(!this._initInfoPanel){
            //return null;
        }

        this._initInfoPanel = true;
    }

    /**
     * Change active quick spin buttons
     * @param enable
     */
    changeActiveQuickSpinButton(enable = false) {
        if (this.gameQuickSpinSlider !== null) {
            this.gameQuickSpinSlider.value = enable ? 1 : 0;
        }

        this.quickSpinEnable = enable;

        if (this.spinStatePlay) {
            this.spinStatePlay.gotoAndStop(this.quickSpinEnable === false ? "normal" : "fast");
            this.spinBtnStatesGl.gotoAndStop(this.quickSpinEnable === false ? "normal" : "fast");
            // console.log('!! changeActiveQuickSpinButton', enable);
        }
    }

    /**
     * Check default state of control keys
     */
    checkDefaultStateKeys() {
        this.checkDefaultStatesBetBlock();
        this.checkDefaultStateLineBlock();
    }

    /**
     * Check defaukt state of labels
     */
    checkDefaultStateLabels() {
        this.changeTotalBetValue();
        this.changeTotalWinValue();
        this.changeWinValue(null);
        this.changeBalanceValue();
    }

    initControlEventHandlers() {

    }

    showFreeGameControls() {
        this.freeSpinActivePanel = true;
        this.bonusActivePanel = false;
        this.querySelector("main").visible = true;
        this.spinStatePlay.disabled = true;
        this.spinBtnStatesGl.disabled = true;
        this.querySelector("main.SpinButton.states.play").visible = false;
        this.querySelector("main.settingsButton").disabled = true;
        this.querySelector("main.settingsButton").visible = false;
        this.changeSpinState();

        if(this.getService("ProtocolService").hasFreeBets()){
            this.changeWinFreeBets();
        } else {
            this.changeBalanceValue();
        }
    }

    fbAction(){
        if(this.getService("ProtocolService").hasFreeBets()){
            $_signal.goTo("!settings.toolbar.staticFreeBetMessage", this.getService("ProtocolService").getFreeBetsLeft() - 1);
        }
    }

    showMainGameControls() {
        this.freeSpinActivePanel = false;
        this.bonusActivePanel = false;

        /*this.querySelector("main").visible = true;
         this.spinStatePlay.disabled = false;
         this.spinBtnStatesGl.disabled = false;
         this.querySelector("main.SpinButton.states.freeCounter").visible = false;
         //this.applyStyle(mainGameControlConfig);*/

        this.fbAction();

        this.querySelector("main.settingsButton").visible = true;

        this.changeSpinState();

        if(this.getService("ProtocolService").hasFreeBets()){
            this.changeWinFreeBets();

            $_signal.goTo("!settings.toolbar.staticFreeBetMessage", this.getService("ProtocolService").getFreeBetsLeft());
        } else {
            this.changeBalanceValue();
        }
    }

    showBonusGameControl() {
        this.freeSpinActivePanel = false;
        this.bonusActivePanel = true;

        this.querySelector("main").visible = true;
        this.querySelector("main.settingsButton").visible = false;
        this.querySelector("main.SpinButton").visible = false;
        //this.applyStyle(bonusGameControlConfig);

        if(this.getService("ProtocolService").hasFreeBets()){
            this.changeWinFreeBets();
        } else {
            this.changeBalanceValue();
        }
    }

    showAutoPlayCounter() {
        this.changeAutoPlayValue();
        this.querySelector("autoPlayCounterContainer").visible = true;
    }

    hideAutoPlayCounter() {
        this.querySelector("autoPlayCounterContainer").visible = false;
    }

    showAutoPlaySettings() {
        this.querySelector("autoPlaySettingsContainer").visible = true;
    }

    hideAutoPlaySettings() {
        this.querySelector("autoPlaySettingsContainer").visible = false;
    }

    toggleVisibilityAutoPlaySettings() {
        this.querySelector("autoPlaySettingsContainer").visible = !this.querySelector("autoPlaySettingsContainer").visible;
        if (!this.querySelector("autoPlaySettingsContainer").visible) {
            this.querySelector("autoPlayAdvancedSettingsContainer").visible = false;
        }
    }

    showAdvancedAutoPlaySettings() {
        this.querySelector("autoPlayAdvancedSettingsContainer").visible = true;
    }

    hideAdvancedAutoPlaySettings() {
        this.querySelector("autoPlayAdvancedSettingsContainer").visible = false;
    }

    setAutoPlayRangeSettingsValue(autoPlayRange = []) {
        for (let i = 0; i < 4; i++) {
            if (autoPlayRange[i]) {
                this.querySelector(`autoPlayValueContainer${i + 1}.autoPlayValue`).setText(autoPlayRange[i]);
            }
        }
    }

    setAutoPlayCounterValue(value) {
        this.querySelector(`autoPlayCounterContainer.autoPlayValue`).setText(value);
    }

    getAutoPlayValueContainer(containerNumber) {
        return this.querySelector(`autoPlayValueContainer${containerNumber}.autoPlayValue`).text;
    }

    changeAutoPlayValue(value = this.getService("AutoPlkayService").getCurrentValue()) {
        this.querySelector(`autoPlayCounterContainer.autoPlayValue`).setText(value);
    }

    /**
     * Change total win value
     */
    changeTotalWinValue(isInit = false) {
        let totalWin = this.querySelector("main.winBar.totalWinContainer"),
            totalWinText = totalWin.getChildByName ("winText"),
            bonusData = this.getService("BonusService").getBonusContext(),
            winBarText = this.querySelector("main.winBar.winContainer.winText");

        if (this.freeSpinActivePanel === true) {
           this.changeWinPanelVisibility(true);

            totalWin.visible = true;

            totalWinText.setText(
                $_t.getText(`Total win: {0}`, number_format(this.getService('FreeSpinService').getTotalWin() / 100, 2, ".", ","))
            );
        }else if(this.bonusActivePanel && bonusData && bonusData.step != 1){

            this.changeWinPanelVisibility(true);
            winBarText.visible = false;
            totalWin.visible = true;
            totalWinText.setText(
                $_t.getText(`Total win: {0}`, number_format(bonusData.total_win / 100, 2, ".", ","))
            );
        } else {
            this.changeWinPanelVisibility(false);
            this.changeWinValue(0);
        }

        if (this.isFreeBets){
            this.changeBalanceValue();
        }

        if (isInit){
            totalWin.visible = true;
            winBarText.visible = false;
            totalWinText.setText(
                $_t.getText(`Total win: {0}`, number_format(this.getService('FreeSpinService').getTotalWin() / 100, 2, ".", ","))
            );
        }
    }

    showTotalPanelRestore (){
        let totalWinText,
            mainBar =  this.querySelector("main.winBar");

        if (mainBar.visible !== true || this.getService("ProtocolService").getLastAction() !== "spin"){
            totalWinText =  this.querySelector("main.winBar.totalWinContainer.winText");
            this.changeWinPanelVisibility(true);
            totalWinText.setText(
                $_t.getText(`Total win: {0}`, number_format(this.getService('FreeSpinService').getTotalWin() / 100, 2, ".", ","))
            );
            this.querySelector("main.winBar.totalWinContainer").visible = true;
            totalWinText.visible = true;
            this.querySelector("main.winBar.winContainer.winText").visible = false;
        }
    }

    changeWinPanelVisibility(bool = false){
       this.querySelector("main.winBar").visible = bool;
    }

    /**
     * Show round win in bonus game
     */
    showBonusRoundWin(){

        let bonusData = this.getService("BonusService").getBonusContext(),
            winBarText = this.querySelector("main.winBar.winContainer.winText");

        this.querySelector("main.winBar.winContainer").visible = true;

        winBarText.visible = true;
        winBarText.setText(`${$_t.getText("WIN_")}: ${this.getService("ProtocolService").getCurrentCurrency(true)} ${number_format(bonusData.round_win / 100, 2, ".", ",")}`);
    }

    /**
     * Hide bonus round win
     */
    hideBonusRoundWin(){
        this.querySelector("main.winBar.winContainer.winText").visible = false;
    }

    /**
     * Change win value
     * @param value
     */
    changeWinValue(value = this.getService("ProtocolService").getCurrentWin()) {
        let winBarText = this.querySelector("main.winBar.winContainer.winText");
        this.changeWinPanelVisibility(true);
        if (!value) {

            if (this.freeSpinActivePanel === false) {
                this.changeWinPanelVisibility(false);
                this.querySelector("main.winBar.winContainer").visible = true;
                this.querySelector("main.winBar.winContainer.winText").visible = true;

            } else {
                this.querySelector("main.winBar.winContainer").visible = false;
            }
        } else {
            if (!this.freeSpinActivePanel === false) {
                this.querySelector("main.winBar.winContainer").visible = true;
                this.changeTotalWinValue();
            }
            winBarText.visible = true;
            winBarText.setText(`${$_t.getText("WIN_")}: ${this.getService("ProtocolService").getCurrentCurrency(true)} ${number_format(value / 100, 2, ".", ",")}`);
        }
    }
    

    /**
     * Change balance value
     * @param value
     */
    changeBalanceValue(value = this.getService("ProtocolService").getCurrentBalance()) {
        if(this.isFreeBets){
            this.changeWinFreeBets();
            return;
        }
        this.isInit = false;
        this.querySelector("bottomBar.balanceText").setText(
            `${$_t.getText("BALANCE")}: ${this.getService("ProtocolService").getCurrentCurrency(true)} ${number_format(value, 2, ".", ",")}`
        );
    }

    /**
     * Change balance value before spin
     */
    changeBalanceValueBeforeSpin() {
        let curBalance;
        this.fbAction();
        if (this.getService("ProtocolService").hasFreeBets()){
            this.isInit = true;
            return;
        }

        if (this.getService("ProtocolService").getCurrentBalance() > 0 && !this.isInit) {
            curBalance =  this.getService("ProtocolService").getCurrentBalance() - (
                    this.getService("BetService").getCurrentValue() *
                    this.getService("LinesService").getCurrentValue()
                ) / 100
        } else {
            curBalance = this.getService("ProtocolService").getCurrentBalance();
            this.isInit = false;
        }
        this.changeBalanceValue(curBalance);
    }

    setBetValue(value = this.getService("BetService").getCurrentValue()) {
        this.querySelector("bottomBar.betText").setText(
            `${$_t.getText("TOTAL BET")}: ${this.getService("ProtocolService").getCurrentCurrency(true)} ${number_format(value, 2, ".", ",")}`);

        this.querySelector("gameTotalBetValueLabel").setText(number_format(value, 2, ".", ","));
    }

    /**
     * Change total bet value
     */
    changeTotalBetValue() {
        this.setBetValue(
            (this.getService("BetService").getCurrentValue() / 100 ) *
            this.getService("LinesService").getCurrentValue() *
            this.getService("ProtocolService").getCurrentDenominator()
        );

    }

    setLinesValue(value) {
        this.querySelector("linesValue").setText(value);
    }

    setSpinCounterValue(value) {

        $_view_canvas.disableClickActions();

        let free = this.querySelector("main.SpinButton.states.freeCounter");
        free.visible = true;
        free.setText(value);
    }

    /**
     * Disable all buttons
     */
    disableAllButtons() {

        if(this.getState().name.indexOf("STATE_SPINS_") == -1){
            this.hideHomeButton();
        }

        $_view_canvas.disableClickActions();

        if (!this.getService("AutoPlayService").isActive() && this.freeSpinActivePanel === false) {

            this.querySelector("main.SpinButton").visible = false;
            this.querySelector("main.settingsButton").visible = false;
        }

        if(this.getService("AutoPlayService").isActive() || this.freeSpinActivePanel === true){
            this.querySelector("main.SpinButton").visible = true;
            this.querySelector("main.settingsButton").visible = false;
        }

        if (this.freeSpinActivePanel === true) {
            this.querySelector("main.SpinButton").visible = true;
        }
    }

    /**
     * Enable all buttons
     */
    enableAllButtons() {

        //if (this.getService("ProtocolService").getNextAction() !== "spin" && $_signal_history.getLast().alias != "protocol.spins.init") {
        //    return;
        //}

        if(["freespin_init", "bonus_init"].indexOf(this.getController("protocol").actions.available[0]) != -1){
            return ;
        }

        if(this.getState().name == "STATE_SPINS_OUTRO"){
            return ;
        }

        if(this.getState().name.indexOf("STATE_SPINS_") != -1){
            this.showHomeButton();
        }

        $_view_canvas.enableClickActions();

        this.querySelector("main.SpinButton").visible = true;

        if (this.freeSpinActivePanel === false && !this.getService("AutoPlayService").isActive()) {
            this.querySelector("main.settingsButton").visible = true;
        }

        this.changeSpinState();

        //if (!this.getService("AutoPlayService").isActive()) {
        //    this.autoSpinActive = false;
        //}

        this.spinButton.gotoAndStop("normal");
        this.checkDefaultStatesBetBlock();
        this.requestUpdate();
    }

    /**
     * CHANGE BET
     */

    /**
     * Check default states of keys
     */
    checkDefaultStatesBetBlock() {

        /*if(this.getService('BetService').checkBackward() === true) {
         this.querySelector("decBetBtn").disabled = false;
         } else {
         this.querySelector("decBetBtn").disabled = true;
         }

         if(this.getService('BetService').checkForward() === true) {
         this.querySelector("incBetBtn").disabled = false;
         } else {
         this.querySelector("incBetBtn").disabled = true;
         }*/

        //this.setBetValue(this.getService("BetService").getCurrentValue());
        this.changeTotalBetValue();

        //this.changeTotalBetValue();
    }

    /**
     * Change bet to backward
     */
    changeDecBetButton() {
        if (this.getService('BetService').changeToBackward()) {
            this.checkDefaultStatesBetBlock();
        }
    }

    /**
     * Change bet to forward
     */
    changeIncBetButton() {
        if (this.getService('BetService').changeToForward()) {
            this.checkDefaultStatesBetBlock();
        }
    }

    /**
     * CHANGE LINES
     */

    /**
     * Check default states line block
     */
    checkDefaultStateLineBlock() {

        if (this.getService('LinesService').checkBackward() === true) {
            this.querySelector("decLinesBtn").disabled = false;
        } else {
            this.querySelector("decLinesBtn").disabled = true;
        }

        if (this.getService('LinesService').checkForward() === true) {
            this.querySelector("incLinesBtn").disabled = false;
        } else {
            this.querySelector("incLinesBtn").disabled = true;
        }

        this.setLinesValue(this.getService("LinesService").getCurrentValue());

        this.changeTotalBetValue();
    }

    /**
     * Change lines to backward
     */
    changeDecLineButton() {
        if (this.getService('LinesService').changeToBackward()) {
            this.checkDefaultStateLineBlock();
        }
    }

    /**
     * Change lines to forward
     */
    changeIncLineButton() {
        if (this.getService('LinesService').changeToForward()) {
            this.checkDefaultStateLineBlock();
        }
    }

    /**
     * Change to MAX BET
     */
    changeToMaxBet() {
        this.getService("BetService").changeToMaxValue();
        this.getService("LinesService").changeToMaxValue();
        this.checkDefaultStateKeys();
    }


    /**
     * FREE SPINS
     */

    /**
     * Show freeSpin panel
     */
    showFreePanel() {

        if (this.ready === false) {
            this.callbackReady = this.showFreePanel;
        } else {
            this.showFreeGameControls();
            this.setSpinCounterValue(this.getService("FreeSpinService").getFreeSpinLeft());
        }
    }

    /**
     * Hide freeSpin panel
     */
    hideFreePanel() {
        this.showMainGameControls();
        this.freeSpinActivePanel = false;
        this.querySelector("main.winBar.totalWinContainer").visible = false;
        this.changeTotalWinValue();
        if (this.isFreeBets){
            this.changeWinFreeBets();
        }
    }

    /**
     * Show bonus panel
     */
    showBonusPanel() {
        this.showBonusGameControl();
        this.changeTotalWinValue();

        this.disableAllButtons();
    }

    /**
     * Hide freeSpin panel
     */
    hideBonusPanel() {
        this.showMainGameControls();
        if (this.isFreeBets){
            this.changeWinFreeBets();
        }
    }

    /**
     * Activate vertical mode
     */
    activateVerticalMode() {
        let main = this.querySelector("main");
        if (!main) {
            this.beforeHorizontalPosition = false;
            return;
        }

        if (this.settingsOpened === true && typeof this.hideExpand == "function") {
            this.hideExpand();
        }

        this.beforeHorizontalPosition = false;

        this.applyConfig(verticalConfig);

        let layout = this.getLayout();
        let gameContainer = this.getGameContainer();
        let background = this.querySelector("background");
        let spinButton = this.querySelector("SpinButton");

        background.y = gameContainer.y + 720;

        main.setChildTop(spinButton, (layout.height - (gameContainer.y + 720))/2 - spinButton.height/2 + (gameContainer.y + 720) );

        this.activateVerticalSettingsPanel();

        this.requestUpdate();

    }

    /**
     * Activate horizontal mode
     */
    activateHorizontalMode() {

        let main = this.querySelector("main");
        if (!main) {
            this.beforeHorizontalPosition = true;
            return;
        }

        if (this.settingsOpened === true && typeof this.hideExpand == "function") {
            this.hideExpand();
        }

        this.beforeHorizontalPosition = true;

        this.applyConfig(horizontalConfig);

        this.activateHorizontalSettingsPanel();
        this.requestUpdate();
    }

    activateHorizontalSettingsPanel() {
        let layout = this.getLayout();
        let settingsPanel = this.querySelector("settingsPanel");
        let bottomBar = this.querySelector("bottomBar");

        let menuPanel = this.querySelector("settingsPanel.menuPanel");
        let topLine = this.querySelector("settingsPanel.topLine");

        let soundMenu = this.querySelector("settingsPanel.menuPanel.soundMenu");
        let fastMenu = this.querySelector("settingsPanel.menuPanel.fastMenu");
        let payTableMenu = this.querySelector("settingsPanel.menuPanel.payTableMenu");
        let betMenu = this.querySelector("settingsPanel.menuPanel.betMenu");
        let infoMenu = this.querySelector("settingsPanel.menuPanel.infoMenu");

        let panel = this.querySelector("settingsPanel.panel");

        layout.setChildHeight(settingsPanel, layout.height - bottomBar.height);

        settingsPanel.setChildHeight (panel, settingsPanel.height - menuPanel.height );

        this._scrollToBottom();

        this.setMenuItemsPositions();

        if (this.gameAutoPlaySlider) {
            this.gameAutoPlaySlider.dispatchEvent("change");
        }

    }

    setMenuItemsPositions () {
        let menuPanel = this.querySelector("settingsPanel.menuPanel");
        let soundMenu = this.querySelector("settingsPanel.menuPanel.soundMenu");
        let fastMenu = this.querySelector("settingsPanel.menuPanel.fastMenu");
        let payTableMenu = this.querySelector("settingsPanel.menuPanel.payTableMenu");
        let betMenu = this.querySelector("settingsPanel.menuPanel.betMenu");
        let infoMenu = this.querySelector("settingsPanel.menuPanel.infoMenu");

        /* calculate distance between menu element in percent */
        let sizeOfPicture = betMenu.width / menuPanel.width * 100;
        /* size of each element in percent */
        let padding = 2;
        let startPosition = 1;
        /* custom padding (left and right) in percent*/
        let betweenElements = (100 - (sizeOfPicture * 6) - padding) / 6 + sizeOfPicture;
        /* distance between left side of each element in percent */

        menuPanel.setChildLeft(betMenu, `${padding + startPosition}%`);
        menuPanel.setChildLeft(fastMenu, `${startPosition + padding + betweenElements}%`);
        menuPanel.setChildLeft(soundMenu, `${startPosition + padding + betweenElements * 2}%`);
        menuPanel.setChildLeft(payTableMenu, `${startPosition + padding + betweenElements * 3}%`);
        menuPanel.setChildLeft(infoMenu, `${startPosition + padding + betweenElements * 4}%`);
    }

    activateVerticalSettingsPanel() {
        let settingsPanel = this.querySelector("settingsPanel"),
            panel = this.querySelector("settingsPanel.panel"),
            menuPanel = this.querySelector("settingsPanel.menuPanel"),
            //scroller = this.querySelector("settingsPanel.scroller"),
            layout = this.getLayout(),
            bottomBar = this.querySelector("bottomBar");

        layout.setChildHeight(settingsPanel, layout.height - bottomBar.height);
        settingsPanel.setChildHeight (panel, settingsPanel.height - menuPanel.height );

        panel.children.forEach ((scroller) => {
            scroller.scrollTo(0,0);
            scroller.updateDimensions();
        });

        this.setMenuItemsPositions();

        if (this.gameAutoPlaySlider) {
            this.gameAutoPlaySlider.dispatchEvent("change");
        }
    }
    
    /**
     * FREE BETS
     */
    /**
     * Show free bets panel
     * @param count
     */
    initFreeBets(count) {
        this.getService("PopupService").addInfoPopup("freebets", {
            message: $_t.getText("free_bets_start", count),
            header: $_t.getText("free_bets_head")
        });
        this.isFreeBets = true;
        this.changeWinFreeBets();
    }

    /**
     * Hide free bets panel
     */
    hideFreeBets(){

        let lastFreeBets = this.getService("ProtocolService").getFreeBets();

        if(lastFreeBets.status == "finished"){
            this.getService("PopupService").addInfoPopup("freebets", {message: lastFreeBets.total_win > 0 ? $_t.getText("free_bets_end_{0}", number_format(lastFreeBets.total_win / 100, 2, ".", ",")) : $_t.getText("free_bets_end_no_win"), header: $_t.getText("free_bets_head")});
        } else {
            this.getService("PopupService").addInfoPopup("freebets", {message: $_t.getText("free_bets_deleted"), header: $_t.getText("free_bets_head")});
        }

        this.getService("ProtocolService").setFreeBets([]);

        setTimeout(()=>{
            $_service_ticker_tape.spinGameInfo(true);
        }, 30);

        this.showMainGameControls();
        this.isFreeBets = false;
    }

    /**
     * Change win free bets
     * @param value
     */
    changeWinFreeBets(value = 0) {

        if (this.freeSpinActivePanel && !this.isFreeBets){
            return;
        }
        let data = this.getService("ProtocolService").getFreeBets();

        if (data && data.total_win) {
            value = data.total_win;
        }
        this.querySelector("bottomBar.balanceText").setText(
            `${$_t.getText("FREE BETS WIN")}: ${this.getService("ProtocolService").getCurrentCurrency(true)} ${number_format(value/100, 2, ".", ",")}`
        );
    }


    initPaytableData() {
        let paytableContainer = this.querySelector("panelPayTable.panelWrapper");

        let table = new Container();
        table.name = "table";
        table.width = 840;
        table.height = 201;
        let grid = [];

        //let multiplierScale = 0.5;
        let valueScale = 0.95;
        let imageScale = 0.5;
        let firstColWidth = 44;
        let firstRowHeight = 87;
        let bottomPadding = 10;

        let numOfSymbols,
            numOfCols;
        numOfCols = numOfSymbols = 9;
        let numOfRows = 4;

        paytableContainer.addChild(table);
        paytableContainer.setChildAlign("center", table);
        paytableContainer.setChildTop(table, 100);


        for (let i = 0; i <= numOfCols; i++) {
            grid[i] = [];

            grid[i][0] = new Container();
            grid[i][0].name = `cell_${i}_${0}`;
            grid[i][0].height = firstRowHeight;
            grid[i][0].width = 82;
            grid[i][0].x = 82 * i;
            grid[i][0].y = 0;
            table.addChild(grid[i][0]);

            for (let j = 1; j <= numOfRows; j++) {
                let cell = new Container();
                cell.name = `cell_${i}_${j}`;

                cell.height = 45;

                if ((i + j + 1) % 2 === 0) {
                    let background = new Sprite ({
                        spriteSheet: paytableAtlasSpriteSheet,
                        defaultAnimation: "cellBack"
                    }, this.alias);
                    cell.width = 82;
                    cell.addChild(background);
                } else {
                    cell.width = 82;
                }

                cell.x = 82 * i;
                cell.y = 45 * (j-1) + firstRowHeight;

                grid[i][j] = cell;
                table.addChild(cell);
            }
        }

        let symbols = this.getService ("PayTableService").getPayTable();

        let colWidth = (table.width - firstColWidth ) / numOfSymbols;
        let rowHeight = (table.height - firstRowHeight - bottomPadding ) / 3;

        for (let j = 0; j < 4; j++) {

            let multiplier = new Text ({
                text: "x"+(5-j),
                font: "bold 20px Arial",
                color: "#461408",
                textAlign: "center",
                textBaseline: "middle",
                stroke: {
                    outline: 4,
                    color: "#ccc06a"
                }
            }, this.alias);
            multiplier.name = "multiplier";

            grid[0][j+1].addChild(multiplier);
            grid[0][j+1].setChildTop(multiplier, "50%");
            grid[0][j+1].setChildLeft(multiplier, "50%");
        }

        let i = 0;
        //for (let i = 0; i < numOfCols; i++) {
        for (let id in symbols) {

            let symbol = symbols[id];

            if (symbol[0].trigger !== undefined || symbol[0].wild_multiplier) {
                continue;
            }

            let pictureContainer = new Container();
            pictureContainer.name = "pictureContainer";

            let slotMachine = this.getService("SlotMachineService").getInstance();
            let picture = slotMachine.getSymbol(id);

            picture.scaleX = picture.scaleY = imageScale;
            picture.name = "picture";

            pictureContainer.height = firstRowHeight;
            pictureContainer.width = colWidth;
            pictureContainer.addChild(picture);
            pictureContainer.setChildAlign("center",picture);
            pictureContainer.setChildVerticalAlign("middle",picture);
            grid[i+1][0].addChild(pictureContainer);

            for (let j = 0; j < symbol.length; j++) {
                let multiplier = symbol[j].multiplier ? symbol[symbol.length-j-1].multiplier.toString() : "";
                let text = new BitmapText ({
                    text: multiplier,
                    alias: "bonus",
                    scaleX: valueScale,
                    scaleY: valueScale,

                    spriteSheet: numbersSmallSpriteSheet
                }, "bonus");


                grid[i+1][j+1].addChild (text);

                text.x = grid[i+1][j+1].width/2 - text.getBounds().width/2 * text.scaleX;
                text.y = grid[i+1][j+1].height/2 - text.getBounds().height/2 * text.scaleY;

            }

            i++;
        }

        let rect = table.getBounds();
        table.cache(rect.x, rect.y, rect.width, rect.height);

    }

    initPayLinesData() {
        let linesContainer = this.querySelector("lines");
        if (!linesContainer) {
            return;
        }

        let lines = linesContainer.getChildByName("lines");

        let offsetX = lines.x - 3;
        let offsetY = lines.y + 16;

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 4; j++) {
                let lineNumber = new Text ({
                    text: (i + j*5 + 1).toString(),
                    font: "bold 19px Arial",
                    color: "#451408",
                    textAlign: "right",
                    lineHeight: 20,
                    stroke: {
                        color: "#ccc06a",
                        outline: 3
                    }
                },this.alias);

                lineNumber.x = offsetX + i * 127 - 5;
                lineNumber.y = offsetY + j * 67;

                linesContainer.addChild (lineNumber);

            }
        }

    }
    initScatterPage () {
        let scattersContainer = this.querySelector("scatters");

        if (!scattersContainer) {
            return;
        }

        let slotMachine = this.getService("SlotMachineService").getInstance();
        let extraSymbol = slotMachine.getSymbol(9);
        extraSymbol.name = "extraSymbol";

        let leftCol = this.querySelectorContainer("scatterLabel", scattersContainer).x;
        let rightCol = this.querySelectorContainer("stickyScatterLabel", scattersContainer).x;

        extraSymbol.regX = extraSymbol.width/2;
        extraSymbol.x = leftCol;
        extraSymbol.y = 88;

        extraSymbol.scaleX = extraSymbol.scaleY = 0.75;

        scattersContainer.addChild(extraSymbol);

        let spriteSheet = slotMachine.getSpriteSheet();
        let scatter = new Sprite( {spriteSheet}, this.alias);
        scatter.gotoAndStop ("scatter_cycle");
        scatter.name = "stickyScatterBackground";

        scatter.regX = scatter.width/2;
        scatter.x = rightCol;
        scatter.y = 88;

        scatter.scaleX = scatter.scaleY = 1;
        scattersContainer.addChild(scatter);

        let extraSymbol2 = extraSymbol.clone();
        extraSymbol2.name = "extraSymbol2";
        extraSymbol2.x = rightCol;
        extraSymbol2.y = 88;

        scattersContainer.addChild(extraSymbol2);

        //scattersContainer.cache(0,0,scattersContainer.width, scattersContainer.height);
    }

    initWildPage () {
        let wildContainer = this.querySelector("wild");

        if (!wildContainer) {
            return;
        }

        let slotMachine = this.getService("SlotMachineService").getInstance();
        let extraSymbol = slotMachine.getSymbol(10);
        extraSymbol.name = "extraSymbol";
        extraSymbol.regX = extraSymbol.width/2;
        //extraSymbol.regY = extraSymbol.height/2;

        extraSymbol.x = wildContainer.width/2;
        extraSymbol.y = 98;
        //extraSymbol.y = maskExtraSymbol.y + maskExtraSymbol.height/2;

        extraSymbol.scaleX = extraSymbol.scaleY = 1.3;

        wildContainer.addChild(extraSymbol);
    }

    initBonusGamePage () {
        let bonusGameContainer = this.querySelector("bonusGame");

        if (!bonusGameContainer) {
            return;
        }

        let screenshotLabel = bonusGameContainer.getChildByName("screenshotLabel");

        //let maskExtraSymbol = this.querySelectorContainer("maskExtraSymbol", bonusGameContainer);


        let slotMachine = this.getService("SlotMachineService").getInstance();
        let extraSymbol = slotMachine.getSymbol(11);
        extraSymbol.name = "extraSymbol";
        extraSymbol.regX = extraSymbol.width/2;
        //extraSymbol.regY = extraSymbol.height/2;

        extraSymbol.x = bonusGameContainer.getChildByName ("bonusRichText").x;//maskExtraSymbol.x + maskExtraSymbol.width/2;
        extraSymbol.y = 100;//maskExtraSymbol.y + maskExtraSymbol.height/2;

        //extraSymbol.scaleX = extraSymbol.scaleY = 0.75;

        bonusGameContainer.addChild(extraSymbol);

        let screens = [
            bonusGameContainer.getChildByName ("screen_1"),
            bonusGameContainer.getChildByName ("screen_2"),
            bonusGameContainer.getChildByName ("screen_3")
        ];

        let texts = [
            bonusGameContainer.getChildByName ("screenshotLabel_1"),
            bonusGameContainer.getChildByName ("screenshotLabel_2"),
            bonusGameContainer.getChildByName ("screenshotLabel_3")
        ];

        const showScreen = (index) => {

            let fadeTime = 700;
            let showTime = 6000;

            createjs.Tween.get (screens[index], {override: true})
                .to ({visible: true, alpha: 0}, 0)
                .to ({alpha: 1}, fadeTime)
                .wait(showTime)
                .to ({alpha: 0, visible:false}, fadeTime)
                .call( () => {
                    showScreen ((index + 1) % screens.length)
                });
                /*.addEventListener("change", () => {
                    this.pageContainer.updateCache();
                });*/

            createjs.Tween.get (texts[index], {override: true})
                .to ({visible: true, alpha: 0}, 0)
                .to ({alpha: 1}, fadeTime)
                .wait(showTime)
                .to ({alpha: 0, visible:false}, fadeTime);
        };

        showScreen(0);

    }

    showSpinButton() {
        this.querySelector("SpinButton").visible = true;
    }

    hideSpinButton() {
        this.querySelector("SpinButton").visible = false;
    }


    hideHomeButton () {
        this.querySelector("main.homeButton").visible = false;
    }

    showHomeButton () {
        this.querySelector("main.homeButton").visible = true;
    }

    hideSettingsButton () {
        this.querySelector("main.settingsButton").visible = false;
    }

    showSettingsButton () {
        this.querySelector("main.settingsButton").visible = true;
    }

    hideAdditionalButtons () {
        this.hideHomeButton();
        this.hideSettingsButton();
    }

    showAdditionalButtons () {
        this.showHomeButton();
        this.showSettingsButton();
    }

    showAllButtons () {
        this.showSpinButton();
        this.showAdditionalButtons();
    }

    hideAllButtons () {
        this.hideSpinButton();
        this.hideAdditionalButtons();
    }

    _disableAutoSpinButton( button, icon, text ) {
        icon.x = 0;
        icon.y = 0;

        let countAutoSpins = this.controller.getCountAutoSpinValue();

        if(countAutoSpins == -2){
            countAutoSpins = this._autoInfinite;
        }

        if(this.getState().name.indexOf("STATE_FREE_SPINS") != -1 ){
            if (this.getService("AutoPlayService").isActive()) {

                let countCurrent = this.getService("AutoPlayService").getCurrentValue();

                if(countCurrent <= 0){
                    countCurrent = this.controller.getCountAutoSpinValue();
                }

                if(countCurrent == -2){
                    countCurrent = this._autoInfinite;
                }

                icon.gotoAndStop ("stop");
                icon.x = -30;
                icon.y = -5;
                text.text = countCurrent;
            } else {
                icon.gotoAndStop ("normal");

                text.text = countAutoSpins;
            }
        } else {

            icon.gotoAndStop ("stop");
            icon.x = -30;
            icon.y = -5;
            text.text = countAutoSpins;

        }

        button.mouseEnabled = false;
        button.mouseChildren = false;

        let grayScaleFilter = new createjs.ColorMatrixFilter([
            0.30,0.30,0.30,0,0, // red component
            0.30,0.30,0.30,0,0, // green component
            0.30,0.30,0.30,0,0, // blue component
            0,0,0,1,0  // alpha
        ]);

        button.filters = [
            grayScaleFilter
        ];
        let rect = button.getBounds ();
        button.cache(rect.x, rect.y, rect.width, rect.height);
    }

    _enableAutoSpinButton ( button, icon, text ) {
        icon.x = 0;
        icon.y = 0;

        button.mouseEnabled = true;
        button.mouseChildren = true;

        button.filters = [];
        button.uncache();
    }

    disableAutospinButton () {
        let autoButton = this.querySelector("main.autoBtn");
        let elIcon = this.querySelector("main.SpinButton.expandSpinSettings.autoBtn.autoIcon");
        let elText = this.querySelector("main.SpinButton.expandSpinSettings.autoBtn.autoIconText");

        this._disableAutoSpinButton(autoButton, elIcon, elText);

        let autoButtonV = this.querySelector("main.autoBtnV");
        let elIconV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconV");
        let elTextV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconTextV");

        this._disableAutoSpinButton(autoButtonV, elIconV, elTextV);
    }

    enableAutospinButton () {
        let autoButton = this.querySelector("main.autoBtn");
        let elIcon = this.querySelector("main.SpinButton.expandSpinSettings.autoBtn.autoIcon");
        let elText = this.querySelector("main.SpinButton.expandSpinSettings.autoBtn.autoIconText");

        this._enableAutoSpinButton(autoButton, elIcon, elText);

        let autoButtonV = this.querySelector("main.autoBtnV");
        let elIconV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconV");
        let elTextV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconTextV");

        this._enableAutoSpinButton(autoButtonV, elIconV, elTextV);
    }

    stopAutoSpins () {
        this.getService ("AutoPlayService").stopAutoSpins();
        this.autoSpinActive = false;

        //let autoButton = this.querySelector("main.autoBtn");
        let elIcon = this.querySelector("main.SpinButton.expandSpinSettings.autoBtn.autoIcon");
        let elText = this.querySelector("main.SpinButton.expandSpinSettings.autoBtn.autoIconText");

        //let autoButtonV = this.querySelector("main.autoBtnV");
        let elIconV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconV");
        let elTextV = this.querySelector("main.SpinButton.expandVerticalNormalSettings.autoBtnV.autoIconTextV");

        let counter = this.querySelector("freeCounter");
        let statePlay = this.querySelector("main.SpinButton.states.play");
        counter.visible = false;
        statePlay.visible = true;
        this.spinStatePlay.disabled = true;
        this.spinStatePlay.visible = true;
        this.spinStatePlay.gotoAndStop(this.quickSpinEnable === false ? "normal" : "fast");
        this.spinBtnStatesGl.gotoAndStop(this.quickSpinEnable === false ? "normal" : "fast");

        elIcon.x = 0;
        elIcon.y = 0;
        elIconV.x = 0;
        elIconV.y = 0;

        elIcon.gotoAndStop ("normal");
        elIconV.gotoAndStop ("normal");

        let countAutoSpins = this.controller.getCountAutoSpinValue();

        if(countAutoSpins == -2){
            countAutoSpins = this._autoInfinite;
        }

        elText.setText(countAutoSpins);
        elText.color = "#16fcc3";
        elTextV.setText(countAutoSpins);
        elTextV.color = "#16fcc3";
    }

    changeFreeCounterBeforeSpin(){

    }
};
