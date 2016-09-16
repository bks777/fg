import Container from "./Container.es6";
import Label from "./Label.es6";
import Bitmap from "./Bitmap.es6";

export default class LineCarribean extends Container {

    constructor (config, alias) {
        super(config);

        this.config = config;
        this.alias = alias;

        this.x = 0;
        this.y = 0;

        this._disabled = false;

        this.disabledMouseLabels = false;

    }

    init () {
        this.config.backgroundTop = this.config.backgroundTop || 0;
        let lineBitmap = new Bitmap ( this.config.background, this.alias);
        lineBitmap.y = this.config.labelTop - this.config.backgroundTop;

        if ( this.config.backgroundTopAbsolute !== undefined) {
            let pt = this.globalToLocal (0, this.config.backgroundTopAbsolute);
            lineBitmap.y = pt.y;
        }

        if ( this.config.backgroundLeftAbsolute !== undefined) {
            let pt = this.globalToLocal (this.config.backgroundLeftAbsolute, 0);
            lineBitmap.x = pt.x;
        }

        if ( this.config.backgroundRightAbsolute !== undefined) {
            let pt = this.globalToLocal (this.config.backgroundRightAbsolute, 0);
            lineBitmap.x = pt.x - lineBitmap.width;
        }

        this.addChild(lineBitmap);
        this.background = lineBitmap;

        if (this.config.background.scaleX) lineBitmap.scaleX = this.config.background.scaleX;
        if (this.config.background.scaleY) lineBitmap.scaleY = this.config.background.scaleY;
        if (this.config.background.width) this.setChildWidth(lineBitmap, this.config.background.width);
        if (this.config.background.height) this.setChildHeight(lineBitmap, this.config.background.height);

        if ( this.config.labels ) {

            if ( this.config.labels.left ) {
                this.leftLabel = this.createLabel ( this.config.labels.left, this.alias);

                if (this.config.leftLabelTopAbsolute !== undefined) {
                    this.leftLabel.y = this.globalToLocal (0, this.config.leftLabelTopAbsolute).y;
                } else {
                    this.leftLabel.y = this.config.labelTop;
                }
            }

            if ( this.config.labels.right ) {
                this.rightLabel = this.createLabel ( this.config.labels.right, this.alias);

                if (this.config.rightLabelTopAbsolute !== undefined) {
                    this.rightLabel.y = this.globalToLocal (0, this.config.rightLabelTopAbsolute).y;
                } else {
                    this.rightLabel.y = this.config.labelTop;
                }
            }
        }
    }

    createLabel (config, alias) {
        let label = new Label ( config, alias);

        this.addChild(label);

        if (config.align !== undefined){
            this.setChildAlign(config.align, label);
        }

        if (config.leftAbsolute !== undefined) {
            label.x = this.globalToLocal (config.leftAbsolute, 0).x;
        }

        label.text = this.config.lineName;

        return label;
    }

    showStandardLabel () {
        if (this._disabled) {
            if (this.leftLabel) {
                this.leftLabel.showOff();
            }
            if (this.rightLabel) {
                this.rightLabel.showOff();
            }
        } else {
            if (this.leftLabel) {
                this.leftLabel.showOn();
            }
            if (this.rightLabel) {
                this.rightLabel.showOn();
            }
        }
    }

    showOverLabel () {
        if (this._disabled) {
            if (this.leftLabel) {
                this.leftLabel.showOverOff();
            }
            if (this.rightLabel) {
                this.rightLabel.showOverOff();
            }
        } else {
            if (this.leftLabel) {
                this.leftLabel.showOverOn();
            }
            if (this.rightLabel) {
                this.rightLabel.showOverOn();
            }
        }
    }

    showWinLabel () {
        if (this.leftLabel) {
            this.leftLabel.showWin();
        }
        if (this.rightLabel) {
            this.rightLabel.showWin();
        }
    }

    set disabled (bool) {
        this._disabled = !!bool;
        this.showStandardLabel();
    }

    get disabled () {
        return this._disabled;
    }

    showLine () {
        this.background.visible = true;
        //this.stage.requestUpdate();
    }

    hideLine () {
        this.background.visible = false;
        //this.stage.requestUpdate();
    }

    fadeLine () {
        return new Promise ((resolve, reject) => {
            //this.stage.startTween();
            createjs.Tween.get(this.background, {ignoreGlobalPause: true}).to ({alpha: 0, visible:false}, 300).call ( () => {
                this.background.visible = false;
                this.background.alpha = 1;
                //let rect = this.getBounds();
                //this.stage.requestUpdate();
                //this.stage.endTween();
                resolve();
            });
        });
    }

    enableMouseOverForLabels () {
        this.disabledMouseLabels = false;
        if (this.rightLabel) {
            this.rightLabel.cursor = "pointer";
        }
        if (this.leftLabel) {
            this.leftLabel.cursor = "pointer";
        }
    }

    disableMouseOverForLabels () {
        this.disabledMouseLabels = true;
        if (this.rightLabel) {
            this.rightLabel.cursor = null;
        }
        if (this.leftLabel) {
            this.leftLabel.cursor = null;
        }
    }

}