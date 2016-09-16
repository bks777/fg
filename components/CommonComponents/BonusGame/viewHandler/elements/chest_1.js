import BonusItem from "./bonusItem";

export default class Chest_1 extends BonusItem {
    constructor (config, alias) {
        super(config, alias);

        this._mummyPosition = {
            bottom: 40,
            left: 18
        };
    }

    initBackgroundLayer () {
        let layer = new Container();

        this._chestOpenCap = new Bitmap ("chest_1_open", this.alias);

        layer.addChild(this._chestOpenCap);

        this.setChildLeft(this._chestOpenCap, 20);
        this.setChildBottom(this._chestOpenCap, this._chest.height);

        return layer;
    }

    initFrontLayer () {
        let layer = new Container();

        this._chest = new Bitmap ("chest_1", this.alias);
        this._chestCloseCap = new Bitmap ("chest_1_close", this.alias);

        layer.addChild(this._chest);
        layer.addChild(this._chestCloseCap);


        this.setChildAlign("center", this._chest);
        this.setChildAlign("center", this._chestCloseCap);
        this.setChildBottom(this._chest, 0);
        this.setChildBottom(this._chestCloseCap, this._chest.height);

        return layer;
    }

    openView () {
        this._chestOpenCap.visible = true;
        this._chestCloseCap.visible = false;
    }

    closeView () {
        this._chestOpenCap.visible = false;
        this._chestCloseCap.visible = true;
    }
}