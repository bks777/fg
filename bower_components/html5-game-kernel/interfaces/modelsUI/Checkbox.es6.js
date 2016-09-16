import Sprite from "./Sprite.es6";
//import SpriteSheet from "./SpriteSheet.es6";

export default class Checkbox extends Sprite {

    constructor (config, alias = null) {

        super(config, alias);

        if (config.checked === true) {
            this.checked = true;
        } else {
            this.checked = false;
        }

        this.addEventListener ("click", () => {
            this.checked = !this.checked;
        });

        this.cursor = "pointer";

    }

    set checked (checked) {
        this._checked = checked;
        if (checked) {
            this.gotoAndStop ("clicked");
        } else {
            this.gotoAndStop ("normal");
        }
    }

    get checked () {
        return this._checked;
    }

    set disabled (bool) {
       /* this.mouseEnabled = this.helper.enabled = !bool;

        if (bool) {
            this.gotoAndStop("disabled");
        } else {
            this.gotoAndStop("normal");
        }*/
    }

   /* on (event, callback) {
        if (typeof callback === "function") {
            this.addEventListener (event, callback);
        }
    }*/




}
