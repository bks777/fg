import ViewCanvasHandler from "../../../../bower_components/html5-game-kernel/views/interfaces/ViewCanvasHandler.es6.js";
import SlotMachineService from "../../../../bower_components/html5-game-kernel/interfaces/services/slotMachineService.es6";

import {Sprite, Bitmap, Container} from "../../../../bower_components/html5-game-kernel/interfaces/modelsUI/Core.es6.js";

/**
 * Reel HTML Handler
 * @constructor
 */
export default class ReelHandler extends ViewCanvasHandler {
    constructor(data = {}, config = null) {
        super(data);
        if (config === null) {
            return false;
        }
        this.config = config;

        this.slotMachineService = new SlotMachineService();

        this.columns = 5;
        this.rows = 3;
        this.reels = [];


        this.elements = {};


        this._slotMachine = null;

        this.init(data);

        this.ready = false;
        this.readyCallback = null;

        this._overheadLineContainer = null;
    }

    /**
     * Init Game Reels
     */
    initGameReels() {

        let layout = this.initLayout(this.config);
        layout.visible = false;

        this.initChildren(this.config.children);

        this._slotMachine = this.getChildByName("slotMachine");
        this.updateReelsSets();

        this.ready = true;

        if (this.readyCallback !== null) {
            this.readyCallback();
        }

        if (this.config.reelAnimationsAtlasConfig) {
            this.animationsSpriteSheet = new SpriteSheet (this.config.reelAnimationsAtlasConfig, this.alias);
        }


    };

    /**
     * Init overhead lines container
     */
    initOverheadContainer(){
        this._overheadLineContainer = $_view_canvas.initLayout ({
            width: 960,
            height: 540,
            top: 0,
            left: 0,
        }, "overheadLines");
    }

    /**
     * Get overhead container
     * @returns {null|*}
     */
    getOverheadContainer(){
        return this._overheadLineContainer;
    }

    /**
     * Init top reels
     */
    initTopLayout(){

        let topContainer = {
            children: {
                top : {
                    type: "Container",
                    top: this.config.children.slotMachine.top,
                    left: this.config.children.slotMachine.left,
                    width: this.config.children.slotMachine.width,
                    height: this.config.children.slotMachine.height
                }
            }
        };

        this.initLayout({
            zIndex: 20
        }, "top-reels");

        //this.getLayout("top-reels").addChild(this.topContainer);
    }

    updateReelsSets () {
        let slotMachine = this._slotMachine;
        let winLines = this.getService("LinesService").getWinLines();

        slotMachine.setSymbols(this.slotMachineService.getMatrix());

        let lastAction = this.getService("ProtocolService").getLastAction();
        let currentAction = this.getService("ProtocolService").getCurrentAction();
        let nextAction = this.getService("ProtocolService").getNextAction();

        let respinsAvailable =  lastAction === "respin" || nextAction === "respin";

        let bigWildPositions = [];
        let winReels = [];
        let wildReels = [];

        for (let i = 0; i < slotMachine.reels.length; i++) {
            let reel = slotMachine.reels[i];
            for (let j = 1; j < reel.elements.length-1; j++) {
                if (reel.getElement(j).isWild()) {
                    wildReels[i] = j;
                }
            }
        }

        for (let line in winLines) {
            for (let r in winLines[line].positions) {
                let [col, row] = winLines[line].positions[r];
                winReels[col] = true;
            }
        }
        if (respinsAvailable) {
            for (let reel in wildReels) {
                bigWildPositions.push ({reel, row: wildReels[reel]});
            }
        } else {
            for (let reel in winReels) {
                if (wildReels[reel] !== undefined) {
                    bigWildPositions.push ({reel, row: wildReels[reel]});
                }
            }
        }

        for (let position in bigWildPositions) {
            slotMachine.reels[bigWildPositions[position].reel].showStaticBigWild (bigWildPositions[position].row);
        }

        /*for (let i = 0; i < slotMachine.reels.length; i++) {
            let reel = slotMachine.reels[i];
            for (let j = 1; j < reel.elements.length-1; j++) {
                if (reel.getElement(j).isWild()) {
                    reel.showStaticBigWild(1);
                    break;
                }
            }
        }*/


    }

    /**
     * Start reels
     */
    startReels() {
        this._slotMachine.startReels();

        this.startAdditionalReelAnimation();
    }

    generateRandomValues() {
        let stopValues = [];
        for (let i = 0; i < this._slotMachine.reels.length; i++) {
            let reelValue = [];
            for (let j = 0; j < this._slotMachine.reels[i].numChildren - 2; j++) {
                reelValue.push(Math.floor(Math.random() * this._slotMachine.config.defaultReel.numOfSymbols) + 1);
            }
            stopValues.push(reelValue);
        }

        return stopValues;
    }

    /**
     * Stop reels
     * @param resolve
     */
    stopReels(resolve = ()=>{} ) {

        this._slotMachine.stopReels(this.slotMachineService.getMatrix()).then(() => {

            this.stopAdditionalReelAnimation();

            resolve();

            /*if (($_signal_history.find("reels.autoSpins.stop") === 0 || $_signal_history.find("reels.autoSpins.spin") === 0)
                && !this.getService("AutoPlayService").isActive()) {

                $_signal.goTo('!control.hideAutoPlayInterface');
                $_signal.goTo('reels.spins.stopAnimation');
            } else {
                $_signal.goTo('reels..stopAnimation');
            }*/
        });
    }

    addNewReel() {
        const showNewReel = () => {
            return new Promise((resolve, reject) => {

                let reelConfig = {
                    left: this._slotMachine.config.width,
                    width: this._slotMachine.reels[0].width
                };

                this._slotMachine.addReel(reelConfig);

                let reel = this._slotMachine.reels[this._slotMachine.reels.length - 1];
                let newX = this._slotMachine.getReelAutoX(this._slotMachine.reels.length - 1);

                createjs.Tween.get(reel).to({x: newX}, 3000).call(() => {//@TODO Magic Number!
                    reel.start();
                    setTimeout(resolve, 500);//@TODO Magic Number!
                });
            });
        };

        let offset = 0;
        let promises = [];
        for (let r in this._slotMachine.reels) {
            let reel = this._slotMachine.reels[r];
            let numOfReels = this._slotMachine.reels.length;
            let width = reel.width;

            promises.push(new Promise((resolve) => {
                createjs.Tween.get(reel).to({
                    width: width * numOfReels / (numOfReels + 1),
                    x: reel.x - offset
                }, 3000).call(resolve);//@TODO Magic Number!
            }));

            offset += width / (numOfReels + 1);
        }

        return Promise.all(promises)
            .then(() => {
                return showNewReel();
            });
    }

    fastStopReels(stopValues = this.generateRandomValues()) {
        this._slotMachine.fastStop(stopValues);
    }

    showDefaultMask() {
        var maskShape = new Shape();

        maskShape.graphics.drawRect(
            this._slotMachine.x, this._slotMachine.y,
            this._slotMachine.width, this._slotMachine.height);

        this._slotMachine.mask = maskShape;
    }

    showFreeSpinMask() {
    }

    /**
     * Init default background
     */
    initDefaultBackground() {
        this.showDefaultMask();
    }


    showFreeSpinBackground() {
        this.showFreeSpinMask();

        if (this.ready !== true) {
            this.readyCallback = this.showFreeSpinBackground;
        }
    }

    //@TODO maybe we need to delete it?
    hideFreeSpinBackground() {
    }

    setWinElements() {
    }

    /**
     * For respin with hold current wilds with scatters and move others elements reels
     */
    startRespinReels() {
        this.startReels();

        this._slotMachine.reels[1].setAnimation("freez");
        this._slotMachine.reels[3].setAnimation("freez");
    }


    stopRespinReels() {
        this._slotMachine.reels[1].setAnimation("standart");
        this._slotMachine.reels[3].setAnimation("standart");
    }

    /**
     * Stop reels audio
     * @param number
     */
    stopReelSound(number = 0){

        if(!this.getService("SlotMachineService").getInstance().isEnableQuickMode()){
            this.getService("SoundService").play("audio_reel_stop", null, {"volume": 0.6});

        } else if(number == 4){
            /**
             * For fast mode
             */
            this.getService("SoundService").play("audio_reel_short", null, {"volume": 0.6});
        }

    }

    startAdditionalReelAnimation () {
        if (!this.animationsSpriteSheet) {
            return;
        }

        this._tops = [];
        this._bottoms = [];

        for (let i = 0; i < this._slotMachine.reels.length; i++) {


            this._tops[i] = new Sprite ({spriteSheet: this.animationsSpriteSheet}, this.alias);
            this._tops[i].gotoAndPlay ("top_reels_animation");
            let numOfFrames = this.animationsSpriteSheet.getNumFrames (this._tops[i].currentAnimation);
            this._tops[i].currentAnimationFrame = Math.floor (Math.random() * numOfFrames );

            let el = this._slotMachine.reels[i].getElement(1);
            el.localToLocal (0, 0, this.getLayout(), this._tops[i]);
            this._tops[i].y = 101;

            this.getLayout().addChild (this._tops[i]);


            this._bottoms[i] = new Sprite ({spriteSheet: this.animationsSpriteSheet}, this.alias);


            if (this.getFlagGlobal("freeSpinsEnabled")) {
                this._bottoms[i].gotoAndPlay ("freespins_reels_animation");
                this._bottoms[i].y = 510;
            } else {
                this._bottoms[i].gotoAndPlay ("main_reels_animation");
                this._bottoms[i].y = 496;
            }


            numOfFrames = this.animationsSpriteSheet.getNumFrames (this._bottoms[i].currentAnimation);
            this._bottoms[i].currentAnimationFrame = Math.floor (Math.random() * numOfFrames );

            el = this._slotMachine.reels[i].getElement(4);
            this._bottoms[i].x = el.localToLocal (0, 0, this.getLayout()).x;

            this.getLayout().addChild (this._bottoms[i]);
        }

    }

    stopAdditionalReelAnimation (reelNumber) {
        if (this._tops && this._tops[reelNumber]) {

            createjs.Tween
                .get(this._tops[reelNumber])
                .to ({alpha:0}, 150)
                .call (() => {
                    this.getLayout().removeChild (this._tops[reelNumber]);
                });

        }

        if (this._bottoms && this._bottoms[reelNumber]) {
            createjs.Tween
                .get(this._bottoms[reelNumber])
                .to ({alpha:0}, 150)
                .call (() => {
                    this.getLayout().removeChild (this._bottoms[reelNumber]);
                });
        }
    }

    /**
     * Stop spin reels with doScrolling freeSpins | bonus reels
     * @url https://developer.mozilla.org/ru/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
     * @param resolve
     */
    stopSpinReels(resolve){

        let matrix = this.slotMachineService.getMatrix();

        let slot = this.slotMachineService.getInstance();

        let freeZes = [0,0,0,0,0], eventsStart = [null, null, null, null, null],
            eventsEnd = [null, null, null, null, null],
            /**
             * Последовательная остановка рилов | асинхронная остановка
             * @type {boolean}
             */
            successively = true;

        /**
         * Scale choose element in second reel
         * @param element
         * @param id
         */
        const scaleSymbol = (element, id) => {

            let typeAnimation = {
                13: {src: "scatterElementBlend", width: 80, height: 80, scaleX: 2 * 1.5, scaleY: 2 * 1.5},
                14: {src: "bonusElementBlend", width: 80, height: 80, scaleX: 2 * 1.5, scaleY: 2 * 1.5}
            };

            let el = element.clone(true);
            el.x = element.parent.x + element.parent.parent.x;
            el.y = element.y + element.parent.y + element.parent.parent.y;
            el.width = element._width;
            el.height = element._height;

            this.getOverheadContainer().addChild(el);

            let ghost = new Bitmap(typeAnimation[id], this.alias);
            ghost.x = el.x - (((ghost.width * 1.3) - ghost.width) / 2) - 15;
            ghost.y = el.y - (((ghost.height * 1.3) - ghost.height) / 2) - 15;
            ghost.compositeOperation = "screen";
            ghost.alpha = 0;
            this.getOverheadContainer().addChild(ghost);

            let _const = {x:el.x, y:el.y, width: el.width, height: el.height};

            let scale = 1.3;

            let _def = {
                x: _const.x - (((_const.width * scale) - _const.width) / 2),
                y: _const.y - (((_const.height * scale) - _const.height) / 2)
            };

            createjs.Tween.get(ghost, {loop: false})
                .to({alpha: 1}, 1)
                .to({scaleX: 2, scaleY: 2, x: _const.x - 10, y: _const.y - 10}, 300)
                .to({alpha: 0}, 400)
                .call(()=>{
                    this.getOverheadContainer().removeChild(ghost);
                    ghost = null;
                });

            createjs.Tween.get(el, {loop: false})
                .to({scaleX: scale, scaleY: scale, x: _def.x, y: _def.y}, 150)
                .wait(50)
                .to({scaleX: 1, scaleY: 1, x: _const.x, y: _const.y}, 100)
                .call(()=>{
                    this.getOverheadContainer().removeChild(el);
                    el = null;
                });
        };


        /**
         * Create blend Bitmap
         * @param name
         * @returns {Bitmap}
         */
        const redBlend = (name = null) => {
            return new Bitmap({
                src: name,
                width: 200,
                height: 506
            }, this.alias);
        };

        let findBonus = matrix[1].indexOf(14);
        if(findBonus > -1){
            freeZes = [0, 1, 0, 1000, 0];

            // 2 reel
            let conReel1 = slot.reels[1];

            let btm1 = redBlend("bonusBlendReel");
            conReel1.parent.addChild(btm1);
            btm1.y = -30;
            btm1.x = conReel1.x - 30;
            btm1.alpha = 0;
            btm1.compositeOperation = "screen";

            eventsStart[1] = () => {
                if(slot.quickMode || slot.onceFastStop){
                    return ;
                }

                createjs.Tween.get(btm1, {loop: false})
                    .to({alpha: 1}, 200)
                    .wait(100)
                    .to({alpha: 0}, 150)
                    .call(()=>{
                        conReel1.parent.removeChild(btm1);
                    })
            };

            eventsEnd[1] = () => {
                if(slot.quickMode || slot.onceFastStop){
                    return ;
                }

                scaleSymbol(conReel1.elements[findBonus + 1], 14);
            };

            // 3 reel
            let conReel3 = slot.reels[3];

            let btm3 = redBlend("bonusBlendReel");
            conReel3.parent.addChild(btm3);
            btm3.y = -30;
            btm3.x = conReel3.x - 30;
            btm3.alpha = 0;
            btm3.compositeOperation = "screen";

            eventsStart[3] = () => {
                if(slot.quickMode || slot.onceFastStop){
                    return ;
                }

                conReel3.intrigueMode = true;
                createjs.Tween.get(btm3, {loop: false}).to({alpha: 1}, 100);
            };

            eventsEnd[3] = () => {
                conReel3.intrigueMode = false;

                if(slot.quickMode || slot.onceFastStop){
                    conReel3.parent.removeChild(btm3);
                } else {
                    let find = matrix[3].indexOf(14);
                    if(find > -1){
                        scaleSymbol(conReel3.elements[find + 1], 14);
                    }

                    createjs.Tween.get(btm3, {loop: false}).to({alpha: 0}, 150).call(()=>{
                        conReel3.parent.removeChild(btm3);
                    });
                }
            };

            successively = false;
        }

        /**
         * Scatter
         */
        let findScatter = matrix[1].indexOf(13);
        if(findScatter > -1){
            freeZes = [0,1, 1000, 2000, 0];

            if(matrix[2].indexOf(13) == -1){
                freeZes[3] = 10;
            }

            // 2 reel
            let conReel1 = slot.reels[1];

            let btm1 = redBlend("scatterBlendReel");
            conReel1.parent.addChild(btm1);
            btm1.y = -30;
            btm1.x = conReel1.x - 25;
            btm1.alpha = 0;
            btm1.compositeOperation = "screen";

            eventsStart[1] = () => {

                if(slot.quickMode || slot.onceFastStop){
                    return ;
                }

                createjs.Tween.get(btm1, {loop: false})
                    .to({alpha: 1}, 200)
                    .wait(100)
                    .to({alpha: 0}, 150)
                    .call(()=>{
                        conReel1.parent.removeChild(btm1)
                    });
            };

            eventsEnd[1] = () => {
                if(slot.quickMode || slot.onceFastStop){
                    return ;
                }

                scaleSymbol(conReel1.elements[findScatter + 1], 13);
            };

            let btm2 = redBlend("scatterBlendReel");

            let btm3 = redBlend("scatterBlendReel");

            // 2 reel
            let conReel2 = slot.reels[2];

            conReel2.parent.parent.addChild(btm2);
            btm2.y = conReel2.parent.y - 30;
            btm2.x = conReel2.parent.x + conReel2.x - 30;
            btm2.alpha = 0;
            btm2.compositeOperation = "screen";

            eventsStart[2] = () => {
                if(slot.quickMode || slot.onceFastStop){
                    return ;
                }

                //conReel2.intrigueMode = true;
                createjs.Tween.get(btm2, {loop: false}).to({alpha: 1}, 300);
            };

            eventsEnd[2] = () => {

                //conReel2.intrigueMode = false;

                if(slot.quickMode || slot.onceFastStop){
                    conReel2.parent.parent.removeChild(btm2);
                } else {

                    let find = matrix[2].indexOf(13);
                    if(find > -1){
                        scaleSymbol(conReel2.elements[find + 1], 13);
                    }

                    createjs.Tween.get(btm2, {loop: false}).to({alpha: 0}, 150).call(()=>{
                        conReel2.parent.parent.removeChild(btm2);
                    });
                }
            };

            // 3 reel
            let conReel3 = slot.reels[3];

            conReel3.parent.parent.addChild(btm3);
            btm3.y = conReel3.parent.y - 30;
            btm3.x = conReel3.parent.x + conReel3.x - 30;
            btm3.alpha = 0;
            btm3.compositeOperation = "screen";

            eventsStart[3] = () => {
                if(slot.quickMode || slot.onceFastStop){
                    return ;
                }

                conReel3.intrigueMode = true;
                createjs.Tween.get(btm3, {loop: false}).to({alpha: 1}, 300);
            };

            eventsEnd[3] = () => {

                conReel3.intrigueMode = false;

                if(slot.quickMode || slot.onceFastStop){
                    conReel3.parent.parent.removeChild(btm3);
                } else {
                    let find = matrix[3].indexOf(13);
                    if(find > -1){
                        scaleSymbol(conReel3.elements[find + 1], 13);
                    }

                    createjs.Tween.get(btm3, {loop: false}).to({alpha: 0}, 150).call(()=> {
                        conReel3.parent.parent.removeChild(btm3);
                    });
                }
            };

            successively = false;
        }
//[successively ? "stopReels" : "stopReelsWaitLast"]
        this._slotMachine.stopReels(matrix, freeZes, eventsStart, [], eventsEnd).then(() => {
            this.stopAdditionalReelAnimation();
            resolve();
        });
    }

    /**
     * Free spins stop reels
     * @param resolve
     */
    stopFreeSpinReels(resolve){

        /**
         * Get ID
         * @returns {*}
         */
        const getId = () => {

            let data = this.getService("ProtocolService").getCurrentReelsData("freespins");
            if (!data) {
                return null;
            }

            return data.wildId;
        };



        let matrix = this.slotMachineService.getMatrix();

        let freeZes = [0,0,0,0,0], eventsStart = [null, null, null, null, null], eventsEnd = [null, null, null, null, null];

        const redBlend = () => {
            let id = getId();
            let ids = {10: "X2", 11: "X3", 12:"X5"};

            return new Bitmap({
                src: id === null ? "Wild_X2_BlendReel" : `Wild_${ids[id]}_BlendReel`,
                width: 190,
                height: 516
            }, this.alias);
        };

        if(matrix[2].indexOf(10) > -1 || matrix[2].indexOf(11) > -1 || matrix[2].indexOf(12) > -1){
            freeZes = [0,0, 1, 0,0];

            // 3 reel
            let conReel3 = this.slotMachineService.getInstance().reels[2];

            let btm3 = redBlend();
            conReel3.parent.parent.parent.addChild(btm3);
            btm3.y = 35;
            btm3.x = conReel3.parent.x + conReel3.x - 27;
            btm3.alpha = 0;
            btm3.compositeOperation = "screen";

            if(this.slotMachineService.getInstance().quickMode){
                createjs.Tween.get(btm3, {loop: false}).to({alpha: 0.8}, 170);
            } else {
                createjs.Tween.get(btm3, {loop: false}).to({alpha: 1}, 200);
            }

            eventsEnd[2] = () => {

                if(this.slotMachineService.getInstance().quickMode){
                    createjs.Tween.get(btm3, {loop: false}).to({alpha: 0}, 500).call(()=>{
                        conReel3.parent.parent.parent.removeChild(btm3);
                    });
                } else {
                    createjs.Tween.get(btm3, {loop: false}).to({alpha: 0}, 300).call(()=>{
                        conReel3.parent.parent.parent.removeChild(btm3);
                    });
                }


            };
        }

        this._slotMachine.stopReels(matrix, freeZes, eventsStart, [], eventsEnd).then(() => {
            this.stopAdditionalReelAnimation();
            resolve();
        });
    }
}


