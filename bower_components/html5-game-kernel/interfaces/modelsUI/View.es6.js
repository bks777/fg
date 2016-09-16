import Container from "./Container.es6";
import Shape from "./Shape.es6";

export default class View extends Container {
    constructor (config) {
        config = config || {};
        super(config);

        this.visible = false;

        this.width = this.width || 900;
        this.height = this.height || 600;

        this._background = new Shape();
        this.addChild(this._background);

        this._backgroundColor = config.backgroundColor || "#000";
        this._backgroundOpacity = config.opacity !== undefined ? config.opacity : 1;

        this.redrawBackground ();

        if (config.children) {
            this.initChildren(config.children);
        }
    }

    set backgroundColor (color) {
        this._backgroundColor = color;
        this.redrawBackground ();

    }
    get backgroundColor () {
        return this._backgroundColor;
    }

    set backgroundOpacity (opacity) {
        this._backgroundOpacity = Math.min(Math.max(opacity,0),1);
        if (this.backgroundColor !== undefined) {
            this.redrawBackground ();
        }
    }
    get backgroundOpacity() {
        return this._backgroundOpacity;
    }

    redrawBackground() {
        this._background.graphics.beginFill(this.backgroundColor);
        this._background.alpha = this.backgroundOpacity;
        this._background.graphics.drawRect(0, 0, this.width, this.height);
        this._background.graphics.endFill();
    };

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    toggleVisibility () {
        this.visible = !this.visible;
    }
}