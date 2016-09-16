import Events from "../../../../bower_components/html5-game-kernel/interfaces/events/Events.es6.js";

/**
 * Init Event
 * @constructor
 */
export default class LinesEvent extends Events {

    constructor(data = {}){
        super(data);

        this.init(data);
    }

    run () {
        this.handler = this.getHandler();
        //this.setSubscriber('initGame');
        this.setSubscriber('spinAction');

    }

    /**
     * Init game lines
     */
    initGameEvent () {
        //this.handler.initHandler();
    };

    spinActionEvent(){
        this.handler.clearPlayStartTimer();
    }


}