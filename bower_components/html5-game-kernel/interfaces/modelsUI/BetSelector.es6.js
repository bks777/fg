//import createjs from "../../libs/easeljs-0.8.2.modify.js";
import Scrollable from "./Scrollable.es6";
import Container from "./Container.es6";
import Bitmap from "./Bitmap.es6";
import Text from "./Text.es6";
import Shape from "./Shape.es6";

export default class BetSelector extends Container {
    constructor (config, values) {
        super();

        let background = new Bitmap (config.images.background);
        this.addChild (background);

        let height = (values.length+2)*70+20;

        let content = new Container ();
        for (var i = 0; i < values.length; i++) {
            var text = new Text(values[i], "30px Arial", "#FFF");
            //text.textAlign = "center";
            text.x = 40;
            text.y = 60+(i+1)*70;
            text.textBaseline = "alphabetic";
            content.addChild(text);
        }

        let layer = new Shape();
        layer.graphics.beginFill("#000");
        layer.alpha = 0.01;
        layer.graphics.drawRect(0, 0, config.width, height);
        layer.graphics.endFill();
        content.addChild(layer);

        content.width = config.width;
        content.height = height;

        let scrollable = new Scrollable (config, content);
        scrollable.y=10;
        scrollable.height=scrollable.height;
        this.addChild(scrollable);
    }
}