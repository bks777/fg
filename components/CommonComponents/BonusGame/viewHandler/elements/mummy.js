import Container from "../../../../../bower_components/html5-game-kernel/interfaces/modelsUI/Container.es6.js";
import SpriteSheet from "../../../../../bower_components/html5-game-kernel/interfaces/modelsUI/SpriteSheet.es6.js";
import Sprite from "../../../../../bower_components/html5-game-kernel/interfaces/modelsUI/Sprite.es6.js";
import mummySpriteSheetConfig from "./mummySpriteSheet";


export default class Mummy extends Container {
    constructor (config, alias) {
        super();

        this.alias = alias;

        this.init();
    }

    init () {
        this.name = "mummy";
        let mummySpriteSheet = new SpriteSheet (mummySpriteSheetConfig, this.alias);

        this._mummyBody = new Sprite({
            spriteSheet: mummySpriteSheet
        }, this.alias);

        this._leftHand = new Sprite({
            spriteSheet: mummySpriteSheet
        }, this.alias);

        this._rightHand = new Sprite({
            spriteSheet: mummySpriteSheet
        }, this.alias);

        this._head = new Sprite({
            spriteSheet: mummySpriteSheet
        }, this.alias);


        this.addChild (this._leftHand);
        this.addChild (this._rightHand);
        this.addChild (this._mummyBody);
        this.addChild (this._head);

        this._head.y = -40;
        this._head.x = 15;
        this._mummyBody.x = -23;
        this._mummyBody.y = 5;
        this._mummyBody.gotoAndPlay ("mum_start");
        this._leftHand.scaleX = -1;

        this._head.visible = false;
        this._leftHand.visible = false;
        this._rightHand.visible = false;

        this.on ("click", () => {
            this.playTween();
        });
    }

    angry (callback) {

        $_services.getService("SoundService").play("audio_bg_mummy");

        createjs.Tween
            .get(this)
            .call (() => {
                this._head.visible = false;
                this._leftHand.visible = false;
                this._rightHand.visible = false;
                //this._head.y = -40;
                //this._head.x = 15;
                this._mummyBody.gotoAndPlay ("mum_start");
                this._mummyBody.x = -23;
            })
            .wait (4/30 * 1000)
            .call (() => {
                this._mummyBody.x = 0;
                this._head.visible = true;
                this._leftHand.visible = true;
                this._rightHand.visible = true;

                this._mummyBody.gotoAndPlay ("mummy_body");

                this._leftHand.gotoAndPlay ("mum_arm_start");

                this._leftHand.rotation = 0;
                this._leftHand.x = 57;
                this._leftHand.y = -83;

                this._rightHand.gotoAndPlay ("mum_arm_start");
                this._rightHand.x = 13;
                this._rightHand.y = -82;
                this._rightHand.rotation = 8;
                this._rightHand.currentAnimationFrame = 3;

                this._head.x = 12;
                this._head.gotoAndPlay ("mum_head_start");
                this._head.addEventListener ("animationend", () => {
                    this._head.x = 15;
                    this._head.removeAllEventListeners("animationend");
                })
            })
            .wait (1100)
            .call (() => {
                this._leftHand.gotoAndPlay ("mum_arm_idle");
                this._leftHand.x = 43;
                this._leftHand.y = -42;
                this._leftHand.rotation = 20;

                this._rightHand.gotoAndPlay ("mum_arm_idle");
                this._rightHand.x = 40;
                this._rightHand.y = -44;
                this._rightHand.rotation = 0;
                this._rightHand.currentAnimationFrame = 3;

            })
            .wait (1000)
            .call (() => {
                if (typeof callback === "function") {
                    callback();
                }
            })
    }

    idle () {
        this._mummyBody.visible = true;
        this._mummyBody.x = 0;
        this._mummyBody.y = 1;

        this._mummyBody.gotoAndPlay ("mummy_body");

        this._head.visible = true;
        this._head.gotoAndPlay ("mum_head_idle");

        this._leftHand.visible = true;
        this._leftHand.gotoAndPlay ("mum_arm_idle");
        this._leftHand.x = 43;
        this._leftHand.y = -42;
        this._leftHand.rotation = 20;

        this._rightHand.visible = true;
        this._rightHand.gotoAndPlay ("mum_arm_idle");
        this._rightHand.x = 40;
        this._rightHand.y = -44;
        this._rightHand.rotation = 0;
        this._rightHand.currentAnimationFrame = 3;

    }
}