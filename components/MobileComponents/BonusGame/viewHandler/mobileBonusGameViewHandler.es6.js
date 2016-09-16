import BonusGameViewHandler from "../../../CommonComponents/BonusGame/viewHandler/bonusGameViewHandler.es6.js"
import config from "./config.js";
import BonusStartMobilePopup from "./bonusStartPopup/bonusStartPopup";
import BonusEndMobilePopup from "./bonusEndPopup/bonusEndPopup";
import BonusResumeMobilePopup from "./bonusResumePopup/bonusResumePopup";

import verticalConfig from "./vertical";
import horizontalConfig from "./gorizontal";

export default class MobileBonusGameViewHandler extends BonusGameViewHandler {

    constructor(data = {}){
        super(data, config);

        this._bonusInit = false;
    }

    initHandler () {
        this.controller = this.getController();

        this.initLayout(this.config);
        this.initChildren(this.config.children);

        this.initRoofAndFloor ();
        this.initColumnContainer();

        this.getLayout().visible =false;
        this._startPopup = new BonusStartMobilePopup({}, this.alias);
        this._endPopup = new BonusEndMobilePopup({}, this.alias);
        this._resumePopup = new BonusResumeMobilePopup({}, this.alias);
    }

    initBonusGame(){

        this._bonusInit = true;

        super.initBonusGame();

        //this.getLayout().y = 50;

        console.error(this.config, config);

        if($_view_canvas.verticalMode){
            this.activateVerticalMode();
        } else {
            this.activateHorizontalMode();
        }

        this.requestUpdate();
        //this.getLayout().visible =false;
    }

    /**
     * Change column height
     * @param height
     * @private
     */
    _changeColumnHeight(height = 405){

        let _count = this.querySelector("columnContainer").children.length;

        for(let i = 0; i < _count; i++){
            let el = this.querySelector("columnContainer").children[i];
            el.scaleY = height / 405;
        }

    }

    activateVerticalMode () {
        this.verticalMode = true;

        this.getLayout().y = 0;

        if(this._bonusInit){
            this.applyConfig(verticalConfig, this.getLayout());
            this._changeColumnHeight(431);
        }
    }

    activateHorizontalMode () {
        this.verticalMode = false;

        this.getLayout().y = 0;

        if(this._bonusInit){
            this.applyConfig(horizontalConfig, this.getLayout());
            this._changeColumnHeight(310);
        }
    }

    getLayout (alias = this.alias) {
        return super.getLayout (alias);
    }
}