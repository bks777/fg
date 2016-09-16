import LinesViewHandler from "../../../CommonComponents/Lines/viewHandler/linesViewHandler.es6.js";
import config from "./config.js";

/**
 * Lines HTML Handler
 * @constructor
 */
export default class DesktopLinesViewHandler extends LinesViewHandler {

    constructor(data = {}) {
        super(data, config);
    }
}