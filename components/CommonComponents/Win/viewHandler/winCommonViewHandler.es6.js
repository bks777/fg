import ViewCanvasHandler from "../../../../bower_components/html5-game-kernel/views/interfaces/ViewCanvasHandler.es6.js";

// import numbersSpriteSheet from "../../../CommonComponents/BonusGame/viewHandler/elements/numbersSpriteSheet.js"
/**
 * Big Win View Handler
 * @constructor
 */
export default class WinCommonViewHandler extends ViewCanvasHandler {

    constructor(data = {}){
        super(data);

        this.init(data);

        this.availableBigAnimation = null;
        this.bigWin = null;

        this.bigWinPromise = null;

        this.activeBigWin = false;
        this.isQuickStop = false;
    }

    initHandler(){
        this.config = {
            zIndex: 20
        };
        if (!this.ready) {
            this.initLayout(this.config);
            this.ready = true;
        }

        this.getLayout().width = this.getCanvas().width;
        this.getLayout().height = this.getCanvas().height;
        this.getLayout().x = -this.getLayout().parent.x;

    }


    counterEffect (target, start, end) {
        target.text = (Number(start).toFixed(2)).toString();
        target.value = start;

        let dif = (end - start);

        let step1 = dif / 10;
        let step2 = dif / 100;

        let end1 = end - step1;
        let end2 = end;

        let currentValue = start;

        let step;

        let tween = createjs.Tween.get(target)
            .call( () => {
                step = step1;
            })
            .to({value: end1}, 600)//, createjs.Ease.getPowOut (2))
            .call (() => {
                step = step2;
            })
            .to ({value: end2}, 1000, createjs.Ease.getPowOut (2))
            .call (() => {
                target.text = (Number(end).toFixed(2)).toString();
            })
            .addEventListener("change", () => {
                if (target.value - currentValue > step) {
                    currentValue = target.value;
                    target.text = (Number(target.value).toFixed(2)).toString();

                    target.x = this.getGameContainer().width/2 - target.getBounds().width/2;
                    //this.getService("SoundService").play("audio_sound_numbers");
                }
            });
    }

    hideBigWin () {
        if (!this.ready) {
            return;
        }

        if (this.bigWins){
            for (let i = 0; i < this.bigWins.length; i++) {
                delete this.bigWins[i];
            }
        }

        delete this.bigWins;
        delete this.labelContainer;
        delete this.winValue;

        // this.getLayout().visible = false;
        this.bigWinPromise = null;
    }


    /**
     * Stop big win animation
     */
    stopBigWinAnimation(resolveMain){

        if(this.activeBigWin === true) {

            this.hideBigWin(resolveMain);

            this.activeBigWin = false;
        }
    }

}