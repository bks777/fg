import ComponentInterface from "../../interfaces/component/componentInterface.es6";
import * as Core from "../../interfaces/modelsUI/Core.es6.js";

/**
 * View Canvas Handler for template
 * @constructor
 */
export default class ViewCanvasHandler extends ComponentInterface
{
    constructor (data = {}) {
        super(data);

        this.alias = data.alias;
    }

    initLayout (config, alias = this.alias)
    {
        return this.layout = $_view_canvas.initLayout (config, alias);
    };

    makeBlur(expetions) {

    }

    requestUpdateTarget (target) {
        return this.getStage().requestUpdateTarget(target, this.alias);
    }

    requestUpdate (rect) {

        if (!rect) {
            this.requestUpdateTarget(this.getLayout());
        } else {
            this.getStage().requestUpdate(rect, this.alias);
        }
    }

    startTween (rect) {
        if (!rect) {
            return this.startTweenTarget (this.getLayout());
        } else {
            return this.getStage().startTween(rect, this.alias);
        }
    }

    startTweenTarget (target) {
        return this.getStage().startTweenTarget(target, this.alias);
    }

    /**
     * End one tween
     * @param id
     */
    endTween (id) {
        this.getStage().endTween(id, this.alias);
    }

    /**
     * End list of tweens
     * @param listID
     */
    endTweens(listID = []){
        for(let key of listID){
            try{
                this.endTween(key);
            } catch(e){
                $_log.error('Tweens end ', e);
            }
        }
    }

    getChildByNameContainer (name, container) {
        return container.getChildByName(name);
    }

    getChildByName (name) {
        return this.getChildByNameContainer(name, this.getLayout());
    }

    querySelectorContainer (query, container) {
        let names = query.split(".");

        if (names.length > 1) {
            let child = container.getChildByName (names[0]);

            if (child) {
                return this.querySelectorContainer(query.substr(names[0].length+1), child);
            } else {

                for (let i = 0; i < container.getNumChildren(); i++) {
                    if (instanceOf(container.getChildAt(i), Container)) {
                        let queryResult = this.querySelectorContainer(query, container.getChildAt(i));
                        if (queryResult) {
                            return queryResult;
                        }
                    }
                }

                return undefined;
            }

        } else {
            let result = container.getChildByName (names[0]);
            if (!result) {
                for (let i = 0; i < container.getNumChildren(); i++) {
                    if (instanceOf(container.getChildAt(i), Container)) {
                        let queryResult = this.querySelectorContainer(query, container.getChildAt(i));
                        if (queryResult) {
                            return queryResult;
                        }
                    }
                }
                return undefined;
            }
            return container.getChildByName (names[0]);

        }
    }

    querySelector (query) {
        return this.querySelectorContainer(query, this.getLayout());
    }

    applyConfig (config, container = this.getLayout()) {
        this.initChildrenContainer(container, config, false);
    }

    initChildrenContainer (container, config, createNew = true) {

        for (let child in config) {

            let newChild;
            if (createNew) {
                if (config[child].type === "ReelSymbol") {
                    let slotMachine = this.getService("SlotMachineService").getInstance();
                    if (slotMachine) {
                        newChild = slotMachine.getSymbol(config[child].symbolNumber || 1, config[child].symbolType || "def");
                    } else {
                        $_log.warning (`It's impossible  to use slot machine now (initChildren, alias=${this.alias}, child=${child})`);

                    }
                } else {
                    newChild = new Core[ config[child].type ](config[child], this.alias);
                }
                newChild.name = child;

            } else {
                newChild = container.getChildByName (child);
                if (!newChild) {
                    $_log.warning (`${child} not found in ${container.name}`);
                    return;
                }
            }

            for (let param in config[child]) {
                let value;
                switch (param) {
                    case "width":
                        if (!container.setChildWidth(newChild, config[child].width)) {
                            $_log.error(`Cannot set width=${config[child].width} for ${child}`);
                        }
                        break;
                    case "height":
                        if (!container.setChildHeight(newChild, config[child].height)) {
                            $_log.error(`Cannot set height=${config[child].height} for ${child}`);
                        }
                        break;
                    case "left":
                        if (!container.setChildLeft(newChild, config[child].left)) {
                            $_log.error(`Cannot set left=${config[child].left} for ${child}`);
                        }
                        break;
                    case "right":
                        if (!container.setChildRight(newChild, config[child].right)) {
                            $_log.error(`Cannot set right=${config[child].right} for ${child}`);
                        }
                        break;
                    case "top":
                        if (!container.setChildTop(newChild, config[child].top)) {
                            $_log.error(`Cannot set top=${config[child].top} for ${child}`);
                        }
                        break;
                    case "bottom":
                        if (!container.setChildBottom(newChild, config[child].bottom)) {
                            $_log.error(`Cannot set bottom=${config[child].bottom} for ${child}`);
                        }
                        break;
                    case "shadow":
                        let {color, offsetX, offsetY, blur} = config[child].shadow;
                        newChild.shadow = new createjs.Shadow(color, offsetX, offsetY, blur);
                        break;
                    case "blur":
                        let {blurX, blurY, quality} = config[child].blur;
                        var blurFilter = new createjs.BlurFilter(blurX, blurY, quality);
                        newChild.filters = [blurFilter];
                        let rect = newChild.getBounds();
                        newChild.cache(rect.x, rect.y, rect.width, rect.height);
                        break;
                    case "regX":
                        value = config[child].regX;
                        if (typeof value === "string" && value.indexOf("%") > -1) {
                            let valuePercent = parseFloat(value)/100;
                            if (newChild.width === undefined && newChild.getBounds() === null ) {
                                $_log.error(`Cannot set regX=${config[child].regX} for ${child}`);
                            }
                            value = (newChild.width !== undefined ? newChild.width : (newChild.getBounds() !== null ? newChild.getBounds().width : 0 ) ) * valuePercent;
                        }
                        newChild.regX = parseInt(value);
                        break;
                    case "regY":
                        value = config[child].regY;
                        if (typeof value === "string" && value.indexOf("%") > -1) {
                            let valuePercent = parseFloat(value)/100;
                            if (newChild.height === undefined  && newChild.getBounds() === null) {
                                $_log.error(`Cannot set regX=${config[child].regY} for ${child}`);
                            }
                            value = (newChild.height !== undefined ? newChild.height : (newChild.getBounds() !== null ? newChild.getBounds().height : 0 )) * valuePercent;
                        }
                        newChild.regY = parseInt(value);
                        break;
                    case "debugDrag":
                        if (config[child].debugDrag === true && $_log.dev === true) {
                            this.initDebugDrag(newChild);
                        }
                        break;

                    case "text":
                        if (typeof newChild.setText === "function") {
                            newChild.setText (config[child][param]);
                        } else {
                            $_log.warning("Cannot set Text for not text instance", child, config[child]);
                            newChild.text = config[child][param];
                        }
                        break;

                    //RichText
                    case "configs":
                        newChild.setConfigs (config[child][param]);
                        break;

                    //DIsplayObject
                    case "visible":
                    case "cursor":
                    case "alpha":
                    case "scaleX":
                    case "scaleY":
                    case "rotation":
                    case "mouseEnabled":
                    case "skewX":
                    case "skewY":
                    case "tickEnabled":

                        //Text
                    case "font":
                    case "color":
                    case "lineHeight":
                    case "lineWidth":
                    case "maxWidth":
                    case "outline":
                    case "textAlign":
                    case "textBaseline":
                    case "fontTransform":


                        //COntainer
                    case "mouseChildren":
                    case "tickChildren":

                        //core.applyConfig(inst, config);

                        newChild[param]= config[child][param];
                        //newChild[param].applyConfig();
                        break;

                    case "align":
                    case "verticalAlign":
                    case "children":
                    case "spriteSheet":
                    case "type":
                        break;
                    //default:
                    //    newChild[param] = config[child][param];
                }
            }

            newChild.zIndex = config[child].zIndex !== undefined ? config[child].zIndex : 1;

            if (createNew) {
                container.addChild(newChild);
            }

            if (newChild instanceof Container  && config[child].children !== undefined) {
                this.initChildrenContainer (newChild, config[child].children, createNew);
            }

            if (config[child].align !== undefined) {
                if (!container.setChildAlign (config[child].align, newChild)) {
                    $_log.error(`Cannot set align=${config[child].align} for ${child}`);
                }
            }

            if (config[child].verticalAlign !== undefined) {
                if (!container.setChildVerticalAlign (config[child].verticalAlign, newChild)) {
                    $_log.error(`Cannot set verticalAlign=${config[child].verticalAlign} for ${child}`);
                }
            }

           /*newChild.addEventListener ("mousedown", () => {
                console.debug ("event mousedown on " + newChild.name, (newChild.parent? newChild.parent.name : "" ));
            })*/

        }

        container.sortChildren((child1, child2) => {
            return (child1.zIndex === undefined || child2.zIndex === undefined || child1.zIndex === child2.zIndex) ? 0 : (child1.zIndex > child2.zIndex ? 1 : -1) ;
        } );

    };

    initDebugDrag(target) {

        if ($_log.dev !== true) {
            //return;
        }

        let pt;

        target.on("mousedown", (evt) => {
            pt = evt.currentTarget.globalToLocal(evt.stageX, evt.stageY);
        });

        target.on("pressmove", (evt) => {
            let ptParent = evt.currentTarget.parent.globalToLocal(evt.stageX, evt.stageY);

            evt.currentTarget.x = ptParent.x - pt.x;
            evt.currentTarget.y = ptParent.y - pt.y;
            console.debug (evt.currentTarget.name, parseInt(evt.currentTarget.x), parseInt(evt.currentTarget.y), evt.currentTarget);

            target.stage.requestUpdate();
        });
    }
    applyStyle (config) {
        for (let child in config) {
            let childInstance = this.querySelector(child);

            if (!childInstance) {
                $_log.error (`Cannot find element with name = ${child}`);
                return;
            }

            for (let style in config[child]) {
                childInstance[style] = config[child][style];
            }
        }
        this.getStage().requestUpdate();
    }

    initChildren (config) {

        this.initChildrenContainer (this.getLayout(), config);
        this.getStage().requestUpdate();
    };

    cacheLayout () {
        $_view_canvas.cacheTarget(this.getLayout());
    }

    uncacheLayout() {
        this.getLayout().uncache();
    }

    updateCache() {
        this.getLayout().updateCache();
    }

    enableUpdatingCacheOnEveryTick () {
        this.getLayout().addEventListener("tick", () => {
            this.getLayout().updateCache();
            //console.debug(this.getLayout().cacheID, this.alias);
        });
    }

    disableUpdatingCacheOnEveryTick () {
        this.getLayout().removeAllEventListeners("tick");
    }

    isCached () {
        return (this.getLayout().cacheCanvas ? true : false);
    }

    getCanvas () {
        return this.getStage().canvas;
    }

    getStage () {
        return this.getLayout().stage;
        //return $_view_canvas.getStage();
    }

    /**
     * Get layout
     * @returns {null}
     */
    getLayout (alias)
    {
        if (alias !== undefined) {
            return $_view_canvas.getComponentLayout(alias);
        }

        if(this.layout === undefined){
            this.layout = $_view_canvas.getComponentLayout(alias);
        }

        if (this.layout === undefined) {
            this.initLayout();
        }

        return this.layout;
    };

    showLayout () {
        this.getLayout().visible = true;
    }

    hideLayout () {
        this.getLayout().visible = false;
    }

    getGameContainer () {
        return $_view_canvas.getGameContainer();
    }

    enableModalMode (layer = this.getLayout()) {
        $_view_canvas.enableModalModeForLayer(layer);
    }
    disableModalMode (layer = this.getLayout()) {
        $_view_canvas.disableModalModeForLayer(layer);
    }

    disableClickActions () {
        $_view_canvas.disableClickActions();
    }

    enableClickActions () {
        $_view_canvas.enableClickActions();
    }

    /**
     * Get image from buffer by new Image()
     * @param aliasImage
     * @returns {*}
     */
    getImage (aliasImage)
    {
        return $_required.getImageRawData(aliasImage, this.alias);
    };


    isVerticalMode () {
        return $_view_canvas.verticalMode;
    }

    closest (target, parentName) {
        let t = target.parent;

        while (t) {
            if (t.name === parentName) {
                return true;
            }
            t = t.parent;
        }

        return false;
    }

    generateBlurBackground () {
        return $_view_canvas.generateBlurBackground();
    }

    getStageScreenshot () {
        return $_view_canvas.getStageScreenshot();
    }
}