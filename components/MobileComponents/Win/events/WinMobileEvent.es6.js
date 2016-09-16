import WinCommonEvent from "../../../CommonComponents/Win/events/WinCommonEvent.es6";

/**
 * Big Win Event Class
 * @constructor
 */
export default class WinMobileEvent extends WinCommonEvent {

    constructor(data = {}){
        super(data);

        this.init(data);
    }

    /**
     * Subscribe to events
     */
    run (){
        this.handler = this.getInst("WinMobileViewHandler");
        this.setSubscriber('initGame');
        this.setSubscriber('spinAction');

        this.setSubscriber("resize");
    }

    /**
     * Resize game container
     */
    resizeEvent(){
        //this.getHandler().updateScreen();
    }
}