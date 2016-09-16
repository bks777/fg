import Bitmap from "./Bitmap.es6.js"
import Reel from "./Reel.es6";
import Container from "./Container.es6";
//import ReelSymbol from "./ReelSymbol.es6";
import SlotMachineService from "../services/slotMachineService.es6.js";
//import {Container, Reel, ReelSymbol} from "./Core.es6";

export default class SlotMachine extends Container {

    static get STATE_STOP () {      return 1;   }
    static get STATE_STARTING () {  return 2;   }
    static get STATE_RUN () {       return 3;   }
    static get STATE_STOPPING () {  return 4;   }
    static get STATE_FINISHING () { return 5;   }
    static get STATE_NEED_FINISH(){ return 6;   }
    static get STATE_NEED_START (){ return 7;   }

    constructor (config, alias = null) {
        super(config);

        new SlotMachineService().setInstance(this);

        this.config = {};
        Object.assign(this.config, config);



        this.quickMode = false;

        this.config.alias = this.config.defaultReel.alias = alias;

        this.reels = [];

        this.state = SlotMachine.STATE_STOP;

        this._superDelayBetweenReelsStop = 0;
        this.skipReelWait = null;
        this._skipCurrentTimeoutWait = null;

        this.timerStopReels = [];

        /*
        this.enableCrop();
        */

        this.initSpriteSheet();
        this.initReels();
    }

    enableCrop () {
        var maskShape = new Shape();
        maskShape.graphics.drawRect(this.x-100, this.y-50, this.width+200, this.height+90);
        this.mask = maskShape;
    }

    initSpriteSheet () {

        this.fullAtlasLoaded = true;

        if(HelpersCheckBrowser.detect().firefox !== undefined){

            this.config.atlas.images = this.config.atlas.images.map ((src) => {
                 let image = $_required.getImageRawData(src, this.config.alias);
                 let canvas = document.createElement("canvas");
                 canvas.width = image.width;
                 canvas.height = image.height;
                 let ctx = canvas.getContext("2d");

                 ctx.drawImage(image, 0, 0, image.width, image.height);

                 return canvas;
             });
        }

        this.config.spriteSheet = new SpriteSheet(this.config.atlas, this.config.alias);
        this.config.defaultReel.spriteSheet = this.config.spriteSheet;

        /* this need for initialize big full atlas while loading. Otherwise will be bug during first spin */
        let symbol = this.getSymbol(1, "short");
        symbol.alpha = 0.01;
        this.addChild(symbol);
        this.addEventListener ("added", () => {

            this.stage.update();
            setTimeout( () => {
                this.removeChild(symbol);
            },20);
        });

        /* end */
    }

    getSpriteSheet () {
        return this.config.spriteSheet;
    }

    getSymbol (number, type="def") {
        let symbol = new Sprite ({spriteSheet: this.config.spriteSheet}, this.alias);

        if (this.config.defaultReel.symbolTypes[type].framerate !== undefined) {
            symbol.framerate = this.config.defaultReel.symbolTypes[type].framerate;
        }

        if (this.config.defaultReel.symbolTypes[type].scale !== undefined && this.fullAtlasLoaded) {
            symbol.scaleX = symbol.scaleY = this.config.defaultReel.symbolTypes[type].scale;
        } else {
            symbol.scaleX = symbol.scaleY = 1;
        }

        symbol.symbolID = number;

        symbol.gotoAndPlay (`${type}_${number}`);

        return symbol;

    }

    enableQuickMode () {
        this.quickMode = true;
        for (let reel in this.reels) {
            this.reels[reel].quickMode = true;
        }
    }

    disableQuickMode () {
        this.quickMode = false;
        for (let reel in this.reels) {
            this.reels[reel].quickMode = false;
        }
    }

    /**
     * Is enable quick mode
     * @returns {boolean}
     */
    isEnableQuickMode(){
        return this.quickMode;
    }

    /**
     * Is enabled once quick mode
     * @returns {boolean}
     */
    isEnableOnceFastStop(){
        return this.onceFastStop;
    }

    initReels () {

        for (let reel in this.config.reels) {
            this.addReel(this.config.reels[reel]);
        }
    }

    addReel (config) {

        let reelConfig = Object.assign ({}, this.config.defaultReel, config);

        let reel = new Reel(reelConfig);
        let x = 0;

        if (reelConfig.left === "auto") {
            for (let r in this.reels) {
                x += this.reels[r].config.width + this.config.distanceBetweenReels;
            }
        } else {
            x = reelConfig.left;
        }

        reel.x = x;
        reel.y = reelConfig.top;
        reel.setAnimation(reelConfig.animation);

        reel.number = this.reels.length;


        this.addChild(reel);
        this.reels.push(reel);

    }

    getReelAutoX (reel) {
        let x = 0;
        for (let i = 0; i < Math.min(reel, this.reels.length); i++) {
            x += this.reels[i].config.width + this.config.distanceBetweenReels;
        }
        return x;
    }

    /**
     * Stop reels with mode slipping
     * @param values
     * @param reelsSlipping
     * @param reelsEventStart
     * @param reelsEventEnd
     * @param reelsEventStopped
     * @returns {Promise}
     */
    stopReels (values, reelsSlipping = [], reelsEventStart = [], reelsEventEnd = [], reelsEventStopped = []) {
        return new Promise ( (resolve, reject) => {

            this._delayBetweenReelsStop = (this.quickMode ? this.config.quickMode.delayBetweenReelsStop : (this.config.delayBetweenReelsStop !== undefined ? this.config.delayBetweenReelsStop : 0) );

            /* stop with delay */
            this.state = SlotMachine.STATE_STOPPING;

            this._skipCurrentTimeoutWait = null;

            let i = 0;

            let reelsStopped = 0;
            let stopThreadCallback = (callback = stopThreadCallback)=>{
                if (i > this.reels.length-1){
                    return;
                }

                /**
                 * Stop reel
                 * @private
                 */
                const _stopReel = () => {

                    let last = i;
                    this.reels[i].stop(values[i])
                        .then (() => {

                            if(reelsEventStopped[last] && typeof reelsEventStopped[last] == "function"){
                                reelsEventStopped[last]();
                            }

                            reelsStopped++;

                            if (reelsStopped === this.reels.length) {
                                this.state = SlotMachine.STATE_STOP;
                                if (this.onceFastStop) {
                                    this.disableQuickMode();
                                    this.onceFastStop = false;
                                }
                                resolve();
                            }
                        })
                        .catch((rejection) => {
                            reject(rejection);
                        });

                    i++;
                    if (callback){
                        setTimeout(callback, this._delayBetweenReelsStop);
                    }
                };

                if(this.skipReelWait || this.quickMode || this.onceFastStop || reelsSlipping[i] == undefined || reelsSlipping[i] === 0){
                    _stopReel();

                    if(reelsEventEnd[i] && typeof reelsEventEnd[i] == "function"){
                        reelsEventEnd[i]();
                    }
                } else {

                    if(reelsEventStart[i] && typeof reelsEventStart[i] == "function"){
                        reelsEventStart[i]();
                    }

                    /**
                     * Stop Reel Wait
                     * @private
                     */
                    const _stopReelWait = () => {

                        _stopReel();

                        if(reelsEventEnd[i] && typeof reelsEventEnd[i] == "function"){
                            reelsEventEnd[i]();
                        }

                        this._skipCurrentTimeoutWait = null;
                    };

                    let _timer = setTimeout(_stopReelWait, reelsSlipping[i]);
                    this._skipCurrentTimeoutWait = [_timer, _stopReelWait];
                }
            };

            setTimeout(stopThreadCallback, this._delayBetweenReelsStop );
        });

    };

    /**
     * Stop reels with mode slipping
     * @param values
     * @param reelsSlipping
     * @param reelsEventStart
     * @param reelsEventEnd
     * @returns {Promise}
     */
    stopReelsWaitLast (values, reelsSlipping = [], reelsEventStart = [], reelsEventEnd = []) {
        return new Promise ( (resolve, reject) => {

            this._delayBetweenReelsStop = (this.quickMode ? this.config.quickMode.delayBetweenReelsStop : (this.config.delayBetweenReelsStop !== undefined ? this.config.delayBetweenReelsStop : 0) );

            /* stop with delay */
            this.state = SlotMachine.STATE_STOPPING;

            this._skipCurrentTimeoutWait = null;

            let i = 0;

            let rangeCounter = array_range(0, values.length, 1);

            let successivelyWait = [];

            let reelsStopped = 0;
            let stopThreadCallback = (callback = stopThreadCallback)=>{

                if(rangeCounter.length == 0){
                    return ;
                }

                i = rangeCounter.shift();

                /**
                 * Stop reel
                 * @param _i
                 * @private
                 */
                const _stopReel = (_i) => {

                    this.reels[_i].stop(values[_i])
                        .then (() => {
                            reelsStopped++;

                            if (reelsStopped === this.reels.length) {
                                this.state = SlotMachine.STATE_STOP;
                                if (this.onceFastStop) {
                                    this.disableQuickMode();
                                    this.onceFastStop = false;
                                }
                                resolve();
                            }
                        })
                        .catch((rejection) => {
                            reject(rejection);
                        });

                    if (callback){
                        setTimeout(callback, this._delayBetweenReelsStop);
                    }
                };

                if(reelsEventStart[i] && typeof reelsEventStart[i] == "function"){
                    reelsEventStart[i]();
                }

                if(this.skipReelWait || this.quickMode || this.onceFastStop || reelsSlipping[i] == undefined || reelsSlipping[i] === 0){
                    _stopReel(i);

                    if(reelsEventEnd[i] && typeof reelsEventEnd[i] == "function"){
                        reelsEventEnd[i]();
                    }
                } else {


                    if(successivelyWait.indexOf(i) == -1){

                        successivelyWait.push(i);
                        rangeCounter.push(i);

                        setTimeout(stopThreadCallback, 0);//this._delayBetweenReelsStop );
                    } else {

                        const _stopReelWait = () => {
                            i = successivelyWait.shift();

                            _stopReel(i);

                            if(reelsEventEnd[i] && typeof reelsEventEnd[i] == "function"){
                                reelsEventEnd[i]();
                            }

                            this._skipCurrentTimeoutWait = null;
                        };

                        let _timer = setTimeout(_stopReelWait, reelsSlipping[i]);
                        this._skipCurrentTimeoutWait = [_timer, _stopReelWait];
                    }
                }
            };

            setTimeout(stopThreadCallback, this._delayBetweenReelsStop );
        });

    };

    /**
     * Skip wait reels
     * @private
     */
    _skipReelWait(){

        if(this._skipCurrentTimeoutWait !== null){
            let [timer, func] = this._skipCurrentTimeoutWait;
            func();
            clearTimeout(timer);

            this._skipCurrentTimeoutWait = null;
        }
    }

    needFastStop () {

        if (!this.quickMode) {
            this._delayBetweenReelsStop = this.config.quickMode.delayBetweenReelsStop;
            this.enableQuickMode();
            this.onceFastStop = true;
        }

        this._skipReelWait();
    }

    fastStop (values, fromReel = 0){
        return new Promise ( (resolve, reject) => {
            this.state = SlotMachine.STATE_STOPPING;
            for (let i = fromReel; i <this.reels.length-1; i++){
                this.reels[i].stop(values[i])
                    .catch((rejection) => {
                        $_log.error(rejection);
                    });
            }
            this.reels[this.reels.length-1].stop(values[this.reels.length-1])
                .then ( () => {
                    this.state = SlotMachine.STATE_STOP;
                    if (this.onceFastStop) {
                        this.disableQuickMode();
                        this.onceFastStop = false;
                    }
                    resolve();
                })
                .catch((rejection) => {
                    $_log.error(rejection);
                });
        });

    }

    startReels() {
        if (this.state === SlotMachine.STATE_STOP) {

            this.state = SlotMachine.STATE_STARTING;

            let delayBetweenReelsStart = (this.quickMode ? this.config.quickMode.delayBetweenReelsStart : this.config.delayBetweenReelsStart);

            if (delayBetweenReelsStart !== 0 && delayBetweenReelsStart !== undefined) {
                /* start with delay */
                let i = 0;
                let startThread = setInterval(() => {
                    this.reels[i].start();
                    i++;
                    if (i === this.reels.length) {
                        this.state = SlotMachine.STATE_RUN;
                        clearInterval(startThread);
                    }
                }, delayBetweenReelsStart);

            } else {
                /* momentum start */
                this.state = SlotMachine.STATE_STARTING;
                for (let i = 0; i < this.reels.length; i++) {
                    this.reels[i].start();
                }
                this.state = SlotMachine.STATE_RUN;
            }

            this.stage.requestUpdate();

        }

    }

    setSymbol (reel, row, symbol, symbolType) {
        this.reels[reel].setSymbol (row, symbol, symbolType);
    }

    setSymbolType (reel, row, symbolType) {
        this.reels[reel].setSymbolType (row, symbolType);
    }

    setSymbols (symbols) {
        for (let i = 0; i < symbols.length; i++) {
            for (let j = 0; j < symbols[i].length; j++) {
                this.reels[i].setSymbol (j+1, symbols[i][j]);
            }
        }
    }

    isRunning () {
        return this.state !== SlotMachine.STATE_STOP;
    }

/*
    tick (event) {
        if (!createjs.Ticker.getPaused()) {
            this.updateCache();
            //this.update(event);
        }
    };*/
}

