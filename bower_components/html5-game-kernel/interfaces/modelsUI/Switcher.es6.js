import Slider from "./Slider.es6";

export default class Switcher extends Slider {
    constructor(config = {}, alias){
        super(config, alias);
        this.removeAllEventListeners("mousedown");
        this.removeAllEventListeners("pressmove");
        this.removeAllEventListeners("pressup");
        this.on("mousedown", this._handleMouseDownEvent, this);
        this.on("pressmove", this._handleMouseMoveEvent, this);
        this.on("pressup", this._handleMouseUpEvent, this);
        this.movedVal = false;
        this.moveStep = 5;
        this.tapDelta = 20;
    }

    /**
     * Handle tap down
     * @param evt
     * @private
     */
    _handleMouseDownEvent(evt){
        this.locX = evt.localX;
        this.locY = evt.localY;
        this._tempMovedSide = evt.localX <  this.trackSprite.width / 2 ? 0 : 1;
    }

    /**
     * Handle drag
     * @param evt
     * @private
     */
    _handleMouseMoveEvent(evt) {
        let delta = getRound(Math.abs(evt.localX - this.locX));

        if(delta % this.moveStep !== this.moveStep % this.moveStep) {
            return;
        }
        this.movedSide = evt.localX <  this.trackSprite.width / 2 ? 0 : 1;
        if (this._tempMovedSide !== this.movedSide){
            this.value = this.movedSide;
            this.moveNative();
            this.dispatchEvent("change");
            this._tempMovedSide = this.movedSide;
        }
    };

    /**
     * Handle click(tap)
     * @private
     */
    _handleMouseClickEvent(){
        this._changeVal();
    }

    /**
     * Handle untap
     * @param evt
     * @private
     */
    _handleMouseUpEvent(evt){
        if (getRound(Math.abs(evt.localX - this.locX)) <= this.tapDelta){
            this._handleMouseClickEvent();
        }
        this.movedSide = undefined;
        this._tempMovedSide = undefined;
    }

    _changeVal(){
        this.value = this.value === 0 ? 1 : 0;
        this.moveNative();
        this.dispatchEvent("change");
    }
}