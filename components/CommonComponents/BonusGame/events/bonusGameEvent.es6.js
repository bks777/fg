import Events from "../../../../bower_components/html5-game-kernel/interfaces/events/Events.es6.js";

export default class BonusGameEvent extends Events {

    constructor(data = {}){
        super(data);

    }

    /**
     * Run events
     */
    run (){
        //this.setSubscriber('initGame');
        this.setSubscriber("clearEmptyBlur");
        this.setSubscriber("updateBonusStage");
        this.setSubscriber("horizontalMode");
        this.setSubscriber("verticalMode");
    }

    /**
     * Init bonus game
     */
    initGameEvent (){
        //this.getInst("BonusGameViewHandler").initBonusGame();
    }

    /**
     * Clear empty blur
     */
    clearEmptyBlurEvent(){
        this.getHandler().hideEmptyBlur();
    }

    /**
     * Update bonus stage
     */
    updateBonusStageEvent(){
        this.getHandler().updateBonusStage();
    }

    horizontalModeEvent () {
        this.getHandler().activateHorizontalMode();
    }

    verticalModeEvent () {
        this.getHandler().activateVerticalMode();
    }

}