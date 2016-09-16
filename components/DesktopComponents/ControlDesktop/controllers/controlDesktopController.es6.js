import ControlCommonController from "../../../CommonComponents/Control/controllers/controlCommonController.es6";
import StateEvents from "../../../CommonComponents/StateRouter/events/listEvents";

/**
 * Control Desktop Controller
 * @constructor
 */
export default class ControlDesktopController extends ControlCommonController {

    constructor(data = {}){
        super(data);
    }

    /**
     * init Controller (on Game Init Event)
     */
    initController () {
        this.handler = this.getInst("ControlDesktopViewHandler");

        if (this.getService("GameSettingsService").getLocalSettings("quick_spin")) {
            $_signal.goTo ("-control.quickMode.enable");
        }
    }

    /*************
     * Actions
     ************/

    /**
     * "Max Bet" button Click Action
     */
    maxBetButtonClickAction () {
        $_signal.goTo('-control.changeToMaxBet');
    }

    /**
     * "Auto play" button Click Action
     */
    autoPlayButtonClickAction () {

        if(HelperFlags.get("noSpin") !== null){
            return ;
        }

        this.getService("SoundService").play("audio_auto_play");

        let autoPlayRange = this.getService("AutoPlayService").getAutoPlayRange ();
        this.handler.setAutoPlayRangeSettingsValue(autoPlayRange);
        this.handler.toggleVisibilityAutoPlaySettings () ;
    }

    /**
     * "Auto stop" button Click Action
     */
    autoStopButtonClickAction () {
        this.getService("AutoPlayService").stopAutoSpins ();

        this.handler.hideAutoPlayInterface();

        //if ($_signal_history.find("reels.autoSpins.stopAnimation") < 0 || $_signal_history.find("reels.autoSpins.stopAnimation") > 2) {
        //    this.handler.disableAllButtons();
        //}

        let slotMachine = this.getService("SlotMachineService").getInstance();
        if (!slotMachine.isRunning()) {
            this.handler.enableAllButtons();
            this.checkSpinButtonActive();
        }
    }


    advancedSettingsContainerClickAction () {
        this.getService("SoundService").play("audio_auto_play");

        this.handler.toggleVisibilityAdvancedAutoPlaySettings();
    }

    /**
     * Before start autoplay
     */
    beforeStartAutoPlay(){
        this.getHandler().hideAutoPlaySettings();
        this.getHandler().hideAdvancedAutoPlaySettings();
        this.getHandler().hideAutoPlayButton();
        this.getHandler().showAutoStopButton();
        this.getHandler().showAutoPlayCounter();
        this.getHandler().disableAllButtons();
        this.getHandler().disabledSpinButton();

        this.getHandler("settings").showFastToolbarMessage("fast_click_avto_spin");

    }

    /**
     * Checked count of autoSpins
     * @param count
     */
    autoPlayValueContainerClickAction(count = 0){

        if (!this.isPositiveBalance()) {
            return;
        }

        this.handler.getAutoPlayValueContainer (count);
        this.getService("AutoPlayService").startAutoSpins(this.autoPlayRange[count]);

        this.beforeStartAutoPlay();

        $_event.setEvent(StateEvents.RoundStart);

        //$_signal.goTo ("control.autoSpins.start");

    }

    /**
     * "FreeSpin" button Click action
     */
    freeButtonClickAction(){
        let slotMachine = this.getService("SlotMachineService").getInstance();
        if (slotMachine.isRunning()) {
            slotMachine.needFastStop();
        }
    }

    /**
     * "Info" button Click Action
     */
    infoButtonClickAction () {

        if(HelperFlags.get("noSpin") !== null){
            return ;
        }

        $_signal.goTo('-paytable.show');
    }

    /**
     * "Quick spin ON" button Click Action
     */
    quickSpinOnButtonClickAction () {

        if(HelperFlags.get("noSpin") !== null){
            return ;
        }

        $_signal.goTo("-control.quickMode.disable");
    }

    /**
     * "Quick spin OFF" button Click Action
     */
    quickSpinOffButtonClickAction () {

        if(HelperFlags.get("noSpin") !== null){
            return ;
        }

        $_signal.goTo("-control.quickMode.enable");
    }

    quickSpinBackgroundClickAction () {

        if(HelperFlags.get("noSpin") !== null){
            return ;
        }

        if (this.getService("SlotMachineService").getInstance().isEnableQuickMode()) {
            $_signal.goTo("-control.quickMode.disable");
        } else {
            $_signal.goTo("-control.quickMode.enable");
        }
    }

    enableQuickMode () {

        if(HelperFlags.get("noSpin") !== null){
            return ;
        }

        this.getService("SoundService").play("audio_quick_spin");

        this.getService("SlotMachineService").getInstance().enableQuickMode();
        this.handler.showQuickSpinOnButton();
        this.handler.hideQuickSpinOffButton();

        this.getService("GameSettingsService").setLocalSettings("quick_spin", true);
    }

    disableQuickMode () {

        if(HelperFlags.get("noSpin") !== null){
            return ;
        }

        this.getService("SoundService").play("audio_quick_spin");

        this.getService("SlotMachineService").getInstance().disableQuickMode();
        this.handler.hideQuickSpinOnButton();
        this.handler.showQuickSpinOffButton();

        this.getService("GameSettingsService").setLocalSettings("quick_spin", false);
    }

    /**
     * "Decrement Bet" button Click Action
     */
    decBetButtonClickAction () {
        $_signal.goTo('!control.changeBet.back');
    }

    /**
     * "Increment Bet" button Click Action
     */
    incBetButtonClickAction () {
        $_signal.goTo('!control.changeBet.forward');
    }

    /**
     * "Decrement Lines" button Click Action
     */
    decLinesButtonClickAction () {
        $_signal.goTo("!control.changeLines.back");
    }

    /**
     * "Increment Lines" button Click Action
     */
    incLinesButtonClickAction () {
        $_signal.goTo("!control.changeLines.forward");
    }

    /**
     * Start play in free spins
     */
   /* startPlayFreeSpins (){
        setTimeout (() => {
            if (this.getService("ProtocolService").getNextAction() === "respin") {
                $_signal.goTo("control.respins.play");
            } else {
                $_signal.goTo("!control.freespins.play");
            }


        }, 400);
    }*/

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
    checkSpinButtonActive(){

        if(this.getService("ProtocolService").getNextAction() != "spin"){
            this.getInst("ControlDesktopViewHandler").disabledSpinButton();
            this.getInst("ControlDesktopViewHandler").disableAllButtons();
        } else {

            if (this.getService("AutoPlayService").isActive()) {
                this.getInst("ControlDesktopViewHandler").disableAllButtons();
                this.getInst("ControlDesktopViewHandler").disabledSpinButton();
            } else {
                this.getInst("ControlDesktopViewHandler").enableSpinButton();
            }
        }
    }

}
