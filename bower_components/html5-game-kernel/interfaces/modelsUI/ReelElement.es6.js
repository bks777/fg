import {Container, Bitmap, Sprite, Reel} from "./Core.es6";

export default class ReelElement extends Container {
    //constructor (symbolNumber, symbolType, configOfSymbol, configOfSymbolTypes, componentAlias, spriteSheet) {

    //this.config.symbols[num], this.config.symbolTypes, this.config.alias, this.config.spriteSheet

    constructor (symbolNumber, symbolType, reelConfig) {
        super();

        symbolType = this.correctSymbolType (symbolType);

        this.symbolNumber = symbolNumber;
        this.symbolType = symbolType;
        this.imageAlias = this.getImageAlias(symbolNumber, symbolType);
        this.componentAlias = reelConfig.alias;
        this.configOfSymbolTypes = reelConfig.symbolTypes;
        this.configOfSymbol = reelConfig.symbols[symbolNumber];
        this.spriteSheet = reelConfig.spriteSheet;
        this.allowedSymbolTypes = reelConfig.allowedSymbolTypes;

        this._addContent();
    }

    _addContent () {

        let spriteConfig = {
            spriteSheet: this.spriteSheet
        };

        this.content = new Sprite (spriteConfig, this.componentAlias);
        this.content.spriteSheet = this.spriteSheet;
        this.content.name = "content";

        this.applyContentConfig();

        this.addChild(this.content);

        this.content.gotoAndPlay (this.imageAlias);

        this.setContentToCenter();
    }

    setSpriteSheet (spriteSheet) {
        this.content.dispatchEvent("animationend");
        this.content.stop();
        this.spriteSheet = spriteSheet;
        this.content.spriteSheet = spriteSheet;


        this.applyContentConfig();

        this.content.gotoAndStop(this.imageAlias);

    }

    getSymbolName () {
        return this.configOfSymbol.name;
    }

    isWild () {
        //if([10,11,12].indexOf(this.symbolNumber) != -1) return true;
        return this.getSymbolName () === "wild";
    }

    isScatter () {
        return this.getSymbolName () === "scatter";
    }

    isBonus () {
        return this.getSymbolName () === "bonus";
    }

    setSymbol (symbolNumber, configOfSymbol, symbolType = "def") {

        symbolType = this.correctSymbolType (symbolType);

        if (symbolNumber !== undefined && symbolNumber !== this.symbolNumber) {
            this.imageAlias = this.getImageAlias (symbolNumber, symbolType);
            this.symbolNumber = symbolNumber;
            this.configOfSymbol = configOfSymbol;
        }
        this.setSymbolType(symbolType);
    }

    correctSymbolType (symbolType) {
        if (this.allowedSymbolTypes) {
            let currentAction = $_services.getService ("ProtocolService").getCurrentAction();

            if (this.allowedSymbolTypes[currentAction]){
                symbolType = this.allowedSymbolTypes[currentAction][symbolType];
            } else if (this.allowedSymbolTypes["default"]) {
                symbolType = this.allowedSymbolTypes["default"][symbolType];
            }
        }

        return symbolType;
    }

    getImageAlias (symbolNumber, symbolType) {



        return `${symbolType}_${symbolNumber}`;
    }

    setSymbolType (symbolType) {

        symbolType = this.correctSymbolType (symbolType);

        this.content.stop();

        this.symbolType = symbolType;
        this.imageAlias = this.getImageAlias(this.symbolNumber, symbolType);
        this.content.gotoAndPlay(this.imageAlias);

        this.applyContentConfig();

        this.setContentToCenter();
    }

    applyContentConfig () {
        if (this.configOfSymbolTypes[this.symbolType] === undefined) {
            this.content.scaleX = this.content.scaleY = 1;
            return;
        }

        if (this.configOfSymbolTypes[this.symbolType].framerate !== undefined) {
            this.content.framerate = this.configOfSymbolTypes[this.symbolType].framerate;
        }

        if (this.configOfSymbolTypes[this.symbolType].scale !== undefined) {
            this.content.scaleX = this.content.scaleY = this.configOfSymbolTypes[this.symbolType].scale;
        } else {
            this.content.scaleX = this.content.scaleY = 1;
        }
    }

    getContent () {
        return this.content;
    }

    setContentToCenter () {

        let index = this.content.spriteSheet.getAnimation(`def_${this.symbolNumber}`).frames[0];
        let rect = this.content.spriteSheet.getFrameBounds (index);

        let scale = this.configOfSymbolTypes["def"].scale;

        this.content.x = (this._width - rect.width*scale)/2 - rect.x*scale;
        this.content.y = (this._height - rect.height*scale)/2 - rect.y*scale;

        if (this.configOfSymbol.topCorrection) {
            this.content.y += this.configOfSymbol.topCorrection;
        }

        if (this.configOfSymbol.leftCorrection) {
            this.content.x += this.configOfSymbol.leftCorrection;
        }
    }

    set width(width) {
        this._width = width;
        this.setContentToCenter();
    }

    get width () {
        return this._width;
    }

    set height(height) {
        this._height = height;
        this.setContentToCenter();
    }

    get height () {
        return this._height;
    }

}