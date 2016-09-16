import StateInterface from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateInterface.es6.js";
import StateEvents from "../../StateRouter/events/listEvents";

export default class SpinIdleState extends StateInterface {

    constructor(){
        super();
    }

    execute(resolve, reject){

        this.getHandler("control").enableAllButtons();
        this.getController("control").checkSpinButtonActive();

        if(this.getService("AutoPlayService").isActive()){

            new Promise( res => {
                this.getController("control").playAutoSpins(res);
            })
                .then(resolve);

        } else {
            resolve();
        }
    }
}