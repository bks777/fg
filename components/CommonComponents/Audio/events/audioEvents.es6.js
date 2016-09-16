import Event from "../../../../bower_components/html5-game-kernel/interfaces/events/Events.es6.js";

export default class AudioEvents extends Event {

    constructor(data = {}){
        super(data);
    }

    run(){
        this.setSubscriber('spinAction');
    }

    spinActionEvent(){
        $_signal.goTo("!audio.background.fadeIn");
    }

}