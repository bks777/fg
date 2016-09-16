import BonusStartPopup from "../../../../CommonComponents/BonusGame/viewHandler/bonusStartPopup/bonusStartPopup";
import config from "./config";

export default class BonusStartMobilePopup extends BonusStartPopup {

    constructor (config, alias) {
        super (config, alias);

        this.initHandler ();
    }

    initHandler() {

        this._container = new Container({
            width: this.getGameContainer().width,
            height: this.getGameContainer().height
        });

        this.initChildrenContainer(this._container, config.children);

    }
    show (resolve) {
        super.show(resolve);
        this._screenshot.x = this._screenshot.y = 0;
        this._shape.x = this.getGameContainer().width / 2;
        this._shape2.x = this.getGameContainer().width / 2;
        this._shape.y = this.getGameContainer().height / 2;
        this._shape2.y = this.getGameContainer().height / 2;
        this._container.getChildByName('black').width =  this.getCanvas().width;
        this._container.getChildByName('black').height =  this.getCanvas().height;
    }

    getLayout (alias = this.alias) {
        return super.getLayout (alias);
    }


}