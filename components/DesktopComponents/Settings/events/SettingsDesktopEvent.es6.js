import Events from "../../../../bower_components/html5-game-kernel/interfaces/events/Events.es6.js";

/**
 * Settings Event manager
 * @constructor
 */
export default class SettingsDesktopEvent extends Events {

    constructor(data = {}) {
        super(data);

    }

    run() {
        this.handler = this.getInst('SettingsDesktopViewHandler');
        this.controller = this.getInst('SettingsDesktopController');
        this.setSubscriber('initGame');
    }

    /**
     * Init Game
     */
    initGameEvent () {
        this.handler.initHandler();
        this.controller.initController();
    }

}