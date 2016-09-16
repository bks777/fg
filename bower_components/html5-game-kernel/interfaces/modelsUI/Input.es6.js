import Container from "./Container.es6";
import CanvasInput from "./CanvasInput.es6";

export default class Input extends createjs.DisplayObject {
    constructor (config, alias) {

        super(config, alias);

        let inputConfig = config;

        this.cursor = 'text';

        this.addEventListener ("added", () => {

            inputConfig.canvas = this.stage.canvas;
            let input = new CanvasInput(inputConfig, alias);

            this.image = input.renderCanvas();
            this.sourceRect = new createjs.Rectangle(0,0,this.image.width,this.image.height);

            this.setBounds(0,0,this.image.width,this.image.height);

            let pt = this.localToGlobal(0,0);

            input._overInput = (x, y) => {

                let r = this.getBounds();
                let rect = {
                    width: this.image.width,
                    height: this.image.height
                };
                let pt = this.localToGlobal(0,0);

                x = this.stage.mouseX;
                y = this.stage.mouseY;

                let
                    xLeft = x >= pt.x,
                    xRight = x <= pt.x + rect.width,
                    yTop = y >= pt.y,
                    yBottom = y <= pt.y + rect.height;
                return xLeft && xRight && yTop && yBottom;
            };

            this.renderRect = new createjs.Rectangle (pt.x, pt.y, this.image.width, this.image.height );

            this.input = input;

        });

        this.addEventListener ("tick", () => {
            if (this.isShowed()) {
                this.stage.requestUpdate (this.renderRect);
            }
        });
    }

    _onlyNumberHandler (evt) {

        var charCode = (evt.which) ? evt.which : event.keyCode;

        if (charCode >= 37 && charCode <= 40) { //arrow keys
            return true;
        }
        // home, end, backspace, delete, tab
        if (charCode === 35 || charCode === 36 || charCode === 46 || charCode === 8 || charCode === 9) {
            return true;
        }

        if (charCode >= 96 && charCode <= 105) {
            return true;
        }

        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            evt.preventDefault();
            return false;
        }

        return true;
    }

    set onlyNumber (value) {
        if (value) {
            this.input._hiddenInput.addEventListener("keypress", this._onlyNumberHandler);
            this.input._hiddenInput.addEventListener("keydown", this._onlyNumberHandler);
            this.input._hiddenInput.addEventListener("keyup", this._onlyNumberHandler);
        } else {
            this.input._hiddenInput.removeEventListener("keypress", this._onlyNumberHandler);
            this.input._hiddenInput.removeEventListener("keydown", this._onlyNumberHandler);
            this.input._hiddenInput.removeEventListener("keyup", this._onlyNumberHandler);
        }
    }

    get value () {
        return this.input.value();
    }

    isShowed () {
        let p = this;

        while (p.parent) {
            if (!p.visible) {
                return false;
            }
            p = p.parent;
        }

        return true;
    }

    draw (ctx, ignoreCache) {
        //if (this.DisplayObject_draw(ctx, ignoreCache) || !this.image) { return true; }
        var img = this.image, rect = this.sourceRect;
        if (rect) {
            // some browsers choke on out of bound values, so we'll fix them:
            var x1 = rect.x, y1 = rect.y, x2 = x1 + rect.width, y2 = y1 + rect.height, x = 0, y = 0, w = img.width, h = img.height;
            if (x1 < 0) { x -= x1; x1 = 0; }
            if (x2 > w) { x2 = w; }
            if (y1 < 0) { y -= y1; y1 = 0; }
            if (y2 > h) { y2 = h; }
            ctx.drawImage(img, x1, y1, x2-x1, y2-y1, x, y, x2-x1, y2-y1);
        } else {
            ctx.drawImage(img, 0, 0);
        }
        return true;
    }

}

