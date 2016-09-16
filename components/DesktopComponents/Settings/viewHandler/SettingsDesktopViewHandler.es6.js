import ViewCanvasHandler from "./../../../../bower_components/html5-game-kernel/views/interfaces/ViewCanvasHandler.es6.js";

import Shape from "../../../../bower_components/html5-game-kernel/interfaces/modelsUI/Shape.es6.js";

import config from "./config.js";
import toolbarMessages from "./toolbarMessages.js";

/**
 * Settings Desktop View Handler
 * @constructor
 */
export default class SettingsDesktopViewHandler extends ViewCanvasHandler {
    constructor(data = {}) {

        super(data);

        this.ready = false;

        this.message = null;
        this.messageContainer = null;

        //$_service_ticker_tape.setQueueMessages(toolbarMessages);
    }

    initHandler () {

        if(this.ready){
            return ;
        }

        this.ready = true;

        this.initLayout(config);

        this.initChildren(config.children);

        this.messageTweenId = null;

        this._hasFastMessage = false;
        this._contentFastMessage = null;
        //this.cacheLayout();

        //$_event.setEvent ("showToolbarMessage", {text: "Click on the Spin button to start the game"});

    }

    /**
     * Show message
     * @param data
     */
    showMessage (data) {
        this.initHandler();

        if (!data || !data.text) {
            return;
        }

        //console.debug(' -> ', data);

        this.message = this.querySelector("message");
        this.messageContainer = this.querySelector("messageContainer");

        if (this.messageTweenId !== null) {
            this.endTween(this.messageTweenId);
            this.messageTweenId = null;
            createjs.Tween.removeTweens(this.message);
        }

        if (createjs.Tween.hasActiveTweens(this.message)) {
            createjs.Tween.removeTweens(this.message);
        }

        this.message.visible = true;
        this.message.text = data.text;
        this.messageContainer.setChildLeft(this.message, this.messageContainer.width+5);

        this.message.uncache();
        let rec = this.message.getBounds();

        let toX = - rec.width-5;
        let time = (rec.width + this.messageContainer.width) * 21;

        this.message.cache (rec.x, rec.y, rec.width, rec.height);

        let pt = this.messageContainer.localToGlobal(0,0);
        rec = new createjs.Rectangle(pt.x, pt.y, this.messageContainer.width, this.messageContainer.height);

        if (data.static) {

            this.messageContainer.setChildAlign("center", this.message);
            this.requestUpdate(rec);

        } else {

            let loop = data.loop || false;
            this.messageTweenId = this.startTween(rec);

            this.messageTween = createjs.Tween
                .get(this.message,  {override:true, ignoreGlobalPause: true, loop: loop, paused:false} )
                .to ({x: toX}, time)
                .call(() => {
                $_service_ticker_tape.callback();
                if (!loop) {
                    this.endTween(this.messageTweenId);
                    this.messageTweenId = null;
                }
            });

        }
    }

    /**
     * Show static message in toolbar
     * @param text
     */
    showStaticToolbarMessage(text){

        setTimeout(()=>{
            this.showMessage({
                static: true,
                text: text
            });
        }, 50);
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
     * Show free bet toolbar message
     * @param count
     */
    showFreeBetToolbarMessage(count = 0){
        $_service_ticker_tape.staticMessage($_t.getText("Free Bets left: {0}", count));
    }

    showSoundOnButton () {
        this.querySelector("soundOnBtn").visible = true;
    }
    hideSoundOnButton () {
        this.querySelector("soundOnBtn").visible = false;
    }

    showSoundOffButton () {
        this.querySelector("soundOffBtn").visible = true;
    }
    hideSoundOffButton () {
        this.querySelector("soundOffBtn").visible = false;
    }

    showSettingsButton () {
        this.querySelector("settingsBtn").visible = true;
    }
    hideSettingsButton () {
        this.querySelector("settingsBtn").visible = false;
    }

    stageSettingsMenuClickHandler (e) {
        if (!this.closest(e.target, "settingsPanel")) {
            this.hideSettingsPanel () ;
            this.getStage().removeEventListener ("click", this.stageSettingsMenuClickHandler);
        }
    }

    showSettingsPanel () {
        let target = this.querySelector("settingsPanel");
        target.visible = true;

        setTimeout( () => {
            this.settingsMenuListener = this.getStage().on ("click", this.stageSettingsMenuClickHandler.bind(this));
        },0);

        this.requestUpdateTarget(target);
    }

    hideSettingsPanel () {
        let target = this.querySelector("settingsPanel");
        target.visible = false;

        if (this.settingsMenuListener) {
            this.getStage().off ("click", this.settingsMenuListener);
        }

        this.requestUpdateTarget(target);
    }

    toggleVisibilitySettingsPanel () {
        if (this.querySelector("settingsPanel").visible) {
            this.hideSettingsPanel();
        } else {
            this.showSettingsPanel();
        }
    }

    quickSpinCheck () {
        this.querySelector("settingsPanel.quickSpinCheckBox").checked = true;
    }

    quickSpinUncheck () {
        this.querySelector("settingsPanel.quickSpinCheckBox").checked = false;
    }
}