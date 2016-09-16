import ViewCanvasHandler from "../../../../bower_components/html5-game-kernel/views/interfaces/ViewCanvasHandler.es6.js";

import config from "./config.js";

/**
 * Reel HTML Handler
 * @constructor
 */
export default class PreloaderCommonViewHandler extends ViewCanvasHandler {

    constructor (data = {}) {
        super(data);

        this.init(data);

        this.preloaderImage = null;
        this.progressBar = null;
        this._prevProgress = 0;
    }

    /**
     * Init Handler interface control
     */
    initHandler ()
    {
        this.initLayout(config);
        this.initChildren(config.children);

        this.mainLoaded = false;

        if(this.getService("PopupService").hasCritError()){
            this.getLayout().visible = false;
        }

        let logoCompany = this.querySelector("logoCompany");
        let logoGame = this.querySelector("logoGame");

        let tweenID = this.startTweenTarget(logoCompany);
        logoCompany.play();

        logoCompany.addEventListener ("animationend", () => {
            logoCompany.gotoAndStop(11); //39 for old logo

            createjs.Tween.get(logoCompany).to ({alpha: 0}, 600). call ( () => {
                this.endTween(tweenID);
                logoCompany.visible = false;
                logoCompany.alpha = 1;

                logoGame.alpha = 0;
                logoGame.visible = true;
                //this.getStage().requestUpdate();
                let tweenID = this.startTweenTarget(logoGame);
                createjs.Tween.get(logoGame).to ({alpha: 1}, 600). call ( () => {

                    this.endTween(tweenID);
                    this.requestUpdateTarget(logoGame);
                });
            });

        });

        //$_signal.goTo('!preloader.endPreload');
        //this.getLayout().visible = false;
    };



    /**
     * Progress handle
     * @param progress
     */
    progressHandler (progress)
    {
        if (this.mainLoaded) {
            return;
        }

        if(this.getService("PopupService").hasCritError()){
            this.getLayout().visible = false;
        }

        let loadingText = this.querySelector("loadingText");
        loadingText.setText (`${progress}%`);
        this.requestUpdateTarget(loadingText);

        let progressbar = this.querySelector("progressbar");

        let mask = new createjs.Shape();
        mask.graphics.drawRect(progressbar.x, progressbar.y, progressbar.width/100*progress, progressbar.height);
        progressbar.mask = mask;

        this.requestUpdateTarget(progressbar);

        if (progress === 100 && !this.mainLoaded) {

            this.mainLoaded = true;

        }

    };


    hide (){
        let layout = this.getLayout();

        layout.cache(0,0,layout.width, layout.height);
        //this.getStage().removeChild(layout);
        let tweenID = this.startTween();
        let stage = this.getStage();

        //$_stateMachine.goToState("START_ROUTER");

        setTimeout ( () => { /* timeout need for blur effect */

            createjs.Tween.get(layout, {ignoreGlobalPause: true}).to({alpha:0, visible:false}, 300).call(() => {
                layout.visible = false;
                this.endTween(tweenID);
                let stage = this.getStage();
                stage.removeChild(layout);
                stage.requestUpdate();
            }).addEventListener("change", () => {
                layout.updateCache();
                stage.requestUpdate();
            });
        },300);


    }

};
