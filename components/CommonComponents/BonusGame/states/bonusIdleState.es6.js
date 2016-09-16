import StateInterface from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateInterface.es6.js";

export default class BonusIdleState extends StateInterface {

    constructor(){
        super();

        this.on(StateInterface.ENTER_STATE_TRANSITION, this.clearPromise);

        this.on(StateInterface.AFTER_EXECUTE_STATE, this.sendChooseRequest);
        this.lastPromiseCallback = null;
    }

    /**
     * Clear promise
     * @param resolve
     * @param reject
     */
    clearPromise(resolve, reject){
        this.lastPromiseCallback = null;

        resolve();
    }

    /**
     * Wait for choice from controller
     * @param resolve
     * @param reject
     */
    execute(resolve, reject){

        this.lastPromiseCallback = (chooseID) => {

            let promise = new Promise((res, rej) => {

                if(HelperFlags.get("noSpin")){
                    this.continue();
                    return res();
                }

                this.getController("protocol").sendData("bonusSendAction", res, chooseID);
            });

            promise.then(resolve);
        };
        console.error('---0');
    }

    /**
     * Select bonus object
     * @param number
     */
    selectObject(number){console.error('---1');
        this.lastPromiseCallback(number);
    }

    sendChooseRequest(resolve, reject){
        console.error('---2');
        this.nextState();
        resolve();
    }

}