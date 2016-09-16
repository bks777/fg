import Container from "./Container.es6";

export default class CheckboxContainer extends Container {
    constructor (config, alias) {
        super(config, alias);

        this.cursor = config.cursor || "pointer";
        this.mouseChildren = false;
        this.enableClickableBackground();

        this.addEventListener ("click", () => {
            let checkbox = this.getChildByName("checkBox");
            if (!checkbox) {
                $_log.warn("checkBox not found");
            } else {
                checkbox.checked = !checkbox.checked;
                this.dispatchEvent ("change");
            }
        });
    }

    get checked () {
        let checkbox = this.getChildByName("checkBox");
        if (checkbox) {
            return checkbox.checked;
        } else {
            $_log.warn("checkBox not found");
            return null;
        }
    }

    set checked (checked) {
        let checkbox = this.getChildByName("checkBox");
        if (checkbox) {
            checkbox.checked = checked;
        } else {
            $_log.warn("checkBox not found");
        }
    }
}