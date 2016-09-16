import ReelHandler from "../../../CommonComponents/Reels/viewHandler/reelHandler.es6.js";

import config from "./config";
import dataConfig from "./defaultConfig";

export default class DesktopReelHandler extends ReelHandler {

    constructor(data = {}){
        super(data, config);
    }
}