import ComponentInterface from "../../interfaces/component/componentInterface.es6";
import {Bitmap, Text, Container} from "../../interfaces/modelsUI/Core.es6";
import ViewCanvasHandler from "./ViewCanvasHandler.es6.js";

/**
 * View Main Canvas for template
 * @constructor
 */
const POSITION_CRUNCH = {
    portrait: 200,
    landscape: -55
};

export default class ViewMainCanvas extends ComponentInterface {
    get HIGH_QUALITY() {
        return 1;
    }

    get MEDIUM_QUALITY() {
        return 2;
    }

    get LOW_QUALITY() {
        return 3;
    }

    constructor(data = {}) {
        super(data);

        this._stage = null;

        this._gameContainer = null;
        this.canvas = null;

        this.config = {
            canvas: {
                maxWidth: 1280,
                maxHeight: 740
            },
            gameContainer: {
                width: 960,
                height: 740
            }
        };

        this.configData = data;

        this.timeIntervalNoActivity = 6 * 1000;
        this.intervalNoActivity = null;

        this._freezeTicker = false;

        this._lastMousePosition = {x: 0, y: 0};

        this.initGame();
        //this.initGame();
        //setTimeout(this.initGame.bind(this), 0);

        this.initStats();

        if($_log.dev === true){
            //this.spaceBraking();
        }

    }

    spaceBraking(){

        /*createjs.Ticker.deltaTime = 0;
        createjs.Ticker.dispatchEvent = (function () {
            var parent = createjs.Ticker.dispatchEvent;
            return function (event) {
                if (event.type === 'tick') {
                    event.delta *= app.playbackRate;
                    this.deltaTime = event.delta;
                }
                parent.call(this, event);
            };
        })();

        document.onkeypress = (e) => {

            if(e.spaceBraking == 32){

            }

        }*/
    }

    /**
     * Subscribe events for activity
     */
    subscribeEventsForActivity(callback = () => {}) {
        document.body.onmouseover =
            document.body.onmouseout =
                document.body.onclick =
                    document.body.ontouchstart =
                        document.body.onmousemove =
                            document.body.ontouchmove = callback();
    }

    /**
     * UnSubscribe events for activity
     */
    unSubscribeEventsForActivity (){

        document.body.onmouseover =
            document.body.onmouseout =
                document.body.onclick =
                    document.body.ontouchstart =
                        document.body.onmousemove =
                            document.body.ontouchmove = null;
    }

    /**
     * Init main canvas
     */
    initMainCanvas() {

        Object.assign(this.config, this.configData.frameSize[__RunPartialApplication.type]);

        this.canvas = document.getElementById(this.canvasID);

        let stage = this.initStage(this.canvas);
        this._stage = stage;
        this.lastStage = stage;

        //this.subscribeEventsForActivity();

        var gameContainer = this.initGameContainer();
        //let backgroundLayer = this.initBackground ();

        //stage.addChild(backgroundLayer, gameContainer);
        stage.addChild(gameContainer);

        this.stages = [];
        this.stages.push(stage);

        switch (this.getService("GameSettingsService").getLocalSettings("graphics_quality")) {
            case "high":
                this.setQuality(this.HIGH_QUALITY);
                break;
            case "medium":
                this.setQuality(this.MEDIUM_QUALITY);
                break;
            case "low":
                this.setQuality(this.LOW_QUALITY);
                break;
            default:
                this.setQuality(this.HIGH_QUALITY);
                this.getService("GameSettingsService").setLocalSettings("graphics_quality", "high");
        }


        //this.initFPSBlock ();

        window.addEventListener("resize", () => {
            this.resize();

            $_event.setEvent("resize");
        })
    }


    /**
     * Init game
     */
    initGame() {

    };

    initVerticalMode() {

    }

    setGameScale(scale) {
        let stage = this.getStage();
        let numOfChildren = stage.getNumChildren();
        for (let i = 0; i < numOfChildren; i++) {
            stage.getChildAt(i).scaleX = scale;
            stage.getChildAt(i).scaleY = scale;
        }
    };

    setQuality(quality) {
        switch (quality) {
            case this.MEDIUM_QUALITY:
                this.setGameScale(0.75);
                break;
            case this.LOW_QUALITY:
                this.setGameScale(0.65);
                break;
            case this.HIGH_QUALITY:
            default:
                this.setGameScale(1);
        }

        this.resize();
    }

    enableModalModeForLayer(layer) {
        let stage = this.getStage();

        if (!stage.getChildByName(layer.name)) {

            this.getStage().children.forEach((el) => {
                if (el.name !== "settings" && el.name !== "gameContainer") {
                    el.mouseEnabled = false;
                }
            });

            this.getGameContainer().children.forEach((el) => {
                if (el.name !== layer.name) {
                    el.mouseEnabled = false;
                }
            });

        } else {
            this.getStage().children.forEach((el) => {
                if (el.name !== layer.name && el.name !== "settings") {
                    el.mouseEnabled = false;
                }
            });
        }
    }

    disableModalModeForLayer(layer) {
        this.getStage().children.forEach((el) => {
            el.mouseEnabled = true;
        });

        this.getGameContainer().children.forEach((el) => {
            el.mouseEnabled = true;
        });
    }

    initFPSBlock() {
        let fpsBlock = new Text({text: "60.00", font: "36px Arial", color: "#FFFFFF"});
        fpsBlock.y = 70;
        fpsBlock.zIndex = 1;
        fpsBlock.name = "fpsBlock";

        this.getGameContainer().addChild(fpsBlock);

        let rect = fpsBlock.getBounds();
        let width = rect.width;
        let height = rect.height;
        fpsBlock.cache(rect.x, rect.y, rect.width, rect.height);
        let pt = fpsBlock.localToGlobal(0, 0);
        let rectFPS = new createjs.Rectangle(pt.x, pt.y, width, height);

        let i = 0;
        createjs.Ticker.addEventListener("tick", () => {
            i++;

            if (i === 60) {
                fpsBlock.text = createjs.Ticker.getMeasuredFPS().toFixed(2);
                fpsBlock.updateCache();
                this.getStage().requestUpdate(rectFPS);
                i = 0;
            }

        });

        //this.getGameContainer().setChildAlign("center", fpsBlock);
    }

    getComponentLayout(alias) {
        let layout = this.getStage().getChildByName(alias);
        if (!layout) {
            layout = this.getGameContainer().getChildByName(alias);
        }

        return layout;
    }

    /**
     * Hide component layer
     * @param componentAlias
     * @returns {boolean}
     */
    hideComponent(componentAlias) {
        let componentLayout = this.getComponentLayout(componentAlias);
        if (componentLayout) {
            componentLayout.visible = false;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Show component layer
     * @param componentAlias
     * @returns {boolean}
     */
    showComponent(componentAlias) {

        let componentLayout = this.getComponentLayout(componentAlias);
        if (componentLayout) {
            componentLayout.visible = true;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Init game container
     * @returns {ViewMainCanvas._gameContainer|*}
     */
    initGameContainer() {
        this._gameContainer = new Container();
        this._gameContainer.name = "gameContainer";
        this._gameContainer.x = this.config.gameContainer.left || 0;
        this._gameContainer.y = this.config.gameContainer.top || 0;
        this._gameContainer.width = this.config.gameContainer.width || 0;
        this._gameContainer.height = this.config.gameContainer.height || 0;
        this._gameContainer.zIndex = 1;

        return this._gameContainer;
    };

    /**
     * INit stage
     * @returns {ViewMainCanvas._stage|*}
     */
    initStage(canvas) {

        let stage = new createjs.Stage(canvas);
        //let stage = this._stage;

        if (createjs.Touch.isSupported()) {
            createjs.Touch.enable(stage);
        }
        stage.enableMouseOver();

        stage.addEventListener("stagemouseup", () => {
            stage.requestUpdate();
        });

        stage.addEventListener("stagemousedown", () => {
            stage.requestUpdate();
        });

        stage.startTween = (rect, alias) => {
            //return;
            //stage.tweens++;

            if (rect) {

                /*if (stage.tweenRect) {
                 stage.tweenRect = rect.union (stage.tweenRect);
                 } else {
                 stage.tweenRect = rect;
                 }*/
                /*if (stage.drawRect) {
                 stage.drawRect = stage.drawRect.union(stage.tweenRect);
                 } else {
                 stage.drawRect = stage.tweenRect;
                 }*/


                stage.tweenRects[stage.tweenRects.length] = rect;
                $_log.log("tween start", stage.tweenRects);
                return stage.tweenRects.length - 1;
            }
            return undefined;
        };

        stage.startTweenTarget = (target, alias) => {
            //return;
            if (target) {
                let rect = target.getBounds();
                if (rect === null) {
                    rect = this.getComponentLayout(alias).getBounds();
                }
                let pt = target.localToGlobal(rect.x, rect.y);
                return stage.startTween(new createjs.Rectangle(pt.x, pt.y, rect.width, rect.height), alias);
            } else {
                return null;
            }
        };

        stage.endTween = (id, alias) => {
            //return;
            //stage.tweens--;
            if (id !== undefined && id !== null) {

                stage.tweenRects[id] = null;
                let maxNotNullId;

                for (let i = stage.tweenRects.length - 1; i >= 0; i--) {
                    if (stage.tweenRects[i] !== null) {
                        maxNotNullId = i + 1;
                        break;
                    }
                }

                if (maxNotNullId === undefined) {
                    stage.tweenRects = [];
                } else if (maxNotNullId < stage.tweenRects.length) {
                    stage.tweenRects.splice(maxNotNullId, (stage.tweenRects.length - maxNotNullId));
                }
                $_log.log("tween end", stage.tweenRects);
            }
        };

        stage.requestUpdate = (rect, alias) => {
            //return;
            if (stage.requestFullUpdate !== true) {
                if (rect) {
                    if (stage.drawRect) {
                        stage.drawRect = stage.drawRect.union(rect);
                    } else {
                        stage.drawRect = rect;
                    }
                } else {
                    stage.requestFullUpdate = true;
                    stage.drawRect = null;
                }
            }

            stage.requestAnimation = true;
            this.updateStats();
        };

        stage.requestUpdateTarget = (target, alias) => {
            //return;
            if (target) {
                let rect = target.getBounds();
                let pt = target.localToGlobal(rect.x, rect.y);
                stage.requestUpdate(new createjs.Rectangle(pt.x, pt.y, rect.width, rect.height), alias);
            }
        };

        stage.requestAnimation = false;
        stage.requestFullUpdate = false;
        stage.tweens = 0;
        stage.tweenRect = null;
        stage.tweenRects = [];

        let defaultRectangle = new createjs.Rectangle(0, 0, 0, 0);

        createjs.Ticker.setFPS(60);
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        //createjs.Ticker.timingMode = createjs.Ticker.RAF;

        createjs.Ticker.addEventListener("tick", (event) => {

            if (this._freezeTicker) {
                return;
            }


            //stage.autoClear = false;
            stage.update(event);
            //this.proton.update();
            return;


            let tweenRect = new createjs.Rectangle(0, 0, 0, 0);
            let needTween = false;
            for (let t in stage.tweenRects) {
                if (stage.tweenRects[t] !== null) {
                    tweenRect = tweenRect.union(stage.tweenRects[t]);
                    needTween = true;
                }
            }

            if (stage.requestAnimation || needTween) {
                //stage.updateCache();
                if (stage.drawRect) {
                    stage.drawRect = tweenRect.union(stage.drawRect);
                } else {
                    stage.drawRect = tweenRect;
                }
                if (stage.requestFullUpdate) {
                    stage.drawRect = null;
                }
                stage.update(event);
                stage.requestAnimation = false;
                stage.requestFullUpdate = false;
                //stage.drawRect = stage.tweenRect;
            } else {
                stage.drawRect = defaultRectangle;
                stage.update(event);
            }


            /*
             if (stage.tweenRects.length && !stage.requestFullUpdate) {
             let drawRect = stage.drawRect;
             stage.tickEnabled = false;
             for (let t in stage.tweenRects) {
             if (stage.tweenRects[t] !== null) {
             stage.drawRect = stage.tweenRects[t];
             stage.update(event);
             }
             }
             stage.tickEnabled = true;
             stage.drawRect = drawRect;
             }

             if (stage.requestAnimation) {
             //stage.updateCache();
             if (stage.requestFullUpdate) {
             stage.drawRect = null;
             }
             stage.update(event);
             stage.requestAnimation = false;
             stage.requestFullUpdate = false;
             //stage.drawRect = stage.tweenRect;
             } else {
             stage.drawRect = defaultRectangle;
             stage.update(event);
             }
             */

            this.updateStats();
        });

        return stage;
    };

    cacheTarget(target) {
        let rect = target.getBounds();
        target.cache(rect.x, rect.y, rect.width, rect.height);
    }

    /**
     * Init canvas
     * @param config
     * @param alias
     * @returns {Element}
     */
    initCanvas(config, alias) {
        let canvas = document.createElement('canvas');
        canvas.id = alias;
        if (config.layerSizeType === "overLayer") {
            canvas.width = this.getStage().canvas.width / this.getGameContainer().scaleX;
            canvas.height = this.getStage().canvas.height / this.getGameContainer().scaleY;
        } else if (config.layerSizeType === "custom") {
            canvas.width = config.width;
            canvas.height = config.height;
        } else {
            canvas.width = this.getGameContainer().width;
            canvas.height = this.getGameContainer().height;
        }

        Object.assign(canvas.style, {
            position: "absolute",
            margin: "0 auto",
            left: 0,
            right: 0,
            top: 0
        });
        document.body.appendChild(canvas);

        this.cssResizer(canvas);

        return canvas;
    }

    initLayout(config = {}, alias = null) {
        let layout = new Container();


        layout.name = alias;
        layout.zIndex = config.zIndex !== undefined ? config.zIndex : 1;

        if (config.layerType === "canvas") {
            let canvas, stage;
            config.canvasID = config.canvasID || alias;
            if (config.canvasID) {
                canvas = document.getElementById(config.canvasID);
            }
            if (!canvas) {
                canvas = this.initCanvas(config, alias);

                stage = this.initStage(canvas);

                stage.nextStage = this.lastStage;
                this.lastStage = stage;
                this.stages.push(stage);

            } else {
                for (let s in this.stages) {
                    if (this.stages[s].canvas.id === canvas.id) {
                        stage = this.stages[s];
                        break;
                    }
                }
            }

            //stage.cache(0,0,stage.canvas.width, stage.canvas.height);

            if (config.layerSizeType === "overLayer") {
                layout.width = this.getStage().canvas.width / this.getGameContainer().scaleX;
                layout.height = this.getStage().canvas.height / this.getGameContainer().scaleY;
                layout.scaleX = this.getGameContainer().scaleX;
                layout.scaleY = this.getGameContainer().scaleY;
                layout.layerType = "overLayer";
            }

            stage.addChild(layout);

        } else {
            if (config.layerSizeType === "overLayer") {

                layout.width = this.getStage().canvas.width / this.getGameContainer().scaleX;//$_view_canvas.config.canvas.maxWidth;
                layout.height = this.getStage().canvas.height / this.getGameContainer().scaleY;// $_view_canvas.config.canvas.maxHeight;
                layout.scaleX = this.getGameContainer().scaleX;
                layout.scaleY = this.getGameContainer().scaleY;
                layout.layerType = "overLayer";

                this.getStage().addChild(layout);

            } else if (config.layerSizeType === "fullsize") {

                layout.width = this.config.canvas.maxWidth;
                layout.height = this.config.canvas.maxHeight;
                layout.layerType = "fullsize";
                layout.x = (this.config.gameContainer.width - this.config.canvas.maxWidth) / 2;

                this.getGameContainer().addChild(layout);

            } else {
                this.getGameContainer().addChild(layout);
            }
        }

        this.getGameContainer().sortChildren((child1, child2) => {
            if (child1.zIndex === undefined || child2.zIndex === undefined) return 0;
            if (child1.zIndex === child2.zIndex) return 0;
            return (child1.zIndex > child2.zIndex ? 1 : -1)
        });

        this.getStage().sortChildren((child1, child2) => {
            if (child1.zIndex === undefined || child2.zIndex === undefined) return 0;
            if (child1.zIndex === child2.zIndex) return 0;
            return (child1.zIndex > child2.zIndex ? 1 : -1)
        });

        return layout;
    }

    /**
     * Get stage
     * @returns {ViewMainCanvas._stage|*}
     */
    getStage() {
        return this._stage;
    };

    /**
     * Get game container
     * @returns {ViewMainCanvas._gameContainer|*}
     */
    getGameContainer() {
        return this._gameContainer;
    };

    /**
     * Background resizer
     */
    backgroundResizer() {
        this.canvas = document.getElementById(this.canvasID);

        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;

        var windowKoef = windowWidth / windowHeight;

        if (["mobile", "tablet"].indexOf(__RunPartialApplication.type) != -1) {
            if (windowKoef < 1) {
                this._gameContainer.height = 720;
            } else {
                this._gameContainer.height = 540;//this.config.gameContainer.height;
            }
        }

        var containerHeight = this._gameContainer.height * this._gameContainer.scaleY;
        var containerWidth = this._gameContainer.width * this._gameContainer.scaleX;
        var containerKoef = containerWidth / containerHeight;

        //var backgroundLayerHeight = this._backgroundLayer.height;
        //var backgroundLayerWidth = this._backgroundLayer.width;

        var newWidth = containerWidth,
            newHeight = containerHeight;

        if (windowKoef > containerKoef) {
            newWidth = Math.min(containerHeight * windowKoef, this.config.canvas.maxWidth * this._gameContainer.scaleX);
        } else {
            newHeight = Math.min(containerWidth / windowKoef, this.config.canvas.maxHeight * this._gameContainer.scaleY);
        }

        /* if (this._background !== undefined) {
         this._background.x = -(this._background.width - backgroundLayerWidth) / 2;
         this._background.y = -(this._background.height - backgroundLayerHeight) / 2;
         }

         this._backgroundLayer.x = (newWidth - this._backgroundLayer.width*this._backgroundLayer.scaleX )/2;
         this._backgroundLayer.y = (newHeight - this._backgroundLayer.height*this._backgroundLayer.scaleY )/2;
         */
        this._gameContainer.x = -(containerWidth - newWidth) / 2;
        this._gameContainer.y = -(containerHeight - newHeight) / 2;

        if (this.canvas.width !== newWidth) {
            this.canvas.width = newWidth;
        }
        if (this.canvas.height !== newHeight) {
            this.canvas.height = newHeight;
        }
        if (["mobile", "tablet"].indexOf(__RunPartialApplication.type) != -1) {
            if (windowKoef < 1) {
                if (this.verticalMode === false) {
                    $_event.setEvent("verticalMode");
                }
                this.verticalMode = true;
                //Концептуально необходимое решение
                this._gameContainer.y = POSITION_CRUNCH.portrait;
                //this._gameContainer.y = 152;

                //let mask = new createjs.Shape();
                //mask.graphics.drawRect (0, 0, this.canvas.width, this._gameContainer.height);
                //this._gameContainer.mask = mask;
                this._gameContainer.mask = null;

                this.canvas.height = newWidth / windowKoef;



            } else {
                if (this.verticalMode === true || this.verticalMode === undefined) {
                    $_event.setEvent("horizontalMode");
                }
                this.verticalMode = false;
                //Концептуально необходимое решение
                this._gameContainer.y = POSITION_CRUNCH.landscape;

                let mask = new createjs.Shape();
                mask.graphics.drawRect (0, 0, this.canvas.width, this._gameContainer.height);
                this._gameContainer.mask = mask;
            }
        }
        let numOfChildren = this.getStage().getNumChildren();
        for (let i = 0; i < numOfChildren; i++) {
            let layout = this.getStage().getChildAt(i);
            if (layout.layerType === "overLayer") {
                layout.width = this.canvas.width / this._gameContainer.scaleX;
                layout.height = this.canvas.height / this._gameContainer.scaleX;
                layout.setBounds(0, 0, layout.width, layout.height);
            }
        }


    };

    /**
     * Css resizer
     */
    cssResizer(canvas) {

        //var canvas = document.getElementById(this.canvasID);
        var canvasHeight = canvas.height;
        var canvasWidth = canvas.width;
        var canvasKoef = canvasWidth / canvasHeight;

        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var windowKoef = windowWidth / windowHeight;

        var newWidth = windowWidth,
            newHeight = windowHeight;

        if (windowKoef > canvasKoef) {
            newWidth = windowHeight * canvasKoef;
        } else {
            newHeight = windowWidth / canvasKoef;
        }

        canvas.style.height = newHeight + "px"; // was hide
        canvas.style.width = newWidth + "px"; // was hide
    };


    /**
     * Resize
     */
    resize() {
        //return;
        this.backgroundResizer();

        for (let stage in this.stages) {
            this.cssResizer(this.stages[stage].canvas);
            this.stages[stage].requestUpdate();
        }
    }

    /**
     * Click actions
     */

    /**
     * Enable actions
     */
    enableClickActions() {
        try {
            this.getStage().mouseEnabled = true;
            createjs.Touch.enable(this.getStage());
        } catch (e) {
            //$_log.error("EnableClickAction", e);
        }
    }

    /**
     * Disable actions
     */
    disableClickActions() {
        try {
            this.getStage().mouseEnabled = false;
            createjs.Touch.disable(this.getStage());
        } catch (e) {
            //$_log.error("DisableClickAction", e);
        }
    }

    /**
     * Initialization of Stats plugin
     */
    initStats() {

        if (typeof $_stats !== "undefined") {
            this._statsInstance = $_stats;

            $_stats.setMode(0);
            document.body.appendChild($_stats.domElement);

            $_stats.update();
        }

    }

    /**
     * Update Stats
     */
    updateStats() {

        if (this._statsInstance !== undefined) {
            $_stats.update();
        }
    }


    debugTargetUpdate(alias, targetName, param, value) {

        let handlers = $_component_instances.getComponentInstances(alias, ViewCanvasHandler);

        if (!handlers || handlers.length === 0) {
            $_log.log("handler not found");
            return;
        }

        for (let h in handlers) {
            let target = handlers[h].querySelector(targetName);
            if (target) {
                target[param] = value;
            } else {
                $_log.debug(`target not found ${handlers[h]}`);
            }
        }


    }


    generateBlurBackground(){

        let blurFilter = new createjs.BlurFilter(8, 8, 3);

        this.getGameContainer().filters = [blurFilter];
        this.getGameContainer().cache (-this.getGameContainer().x, -this.getGameContainer().y, this.getGameContainer().width+this.getGameContainer().x*2, this.getGameContainer().height+this.getGameContainer().y*2);

        let blur = new Bitmap(this.getGameContainer().cacheCanvas, this.alias);
        blur.name = "blur";

        let rect = blur.getBounds();
        blur.x = -(rect.width - this.config.canvas.maxWidth)/2;
        blur.y = -(rect.height - this.config.canvas.maxHeight)/2;

        this.getGameContainer().filters = [];
        this.getGameContainer().uncache();

        return blur;
    }

    getStageScreenshot () {
        this.getGameContainer().cache (-this.getGameContainer().x, -this.getGameContainer().y, this.getGameContainer().width+this.getGameContainer().x*2, this.getGameContainer().height+this.getGameContainer().y*2);

        let screenshot = new Bitmap(this.getGameContainer().cacheCanvas, this.alias);
        screenshot.name = "screenshot";

        let rect = screenshot.getBounds();
        screenshot.x = -(rect.width - this.config.canvas.maxWidth)/2;
        screenshot.y = -(rect.height - this.config.canvas.maxHeight)/2;

        this.getGameContainer().uncache();

        return screenshot;
    }

}