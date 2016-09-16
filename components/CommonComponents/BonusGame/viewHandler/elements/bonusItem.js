import Container from "../../../../../bower_components/html5-game-kernel/interfaces/modelsUI/Container.es6.js";
import Bitmap from "../../../../../bower_components/html5-game-kernel/interfaces/modelsUI/Bitmap.es6.js";
import ProtonEmitter from "../../../../../bower_components/html5-game-kernel/interfaces/modelsUI/ProtonEmitter.es6.js";
import Mummy from "./mummy";
import numbersSpriteSheet from "./numbersSpriteSheet";
import smokeSpriteSheet from "./smokeSpriteSheet";
import {winParticlesConfig,targetSpriteSheetConfig} from "./winParticlesConfig";

export default class BonusItem extends Container {
    constructor (config, alias) {
        super(config, alias);

        this.alias = alias;
        this.handler = null;

        this.height = 250;
        this.width = 100;

        this._mummyPosition = {
            bottom: 0,
            left: 0
        };

        this._showActionConfig = {
            time: 300
        };

        this._winActionConfig = {
            startY: 180,
            endY: 0,
            time: 300,
            scale: 0.39
        };

        this._lifeActionConfig = {
            startY: 180,
            endY: 0,
            time: 300
        };

        this._smokeConfig = {
            bottom: 70
        };

        this._disableActionConfig = {
            bottom: 40
        };

        this._princessActionConfig = {
            bottom: 13,
            startScale: 0,
            endScale: 1,
            time: 200,
            winOverPrincessY: 50
        };


        this.init(config);
    }

    init(config) {

        this.config = config;

        this._onClickUserAction = config.onClickUserAction || function () {};

        this._frontLayer = this.initFrontLayer();
        this._frontLayer.name = "frontLayer";
        this._backgroundLayer = this.initBackgroundLayer();
        this._backgroundLayer.name = "backgroundLayer";
        this._actionLayer = new Container();
        this._actionLayer.name = "actionLayer";

        this.addChild (this._backgroundLayer);
        this.setChildHeight(this._backgroundLayer, "100%");
        this.setChildWidth(this._backgroundLayer, "100%");
        this._backgroundLayer.regY = this.height;
        this._backgroundLayer.y = this.height;

        this.addChild (this._actionLayer);
        this.setChildHeight(this._actionLayer, "100%");
        this.setChildWidth(this._actionLayer, "100%");

        this.addChild (this._frontLayer);
        this.setChildHeight(this._frontLayer, "100%");
        this.setChildWidth(this._frontLayer, "100%");
        this._frontLayer.regY = this.height;
        this._frontLayer.y = this.height;

        this.regY = this.height;
        this.regX = this.width/2;

        this.initHandlers();

        this.goto ("hide");
    }

    initHandlers () {
        this.addEventListener ("click", () => {
            if (this.selected || !this.chooseEnabled) {
                return;
            }



            this.chooseEnabled = false;
            this.cursor = null;
            this.selected = true;
            this._onClickUserAction();

            $_services.getService("SoundService").play("audio_btn_select_popup");
        });

        this.addEventListener ("rollover", () => {
            this.mouseOn = true;

            if (this.selected || !this.chooseEnabled) {
                return;
            }

            this.showLight();

            $_services.getService("SoundService").play("audio_bg_choice");

            // this.initWinEmitter();

        });

        this.addEventListener ("rollout", () => {
            this.mouseOn = false;

            if (this.selected || !this.chooseEnabled) {
                return;
            }

            this.hideLight();

            this.hideWinEmitter();
        });
    }

    initBackgroundLayer () {
        let layer = new Container();

        return layer;
    }

    initFrontLayer () {
        let layer = new Container();

        return layer;
    }

    enableChoosing () {
        this.chooseEnabled = true;
        this.cursor = "pointer";

        if (this.mouseOn) {
            this.showLight();
        }
    }

    disableChoosing () {
        this.chooseEnabled = false;
        this.cursor = null;
    }

    showLight () {
        let light = new Bitmap ({
            src: "light",
        }, this.alias);
        light.name = "light";

        light.alpha = 0;
        light.mouseEnabled = false;

        this._frontLayer.addChild (light);
        this._frontLayer.setChildBottom(light, 0);
        this._frontLayer.setChildAlign ("center", light);

        createjs.Tween
            .get(light, {override: true})
            .to ({alpha: 1}, 50);

        this._light = light;
    }

    hideLight () {
        if (!this._light) {
            return;
        }

        createjs.Tween
            .get(this._light, {override: true})
            .to ({alpha: 0}, 50)
            .call (() => {
                this._frontLayer.removeChild (this._light);
                delete this._light;
            })
    }

    hide () {
        this.visible = false;
        this.closeView();
    }

    show() {
        this.visible = true;
        $_services.getService("SoundService").play("audio_bg_item_show_v2");
        //this.closeState();
    }

    showAction () {
        this.visible = true;
        this.scaleY = 0;

        createjs.Tween
            .get(this)
            .to ({scaleY: 1.15}, this._showActionConfig.time*0.7)
            .to ({scaleY: 1}, this._showActionConfig.time*0.3)
            .call (() => {
                this.goto ("close");
            })

    }

    createNumbers (win = 0) {
        let winAmount = new BitmapText({
            text: win.toString(),
            textAlign: "center",
            spriteSheet: numbersSpriteSheet
        }, this.alias);
        winAmount.name = "winAmount";

        return winAmount;
    }

    initWinEmitter () {
        return new Promise((resolve, reject)=>{
            let target = new Sprite ({spriteSheet: targetSpriteSheetConfig}, this.alias);
            target.gotoAndPlay ("star_particle_anim");
            target.regX = 25;
            target.regY = 25;

            let winEmitter = new ProtonEmitter ({
                target,
                emitterConfig: winParticlesConfig

            }, this.alias);

            $_services.getService("SoundService").play("audio_bg_win");

            winEmitter.x = this.width/2;
            winEmitter.y = this.height - 40;
            winEmitter.visible = false;

            this._actionLayer.addChild(winEmitter);
            // console.error('emitter must be started', this._actionLayer.visible);
            this._winEmitter = winEmitter;

            this._winEmitter.emitter.rate.timePan.a = 0;
            this._winEmitter.emitter.rate.timePan.b = 0;
            this._winEmitter.gravity = -6;

            this._winEmitter.emitter.initializes.forEach( function (beh) {
                var name = beh.constructor.name;

                if (name === 'Velocity') {
                    beh.rPan.a = 0;
                    beh.rPan.b = 0.5;
                }
            });

            this._winEmitter.emitter.emit();

            setTimeout (() => {
                if (!this._winEmitter) {
                    return;
                }
                this._winEmitter.emitter.rate.timePan.a = 0;
                this._winEmitter.emitter.rate.timePan.b = 0;
                this._winEmitter.gravity = -3.5;

                this._winEmitter.emitter.initializes.forEach( function (beh) {
                    var name = beh.constructor.name;

                    if (name === 'Velocity') {
                        beh.rPan.a = 0;
                        beh.rPan.b = 0.25;
                    }
                });

            }, 150);

            setTimeout (() => {
                if (!this._winEmitter) {
                    return;
                }
                this._winEmitter.emitter.rate.timePan.a = 0.2;
                this._winEmitter.emitter.rate.timePan.b = 0.3;
                this._winEmitter.gravity = -0.5;

                this._winEmitter.emitter.initializes.forEach( function (beh) {
                    var name = beh.constructor.name;

                    if (name === 'Velocity') {
                        beh.rPan.a = 0;
                        beh.rPan.b = 0;
                    }
                });

            }, 300);
            resolve();
        });
    }

    showWinEmitter () {
        if (this._winEmitter) {
            this._winEmitter.visible = true;
            //this._winEmitter.alpha = 1;
            createjs.Tween
                .get(this._winEmitter)
                .to ({alpha: 1}, 100)
        }
    }

    hideWinEmitter () {
        if (this._winEmitter) {
            this._winEmitter.parent.removeChild(this._winEmitter);
            delete this._winEmitter;
        }
    }

    winAction (win = 0, endY = this._winActionConfig.endY) {
        this.hideWinAmount();
        this.initWinEmitter()
            .then(this.showWinEmitter());
        let winAmount = this.createNumbers(win);

        this._actionLayer.addChild(winAmount);

        winAmount.scaleX = winAmount.scaleY = this._winActionConfig.scale;

        winAmount.y = this._winActionConfig.startY;
        winAmount.x = this.width/2 - winAmount.scaleX/2;

        winAmount.regX = winAmount.getBounds().width / 2;
        winAmount.regY = winAmount.getBounds().height / 2;


        let path = endY - this._winActionConfig.startY;

        let koef = 0;

        if(__RunPartialApplication.type == "mobile"){
            if($_view_canvas.verticalMode){
                koef = -10;
            } else {
                koef = 28;
            }
        }

        createjs.Tween
            .get(winAmount)
            .to ({y: endY + path * 0.15 + koef}, this._winActionConfig.time*0.7)
            .to ({y: endY + koef}, this._winActionConfig.time*0.3)
            .call (() => {

            });

        createjs.Tween
            .get(winAmount, {loop: true})
            .to ({scaleX: .43, scaleY: .43}, 1000)
            .to ({scaleX: this._winActionConfig.scale, scaleY: this._winActionConfig.scale}, 1000);
        this._winAmount = winAmount;
    }

    win(win = 0) {
        this.openState();
        //this.hideWinAmount();

        let winAmount = this.createNumbers(win);

        this._actionLayer.addChild(winAmount);

        winAmount.scaleX = winAmount.scaleY = this._winActionConfig.scale;

        winAmount.y = this._winActionConfig.endY;
        winAmount.x = this.width/2 - winAmount.getBounds().width*winAmount.scaleX/2;

        this._winAmount = winAmount;
    }

    hideWinAmount () {
        if (this._winAmount) {
            this._winAmount.parent.removeChild(this._winAmount);
            delete this._winAmount;
        }
    }

    createMummy () {
        return new Mummy({}, this.alias);
    }

    ripAction () {

        this.hideMummy();

        this._mummy = this.createMummy();

        this._actionLayer.addChild(this._mummy);
        this._actionLayer.setChildBottom(this._mummy, this._mummyPosition.bottom);
        this._actionLayer.setChildLeft(this._mummy, this._mummyPosition.left);

        this._mummy.angry();

        if([0, 4, 5].indexOf(this.handler.getElementIDOfFloor()) != -1){

            var graphics = new createjs.Graphics().beginFill("#ff0000").drawRect(-50, 0, 400, 200);
            var shape = new createjs.Shape(graphics);
            shape.cache(0, 0, 400, 200);

            this._mummy.mask = shape;
        }

    }

    rip () {
        this.openState();

        this._mummy = this.createMummy();

        this._actionLayer.addChild(this._mummy);
        this._actionLayer.setChildBottom(this._mummy, this._mummyPosition.bottom);
        this._actionLayer.setChildLeft(this._mummy, this._mummyPosition.left);

        this._mummy.idle();

        if([0, 4, 5].indexOf(this.handler.getElementIDOfFloor()) != -1){

            var graphics = new createjs.Graphics().beginFill("#ff0000").drawRect(-50, 0, 400, 200);
            var shape = new createjs.Shape(graphics);
            shape.cache(0, 0, 400, 200);

            this._mummy.mask = shape;
        }
    }

    hideMummy () {
        if (this._mummy) {
            this._mummy.parent.removeChild(this._mummy);
            delete this._mummy;
        }
    }

    lifeAction () {
        this.hideHeart();

        this._heart = new Bitmap ({
            src: "heart",
        }, this.alias);

        this._heart.name = "heart";
        this._heart.y = this._lifeActionConfig.startY;
        this._heart.x = this.width/2 - this._heart.width/2;

        let path = this._lifeActionConfig.endY - this._lifeActionConfig.startY;

        this._actionLayer.addChild(this._heart);

        createjs.Tween
            .get(this._heart)
            .to ({y: this._lifeActionConfig.endY + path*0.15}, this._lifeActionConfig.time*0.7)
            .to ({y: this._lifeActionConfig.endY}, this._lifeActionConfig.time*0.3)
            .call (() => {
                this.life();
            });
    }

    life () {
        this.openState();

        this._heart = new Bitmap ({
            src: "heart"
        }, this.alias);

        this._heart.name = "heart";

        this._heart.regX = this._heart.width/2;
        this._heart.regY = this._heart.height/2;

        this._heart.y = this._lifeActionConfig.endY + this._heart.regY;
        this._heart.x = this.width/2;

        this._actionLayer.addChild(this._heart);

        createjs.Tween
            .get(this._heart, {loop: true})
            .wait(1000)
            .to ({scaleX: 1.2, scaleY: 1.2}, 100)
            .to ({scaleX: 1, scaleY: 1}, 100)
            .wait(100)
            .to ({scaleX: 1.2, scaleY: 1.2}, 100)
            .to ({scaleX: 1, scaleY: 1}, 100)

    }

    hideHeart() {
        if (this._heart) {
            this._heart.parent.removeChild(this._heart);
            delete this._heart;
        }
    }

    princessAction (win) {
        this.hidePrincess();

        this._princess = new Bitmap ({
            src: "princess"
        }, this.alias);

        this.winAction(win, this._actionLayer.height - (this._princessActionConfig.bottom + this._princess.height + this._princessActionConfig.winOverPrincessY) );

        this._princess.name = "princess";
        this._princess.regY = this._princess.height;
        this._actionLayer.setChildBottom(this._princess, this._princessActionConfig.bottom - this._princess.regY);
        this._actionLayer.setChildAlign("center", this._princess);
        this._princess.scaleY = this._princessActionConfig.startScale;

        this._actionLayer.addChild(this._princess);

        createjs.Tween
            .get(this._princess)
            .to ({scaleY: this._princessActionConfig.endScale*1.15}, this._princessActionConfig.time*0.7)
            .to ({scaleY: this._princessActionConfig.endScale}, this._princessActionConfig.time*0.3)
            .call (() => {

            });
    }

    princessState () {
        this.openState();
        this.hidePrincess();

        this._princess = new Bitmap ({
            src: "princess"
        }, this.alias);

        this._princess.name = "princess";
        this._actionLayer.setChildBottom(this._princess, this._princessActionConfig.bottom);
        this._princess.x = this.width/2 - this._princess.width/2;

        this._actionLayer.addChild(this._princess);
    }

    hidePrincess () {
        if (this._princess) {
            this._princess.parent.removeChild(this._princess);
            delete this._princess;
        }
    }

    showSmoke () {

        let smoke = new Sprite ({
            spriteSheet: smokeSpriteSheet
        }, this.alias);
        smoke.name = "smoke";

        smoke.addEventListener("animationend", () => {
            smoke.stop();
            smoke.visible = false;
            this._frontLayer.removeChild(smoke);
        });

        this._frontLayer.addChild(smoke);
        //smoke.y = this._frontLayer.height - smoke.getBounds().height - 50;
        this._frontLayer.setChildBottom(smoke, this._smokeConfig.bottom);
        this._frontLayer.setChildAlign("center", smoke);

        smoke.gotoAndPlay ("smoke");
    }

    openAction (action, win) {

        this.hideLight();
        this.closeState(false);

        // if (action !== "ripAction") {
        //     // this.showWinEmitter();
        // } else {
        //     //this.hideWinEmitter();
        // }

        return new Promise ((resolve, reject) => {

            createjs.Tween
                .get(this._frontLayer)
                .to({scaleY: 0.7}, 100)
                .call(() => {
                    this.openView();

                    switch (action) {
                        case "ripAction":
                            this.ripAction();
                            break;
                        case "lifeAction":
                            this.lifeAction();
                            break;
                        case "princessAction":
                            this.princessAction(win);
                            break;
                        case "winAction":
                            this.winAction(win);
                            break;
                    }

                    this.showSmoke();
                })
                .to({scaleY: 1.05}, 100)
                .to({scaleY: 1}, 50);

            createjs.Tween
                .get(this._backgroundLayer)
                .to({scaleY: 0.7}, 100)
                .to({scaleY: 1.05}, 100)
                .to({scaleY: 1}, 50);

            setTimeout (resolve, 1500);

        });

    }

    openView() {

    }

    openState () {
        this.show();

        this.openView ();

        this.hideHeart();
        this.hideMummy();
        this.hideWinAmount();
        this.hidePrincess();
        //this.hideWinEmitter();

        this.disableChoosing();
    }

    closeView() {

    }

    closeState (enableChoose = true) {
        this.show();

        this.closeView();

        this.hideHeart();
        this.hideMummy();
        this.hideWinAmount();
        this.hidePrincess();
        this.hideDisable();
        //this.hideWinEmitter();

        if (enableChoose) {
            this.enableChoosing();
        }
    }

    disableState (param) {
        this.closeState(false);
        this.disableChoosing();

        let frontHeight = this._frontLayer.getBounds().height;

        switch (param) {
            case "life":

                this._heart = new Bitmap ({
                    src: "heart"
                }, this.alias);

                this._heart.name = "heart";
                this._frontLayer.addChild(this._heart);
                this._frontLayer.setChildAlign ("center", this._heart);
                this._heart.y = this._frontLayer.height - (this._heart.getBounds().height * this._heart.scaleY)/2 - frontHeight/2;//this._disableActionConfig.bottom;

                break;
            case "rip":

                this._mummy = this.createMummy();

                this._frontLayer.addChild(this._mummy);
                this._frontLayer.setChildBottom(this._mummy, 5);
                this._frontLayer.setChildLeft(this._mummy, this._mummyPosition.left);

                this._mummy.angry();

                break;
            case "princess":

                this._princess = new Bitmap ({
                    src: "princess"
                }, this.alias);

                this._princess.name = "princess";
                this._frontLayer.setChildBottom(this._princess, 0);
                this._frontLayer.setChildAlign("center", this._princess);
                this._frontLayer.addChild(this._princess);

                break;
            default:
                this._winAmount  = this.createNumbers(param);

                this._frontLayer.addChild(this._winAmount);

                this._winAmount.scaleX = this._winAmount.scaleY = this._winActionConfig.scale;
                this._winAmount.y = this._frontLayer.height - (this._winAmount.getBounds().height * this._winAmount.scaleY)/2 - frontHeight/2;// - this._disableActionConfig.bottom;
                this._winAmount.x = this.width/2 - this._winAmount.getBounds().width*this._winAmount.scaleX/2;
        }

        this.filters = [
            new createjs.ColorMatrixFilter(new createjs.ColorMatrix(0, -9, -70, 25)),
            new createjs.ColorMatrixFilter(new createjs.ColorMatrix(10, 0, 0, 0))
        ];
        let rect = this.getBounds();
        this.cache(rect.x, rect.y, rect.width, rect.height);

        this._disableImage = new Bitmap (this.cacheCanvas, this.alias);

        this.filters = [];
        this.uncache();

        this._disableImage.alpha = 0;
        this._disableImage.x = rect.x;
        this._disableImage.y = rect.y;
        this.addChild (this._disableImage);

        this.hideHeart();
        this.hideMummy();
        this.hidePrincess();
        this.hideWinAmount();

        createjs.Tween
            .get(this._disableImage)
            .to ({alpha: 1}, 200);

    }

    hideDisable () {
        if (this._disableImage) {
            this._disableImage.parent.removeChild(this._disableImage);
            delete this._disableImage;
        }
    }

    goto (action, param) {
        //console.error (action);
        return new Promise ((resolve, reject) => {

            if (action !== "winAction" && action !== "lifeAction" && action !== "princessAction") {
                this.hideWinEmitter();
            }

            switch (action) {
                case "hide":
                    this.hide();
                    resolve();
                    break;

                case "showAction":
                    this.showAction();
                    resolve();
                    break;

                case "close":
                    this.closeState();
                    resolve();
                    break;

                case "winAction":
                case "ripAction":
                case "lifeAction":
                case "princessAction":
                    this.openAction (action, param).then(resolve);
                    break;

                case "win":
                    this.win(param);
                    resolve();
                    break;


                case "rip":
                    this.rip();
                    resolve();
                    break;

                case "life":
                    this.life();
                    resolve();
                    break;

                case "disable":
                    this.disableState(param);
                    resolve();
                    break;

                default:
                    resolve();
            }

        });

    }

}