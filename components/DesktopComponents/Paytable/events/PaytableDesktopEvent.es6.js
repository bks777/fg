import Events from "../../../../bower_components/html5-game-kernel/interfaces/events/Events.es6.js";

/**
 * Paytable Event manager
 * @constructor
 */
export default class PaytableDesktopEvent extends Events {

    constructor(data = {}) {
        super(data);

    }

    run() {
        this.handler = this.getInst('PaytableDesktopViewHandler');
        this.controller = this.getInst('PaytableDesktopController');
        this.setSubscriber('initGame');
        this.setSubscriber('showMiniPaytable');
        this.setSubscriber('spinAction');
    }

    /**
     * Init Game
     */
    initGameEvent () {
        this.handler.initHandler();
        this.controller.initController();
    }

    showMiniPaytableEvent (data) {
        this.handler.showMiniPaytable(data);
    }

    spinActionEvent () {
        this.handler.hideMiniPaytable();
    }

}