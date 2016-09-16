import Events from "../../../../bower_components/html5-game-kernel/interfaces/events/Events.es6.js";

/**
 * Init Event
 * @constructor
 */
export default class PreloaderInitEvent extends Events {

    constructor (data = {}) {
        super(data);
        this._preloaderImageLoad = false;

        this.init(data);
    }

    run()
    {
        this.setSubscriber('preloaderFinishedLoading');
        this.setSubscriber('loadingProcess');
        this.setSubscriber('mainFinishedLoading');
    };

    /**
     * Set Init
     */
    preloaderFinishedLoadingEvent ()
    {
        this.setEvent("init", null);

        $_stateMachine.goToState("STATE_LOADING");

        //this.getInst('PreloaderCommonViewHandler').initHandler();
        this._preloaderImageLoad = true;
    };

    /**
     * Process loading
     * @param percent
     */
    loadingProcessEvent (percent)
    {
        if(this._preloaderImageLoad === false){
            return false;
        }

        this.getHandler().progressHandler(percent);
        //this.getInst('PreloaderCommonViewHandler').progressHandler(percent);
    };

    mainFinishedLoadingEvent ()
    {
        $_signal.goTo("protocol.checkInit");
        this.setEvent('showAudioQuestion', null);
        //this.getInst('PreloaderHandler').hide();
    };

};

