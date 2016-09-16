import BonusItem from "./bonusItem";

export default class Sarcophagus extends BonusItem {
    constructor (config, alias) {
        super(config, alias);

        this._mummyPosition = {
            bottom: 5,
            left: 15
        };

        this._winActionConfig.endY = -50;
        this._lifeActionConfig.endY = -50;
        this._princessActionConfig.bottom = 0;
    }

    initBackgroundLayer () {
        let layer = new Container();

        return layer;
    }

    initFrontLayer () {
        let layer = new Container();

        this._sarcophagus = new Bitmap ("sarcophagus", this.alias);
        this._sarcophagus_open = new Bitmap ("sarcophagus_open", this.alias);

        layer.addChild(this._sarcophagus);
        layer.addChild(this._sarcophagus_open);

        this.setChildBottom(this._sarcophagus, 0);
        this.setChildBottom(this._sarcophagus_open, 0);

        return layer;
    }

    openView () {
        this._sarcophagus_open.visible = true;
        this._sarcophagus.visible = false;
    }

    closeView () {
        this._sarcophagus_open.visible = false;
        this._sarcophagus.visible = true;
    }

    ripAction () {
        this.hideMummy();

        this._mummy = this.createMummy();

        this._frontLayer.addChild(this._mummy);
        this._frontLayer.setChildBottom(this._mummy, this._mummyPosition.bottom);
        this._frontLayer.setChildLeft(this._mummy, this._mummyPosition.left);

        this._mummy.angry();
    }

    rip () {
        this.openState();

        this._mummy = this.createMummy();

        this._frontLayer.addChild(this._mummy);
        this._frontLayer.setChildBottom(this._mummy, this._mummyPosition.bottom);
        this._frontLayer.setChildLeft(this._mummy, this._mummyPosition.left);

        this._mummy.idle();
    }

    princessAction (win) {
        this.hidePrincess();

        this._princess = new Bitmap ({
            src: "princess"
        }, this.alias);

        this.winAction(win, this._frontLayer.height - (this._princessActionConfig.bottom + this._princess.height + this._princessActionConfig.winOverPrincessY) );

        this._princess.name = "princess";
        this._princess.regY = this._princess.height;
        this._frontLayer.setChildBottom(this._princess, this._princessActionConfig.bottom - this._princess.regY);
        this._frontLayer.setChildAlign("center", this._princess);
        this._princess.scaleY = this._princessActionConfig.startScale;

        this._frontLayer.addChild(this._princess);

        createjs.Tween
            .get(this._princess)
            .to ({scaleY: this._princessActionConfig.endScale*1.15}, this._princessActionConfig.time*0.7)
            .to ({scaleY: this._princessActionConfig.endScale}, this._princessActionConfig.time*0.3)
            .call (() => {

            });
    }

}