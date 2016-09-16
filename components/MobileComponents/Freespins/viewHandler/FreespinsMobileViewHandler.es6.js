import FreespinsViewHandler from "../../../CommonComponents/Freespins/viewHandler/FreespinsViewHandler.es6";
import config from "./config";
import FreeSpinStartMobilePopup from "./freeSpinStartPopup/freeSpinStartMobilePopup";
import FreeSpinEndMobilePopup from "./freeSpinEndPopup/freeSpinEndMobilePopup";
import FreeSpinResumeMobilePopup from "./freeSpinResumePopup/freeSpinResumeMobilePopup";

export default class FreespinsMobileViewHandler extends FreespinsViewHandler {

    constructor(data = {}){
        super(data);

        this._inited = false;
    }

    initHandler () {
        if (this._inited) {
            return;
        }

        this.initLayout(config);
        this.initChildren(config.children);

        this._startPopup = new FreeSpinStartMobilePopup({}, this.alias);
        this._endPopup = new FreeSpinEndMobilePopup({}, this.alias);
        this._resumePopup = new FreeSpinResumeMobilePopup({}, this.alias);

        this.getLayout().visible = false;
        //this.showEndPopup();

        this._inited = true;

    }

    activateVerticalMode () {

        this.verticalMode = true;

        if (!this._inited) {
            return;
        }

        if(this._startPopup){
            this._startPopup.update(this.verticalMode);
        }


        this.getLayout().y = 0;
    }

    activateHorizontalMode () {
        this.verticalMode = false;

        if (!this._inited) {
            return;
        }

        if(this._startPopup){
            this._startPopup.update(this.verticalMode);
        }

        this.getLayout().y = -60;
    }

}