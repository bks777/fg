import BonusItem from "./bonusItem";

export default class Vase extends BonusItem {
    constructor (config, alias) {
        super(config, alias);

        this._mummyPosition = {
            bottom: 7,
            left: 20
        };
    }

    initBackgroundLayer () {
        let layer = new Container();

        return layer;
    }

    initFrontLayer () {
        let layer = new Container();

        this._vase = new Bitmap ("vase", this.alias);
        this._vase_open = new Bitmap ("vase_open", this.alias);

        layer.addChild(this._vase);
        layer.addChild(this._vase_open);

        this.setChildBottom(this._vase, 0);
        this.setChildAlign("center", this._vase);
        this.setChildBottom(this._vase_open, 0);
        this._vase_open.x = -30;

        //this._vase_open.x

        return layer;
    }

    openView () {
        this._vase.visible = false;
        this._vase_open.visible = true;
    }

    closeView () {
        this._vase.visible = true;
        this._vase_open.visible = false;
    }
}