import Container from "./Container.es6";
import ReelElement from "./ReelElement.es6";
import Shape from "./Shape.es6";
import ReelsAnimationsCollection from "./ReelsAnimationsCollection.es6";

export default class Reel extends Container {

    static get STATE_STOP () {      return 1;   }
    static get STATE_STARTING () {  return 2;   }
    static get STATE_RUN () {       return 3;   }
    static get STATE_STOPPING () {  return 4;   }
    static get STATE_FINISHING () { return 5;   }
    static get STATE_NEED_FINISH(){ return 6;   }
    static get STATE_NEED_START (){ return 7;   }

    constructor (config) {
        super();

        this.config = config;
        this.stoppedRows = 0;
        this.values = [];
        this.elements = [];
        //this.velocity = this.config.speed;
        //console.log("!!!!!",this.velocity, this.config.speed);//(0.5 + this.config.speed/this.config.fps) | 0; /*round it*/
        this.state = Reel.STATE_STOP;
        this.quickMode = false;
        this.intrigueMode = false;
        this.bigWild = null;

        this._slotMachine = $_services.getService("SlotMachineService");

        this.init();

        this.setAnimation (this.config.animation);

            /*var maskShape = new Shape();
            maskShape.graphics.drawRect(0,0,this.config.width, this.config.height);
            //maskShape.graphics.drawRect(this.x,this.y,this.params.reelWidth,this.params.reelHeight);
            this.mask = maskShape;*/

    }

    /**
     * Get paused
     * @returns {boolean|*}
     */
    getPaused (){
        return this._slotMachine.getPaused();
    }


    init () {
        for (var i = 0; i < this.config.numOfRows; i++) {
            var el = this.createRandomElement();
            el.x = 0;
            el.y = (i-1)*(this.config.rowHeight + this.config.distanceBetweenRows);
            this.addChild(el);
            this.elements.push(el);

            if (i > 0 && i < this.config.numOfRows-1) {
                el.cursor = "pointer";
            }
        }

        this.addEventListener("tick", this.reelTick.bind(this));
    };

    setAnimation (animationType = "standard") {
        if (ReelsAnimationsCollection[animationType] !== undefined) {
            this.mainLoop = ReelsAnimationsCollection[animationType].bind(this);
            this.animationType = animationType;
        } else {
            this.mainLoop = ReelsAnimationsCollection.standard.bind(this);
            this.animationType = "standard";
        }
    }

    nextElement () {
        let newEl;
        let type = "def";
        if (this.state === Reel.STATE_RUN) {
            type = "blur";
        }
        if (this.state === Reel.STATE_STOPPING) {
            newEl = this.createElement(this.values[this.stoppedRows], type);
            if (this.stoppedRows > 0 && this.stoppedRows < this.elements.length) {
                newEl.cursor = "pointer";
            }
            this.stoppedRows++;
            if (this.stoppedRows > this.numChildren) {
                this.state = Reel.STATE_NEED_FINISH;
                this.stoppedRows = 0;
            }
        } else {
            newEl = this.createRandomElement(type);
        }

        return newEl;
    }

    reelTick (event) {

        if(this.getPaused()){
            return ;
        }

        this.mainLoop (event);

        if (this.state === Reel.STATE_RUN && this.needBlur) {

            for (let i = 0; i < this.elements.length; i++) {
                this.elements[i].setSymbolType("blur");
            }

            this.needBlur = false;
            this.needDefaultSymbols = true;
        }

        if ( this.needDefaultSymbols && (this.state === Reel.STATE_NEED_FINISH || this.state === Reel.STATE_FINISHING || this.state === Reel.STATE_STOP) ) {

            for (let i = 0; i < this.elements.length; i++) {
                this.elements[i].setSymbolType("def");
            }

            this.needDefaultSymbols = false;
        }
    };

    getAllowedRandomSymbol () {
        let imgNum, allowedSymbols = [];

        let gameType = "spins";
        if ($_services.getService("ProtocolService").isAvailableFreeSpins()) {
            gameType = "freespins";
        }

        if (this.config.allowedSymbols[gameType]) {
            allowedSymbols = this.config.allowedSymbols[gameType];
        } else {
            for (let i = 0; i < this.config.numOfSymbols; i++) {
                allowedSymbols.push (i+1);
            }
        }

        let index = Math.floor (Math.random() * allowedSymbols.length );
        imgNum = allowedSymbols[index];

        return imgNum;
    }

    createRandomElement (type) {
        let imgNum = this.getAllowedRandomSymbol();
        return this.createElement (imgNum, type);
    };

    createElement (num, type = this.config.defaultTypeOfSymbol) {

        if (this.config.symbols[num] === undefined) {
            $_log.error (`There is no symbol=${num}. Using symbol = 1`);
            num = 1;
        }

        if (this.config.symbols[num].types.indexOf(type) < 0) {
            $_log.error (`There is no type=${type} for symbol=${num}. Using default type`);
            type = this.config.defaultTypeOfSymbol;
        }

        //var el = new ReelElement (num, type, this.config.symbols[num], this.config.symbolTypes, this.config.alias, this.config.spriteSheet);
        var el = new ReelElement (num, type, this.config);

        el.width = this.config.width;
        el.height = this.config.rowHeight;

        el.enableClickableBackground();

        el.addEventListener ("click", () => {
            if (!this.isRunning() && this.bigWild === null &&
                Math.round(el.y) >= 0 && Math.round(el.y) + el.height <= this.config.height) {

                let reverse = false;
                if (this.parent.reels.length-1 === this.number) {
                    reverse = true;
                }
                $_event.setEvent ("showMiniPaytable", {reelElement: el, reverse});
            }
        });

        //el.cursor = "pointer";

        return el;
    };

    setSymbol (row, symbol, symbolType) {
        if (!this.bigWild) {
            this.getElement(row).setSymbol(symbol, this.config.symbols[symbol], symbolType);
        }
    }

    setSymbolType (row, symbolType) {
        if (!this.bigWild) {
            this.getElement(row).setSymbolType(symbolType);
        }
    }

    setSpriteSheet (spriteSheet) {
        this.config.spriteSheet = spriteSheet;

        for (let element in this.elements) {
            this.elements[element].setSpriteSheet(spriteSheet);
        }

        if (this.bigWild) {
            this.bigWild.spriteSheet = spriteSheet;
            this.bigWild.gotoAndPlay("wild_cycle");
            if (this.config.bigWild.scale) {
                this.bigWild.scaleX = this.bigWild.scaleY = this.config.bigWild.scale;
            }
        }
    }

    showStaticBigWild (row) {
        if (!this.config.bigWild.enable) {
            return;
        }
        if (this.bigWild) {
            return;
        }
        this.bigWild = new Sprite({spriteSheet: this.config.spriteSheet}, this.config.alias);
        this.bigWild.stop();
        if (this.config.bigWild.framerate) {
            this.bigWild.framerate = this.config.bigWild.framerate;
        }

        if (this.config.bigWild.scale && this.parent.fullAtlasLoaded) {
            this.bigWild.scaleX = this.bigWild.scaleY = this.config.bigWild.scale;
        } else {
            this.bigWild.scaleX = this.bigWild.scaleY = 1;
        }

        let el = this.getElement(row);

        el.addChild(this.bigWild);
        this.bigWild.y = this.getElement(1).localToLocal (0,0,el).y;

        for (let i = 1; i < this.elements.length-1; i++) {
            this.getElement(i).getContent().visible = false;
        }
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].cursor = "";
        }

        this.bigWild.gotoAndPlay("wild_cycle");
    }

    showBigWild (row) {
        if (!this.config.bigWild.enable) {
            return;
        }

        if (this.bigWild) {
            return;
        }

        this.bigWild = new Sprite({spriteSheet: this.config.spriteSheet}, this.config.alias);
        this.bigWild.stop();
        if (this.config.bigWild.framerate) {
            this.bigWild.framerate = this.config.bigWild.framerate;
        }

        if (this.config.bigWild.scale && this.parent.fullAtlasLoaded) {
            this.bigWild.scaleX = this.bigWild.scaleY = this.config.bigWild.scale;
        } else {
            this.bigWild.scaleX = this.bigWild.scaleY = 1;
        }

        let el = this.getElement(row);

        el.addChild(this.bigWild);

        let startPosition = (el.height - this.bigWild.height) / 2;
        if (this.config.bigWild.topCorrection !== undefined) {
            startPosition += this.config.bigWild.topCorrection;
        }

        let endPosition = this.getElement(1).localToLocal (0,0,el).y;
        let path = (endPosition - startPosition);

        this.bigWild.y = startPosition;

        createjs.Tween
            .get(this.bigWild)
            .to({y: endPosition*0.8}, 529 * 0.5)
            .to({y: endPosition*0.9}, 185 * 0.5)
            .to({y: endPosition}, 153 * 0.5);

        for (let i = 1; i < this.elements.length-1; i++) {
            this.getElement(i).getContent().visible = false;
        }

        this.bigWild.gotoAndPlay("wild_center");

        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].cursor = "";
        }

        return new Promise ((resolve, reject) => {
            const endHandler = () => {
                if (!this.bigWild || this.bigWild.currentAnimation !== "wild_center_3") {
                    return;
                }

                this.bigWild.removeEventListener("animationend", endHandler);
                resolve();
            };

            this.bigWild.addEventListener ("animationend", endHandler);
        });
    }

    stop (values) {
        if (this.state === Reel.STATE_STARTING) {
            return new Promise ((resolve, reject) => {
                setInterval (() => {
                    if (this.state !== Reel.STATE_STARTING) {
                        resolve();
                    }
                },50);

                /*setTimeout(() => {
                    reject(new Error("Reel doesn't stop during 10 sec"));
                },10000);*/
            }).then (() => {
                return this._stop(values);
            });

        } else {
            return this._stop(values);
        }
    };

    _stop (values) {
        return new Promise ((resolve, reject) => {
            //let first = Math.floor(Math.random() * (this.config.numOfSymbols))+1;
            //let last = Math.floor(Math.random() * (this.config.numOfSymbols))+1;

            let first = this.getAllowedRandomSymbol();
            let last = this.getAllowedRandomSymbol();

            values = getClone(values);
            values = (this.animationType === "reverse" ? values : values.reverse());
            this.values = [first, ...values, last];
            this.state = Reel.STATE_STOPPING;

            let detectStopInterval = setInterval(() => {
                if (this.state === Reel.STATE_STOP) {

                    if (this.bigWild && this.bigWild.parent.parent === null) {
                        this.bigWild = null;
                    }

                    clearInterval(detectStopInterval);

                    $_event.setEvent ("reelStopped", this.number);

                    resolve();
                }
            }, 50);

           /* setTimeout(() => {
                reject(new Error("Reel doesn't stop during 10 sec"));
            },10000);*/
        });
    }

    start () {
        this.state = Reel.STATE_NEED_START;
        this.needBlur = true;

        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].cursor = "";
        }
        //this.needDefaultSymbols = true;
    }

    getElement (i) {
        //if (i < 1 || i > this.config.numOfRows-2) i = 1;
        return this.elements[i];
    }

    isRunning () {
        return this.state !== Reel.STATE_STOP;
    }

    set width (width) {
        this.config.width = width;

        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].width = width;
        }
    }

    get width () {
        return this.config.width;
    }

    get height () {
        return this.config.height;
    }

}

