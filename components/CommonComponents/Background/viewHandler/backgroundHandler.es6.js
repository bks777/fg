import ViewCanvasHandler from "../../../../bower_components/html5-game-kernel/views/interfaces/ViewCanvasHandler.es6";

import config from "./config";

/**
 * Background handler
 */
export default class BackgroundHandler extends ViewCanvasHandler {

    constructor(data = {}){
        super(data);

        this.init(data);
    }

    initHandler () {
        this.initLayout(config);
        this.initChildren(config.children);

        this._background = this.querySelector("background");
    }

    changeBackground (src) {

        if (this._background) {
            this._background.image = $_required.getImageRawData(src, this.alias);
        }

    }

    /**
     * Show main background
     */
    showMainBackground(){
        this.querySelector("logo").visible = true;
        this.querySelector("luckyLogo").visible = true;
        this.querySelector("rightGirl").visible = true;
        this.querySelector("leftGirl").visible = true;
        this.querySelector("pool").visible = true;

        this.querySelector("fire_1").visible = true;
        this.querySelector("fire_2").visible = true;
        this.querySelector("fire_3").visible = true;

        this.changeBackground("background_main", this.alias);
        //this.updateCache();
    }

    /**
     * Show free spins background
     */
    showFreeSpinBackground(){
        this.changeBackground("background_free_spins", this.alias);

        this.querySelector("logo").visible = false;
        this.querySelector("luckyLogo").visible = false;
        this.querySelector("rightGirl").visible = false;
        this.querySelector("leftGirl").visible = false;
        this.querySelector("pool").visible = false;

        this.querySelector("fire_1").visible = false;
        this.querySelector("fire_2").visible = false;
        this.querySelector("fire_3").visible = false;
        //this.updateCache();
    }


    /**
     * Show bonus background
     */
    showBonusBackground(){
        //this.changeBackground("background_bonus", this.alias);
        //this.updateCache();
    }

    activateVerticalMode () {

    }

    activateHorizontalMode () {

    }
}
