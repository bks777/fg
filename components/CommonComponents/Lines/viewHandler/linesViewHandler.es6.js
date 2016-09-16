import ViewCanvasHandler from "../../../../bower_components/html5-game-kernel/views/interfaces/ViewCanvasHandler.es6.js";

import {LineCarribean, Sprite, Container} from "../../../../bower_components/html5-game-kernel/interfaces/modelsUI/Core.es6.js";

let linesManager,
    fadeInterval,
    CONFIG = {
        framerate: 27,
        positionCrunch: {
            x: -10,
            y: -10
        }
    };
/**
 * Lines HTML Handler
 * @constructor
 */
export default class LinesViewHandler extends ViewCanvasHandler {

    constructor(data = {}, config = null) {
        super(data);

        if(!config){
            return false;
        }
        this.config = config;

        this.init(data);

        this.actives = this.preActives = false;
        this.roundEnd = true;

        this.lastLine = null;

        this.overSymbols = [];

        this.subscribeArrayEnded = [];

        this._startTimer = null;
        
        this.promiseResolve = ()=>{};
        this.promiseAllResolve = ()=>{};

        this._isBigWild = null;
        //this.quickStop = false;
    }

    initHandler () {

        this.initLayout(this.config);
        this.getLayout().visible = false;

        this.initChildren(this.config.children);
        linesManager = this.querySelector("linesManager");

        let pt = this.getLayout().localToGlobal(linesManager.x, linesManager.y);

        this.rect = new createjs.Rectangle (pt.x, pt.y, linesManager.width, linesManager.height);

        let slotMachine = this.getService("SlotMachineService").getInstance();
        this.tweens = [];
        for (let i = 0; i < slotMachine.reels.length; i++) {
            this.tweens[i] = [];
        }

        this.initLabelHandlers();

        //this.cacheLayout();

        this.hideAllLines ();
    }

    /**
     * In case of restore of win
     */
    playStartWinLines(){

        let currentAction = this.getService("ProtocolService").getCurrentAction();
        let lastAction = this.getService("ProtocolService").getLastAction();
        let nextAction = this.getService("ProtocolService").getNextAction();

        let slotMachine = this.getService("SlotMachineService").getInstance();
        let numOfActiveLines = this.getService("LinesService").getCurrentValue();

        this.checkBetLinesShow();

        if (currentAction === "spins") {

            if (this.getService("LinesService").getWinLines().length > 0) {
                this.stopSpinAction();
            } else {
                for (let i = 1; i <= numOfActiveLines; i++) {
                    linesManager.showLine(i);
                }
                this._startTimer = setTimeout( () => {
                    this.hideAllLines ();
                    this.getService("GameActionService").next();
                }, 2000);
            }

        } else if (currentAction === "freespins") {

        } else if (currentAction === "respins") {

        }

    }

    /**
     * Show start game lines
     * @param resolve
     */
    showStartLines(resolve =  () => {}){

        this._startShowLinesResolve = resolve;

        linesManager.disableMouseOverForLabels();

        let numOfActiveLines = this.getService("LinesService").getCurrentValue();

        for (let i = 1; i <= numOfActiveLines; i++) {
            linesManager.showLine(i);
        }
        this._startTimer = setTimeout( () => {
            this.hideAllLines ();
            linesManager.enableMouseOverForLabels();
            resolve();
        }, 2000);
    }

    /**
     * Clear start timeout
     */
    clearPlayStartTimer(){

        if(this._startShowLinesResolve){

            if(this._startTimer){
                clearTimeout(this._startTimer);
            }

            this.hideAllLines();
            this._startShowLinesResolve();

            this._startShowLinesResolve = undefined;


        }
    }

    initLabelHandlers () {
        linesManager = this.querySelector("linesManager");

        const addHandler = (line, label) => {
            label.cursor = "pointer";
            label.addEventListener ("rollover", () => {
                if (!line.disabledMouseLabels) {
                    line.showLine();
                    line.showOverLabel();
                    //line.showWinLabel();
                    this.requestUpdate();

                    this.getService("SoundService").play("audio_line_onMouseOver");
                }
            });

            label.addEventListener ("rollout", () => {
                if (!line.disabledMouseLabels) {
                    line.hideLine();
                    line.showStandardLabel();
                    this.requestUpdate();
                }
            });
        };

        for (let line in linesManager.lines) {
            let l = linesManager.lines[line];
            if (l.rightLabel) {
                addHandler (l, l.rightLabel);
            }
            if (l.leftLabel) {
                addHandler (l, l.leftLabel);
            }
        }

    }

    showWinLineAmount (winLine) {
        if (winLine.amount <= 0) {
            return;
        }

        let showOnReel = 2;

        let slotMachine = this.getService("SlotMachineService").getInstance();
        let winLineAmount = this.querySelector("winLineAmount");

        let valueText = winLineAmount.getChildByName ("value");
        let background = winLineAmount.getChildByName ("background");
        valueText.text = Number(winLine.amount/100).toFixed(2);

        winLineAmount.visible = true;
        background.visible = true;

        let rect = valueText.getBounds();
        valueText.x = winLineAmount.width/2 - rect.width/2*valueText.scaleX;
        valueText.y = winLineAmount.height/2 - rect.height/2*valueText.scaleY;
        let showOnRow;
        for (let pos in winLine.positions) {
            let [reel, row] = winLine.positions[pos];
            if (reel === showOnReel) {
                //showOnRow = row+1; /// если нужно чтобы определялось на среднем барабане - раскоментировать
                break;
            }
        }
        if (showOnRow === undefined) {
            showOnRow = winLine.positions[0][1]+1;
            showOnReel = winLine.positions[0][0];
        }

        let el = slotMachine.reels[showOnReel].getElement(showOnRow);
        let pt = el.localToLocal(el.width/2, el.height, this.getLayout());

        winLineAmount.x = pt.x;// - winLineAmount.width/2;
        winLineAmount.y = pt.y;

        winLineAmount.regX = winLineAmount.width/2;
        winLineAmount.regY = winLineAmount.height/2;

        background.regX = background.width / 2;
        background.regY = background.height / 2;
        /*background.x = background.width;*/

        let time = 90;

        createjs.Tween
            .get(winLineAmount, {override:true})
            .to ({scaleX: 1.3, scaleY: 1.3}, time)
            .to ({scaleX: 0.8, scaleY: 0.8}, time)
            .to ({scaleX: 1.1, scaleY: 1.1}, time)
            .to ({scaleX: 0.95, scaleY: 0.95}, time)
            .to ({scaleX: 1, scaleY: 1}, time)
            .wait(900)
            .to ({scaleX: 1.3, scaleY: 1.3}, time)
            .to ({scaleX: 0.8, scaleY: 0.8}, time)
            .to ({scaleX: 1.1, scaleY: 1.1}, time)
            .to ({scaleX: 0.95, scaleY: 0.95}, time)
            .to ({scaleX: 1, scaleY: 1}, time)
    }

    hideWinLineAmount() {
        let winLineAmount = this.querySelector("winLineAmount");


        winLineAmount.visible = false;
    }

    showWinLine (data) {
        let slotMachine = this.getService("SlotMachineService").getInstance();

        let [winLine, needSound] = data;

        let soundPromise = new Promise((resolve, reject)=>{

            if(winLine && winLine.trigger){
                needSound = true;
            }

            if (needSound) {
                //$_signal.goTo("!audio.background.fadeOut");

                $_signal.goTo("!audio.lineAudio.one", winLine, this._isBigWild, resolve);
            } else {

                $_signal.goTo("!audio.background.fadeIn");
                this.getService("SoundService").stop("audio_el_wild_cycle_", null);

                resolve();
            }
        });

        if(winLine && winLine.line !== undefined){
            linesManager.showWinLine(winLine.line);
        }

        if(HelperFlags.get("justStarted") == null){
            this.showWinLineAmount(winLine);
        }

        this.requestUpdate();

        //$_signal.goTo("!audio.background.fadeIn");
        //this.getService("SoundService").stop("audio_el_wild_cycle_", null);

        let animatedSymbols = [];
        for (let i = 0; i < slotMachine.reels.length; i++){
            animatedSymbols[i] = [];
            for (let j = 0; j < slotMachine.reels[i].elements.length; j++) {
                animatedSymbols[i][j] = false;
            }
        }

        for(let j in winLine.positions) {
            let [col, row] = winLine.positions[j];
            animatedSymbols[col][row+1] = true;
        }

        return Promise.all( [soundPromise, this.showAnimatedSymbols(animatedSymbols)] );
    }

    showNextWinLine (soundOneLine = false){
        if (this.spinAction || (false&&this.quickStop) ) {
            return;
        }
        let data = this.getService("LinesService").getNextLine(HelperFlags.get("justStarted") ? LinesService.TYPE_SORT_START_TRIGGER : LinesService.TYPE_SORT_MIN_MAX);

        if (data[0]) {
            this.currentWinLine = data;

            // false - because we mute sound during cycle of line animations
            this.showWinLine([data[0], soundOneLine]).then ( () => {
                this.hideAllAnimations();
                if (this.spinAction) {
                    return;
                }
                if (data[1] === true && this.getService("LinesService").isUpdateCounter() === true) {
                    //this.getService("GameActionService").next();

                    this.promiseResolve();
                    this.promiseAllResolve();
                } else {
                    //$_signal.goTo ("!lines.showNext");
                    
                    this.showNextWinLine();
                }
            }).then(()=>{
                this.getService("SoundService").stop("audio_el_wild_cycle_", null);
                $_signal.goTo("!audio.background.fadeIn");
            });
        } else {
            //this.getService("GameActionService").next();
            this.promiseAllResolve();
            this.promiseResolve();
        }
    }

    showActiveLines () {
        let numOfActiveLines = this.getService("LinesService").getCurrentValue();

        if (fadeInterval) {
            clearInterval(fadeInterval);
            linesManager.hideAllLines();
        }

        for (let i = 1; i <= numOfActiveLines; i++) {
            linesManager.showLine(i);
        }

        this.requestUpdate();

        fadeInterval = setTimeout( () => {
            linesManager.hideAllLines();
            this.requestUpdate();
        }, 1000);
    }

    interruptAnimations () {
        if (!this.getService("FreeSpinService").isActive()) {
            this.spinAction = true;
            this.hideAllAnimations()
        }
    }

    hideAllWinLines (qs) {
        //this.quickStop = qs;
        linesManager.hideAllLines();
        this.hideAllAnimations();
        this.getService("SoundService").stop("audio_el_wild_cycle_", null);
    }

    hideAllLines () {
        linesManager.hideAllLines();
        this.requestUpdate();
    }

    hideAllAnimations() {
        let slotMachine = this.getService("SlotMachineService").getInstance();
        for (let i = 0; i < slotMachine.reels.length; i++) {
            for (let j = 1; j < slotMachine.reels[i].elements.length-1; j++) {
                slotMachine.setSymbolType(i,j,"def");
            }
        }
        linesManager.hideAllLines();

        this.hideWinLineAmount();
    }

    setTopLayoutSymbol(overhead, element, parent){

        let {x, y} = parent.localToLocal(overhead._x, overhead._y, this.getLayout("reels"));

        let container = new Container();
        container._x = x;
        container._y = y;
        //container._width = element._width;
        //container._height = element._height;

        overhead.addChild(container);

        //parent.removeChild(element);
        container.children.push(element);

        return [container, element];
    }

    showAnimatedSymbols (animatedSymbols) {
        let slotMachine = this.getService("SlotMachineService").getInstance();
        let promises = [];

        let overhead = this.getHandler("reels").getOverheadContainer();

        for (let reel = 0; reel < animatedSymbols.length; reel++) {
            for (let row = 0; row < animatedSymbols[reel].length; row++) {
                if (animatedSymbols[reel][row] !== false) {

                    let promise = new Promise ((resolve, reject) => {

                        if (slotMachine.reels[reel].bigWild) {
                            resolve();
                            return;
                        }

                        if (slotMachine.fullAtlasLoaded !== true) {
                            setTimeout(resolve, 2000);
                            return ;
                        }

                        /*let elem = slotMachine.reels[reel].children[row];
                        //elem.alpha = 0;

                        let container = null;
                        [container, elem] = this.setTopLayoutSymbol(overhead, elem, slotMachine.reels[reel]);

                        //slotMachine.reels[reel].removeChild(elem);
                        //_ems.alpha = 1;

                        try{
                            elem.content.stop();
                            elem.setSymbolType("short");

                            elem.getContent().addEventListener ("animationend", () => {

                                elem.setSymbolType("def");

                                elem.getContent().removeAllEventListeners ("animationend");
                                //elem.visible = true;
                                //elem.parent = slotMachine.reels[reel].children[row];
                                container.removeChild(elem);
                                //slotMachine.reels[reel].addChild(elem);
                                //elem.parent = slotMachine.reels[reel];
                                resolve();
                            });
                        } catch(e){
                            $_log.error(e);
                        }

                        return;*/



                        slotMachine.setSymbolType(reel, row, "short");

                        if (slotMachine.fullAtlasLoaded === true) {
                            let symbol = slotMachine.reels[reel].getElement(row);
                            //symbol.alpha = 0;
                            let tweenID = this.startTweenTarget(symbol);
                            this.tweens[reel][row] = tweenID;

                            symbol.getContent().addEventListener ("animationend", () => {
                                //symbol.alpha = 1;
                                this.endTween(tweenID);
                                this.tweens[reel][row] = null;
                                symbol.getContent().removeAllEventListeners ("animationend");
                                slotMachine.setSymbolType(reel, row, "def");
                                resolve();
                            });
                        } else {
                            setTimeout(resolve, 2000);
                        }
                    });

                    promises.push(promise);
                } else {
                    slotMachine.setSymbolType(reel, row, "disable");
                }
            }
        }

        return Promise.all (promises);
    }

    showAllWinLines () {
        //this.quickStop = false;
        let winLines = this.getService("LinesService").getWinLines();
        let slotMachine = this.getService("SlotMachineService").getInstance();
        let promises = [];
        let animatedSymbols = [];
        for (let i = 0; i < slotMachine.reels.length; i++){
            animatedSymbols[i] = [];
            for (let j = 0; j < slotMachine.reels[i].elements.length; j++) {
                animatedSymbols[i][j] = false;
            }
        }

        let isTrigger = false;
        for (let line in winLines) {
            if (winLines[line].trigger) {
                isTrigger = true;
            }
        }

        if (winLines.length === 1 && isTrigger) {
            return new Promise ((resolve, reject) => {
                resolve();
            });
        }

        //sound

        let soundPromise = new Promise((resolve, reject)=>{
            //$_signal.goTo("!audio.background.fadeOut");
            try{
                $_signal.goTo("!audio.lineAudio.max", winLines, this._isBigWild, resolve);
            } catch(e){
                reject();
            }
        });

        //$_signal.goTo("!audio.show")

        for (let line in winLines) {

            let winLine = winLines[line];

            if(winLine.line !== undefined){
                linesManager.showWinLine(winLine.line);

                for (let r in winLine.positions) {
                    let [col, row] = winLine.positions[r];
                    animatedSymbols[col][row+1] = true;
                }
            }
            this.requestUpdate();
        }

        //linesManager.disableMouseOverForLabels();

        return new Promise ((resolve, reject) => {
            Promise.all([soundPromise, this.showAnimatedSymbols(animatedSymbols)]).then (() => {
                this.hideAllWinLines();
                this.checkAnimationEnded();
                this.requestUpdate();
                //linesManager.enableMouseOverForLabels();
                resolve();
            });
        });
    }

    startSpinAction () {
        this.spinAction = true;

        if (!this.getService("ProtocolService").isAvailableReSpinGame()) {
            this.putAllOverAnimationsToReel();
        }

        this.hideAllLines();
        this.hideAllAnimations();
        linesManager.disableMouseOverForLabels();
    }

    detectBigWild () {
        let slotMachine = this.getService("SlotMachineService").getInstance();
        let winLines = this.getService("LinesService").getWinLines();
        let respinsAvailable =  this.getService("ProtocolService").isAvailableReSpinGame();

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

        if (bigWildPositions.length > 0) {
            this._isBigWild = true;
            return bigWildPositions;
        } else {
            return this._isBigWild = null;
        }
    }

    bigWildAnimation () {
        let slotMachine = this.getService("SlotMachineService").getInstance();
        let promises = [];

        let bigWildPositions = this.detectBigWild();
        if (bigWildPositions) {

            if(bigWildPositions.length > 1){
                $_signal.goTo("!settings.toolbar.fastMessage", "fast_respin_win");
            } else {
                $_signal.goTo("!settings.toolbar.fastMessage", "fast_win");
            }

            promises.push(this.getService("SoundService").playPromise("audio_el_wild_center"));

            for (let position in bigWildPositions) {
                promises.push (slotMachine.reels[bigWildPositions[position].reel].showBigWild (bigWildPositions[position].row));
            }

            Promise.all(promises).then(()=>{
                let prom = [];

                promises.push(this.getService("SoundService").playPromise("audio_el_wild_cycle_", null, {loop: true}));

                return Promise.all(prom);
            });
        } else if(this.getService("LinesService").getWinLines().length > 0) {
            $_signal.goTo("!settings.toolbar.fastMessage", "fast_win");
        }

        return Promise.all(promises);
    }

    showTriggerLine () {
        let winLines = this.getService("LinesService").getWinLines();

        return new Promise ((resolve, reject) => {
            if (winLines.length > 0 && winLines[winLines.length-1].trigger !== undefined) {
                this.showWinLine ([winLines[winLines.length-1], true]).then (() => {
                    this.hideAllWinLines();
                    resolve();
                });
            } else {
                resolve();
            }
        });

    }

    /**
     * Stop spin action and show line animation
     * @param res
     * @param rej
     * @param allRes
     */
    stopSpinAction (res, rej, allRes = () => {}) {

        this.promiseResolve = res;
        this.promiseAllResolve = allRes;
        
        this.spinAction = false;

        let winLines = this.getService("LinesService").getWinLines();

        if(HelperFlags.get("justStarted")){
            winLines = this.getService("LinesService").getWinStartTrigger();
        }

        this.showFreezScatters();

        this.bigWildAnimation().then (() => {
            if (this.spinAction) {
                return;
            }

            if (this.getService("ProtocolService").isAvailableReSpinGame()) {
                this.showAllWinLines().then(() => {
                    this.promiseResolve();
                });
                return;
            }

            if (winLines.length > 0) {

                let isTrigger = false;
                for (let line in winLines) {
                    if (winLines[line].trigger) {
                        isTrigger = true;
                    }
                }

                if (winLines.length > 2 && isTrigger || winLines.length > 1 && !isTrigger) {
                    this.showAllWinLines().then(() => {
                        if (this.spinAction) {
                            return;
                        }

                        if(this.getService("AutoPlayService").isActive()){
                            this.promiseResolve();
                        } else {
                            this.showNextWinLine();
                        }

                    });
                } else {

                    this.showNextWinLine(true);
                }

                if(!isTrigger && !this.getService("AutoPlayService").isActive()){
                    this.promiseResolve();
                }

            } else {
                linesManager.enableMouseOverForLabels();
                this.checkAnimationEnded();
                //this.getService("GameActionService").next();

                this.promiseResolve();
                this.promiseAllResolve();
            }
        });
    }

    stopAutoSpinAction () {
        this.spinAction = false;
        this.showFreezScatters();

        this.bigWildAnimation().then (() => {
            if (this.spinAction) {
                return;
            }

            this.showAllWinLines().then ( () => {
                if (this.spinAction) {
                    return;
                }

                if (this.getService("AutoPlayService").isActive()) {
                    this.showTriggerLine(). then (() => {
                        this.checkAnimationEnded();
                        this.getService("GameActionService").next();
                    });
                } else {
                    if (this.getService("ProtocolService").isAvailableReSpinGame()) {
                        this.checkAnimationEnded();
                        this.getService("GameActionService").next();
                    } else {
                        this.showNextWinLine();
                    }
                }
            });
        });
    }

    stopFreeSpinsAction (res, rej) {

        this.promiseResolve = res;

        this.spinAction = false;
        this.showFreezScatters();

        this.bigWildAnimation().then (() => {
            if (this.spinAction) {
                return;
            }

            this.showAllWinLines().then ( () => {
                if (this.spinAction) {
                    return;
                }
                this.showTriggerLine(). then (() => {
                    this.checkAnimationEnded();
                    //this.getService("GameActionService").next();

                    this.promiseResolve();
                });

            });
        });
    }

    /**
     * Stop animated respin
     */
    stopRespinAction(){
        this.spinAction = false;

        $_signal.goTo("!settings.toolbar.fastMessage", "fast_respin_more_win");

        if (this.getService("ProtocolService").isAvailableFreeSpinsInit() ||
            ( this.getService("FreeSpinService").isActive() && this.getService("FreeSpinService").getAdditionalFreeSpins() )) {
            this.hideOverSymbols ();
        } else {
            this.putAllOverAnimationsToReel();
        }

        if (this.getService("ProtocolService").isAvailableFreeSpins() || this.getService("AutoPlayService").isActive()) {
            this.showAllWinLines().then ( () => {
                if (this.spinAction) {
                    return;
                }
                this.showTriggerLine(). then (() => {
                    this.checkAnimationEnded();
                    this.getService("GameActionService").next();
                });

            });
        } else {
            let winLines = this.getService("LinesService").getWinLines();

            if (winLines.length > 0) {

                let isTrigger = false;
                for (let line in winLines) {
                    if (winLines[line].trigger) {
                        isTrigger = true;
                    }
                }

                if (winLines.length > 2 && isTrigger || winLines.length > 1 && !isTrigger) {
                    this.showAllWinLines().then(() => {
                        if (this.spinAction) {
                            return;
                        }
                        this.showNextWinLine();
                    });
                } else {
                    this.showNextWinLine();
                }

            } else {
                linesManager.enableMouseOverForLabels();
                this.checkAnimationEnded();
                setTimeout (() => {
                    this.checkAnimationEnded();
                    this.getService("GameActionService").next();
                },300);
            }
        }
    }

    showFreezScatters () {
        let respinsAvailable =  this.getService("ProtocolService").isAvailableReSpinGame();
        if (!respinsAvailable) {
            return;
        }

        let slotMachine = this.getService("SlotMachineService").getInstance();
        let spriteSheet = slotMachine.getSpriteSheet();

        for (let i = 0; i < slotMachine.reels.length; i++) {
            let reel = slotMachine.reels[i];
            for (let j = 1; j < reel.elements.length-1; j++) {
                if (reel.getElement(j).isScatter()) {
                    let scatter = new Sprite( {spriteSheet}, this.alias);
                    scatter.scaleX = scatter.scaleY = this.config.freezScatterScale;
                    scatter.framerate = CONFIG.framerate;
                    scatter.gotoAndPlay ("scatter_start");

                    this.addOverAnimation (i, j, scatter, CONFIG.positionCrunch);
                    this.showSymbolAnimationOverReels (i, j, reel.getElement(j).symbolNumber, "def");
                }
            }
        }
    }

    hideOverSymbols () {
        for (let symbol in this.overSymbols) {
            this.endTween(this.overSymbols[symbol].tweenID);
            this.getLayout().removeChild(this.overSymbols[symbol].symbol);
        }

        this.overSymbols = [];
    }

    putAllOverAnimationsToReel () {
        for (let symbol in this.overSymbols) {
            this.endTween(this.overSymbols[symbol].tweenID);
            this.getLayout().removeChild(this.overSymbols[symbol].symbol);
            this.putAnimationToReel (this.overSymbols[symbol].reel, this.overSymbols[symbol].row, this.overSymbols[symbol].symbol);
        }

        this.overSymbols = [];
    }

    putAnimationToReel (reel, row, sprite) {
        let slotMachine = this.getService("SlotMachineService").getInstance();
        let el = slotMachine.reels[reel].getElement(row);
        //let pt = el.localToLocal(el.content.x, el.content.y, this.getLayout());

        this.getLayout().localToLocal(sprite.x, sprite.y, el, sprite);

        //sprite.x = el.content.x;
        //sprite.y = el.content.y;
        el.addChild(sprite);
    }

    addOverAnimation(reel, row, sprite, positionCrunch = {x:0,y:0}) {
        let slotMachine = this.getService("SlotMachineService").getInstance();
        let el = slotMachine.reels[reel].getElement(row);


        el.localToLocal(
            el.content.x + positionCrunch.x,
            el.content.y + positionCrunch.y,
            this.getLayout(),
            sprite);

        let tweenID = this.startTweenTarget(sprite);
        this.getLayout().addChild(sprite);
        this.overSymbols.push({symbol: sprite, tweenID, reel, row});
    }

    showSymbolAnimationOverReels (reel, row, symbolNumber, type) {
        let slotMachine = this.getService("SlotMachineService").getInstance();
        let symbol = slotMachine.getSymbol(symbolNumber, type);
        this.addOverAnimation(reel, row, symbol);
    }

    hideBigWild () {

    }

    requestUpdate() {
        if (this.isCached()) {
            this.updateCache();
        }
        this.getStage().requestUpdate(this.rect, this.alias);
    }

    startTween() {
        return this.getStage().startTween(this.rect, this.alias);
    }

    endTween(id) {
        this.getStage().endTween(id);
    }

    /**
     * Subscribe to animation line ended
     * @param waitState
     */
    subscribeEnded(waitState = null){
        if(waitState && this.subscribeArrayEnded.indexOf(waitState) == -1){
            this.subscribeArrayEnded.push(waitState);
        }
    }

    /**
     * Execute subscribe elements
     */
    checkAnimationEnded(){

        if(this.subscribeArrayEnded.length > 0){

            for(let i = 0, l = this.subscribeArrayEnded.length; i < l; i++){
                $_signal.goTo(`${this.subscribeArrayEnded[i]}`);
            }

            this.clearAnimationEnded();
        }
    }

    /**
     * Clear subscribe to animation ended
     */
    clearAnimationEnded(){
        this.subscribeArrayEnded = [];
    }

    /**
     * Check for betLines, and enables userInput on betline indicators
     */
    checkBetLinesShow () {
        if (this.getService("LinesService").getWinLines().length > 0){
            linesManager.disableMouseOverForLabels();
        } else {
            linesManager.enableMouseOverForLabels();
        }
    }

    /**
     * Disabled hover labels
     */
    disableBetLinesShow(){
        linesManager.disableMouseOverForLabels();
    }

    /**
     * Just enables userInput on betline indicators
     */
    enableBetLinesShow () {
        linesManager.enableMouseOverForLabels();
    }
}