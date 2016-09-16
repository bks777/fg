//import createjs from "../../libs/easeljs-0.8.2.modify.js";
import SpriteSheet from "./SpriteSheet.es6";

export default class Sprite extends createjs.Sprite {
    constructor (config, alias = null){

        let spriteSheet;

        /**
         * If cross component alias
         */
        if(config.alias !== undefined){
            alias = config.alias;
        }

        if (config.spriteSheet instanceof SpriteSheet) {
            spriteSheet = config.spriteSheet;
        } else {
            spriteSheet = new SpriteSheet(config.spriteSheet, alias);
        }

        super(spriteSheet);

        this.left = config.left || 0;
        this.top = config.top || 0;
        this.scaleX = config.scaleX || 1;
        this.scaleY = config.scaleY || 1;
        this.visible = config.visible !== undefined ? config.visible : true;

        if (!(config.spriteSheet instanceof SpriteSheet) && config.spriteSheet.frames.width) {
            this._imageWidth = config.spriteSheet.frames.width;
            this._imageHeight = config.spriteSheet.frames.height;
        }

        if (config.width !== undefined) {
            this.width = config.width;
        }
        if (config.height !== undefined) {
            this.height = config.height;
        }

        if (config.framerate !== undefined) {
            this.framerate = config.framerate;
        }

        if (config.defaultAnimation !== undefined) {
            if (config.startFrame !== undefined) {
                this.gotoAndStop (config.defaultAnimation);
                this.currentAnimationFrame = config.startFrame;
                this.play();
            } else {
                this.gotoAndPlay (config.defaultAnimation);
            }
        }

        if (config.backgroundClickable) {
            var hitArea = new createjs.Shape();
            var g = hitArea.graphics;
            g.beginFill("#000").drawRect(0, 0, this.width, this.height).endFill();
            this.hitArea = hitArea;
        }
    }

    set left (left) {
        this.x = left;
    }
    get left (){
        return this.x;
    }

    set top (top){
        this.y = top;
    }
    get top(){
        return this.y;
    }

    set width(width) {
        if (this._imageWidth) {
            this.scaleX = width/this._imageWidth;
        } else {
            let frame = 0;
            if (this.currentAnimation !== null) {
                frame = this.spriteSheet.getAnimation(this.currentAnimation).frames[0]
            }
            let rect = this.spriteSheet.getFrameBounds(frame);
            this.scaleX = width/(rect.width + rect.x*2);
        }
    }
    get width () {
        if (this._imageWidth) {
            return this._imageWidth*this.scaleX;
        } else {
            let frame = 0;
            if (this.currentAnimation !== null) {
                frame = this.spriteSheet.getAnimation(this.currentAnimation).frames[0]
            }
            let rect = this.spriteSheet.getFrameBounds(frame);
            return (rect.width + rect.x*2)*this.scaleX;
        }
    }

    set height(height) {
        if (this._imageHeight) {
            this.scaleY = height/this._imageHeight;
        } else {
            let frame = 0;
            if (this.currentAnimation !== null) {
                frame = this.spriteSheet.getAnimation(this.currentAnimation).frames[0]
            }
            let rect = this.spriteSheet.getFrameBounds(frame);
            this.scaleY = height/(rect.height + rect.y*2);
        }
    }

    get height () {
        if (this._imageHeight) {
            return this._imageHeight * this.scaleY;
        } else {
            let frame = 0;
            if (this.currentAnimation !== null) {
                frame = this.spriteSheet.getAnimation(this.currentAnimation).frames[0]
            }
            let rect = this.spriteSheet.getFrameBounds(frame);
            return (rect.height + rect.y*2) * this.scaleY;
        }
    }

    //set visible (bool) {
    //    this.visible = bool;
        //super.visible = bool;
        //if (this.stage) {
            //this.stage.requestUpdate();
        //}
    //}

    //get visible () {
    //    return this.visible;
        //return super.visible;
    //}
}