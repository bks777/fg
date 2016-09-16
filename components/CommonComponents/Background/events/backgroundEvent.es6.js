import Events from "../../../../bower_components/html5-game-kernel/interfaces/events/Events.es6.js";

/**
 * Background Event Class
 * @constructor
 */
export default class BackgroundEvent extends Events {

    constructor(data = {}){
        super(data);

        this.init(data);
    }

    /**
     * Subscribe to events
     */
    run (){
        this.handler = this.getHandler();
        this.setSubscriber('initGame');
        this.setSubscriber("horizontalMode");
        this.setSubscriber("verticalMode");
    }

    initGameEvent () {
        this.handler.initHandler();
    }

    horizontalModeEvent () {
        this.handler.activateHorizontalMode();
    }

    verticalModeEvent () {
        this.handler.activateVerticalMode();
    }


}