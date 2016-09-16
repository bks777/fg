import BonusItem from "./bonusItem";

export default class Urn extends BonusItem {
    constructor (config, alias) {
        super(config, alias);

        this._mummyPosition = {
            bottom: 25,
            left: 25
        };
    }

    initBackgroundLayer () {
        let layer = new Container();

        return layer;
    }

    initFrontLayer () {
        let layer = new Container();

        this._urn = new Bitmap ("urn", this.alias);
        this._urn_open = new Bitmap ("urn_open", this.alias);

        layer.addChild(this._urn);
        layer.addChild(this._urn_open);

        this.setChildBottom(this._urn, 0);
        this.setChildBottom(this._urn_open, 0);
        this.setChildLeft(this._urn_open, -31);

        return layer;
    }

    openView () {
        this._urn.visible = false;
        this._urn_open.visible = true;
    }

    closeView () {
        this._urn.visible = true;
        this._urn_open.visible = false;
    }
}