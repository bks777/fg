import BackgroundHandler from "../../../CommonComponents/Background/viewHandler/backgroundHandler.es6.js";
import config from "./config";
/**
 * Background handler
 */
export default class BackgroundMobileHandler extends BackgroundHandler {

    constructor(data = {}){
        super(data);

        this.ready = false;

        this.isMain = false;
    }

    initHandler () {
        this.ready = true;
        this.initLayout(config);
        this.initChildren(config.children);

        this._background = this.querySelector("background");
    }

    /**
     * Show main background
     */
    showMainBackground(){

        if(!this.ready){
            this.initHandler();
        }

        this.isMain = true;

        this.querySelector("logo").visible = true;
        this.querySelector("luckyLogo").visible = true;
        // this.querySelector("rightGirl").visible = true;
        // this.querySelector("leftGirl").visible = true;
        this.querySelector("pool").visible = true;

        this.changeBackground("background_main", this.alias);

        setTimeout(()=>{
            if($_view_canvas.verticalMode){
                this.activateVerticalMode();
            } else {
                this.activateHorizontalMode();
            }
        }, 20);
    }

    /**
     * Show free spins background
     */
    showFreeSpinBackground(){

        this.isMain = false;

        this.changeBackground("background_free_spins", this.alias);

        try{
            this.querySelector("logo").visible = false;

            this.querySelector("luckyLogo").visible = false;
            // this.querySelector("rightGirl").visible = false;
            // this.querySelector("leftGirl").visible = false;
            this.querySelector("pool").visible = false;
        } catch(e){
            setTimeout(this.showFreeSpinBackground, 20);
            $_log.error(e);
        }
    }

    activateVerticalMode () {

        if(this.isMain){
            this.querySelector("logo").visible = true;
            this.querySelector("logo").y = 0;
        }

        this.verticalMode = true;
        if (this._background) {
            this._background.y = 0;
        }
    }

    activateHorizontalMode () {

        this.querySelector("logo").visible = false;

        this.verticalMode = false;
        if (this._background) {
            if (this.type === "bonus") {
                this._background.y = -60;
            } else {
                this._background.y = 0;
            }
        }
    }
}
