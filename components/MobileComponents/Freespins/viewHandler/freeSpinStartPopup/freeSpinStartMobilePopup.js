import FreeSpinStartPopup from "../../../../CommonComponents/Freespins/viewHandler/freeSpinStartPopup/freeSpinStartPopup";
import config from "./config.js";

export default class FreeSpinStartMobilePopup extends FreeSpinStartPopup {

    constructor (config, alias) {
        super (config, alias);
        this.tempTweens = [];
        this.initHandler ();

        this.suspendTweensColumns = false;
    }

    initHandler() {
        this.isVertical= $_view_canvas.verticalMode;

        this.multipliersSelectable = false;

        this._container = new Container({
            width: this.getGameContainer().width,
            height: this.getGameContainer().height
        });
        this.initChildrenContainer( this._container, config.children);
        let popups = {
            left: this._container.getChildByName("left"),
            center: this._container.getChildByName("center"),
            right: this._container.getChildByName("right")
        };

        let scale = 0.1;
        let countScale = 0.2;

        for (let p in popups) {
            let popup = popups[p];
            popup.y =  this.isVertical ? config.positions.popup.vertical :  config.positions.popup.horizontal;
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

        this._container.getChildByName('message').y =  this.isVertical ? config.positions.message.vertical :  config.positions.message.horizontal;
    }

    show (resolve) {
        super.show(resolve);
        this._screenshot.x = this._screenshot.y = 0;
        this._container.getChildByName('black').width =  this.getCanvas().width;
        this._container.getChildByName('black').height =  this.getCanvas().height;
    }

    update(isVertical){
        this._screenshot.x = this._screenshot.y = 0;
        this._container.getChildByName('black').width =  this.getCanvas().width;
        this._container.getChildByName('black').height =  this.getCanvas().height;

        for (let pop in this._popups) {
            let popup = this._popups[pop];
            popup.y = isVertical ?config. positions.popup.vertical : config. positions.popup.horizontal;
        }
        this._container.getChildByName('message').y = isVertical ? config.positions.message.vertical :  config.positions.message.horizontal;
    }

}

