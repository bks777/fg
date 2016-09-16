import PreloaderCommonViewHandler from "../../../CommonComponents/Preloader/viewHandler/preloaderCommonViewHandler.es6.js";

import config from "./config.js";

/**
 * Reel HTML Handler
 * @constructor
 */
export default class PreloaderDesktopViewHandler extends PreloaderCommonViewHandler {

    constructor (data = {}) {
        super(data);

        this.init(config);

        this.preloaderImage = null;
        this.progressBar = null;
        this._prevProgress = 0;

        this._activeSlider = true;
    }

    /**
     * Init Handler interface control
     */
    initHandler ()
    {
        this.getController().keyStart = () => {};

        this.initLayout(config);
        this.initChildren(config.children);
        this.initHideButton();

        this.enableModalMode();

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

                    this.slideShowInfo();

                    this.endTween(tweenID);

                    //$_signal.goTo('!preloader.endPreload');
                    //this.initHideButton();

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
        if(this.getService("PopupService").hasCritError()){
            this.getLayout().visible = false;
        }

        if (this.mainLoaded) {
            return;
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
            //$_signal.goTo('!preloader.endPreload');
            //this.hide();
        }

    };

    slideShowInfo(){

        let slider = {

            slide_0: {
                block: this.querySelector("gameSlider.step1"),
                elements: {
                    from: {
                        context: this.querySelector("gameSlider.star3"),
                        top: 393 + 6,
                        left: 445 - 10
                    },
                    to: {
                        context: this.querySelector("gameSlider.star1"),
                        top: 388,
                        left: 346 - 21
                    }
                }
            },
            slide_1: {
                block: this.querySelector("gameSlider.step2"),
                elements: {
                    from : {
                        context: this.querySelector("gameSlider.star1"),
                        top: 393 + 6,
                        left: 346 - 9
                    },
                    to: {
                        context: this.querySelector("gameSlider.star2"),
                        top: 388,
                        left: 396 - 21
                    }
                }
            },
            slide_2: {
                block: this.querySelector("gameSlider.step3"),
                elements: {
                    from: {
                        context: this.querySelector("gameSlider.star2"),
                        top: 393 + 6,
                        left: 396 - 10
                    },
                    to: {
                        context: this.querySelector("gameSlider.star3"),
                        top: 388,
                        left: 445 - 21
                    }
                }
            }
        };

        let count = 0, max = 2;

        const animateSlide = () => {

            let current = slider[`slide_${count}`];

            createjs.Tween
                .get(current.block, {loop: false})
                .to({alpha:1}, 200)
                .wait(5000)
                .to({alpha: 0}, 300)
                .call(()=>{

                    if(count < max){
                        count++;
                    } else {
                        count = 0;
                    }

                    let next = slider[`slide_${count}`];

                    createjs.Tween
                        .get(next.elements.from.context, {loop: false})
                        .to({
                            top: next.elements.from.top,
                            left: next.elements.from.left,
                            scaleX: 0.4,
                            scaleY: 0.4,
                            alpha: 0.7
                        }, 300);

                    createjs.Tween
                        .get(next.elements.to.context, {loop: false})
                        .to({
                            top: next.elements.to.top,
                            left: next.elements.to.left,
                            scaleX: 0.73,
                            scaleY: 0.73,
                            alpha: 1
                        }, 300);


                    if(this._activeSlider){
                        setTimeout(animateSlide, 600);
                    }
                });
        };

        animateSlide();
    }
    
    initHideButton () {
        let button = this.querySelector("button");
        let arrow = this.querySelector("arrow");
        button.cursor = "pointer";

        button.regX = button.width/2;
        button.regY = button.height/2;

        //arrow.alpha = 0;

        /*createjs.Tween
            .get(arrow, {loop: true})
            .to({alpha:1}, 300)
            .wait(200)
            .to({alpha:0.8}, 300);*/


        let scale = 0.10;

        const onRollOverAction = (e) => {
            if (button.selected) {
                return;
            }

            if (button.mouseDown) {
                button.scaleX = (1-scale);
                button.scaleY = (1-scale);
            } else {
                button.scaleX = (1+scale);
                button.scaleY = (1+scale);
            }
        };
        const onRollOutAction = (e) => {
            if (button.selected) {
                return;
            }
            button.scaleX = 1;
            button.scaleY = 1;
        };
        const onMouseDownAction = (e) => {
            if (button.selected) {
                return;
            }
            button.mouseDown = true;
            button.scaleX = (1-scale*2);
            button.scaleY = (1-scale*2);
        };
        const onClickAction = (e) => {
            if (button.selected) {
                return;
            }

            this._activeSlider = false;

            //$_signal.goTo('!preloader.endPreload');
            this.disableModalMode();
            //$_signal.goTo("!protocol.loaded");

            //$_stateMachine.goToState("START_ROUTER");

            this.getController().keyStart();

            button.scaleX = 1;
            button.scaleY = 1;
            button.selected = true;


            let layout = this.getLayout();

            layout.cache(0,0,layout.width, layout.height);
            let stage = this.getStage();

            createjs.Tween.get(layout, {ignoreGlobalPause: true}).to({alpha:0, visible:false}, 300).call(() => {
                layout.visible = false;
                //this.disableModalMode();
                let stage = this.getStage();

                stage.removeChild(layout);
                stage.requestUpdate();

            }).addEventListener("change", () => {
                layout.updateCache();
                stage.requestUpdate();
            });

        };
        const onPressUpAction = (e) => {
            if (button.selected) {
                return;
            }

            if (e.currentTarget.mouseDown
                && e.localX >= 0 && e.localX <= e.currentTarget.width
                && e.localY >= 0 && e.localY <= e.currentTarget.height ) {
                onClickAction();
            }
            button.mouseDown = false;
        };

        button.addEventListener("rollover", onRollOverAction);
        button.addEventListener("rollout", onRollOutAction);
        button.addEventListener ("mousedown", onMouseDownAction);
        button.addEventListener ("pressup", onPressUpAction);
        button.addEventListener ("click", onClickAction);
    }


    hide (){
        let progressbarBackground = this.querySelector("progressbarBackground");
        let progressbar = this.querySelector("progressbar");
        let loadingText = this.querySelector("loadingText");


        let arrow = this.querySelector("arrow");
        let button = this.querySelector("button");

        createjs.Tween
            .get(progressbar, {ignoreGlobalPause: true})
            .to({alpha:0, visible:false}, 300);

        createjs.Tween
            .get(progressbarBackground, {ignoreGlobalPause: true})
            .to({alpha:0, visible:false}, 300);

        createjs.Tween
            .get(loadingText, {ignoreGlobalPause: true})
            .to({alpha:0, visible:false}, 300);

        createjs.Tween
            .get(button, {ignoreGlobalPause: true})
            .wait(300)
            .to({visible:true,alpha:0}, 0)
            .to({alpha:1}, 1000);

    }

};
