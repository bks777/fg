import Events from "../../../../bower_components/html5-game-kernel/interfaces/events/Events.es6.js";

export default class FreespinsEvent extends Events {
    constructor(data = {}){
        super(data);
    }

    /**
     * Run events
     */
    run (){
        this.setSubscriber("horizontalMode");
        this.setSubscriber("verticalMode");
    }

    horizontalModeEvent () {
        this.getHandler().activateHorizontalMode();
    }

    verticalModeEvent () {
        this.getHandler().activateVerticalMode();
    }
}