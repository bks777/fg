import ViewCanvasHandler from "../../../../bower_components/html5-game-kernel/views/interfaces/ViewCanvasHandler.es6";
import config from "./config";

import FreeSpinStartPopup from "./freeSpinStartPopup/freeSpinStartPopup";
import FreeSpinEndPopup from "./freeSpinEndPopup/freeSpinEndPopup";
import FreeSpinResumePopup from "./freeSpinResumePopup/freeSpinResumePopup";


export default class FreespinsViewHandler extends ViewCanvasHandler {

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

        this._startPopup = new FreeSpinStartPopup({}, this.alias);
        this._endPopup = new FreeSpinEndPopup({}, this.alias);
        this._resumePopup = new FreeSpinResumePopup({}, this.alias);

        this.getLayout().visible = false;
        //this.showEndPopup();

        this._inited = true;

    }

    showStartPopup (resolve) {
        this._startPopup.show(resolve);
    }

    showEndPopup (isWin) {
        return this._endPopup.show(isWin);
    }

    hideEndPopup () {
        return this._endPopup.hide();
    }

    showResumePopup () {
        return this._resumePopup.show();
    }

    showSelectedHeader () {
        let data = this.getService("ProtocolService").getCurrentReelsData("freespins");
        if (!data) {
            return;
        }

        let wildId = data.wildId;

        let header = this.querySelector(`header`);

        if  (wildId >= 10 && wildId <= 12) {
            header.gotoAndStop (`Cut_head_${wildId}`);
        }

    }

    activateVerticalMode () {

    }

    activateHorizontalMode () {

    }
}