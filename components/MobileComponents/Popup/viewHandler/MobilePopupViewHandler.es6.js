import PopupViewHandler from "../../../CommonComponents/Popup/viewHandler/PopupViewHandler.es6.js"

import config from "./config.js";

/**
 * Popup View Handler
 * @constructor
 */
export default class MobilePopupViewHandler extends PopupViewHandler {
    constructor(data = {}) {

        super(data, config);
    }

    showSystemInfoPopup (data) {

        this.initHandler();


        let message = this.querySelector("infoPopup.messageContainer.message");
        //this.setTranslationMessage("info", data.message, message);
        //this.clearTranslationMessage("info");

        if(data.message.text === undefined){
            message.setText(data.message);
        } else {
            message.setText(data.message.text);
        }

        this.querySelector("infoPopup.messageContainer").setChildVerticalAlign("middle", message);

        //message.text = data.message;

        this.controller.nextSystemState = [];

        this.controller._lastSystemErrorsName = data.name;

        if (data.state) {
            this.controller.nextSystemState.push(data.state);
        }

        if (data.states) {
            this.controller.nextSystemState.push(...data.states);
        }

        //this.infoPopup.visible = true;

        //this.generateBlurBg();
        //this.blurBackground.visible = true;
        //this.getStage().addEventListener("click", this.systemAction);

        this.enableModalMode();

        this.getStage().requestUpdate();
    }

    showSystemErrorPopup (data) {

        this.initHandler();

        let message = this.querySelector("systemPopup.messageContainer.message");

        if(data.message.text === undefined){
            message.setText(data.message);
        } else {
            message.setText(data.message.text);
        }

        this.querySelector("systemPopup.messageContainer").setChildVerticalAlign("middle", message);

        message.setText(data.message.text);

        //this.systemPopup.visible = true;
        //this.blackBackground.visible = true;

        this.enableModalMode();
        this.getStage().requestUpdate();
    }

    hideSystemPopup (data = null) {
        if (!this.ready) {
            return;
        }

        this.blurBackground.removeEventListener("click", this.systemAction);
    }


    /**
     * Hide all system popups
     */
    hideAllSystemPopups(){return ;
        if (!this.ready) {
            return;
        }
        if(this.systemPopup){
            //this.systemPopup.visible = false;
        }

        if(this.blackBackground){
            //this.blackBackground.visible = false;
        }

        if(this.blurBackground){
            //this.blurBackground.visible = false;

            this.blurBackground.removeEventListener("click", this.systemAction);
        }

        this.unblur();

        this.disableModalMode();

        this.getStage().requestUpdate();
    }

    /**
     * Generate blur bg
     */
    generateBlurBg(){

        if (this.blur) {
            this.getLayout().removeChild(this.blur);
        }

        let blurFilter = new createjs.BlurFilter(8, 8, 3);

        this.getGameContainer().filters = [blurFilter];
        let preloaderLayout = this.getLayout("preloader");
        if (preloaderLayout) {
            preloaderLayout.visible = false;
        }

        let settingsLayout = this.getLayout("settings"),
            messageContainer,
            fastMessageContainer;

        if (settingsLayout) {
            messageContainer = settingsLayout.getChildByName ("topBar").getChildByName("messageContainer");
            if (messageContainer) {
                messageContainer.visible = false;
            }
            fastMessageContainer = settingsLayout.getChildByName ("topBar").getChildByName ("fastMessageContainer");
            if (fastMessageContainer) {
                fastMessageContainer.visible = false;
            }
        }

        this.getLayout("control").filters = [blurFilter];
        this.getStage().filters = [blurFilter];
        this.getStage().cache (0,0,this.getCanvas().width,this.getCanvas().height);

        let blur = new Bitmap(this.getStage().cacheCanvas, this.alias);
        blur.name = "blur";

        let rect = blur.getBounds();
        blur.x = -(rect.width - this.getCanvas().width)/2;
        blur.y = -(rect.height - this.getCanvas().height)/2;

        this.getLayout().addChildAt(blur,0);

        if (messageContainer) {
            messageContainer.visible = true;
        }
        if (fastMessageContainer) {
            fastMessageContainer.visible = true;
        }


        this.getLayout("control").filters = [];
        this.getStage().filters = [];
        this.getStage().uncache();

        return this.blur = blur;
    }


    /**
     * Show home button
     */
    showHomeButton(){

        if(!this.homeBtn){

            this.homeBtn = new Container();
            this.homeBtn.top = 60;
            this.homeBtn.left = 20;

            this.getLayout().addChild(this.homeBtn);

            let icon = new Button({
                spriteSheet: {
                    images: ["home_btn"],
                    frames: {width: 88, height: 88},
                    animations: {normal: [0]}
                }
            }, this.alias);

            this.homeBtn.addChild(icon);

            icon.gotoAndStop("normal");
            icon.visible = true;

            this.homeBtn.addEventListener("click", ()=>{

                this.getService("SoundService").play("audio_options");

                let url = this.getService("GameSettingsService").getExitUrl();

                if (url) {
                    try {
                        window.parent.location = url;
                    } catch (e) {
                        window.location = url;
                    }
                }
            })
        }

        this.homeBtn.visible = true;
    }

    /**
     * Hide home button
     */
    hideHomeButton(){

        if(this.homeBtn){
            this.homeBtn.visible = false;
        }
    }
}