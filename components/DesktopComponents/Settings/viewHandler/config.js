let defaultLabel = {
    type: "Text",
    font: "14px Calibri",
    color: "#FFFFFF",
    left: 28,
    top: "57%",
    "textBaseline": "middle"
};
let defaultCheckBox = {
    type: "Checkbox",
    spriteSheet: {
        images: ["UI_panel_checkbox-sprite"],
        frames: {width: 20, height: 17},
        animations: {normal: [1], clicked: [0]}
    },
    left: "5"
};
let defaultCheckBoxContainer = {
    type: "CheckboxContainer",
    top: "12%",
    children: {
        "checkBox": defaultCheckBox,
        "label": defaultLabel
    }
};

let quickSpinCheckBox = getClone (defaultCheckBoxContainer);
quickSpinCheckBox.children.label.text = "Quick spin";
quickSpinCheckBox.top = "24%";

let ambienceSoundCheckBox = getClone(defaultCheckBoxContainer);
ambienceSoundCheckBox.children.label.text = "Ambience sound";
ambienceSoundCheckBox.top = "60%"; // 34%

let soundEffectsCheckBox = getClone(defaultCheckBoxContainer);
soundEffectsCheckBox.children.label.text = "Sound effects";
soundEffectsCheckBox.top = "76%"; // 41%

let config = {
    layerSizeType: "overLayer",
    zIndex: 10,

    children: {

        "topBar": {
            type: "Container",
            width: "100%",

            children: {
                "background": {
                    type: "Bitmap",
                    src: "toolbar_message_bg",
                    width: "100%"
                },
                "messageLabel": {
                    type: "Bitmap",
                    top: 4,
                    src: "toolbar_label",
                    align: "center"
                },
                "messageContainer": {
                    type: "Container",
                    width: 406,
                    height: 25,
                    top: 6,
                    align: "center",
                    overflow: "hidden",
                    children: {
                        "message": {
                            type: "Text",
                            font: "13pt Calibri",
                            text: "This is the first message in this toolbar",
                            color: "#FFFFFF",
                            textBaseline: "middle",
                            top: "50%",
                            visible: true
                        }
                    }
                },
                "fastMessageContainer": {
                    type: "Container",
                    width: 406,
                    height: 25,
                    top: 6,
                    align: "center",
                    overflow: "hidden",
                    children: {
                        "fastMessage": {
                            type: "Text",
                            font: "13pt Calibri",
                            text: "",
                            color: "#FFFFFF",
                            textBaseline: "middle",
                            top: "50%",
                            visible: true
                        }
                    },
                    alpha: 0,
                    visible: false
                }
            }
        },

        "settingsBtn": {
            type: "Button",
            top: 3,
            right: 6, //130
            spriteSheet: {
                images: ["toolbar_setting_button"],
                frames: { width: 33, height: 26},
                animations: { normal: [2], hover: [3], clicked: [0], disabled: [1] }
            },
            visible: true
        },

        "soundOnBtn": {
            type: "Button",
            top: 3,
            right: 43, //190
            spriteSheet: {
                images: ["toolbar_sound_on"],
                frames: { width: 33, height: 26},
                animations: { normal: [2], hover: [3], clicked: [0], disabled: [1] }
            },
            visible: true
        },

        "soundOffBtn": {
            type: "Button",
            top: 3,
            right: 43, // 190
            spriteSheet: {
                images: ["toolbar_sound_off"],
                frames: { width: 33, height: 26},
                animations: { normal: [2], hover: [3], clicked: [0], disabled: [1] }
            },
            visible: false
        },

        "settingsPanel": {
            type: "Container",
            top: "6%",
            width: 187,
            right: 5,
            visible: false,
            children: {
                "background": {
                    type: "Bitmap",
                    src: "UI_top_tools_game_settings"
                },
                "title": {
                    type: "Text",
                    text: "GAME SETTINGS",
                    font: "bold 13pt Calibri",
                    color: "#FFFFFF",
                    top: "2.5%",
                    left: "3%"
                },

                "audioGroupTitle" :{
                    type: "Text",
                    text: "AUDIO",
                    font: "13pt Calibri",
                    color: "#FFFFFF",
                    top: "44%", //29%
                    left: "3%"
                },


                quickSpinCheckBox,
                /*"asd": {
                    type:"Text"
                },
                "1asd": {
                    type:"Text"
                },*/
                //introScreenCheckBox,
                ambienceSoundCheckBox,
                soundEffectsCheckBox,
                //highGraphicsCheckBox,
                //mediumGraphicsCheckBox,
                //lowGraphicsCheckBox,
                //spacebarToSpinCheckBox
            }
        }

    }
};

export default config;