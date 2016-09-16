import Events from "../../../../bower_components/html5-game-kernel/interfaces/events/Events.es6.js";

/**
 * Init Reels listener
 *
 * @function this.getReelsController() ReelsController
 * @constructor
 */
export default class InitReels extends Events
{
    constructor (data = {}){
        super(data);

        this._handler = null;
        this._scatter = null;

        this.init(data);
    }

    run () {

        //this.setSubscriber('initGame');
        this.setSubscriber('readyToSpin');
        //this.setSubscriber('spinAction');
        this.setSubscriber('stopSpinAction');
        this.setSubscriber('spinResult');
        //this.setSubscriber('endAnimationReels');
        this.setSubscriber('setToSlotMachineWinSymbols');
        this.setSubscriber('fastStop');
        this.setSubscriber('setToSlotMachineBonusSymbols');
        this.setSubscriber('setScatter');

        this.setSubscriber('stopAnimation');
        this.setSubscriber('reelStopped');

        this.setSubscriber('endCallbackAnimationReels');

        this._handler = this.getInst('ReelHandler');
    };

    /**
     * Init game scene
     */
    initGameEvent ()
    {
        //$_signal.goTo("reels.default");
        //this._handler.initGameReels();
    };

    /**
     * Ready To Spin
     * @param data
     */
    readyToSpinEvent (data)
    {
        //this._handler.readyToSpin(data.symbols);
    };

    /**
     * Set animate spin reels
     */
    spinActionEvent ()
    {
        //this._handler.startAnimateReels();
    };

    /**
     * Fast stop reels
     */
    fastStopEvent ()
    {
        //this._handler.fastModeReels();
    };

    /**
     * Set animate spin reels
     */
    stopSpinActionEvent ()
    {
        //this._handler.stopAnimateReels();
    };

    /**
     * Set reel data after reel animation is finished
     * @param data
     */
    endAnimationReelsEvent (data)
    {
        //this._handler.setDataToReels(data.symbols);
    };

    /**
     * Set data to reels
     * @param data
     */
    spinResultEvent (data)
    {
        //this._handler.setDataToReels(data.symbols);
        //this._handler.stopAnimateReels(data);
    };

    /**
     * Get win symbols with coords
     * @param list
     * @param countWin
     */
    setToSlotMachineWinSymbolsEvent (list, countWin)
    {
        this._handler.setWinElements(list, countWin);
    };

    /**
     * Set scatter to reel
     * @param scatterID
     */
    setScatterEvent (scatterID)
    {
        if(scatterID !== this._scatter){
            this._scatter = scatterID;

            //this._handler.setScatterToSlotMachine(scatterID);
        }
    };

    /**
     * Get win bonus symbols with coords
     * @param data
     */
    setToSlotMachineBonusSymbolsEvent (data)
    {
        //this._handler.setWinBonusElements(data.list, data.callback);
    };

    /**
     * Stop animation of win
     */
    stopAnimationEvent ()
    {
        //this._handler.stopWinAnimation();
    };

    /**
     * Set callback event for reels
     * @param data
     */
    endCallbackAnimationReelsEvent (data)
    {
        this.setEvent('endAnimationReels', data);
    };

    /**
     * Event
     * @param data
     */
    reelStoppedEvent (reelNumber) {
        this._handler.stopAdditionalReelAnimation(reelNumber);
    }
};