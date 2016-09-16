import Container from "./Container.es6";
import Bitmap    from "./Bitmap.es6";
import Shape     from "./Shape.es6";

export default class Label extends Container
{
    constructor(config, alias) {

        super(config);

        let {
            text        = "",
            color       = "#000",
            textAlign   = "center",
            textBaseline = "middle",
            fontStyle   = "",
            fontSize    = 10,
            backgroundX = 0,
            backgroundY = 0,
            backgroundImage,
            fontFamily  = "Arial"
        } = config;


        if (backgroundImage) {
            this.bgOn = new Bitmap({ src: backgroundImage.on}, alias);
            this.addChild(this.bgOn);

            if (backgroundImage.on) {
                this.bgOff = new Bitmap({ src: backgroundImage.off}, alias);
            } else {
                this.bgOff = this.bgOn;
            }

            this.bgOff.visible = false;
            this.addChild(this.bgOff);

            if (backgroundImage.over_on) {
                this.bgOverOn = new Bitmap({ src: backgroundImage.over_on}, alias);
            } else {
                this.bgOverOn = this.bgOn;
            }

            if (backgroundImage.over_off) {
                this.bgOverOff = new Bitmap({ src: backgroundImage.over_off}, alias);
            } else {
                this.bgOverOff = this.bgOverOn;
            }
            this.bgOverOff.visible = false;
            this.addChild(this.bgOverOff);

            this.bgOverOn.visible = false;
            this.addChild(this.bgOverOn);

            if (backgroundImage.win) {
                this.bgWin = new Bitmap({ src: backgroundImage.win}, alias);
                this.bgWin.visible = false;
                this.addChild(this.bgWin);
            }
        }

        let font;
        if (config.font === undefined) {
            font = `${fontStyle} ${fontSize} ${fontFamily}`;
        } else {
            font = config.font;
        }

        let stroke = new Text;
        stroke.textAlign            = textAlign;
        stroke.textBaseline         = textBaseline;
        stroke.text                 = text;
        stroke.font                 = font;
        stroke.color                = color;
        stroke.outline              = 4;
        stroke.visible              = false;
        stroke.x                    = this.bgOff.width/2;
        stroke.y                    = this.bgOff.height/2;
        this._stroke = stroke;
        this.addChild(stroke);

        let textElement = new Text;
        textElement.textAlign       = textAlign;
        textElement.textBaseline    = textBaseline;
        textElement.text            = text;
        textElement.font            = font;
        textElement.color           = "#FFF";
        textElement.visible         = false;
        textElement.x               = this.bgOff.width/2;
        textElement.y               = this.bgOff.height/2;
        this._textElement           = textElement;
        this.addChild(textElement);

        this.bgOverOff.regX = this.bgOverOff.width/2;
        this.bgOverOff.regY = this.bgOverOff.height/2;
        this.bgOverOff.x = this.bgOff.width/2;
        this.bgOverOff.y = this.bgOff.height/2;

        this.bgOverOn.regX = this.bgOverOn.width/2;
        this.bgOverOn.regY = this.bgOverOn.height/2;
        this.bgOverOn.x = this.bgOn.width/2;
        this.bgOverOn.y = this.bgOn.height/2;

        if (this.bgWin) {
            this.bgWin.regX = this.bgWin.width/2;
            this.bgWin.regY = this.bgWin.height/2;
            this.bgWin.x = this.bgOn.width/2;
            this.bgWin.y = this.bgOn.height/2;
        }
    }

    showText () {
        this._textElement.visible = true;
        this._stroke.visible = true;
    }

    hideText () {
        this._textElement.visible = false;
        this._stroke.visible = false;
    }

    _showBigLabel (target) {

        this._currentBig = target;

        target.scaleX = target.scaleY = 0;
        //target.rotation = -90;
        target.rotation = 0;
        target.visible = true;

        createjs.Tween
            .get(target, {override: true})
            .to({scaleX: 1, scaleY: 1, rotation: -135}, 200)
            .call(() => {
                this.showText();
                this.stage.requestUpdate();
            });
    }

    _hideBigLabel() {

        this.hideText();

        if (!this._currentBig) {
            return;
        }

        createjs.Tween
            .get(this._currentBig, {override: true})
            .to({scaleX: 0, scaleY: 0, rotation: 0}, 100)
            .call(() => {
                this._currentBig.visible = false;
                this.hideText();
                this.stage.requestUpdate();
                delete this._currentBig;
            });

        if (this.bgWin) {
            createjs.Tween
                .get(this.bgWin, {override: true})
                .to({scaleX: 0, scaleY: 0, rotation: -45, visible: false}, 100)

        }

    }

    showOn () {
        this._hideBigLabel();
        this.bgOff.visible = false;
        this.bgOn.visible = true;
    }

    showOff () {
        this._hideBigLabel();
        this.bgOff.visible = true;
        this.bgOn.visible = false;

    }

    showOverOn () {
        this._showBigLabel(this.bgOverOn);
    }

    showOverOff () {
        this._showBigLabel(this.bgOverOff);
    }

    showWin () {
        this.showOverOn();
        if (this.bgWin) {
            this.bgWin.rotation = -45;
            createjs.Tween
                .get(this.bgWin, {override: true})
                .to ({visible:true},  0)
                .to({scaleX: 1, scaleY: 1, rotation: -180}, 200);
        }
    }

    set text(value) {
        this._textElement.text = value;
        this._stroke.text = value;
    }

    get text() {
        return this._textElement.text;
    }

    set color(value) {
        this._textElement.color = value;
    }

    get color() {
        return this._textElement.color;
    }

    set font(value) {
        this._textElement.font = value;
    }

    get font() {
        return this._textElement.font;
    }

    set textAlign(value) {
        this._textElement.textAlign = value;
    }

    get textAlign() {
        return this._textElement.textAlign;
    }



}