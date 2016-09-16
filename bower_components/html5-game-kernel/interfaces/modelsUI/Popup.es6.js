import Shape from "./Shape.es6";
import Bitmap from "./Bitmap.es6";
import Button from "./Button.es6";
import Text from "./Text.es6";

import Container from "./Container.es6";

export default class Popup extends Container {
    static get NO_BUTTON () { return 1; }
    static get CLOSE_BUTTON () { return 2; }
    static get OK_BUTTON () { return 3; }

    constructor (config, alias) {
        super();

        this.config = config;

        let background = new Bitmap (config.backgroundImage, alias);
        this.addChild(background);

        if (config.title) {
            let title = new Text (config.title);
            title.y = config.title.top;
            title.x = config.title.left;

            this.addChild(title);

            this.title = title;

        }

        this.messageContainer = new Container (config.messageContainer);
        this.messageContainer.top = config.messageContainer.top;
        this.messageContainer.width = this.width;
        this.messageContainer.height = this.height - config.messageContainer.top;
        this.addChild(this.messageContainer);


        if (config.button) {
            let buttonContainer = new Container();

            let button = new Button (config.button, alias);
            buttonContainer.addChild(button);
            this.button = button;

            if (config.buttonContainer.right) this.setChildRight(buttonContainer, config.buttonContainer.right);
            if (config.buttonContainer.left) this.setChildLeft(buttonContainer, config.buttonContainer.left);

            if (config.buttonContainer.top) this.setChildTop(buttonContainer, config.buttonContainer.top);
            if (config.buttonContainer.bottom) this.setChildBottom(buttonContainer, config.buttonContainer.bottom);

            if (config.buttonContainer.align) this.setChildAlign(config.buttonContainer.align, buttonContainer);
            if (config.buttonContainer.verticalAlign) this.setChildVerticalAlign(config.buttonContainer.verticalAlign, buttonContainer);

            this.addChild(buttonContainer);
            this.buttonContainer = buttonContainer;

            let buttonTextConfig = {
                text: "Ok"
            };

            if (config.buttonText){
                Object.assign(buttonTextConfig, config.buttonText);
            }

            let buttonText = new Text (buttonTextConfig);
            if (config.buttonText.left) buttonContainer.setChildLeft(buttonText, config.buttonText.left);
            if (config.buttonText.align) buttonContainer.setChildAlign(config.buttonText.align, buttonText);
            if (config.buttonText.verticalAlign) buttonContainer.setChildVerticalAlign(config.buttonText.verticalAlign, buttonText);
            buttonContainer.addChild(buttonText);
        }

        if (config.message) {
            let message = new Text (config.message);

            config.message.padding = config.message.padding || 0;

            message.lineWidth = background.width - config.message.padding;
            if (config.message.top)             message.top = config.message.top;
            if (config.message.left)            this.messageContainer.setChildLeft(message, config.message.left);
            if (config.message.verticalAlign)   this.messageContainer.setChildVerticalAlign(config.message.verticalAlign, message);

            this.messageContainer.addChild(message);

            this.setMessage (message, Popup.OK_BUTTON);
            //this.message = message;
        }
    }

    setMessage (message, type) {
        let footerHeight = 0;

        if (this.button !== undefined) {

            if (type === Popup.NO_BUTTON) {
                this.button.visible = false;
                footerHeight = 0;
            } else {
                this.button.visible = true;
                footerHeight = this.button.height;
            }

            if (type === Popup.OK_BUTTON) {

            } else if (type === Popup.CLOSE_BUTTON) {

            }
        }


        this.messageContainer.height = this.height - footerHeight - this.messageContainer.top;
        if (this.config.message.verticalAlign)   this.messageContainer.setChildVerticalAlign(this.config.message.verticalAlign, message);

        this.message = message;

    }

    show (message, type) {
        this.setMessage(message, type);
        //this.message.text = message;
        this.visible = true;
    }

    hide () {
        this.visible = false;
    }

    toggleVisibility () {
        this.visible = !this.visible;
    }
}
