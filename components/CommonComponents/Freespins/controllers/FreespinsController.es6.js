import Controller from "../../../../bower_components/html5-game-kernel/interfaces/controllers/Controller.es6.js";

export default class FreespinsController extends Controller {

    constructor(data = {}){
        super(data);
    }

    checkFreeSpinEnd () {
        if(this.getService("FreeSpinService").getFreeSpinLeft() > 0) {
           /* let addFreeSpins = this.getService("FreeSpinService").getAdditionalFreeSpins();

            if(addFreeSpins !== false) {

            }*/

            setTimeout(function () {
                $_signal.goTo('freespins.game.play');
            }, 300);
        }
    }

    selectMultiplier (symbolID) {

        this.getService("SoundService").raiseGroup("main");

        this.chooseIdle = symbolID;
    }

    /**
     * Show start free spin popup
     */
    startIntro () {

        this.chooseIdle = null;

        if (this.getService("AutoPlayService").isActive() && this.getService("AutoPlayService").isStopOnFreeGameEnabled()) {
            this.getService("AutoPlayService").stopAutoSpins();
        }

    }

    endIntro (resolve) {

        this.getHandler().showSelectedHeader();

        setTimeout (() =>{
            resolve();
        }, 500);

    }

    startGame () {
        setTimeout (() => {
            //$_signal.goTo("freespins.game.play");
        }, 500);

    }

    restoreGame (resolve) {
        this.getHandler().showResumePopup ().then (() => {

            resolve(this.getService("FreeSpinService").getFreeSpinLeft() > 0);
        });
    }


    startOutro (resolve) {

        this._outroStartTime = new Date();
        this.getHandler().showEndPopup (this.getService("FreeSpinService").getTotalWin() > 0).then (() => {
            resolve();
        });
    }

    endOutro (resolve) {
        let now = new Date();
        let diff = Math.max(0, now.getMilliseconds() - this._outroStartTime.getMilliseconds());

        setTimeout (() => {
            resolve();
            this.getHandler().hideLayout();

            this.getHandler().hideEndPopup().then (() => {

            });

        }, 3000 - diff);
    }


}
