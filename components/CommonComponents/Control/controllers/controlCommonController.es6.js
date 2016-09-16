import Controller from "../../../../bower_components/html5-game-kernel/interfaces/controllers/Controller.es6.js";
import StateEvents from "../../StateRouter/events/listEvents";

/**
 * Control Controller
 * @constructor
 */
export default class ControlCommonController extends Controller {

    constructor(data = {}){
        super(data);

        this.autoPlayRange = [0, 10,25,50,100,200,500,1000, -2];
        this.getService("AutoPlayService").setAutoPlayRange (this.autoPlayRange);
        this.lastCountFreeSpins = 0;
    }

    /**
     * "Max Bet" button Click Action
     */
    maxBetButtonClickAction () {}

    /**
     * "Auto play" button Click Action
     */
    autoPlayButtonClickAction () {}

    /**
     * Is posible balance
     * @returns {boolean}
     */
    isPositiveBalance () {
        let balance = this.getService("ProtocolService").getCurrentBalance();
        let bet = this.getService("BetService").getCurrentValue();
        let lines = this.getService("LinesService").getCurrentValue();

        let min_bet = array_min(this.getService("BetService").getBetRange());
        let min_lines = array_min(this.getService("LinesService").getLinesRange());

        if(this.getService("ProtocolService").hasFreeBets()){
            return true;
        }

        if(balance < parseFloat (Number(min_bet / 100) * min_lines).toPrecision(2)){
            this.getService("PopupService").addInfoPopup("funds_exceed", {message: $_t.get("FUNDS_EXCEED")});

            return false;
        }

        if( balance < parseFloat (Number(bet / 100 * lines).toPrecision(2)) ){
            this.getService("PopupService").addInfoPopup("bet_exceed", {message: $_t.get("BET_EXCEED")});
            $_signal.goTo("!settings.toolbar.fastMessage", "bet_exceed_fast_message");
            return false;
        }

        return true;
    }

    /**
     * "Spin" button Click Action
     */
    spinButtonClickAction () {

        if(HelperFlags.get("noSpin") === true){
            return ;
        }

        if(this.getService("ProtocolService").getNextAction() !== "spin" && $_signal_history.getLast().alias != "protocol.spins.init"){
            return ;
        }

        if($_signal_history.find("protocol.freebets.reload") >= 0 && $_signal_history.find("control.freebets.hide") == -1){
            return ;
        }

        let slotMachine = this.getService("SlotMachineService").getInstance();

        if(slotMachine.isEnableQuickMode()){
            this.getHandler().disabledSpinButton();
        }

        if (slotMachine.isRunning()) {
            this.stopSpinAction();
            this.getHandler().disabledSpinButton();
        } else {
            this.spinAction();
        }
    }

    spinAction () {
        if (!this.isPositiveBalance()) {

            if(this.getService("AutoPlayService").isActive()){
                this.getService("AutoPlayService").stopAutoSpins();
            }
            return;
        }

        $_event.setEvent(StateEvents.RoundStart);

        //$_signal.goTo(`control.spin.play`);
    }

    stopSpinAction () {
        let slotMachine = this.getService("SlotMachineService").getInstance();
        slotMachine.needFastStop();
    }

    enableQuickMode () {}
    disableQuickMode () {}

    /**
     * Show start free spin popup
     */
    showStartFreeSpins () {

        if(this.getService("ProtocolService").getNextAction() == "freespin_stop"){
            $_signal.goTo("protocol.freespin_stops.init");
        } else {
            if (this.getService("AutoPlayService").isActive() && this.getService("AutoPlayService").isStopOnFreeGameEnabled()) {
                this.getService("AutoPlayService").stopAutoSpins();
            }
            this.getService("PopupService").addGamePopup("freespin",
                {"states": [["popup.popups.freeSpinStart"]]}, this.getService("FreeSpinService").getFreeSpinLeft());

            this.getService("PopupService").addWaitGamePopup("freespin", 2);
        }

        this.lastCountFreeSpins = this.getService("FreeSpinService").getFreeSpinLeft();
    }

    /**
     * Show start free spin popup
     * @param count
     */
    showAdditionalFreeSpins (count) {
        this.getService("PopupService").addGamePopup("freespin", {"states": [["popup.popups.freeSpinAdd"]]}, count);
    }

    /**
     * Show end free spin popup
     */
    showEndFreeSpins (state = []) {
        this.getService("PopupService").addGamePopup("freespin",
            {"states": [["popup.popups.freeSpinFinish"]]}, this.getService("FreeSpinService").getTotalWin(), state);

        this.getService("PopupService").addWaitGamePopup("freespin", 2);

        this.lastCountFreeSpins = 0;
    }

    /**
     * Detect status of AutoSpin. And, if it enabled => start it
     */
    detectAutoSpins () {
        if(this.getService("AutoPlayService").isActive()){
            $_event.setEvent(StateEvents.RoundStart);
        }

        //if (this.getService("AutoPlayService").isActive() && ["freespins"].indexOf(this.getService("ProtocolService").getCurrentAction()) == -1) {
            //$_signal.goTo("control.autoSpins.start");
        //}
    }

    /**
     * Detect free spins
     */
    detectFreeSpins(){

        if(["freespins"].indexOf(this.getService("ProtocolService").getCurrentAction()) > -1){

            let addFreeSpins = this.getService("FreeSpinService").getAdditionalFreeSpins();

            if(addFreeSpins !== false){
                this.getService("PopupService").addGamePopup("addFreeSpins", {
                    states: [["popup.popups.freeSpinAdd", addFreeSpins]]
                });
            } else {
                setTimeout(function () {
                    $_signal.goTo('control.freespins.play');
                }, 300);
            }
            //$_signal.goTo("control.freespins.play");
        }

        if(["freespins_stop"].indexOf(this.getService("ProtocolService").getCurrentAction()) > -1){
            this.getService("GameActionService").next();
        }
    }

    /**
     * play or no autospin
     * @param resolve
     */
    playAutoSpins (resolve = () => {}) {
        if (this.getService("AutoPlayService").isActive()) {

            if (!this.isPositiveBalance()) {
                this.getService("AutoPlayService").stopAutoSpins();
                $_signal.goTo ("control.autoSpins.stopAutoSpins");
                return;
            }

            //$_event.setEvent ("spinAction");

            let nextSpin = this.getService("AutoPlayService").nextSpin();
            if (nextSpin >= 0 || nextSpin === -2) {
                setTimeout( () => {
                    //$_signal.goTo("control.autoSpins.spin");

                    $_event.setEvent(StateEvents.RoundStart);

                    resolve();
                },300);
            } else if ( nextSpin === -1) {
                this.getService("PopupService").addGamePopup("autoSpin", {states: [["popup.popups.autoSpinFinish"]]},
                    {
                        state       : "control.autoSpins.stopAutoSpins",
                        lastCount   : this.getService("AutoPlayService").getLastStartValue(),
                        retryFunc   : () => {
                            this.getService("AutoPlayService").retryAutoSpins();
                            $_event.setEvent(StateEvents.RoundStart);
                            //$_signal.goTo ("control.autoSpins.start");
                        }
                    }
                );

                setTimeout(()=>{
                    this.getHandler("popup").updateBlur(true);
                    resolve();
                }, 20);
            }
        } else {

            this.getHandler().hideAutoPlayInterface();
            this.getHandler().enableAllButtons();
            this.getController().checkSpinButtonActive();

            this.getService("PopupService").removeGamePopup("autoPlay");
        }
    }

    /**
     * If freeSpin end
     */
    checkFreeSpinEnd (){
        if(this.getService("FreeSpinService").getFreeSpinLeft() > 0){

            let addFreeSpins = this.getService("FreeSpinService").getAdditionalFreeSpins();

            if(addFreeSpins !== false){
                this.getService("PopupService").addGamePopup("addFreeSpins", {
                    states: [["popup.popups.freeSpinAdd", addFreeSpins]]
                });
            } else {
                setTimeout(function () {
                    $_signal.goTo('control.freespins.play');
                }, 300);
            }

            //this.lastCountFreeSpins = this.getService("FreeSpinService").getFreeSpinLeft();
        }
    }


    /**
     * if spin end
     */
    checkSpinEnd () {
        //@TODO empty func?
        // if (this.getService("LinesService").getNextLine() === false) {}
    }

    /**
     * Start play in free spins
     */
    /*startPlayFreeSpins (){
        setTimeout (() => {
            if (this.getService("ProtocolService").getNextAction() === "respin") {
                $_signal.goTo("control.respins.play");
            } else {
                $_signal.goTo("!control.freespins.play");
            }


        }, 400);
    }*/


}
