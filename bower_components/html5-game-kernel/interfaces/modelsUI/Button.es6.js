import Sprite from "./Sprite.es6";
//import SpriteSheet from "./SpriteSheet.es6";

export default class Button extends Sprite {

    constructor (config, alias = null) {
        super(config, alias);
        //this.helper = new createjs.ButtonHelper(this, "normal", "hover", "clicked");

        this.addEventListener ("rollover", () => {
            if (!this.mouseEnabled) {
                return;
            }

            this.mouseOn = true;

            if (this.mouseDown) {
                this.gotoAndStop("clicked");
            } else {
                this.gotoAndStop("hover");
            }

            if(this.stage){
                this.stage.requestUpdateTarget(this);
            }
        });

        this.addEventListener ("rollout", () => {
            if (!this.mouseEnabled) {
                return;
            }

            this.mouseOn = false;

            if (this.mouseDown) {
                this.gotoAndStop("clicked");
            } else {
                this.gotoAndStop("normal");
            }

            if(this.stage){
                this.stage.requestUpdateTarget(this);
            }
        });

        this.addEventListener ("mousedown", () => {
            this.gotoAndStop("clicked");
            this.mouseDown = true;
        });

        this.addEventListener ("pressup", () => {

            if (!this.mouseEnabled) {
                return;
            }

            if (this.mouseOn) {
                this.gotoAndStop("hover");
            } else {
                this.gotoAndStop("normal");
            }

            this.mouseDown = false;
        });

        this.gotoAndStop("normal");
        this.cursor = "pointer";

    }

    /*get normalLabel () {
        return this.helper.outLabel;
    }

    set normalLabel (label) {
        this.helper.outLabel = label;
    }

    get hoverLabel () {
        return this.helper.overLabel;
    }

    set hoverLabel (label) {
        this.helper.overLabel = label;
    }

    get clickedLabel () {
        return this.helper.downLabel;
    }

    set clickedLabel (label) {
        this.helper.downLabel = label;
    }*/

    set disabled(bool){
        if (bool){
            this.disable()
        } else {
            this.enable()
        }
    }

    disable(){
        this.cursor = null;
        //this.helper.enabled = false;
        this.mouseEnabled = false;
        this.mouseDown = false;
        this.mouseOn = false;
        this.gotoAndStop("disabled");
    }

    enable(){
        this.cursor = "pointer";
        this.mouseEnabled = true;
        //this.helper = new createjs.ButtonHelper(this, "normal", "hover", "clicked");
        this.gotoAndStop("normal");
    }
    
    on (event, callback) {
        if (typeof callback === "function") {
            this.addEventListener (event, callback);
        }
    }

}
