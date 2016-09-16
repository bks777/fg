//import createjs from "../../libs/easeljs-0.8.2.modify.js";
import Container from "./Container.es6";

export default class Scrollable extends Container {

    constructor (config, content) {
        super(config);

        this.content = content || null;
        this.mask = undefined;
        this.enabled = true;
        this._useMask = true;
        // scrolls horizontal as default, but will change if a
        // horizontal layout is set in the content

        this.SCROLL_AUTO = "auto";
        this.SCROLL_VERTICAL = "vertical";
        this.SCROLL_HORIZONTAL = "horizontal";

        this.scrolldirection = this.SCROLL_VERTICAL;
        // # of pixel you scroll at a time (if the event delta is 1 / -1)
        this.scrolldelta = 10;

        this.width = config.width;
        this.height = config.height;

        this.updateMask();
        //this.drawMask();
    }



    /**
     * check, if the layout of the content is horizontally alligned
     */
    layoutHorizontalAlign () {
        return false;
        //return this.content.layout &&
        //    this.content.layout.alignment == createjs_ui.LayoutAlignment.HORIZONTAL_ALIGNMENT
    };

    /**
     * test if content width bigger than this width but content height is
     * smaller than this height (so we allow scrolling in only one direction)
     */
    upright () {
        return this.content.height <= this.height &&
            this.content.width > this.width
    };

    _scrollContent (x, y) {
        // todo: press shift to switch direction
        var scroll_auto = this.scrolldirection == this.SCROLL_AUTO;
        var scroll = this.SCROLL_VERTICAL;
        // if the scroll direction is set to SCROLL_AUTO we check, if the
        // layout of the content is set to horizontal or the content
        // width is bigger than the current
        if (this.scrolldirection == this.SCROLL_HORIZONTAL ||
            (scroll_auto && (this.layoutHorizontalAlign() || this.upright()) )) {
            scroll = this.SCROLL_HORIZONTAL;
        }
        if (scroll == this.SCROLL_HORIZONTAL) {
            if (this.content.width > this.width) {
                // assure we are within bounds
                x = Math.min(x, 0);
                if (this.content.width) {
                    x = Math.max(x, -(this.content.width - this.width));
                }
                this.content.x = x;
            }
        }
        if (scroll == this.SCROLL_VERTICAL) {
            if (this.content.height > this.height) {
                // assure we are within bounds
                y = Math.min(y, 0);
                if (this.content.height && this.content.y < 0) {
                    y = Math.max(y, -(this.content.height - this.height));
                }
                this.content.y = y;
            }
        }
    };

    handleWheel (event) {
        this._scrollContent(
            this.content.x + event.delta * this.scrolldelta,
            this.content.y + event.delta * this.scrolldelta
        )
    };

    handleMove (event) {
        if (!this._start) {
            this._start = [
                event.stageX - this.content.x,
                event.stageY - this.content.y
            ];
        }
        this._scrollContent(
            event.stageX - this._start[0],
            event.stageY - this._start[1]
        );
    };

    handleUp (event) {
        this._start = null;
    };

   /* draw (ctx, ignoreCache) {
        if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }

        ctx.save();
        this.content.updateContext(ctx);
        if (this.content && this.content.drawArea) {
            this.content.drawArea(ctx, ignoreCache, -this.content.x, -this.content.y, this.width, this.height);
        } else if (this.content && this.content.draw) {
            this.content.draw(ctx, ignoreCache);

        }
        ctx.restore();
        return true;
    };*/

    /**
     * do not remove children - we just have a content
     * override addChild to prevent the developer from adding more than one context
     * @param child
     */
    //removeChild (child) {
    //    throw new Error("use .content = null instead of removeChild(child)")
    //};

    //addChild (child) {
    //    throw new Error("use .content = child instead of addChild(child)")
    //};

    updateMask () {
        if (this.height && this.width && this._useMask) {
            if (this.mask === undefined) {
                this.mask = new createjs.Shape();
            }
            this.drawMask();
        } else {
            if (this.mask) {
                this.mask.graphics.clear();
            }
            this.mask = undefined;
        }
    };

    /**
     * draw mask (can be overwritten, e.g. to show something above the
     * scroll area when using a vertical layout)
     * @private
     */
    drawMask () {
        this.mask.graphics.clear()
            .beginFill("#fff")
            .drawRect(this.x, this.y, this.width, this.height)
            .endFill();
    };


    get height() {
        if (!this._height) {
            return this._content.height;
        }
        return this._height;
    }
    set height (height) {
        this._height = height;
        this.updateMask();
    }

    get width () {
        if (!this._width) {
            return this._content.width;
        }
        return this._width;
    }
    set width(width) {
        this._width = width;
        this.updateMask();
    }

    get enabled () {
        return this._enabled;
    }
    set enabled (value) {
        // update event listeners
        if (value) {//} && this.addListener) {
            this.on("pressmove", this.handleMove, this);
            this.on("pressup", this.handleUp, this);
            this.on("mousewheel", this.handleWheel, this);
        } else if (this.hasEventListener("pressmove")) {
            this.off("pressmove", this.handleMove, this);
            this.off("pressup", this.handleUp, this);
            this.off("mousewheel", this.handleWheel, this);
        }
        this._enabled = value;
    }

    get content () {
        return this._content;
    }
    set content (content) {
        if (this._content) {
            this.removeChild(this._content);
        }
        if (content) {
            this.addChild(content);
            this._content = content;
        }
    }

}



    //createjs_ui.ScrollArea = createjs.promote(ScrollArea, "Container");
