import ViewCanvasHandler from "../../../../../bower_components/html5-game-kernel/views/interfaces/ViewCanvasHandler.es6.js";
import config from "./config";

export default class BonusResumePopup extends ViewCanvasHandler {

    constructor (config, alias) {
        super ({alias});

        this.initHandler ();
    }

    initHandler() {

        this._container = new Container({
            width: this.getLayout().width,
            height: this.getLayout().height
        });

        this.initChildrenContainer(this._container, config.children);

    }

    show (resolve) {
        this._popupLayer = this.getLayout("popup");

        this.enableModalMode(this._popupLayer);

        this._popupContainer = this.getHandler("popup").querySelector("gameBlockPopup");

        this._screenshot = this.getStageScreenshot();
        this._container.addChildAt (this._screenshot, 0);

        this._popupContainer.addChild (this._container);
        // this._emitter.emitter.emit();

        this._container.alpha = 1;

        let cachedText = this._container.getChildByName('youWonText'),
            textRec = cachedText.getBounds(),
            cachedStroke = this._container.getChildByName('youWonStroke'),
            strokeRec = cachedStroke.getBounds();

        cachedText.cache(textRec.x - 5, textRec.y - 5, textRec.width + 10, textRec.height + 10);
        cachedStroke.cache(strokeRec.x- 5, strokeRec.y- 5, strokeRec.width+ 10, strokeRec.height+ 10);

        cachedText.scaleX = cachedText.scaleY = .4;
        cachedStroke.scaleX = cachedStroke.scaleY = .4;
        let shape = new Bitmap ("start_big", this.alias);
        shape.x = this.getLayout().width / 2;
        shape.y =  this.getLayout().height / 2;
        shape.regX = shape.width/2;
        shape.regY = shape.height/2;
        shape.scaleX = shape.scaleY = 4;
        shape.alpha = 0.4;

        let shape2 = new Bitmap ("start_big", this.alias);
        shape2.x = this.getLayout().width / 2;
        shape2.y =  this.getLayout().height / 2;
        shape2.regX = shape2.width/2;
        shape2.regY = shape2.height/2;
        shape2.scaleX = shape2.scaleY = 4;
        shape2.alpha = 0.4;

        this._container.addChildAt(shape, 2);
        this._container.addChildAt(shape2, 3);
        this._shape = shape;
        this._shape2 = shape2;
        createjs.Tween
            .get(cachedText)
            .to ({scaleX: .4, scaleY: .4}, 200)
            .to ({scaleX: 1.15, scaleY: 1.15}, 160)
            .to ({scaleX: 1, scaleY: 1}, 100)
            .to ({scaleX: 1.25, scaleY: 1.25}, 2500 * 1.5);
        createjs.Tween
            .get(cachedStroke)
            .to ({scaleX: .4, scaleY: .4}, 200)
            .to ({scaleX: 1.15, scaleY: 1.15}, 160)
            .to ({scaleX: 1, scaleY: 1}, 100)
            .to ({scaleX: 1.25, scaleY: 1.25}, 2500 * 1.5)
            .call(resolve);

        createjs.Tween
            .get(shape, {loop:true})
            .to ({rotation: -360}, 10000);
        createjs.Tween
            .get(shape2, {loop:true})
            .to ({rotation: 360}, 15000);
    }

    hide (resolveMain) {
        return new Promise ((resolve, reject) => {

            createjs.Tween
                .get(this._container )
                .to ({alpha: 1}, 0)
                .to({alpha: 0}, 300)
                .call(resolveMain)
                .call(() => {

                    if(this._container){
                        this._container.removeChild(this._shape);
                        this._container.removeChild(this._shape2);
                        this._container.parent.removeChild (this._container);

                        delete this._shape;
                        delete this._shape2;
                    }

                    if(this._screenshot){
                        this._screenshot.parent.removeChild (this._screenshot);
                        delete this._screenshot;
                    }

                    this.disableModalMode(this._popupLayer);
                    resolve();
                });

        });

    }

    getLayout (alias = this.alias) {
        return super.getLayout (alias);
    }

}

