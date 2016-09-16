import ServiceInterface from "./serviceInterface.es6.js";

export default class TickerTapeService extends ServiceInterface {

    constructor(data){

        super(data);

        this._demo = false;

        this.types = ["mainQueue", "spinQueue", "freeSpinQueue", "bonusQueue"];

        $_event.setSubscriber("initGame", this.instanceName);

        this.queue = [];
        this.queueInc = 0;

        this.queueActive = true;

        this._types = ["Normal", "Demo"];

        //this.checkDemoMode();
    }

    /**
     * Get type of game mode
     * @returns {*}
     */
    getGameMode(){
        return this._demo === true ? this._types[1] : this._types[0]
    }

    /**
     * Set queue of all games
     * @param queue
     */
    setQueueMessages(queue = {}){
        this._gamesTypeQueue = queue;
    }

    /**
     * Get queue of type
     * @param nameQueue
     * @returns {*}
     */
    getQueueOfType(nameQueue){
        if(this._gamesTypeQueue && this._gamesTypeQueue[nameQueue] !== undefined){
            return this._gamesTypeQueue[nameQueue];
        }

        return [];
    }

    /**
     * Check if demo mode
     */
    checkDemoMode(){
        if(/*$_args.wl != undefined && $_args.wl == "demo"/* ||*/ this.getService("ProtocolService").getCurrentCurrency() == "FUN"){
            this._demo = true;
        }
    }

    /**
     * Has free bets
     * @returns {boolean}
     */
    checkFreeBets(){
        return this.getService("ProtocolService").hasFreeBets();
    }

    /**
     * Init game Event
     */
    initGameEvent(){

        if(this.checkFreeBets()){
            return ;
        }

        this.setQueue(this.getQueueOfType(`mainQueue${this.getGameMode()}`));
        this.queueActive = true;
        $_signal.goTo('!settings.toolbar.dynamicMessages', this.getMessageFromQueue());

    }

    /**
     * Spin game info messages
     */
    spinGameInfo(update = false){

        this.setQueue(this.getQueueOfType(`spinQueue${this.getGameMode()}`));

        if(!this.checkFreeBets() || update === true ){
            this.queueActive = true;

            if(!this.getService("ProtocolService").hasFreeBets()){
                $_signal.goTo('!settings.toolbar.dynamicMessages', this.getMessageFromQueue());
            }
        }
    }

    /**
     * Free spin game info messages
     */
    freeSpinGameInfo(){

        this.setQueue(this.getQueueOfType(`freeSpinQueue${this.getGameMode()}`));

        //if(this.queueActive === false){
            //this.queueActive = true;
            $_signal.goTo('!settings.toolbar.dynamicMessages', this.getMessageFromQueue());
        //}
    }

    /**
     * Bonus game info messages
     */
    bonusGameInfo(){

        this.setQueue(this.getQueueOfType(`bonusQueue${this.getGameMode()}`));

        //if(this.queueActive === false){
            //this.queueActive = true;
            $_signal.goTo('!settings.toolbar.dynamicMessages', this.getMessageFromQueue());
        //}
    }

    fastQueueMessage(text = ""){
        if(!text){
            return ;
        }

        this.pushToQueue(text);
    }

    /**
     * Set to queue
     * @param list
     */
    setQueue(list = []){
        this.queue = list;
        this.queueInc = 0;
    }

    /**
     * Push to queue
     * @param list
     */
    pushToQueue(list = []){

        if(list instanceof Array){
            this.queue = [this.queue,...list];
        } else {
            this.queue.push(list);
        }
    }

    /**
     * Inc current queue
     */
    currentQueueInc(){

        if(this.queueInc < this.queue.length - 1){
            this.queueInc++;
        } else {
            this.queueInc = 0;
        }
    }

    /**
     * Get message to toolbar
     * @returns {*}
     */
    getMessageFromQueue(){
        if(this.queue.length == 0 || this.queueActive === false ){
            return null;
        }

        return $_t.getText(this.queue[this.queueInc]);
    }

    /**
     * Static message from WL or
     * @param text
     */
    staticMessage(text = ""){
        this.queueActive = false;
        $_signal.goTo('!settings.toolbar.staticMessage', text);
    }


    /**
     * From toolbar
     */
    callback(){
        this.currentQueueInc();
        $_signal.goTo('!settings.toolbar.dynamicMessages', this.getMessageFromQueue());
    }

}