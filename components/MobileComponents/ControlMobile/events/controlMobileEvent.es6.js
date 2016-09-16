import Events from "../../../../bower_components/html5-game-kernel/interfaces/events/Events.es6.js";

/**
 * Control Event manager
 * @constructor
 */
export default class ControlMobileEvent extends Events {

    constructor(data = {}){
        super(data);
    }

    run () {
        this.handler = this.getInst('ControlMobileViewHandler');
        this.controller = this.getInst('ControlMobileController');

        this.setSubscriber('verticalMode');
        this.setSubscriber('horizontalMode');

    };

    /**
     * Vertical Mode Event
     */
    verticalModeEvent () {
        this.handler.activateVerticalMode()
    };

    /**
     * Horizontal Mode Event
     */
    horizontalModeEvent () {
        this.handler.activateHorizontalMode();
    };

}


