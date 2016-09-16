import ControlCommonController from "../../../CommonComponents/Control/controllers/controlCommonController.es6";
import StateEvents from "../../../CommonComponents/StateRouter/events/listEvents";

/**
 * Control Mobile Controller
 * @constructor
 */
export default class ControlMobileController extends ControlCommonController {

    constructor(data = {}){
        super(data);

        this.getService("AutoPlayService").setAutoPlayRange ([10,25,50,100,200,500,1000]);
        this.lastCountFreeSpins = 0;
        this.defaultAutoSpinCount = 100;

        this.getCountAutoSpinValue();

        this.handler = this.getInst("ControlMobileViewHandler");
    }

    /**
     * init Controller (on Game Init Event)
     */
    initController () {
        this.handler = this.getInst("ControlMobileViewHandler");

         // if (this.getService("GameSettingsService").getLocalSettings("quick_spin")) {
         //     $_signal.goTo ("-control.quickMode.enable");
         // }
    }

    /**
     * "Auto play" button Click Action
     */
    autoPlayButtonClickAction () {
        let autoPlayRange = this.getService("AutoPlayService").getAutoPlayRange ();
        this.handler.setAutoPlayRangeSettingsValue(autoPlayRange);
        this.handler.toggleVisibilityAutoPlaySettings () ;
    }

    /**
     * Get count of auto spins
     * @returns {*}
     */
    getCountAutoSpinValue(){
        let val = this.getService("MemoryService").get("autoSpinCount", MemoryService.MEMORY_COOKIES_STORAGE);

        if(val == null || val === -1){
            val = this.defaultAutoSpinCount;
            this.getService("MemoryService").set("autoSpinCount", val, MemoryService.MEMORY_COOKIES_STORAGE);
        }

        return val;
    }

    /**
     * "Auto stop" button Click Action
     */
    autoStopButtonClickAction () {
        this.getService("AutoPlayService").stopAutoSpins ();
        //$_signal.goTo ("control.autoSpins.stopAutoSpins");
    }

    /**
     * "Spin" button Click Action
     */
    spinButtonClickAction () {

        if(HelperFlags.get("noSpin") === true){
            return ;
        }

        //@TODO check for necessity
        if(this.getService("ProtocolService").getNextAction() !== "spin" && $_signal_history.getLast().alias != "protocol.spins.init"){
            return ;
        }

        let slotMachine = this.getService("SlotMachineService").getInstance();

        if (slotMachine.isRunning()) {
            this.stopSpinAction();
        } else if(this.getInst("ControlMobileViewHandler").freeSpinActivePanel === false){
            this.spinAction();
        }
    }


    /**
     * "FreeSpin" button Click action
     */
    freeButtonClickAction(){

        new Promise((resolve, reject) => {
            setTimeout(resolve, 300);
        }).then(()=>{

            $_event.setEvent(StateEvents.RoundStart);
            //$_signal.goTo(`control.freespins.play`);
            createjs.Sound.play('reelrun');
        });
    }

    /**
     * Start play in free spins
     */
    //startPlayFreeSpins (){
    //    this.getInst("ControlMobileViewHandler").showFreePanel();
    //}

    /**
     * "Quick spin ON" button Click Action
     */
    quickSpinOnButtonClickAction () {
        this.getService("SlotMachineService").getInstance().enableQuickMode();

        this.handler.changeActiveQuickSpinButton(true);
    }

    /**
     * "Quick spin OFF" button Click Action
     */
    quickSpinOffButtonClickAction () {
        this.getService("SlotMachineService").getInstance().disableQuickMode();

        this.handler.changeActiveQuickSpinButton(false);
    }

    /**
     * if spin end
     */
    checkSpinEnd () {

        if(this.getService("ProtocolService").hasFreeBets() && this.getService("ProtocolService").getFreeBets().status == "finished"){
            $_signal.goTo("!lines.ended.execute");
        }
    }

    /**
     * Check active spin button
     */
    checkButtonsActive() {
        let nextAction = this.getService("ProtocolService").getNextAction();

        if (nextAction === "spin") {

            if (this.getService("AutoPlayService").isActive()) {
                this.handler.hideSettingsButton();
                this.handler.autoSpinActive = true;
            } else {
                this.handler.showAllButtons();
            }

        } else if (nextAction === "respin") {

            this.handler.hideSettingsButton();

        } else if (nextAction === "freespin") {

            this.handler.hideAdditionalButtons();

        } else if (nextAction === "freespin_stop") {

            if (this.getService("AutoPlayService").isActive()) {
                //this.handler.hideSettingsButton();
                this.handler.autoSpinActive = true;
            } else {
                //this.handler.showAllButtons();
            }

        } else {

            this.handler.hideAllButtons();

        }
    }

    beforeStartAutoPlay(){
        this.getHandler().changeSpinState();
    }

    checkSpinButtonActive(){
        this.getHandler().changeSpinState();
    }

}
