import PopupViewHandler from "../../../CommonComponents/Popup/viewHandler/PopupViewHandler.es6.js"

import config from "./config.js";

/**
 * Popup View Handler
 * @constructor
 */
export default class DesktopPopupViewHandler extends PopupViewHandler {
    constructor(data = {}) {

        super(data, config);
    }

    showSystemInfoPopup (data) {

        this.initHandler();

        let message = this.querySelector("infoPopup.messageContainer.message");
        this.setTranslationMessage("info", data.message, message);
        this.clearTranslationMessage("info");

        //message.text = data.message;

        this.querySelector("infoPopup.title").setText(data.header ? data.header : $_t.getText("MESSAGE"));

        this.querySelector("infoPopup.buttonText").setText($_t.getText(data.okButtonName != null ? data.okButtonName : "Ok"));

        this.querySelector("infoPopup.okButton").addEventListener("click", this.systemAction);

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
        // this.blurBackground.addEventListener("click", this.systemAction);

        this.enableModalMode();

        this.getStage().requestUpdate();
    }

    showSystemErrorPopup (data) {

        this.initHandler();

        let message = this.querySelector("systemPopup.messageContainer.message");
        this.setTranslationMessage("error", data.message, message);
        this.clearTranslationMessage("error");

        this.querySelector("systemPopup.title").setText($_t.getText("ERROR!"));

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
}