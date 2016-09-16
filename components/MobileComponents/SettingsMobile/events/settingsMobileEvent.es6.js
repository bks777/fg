import Events from "../../../../bower_components/html5-game-kernel/interfaces/events/Events.es6.js"

export default class SettingsMobileEvent extends Events {

    constructor(data = {}){
        super(data);
    }

    run(){
        this.handler = this.getInst('SettingsMobileViewHandler');
        this.controller = this.getInst('SettingsMobileController');

        this.setSubscriber('initGame');
        this.setSubscriber('verticalMode');
        this.setSubscriber('horizontalMode');

        this.setSubscriber('showSettingPanel');
        this.setSubscriber('hideSettingPanel');
    }

    initGameEvent(){
        this.handler.initHandler();
        this.controller.initController();
    }

    verticalModeEvent(){
        this.handler.verticalModeToolbar();
    }

    horizontalModeEvent(){
        this.handler.horizontalModeToolbar();
    }

    showSettingPanelEvent(){
        this.handler.showSettingPanel();
    }

    hideSettingPanelEvent(){
        this.handler.hideSettingPanel();
    }
}