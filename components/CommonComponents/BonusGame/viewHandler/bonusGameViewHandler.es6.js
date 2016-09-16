import ViewCanvasHandler from "../../../../bower_components/html5-game-kernel/views/interfaces/ViewCanvasHandler.es6";

import * as bonusItems from "./elements/elements";

import BonusStartPopup from "./bonusStartPopup/bonusStartPopup";
import BonusEndPopup from "./bonusEndPopup/bonusEndPopup";
import BonusResumePopup from "./bonusResumePopup/bonusResumePopup";
import smokeSpriteSheet from "./elements/smokeSpriteSheet";


export default class BonusGameViewHandler extends ViewCanvasHandler {

    constructor(data = {}, config = null){
        super(data);

        if(config === null){
            return null;
        }

        this._numOfRooms = 6;
        this._timeOfMoving = 1500;

        this._backgroundConfig = {
           distanceBetweenRooms: (1667 - 1280) / (this._numOfRooms-1)
        };

        this._columnConfig = {
            columnPerRoom: 3,
            numberOfColumn: 13,
            startOffset: 160,
            distanceBetweenColumns: 480,
            distanceBetweenRooms: 960
        };

        this._floorConfig = {
            width: 1344 * this._numOfRooms,
            distanceBetweenRooms: 1344
        };

        this._elementsConfig = {
            startOffset: 160,
            delayBetweenShowing: 50,
            distanceBetweenRooms: 1344
        };

        this._items = [
            {
                name: "Basket"
            },
            {
                name: "Chest_1"
            },
            {
                name: "Chest_2"
            },
            {
                name: "Sarcophagus"
            },
            {
                name: "Urn"
            },
            {
                name: "Vase"
            }

        ];

        this._maxNumOfLifes = 3;

        this._levelMapCoordinates = [
            {x: 45, y:66},
            {x: 76, y:64},
            {x: 107.5, y:67},
            {x: 138, y:66},
            {x: 169.5, y:68},
            {x: 201, y:64}
        ];

        this._elements = [];

        this.config = config;

    }

    /**
     * Init and show bonus game
     */
    initBonusGame (){

        this.setDefaultStatus ();
        this.showLayout();
    }

    showStartPopup (resolve) {
        this._startPopup.show(resolve);
    }

    hideStartPopup () {
        return this._startPopup.hide();
    }

    showResumePopup (resolve) {
        this._resumePopup.show(resolve);
    }

    hideResumePopup (resolve) {
        return this._resumePopup.hide(resolve);
    }

    showEndPopup (success) {
        return this._endPopup.show(success);
    }

    hideEndPopup () {
        return this._endPopup.hide();
    }

    goToNextRoom () {
        return new Promise ((resolve, reject) => {
            let roof = this.querySelector("roof");
            let floor = this.querySelector("floor");
            let columnContainer = this.querySelector("columnContainer");
            let background = this.querySelector("background");
            let elementsContainer = this.querySelector("elementsContainer");

            let roundData = this.getRoundData();

            let tl = new createjs.Timeline();

            this.getService("SoundService").play("audio_bg_move_v2");

            tl.addTween (
                createjs.Tween
                    .get(roof)
                    .to ({x: -roundData.nextFloor * this._floorConfig.distanceBetweenRooms}, this._timeOfMoving),

                createjs.Tween
                    .get(floor)
                    .to ({x: -roundData.nextFloor * this._floorConfig.distanceBetweenRooms}, this._timeOfMoving),

                createjs.Tween
                    .get(background)
                    .to ({x: -roundData.nextFloor * this._backgroundConfig.distanceBetweenRooms}, this._timeOfMoving),

                createjs.Tween
                    .get(columnContainer)
                    .to ({x: -roundData.nextFloor * this._columnConfig.distanceBetweenRooms}, this._timeOfMoving),

                createjs.Tween
                    .get(elementsContainer)
                    .to ({x: - this._elementsConfig.distanceBetweenRooms}, this._timeOfMoving)
                    .call(() => {
                        this.removeElements();
                    })
                    .to({x: 0},0)

            ).addEventListener ("change", () => {
                if (tl.duration === tl.position) {

                    resolve();
                }
            });
        });
    }

    setDefaultStatus () {
        this._gameStateInitiated = false;
    }

    initHandler () {
        this.controller = this.getController();

        this.initLayout(this.config);
        this.initChildren(this.config.children);
        this._bonusInit = true;

        this.initRoofAndFloor ();
        this.initColumnContainer();

        this.getLayout().visible =false;
        this._startPopup = new BonusStartPopup({}, this.alias);
        this._endPopup = new BonusEndPopup({}, this.alias);
        this._resumePopup = new BonusResumePopup({}, this.alias);
    }

    initRoofAndFloor () {
        let roof = this.querySelector("roof");
        let floor = this.querySelector("floor");

        let pattern = $_required.getImageRawData("pattern_floor", this.alias);

        let background = new createjs.Shape();
        background.graphics
            .beginBitmapFill (pattern, "repeat-x")
            .drawRect (0,0,this._floorConfig.width, floor.height);

        floor.addChild(background);


        background = background.clone();
        background.rotation = 180;
        background.regX = this._floorConfig.width;
        background.regY = roof.height;

        roof.addChild(background);
    }

    initColumnContainer () {
        let columnContainer = this.querySelector("columnContainer");

        for (let i = 0; i < this._columnConfig.numberOfColumn; i++) {
            let column = new Bitmap("column", this.alias);
            column.regX = column.width/2;
            column.x = this._columnConfig.startOffset + this._columnConfig.distanceBetweenColumns * i;
            columnContainer.addChild(column);
        }
    }

    getNumOfElementsOnFloor () {
        return this.getService("BonusService").getBonusContext().count_symbols_on_floor;
    }

    getElementIDOfFloor() {
        let nextFloor = this.getNextFloor();
        let data = this.getService("BonusService").getBonusContext();
        if (!data || !data.bonus_graphic_elements) {
            return -1;
        }
        return data.bonus_graphic_elements[nextFloor];
    }

    initElements () {
        let elementsContainer = this.querySelector("elementsContainer");

        let floor = this.querySelector("floor");

        let numOfElements = this.getNumOfElementsOnFloor();
        let elementID = this.getElementIDOfFloor();

        let distance = this.getGameContainer().width / (numOfElements+1);
        let elements = [];
        this.enableChoosing();

        //elementID = 3; ///3 - sarcophagus
        for (let i = 0; i < numOfElements; i++) {

            let el = new bonusItems[this._items[elementID].name]({
                onClickUserAction: () => {
                    this.getController().selectObject(i);
                    this.disableChoosing();
                }
            }, this.alias);

            el.handler = this;
            el.name = `element_${i}`;
            el.x = this._elementsConfig.startOffset  + (i+1) * distance;

            elementsContainer.addChild(el);
            elementsContainer.setChildBottom(el, -el.height);

            el.goto ("hide");

            elements.push(el);
        }
        return elements;

    }

    showElements (restore = false) {
        let elements = this.initElements();
        let roundData = this.getRoundData();
        let elementsContainer = this.querySelector("elementsContainer");

        this._elements = elements;

        /*for (let i = 0; i < elements.length; i++) {
            let el = elements[i];
            setTimeout (() => {
                //el.goto ("lifeAction");
            }, i*1000);
            //continue;

            let aaa = 0;
            setInterval (() => {
                if (aaa % 2 === 0) {
                    if (i === 0) {
                        el.goto ("ripAction", "rip");
                    } else if (i === 1) {
                        el.goto ("winAction", 10);
                    } else if (i === 2) {
                        el.goto ("disable", "princess", 10);
                    } else if (i === 3) {
                        el.goto ("disable", "life");
                    } else if (i === 4) {
                        el.goto ("disable", "rip");
                    } else if (i === 5) {
                        el.goto ("disable", "win", 10);
                    }

                } else {
                    el.goto ("close");
                }
                aaa++;
            },1500);
        }
        return;*/

        if (roundData && roundData.selectedItemsInPrevRounds.length || restore) {
            for (let i = 0; i < elements.length; i++) {
                elements[i].goto ("close");
            }

            for (let i = 0; i < roundData.selectedItemsInPrevRounds.length; i++) {
                let el = elements[roundData.selectedItemsInPrevRounds[i].choice];
                switch (roundData.selectedItemsInPrevRounds[i].symbol) {
                    case "rip":
                        el.goto ("rip");
                        break;
                    case "life":
                        el.goto ("life");
                        break;
                    default:
                        el.goto ("win");
                        break;
                }
            }
        } else {
            for (let i = 0; i < elements.length; i++) {

                setTimeout (() => {
                    elements[i].goto ("showAction");
                }, i * this._elementsConfig.delayBetweenShowing);

            }
        }

    }

    removeElements () {
        let elementsContainer = this.querySelector("elementsContainer");

        for (let i = 0; i < this._elements.length; i++) {
            elementsContainer.removeChild(this._elements[i]);
        }

    }

    updateLifeCounter (needAnimation = true) {
        let lifeCount = this.getLifeCount();

        if(this.lastLiveCount != undefined && needAnimation){

            if(this.lastLiveCount != lifeCount){

                if(this.lastLiveCount > lifeCount){
                    this.getService("SoundService").play("audio_bg_live_lost");
                } else {
                    this.getService("SoundService").play("audio_bg_live_plus");
                }
            }
        }

        this.lastLiveCount = lifeCount;
        console.error('life', lifeCount);

        for (let i = 0; i < this._maxNumOfLifes; i++) {
            let heart = this.querySelector(`heart_${i+1}`);
            let heart_disable = this.querySelector(`heart_disable_${i+1}`);
            let papirusLife = this.querySelector(`papirusLife`);

            if (i < lifeCount) {

                if (heart.visible !== true && needAnimation) {
                    createjs.Tween
                        .get(heart)
                        .to({scaleX: 0, scaleY: 0, visible: true}, 0)
                        .to({scaleX: 2, scaleY: 2}, 150)
                        .to({scaleX: 1, scaleY: 1}, 150);

                } else {
                    heart.visible = true;
                }


            } else {

                if (heart.visible !== false && needAnimation) {

                    setTimeout (() => {
                        heart.visible = false;
                    },100);

                    createjs.Tween
                        .get(papirusLife)
                        .to ({rotation:6}, 50)
                        .wait(50)
                        .to ({rotation:0}, 70);

                    let smoke = new Sprite ({
                        spriteSheet: smokeSpriteSheet
                    }, this.alias);
                    smoke.name = "smoke";

                    smoke.regX = smoke.getBounds().width/2;
                    smoke.regY = smoke.getBounds().height/2;

                    smoke.scaleX = 0.7;
                    smoke.scaleY = 0.85;

                    smoke.addEventListener("animationend", () => {
                        smoke.stop();
                        smoke.visible = false;
                        this.getLayout().removeChild(smoke);
                    });

                    this.getLayout().addChild(smoke);

                    heart_disable.localToLocal (heart_disable.width/2, heart_disable.height/2-10, smoke.parent, smoke);

                    smoke.gotoAndPlay ("smoke");

                } else {
                    heart.visible = false;
                }
            }
        }
    }

    showLevelMap () {
        let container = this.querySelector("papirusRounds");

        let roundText = this.querySelector("roundText");
        let roundData = this.getRoundData();

        let nextRound = 0,
            nextFloor = 0;

        if (roundData) {
            nextRound = roundData.nextRound;
            nextFloor = roundData.nextFloor;
        }

        roundText.setText (
            $_t.getText(`bonus_rounds_left`, nextFloor+1)
        );

        for (let i = 0; i < this._numOfRooms; i++) {
            let levelBitmap;

            let prev = container.getChildByName(`levelBitmap_${i}`);
            if (prev) {
                container.removeChild(prev);
            }

            if (i < nextFloor) {
                continue;
            } else if (i === nextFloor) {
                levelBitmap = new Bitmap ("room_now", this.alias);
            } else if (i > nextFloor) {
                levelBitmap = new Bitmap ("room_future", this.alias);
            }

            levelBitmap.name = `levelBitmap_${i}`;
            levelBitmap.x = this._levelMapCoordinates[i].x;
            levelBitmap.y = this._levelMapCoordinates[i].y;

            container.addChild(levelBitmap);
        }

        let levelAnimation = new Bitmap ("room_now", this.alias);

        levelAnimation.regX = levelAnimation.width/2;
        levelAnimation.regY = levelAnimation.height/2;

        levelAnimation.x = this._levelMapCoordinates[nextFloor].x + levelAnimation.regX;
        levelAnimation.y = this._levelMapCoordinates[nextFloor].y + levelAnimation.regY;

        container.addChild(levelAnimation);

        createjs.Tween
            .get (levelAnimation)
            .to ({scaleX: 4, scaleY: 4, alpha: 0},0)
            .to ({scaleX: 1, scaleY: 1, alpha: 1},250)
            .call (() => {
                container.removeChild(levelAnimation);
            });

    }

    gotoRoom (room) {
        let roof = this.querySelector("roof");
        let floor = this.querySelector("floor");
        let columnContainer = this.querySelector("columnContainer");
        let background = this.querySelector("background");

        roof.x = -room * this._floorConfig.distanceBetweenRooms;
        floor.x = -room * this._floorConfig.distanceBetweenRooms;
        background.x = -room * this._backgroundConfig.distanceBetweenRooms;
        columnContainer.x = -room * this._columnConfig.distanceBetweenRooms;
    }

    initGameState (restore = false) {
        let data = this.getService("BonusService").getBonusContext();
        if (!data) {
            return;
        }

        let currentFloor = this.getCurrentFloor();

        this.gotoRoom (currentFloor);
        this.updateLifeCounter(false);
        this.showLevelMap();
        this.showElements (restore);
        //$_signal.goTo ("!control.bonus.picks");
    }

    getNextFloor () {
        let data = this.getService("BonusService").getBonusContext();
        return data.floor-1;
    }

    getNextRound () {
        let nextFloor = this.getNextFloor();
        let currentFloor = this.getCurrentFloor();
        let currentRound = this.getCurrentRound();

        if (nextFloor === currentFloor) {
            return currentRound+1;
        } else {
            return 0;
        }

    }

    selectedItemsInPrevRounds () {
        let selectedItems = [];

        let data = this.getService("BonusService").getBonusContext();
        let floor = this.getCurrentFloor();
        let nextFloor = this.getNextFloor();

        if (floor !== nextFloor) {
            return selectedItems;
        }

        if (data.selected_items && data.selected_items[floor]) {
            data.selected_items[floor].forEach ((params) => {
                if (params.choice !== undefined) {
                    selectedItems.push({
                        choice: params.choice,
                        symbol: params.symbol
                    });
                }
            })
        }
        return selectedItems;
    }

    getLastSelectedItem () {
        let data = this.getService("BonusService").getBonusContext();
        let floor = this.getCurrentFloor();
        let lastSelectedItem;

        if (data.selected_items && data.selected_items[floor] && data.selected_items[floor].length > 0) {
            lastSelectedItem = data.selected_items[floor][data.selected_items[floor].length-1].choice;
        }

        return lastSelectedItem;
    }

    getCurrentFloor () {
        let data = this.getService("BonusService").getBonusContext();
        return Math.max(data.selected_items.length - 1, 0)
    }

    getCurrentRound () {
        let data = this.getService("BonusService").getBonusContext();
        let currentFloor = this.getCurrentFloor();
        let round = 0;
        if (data.selected_items && data.selected_items[currentFloor]) {
            round = data.selected_items[currentFloor].length - 1;
        }
        return round;
    }

    getLifeCount () {
        return this.getService("BonusService").getBonusContext().count_life;
    }

    getRoundWin () {
        return this.getService("BonusService").getBonusContext().round_win/100;
    }

    getRoundData () {
        let data = this.getService("BonusService").getBonusContext();
        let floor = this.getCurrentFloor();
        let round = this.getCurrentRound();
        let nextFloor = this.getNextFloor();
        let nextRound = this.getNextRound();
        let selectedItemsInPrevRounds = this.selectedItemsInPrevRounds();
        let lastSelectedItem = this.getLastSelectedItem();

        let roundData = {};
        if (!(    data.selected_items
            &&  data.selected_items[floor]
            &&  data.selected_items[floor][round])) {

            $_log.error ("Cannot get round data:",
                "floor = ", floor,
                "round = ", floor,
                "data = ", data.selected_items);
        } else {
            roundData = data.selected_items[floor][round];
        }

        roundData.currentFloor = floor;
        roundData.currentRound = round;
        roundData.nextFloor = nextFloor;
        roundData.nextRound = nextRound;
        roundData.selectedItemsInPrevRounds = selectedItemsInPrevRounds;
        roundData.lastSelectedItem = lastSelectedItem;

        return roundData;
    }

    roundAnimation (data) {
        let roundData = this.getRoundData();
        let el = this.querySelector(`element_${roundData.lastSelectedItem}`);
        return new Promise ((resolve, reject) => {

            switch (roundData.symbol) {
                case "rip":

                    el.goto ("ripAction").then (resolve);

                    break;
                case "life":
                    el.goto ("lifeAction").then (resolve);

                    break;

                default:
                    if (this.isSuccess()) {
                        el.goto ("princessAction", this.getRoundWin()).then (resolve);
                    } else {
                        el.goto ("winAction", this.getRoundWin()).then (resolve);
                    }
            }

        });
    }

    showNotSelectedItems () {

        let selectedItems = [];

        let data = this.getService("BonusService").getBonusContext();
        let roundData = this.getRoundData();
        let floor = this.getCurrentFloor();

        if (data.selected_items && data.selected_items[floor]) {
            data.selected_items[floor].forEach ((params) => {
                if (params.choice !== undefined) {
                    selectedItems[params.choice] = true;
                }
            })
        }
        let j = 0;
        let princessShowed = false;

        for (let i = 0; i < this._elements.length; i++) {
            if (!selectedItems[i]) {
                let param = roundData.non_selected_items[j];
                if (param !== "rip" && param !== "life") {

                    if (this.isLastFloor() && !this.isSuccess() && !princessShowed) {
                        param = "princess";
                        princessShowed = true;
                    } else {
                        param /= 100;
                    }
                }
                this._elements[i].goto ("disable", param);
                j++;
            }
        }
    }

    disableChoosing () {
        for (let i = 0; i < this._elements.length; i++) {
            this._elements[i].disableChoosing();
        }
    }

    enableChoosing () {
        let roundData = this.getRoundData();
        let selectedItems = [];
        for (let i = 0; i < roundData.selectedItemsInPrevRounds.length; i++) {
            selectedItems[roundData.selectedItemsInPrevRounds[i].choice] = true;
        }

        for (let i = 0; i < this._elements.length; i++) {
            if (!selectedItems[i]) {
                this._elements[i].enableChoosing();
            }
        }
    }

    isSuccess() {
        let roundData = this.getRoundData();
        return roundData.nextFloor === this._numOfRooms;
    }

    isLastFloor () {
        let roundData = this.getRoundData();
        return roundData.currentFloor === this._numOfRooms-1;
    }

    isNewFloor () {
        let roundData = this.getRoundData();
        return roundData.currentFloor !== roundData.nextFloor
    }

    /**
     * Show result from bonus game
     */
    showResult (resolve) {

        let data = this.getService("BonusService").getBonusContext();
        //console.debug('!!! --- BONUS result', data);

        if (data === null) {
            resolve();
            return;
        }

        //this.finalAnimation(true);


/*
        setTimeout (() => {
            this.finalAnimation(true);
        },1000);*/

        /*if (!this._gameStateInitiated) {

            this.initGameState();

            this._gameStateInitiated = true;
            return;
        }*/

        let roundData = this.getRoundData();
        if (!roundData) {
            resolve();
            return;
        }

       this.roundAnimation(data).then ( () => {

           this.updateLifeCounter();

           if (this.isSuccess() || this.getLifeCount() === 0) {

               this.showNotSelectedItems();

               setTimeout (() => {

                   this.getController().endGame(resolve);

               },1500);

               return;
           }

           setTimeout (() => {

               if (this.isNewFloor()) {

                   this.showNotSelectedItems();

                   setTimeout (() => {

                       this.showLevelMap();
                       this.goToNextRoom().then (() => {
                           this.enableChoosing();
                           this.showElements();

                           resolve();
                       });

                   },1500);

               } else {
                   this.enableChoosing();
                   resolve();
               }

           }, 500);
       });

    }

    endBonus (){

        this.hideLayout();
        this.removeElements ();
        this.getStage().removeChild(this.getLayout());

    }

    activateVerticalMode () {

    }

    activateHorizontalMode () {

    }
}