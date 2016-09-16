import FreeSpinResumePopup from "../../../../CommonComponents/Freespins/viewHandler/freeSpinResumePopup/freeSpinResumePopup";
import config from "./config.js";

export default class FreeSpinResumeMobilePopup extends FreeSpinResumePopup {

    constructor (config, alias) {
        super (config, alias);

        this.initHandler ();
    }

    initHandler() {
        this._container = new Container({
                width: this.getGameContainer().width,
                height: this.getGameContainer().height
            });
        this._container.name = "resumePopup";
        this._container.visible = false;

        this.getLayout().setChildWidth (this._container, "100%");
        this.getLayout().setChildHeight (this._container, "100%");

        this.initChildrenContainer(this._container, config.children);

        this._popups = {
            left: this._container.getChildByName("left"),
            center: this._container.getChildByName("center"),
            right: this._container.getChildByName("right")
        };
    }

    show () {
        super.show();
        this._screenshot.x = this._screenshot.y = 0;
        return new Promise ((resolve, reject) => {
            setTimeout (resolve, 1000);
        });
    }


    // getLayout (alias = this.alias) {
    //     return super.getLayout (alias);
    // }
}

