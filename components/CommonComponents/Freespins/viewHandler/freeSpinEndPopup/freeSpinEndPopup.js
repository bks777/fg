import ViewCanvasHandler from "../../../../../bower_components/html5-game-kernel/views/interfaces/ViewCanvasHandler.es6.js";
import config from "./config";
import numbersSpriteSheet from "../elements/numbersSpriteSheet";

export default class FreeSpinEndPopup extends ViewCanvasHandler {

    constructor (config, alias) {
        super ({alias});

        this.initHandler ();
    }

    initHandler() {

        this._container = new Container({
            width: this.getLayout().width,
            height: this.getLayout().height
        });


    }

    counterEffect (target, start, end, onCountEndCallback) {

        if(target){
            target.text = (Number(start).toFixed(2)).toString();
            target.value = start;
            target.scaleX = target.scaleY = 0.5;

            target.regX = target.getBounds().width/2;
            target.regY = target.getBounds().height/2;
        }

        let dif = (end - start),
            step = dif / 95,
            currentValue = start,
            finished = false,
            lastInterval = 180,
            tween = createjs.Tween
            .get(target)
            .to ({value: end, scaleX: 1.15, scaleY: 1.15}, 850)
            .call(() => {
                if (typeof onCountEndCallback === "function") {
                    onCountEndCallback();
                }
            })
            .to ({scaleX: 1, scaleY: 1}, lastInterval)
            .addEventListener("change", (ev) => {
                if (target.value - currentValue > step) {

                    currentValue = target.value;
                    target.text = (Number(target.value).toFixed(2)).toString();

                    target.regX = target.getBounds().width/2;
                    target.regY = target.getBounds().height/2;

                } else if (ev.target.position > ev.target.duration-lastInterval && !finished) {
                    target.text = (Number(target.value).toFixed(2)).toString();

                    target.regX = target.getBounds().width/2;
                    target.regY = target.getBounds().height/2;
                    finished = true;
                }
            });
    }

    show (success) {
        if(this._finalWinCounter){
            this._finalWinCounter.alpha = 1;
            this._finalWinCounter.scaleX =  this._finalWinCounter.scaleY = 0.01;
        }

        if(success){
            this.isSuccess = true;
            this.initChildrenContainer(this._container, config.winChildren);
            this._emitter = this._container.getChildByName("emitter");
            this._emitter.alpha = 1;
            this._container.getChildByName("congratulationText").alpha = 1;
            this._container.getChildByName("congratulationStroke").alpha = 1;
            this._container.getChildByName("youWonText").alpha = 1;
            this._container.getChildByName("youWonStroke").alpha = 1;
            let cachedText = this._container.getChildByName('youWonText'),
                textRec = cachedText.getBounds(),
                cachedStroke = this._container.getChildByName('youWonStroke'),
                strokeRec = cachedStroke.getBounds(),

                cachedText2 = this._container.getChildByName('congratulationText'),
                textRec2 = cachedText2.getBounds(),
                cachedStroke2 = this._container.getChildByName('congratulationStroke'),
                strokeRec2 = cachedStroke2.getBounds();

            cachedText.cache(textRec.x - 5, textRec.y - 5, textRec.width + 10, textRec.height + 10);
            cachedStroke.cache(strokeRec.x- 5, strokeRec.y- 5, strokeRec.width+ 10, strokeRec.height+ 10);
            cachedText2.cache(textRec2.x - 5, textRec2.y - 10, textRec2.width + 10, textRec2.height + 20);
            cachedStroke2.cache(strokeRec2.x- 5, strokeRec2.y- 10, strokeRec2.width+ 10, strokeRec2.height+ 20);

            cachedText.scaleX = cachedText.scaleY = .4;
            cachedStroke.scaleX = cachedStroke.scaleY = .4;
            cachedText2.scaleX = cachedText2.scaleY = .4;
            cachedStroke2.scaleX = cachedStroke2.scaleY = .4;

            let winCounter = new BitmapText({
                text: "0",
                spriteSheet: numbersSpriteSheet
            }, this.alias);
            winCounter.name = "winCounter";
            winCounter.x = this.getLayout().width / 2;
            winCounter.y = this.getLayout().height / 2;
            this._container.addChild(winCounter);
            this._finalWinCounter = winCounter;

            return new Promise ((resolve, reject) => {


                let totalWin = this.getService("FreeSpinService").getTotalWin()/100;
                this._popupLayer = this.getLayout("popup");

                this.enableModalMode(this._popupLayer);

                this._screenshot = this.getStageScreenshot();
                this._screenshot.alpha = 0;
                this._container.addChildAt (this._screenshot, 0);

                this._popupContainer = this.getHandler("popup").querySelector("gameBlockPopup");

                this._container.alpha = 0;

                this._popupContainer.addChild (this._container);

                createjs.Tween.get(this._container, {loop: false})
                    .to({alpha: 1}, 100)
                    .call(()=>{

                        this._emitter.emitter.emit();
                        this.counterEffect (this._finalWinCounter, 0, totalWin.toString(), resolve );
                        createjs.Tween
                            .get(this._container.getChildByName('black'))
                            .to({alpha: .75}, 600);
                        createjs.Tween
                            .get(cachedText)
                            .to ({scaleX: 1.15, scaleY: 1.15}, 160)
                            .to ({scaleX: 1, scaleY: 1}, 100)
                            .to ({scaleX: 1.25, scaleY: 1.25}, 4000);
                        createjs.Tween
                            .get(cachedStroke)
                            .to ({scaleX: 1.15, scaleY: 1.15}, 160)
                            .to ({scaleX: 1, scaleY: 1}, 100)
                            .to ({scaleX: 1.25, scaleY: 1.25}, 4000);
                        createjs.Tween
                            .get(cachedText2)
                            .to ({scaleX: 1.15, scaleY: 1.15}, 160)
                            .to ({scaleX: 1, scaleY: 1}, 100)
                            .to ({scaleX: 1.25, scaleY: 1.25}, 4000);
                        createjs.Tween
                            .get(cachedStroke2)
                            .to ({scaleX: 1.15, scaleY: 1.15}, 160)
                            .to ({scaleX: 1, scaleY: 1}, 100)
                            .to ({scaleX: 1.25, scaleY: 1.25}, 4000);

                    })
            });
        } else {
            this.isSuccess = false;
            this.initChildrenContainer(this._container, config.noWinChildren);
            this._emitter = this._container.getChildByName("emitter");
            this._emitter.alpha = 1;
            this._container.getChildByName("youLoseText").alpha = 1;
            this._container.getChildByName("youLoseStroke").alpha = 1;
            let cachedText = this._container.getChildByName('youLoseText'),
                textRec = cachedText.getBounds(),
                cachedStroke = this._container.getChildByName('youLoseStroke'),
                strokeRec = cachedStroke.getBounds();
            cachedText.cache(textRec.x - 5, textRec.y - 5, textRec.width + 10, textRec.height + 10);
            cachedStroke.cache(strokeRec.x- 5, strokeRec.y- 5, strokeRec.width+ 10, strokeRec.height+ 10);
            cachedText.scaleX = cachedText.scaleY = .4;
            cachedStroke.scaleX = cachedStroke.scaleY = .4;
            return new Promise ((resolve, reject) => {

                this._popupLayer = this.getLayout("popup");

                this.enableModalMode(this._popupLayer);

                this._screenshot = this.getStageScreenshot();
                this._screenshot.alpha = 0;
                this._container.addChildAt (this._screenshot, 0);

                this._popupContainer = this.getHandler("popup").querySelector("gameBlockPopup");

                this._container.alpha = 0;

                this._popupContainer.addChild (this._container);

                createjs.Tween.get(this._container, {loop: false})
                    .to({alpha: 1}, 100)
                    .call(()=>{
                        this._emitter.emitter.emit();
                        createjs.Tween
                            .get(this._container.getChildByName('black'))
                            .to({alpha: .75}, 600);

                        createjs.Tween
                            .get(cachedText)
                            .to ({scaleX: 1.15, scaleY: 1.15}, 160)
                            .to ({scaleX: 1, scaleY: 1}, 100)
                            .to ({scaleX: 1.25, scaleY: 1.25}, 2000)
                            .call(resolve);
                        createjs.Tween
                            .get(cachedStroke)
                            .to ({scaleX: 1.15, scaleY: 1.15}, 160)
                            .to ({scaleX: 1, scaleY: 1}, 100)
                            .to ({scaleX: 1.25, scaleY: 1.25}, 2000);
                    })
            });
        }


    }

    hide () {
        return new Promise ((resolve, reject) => {
            if (this.isSuccess){
                createjs.Tween
                    .get(this._container.getChildByName("youWonStroke"))
                    .to({alpha: 0}, 250);
                createjs.Tween
                    .get(this._container.getChildByName("youWonText"))
                    .to({alpha: 0}, 250);
                createjs.Tween
                    .get(this._container.getChildByName("congratulationText"))
                    .to({alpha: 0}, 250);
                createjs.Tween
                    .get(this._container.getChildByName("congratulationStroke"))
                    .to({alpha: 0}, 250);
                createjs.Tween
                    .get(this._finalWinCounter)
                    .to({alpha: 0}, 250);
            } else {
                createjs.Tween
                    .get(this._container.getChildByName("youLoseStroke"))
                    .to({alpha: 0}, 250);
                createjs.Tween
                    .get(this._container.getChildByName("youLoseText"))
                    .to({alpha: 0}, 250);
            }

            createjs.Tween
                .get(this._emitter)
                .to({alpha: 0}, 250);

            createjs.Tween
                .get(this._container.getChildByName('black') )
                .to ({alpha: 1}, 250)
                .call(()=>{
                    this._screenshot.parent.removeChild (this._screenshot);
                    delete this._screenshot;
                })
                .to({alpha: 0}, 500)
                .call (() => {
                    // this._container.parent.removeChild (this._container);
                    this._emitter.emitter.stopEmit();
                    this.disableModalMode(this._popupLayer);
                    this._container.removeAllChildren();
                    resolve();
                });
        });

    }

    getLayout (alias = this.alias) {
        return super.getLayout (alias);
    }

}

