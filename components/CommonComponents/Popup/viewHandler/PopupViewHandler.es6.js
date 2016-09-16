import ViewCanvasHandler from "./../../../../bower_components/html5-game-kernel/views/interfaces/ViewCanvasHandler.es6.js";
import PopupService from "../../../../bower_components/html5-game-kernel/interfaces/services/popupService.es6.js";
/**
 * Popup View Handler
 * @constructor
 */
export default class PopupViewHandler extends ViewCanvasHandler {
    constructor(data = {}, config = null) {
        super(data);

        if(config === null){
            return null;
        }

        this.config = config;

        this.ready = false;
        this._lastSystemErrorsName = null;
        this._cloneMessageOptions = {};

        this.systemPopup = this.infoPopup = this.gamePopup = this.blurBackground = this.blackBackground = null;
    }

    initHandler () {

        if(this.ready === true){
            return;
        }

        this.ready = true;

        this.initLayout(this.config);

        this.initChildren(this.config.children);

        this.controller = this.getController();

        this.systemPopup = this.querySelector("systemPopup");
        this.infoPopup = this.querySelector("infoPopup");

        /**
         * Mouse over event
         */
        const btnMouseOver = () => {
            this.getService("SoundService").play("audio_button_all_onMouseOver");
        };

        //this.querySelector("infoPopup.okButton").addEventListener("click", this.controller.systemPopupOkButtonClickAction.bind(this.controller));
        //this.querySelector("infoPopup.okButton").addEventListener('mouseover', btnMouseOver);

        //this.querySelector("systemPopup.okButton").addEventListener("click", controller.this.systemPopupOkButtonClickAction.bind(controller));
        //this.querySelector("systemPopup.okButton").addEventListener('mouseover', btnMouseOver);

        this.querySelector("gamePopup.okButton").addEventListener("click", this.controller.gamePopupOkButtonClickAction.bind(this.controller));
        this.querySelector("gamePopup.okButton").addEventListener('mouseover', btnMouseOver);

        this.gamePopup = this.querySelector("gamePopup");

        this.blackBackground = new Shape();
        this.blackBackground.graphics.beginFill("#000");
        this.blackBackground.alpha = 1;
        this.blackBackground.graphics.drawRect(0, 0, this.getLayout().width, this.getLayout().height);
        this.blackBackground.graphics.endFill();
        this.blackBackground.cache (0, 0, this.getLayout().width, this.getLayout().height);
        this.blackBackground.updateCache();
        this.blackBackground.visible = false;

        this.blurBackground = new Shape(); /* for clickable background */
        this.blurBackground.graphics.beginFill("#000");
        this.blurBackground.alpha = 0.01;
        this.blurBackground.graphics.drawRect(0, 0, this.getLayout().width, this.getLayout().height);
        this.blurBackground.graphics.endFill();
        this.blurBackground.cache (0, 0, this.getLayout().width, this.getLayout().height);
        this.blurBackground.updateCache();
        this.blurBackground.visible = false;

        this.systemAction = this.controller.systemPopupOkButtonClickAction.bind(this.controller);
        this.gameAction = this.controller.gamePopupOkButtonClickAction.bind(this.controller);

        this.querySelector("backgroundContainer").addChildAt(this.blackBackground,0);
        this.querySelector("backgroundContainer").addChildAt(this.blurBackground,0);
    }

    /**
     * Generate blur bg
     */
    generateBlurBg(){

        if (this.blur) {
            this.querySelector("backgroundContainer").removeChild(this.blur);
        }

        this.blur = $_view_canvas.generateBlurBackground();
        this.querySelector("backgroundContainer").addChildAt(this.blur,0);

        return this.blur;
    }

    unblur () {
        if (this.blur) {
            this.querySelector("backgroundContainer").removeChild(this.blur);
            this.blur = null;
        }
    }

    /**
     * Update blur if context game changes
     */
    updateOpenedBlurBg(){

        if(this.getService("PopupService")._findActive() !== null){
            this.generateBlurBg();
        } else {
            this.unblur();
        }

        let gameContainer = this.querySelector("gameBlockPopup");
        if(gameContainer.children.length > 0){
            let black = this.querySelectorContainer("black", gameContainer);

            if(black){
                black.width =  this.getCanvas().width;
                black.height =  this.getCanvas().height;
            }
        }

    }


    /**
     * Generate empty blue
     */
    showEmptyBlur(){
        this.generateBlurBg();
        this.blurBackground.visible = true;
    }

    createButton (text) {

        let okButton = this.querySelector("gamePopup.okButton");
        let okButtonText = this.querySelector("gamePopup.okButton.buttonText");

        let width = okButton.width,
            height = okButton.height;

        let buttonContainer = new Container();
        buttonContainer.width = width;
        buttonContainer.height = height;

        let button = new Button({
            "width": width,
            "height": height,
            "spriteSheet": {
                "images": ["popup_ok_button"],
                "frames": {"width": 48, "height": 25},
                "animations": {"normal": [2], "hover": [3], "clicked": [0], "disabled": [1]}
            }
        }, this.alias);
        button.name = "button";
        buttonContainer.addChild(button);

        let buttonText = new Text ({
            text: text,
            font: "bold 14pt Calibri",
            "color": "#55702B",
            "textAlign": "center",
            "textBaseline": "middle"
        });
        buttonText.name = "buttonText";
        buttonText.mouseEnabled = false;

        buttonContainer.addChild(buttonText);
        //buttonContainer.setChildVerticalAlign("middle", buttonText)
        buttonContainer.setChildLeft(buttonText, "50%");
        buttonContainer.setChildTop(buttonText, okButtonText.y);

        return buttonContainer;
    }

   initStandardPopup () {
        let okButton = this.querySelector("gamePopup.okButton");
        //okButton.regX = okButton.width/2;
        //okButton.regY = okButton.height/2;
        createjs.Tween.removeTweens(okButton);
        this.gamePopup.setChildLeft(okButton, "50%");
        //this.gamePopup.setChildBottom(okButton, 80);

        let retryButton = this.querySelector("gamePopup.retryButton");
        if (retryButton) {
            this.gamePopup.removeChild(retryButton);
            createjs.Tween.removeTweens(retryButton);
        }

        this.getLayout().setChildAlign("center", this.gamePopup);
        this.getLayout().setChildVerticalAlign("middle", this.gamePopup);
    }

    showFreeSpinsStartEffect () {
        let messageAliasContainer = this.querySelector("gamePopup.message_free_spins_start");
        let message1 = this.querySelector("gamePopup.message_free_spins_start.message_1");
        let message2 = this.querySelector("gamePopup.message_free_spins_start.message_2");
        let message3 = this.querySelector("gamePopup.message_free_spins_start.message_3");
        let message4 = this.querySelector("gamePopup.message_free_spins_start.winValue");

        message1.regX = message1.getBounds().width/2;
        message1.regY = message1.getBounds().height/2;

        message2.regX = message2.getBounds().width/2;
        message2.regY = message2.getBounds().height/2;

        message3.regX = message3.getBounds().width/2;
        message3.regY = message3.getBounds().height/2;

        message4.regX = message4.getBounds().width/2;
        message4.regY = message4.getBounds().height/2;

        let tl = new createjs.Timeline();
        let scale = message4.scaleX;
        tl.addTween (
            createjs.Tween
                .get(message1)
                .to ({scaleX: 0, scaleY: 0}, 0)
                .wait(500)
                .to ({scaleX: 0.8, scaleY: 0.8}, 0)
                .to ({scaleX: 1.3, scaleY: 1.3}, 150)
                .call(()=>{
                    this.getService("SoundService").play("audio_popup_text");
                })
                .to ({scaleX: 1, scaleY: 1}, 70),

            createjs.Tween
                .get(message2)
                .to ({scaleX: 0, scaleY: 0}, 0)
                .wait(800)
                .to ({scaleX: 0.8, scaleY: 0.8}, 0)
                .to ({scaleX: 1.3, scaleY: 1.3}, 150)
                .call(()=>{
                    this.getService("SoundService").play("audio_popup_text");
                })
                .to ({scaleX: 1, scaleY: 1}, 70),

            createjs.Tween
                .get(message3)
                .to ({scaleX: 0, scaleY: 0}, 0)
                .wait(800)
                .to ({scaleX: 0.8, scaleY: 0.8}, 0)
                .to ({scaleX: 1.3, scaleY: 1.3}, 150)
                .to ({scaleX: 1, scaleY: 1}, 70),

            createjs.Tween
             .get(message4)
             .to ({scaleX: 0*scale, scaleY: 0 * scale}, 0)
             .wait(1100)
                .to ({scaleX: 10*scale, scaleY: 10 * scale}, 0)
                .call(()=>{
                    this.getService("SoundService").play("audio_popup_text");
                })
                .to ({scaleX: 1 *scale, scaleY: 1 *scale}, 90)

        );

    }

    showFreeSpinsEndEffect () {
        let messageAliasContainer = this.querySelector("gamePopup.message_free_spins_end");
        let message1 = this.querySelector("gamePopup.message_free_spins_end.message_1");
        let message2 = this.querySelector("gamePopup.message_free_spins_end.message_2");
        let message3 = this.querySelector("gamePopup.message_free_spins_end.winValue");

        message1.regX = message1.getBounds().width/2;
        message1.regY = message1.getBounds().height/2;

        message2.regX = message2.getBounds().width/2;
        message2.regY = message2.getBounds().height/2;

        message3.regX = message3.getBounds().width/2;
        message3.regY = message3.getBounds().height/2;
        messageAliasContainer.setChildLeft(message3, "50%");
        let scale = message3.scaleX;
        let tl = new createjs.Timeline();

        tl.addTween (
            createjs.Tween
                .get(message1)
                .to ({scaleX: 0, scaleY: 0}, 0)
                .wait(500)
                .to ({scaleX: 0.8, scaleY: 0.8}, 0)
                .call(()=>{
                    this.getService("SoundService").play("audio_popup_text");
                })
                .to ({scaleX: 1.3, scaleY: 1.3}, 150)
                .to ({scaleX: 1, scaleY: 1}, 70),

            createjs.Tween
                .get(message2)
                .to ({scaleX: 0, scaleY: 0}, 0)
                .wait(800)
                .to ({scaleX: 0.8, scaleY: 0.8}, 0)
                .call(()=>{
                    this.getService("SoundService").play("audio_popup_text");
                })
                .to ({scaleX: 1.3, scaleY: 1.3}, 150)
                .to ({scaleX: 1, scaleY: 1}, 70),

            createjs.Tween
                .get(message3)
                .to ({scaleX: 0*scale, scaleY: 0 * scale}, 0)
                .wait(1400)
                .to ({scaleX: 10*scale, scaleY: 10 * scale}, 0)
                .call(()=>{
                    this.getService("SoundService").play("audio_sound_numbers");
                })
                .to ({scaleX: 1 *scale, scaleY: 1 *scale}, 90)
        );

    }

    showFreeSpinsAddEffect () {
        let messageAliasContainer = this.querySelector("gamePopup.message_free_spins_add");
        let message1 = this.querySelector("gamePopup.message_free_spins_add.message_1");
        let message2 = this.querySelector("gamePopup.message_free_spins_add.message_2");
        let message3 = this.querySelector("gamePopup.message_free_spins_add.message_3");
        let message4 = this.querySelector("gamePopup.message_free_spins_add.winValue");

        message1.regX = message1.getBounds().width/2;
        message1.regY = message1.getBounds().height/2;

        message2.regX = message2.getBounds().width/2;
        message2.regY = message2.getBounds().height/2;

        //message3.regX = message3.getBounds().width/2;
        //message3.regY = message3.getBounds().height/2;

        message4.regX = message4.getBounds().width/2;
        message4.regY = message4.getBounds().height/2;

        let tl = new createjs.Timeline();
        let scale = message4.scaleX;
        tl.addTween (
            createjs.Tween
                .get(message1)
                .to ({scaleX: 0, scaleY: 0}, 0)
                .wait(500)
                .to ({scaleX: 0.8, scaleY: 0.8}, 0)
                .to ({scaleX: 1.3, scaleY: 1.3}, 150)
                .to ({scaleX: 1, scaleY: 1}, 70)
                .call(()=>{
                    this.getService("SoundService").play("audio_popup_text");
                }),

            createjs.Tween
                .get(message2)
                .to ({scaleX: 0, scaleY: 0}, 0)
                .wait(800)
                .to ({scaleX: 0.8, scaleY: 0.8}, 0)
                .to ({scaleX: 1.3, scaleY: 1.3}, 150)
                .to ({scaleX: 1, scaleY: 1}, 70)
                .call(()=>{
                    this.getService("SoundService").play("audio_popup_text");
                }),

            createjs.Tween
                .get(message3)
                .to ({scaleX: 0, scaleY: 0}, 0)
                .wait(800)
                .to ({scaleX: 0.8, scaleY: 0.8}, 0)
                .to ({scaleX: 1.3, scaleY: 1.3}, 150)
                .to ({scaleX: 1, scaleY: 1}, 70)
                .call(()=>{
                    this.getService("SoundService").play("audio_popup_text");
                }),

            createjs.Tween
                .get(message4)
                .to ({scaleX: 0*scale, scaleY: 0 * scale}, 0)
                .wait(1400)
                .to ({scaleX: 10*scale, scaleY: 10 * scale}, 0)
                .to ({scaleX: 1 *scale, scaleY: 1 *scale}, 90)
                .call(()=>{
                    this.getService("SoundService").play("audio_sound_multiplier");
                })

        );

    }

    showFreeSpinsEndZeroEffect() {
        let messageAliasContainer = this.querySelector("gamePopup.message_free_spins_end_zero");
        let message1 = this.querySelector("gamePopup.message_free_spins_end_zero.message_1");

        message1.regX = message1.getBounds().width/2;
        message1.regY = message1.getBounds().height/2;

        let tl = new createjs.Timeline();

        tl.addTween (
            createjs.Tween
                .get(message1)
                .to ({scaleX: 0, scaleY: 0}, 0)
                .wait(500)
                .to ({scaleX: 0.8, scaleY: 0.8}, 0)
                .to ({scaleX: 1.3, scaleY: 1.3}, 150)
                .to ({scaleX: 1, scaleY: 1}, 70)
                .call(()=>{
                    this.getService("SoundService").play("audio_popup_text");
                })
        );
    }

    showBonusStartEffect() {
        let messageAliasContainer = this.querySelector("gamePopup.message_bonus_start");
        let message1 = this.querySelector("gamePopup.message_bonus_start.message_1");
        let message2 = this.querySelector("gamePopup.message_bonus_start.message_2");

        message1.regX = message1.getBounds().width/2;
        message1.regY = message1.getBounds().height/2;

        message2.regX = message2.getBounds().width/2;
        message2.regY = message2.getBounds().height/2;

        let tl = new createjs.Timeline();

        tl.addTween (
            createjs.Tween
                .get(message1)
                .to ({scaleX: 0, scaleY: 0}, 0)
                .wait(500)
                .to ({scaleX: 0.8, scaleY: 0.8}, 0)
                .to ({scaleX: 1.3, scaleY: 1.3}, 150)
                .to ({scaleX: 1, scaleY: 1}, 70)
                .call(()=>{
                    this.getService("SoundService").play("audio_popup_text");
                }),

            createjs.Tween
                .get(message2)
                .to ({scaleX: 0, scaleY: 0}, 0)
                .wait(800)
                .to ({scaleX: 0.8, scaleY: 0.8}, 0)
                .to ({scaleX: 1.3, scaleY: 1.3}, 150)
                .to ({scaleX: 1, scaleY: 1}, 70)
                .call(()=>{
                    this.getService("SoundService").play("audio_popup_text");
                })

        );
    }

    showAutoGameEndEffect () {
        let messageAliasContainer = this.querySelector("gamePopup.message_auto_game_end");
        let message1 = this.querySelector("gamePopup.message_auto_game_end.message_1");
        let message2 = this.querySelector("gamePopup.message_auto_game_end.message_2");

        let winValue = message1.getChildByName ("winValue");
        let message = message1.getChildByName ("message");
        winValue.x = message.x + message.getBounds().width + 5;


        //message1.regX = message1.getBounds().width/2;
        message1.regX = (message.getBounds().width + 41)/2;

        message1.regY = message1.getBounds().height/2;
        message1.x = messageAliasContainer.width/2;

        message2.regX = message2.getBounds().width/2;
        message2.regY = message2.getBounds().height/2;

        let tl = new createjs.Timeline();
        tl.addTween (
            createjs.Tween
                .get(message1)
                .to ({scaleX: 0, scaleY: 0}, 0)
                .wait(500)
                .to ({scaleX: 0.8, scaleY: 0.8}, 0)
                .to ({scaleX: 1.3, scaleY: 1.3}, 150)
                .to ({scaleX: 1, scaleY: 1}, 70)
                .call(()=>{
                    this.getService("SoundService").play("audio_popup_text");
                }),

            createjs.Tween
                .get(message2)
                .to ({scaleX: 0, scaleY: 0}, 0)
                .wait(800)
                .to ({scaleX: 0.8, scaleY: 0.8}, 0)
                .to ({scaleX: 1.3, scaleY: 1.3}, 150)
                .to ({scaleX: 1, scaleY: 1}, 70)
                .call(()=>{
                    this.getService("SoundService").play("audio_popup_text");
                })
        );

    }

    showCustomPopup (data) {
        if (!data.target) {
            return;
        }

        let {
            blur = true,
            blurTime = 0,
            showTime = 0,
            modal = true,

            target
            } = data;

        let blurBitmap;
        if (blur) {
            this.generateBlurBg();
            //blurBitmap = this.generateBlurBg();
            //this.getLayout().addChild(blurBitmap);
            //this.unblur();

            if (blurTime) {
                this.blur.alpha = 0;

                createjs.Tween
                    .get(this.blur, {override:true})
                    .to ({alpha: 1}, blurTime);
            }

        }

        /*this.unblur();
        this.generateBlurBg();*/

        if (modal) {
            this.enableModalMode();
        }

        this.getLayout().addChild(target);
        this.getLayout().setChildAlign("center", target);
        this.getLayout().setChildVerticalAlign("middle", target);

        target.alpha = 0;

        let rect = target.getBounds();
        target.cache (rect.x, rect.y, rect.width, rect.height);

        createjs.Tween
            .get(target, {override:true})
            .wait(blurTime)
            .to ({alpha: 1}, showTime)
            .call(() => {
                target.uncache();

                if (data.callback && typeof data.callback === "function") {
                    data.callback();
                }
            });


    }

    hideCustomPopup (data, resolve) {
        createjs.Tween
            .get(data.target, {override:true})
            .to ({alpha: 0}, 60)
            .call(() => {
                this.getLayout().removeChild(data.target);
            });

        if (this.blur && this.getService("PopupService").getLength() == 0) {
            createjs.Tween
                .get(this.blur, {override:true})
                .to ({alpha: 0}, 60)
                .call(() => {
                    //this.getLayout().removeChild(this.blurBitmap);
                    this.unblur();
                    this.disableModalMode();
                    resolve()
                    //delete this.blurBitmap;
                });
        } else {
            this.unblur();
            this.disableModalMode();
            resolve();
        }

        //this.getService("PopupService").removeCustomPopup(this.getService("PopupService").getActiveName(PopupService.CUSTOM_POPUP));
    }

    /**
     * Transform message info|errors|systems
     * @param type
     * @param message
     * @param textObject
     */
    setTranslationMessage(type, message, textObject){

        if(this._cloneMessageOptions[type] === undefined){
            this._cloneMessageOptions[type] = textObject;
        }

        let cloneProperty = this._cloneMessageOptions[type];

        if(message instanceof Object){

            for(let key in message){
                cloneProperty[key] = message[key];
            }

        } else {
            cloneProperty.text = message;
        }

        textObject = cloneProperty;
    }

    /**
     * Clear translations message
     * @param type
     */
    clearTranslationMessage(type){

        delete this._cloneMessageOptions[type];
    }

    setPopupToCenterOfGameContainer (popup) {
        let gameContainer = this.getGameContainer();

        popup.y = (gameContainer.y > 0 ? gameContainer.y : 0) + gameContainer.height/2 - (popup.height/2 - popup.regY);
    }

    updateBlur (withoutPopupLayer = false) {
        if (this.blur) {

            if(withoutPopupLayer){
                this.getLayout().visible = false;
            }

            if (this._currentPopup) {
                this._currentPopup.visible = false;
            }
            this.generateBlurBg();

            if(withoutPopupLayer){
                this.getLayout().visible = true;
            }

            if (this._currentPopup) {

                this.setPopupToCenterOfGameContainer (this._currentPopup);
                this._currentPopup.visible = true;
            }
        }
    }

    /**
     * Show popup layer
     * @param type
     * @param object
     * @param showBG
     */
    _showPopupLayer(type = 0, object = {}, showBG = true){

        $_services.getService("SlotMachineService").setPaused(true);

        this.enableModalMode();
        let popup;

        switch (type){

            case PopupService.EMPTY_POPUP:

                if(showBG){

                    if(this.blur){
                        this.blur.visible = true;
                    }

                    this.generateBlurBg();

                    this.blurBackground.visible = true;
                }

                break;

            case PopupService.GAME_POPUP:

                this.controller.activeGameAction = true;

                popup = this.querySelector("gamePopup");
                this.setPopupToCenterOfGameContainer (popup);
                popup.visible = true;

                if(showBG){

                    //this.blur.visible = true;

                    this.generateBlurBg();

                    this.blurBackground.visible = true;
                }

                setTimeout(()=>{
                    this.blurBackground.addEventListener("click", this.gameAction);
                }, 2000);//Концептуально необходимое решение для приавильного отображения попапа

                break;

            case PopupService.CUSTOM_POPUP:

                if(object.properties){

                    popup = object.properties[0].target;
                    this.setPopupToCenterOfGameContainer (popup);
                    popup.visible = true;
                }

                if(showBG){
                    if(this.blur){
                        //this.blur.visible = true;
                    }

                    //this.blurBackground.visible = true;
                }

                break;

            case PopupService.INFO_POPUP:

                popup = this.querySelector("infoPopup");
                this.setPopupToCenterOfGameContainer (popup);
                popup.visible = true;

                if(showBG){
                    this.generateBlurBg();
                    this.blurBackground.visible = true;
                }

                this.blurBackground.addEventListener("click", this.systemAction);

                break;

            case PopupService.ERROR_POPUP:

                popup = this.querySelector("systemPopup");
                this.setPopupToCenterOfGameContainer (popup);
                popup.visible = true;

                if (showBG && this.blackBackground) {
                    this.blackBackground.visible = true;
                }

                this.getService("SoundService").muteGroup("main");

                if(this.getLayout("preloader")){
                    this.getLayout("preloader").visible = false;
                }

                break;
        }

        this._currentPopup = popup;
    }

    /**
     * Hide popup layer
     * @param type
     * @param object
     * @param hideBG
     */
    _hidePopupLayer(type = 0, object = {}, hideBG = true){

        $_services.getService("SlotMachineService").setPaused(false);

        this.disableModalMode();

        switch (type){

            case PopupService.EMPTY_POPUP:

                if(hideBG){
                    if(this.blur){
                        this.blur.visible = false;
                    }
                    this.unblur();

                    if (this.blurBackground) {
                        this.blurBackground.visible = false;
                    }
                }

                break;

            case PopupService.GAME_POPUP:

                this.controller.activeGameAction = false;

                if(!this.querySelector("gamePopup")){
                    return ;
                }

                this.querySelector("gamePopup").visible = false;


                if(hideBG){
                    this.blur.visible = false;
                    this.unblur();

                    if (this.blurBackground) {
                        this.blurBackground.visible = false;
                    }
                }

                this.blurBackground.removeEventListener("click", this.gameAction);

                break;

            case PopupService.CUSTOM_POPUP:

                if(object.properties){
                    object.properties[0].target.visible = false;
                }

                if(hideBG){

                    if(this.blur){
                        //this.blur.visible = false;
                    }

                    if (this.blurBackground) {
                        //this.blurBackground.visible = false;
                    }
                }

                this.hideCustomPopup ({target: object.properties[0].target});

                break;

            case PopupService.INFO_POPUP:

                if(!this.querySelector("infoPopup")){
                    return ;
                }

                this.querySelector("infoPopup").visible = false;

                if(hideBG){
                    this.unblur();

                    if (this.blurBackground) {
                        this.blurBackground.visible = false;
                    }
                }

                this.blurBackground.removeEventListener("click", this.systemAction);

                break;

            case PopupService.ERROR_POPUP:

                if(!this.querySelector("systemPopup")){
                    return ;
                }

                this.querySelector("systemPopup").visible = false;

                if (hideBG && this.blackBackground) {
                    this.blackBackground.visible = false;
                }

                this.getService("SoundService").raiseGroup("main");

                if(this.getLayout("preloader")){
                    this.getLayout("preloader").visible = false;
                }

                break;
        }

        this._currentPopup = null;
    }

    /**
     * Show popup layer
     * @param type
     * @param object
     * @param showBG
     * @param resolved
     */
    showPopupLayer(type = 0, object = {}, showBG = true, resolved){

        if(!this.getEvent().ready){
            this.getEvent().addErrorsToSubscribe(object.name, this, "showPopupLayer", [type, object, showBG, resolved]);
            return;
        }

        let popup;

        let promise = [];

        promise.push(new Promise((resolve)=>{
            $_services.getService("SlotMachineService").setPaused(true);

            this.enableModalMode();

            resolve();
        }));

        switch (type){

            case PopupService.EMPTY_POPUP:

                promise.push(new Promise((resolve)=>{
                    if(showBG){

                        if(this.blur){
                            this.blur.visible = true;
                        }

                        this.generateBlurBg();

                        this.blurBackground.visible = true;
                    }

                    resolve();
                }));

                break;

            case PopupService.GAME_POPUP:

                promise.push(new Promise((resolve)=>{

                    this.controller.activeGameAction = true;

                    popup = this.querySelector("gamePopup");
                    this.setPopupToCenterOfGameContainer (popup);
                    popup.visible = true;

                    this._currentPopup = popup;

                    if(showBG){

                        //this.blur.visible = true;

                        this.generateBlurBg();

                        this.blurBackground.visible = true;
                    }

                    if(this.autoClickGamePopup){
                        clearTimeout(this.autoClickGamePopup);
                    }

                    setTimeout(()=>{

                        this.blurBackground.addEventListener("click", this.gameAction);

                        if (this.getService("AutoPlayService").isActive() && object.name != "autoSpin"/* && !data.OkRetry*/) {
                            this.autoClickGamePopup = setTimeout (() => {
                                this.controller.gamePopupOkButtonClickAction();
                            },5000);
                        }
                        resolve();
                    }, 2000);
                }));

                break;

            case PopupService.CUSTOM_POPUP:

                promise.push(new Promise((resolve)=>{

                    if(object.properties){

                        popup = object.properties[0].target;
                        this.setPopupToCenterOfGameContainer (popup);
                        popup.visible = true;

                        this._currentPopup = popup;
                    }

                    this.generateBlurBg();

                    if(this.blur){
                        this.blur.visible = true;
                    } else {
                        this.generateBlurBg();
                    }

                    if(showBG){
                        //this.blurBackground.visible = true;
                    }

                    resolve();
                }));

                break;

            case PopupService.INFO_POPUP:

                promise.push(new Promise((resolve)=>{

                    popup = this.querySelector("infoPopup");
                    this.setPopupToCenterOfGameContainer (popup);
                    popup.visible = true;

                    this._currentPopup = popup;

                    if(showBG){
                        this.generateBlurBg();
                        this.blurBackground.visible = true;
                    }

                    setTimeout(()=>{
                        this.blurBackground.addEventListener("click", this.systemAction);
                        resolve();
                    }, 100);

                }));

                break;

            case PopupService.ERROR_POPUP:

                promise.push(new Promise((resolve)=>{

                    try{
                        this.showHomeButton();
                    } catch (e){

                    }


                    this.getService("SoundService").muteGroup("main");
                    this.getService("SoundService").muteGroup("background");

                    popup = this.querySelector("systemPopup");
                    this.setPopupToCenterOfGameContainer (popup);
                    popup.visible = true;

                    this._currentPopup = popup;

                    if (showBG && this.blackBackground) {
                        this.blackBackground.visible = true;
                    }

                    if(this.getLayout("preloader")){
                        this.getLayout("preloader").visible = false;
                    }

                    resolve();
                }));

                break;
        }

        Promise.all(promise).then(()=>{
            resolved();
        });
    }

    /**
     * Hide popup layer
     * @param type
     * @param object
     * @param hideBG
     * @param resolved
     */
    hidePopupLayer(type = 0, object = {}, hideBG = true, resolved){

        if(!this.getEvent().ready){
            this.getEvent().removeErrorsFromSubscribe(object.name);
            return;
        }

        if(type == PopupService.GAME_POPUP && object.active == false){
            resolved();
            return ;
        }

        let promise = [];

        switch (type){

            case PopupService.EMPTY_POPUP:

                promise.push(new Promise((resolve)=> {

                    if(hideBG){
                        if(this.blur){
                            this.blur.visible = false;
                        }
                        this.unblur();

                        if (this.blurBackground) {
                            this.blurBackground.visible = false;
                        }
                    }

                    setTimeout(()=>{
                        if(this.blackBackground && this.blackBackground.visible != false){
                            this.blurBackground.visible = false;
                        }

                        if (this.blur) {
                            this.blur.visible = false;
                        }

                        resolve();
                    }, 100);

                }));

                break;

            case PopupService.GAME_POPUP:

                promise.push(new Promise((resolve, reject)=> {

                    this.controller.activeGameAction = false;

                    if(!this.querySelector("gamePopup")){
                        reject();
                        return ;
                    }

                    this.querySelector("gamePopup").visible = false;


                    if(hideBG){
                        if (this.blur) {
                            this.blur.visible = false;
                        }

                        this.unblur();

                        if (this.blackBackground){
                            this.blackBackground.visible = false;
                        }

                        if (this.blurBackground) {
                            this.blurBackground.visible = false;
                        }
                    }

                    this.blurBackground.removeEventListener("click", this.gameAction);

                    if(this.autoClickGamePopup){
                        clearTimeout(this.autoClickGamePopup);
                    }

                    setTimeout(()=>{
                        if(this.blackBackground && this.blackBackground.visible != false){
                            this.blurBackground.visible = false;
                        }

                        if (this.blur) {
                            this.blur.visible = false;
                        }

                        resolve();
                    }, 100);

                }));

                break;

            case PopupService.CUSTOM_POPUP:

                promise.push(new Promise((resolve)=> {

                    if(object.properties){
                        object.properties[0].target.visible = false;
                    }

                    if(hideBG){
                        this.hideCustomPopup(object.properties[0], resolve);
                    }
                }));

                break;

            case PopupService.INFO_POPUP:

                promise.push(new Promise((resolve, reject)=> {

                    if(!this.querySelector("infoPopup")){
                        reject();
                        return ;
                    }

                    this.querySelector("infoPopup").visible = false;

                    if(hideBG){
                        this.unblur();

                        if (this.blurBackground) {
                            this.blurBackground.visible = false;
                        }
                    }

                    this.blurBackground.removeEventListener("click", this.systemAction);

                    resolve();
                }));

                break;

            case PopupService.ERROR_POPUP:

                promise.push(new Promise((resolve, reject)=> {

                    try{
                        this.hideHomeButton();
                    } catch(e){

                    }


                    this.getService("SoundService").raiseGroup("main");
                    this.getService("SoundService").raiseGroup("background");

                    if(!this.querySelector("systemPopup")){
                        reject();
                        return ;
                    }

                    this.querySelector("systemPopup").visible = false;

                    if (hideBG && this.blackBackground) {
                        this.blackBackground.visible = false;
                    }

                    if(this.getLayout("preloader")){
                        this.getLayout("preloader").visible = false;
                    }

                    resolve();
                }));

                break;
        }

        promise.push(new Promise(resolve => {
            $_services.getService("SlotMachineService").setPaused(false);

            this.disableModalMode();
            this._currentPopup = null;

            setTimeout(resolve, 50);
        }));

        Promise.all(promise).then(()=>{
            resolved();
        });
    }

    showLoadingAnimation () {
        let radius = 10;
        let bigRadius = 80;

        let circle = new createjs.Shape();
        circle.graphics
            .beginFill("#FFFFFF")
            .drawCircle(0, 0, radius)
            .endFill();

        this.loadingContainer = new Container();
        this.loadingContainer.x = this.getLayout().width/2;
        this.loadingContainer.y = this.getLayout().height/2;

        for (let i = 0; i <= 6; i++) {
            let c = circle.clone();
            c.x = Math.cos( i * Math.PI/6 ) * bigRadius;
            c.y = Math.sin( i * Math.PI/6 ) * bigRadius;
            this.loadingContainer.addChild(c);

            if (i !== 0 && i !== 6) {
                let c = circle.clone();
                c.x = Math.cos( -i * Math.PI/6 ) * bigRadius;
                c.y = Math.sin( -i * Math.PI/6 ) * bigRadius;
                this.loadingContainer.addChild(c);

                createjs.Tween
                    .get(c)
                    .to({alpha: i / 6})
            }
        }

        this.getLayout().addChild(this.loadingContainer);
    }

    hideLoadingAnimation () {
        this.getLayout().removeChild(this.loadingContainer);
    }

    /**
     * Show game
     * @param data
     */
    showGameInfoPopup (data) {

        //this.initHandler();
        this.initStandardPopup();

        //this.generateBlurBg();

        if (data.messageAlias) {
            this.querySelector("gamePopup.messageContainer").visible = false;
            this.querySelector("gamePopup.messageAliasContainer").visible = true;
            let messageAliasContainer = this.querySelector("gamePopup.messageAliasContainer");

            messageAliasContainer.children.forEach (child => {
                if (child.name === `message_${data.messageAlias}`) {
                    child.visible = true;

                    switch (data.messageAlias) {
                        case "free_spins_start":this.showFreeSpinsStartEffect(); break;
                        case "free_spins_end":this.showFreeSpinsEndEffect(); break;
                        case "free_spins_end_zero":this.showFreeSpinsEndZeroEffect(); break;
                        case "free_spins_add":this.showFreeSpinsAddEffect(); break;
                        case "bonus_start": this.showBonusStartEffect(); break;
                        case "auto_game_end": this.showAutoGameEndEffect(); break;
                    }

                } else {
                    child.visible = false;
                }
            });
        } else {
            this.querySelector("gamePopup.messageContainer").visible = true;
            this.querySelector("gamePopup.messageAliasContainer").visible = false;
            let message = this.querySelector("gamePopup.messageContainer.message");
            this.setTranslationMessage("game", data.message, message);
            this.clearTranslationMessage("game");
        }

        this.querySelector("gamePopup.buttonText").setText($_t.getText(data.okButtonName != null ? data.okButtonName : "OK"));

        let okButton = this.querySelector("gamePopup.okButton");

        this.querySelector("gamePopup.okButton.button").gotoAndStop("normal");

        this.getService("SoundService").play("audio_popup");

        if (data.OkRetry) {
            let retryButton = this.createButton($_t.getText(data.nextButtonName != null ? data.nextButtonName : "NO"));
            retryButton.name = "retryButton";

            retryButton.regX = retryButton.width/2;
            retryButton.regY = retryButton.height/2;

            this.gamePopup.addChild(retryButton);
            retryButton.top = okButton.top;

            okButton.left += okButton.width/2 + 15;
            retryButton.left = okButton.left - retryButton.width - 30;

            createjs.Tween
                .get(retryButton, {loop: true, override:true })
                .to ({scaleX: 1, scaleY: 1}, 0)
                .wait(2000)
                .to ({scaleX: 1.1, scaleY: 1.1}, 100)
                .to ({scaleX: 1, scaleY: 1}, 100);

            retryButton.addEventListener ("click", () => {
                if (data.retryAction !== undefined && typeof (data.retryAction) === "function") {
                    data.retryAction();
                }

                this.getService("PopupService").removeGamePopup(this.getService("PopupService").getActiveName(PopupService.GAME_POPUP));

                this.hideGamePopup();
            });
        } else {
            createjs.Tween
                .get(okButton, {loop: true, override:true })
                .to ({scaleX: 1, scaleY: 1}, 0)
                .wait(2000)
                .to ({scaleX: 1.1, scaleY: 1.1}, 100)
                .to ({scaleX: 1, scaleY: 1}, 100);
        }

        //this.gamePopup.visible = true;

        this.gamePopup.regX = this.gamePopup.width/2;
        this.gamePopup.regY = this.gamePopup.height/2;
        this.getLayout().setChildLeft(this.gamePopup, "50%");
        this.getLayout().setChildTop(this.gamePopup, "46%");
        this.gamePopup.scaleX = this.gamePopup.scaleY = 0;

        createjs.Tween
            .get(this.gamePopup)
            .to ({scaleX: 1.2, scaleY: 1.2}, 250)
            .to ({scaleX: 1, scaleY: 1}, 100, createjs.Ease.getPowOut (2));

        this.enableModalMode();

        if (data.state && this.controller.nextState.indexOf(data.state) == -1) {
            this.controller.nextState.push(data.state);
        }

        if (data.states) {

            for(let d = 0, ld = data.states.length; d < ld; d++){
                if(this.controller.nextState.indexOf(data.states[d]) == -1){
                    this.controller.nextState.push(data.states[d]);
                }
            }
        }

        //this.blurBackground.visible = true;

        //this.getService("SoundService").play("audio_popup");

        this.getStage().requestUpdate();
    }


    /**
     * Hide popup
     */
    hideGamePopup () {
        this.disableModalMode();

        this.getStage().requestUpdate();
    }

}