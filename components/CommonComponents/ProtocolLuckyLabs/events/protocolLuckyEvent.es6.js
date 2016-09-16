import Events from "../../../../bower_components/html5-game-kernel/interfaces/events/Events.es6.js"

/**
 * Protocol Event
 * @constructor
 */
export default class ProtocolLuckyEvent extends Events
{
    constructor (data = {}){
        super(data);

        this._openReconnect = false;
        this._successInit = false;
        this._callbackInit = null;

        this.init(data);
    }


    run ()
    {
        this.setSubscriber('init');
        this.setSubscriber('checkInitProtocol');
        this.setSubscriber('readyToSpin');
        this.setSubscriber('spinAction');
        this.setSubscriber('spinResult');
        this.setSubscriber('sendGetDoubleGame');
        this.setSubscriber('setDoubleCard');
        this.setSubscriber('showReconnect');
        this.setSubscriber('hideReconnect');
        this.setSubscriber('protocolError');
        this.setSubscriber('zeroBalance');
    };

    /**
     * Init Protocol
     */
    initEvent ()
    {
        //this.getInst('ProtocolLuckyController').authAction();
    };

    /**
     * Check if game connecting to server
     */
    checkInitProtocolEvent ()
    {
        if ( HelperFlags.get('initProtocolChecked', 'init') ) {
            return;
        }

        if(this._successInit === true){
            $_event.setEvent('initGame');
            //this.getInst('ProtocolHHSViewHandler').hideReconnectBlock();
        } else {
            this._callbackInit = function(){
                $_event.setEvent('initGame');
            };

            var _url = document.location.href;
            if(_url.indexOf('#') != -1){
                _url = _url.substr(0, _url.indexOf('#'));
            }
            this.protocolErrorEvent($_t.get('Please wait.'), $_t.get('Connecting...'), {text: $_t.get('Reload'), action: 'document.location=\'' + _url + '\''});
        }
    };

    /**
     * Send spin to server
     * @param data
     */
    spinActionEvent (data)
    {
        //this.getInst('ProtocolLuckyController').sendSpinAction(data);
    };

    /**
     * Sent to get double game
     */
    sendGetDoubleGameEvent ()
    {
        //this.getInst('ProtocolLuckyController').sendStartDoubleAction();
    };

    /**
     * Set Double Card
     * @param card
     */
    setDoubleCardEvent (card)
    {
        //this.getInst('ProtocolLuckyController').sendPlayDoubleAction(card);
    };

    /**
     * Show Reconnect page
     */
    showReconnectEvent ()
    {
        if(this._openReconnect !== true){
            this._openReconnect = true;

            //this.getInst('ProtocolLuckyController').showReconnect();
        }

    };

    /**
     * Show error of protocol
     * @param message
     * @param header
     * @param showKey
     */
    protocolErrorEvent (message, header, showKey)
    {
        this._openReconnect = true;

        if(!header){
            header = "Protocol error";
        }

        if(typeof showKey == 'undefined'){
            showKey = true;
        }

        //this.getInst('ProtocolHHSViewHandler').showError(message, header, showKey);
    };

    /**
     * Hide reconnect page
     */
    hideReconnectEvent ()
    {
        if(this._openReconnect === true){
            this._openReconnect = false;

            //this.getInst('ProtocolHHSViewHandler').hideReconnectBlock();
        }
    };

    /**
     * Hide recconect page
     */
    spinResultEvent ()
    {
        if(this._openReconnect === true && this._successInit === true){
            this._openReconnect = false;

            //this.getInst('ProtocolHHSViewHandler').hideReconnectBlock();
        }
    };

    /**
     * Ready to spin and open game container
     */
    readyToSpinEvent ()
    {
        /**
         * Success connect to server
         */
        if(this._successInit === false){
            this._successInit = true;

            if(typeof this._callbackInit == 'function'){
                this._callbackInit();

                this._callbackInit = null;
            }
        }
    };

    /**
     * Zero balance popup
     */
    zeroBalanceEvent ()
    {
        //this.getInst('ProtocolHHSViewHandler').showZeroBalanceError();
        $_event.setEvent('toMatchBetToBalanceHide');
    }
};
