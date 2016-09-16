import Container from "./Container.es6";
import ScrollerZynga from "./ScrollerZynga.es6";

let heightScale = 1.03;

export default class Scroller extends Container {
    constructor (config, alias) {
        super(config);

        this._scrollContainer = new Container();
        this._scrollContainer.name = "scrollContainer";

        this.enableClickableBackground();
        this.enableOverflowHidden();

        super.addChild(this._scrollContainer);
        this.setChildWidth(this._scrollContainer, "100%");

        this.disabled = false;

        this._scroller = new ScrollerZynga(this._render.bind(this), {
            zooming: false,
            scrollingX: (config.scrollingX === undefined ? true : config.scrollingX),
            scrollingY: (config.scrollingY === undefined ? true : config.scrollingY)
        });

        this._scrollingX = config.scrollingX;
        this._scrollingY = config.scrollingY;

        this._scroller.setPosition(this.x, this.y);
        this._scroller.setDimensions(this.width, this.height, this._scrollContainer.width, this._scrollContainer.height*heightScale);

        this.addEventListener("mousedown", (e) =>{

            if (this.disabled) {
                return;
            }

            let touches = [{
                pageX: e.stageX,
                pageY: e.stageY
            }];

            this._scroller.doTouchStart(touches, e.timeStamp);
            e.preventDefault();
        }, false);

        this.addEventListener("pressmove", (e) => {
            if (this.disabled) {
                return;
            }
            let touches = [{
                pageX: e.stageX,
                pageY: e.stageY
            }];
            this._scroller.doTouchMove(touches, e.timeStamp, 1);
        }, false);

        this.addEventListener("pressup", (e) => {
            if (this.disabled) {
                return;
            }
            this._scroller.doTouchEnd(e.timeStamp);
        }, false);


        if (config.scrollbar) {
            if (config.scrollbar.backgroundImage) {

                let offsetY = config.scrollbar.offsetY || 0;
                let offsetX = config.scrollbar.offsetX || 0;
                //offsetY = 0;

                this._scrollBarOffsetX = offsetX;

                this._scrollbarBackground = new Bitmap (config.scrollbar.backgroundImage, alias);
                this._scrollbarBackground.name = "scrollBarBackground";
                super.addChild(this._scrollbarBackground);
                this.setChildRight(this._scrollbarBackground, offsetX);

                this._scrollbarBackground.y = offsetY;
                //this.setChildHeight(this._scrollbarBackground, "100%");
                this._scrollbarBackground.height = this.height - this._scrollbarBackground.y;

                this._scrollbarBackground.width = config.scrollbar.backgroundWidth || 20;

                this._scrollbar = new Bitmap (config.scrollbar.barImage, alias);
                this._scrollbar.name = "scrollBar";
                super.addChild(this._scrollbar);

                this.setChildHeight(this._scrollbar, (this._scrollbar.height/this._scrollbarBackground.height * 100) + "%");
                this._scrollbarBackground.width = config.scrollbar.barWidth || 14;

                this.setChildRight (this._scrollbar, offsetX+(this._scrollbarBackground.width - this._scrollbar.width)/2);

            }
        }
    }

    enableScrolling () {
        this.disabled = false;
        this._scroller.scrollingX = this._scrollingX;
        this._scroller.scrollingY = this._scrollingY;
        this.enableClickableBackground();

        if (this._scrollbarBackground) {
            this._scrollbarBackground.visible = true;
            this._scrollbar.visible = true;
        }

        this._scroller.setDimensions(this.width, this.height, this._scrollContainer.width, this._scrollContainer.height*heightScale);
    }

    updateDimensions () {
        if (this._scroller){
            this._scroller.setDimensions(this.width, this.height, this._scrollContainer.width, this._scrollContainer.height*heightScale);
        }

        if (this._scrollbarBackground) {

            let height = this.height/(this._scrollContainer.height*heightScale);

            if (height > 1) {
                this.disableScrolling();
            } else {
                this.enableScrolling();
            }

            //this.setChildHeight(this._scrollbarBackground, "100%");
            this._scrollbarBackground.height = this.height - this._scrollbarBackground.y;
            this._scrollbar.height = this._scrollbarBackground.height * height;

            //this.setChildHeight(this._scrollbar, height+"%");

            this.setChildRight(this._scrollbarBackground, this._scrollBarOffsetX);
            this.setChildRight (this._scrollbar, this._scrollBarOffsetX+(this._scrollbarBackground.width - this._scrollbar.width)/2);
        }

    }

    disableScrolling () {
        this._scroller.scrollingX = false;
        this._scroller.scrollingY = false;
        this.disabled = true;
        this.disableClickableBackground();

        if (this._scrollbarBackground) {
            this._scrollbarBackground.visible = false;
            this._scrollbar.visible = false;
        }
    }

    _render (left, top, zoom) {
        this._scrollContainer.x = -left;
        this._scrollContainer.y = -top;

        if (this._scrollbarBackground) {
            let topPercent = top / (this._scrollContainer.height*heightScale);

            let topMax = 1 - this._scrollbar.height/this._scrollbarBackground.height;

            topPercent = Math.min (topMax, Math.max (0, topPercent));

            this._scrollbar.y =  this._scrollbarBackground.y + this._scrollbarBackground.height * topPercent;

            //console.debug (top, this._scrollContainer.height, this.height, this._scrollContainer.height-top);
        }
    }

    addChild (child) {

        this._scrollContainer.addChild(child);


        setTimeout (() => {
            this._scroller.setDimensions(this.width, this.height, this._scrollContainer.width, this._scrollContainer.height*heightScale);

            if (this._scrollbarBackground) {

                this.updateDimensions();
            }

        },300);
    }

    getChildByName (name) {
        return this._scrollContainer.getChildByName(name);
    }

    sortChildren(fn) {
        return this._scrollContainer.sortChildren (fn);
    }

    _setHeight (height) {
        super._setHeight(height);
        this.updateDimensions();
    }

    _setWidth (width) {
        super._setWidth(width);
        this.updateDimensions()
    }

    setPosition (left, top) {
        this._scroller.setPosition (left, top);
    }

    scrollTo (left, top, animate = false) {
        this._scroller.scrollTo (left, top, animate);
    }

}