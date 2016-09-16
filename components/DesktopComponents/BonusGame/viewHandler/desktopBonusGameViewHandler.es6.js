import BonusGameViewHandler from "../../../CommonComponents/BonusGame/viewHandler/bonusGameViewHandler.es6.js"
import config from "./config.js";

export default class DesktopBonusGameViewHandler extends BonusGameViewHandler {

    constructor(data = {}){
        super(data, config);
    }
}