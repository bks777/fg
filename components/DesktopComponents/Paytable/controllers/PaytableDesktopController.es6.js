import Controller from "../../../../bower_components/html5-game-kernel/interfaces/controllers/Controller.es6.js";

/**
 * Paytable Controller
 * @constructor
 */
export default class PaytableDesktopController extends Controller {

    constructor(data = {}) {
        super(data);
    }

    initController () {
        this.handler = this.getInst("PaytableDesktopViewHandler");
    }

}