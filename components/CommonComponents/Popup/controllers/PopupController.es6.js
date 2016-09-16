import Controller from "../../../../bower_components/html5-game-kernel/interfaces/controllers/Controller.es6.js";

import PopupService from "../../../../bower_components/html5-game-kernel/interfaces/services/popupService.es6.js";

/**
 * Popup Controller
 * @constructor
 */
export default class PopupController extends Controller {

    constructor(data = {}) {
        super(data);

        this.nextState = [];
        this.nextSystemState = [];
        this.popupAnswer = null;

        this.activeGameAction = false;
    }

    initController () {
        this.handler = this.getHandler();//getInst("PopupViewHandler");
    }

    /****************************
     * Actions
     ****************************/

    /**
     * "Ok button in System Popup Action" button Click Action
     */
    systemPopupOkButtonClickAction () {

        this.getService("SoundService").play("audio_options");

        this.getService("PopupService").removeInfoPopup(this.getService("PopupService").getActiveName(PopupService.INFO_POPUP));

        if (this.nextSystemState) {
            this.goToStates(this.nextSystemState);
            this.nextSystemState = [];
        }

        this.handler.hideSystemPopup();
    }

    /**
     * "Ok button in System Popup Action" button Click Action
     */
    gamePopupOkButtonClickAction () {

        if(this.activeGameAction === false){
            return ;
        }

        this.activeGameAction = false;

        this.getService("SoundService").play("audio_options");

        let name = this.getService("PopupService").getActiveName(PopupService.GAME_POPUP);

        this.getService("PopupService").removeWaitGamePopup(name);

        if(!this.getService("PopupService").hasWaitGamePopup(name)){
            this.getService("PopupService").removeGamePopup(name);

            this.handler.hideGamePopup();
        }

        if (this.nextState) {
            this.goToStates(this.nextState);
            this.nextState = [];
        }


    }

    /**
     * Go To states
     * @param list
     */
    goToStates (list = []) {
        for (let state in list) {
            $_signal.goTo(list[state], this.popupAnswer);
        }

        this.popupAnswer = null;
    }
}