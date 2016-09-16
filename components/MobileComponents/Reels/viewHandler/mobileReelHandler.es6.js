import ReelHandler from "../../../CommonComponents/Reels/viewHandler/reelHandler.es6.js";

import config from "./config";
import dataConfig from "./defaultConfig";

export default class MobileReelHandler extends ReelHandler {

    constructor(data = config){
        super(data, config);
    }
}