import ViewCanvasHandler from "./../../../../bower_components/html5-game-kernel/views/interfaces/ViewCanvasHandler.es6.js";

import config from "./config.js";
import {numbersSmallSpriteSheet} from "../../../CommonComponents/BonusGame/viewHandler/elements/numbersSpriteSheet.js"
import paytableAtlasSpriteSheet from "./paytableAtlasSpriteSheet";

import Mummy from "../../../CommonComponents/BonusGame/viewHandler/elements/mummy.js";

/**
 * Paytable Desktop View Handler
 * @constructor
 */
export default class PaytableDesktopViewHandler extends ViewCanvasHandler {
    constructor(data = {}) {
        super(data);
    }

    initHandler () {
        this.initLayout(config);

        this.slideTime = 450;

        this.infoPopup = new Container ();
        this.infoPopup.width = 960;// this.getGameContainer().width;
        this.infoPopup.name = "info";
        this.initChildrenContainer(this.infoPopup, config.infoPopup.children);


        this.miniPaytablePopup = new Container();
        this.miniPaytablePopup.name = "miniPaytable";
        this.initChildrenContainer(this.miniPaytablePopup, config.miniPaytablePopup.children);

        this.getLayout().addChild(this.miniPaytablePopup);

        this.initPages();
        this.initButtons();
        //this.initAlphaMask();
        this.initMiniPaytable ();

        //this.show();
        //this.setCurrentPage(3);
        //this.goToStartPosition();
    }

    initMiniPaytable () {
        let slotMachine = this.getService("SlotMachineService").getInstance();

        let symbol = slotMachine.getSymbol(1);
        symbol.name = "symbol";

        let symbolContainer = this.querySelectorContainer("symbolContainer", this.miniPaytablePopup);

        symbolContainer.addChild (symbol);

        this.miniPaytablePopup.getChildByName("background").addEventListener ("click", () => {
            this.hideMiniPaytable();
        });

        this.miniPaytablePopup.visible = false;
    }

    showMiniPaytable (data) {

        this.hideMiniPaytable();

        if (this.miniPaytableTimeout) {
            clearTimeout(this.miniPaytableTimeout);
            this.hideMiniPaytable();
            this.miniPaytableTimeout = null;
        }

        this.getService("SoundService").play("audio_mini_paytable");

        let {reelElement} = data;
        let symbolID = reelElement.symbolNumber;

        let symbol = this.querySelectorContainer("symbol", this.miniPaytablePopup);

        reelElement.localToLocal(0, 0, this.getLayout(), this.miniPaytablePopup);
        symbol.x = reelElement.content.x - config.miniPaytablePopup.correctionLeft;
        symbol.y = reelElement.content.y - config.miniPaytablePopup.correctionTop;

        symbol.gotoAndStop ("def_"+symbolID);

        this.miniPaytablePopup.x += config.miniPaytablePopup.correctionLeft;
        this.miniPaytablePopup.y += config.miniPaytablePopup.correctionTop;

        let miniPopup = this.querySelectorContainer("symbolContainer", this.miniPaytablePopup);

        let symbols = this.getService ("PayTableService").getPayTable();

        if (reelElement.isScatter()) {
            let scatterDescription = this.querySelectorContainer("scatterDescription", this.miniPaytablePopup);
            scatterDescription.visible = true;
            if (data.reverse) {
                scatterDescription.x = 20;
            } else {
                scatterDescription.x = this.miniPaytablePopup.width/2;
            }

        } else if (reelElement.isWild() || [10,11,12].indexOf(reelElement.symbolNumber) != -1) {
            let wildDescription = this.querySelectorContainer("wildDescription", this.miniPaytablePopup);
            wildDescription.visible = true;
            if (data.reverse) {
                wildDescription.x = 20;
            } else {
                wildDescription.x = this.miniPaytablePopup.width/2;
            }

        } else if (reelElement.isBonus()) {
            let bonusDescription = this.querySelectorContainer("bonusDescription", this.miniPaytablePopup);
            bonusDescription.visible = true;

            if (data.reverse) {
                bonusDescription.x = 20;
            } else {
                bonusDescription.x = this.miniPaytablePopup.width/2;
            }

        } else {

            let type = "def";
            let simpleSymbolDescription = this.querySelectorContainer("simpleSymbolDescription", this.miniPaytablePopup);

            if(symbols[symbolID].length > 3){
                let type = "rich";
                simpleSymbolDescription = this.querySelectorContainer("richSymbolDescription", this.miniPaytablePopup);
            }

            simpleSymbolDescription.visible = true;

            let shadow = this.querySelectorContainer("shadow", simpleSymbolDescription);

            if (data.reverse) {
                simpleSymbolDescription.x = 20;
                shadow.scaleX = -1;
                shadow.x = 236;
            } else {
                simpleSymbolDescription.x = this.miniPaytablePopup.width * 0.5;
                shadow.scaleX = 1;
                shadow.x = -66;
            }

            for (let i = 0; i < symbols[symbolID].length; i++) {
                let occurrences = symbols[symbolID][i].occurrences;
                let label = this.querySelectorContainer(`x${occurrences}`, simpleSymbolDescription);
                let value = this.querySelectorContainer(`x${occurrences}Value`, simpleSymbolDescription);
                let v = symbols[symbolID][i].multiplier.toString();
                value.text = v;

                if(!this.sizeLeftText){
                    this.sizeLeftText = {};
                }

                if(this.sizeLeftText[type] == undefined){
                    this.sizeLeftText[type] = [label.x, value.x];
                }

                if (data.reverse) {
                    label.x = 50;
                    value.x = 100;
                } else {
                    [label.x, value.x] = this.sizeLeftText[type];
                }
            }
        }

        miniPopup.x = 0;

        if (data.reverse) {
            this.miniPaytablePopup.x -= this.miniPaytablePopup.width - (miniPopup.width / 1.3);
            miniPopup.x = this.miniPaytablePopup.width - (miniPopup.width / 1.3);
        } else {
            miniPopup.x = 0;
        }

        this.miniPaytablePopup.visible = true;
        this.miniPaytablePopup.alpha = 1;
        createjs.Tween.removeTweens(this.miniPaytablePopup);

        this.miniPaytableTimeout = setTimeout (() => {
            this.hideMiniPaytable();
            this.miniPaytableTimeout = null;
        },2000);
    }

    hideMiniPaytable () {
        this.querySelectorContainer("simpleSymbolDescription", this.miniPaytablePopup).visible = false;
        this.querySelectorContainer("richSymbolDescription", this.miniPaytablePopup).visible = false;
        this.querySelectorContainer("scatterDescription", this.miniPaytablePopup).visible = false;
        this.querySelectorContainer("wildDescription", this.miniPaytablePopup).visible = false;
        this.querySelectorContainer("bonusDescription", this.miniPaytablePopup).visible = false;

        createjs.Tween
            .get (this.miniPaytablePopup, {override: true})
            .to ({alpha: 0, visible: false}, 200)
            .to ({alpha: 1}, 0);
    }

    initPaytableData() {
        let paytableContainer = this.querySelectorContainer("paytable", this.infoPopup);

        let table = new Container();
        table.name = "table";
        table.width = 840;
        table.height = 201;
        let grid = [];

        //let multiplierScale = 0.5;
        let valueScale = 0.95;
        let imageScale = 0.5;
        let firstColWidth = 44;
        let firstRowHeight = 87;
        let bottomPadding = 10;

        let numOfSymbols,
            numOfCols;
        numOfCols = numOfSymbols = 9;
        let numOfRows = 4;

        paytableContainer.addChild(table);
        paytableContainer.setChildAlign("center", table);
        paytableContainer.setChildTop(table, 140);


        for (let i = 0; i <= numOfCols; i++) {
            grid[i] = [];

            grid[i][0] = new Container();
            grid[i][0].name = `cell_${i}_${0}`;
            grid[i][0].height = firstRowHeight;
            grid[i][0].width = 82;
            grid[i][0].x = 82 * i ;
            grid[i][0].y = 0;
            table.addChild(grid[i][0]);

            for (let j = 1; j <= numOfRows; j++) {
                let cell = new Container();
                cell.name = `cell_${i}_${j}`;

                cell.height = 45;

                if ((i + j + 1) % 2 === 0) {
                    let background = new Sprite ({
                        spriteSheet: paytableAtlasSpriteSheet,
                        defaultAnimation: "cellBack"
                    }, this.alias);
                    cell.width = 82;
                    cell.addChild(background);
                } else {
                    cell.width = 82;
                }

                cell.x = 82 * i;
                cell.y = 45 * (j-1) + firstRowHeight;

                grid[i][j] = cell;
                table.addChild(cell);
            }
        }

        let symbols = this.getService ("PayTableService").getPayTable();

        let colWidth = (table.width - firstColWidth ) / numOfSymbols;
        let rowHeight = (table.height - firstRowHeight - bottomPadding ) / 3;

        for (let j = 0; j < 4; j++) {

            let multiplier = new Text ({
                text: "x"+(5-j),
                font: "bold 20px Arial",
                color: "#461408",
                textAlign: "center",
                textBaseline: "middle",
                stroke: {
                    outline: 4,
                    color: "#ccc06a"
                }
            }, this.alias);
            multiplier.name = "multiplier";

            grid[0][j+1].addChild(multiplier);
            grid[0][j+1].setChildTop(multiplier, "50%");
            grid[0][j+1].setChildLeft(multiplier, "50%");
        }

        let i = 0;
        //for (let i = 0; i < numOfCols; i++) {
        for (let id in symbols) {

            let symbol = symbols[id];

            if (symbol[0].trigger !== undefined || symbol[0].wild_multiplier) {
                continue;
            }

            let pictureContainer = new Container();
            pictureContainer.name = "pictureContainer";

            let slotMachine = this.getService("SlotMachineService").getInstance();
            let picture = slotMachine.getSymbol(id);

            picture.scaleX = picture.scaleY = imageScale;
            picture.name = "picture";

            pictureContainer.height = firstRowHeight;
            pictureContainer.width = colWidth;
            pictureContainer.addChild(picture);
            pictureContainer.setChildAlign("center",picture);
            pictureContainer.setChildVerticalAlign("middle",picture);
            grid[i+1][0].addChild(pictureContainer);

            for (let j = 0; j < symbol.length; j++) {
                let multiplier = symbol[j].multiplier ? symbol[symbol.length-j-1].multiplier.toString() : "";
                let text = new BitmapText ({
                        text: multiplier,
                        alias: "bonus",
                        scaleX: valueScale,
                        scaleY: valueScale,

                        spriteSheet: numbersSmallSpriteSheet
                    }, "bonus");


                grid[i+1][j+1].addChild (text);

                text.x = grid[i+1][j+1].width/2 - text.getBounds().width/2 * text.scaleX + 2;
                text.y = grid[i+1][j+1].height/2 - text.getBounds().height/2 * text.scaleY;

            }

            i++;
        }

        let rect = table.getBounds();
        table.cache(rect.x, rect.y, rect.width, rect.height);

    }

    initPayLinesData() {
        let linesContainer = this.querySelectorContainer("lines", this.infoPopup);
        if (!linesContainer) {
            return;
        }

        let lines = linesContainer.getChildByName("lines");

        let offsetX = lines.x - 3;
        let offsetY = lines.y + 16;

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 4; j++) {
                let lineNumber = new Text ({
                    text: (i + j*5 + 1).toString(),
                    font: "bold 18px Arial",
                    color: "#451408",
                    textAlign: "right",
                    lineHeight: 20,
                    stroke: {
                        color: "#ccc06a",
                        outline: 3
                    }
                },this.alias);

                lineNumber.x = offsetX + i * 127 - 5;
                lineNumber.y = offsetY + j * 67;

                linesContainer.addChild (lineNumber);

            }
        }

    }

    initPages() {
        this.pageContainer = this.querySelectorContainer("pageContainer", this.infoPopup);
        let pages = this.pageContainer.children;

        this.initPaytableData();
        this.initPayLinesData();
        this.initBonusGamePage();
        this.initScatterPage();
        //this.initWildPage();

        this.pages = pages;
        this.currentPage = 0;
        this.startPositionX = (this.pageContainer.width - pages[0].width) / 2;

        for (let i = 0; i < pages.length; i++) {
            let page = pages[i];

            if (i === 0) {
                page.x = this.startPositionX;
            } else {
                page.x = this.pageContainer.width + this.startPositionX;
                page.alpha = 0;
            }

            page.visible = (i <= 1);

           /* let pointContainer = new Container();
            pointContainer.name = "pointContainer";
            let offset = 30;

            for (let j = 0; j < pages.length; j++) {
                let point;
                if (i === j) {
                    point = new Bitmap("point_blue", this.alias);
                    point.scaleX = point.scaleY = 1;
                } else {
                    point = new Bitmap("point_white", this.alias);
                    point.y = 0.05 * point.height;
                    point.scaleX = point.scaleY = 0.9;
                }

                point.x = j * offset;
                point.name = `point_${j}`;
                pointContainer.addChild(point);
            }

            page.addChild(pointContainer);
            page.setChildAlign("center", pointContainer);
            page.setChildBottom(pointContainer, 35);*/

            let rect = page.getBounds();
            if (page.name !== "bonusGame") {
                page.cache(rect.x, rect.y, rect.width, rect.height);
            }
        }
    }

    initScatterPage () {
        let scattersContainer = this.querySelectorContainer("scatters", this.infoPopup);

        if (!scattersContainer) {
            return;
        }

        let slotMachine = this.getService("SlotMachineService").getInstance();
        let extraSymbol = slotMachine.getSymbol(13);

        extraSymbol.x = 200;
        extraSymbol.y = 320;

        extraSymbol.regX = extraSymbol.width/2;
        extraSymbol.regY = extraSymbol.height/2;

        extraSymbol.scaleX = extraSymbol.scaleY = 0.85;

        scattersContainer.addChild(extraSymbol);
    }

   /* initWildPage () {
        let wildContainer = this.querySelectorContainer("wild", this.infoPopup);

        if (!wildContainer) {
            return;
        }

        let slotMachine = this.getService("SlotMachineService").getInstance();
        let extraSymbol = slotMachine.getSymbol(10);

        let maskExtraSymbol = this.querySelectorContainer("maskExtraSymbol", wildContainer);

        extraSymbol.regX = extraSymbol.width/2;
        extraSymbol.regY = extraSymbol.height/2;

        extraSymbol.x = maskExtraSymbol.x;
        extraSymbol.y = maskExtraSymbol.y + maskExtraSymbol.height/2;

        extraSymbol.scaleX = extraSymbol.scaleY = 0.95;

        wildContainer.addChild(extraSymbol);
    }*/

    initBonusGamePage () {
        let bonusGameContainer = this.querySelectorContainer("bonusGame", this.infoPopup);

        if (!bonusGameContainer) {
            return;
        }


        let mummy = new Mummy({}, "bonus");

        mummy.idle();
        mummy.scaleX = mummy.scaleY = 1.3;
        mummy.x = 363;
        mummy.y = 261;

        let index = bonusGameContainer.getChildIndex(bonusGameContainer.getChildByName("bonusPrompt"));
        bonusGameContainer.addChildAt(mummy, index);

        //this.initDebugDrag(mummy);


        //let screenshotLabel = this.querySelectorContainer("screenshotLabel", this.infoPopup);

        //let maskExtraSymbol = this.querySelectorContainer("maskExtraSymbol", bonusGameContainer);

        //let slotMachine = this.getService("SlotMachineService").getInstance();
        //let extraSymbol = slotMachine.getSymbol(11);
        //extraSymbol.regX = extraSymbol.width/2;
        //extraSymbol.regY = extraSymbol.height/2;

        //extraSymbol.x = maskExtraSymbol.x + maskExtraSymbol.width/2;
        //extraSymbol.y = maskExtraSymbol.y + maskExtraSymbol.height/2;

        //extraSymbol.scaleX = extraSymbol.scaleY = 0.75;

        //bonusGameContainer.addChild(extraSymbol);

       /* let screens = [
            bonusGameContainer.getChildByName ("screen_1"),
            bonusGameContainer.getChildByName ("screen_2"),
            bonusGameContainer.getChildByName ("screen_3")
        ];

        let texts = [
            bonusGameContainer.getChildByName ("screenshotLabel_1"),
            bonusGameContainer.getChildByName ("screenshotLabel_2"),
            bonusGameContainer.getChildByName ("screenshotLabel_3")
        ];

        const showScreen = (index) => {

            let fadeTime = 700;
            let showTime = 6000;

            createjs.Tween.get (screens[index], {override: true})
                .to ({visible: true, alpha: 0}, 0)
                .to ({alpha: 1}, fadeTime)
                .wait(showTime)
                .to ({alpha: 0, visible:false}, fadeTime)
                .call( () => {
                    showScreen ((index + 1) % screens.length)
                })
                /!*.addEventListener("change", () => {
                    this.pageContainer.updateCache();
                });*!/

            createjs.Tween.get (texts[index], {override: true})
                .to ({visible: true, alpha: 0}, 0)
                .to ({alpha: 1}, fadeTime)
                .wait(showTime)
                .to ({alpha: 0, visible:false}, fadeTime);
        };

        showScreen(0);
*/
    }

    initAlphaMask () {
        let maskContainer = new Container();
        maskContainer.name = "maskContainer";

        let maskStart = new createjs.Shape();
        let maskMain = new createjs.Shape();
        let maskEnd = new createjs.Shape();

        let alphaWidth = this.startPositionX;
        let maskHeight = this.pages[0].height;
        maskStart.graphics.beginLinearGradientFill(["rgba(0, 0, 0, 0)", "#000000"], [0, 1], 0, 0, alphaWidth,  0);
        maskStart.graphics.drawRect(0, 0, alphaWidth, maskHeight);
        maskContainer.addChild(maskStart);

        maskMain.graphics
            .beginFill("#000000")
            .drawRect(alphaWidth, 0, this.infoPopup.width-(alphaWidth * 2), maskHeight);
        maskContainer.addChild(maskMain);

        maskEnd.graphics.beginLinearGradientFill(["#000000", "rgba(0, 0, 0, 0)"], [0, 1], this.infoPopup.width-alphaWidth, 0, this.infoPopup.width,  0);
        maskEnd.graphics.drawRect(this.infoPopup.width-alphaWidth, 0, alphaWidth, maskHeight);
        maskContainer.addChild(maskEnd);

        maskContainer.cache(0, 0, this.infoPopup.width, maskHeight);

        this.pageContainer.filters = [
            new createjs.AlphaMaskFilter(maskContainer.cacheCanvas)
        ];

        this.pageContainer.cache (this.pageContainer.x, this.pageContainer.y, this.pageContainer.width, this.pageContainer.height);
    }


    initButtons () {
        let back = this.querySelectorContainer("buttons.back", this.infoPopup);
        let prev = this.querySelectorContainer("buttons.prev", this.infoPopup);
        let next = this.querySelectorContainer("buttons.next", this.infoPopup);

        const backOnClickAction = () => {
            this.getService("SoundService").play("audio_paytable_slide");
            this.hide();
        };

        const nextOnClickAction =  () => {
            if (this.tweenId) {
                //return;
            }
            if (this.clickDisabled) {
                return;
            }

            let newPage = (this.currentPage < this.pages.length-1 ? this.currentPage+1 : 0);
            this.setCurrentPage(newPage);
            this.goToStartPosition();

            this.getService("SoundService").play("audio_paytable_slide");
        };

        const prevOnClickAction =  () => {

            if (this.tweenId) {
                //return;
            }
            if (this.clickDisabled) {
                return;
            }
            let newPage = (this.currentPage > 0 ? this.currentPage-1 : this.pages.length-1);
            this.setCurrentPage(newPage);
            this.goToStartPosition();

            this.getService("SoundService").play("audio_paytable_slide");
        };

        let buttons = [
            {
                button: back,
                action: backOnClickAction
            },
            {
                button: prev,
                action: prevOnClickAction
            },
            {
                button: next,
                action: nextOnClickAction
            }
        ];

        for (let b in buttons) {
            let button = buttons[b].button;
            let action = buttons[b].action;

            button.mouseOnButton = false;

            button.regY = button.height/2;
            button.y += button.height/2;

            button.regX = button.width/2;
            button.x += button.width/2;

            button.addEventListener ("mousedown", () => {
                let rect = button.getBounds();
                button.regY = rect.height/2;
                button.regX = rect.width/2;
                button.scaleX = button.scaleY = 0.8;
            });

            button.addEventListener ("pressup", () => {
                let rect = button.getBounds();
                button.regY = rect.height/2;
                button.regX = rect.width/2;
                button.scaleX = button.scaleY = 1;
                if (button.mouseOnButton === true) {
                    action();
                }
            });

            button.addEventListener("mouseover", () => {
                let rect = button.getBounds();
                button.regY = rect.height/2;
                button.regX = rect.width/2;
                button.mouseOnButton = true;
            });

            button.addEventListener("rollout", () => {
                let rect = button.getBounds();
                button.regY = rect.height/2;
                button.regX = rect.width/2;
                button.mouseOnButton = false;
            });
        }

        back.addEventListener("mouseover", ()=>{
            this.getService("SoundService").play("audio_paytable_buttons_on_MouseOver");
        });

        next.addEventListener("mouseover", ()=>{
            this.getService("SoundService").play("audio_paytable_buttons_on_MouseOver");
        });

        prev.addEventListener("mouseover", ()=>{
            this.getService("SoundService").play("audio_paytable_buttons_on_MouseOver");
        });

        /**
         * Bug start prev container
         */
        this.pages[this.pages.length-1].x = -this.pageContainer.width + this.pages[0].x;
    }

    setCurrentPage (i) {
        for (let p = 0; p < this.pages.length; p++) {
            //this.pages[p].visible = false;
        }

        let prevPage, nextPage;
        let currentPage = this.currentPage = i;

        if (this.currentPage === 0) {
            prevPage = this.pages.length-1;
            nextPage = this.currentPage+1;
        } else if (this.currentPage === this.pages.length-1) {
            prevPage = this.currentPage-1;
            nextPage = 0;
        } else {
            prevPage = this.currentPage-1;
            nextPage = this.currentPage+1;
        }

        //console.error(currentPage, nextPage, prevPage);

        this.pages[prevPage].visible = true;
        this.pages[currentPage].visible = true;
        this.pages[nextPage].visible = true;

        this.pages[prevPage].x = -this.pageContainer.width + this.pages[currentPage].x;
        this.pages[nextPage].x = this.pageContainer.width + this.pages[currentPage].x;

    }

    goToStartPosition () {
        if (!this.tweenId) {
            this.tweenId = this.startTweenTarget(this.pageContainer);
        }

        let prevPage, nextPage;

        if (this.currentPage === 0) {
            prevPage = this.pages.length-1;
            nextPage = this.currentPage+1;
        } else if (this.currentPage === this.pages.length-1) {
            prevPage = this.currentPage-1;
            nextPage = 0;
        } else {
            prevPage = this.currentPage-1;
            nextPage = this.currentPage+1;
        }

        let tl = new createjs.Timeline();

        tl.addTween(
            createjs.Tween
                .get(this.pages[prevPage], {override:true})
                .to({x: -this.pageContainer.width+this.startPositionX, alpha: 0}, this.slideTime, createjs.Ease.quadInOut),

            createjs.Tween
                .get(this.pages[nextPage], {override:true})
                .to({x: this.pageContainer.width+this.startPositionX, alpha: 0}, this.slideTime, createjs.Ease.quadInOut),

            createjs.Tween
                .get(this.pages[this.currentPage], {override:true})
                .to ({x: this.startPositionX, alpha: 1}, this.slideTime, createjs.Ease.quadInOut)

        );

        tl.addEventListener("change", () => {
            if ( Math.abs(this.pages[this.currentPage].x - this.startPositionX ) > this.pageContainer.width-100 ) {
                this.clickDisabled = true;
            } else {
                this.clickDisabled = false;
            }

            //this.pageContainer.updateCache();
            if (tl.duration === tl.position) {
                this.clickDisabled = false;
                this.endTween(this.tweenId);
                this.tweenId = null;
                this.requestUpdateTarget(this.pageContainer);
            }
        });

    }

    resetPages(){

        this.setCurrentPage(0);
        this.pages.forEach((page)=>{
            page.visible = false;
        });
        this.pages[0].visible = true;
        //this.pageContainer.updateCache();
        this.goToStartPosition();
    }

    show () {
        this.getService("PopupService").addCustomPopup("paytable", {states: [["popup.popups.showCustomPopup"]]},
            {
                target: this.infoPopup,
                blur: true,
                blurTime: 300,
                showTime: 300,
                modal: true
            }
        );
    }

    hide () {
        this.resetPages();
        $_event.setEvent ("hideCustomPopup", {
            target: this.infoPopup
        });

        this.getService("PopupService").removeCustomPopup("paytable");
    }


}