import SpriteSheet from "./SpriteSheet.es6";

export default class BitmapText extends createjs.BitmapText {
    constructor(config, alias = null) {

        /**
         * If cross component alias
         */
        if(config.alias !== undefined){
            alias = config.alias;
        }

        let spriteSheet;

        if (config.spriteSheet instanceof SpriteSheet) {
            spriteSheet = config.spriteSheet;
        } else {
            spriteSheet = new SpriteSheet(config.spriteSheet, alias);
        }

        super(config.text, spriteSheet);

        if (config.lineHeight !== undefined) {
            this.lineHeight = config.lineHeight;
        }

        if (config.scaleX !== undefined) {
            this.scaleX = config.scaleX;
        }

        if (config.scaleY !== undefined) {
            this.scaleY = config.scaleY;
        }

        //this._imageWidth = config.spriteSheet.frames.width;
        //this._imageHeight = config.spriteSheet.frames.height;

        //this.width = config.width || this._imageWidth;
        //this.height = config.height || this._imageHeight;

    }

    set left(left) {
        this.x = left;
    }

    get left() {
        return this.x;
    }

    set top(top) {
        this.y = top;
    }

    get top() {
        return this.y;
    }

    setText (text) {
        this.text = text;
    }

    /*set width(width) {
     this.scaleX = width/this._imageWidth;
     }
     get width () {
     return this._imageWidth*this.scaleX;
     }

     set height(height) {
     this.scaleY = height/this._imageHeight;
     }
     get height () {
     return this._imageHeight * this.scaleY;
     }*/

}