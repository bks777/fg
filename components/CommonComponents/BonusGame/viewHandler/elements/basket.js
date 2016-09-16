import BonusItem from "./bonusItem";

export default class Basket extends BonusItem {
    constructor (config, alias) {
        super(config, alias);

        this._mummyPosition = {
            bottom: 15,
            left: 22
        };
    }

    initBackgroundLayer () {
        let layer = new Container();

        this._basketOpenCap = new Bitmap ("basket_open", this.alias);

        layer.addChild(this._basketOpenCap);

        this.setChildAlign("center", this._basketOpenCap);
        this.setChildBottom(this._basketOpenCap, this._basket.height);

        return layer;
    }

    initFrontLayer () {
        let layer = new Container();

        this._basket = new Bitmap ("basket", this.alias);
        this._basketCloseCap = new Bitmap ("basket_close", this.alias);

        layer.addChild(this._basket);
        layer.addChild(this._basketCloseCap);

        this.setChildAlign("center", this._basket);
        this.setChildAlign("center", this._basketCloseCap);

        this.setChildBottom(this._basket, 0);
        this.setChildBottom(this._basketCloseCap, this._basket.height);

        return layer;
    }

    openView () {
        this._basketOpenCap.visible = true;
        this._basketCloseCap.visible = false;
    }

    closeView () {
        this._basketOpenCap.visible = false;
        this._basketCloseCap.visible = true;
    }

}