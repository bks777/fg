import Events from "../../../../bower_components/html5-game-kernel/interfaces/events/Events.es6.js";

/**
 * Snow Event Class
 * @constructor
 */
export default class WinCommonEvent extends Events {

    constructor(data = {}){
        super(data);

        this.init(data);
    }

    initGameEvent () {
        //this.handler.initHandler();
    }

    spinActionEvent(){
        this.handler.stopBigWinAnimation();
    }

}