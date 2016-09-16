import Container from "./Container.es6";
import Sprite from "./Sprite.es6";

/*
 * Slider
 * https://github.com/CreateJS/EaselJS/blob/master/_assets/js/Slider.js
 *
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

export default class Slider extends Container {

    constructor(config = {}, alias) {
        super();

        let {width, height, len, value, trackSprite, trackActiveSprite, thumbSprite} = config;

        this.trackSprite = new Sprite({spriteSheet: trackSprite}, alias);

        this.trackSpriteActive = null;

        if (trackActiveSprite) {
            this.trackSpriteActive = new Sprite({spriteSheet: trackActiveSprite}, alias);
            this.trackSprite.name = "trackSpriteActive";
        }

        if (thumbSprite.spriteSheet !== undefined){
            this.thumbSprite = new Sprite(thumbSprite, alias);
        } else {
            this.thumbSprite = new Sprite({spriteSheet: thumbSprite}, alias);
        }

        this.trackSprite.name = "trackSprite";
        this.thumbSprite.name = "thumbSprite";

        this.addChild(this.trackSprite);

        if (this.trackSpriteActive) {
            this.addChild(this.trackSpriteActive);
        }

        this.addChild(this.thumbSprite);

        // public properties:
        this._value = 0;
        this.min = 0;
        this.max = len;
        this._step = 1;
        this._len = len;

        this._calcDelta();
        this._range = array_range(this.min, this.max, this._step);
        this._rangeLength = this.max;

        this.width = width || 100;
        this.height = height || 20;

        this.values = {};

        this.cursor = "pointer";
        //this.mouseChildren = false;
        this.on("mousedown", this._handleInput, this);
        this.on("pressup", this._handleChoose, this);
        this.on("pressmove", this._handleInput, this);

        this.on("change", this.drawNative, this);
        this.goToAndStop("normal");

        this.dispatchEvent("changeThumb");
        this.locX = 0;
    }

    _calcDelta() {
        this._delta = (this.trackSprite.width - this.thumbSprite.width) / (this._len - 1);
    }

    /**
     * Is visible
     * @returns {boolean}
     */
    isVisible() {
        return true;
    };

    set width(width) {
        this.trackSprite.width = width;
        this._calcDelta();
    }

    get width() {
        return this.trackSprite.width;
    }

    /**
     * Set track width active
     * @param width
     */
    set trackActiveWidth(width) {

        if (this.trackSpriteActive) {
            this.trackSpriteActive.width = width;
        }
    }

    set value(value) {
        this._value = value;
        this.dispatchEvent("change");
    }

    get value() {
        return this._value;
    }

    set len(len) {
        this._len = this.max = len;

        this._calcDelta();
        this._range = array_range(this.min, this.max, this._step);
        this._rangeLength = this.max;

        this.moveNative();
    }

    get len() {
        return this._len;
    }

    set disabled(disabled) {

    }

    /**
     * Get thumb center
     * @returns {*}
     */
    getThumbCenter() {
        let pt = this.localToGlobal(0, 0);
        return pt.x + this.thumbSprite.x + (this.thumbSprite.width / 2);
    }

    /**
     * Change type of Slider animation set
     * @param name
     */
    goToAndStop(name) {
        this.trackSprite.gotoAndStop(name);
        this.thumbSprite.gotoAndStop(name);
    }

    /**
     * Draw
     * @param ctx
     * @param ignoreCache
     */
    drawNative(ctx, ignoreCache) {

        if (this._checkChange() || this.len == 1) {
            this.moveNative();
        }
    };

    /**
     * Update draw
     */
    updateDraw() {
        let pt = this.localToGlobal(0, 0);
        let rect = new createjs.Rectangle(pt.x - this.trackSprite.width / 2, pt.y, this.width + this.trackSprite.width, this.height);
        if (this.stage) {
            this.stage.requestUpdate(rect, this.alias);
        }
    }

    /**
     * Move native
     */
    moveNative() {
        if (this._len <= 1) {
            this.thumbSprite.x = ((this.width / 2) - (this.thumbSprite.width / 2));

            this.trackActiveWidth = this.thumbSprite.x;
            this.disabled = true;
        } else {
            this.thumbSprite.x = (this._delta * (this._value));// + (this._delta / 2) - (this.thumbSprite.width/2);
        }

        this.trackActiveWidth = this.thumbSprite.x;

        this.updateDraw();
        this.dispatchEvent("changeThumb");
    }

    /**
     * Chech change
     * @returns {boolean}
     * @private
     */
    _checkChange(name = "def") {
        var a = this;
        if (a.values[name] === undefined) a.values[name] = {};
        var b = a.values[name];


        if (a._value !== b._value || a.min !== b.min || a.max !== b.max || a.width !== b.width || a.height !== b.height) {
            b.min = a.min;
            b.max = a.max;
            b._value = a._value;
            b.width = a.width;
            b.height = a.height;
            return true;
        }
        return false;
    };

    /**
     * Handle input
     * @param evt
     * @private
     */
    _handleInput(evt) {
        let val = getRound((evt.localX - (this.thumbSprite.width / 2) -
            (this.thumbSprite.width / 6)) / (this.trackSprite.width -
            (this.thumbSprite.width / 2)) * (this.max - this.min) + this.min);

        var search = this._range.indexOf(val);
        if (search == -1 && val > this._range[this._rangeLength - 1]) {
            search = this._rangeLength - 1;
        } else if (search == -1 && val < this._range[0]) {
            search = 0;
        }

        if (this._value == this._range[search]) {
            return;
        }

        this.value = this._range[search];
        this.moveNative();
    };

    /**
     * Handle choose value
     * @private
     */
    _handleChoose() {
        this.dispatchEvent("change");
    }
}