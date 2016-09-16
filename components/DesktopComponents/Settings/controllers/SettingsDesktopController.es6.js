import Controller from "../../../../bower_components/html5-game-kernel/interfaces/controllers/Controller.es6.js";

/**
 * Control Controller
 * @constructor
 */
export default class SettingsDesktopController extends Controller {

    constructor(data = {}) {
        super(data);
        this.settingsPanelOpened = false;
    }

    initController () {
        this.handler = this.getInst("SettingsDesktopViewHandler");

        /**
         * Mouse over event
         */
        const btnMouseOver = () => {
            this.getService("SoundService").play("audio_button_all_onMouseOver");
        };

        this.handler.querySelector("soundOnBtn").addEventListener('click', this.soundOnButtonClickAction.bind(this));
        this.handler.querySelector("soundOnBtn").addEventListener('mouseover', btnMouseOver);

        this.handler.querySelector("soundOffBtn").addEventListener('click', this.soundOffButtonClickAction.bind(this));

        this.handler.querySelector("settingsBtn").addEventListener('click', this.settingsButtonClickAction.bind(this));
        this.handler.querySelector("settingsBtn").addEventListener('mouseover', btnMouseOver);


        let quickSpinCheckBox = this.handler.querySelector("settingsPanel.quickSpinCheckBox");
        quickSpinCheckBox.addEventListener('click', () => {

            if (this.getService("SlotMachineService").getInstance().isEnableQuickMode()) {
                this.getService("GameSettingsService").setLocalSettings("quick_spin", false);
                $_signal.goTo ("-control.quickMode.disable");
            } else {
                this.getService("GameSettingsService").setLocalSettings("quick_spin", true);
                $_signal.goTo ("-control.quickMode.enable");
            }
        });
        quickSpinCheckBox.checked = this.getService("GameSettingsService").getLocalSettings("quick_spin");


        /**
         * Sounds
         */
        const checkSoundActives = () => {

            if(this.getService("SoundService").getGameSound() === false
                && this.getService("SoundService").getGameEffects() === false){

                this.soundOff();
            } else {
                this.soundOn();
            }
        };

        checkSoundActives();

        let soundAmbience = this.handler.querySelector("ambienceSoundCheckBox");

        soundAmbience.addEventListener("click", (e)=>{
            this.getService("SoundService").play("audio_options");
            this.getService("SoundService").setGameSound(e.target.checked);
            checkSoundActives();
        });
        soundAmbience.checked = this.getService("SoundService").getGameSound();


        let soundEffects = this.handler.querySelector("soundEffectsCheckBox");

        soundEffects.addEventListener("click", (e)=>{
            this.getService("SoundService").play("audio_options");
            this.getService("SoundService").setGameEffects(e.target.checked);
            checkSoundActives();
        });
        soundEffects.checked = this.getService("SoundService").getGameEffects();
    }

    soundOff() {
        this.getService("GameSettingsService").setLocalSettings("sound", false);
        createjs.Sound.muted = true;
        this.handler.showSoundOffButton ();
        this.handler.hideSoundOnButton ();
    }

    soundOn () {
        this.getService("GameSettingsService").setLocalSettings("sound", true);
        createjs.Sound.muted = false;
        this.handler.showSoundOnButton ();
        this.handler.hideSoundOffButton ();
    }

    /****************************
     * Actions
     ****************************/

    /**
     * "Sound ON" button Click Action
     */
    soundOnButtonClickAction () {
       this.soundOff();

        let soundAmbience = this.handler.querySelector("ambienceSoundCheckBox");
        soundAmbience.checked = false;
        this.getService("SoundService").setGameSound(false);

        let soundEffects = this.handler.querySelector("soundEffectsCheckBox");
        soundEffects.checked = false;
        this.getService("SoundService").setGameEffects(false);
    }


    /**
     * "Sound OFF" button Click Action
     */
    soundOffButtonClickAction () {
       this.soundOn ();

        let soundAmbience = this.handler.querySelector("ambienceSoundCheckBox");
        soundAmbience.checked = true;
        this.getService("SoundService").setGameSound(true);

        let soundEffects = this.handler.querySelector("soundEffectsCheckBox");
        soundEffects.checked = true;
        this.getService("SoundService").setGameEffects(true);
    }

    settingsButtonClickAction () {
        this.getService("SoundService").play("audio_options");
        this.handler.toggleVisibilitySettingsPanel();
    }

    highGraphicsCheckBoxClickAction () {
        this.handler.querySelector("settingsPanel.highGraphicsCheckBox.checkBox").checked = true;
        this.handler.querySelector("settingsPanel.mediumGraphicsCheckBox.checkBox").checked = false;
        this.handler.querySelector("settingsPanel.lowGraphicsCheckBox.checkBox").checked = false;

        this.getService("GameSettingsService").setLocalSettings("graphics_quality", "high");
        $_view_canvas.setQuality($_view_canvas.HIGH_QUALITY);
    }

    mediumGraphicsCheckBoxClickAction () {
        this.handler.querySelector("settingsPanel.highGraphicsCheckBox.checkBox").checked = false;
        this.handler.querySelector("settingsPanel.mediumGraphicsCheckBox.checkBox").checked = true;
        this.handler.querySelector("settingsPanel.lowGraphicsCheckBox.checkBox").checked = false;

        this.getService("GameSettingsService").setLocalSettings("graphics_quality", "medium");
        $_view_canvas.setQuality($_view_canvas.MEDIUM_QUALITY);
    }

    lowGraphicsCheckBoxClickAction () {
        this.handler.querySelector("settingsPanel.highGraphicsCheckBox.checkBox").checked = false;
        this.handler.querySelector("settingsPanel.mediumGraphicsCheckBox.checkBox").checked = false;
        this.handler.querySelector("settingsPanel.lowGraphicsCheckBox.checkBox").checked = true;

        this.getService("GameSettingsService").setLocalSettings("graphics_quality", "low");
        $_view_canvas.setQuality($_view_canvas.LOW_QUALITY);
    }

    spacebarClickAction (e) {
        if (e.keyCode === 32) { /* if spacebar is pressed */
            let protocolService = this.getService("ProtocolService");
            if (protocolService.isAvailableSpins()) {
                $_signal.goTo ("!control.spin.spacePlay");
            }
        }
        return false;
    }

    spacebarToSpinCheckBoxClickAction (e) {

        this.getService("GameSettingsService").setLocalSettings("spacebar_click_spin", e.target.checked);

        if (e.target.checked) {
            if(typeof window.top.onkeydown != "function"){
                window.top.addEventListener("keydown", this.spacebarClickAction.bind(this));
            }
        } else {
            if(typeof window.top.onkeydown == "function"){
                window.top.removeEventListener("keydown", this.spacebarClickAction.bind(this));
            }
        }

    }

}