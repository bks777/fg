import ViewCanvasHandler from "../../../../../bower_components/html5-game-kernel/views/interfaces/ViewCanvasHandler.es6.js";
import config from "./config.js";

export default class FreeSpinResumePopup extends ViewCanvasHandler {

    constructor (config, alias) {
        super ({alias});

        this.initHandler ();
    }

    initHandler() {

        this._container = new Container();
        this._container.name = "resumePopup";
        this._container.visible = false;

        this.getLayout().setChildWidth (this._container, "100%");
        this.getLayout().setChildHeight (this._container, "100%");

        this.initChildrenContainer(this._container, config.children);

        this._popups = {
            left: this._container.getChildByName("left"),
            center: this._container.getChildByName("center"),
            right: this._container.getChildByName("right")
        };
    }

    _getWildID () {
        return this.getService("ProtocolService").getCurrentReelsData("freespins").wildId;
    }

    show () {
        let wildId = this._getWildID();

        for (let p in this._popups) {
            let popup = this._popups[p];
            let symbolID = popup.getChildByName("symbol").symbolID;

            if (symbolID === wildId) {
                popup.visible = true;
                let value = popup.getChildByName("value");
                value.text = this.getService("FreeSpinService").getFreeSpinLeft().toString();
                value.regX = value.getBounds().width/2;
            } else {
                popup.visible = false;
            }
        }

        this._popupLayer = this.getLayout("popup");
        this.enableModalMode(this._popupLayer);

        this._popupContainer = this.getHandler("popup").querySelector("gameBlockPopup");
        this._popupContainer.addChild (this._container);
        this._screenshot = this.getStageScreenshot();
        this._container.addChildAt (this._screenshot, 0);
        this._container.visible = true;

        return new Promise ((resolve, reject) => {
            setTimeout (() => {
                this.hide().then(resolve)
            }, 1000);
        });

    }

    hide () {
        return new Promise ((resolve, reject) => {
            createjs.Tween
                .get(this._container)
                .to({alpha: 0}, 300)
                .call(() => {
                    this._container.parent.removeChild (this._container);
                    this._screenshot.parent.removeChild (this._screenshot);
                    delete this._screenshot;
                    this.disableModalMode(this._popupLayer);
                    resolve();
                });
        });

    }

    showAttraction () {
        let count = 0;
        for (let p in this._popups) {
            let popup = this._popups[p];
            let currentScale = popup.scaleX;

            createjs.Tween
                .get(popup)
                .wait (count*140)
                .to ({scaleX: 0.98*currentScale, scaleY: 0.98*currentScale}, 150)
                .to ({scaleX: 1.05*currentScale, scaleY: 1.05*currentScale}, 150)
                .to ({scaleX: currentScale, scaleY: currentScale}, 150);

            count++;
        }
    }

    getLayout (alias = this.alias) {
        return super.getLayout (alias);
    }

}

