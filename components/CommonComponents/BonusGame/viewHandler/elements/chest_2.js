import BonusItem from "./bonusItem";

export default class Chest_1 extends BonusItem {
    constructor (config, alias) {
        super(config, alias);

        this._mummyPosition = {
            bottom: 25,
            left: 18
        };
    }

    initBackgroundLayer () {
        let layer = new Container();

        return layer;
    }

    initFrontLayer () {
        let layer = new Container();

        this._chest = new Bitmap ("chest_2", this.alias);
        this._chest_open = new Bitmap ("chest_2_open", this.alias);

        layer.addChild(this._chest);
        layer.addChild(this._chest_open);

        this.setChildBottom(this._chest, 0);
        this.setChildBottom(this._chest_open, 0);

        this.setChildAlign("center", this._chest);
        this.setChildLeft(this._chest_open, -37);

        return layer;
    }

    openView () {
        this._chest_open.visible = true;
        this._chest.visible = false;
    }

    closeView () {
        this._chest_open.visible = false;
        this._chest.visible = true;
    }
}