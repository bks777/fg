import ViewCanvasHandler from "../../../../bower_components/html5-game-kernel/views/interfaces/ViewCanvasHandler.es6";

import config from "./config.js";
import verticalConfig from "./vertical";
import horizontalConfig from "./horizontal";

import toolbarMessages from "./toolbarMessages.js";

export default class SettingsMobileViewHandler extends ViewCanvasHandler {

    constructor(data = {}){
        super(data);

        this.ready = false;

        this.message = null;
        this.messageContainer = null;

        $_service_ticker_tape.setQueueMessages(toolbarMessages);
    }

    initHandler () {

        if(this.ready){
            return ;
        }

        this.ready = true;

        this.initLayout(config);

        this.initChildren(config.children);

        this.messageTweenId = null;

        this.toolbarFontChange = false;
        this.toolbarFontSize = 16;

        if (this.isVerticalMode()) {
            this.verticalModeToolbar();
        } else {
            this.horizontalModeToolbar();
        }

        //$_event.setEvent ("showToolbarMessage", {text: "Click on the Spin button to start the game"});

        window.addEventListener("orientationchange", ()=>{
            let ins = this.querySelector("topBar");

            if(ins){
                ins.visible = false;

                setTimeout(()=>{
                    ins.visible = true;
                }, 200);
            }
        }, true);

    }

    /**
     * Show message
     * @param data
     */
    showMessage (data, startPosition) {
        this.initHandler();

        if (!data || !data.text) {
            return;
        }

        this.message = this.querySelector("message");

        this.fastMessageContainer = this.querySelector("fastMessageContainer");
        this.fastMessage = this.querySelector("fastMessage");

        this.messageContainer = this.querySelector("messageContainer");
        startPosition = startPosition || this.messageContainer.width+5;

        if (this.messageTweenId !== null) {
            this.endTween(this.messageTweenId);
            this.messageTweenId = null;
            createjs.Tween.removeTweens(this.message);
        }

        this.message.visible = true;
        this.message.text = data.text;
        this.messageContainer.setChildLeft(this.message, startPosition);

        this.message.uncache();
        let rec = this.message.getBounds();

        let toX = - rec.width-5;
        let time = (rec.width + startPosition) * 21;

        this.message.cache (rec.x, rec.y, rec.width, rec.height);

        let pt = this.messageContainer.localToGlobal(0,0);
        rec = new createjs.Rectangle(pt.x, pt.y, this.messageContainer.width, this.messageContainer.height);

        if (data.static) {
            this._lastMessageStatic = true;
            this.messageContainer.setChildAlign("center", this.message);
            this.requestUpdate(rec);

        } else {
            this._lastMessageStatic = false;
            this.messageTweenId = this.startTween(rec);

            this.messageTween = createjs.Tween
                .get(this.message,  {override:true, ignoreGlobalPause: true, paused:false} )
                .to ({x: toX}, time)
                .call(() => {
                    $_service_ticker_tape.callback();
                    this.endTween(this.messageTweenId);
                    this.messageTweenId = null;
                });

        }
    }

    updateTweenMessage () {
        if (!this.message) {
            return;
        }

        if (this.fastMessage.text.length <= 0){
            this.showMessage(
                {
                    text: this.message.text,
                    static: this._lastMessageStatic
                },
                this.message.x
            );
        } else {
            // this.fastMessage.visible = false;
           this.showFastToolbarMessage(this.fastMessage.text);
        }
    }

    /**
     * Show fast message in toolbar
     * @param aliasText
     */
    showFastToolbarMessage(aliasText = null){

        if (this.getService("ProtocolService").hasFreeBets()
            && this.getService("ProtocolService").getCurrentAction() === "spins") {
            return;
        }

        this.fastMessage = this.querySelector("fastMessage");
        let messageContainer = this.querySelector("fastMessageContainer");

        if(!this.fastMessage){
            return ;
        }

        this.fastMessage.setText("");
        this.fastMessage.uncache();

        if(this._fastTimeout != null){
            clearTimeout(this._fastTimeout);
        }

        let promiseFinal = [];

        if (this.messageTweenFastId !== null) {
            this.endTween(this.messageTweenFastId);
            this.messageTweenFastId = null;
            createjs.Tween.removeTweens(this.fastMessage);
        }

        let promise =

            new Promise((res, rej)=>{

                createjs.Tween.get(this.messageContainer, {override:true, ignoreGlobalPause: true, loop: false})
                    .to({alpha: 0}, 200)
                    .call(()=>{
                        if (this.messageTweenId !== null) {
                            this.messageTween.setPaused(true);
                        }

                        createjs.Tween.get(messageContainer, {override:true, ignoreGlobalPause: true, loop: false})
                            .to({alpha: 1}, 100)
                            .call(()=>res());
                    });
            })
                .then(()=>{

                    this.fastMessage.setText($_t.getText(aliasText));

                    let rec = this.fastMessage.getBounds();

                    this.fastMessage.cache (rec.x, rec.y, rec.width, rec.height);

                    messageContainer.visible = true;

                    return this.fastMessage.getMeasuredWidth() <= messageContainer.width;

                }).then((isShortMessage)=>{

                if(isShortMessage === true){
                    messageContainer.setChildAlign("center", this.fastMessage);
                } else {

                    let pt = messageContainer.localToGlobal(0,0);
                    let rec = new createjs.Rectangle(pt.x, pt.y, messageContainer.width, messageContainer.height);

                    this.fastMessage.x = 10;

                    let toX = -(this.fastMessage.getMeasuredWidth() - messageContainer.width) - 10;

                    this.messageTweenFastId = this.startTween(rec);

                    promiseFinal.push(new Promise((res, rej)=>{
                        createjs.Tween
                            .get(this.fastMessage,  {override:true, ignoreGlobalPause: true, loop: false, paused:false})
                            .wait(500)
                            .to ({x: toX}, 500)
                            .call(() => {
                                res();
                            });
                    }))
                }
            }).then(()=>{
                    return Promise.all(promiseFinal);
                })
                .then(()=>{
                    return new Promise((res, rej)=>{
                        this._fastTimeout = setTimeout(res, 2500);
                    })
                })
                .then(()=>{
                    if (this.messageTweenId !== null) {
                        this.messageTween.setPaused(false);
                    }
                })
                .then(()=>{

                    return new Promise((res)=>{
                        createjs.Tween.get(messageContainer,  {override:true, ignoreGlobalPause: true, loop: false, paused:false})
                            .to ({alpha: 0}, 500)
                            .call(()=>{
                                messageContainer.visible = true;
                                this.fastMessage.setText("");

                                createjs.Tween.get(this.messageContainer,  {override:true, ignoreGlobalPause: true, loop: false, paused:false})
                                    .to ({alpha: 1}, 500)
                                    .call(()=>res());
                            });
                    });
                });

    }

    /**
     * Vertical mode toolbar
     */
    verticalModeToolbar(){

        this.applyConfig(verticalConfig);

        if (this.message && this.message.cacheCanvas) {
            this.message.uncache();
            let rec = this.message.getBounds();
            if (rec) {
                this.message.cache (rec.x, rec.y, rec.width, rec.height);
            }
        }

        if (this.fastMessage && this.fastMessage.cacheCanvas) {
            this.fastMessage.uncache();
            let rec = this.fastMessage.getBounds();
            if (rec) {
                this.fastMessage.cache (rec.x, rec.y, rec.width, rec.height);
            }
        }

        this.updateTweenMessage ();
    }

    /**
     * Horizontal mode toolbar
     */
    horizontalModeToolbar(){
        this.applyConfig(horizontalConfig);

        if (this.message && this.message.cacheCanvas) {
            this.message.uncache();
            let rec = this.message.getBounds();
            if (rec) {
                this.message.cache (rec.x, rec.y, rec.width, rec.height);
            }
            //this.message.updateCache();
        }

        if (this.fastMessage && this.fastMessage.cacheCanvas) {
            this.fastMessage.uncache();
            let rec = this.fastMessage.getBounds();
            if (rec) {
                this.fastMessage.cache(rec.x, rec.y, rec.width, rec.height);
            }
        }

        this.updateTweenMessage ();
    }

    /**
     * Show static message in toolbar
     * @param text
     */
    showStaticToolbarMessage(text){
        this.showMessage({
            static: true,
            text: text
        });
    }

    /**
     * Show free bet toolbar message
     * @param count
     */
    showFreeBetToolbarMessage(count = 0){
        $_service_ticker_tape.staticMessage($_t.getText("Free Bets left: {0}", count));
    }

    /**
     * Show dynamic list of messages in toolbar
     * @param listMessages
     */
    showDynamicToolbarMessage(listMessages = []){
        this.showMessage({
            static: false,
            text: listMessages
        });
    }

    showSettingPanel(){
        this.getLayout().visible = false;
    }

    hideSettingPanel(){
        this.getLayout().visible = true;
    }
}