import ViewCanvasHandler from "../../../../../bower_components/html5-game-kernel/views/interfaces/ViewCanvasHandler.es6.js";
//import Container from "../../../../../bower_components/html5-game-kernel/interfaces/modelsUI/Container.es6.js";
import config from "./config.js";

export default class FreeSpinStartPopup extends ViewCanvasHandler {

    constructor (config, alias) {
        super ({alias});
        this.tempTweens = [];
        this.initHandler ();

        this.suspendTweensColumns = false;
    }

    initHandler() {
        this.multipliersSelectable = false;

        this._container = new Container({
            width: this.getLayout().width,
            height: this.getLayout().height
        });
        // startPopup.name = "startPopup";
        // startPopup.width = (221+20)*3;
        this.initChildrenContainer( this._container, config.children);

        // this.startPopup = startPopup;

        let popups = {
            left: this._container.getChildByName("left"),
            center: this._container.getChildByName("center"),
            right: this._container.getChildByName("right")
        };

        let scale = 0.1;
        let countScale = 0.2;

        for (let p in popups) {
            let popup = popups[p];
            let freespinsCount = popup.getChildByName("value");
            let freespinsCountDefaultScale = freespinsCount.scaleX;

            popup.cursor = "pointer";

            const onRollOverAction = (e) => {
                if (!this.multipliersSelectable) {
                    return;
                }

                this.suspendAttraction();

                if (popup.mouseDown) {
                    popup.scaleX = popup.scaleY = (1-scale);
                    freespinsCount.scaleX = freespinsCount.scaleY = freespinsCountDefaultScale;//(1 - countScale) * freespinsCountDefaultScale;
                } else {
                    popup.scaleX = popup.scaleY = (1+scale);
                    freespinsCount.scaleX = freespinsCount.scaleY = (1 + countScale) * freespinsCountDefaultScale;
                }

                this._container.setChildIndex (popup, this._container.getNumChildren()-1);
            };
            const onRollOutAction = (e) => {

                this.resumeAttraction();

                if (!this.multipliersSelectable) {
                    return;
                }

                popup.scaleX = popup.scaleY = 1;
                freespinsCount.scaleX = freespinsCount.scaleY = 1 * freespinsCountDefaultScale;
            };
            const onMouseDownAction = (e) => {
                if (!this.multipliersSelectable) {
                    return;
                }

                this.suspendAttraction();

                popup.mouseDown = true;
                popup.scaleX = popup.scaleY = (1-scale);
                freespinsCount.scaleX = freespinsCount.scaleY = freespinsCountDefaultScale;
            };

            /**
             * Click action, starts animation of popup sprite
             * @param e
             */
            const onClickAction = (e) => {
                if (!this.multipliersSelectable) {
                    return;
                }

                this.multipliersSelectable = false;
                this.stopAttraction();

                popup.scaleX = popup.scaleY = 1;
                freespinsCount.scaleX = freespinsCount.scaleY = 1 * freespinsCountDefaultScale;

                for (let pop in popups) {
                    popups[pop].cursor = "";
                }

                let symbol = popup.getChildByName("symbol");


                switch (symbol.symbolID){
                    case 10:
                        this.getService("SoundService").play("el_wild_pharaon_silmple", "audio");
                        this.getService("SoundService").play("sound_7", "audio");
                        break;
                    case 11:
                        this.getService("SoundService").play("el_wild_pharaon_red", "audio");
                        this.getService("SoundService").play("sound_8", "audio");
                        break;
                    case 12:
                        this.getService("SoundService").play("el_wild_pharaon_gold", "audio");
                        this.getService("SoundService").play("sound_9", "audio");
                        break;
                }


                symbol.framerate = 27;
                symbol.scaleX = symbol.scaleY = 1.33;
                symbol.gotoAndPlay(`short_${symbol.symbolID}`);
                this.tempTweens.push(createjs.Tween
                    .get(this._container.getChildByName('black'))
                    .to({alpha: 1}, 2000));
                symbol.addEventListener("animationend", () => {
                    symbol.removeAllEventListeners("animationend");


                    symbol.gotoAndPlay(`def_${symbol.symbolID}`);

                    symbol.scaleX = symbol.scaleY = 1;
                    this.getController().selectMultiplier(symbol.symbolID);
                    this.hide();
                });

                popup.selected = true;

                for (let pop in popups) {
                    popups[pop].cursor = "";

                    if (popup.id !== popups[pop].id) {
                        popups[pop].filters = [
                            new createjs.ColorMatrixFilter(new createjs.ColorMatrix(0, -9, -70, 25)),
                            new createjs.ColorMatrixFilter(new createjs.ColorMatrix(10, 0, 0, 0))
                        ];
                        let rect = popups[pop].getBounds();
                        popups[pop].cache(rect.x, rect.y, rect.width, rect.height);
                    }
                }
            };

            const onPressUpAction = (e) => {
                if (!this.multipliersSelectable) {
                    return;
                }

                if (e.currentTarget.mouseDown
                    && e.localX >= 0 && e.localX <= e.currentTarget.width
                    && e.localY >= 0 && e.localY <= e.currentTarget.height ) {
                    onClickAction();
                }
                popup.mouseDown = false;
            };

            popup.addEventListener("rollover", onRollOverAction);
            popup.addEventListener("rollout", onRollOutAction);
            popup.addEventListener ("mousedown", onMouseDownAction);
            popup.addEventListener ("pressup", onPressUpAction);
            popup.addEventListener ("click", onClickAction);

            this.startAttraction();
        }

        this._popups = popups;
    }

    _resetDefaultState () {
        for (let pop in this._popups) {
            let popup = this._popups[pop];
            popup.cursor = "pointer";
            popup.selected = false;
            popup.mouseDown = false;
            popup.scaleX = popup.scaleY = 1;
            popup.filters = [];
            popup.uncache();
        }
    }

    startAttraction () {

        this._attractionInterval = setInterval (() => {

            if(this.suspendTweensColumns === true){
                this.startAttraction();
                return ;
            }

            if (!this.multipliersSelectable) {
                return;
            }
            this.showAttraction();
        }, 5000);

    }

    /**
     * Suspend attraction
     */
    suspendAttraction(){
        this.suspendTweensColumns = true;
    }

    /**
     * Resume attraction
     */
    resumeAttraction(){
        this.suspendTweensColumns = false;
    }

    stopAttraction () {

        clearInterval (this._attractionInterval);

        for (let p in this._popups) {
            let popup = this._popups[p];
            popup.scaleX = popup.scaleY = 1;
        }

    }

    show (resolve) {
        this.promise = resolve;

        this._container.getChildByName("left").alpha = 1;
        this._container.getChildByName("center").alpha = 1;
        this._container.getChildByName("right").alpha = 1;
        this._container.getChildByName("message").alpha = 1;


        return new Promise ((resolve, reject) => {
            let count = 0;
            for (let p in this._popups) {
                let popup = this._popups[p];
                popup.visible = false;

                this.tempTweens.push(createjs.Tween
                    .get(popup)
                    .wait (300 + count*100)
                    .to ({visible:true, scaleX: 0.5, scaleY: 0.5})
                    .to ({scaleX: 1.1, scaleY: 1.1}, 200)
                    .to ({scaleX: 1, scaleY: 1}, 200)
                    .call(() => {
                        if (popup.name === "right") {
                            this.multipliersSelectable = true;
                        }
                    }));

                count++;
            }

            this._popupContainer = this.getHandler("popup").querySelector("gameBlockPopup");

            this._popupLayer = this.getLayout("popup");

            this.enableModalMode(this._popupLayer);

            this._screenshot = this.getStageScreenshot();
            this._screenshot.alpha = 0;
            this._container.addChildAt (this._screenshot, 0);

            this._container.alpha = 0;

            this._popupContainer.addChild (this._container);

            createjs.Tween.get(this._container, {loop: false})
                .to({alpha: 1}, 100);

            createjs.Tween
                .get(this._container.getChildByName('black') )
                .to ({alpha: 0}, 0)
                .to({alpha: 0.75}, 600)
                .call (resolve);
        });
    }

    hide () {
        return new Promise ((resolve, reject) => {
            //Feedback from Yanis(PO)

            this.tempTweens.push(createjs.Tween
                .get(this._container.getChildByName("left"))
                .to({alpha: 0}, 250));
            this.tempTweens.push(createjs.Tween
                .get(this._container.getChildByName("center"))
                .to({alpha: 0}, 250));
            this.tempTweens.push(createjs.Tween
                .get(this._container.getChildByName("right"))
                .to({alpha: 0}, 250));
            this.tempTweens.push(createjs.Tween
                .get(this._container.getChildByName("message"))
                .to({alpha: 0}, 250));
            this.tempTweens.push(createjs.Tween
                .get(this._container.getChildByName('black'))
                .to({alpha: 1}, 250)
                .call(()=>{
                    this._screenshot.parent.removeChild (this._screenshot);
                    this._screenshot = this.getStageScreenshot();
                    // this._container.addChildAt (this._screenshot, 0);
                })
                .call(()=>{
                    if(this.promise){
                        this.promise();
                    }
                })
                .to({alpha: 0}, 500)
                .call(() => {
                    for(let tween of this.tempTweens){
                        createjs.Tween.removeTweens(tween);
                    }
                    this.tempTweens = [];
                    createjs.Tween.removeAllTweens();

                    this.disableModalMode();
                    this.stopAttraction();
                    this._resetDefaultState();
                    // this._screenshot.parent.removeChild (this._screenshot);
                    // delete this._screenshot;
                    this._container.parent.removeChild (this._container);
                    resolve();
                }));
        });

    }

    showAttraction () {
        let count = 0;
        for (let p in this._popups) {
            let popup = this._popups[p];
            let currentScale = popup.scaleX;

            this.tempTweens.push(createjs.Tween
                .get(popup)
                .wait (count*140)
                .to ({scaleX: 0.98*currentScale, scaleY: 0.98*currentScale}, 150)
                .to ({scaleX: 1.05*currentScale, scaleY: 1.05*currentScale}, 150)
                .to ({scaleX: currentScale, scaleY: currentScale}, 150));

            count++;
        }
    }

    getLayout (alias = this.alias) {
        return super.getLayout (alias);
    }

}

