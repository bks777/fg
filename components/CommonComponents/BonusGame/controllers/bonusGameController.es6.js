import Controller from "../../../../bower_components/html5-game-kernel/interfaces/controllers/Controller.es6.js";

export default class BonusGameController extends Controller {

    constructor(data = {}){
        super(data);
    }

    /**
     * Check action
     * @param num
     */

    selectObject (num  = 0 ) {
        this.getState().selectObject(num);
    }

    startIntro (resolve) {
        this.getHandler().showStartPopup (resolve);
    }

    endIntro (resolve) {
        this.getHandler().hideStartPopup ().then(() => {
            resolve();
            //$_signal.goTo("bonus.game.start");
        });
    }

    startGame () {
        this.getHandler().initGameState();
    }

    endGame (resolve) {



        //$_signal.goTo ("+protocol.bonus_stop.init");

        this.getService("BonusService").endBonusGame ();

        this.getController("audio").backgroundSoundFadeOut();

        resolve();

        //$_signal.goTo('!audio.background.fadeOut');
    }

    /**
     * Restore bonus game after reload
     */
    restoreGame (resolve) {

        this.getHandler().initGameState(true);

        new Promise((res, rej) => {
            // console.error('show restore 1');
            this.getHandler().showResumePopup(res);
        })
            // .then(delayPromise(1))
            .then(() => {
                return new Promise((res, rej) => {
                    // console.error('show restore 2');
                    this.getHandler().hideResumePopup(res);
                })
            })
            .then(resolve);
    }

    startOutro (resolve) {
        this._outroStartTime = new Date();
        this.getHandler().showEndPopup (this.getHandler().isSuccess()).then (() => {
            resolve();
        });
    }

    endOutro (resolve) {
        let now = new Date();
        let diff = Math.max(0, now.getMilliseconds() - this._outroStartTime.getMilliseconds());

        setTimeout (() => {

            this.getHandler().endBonus();

            this.getHandler().hideEndPopup().then (() => {
                resolve();
            });

        }, 5000 - diff);
    }
}
