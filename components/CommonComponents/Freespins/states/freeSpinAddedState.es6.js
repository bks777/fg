import StateInterface from "../../../../bower_components/html5-game-kernel/interfaces/stateMachine/stateInterface.es6.js";

export default class FreeSpinAddedState extends StateInterface {

    constructor(){
        super();
    }

    execute(resolve, reject){

        console.log(`Execute state ${this.name}`);
        resolve();
    }

}