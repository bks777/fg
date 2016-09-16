import panelDefault from "./panelDefault";

let panelSound = getClone (panelDefault);

panelSound.children.panelWrapper.children = {
    topLine: {
        type: "Bitmap",
        src: "settings_top_line",
        width: "100%",
        top: 70
    },
    titleSound: {
        "top": 20,
        "left": "50%",
        "type": "Text",
        "text": "SOUND SETTINGS",
        "font": "bold 27pt Calibri",
        "color": "#ffffff",
        "textAlign": "center",
        textType: "bold 27"
    },
    gameSoundLabel: {
        "top": 184,
        "left": "8%",
        "type": "Text",
        "text": "Game Sound",
        "font": "25pt Calibri",
        "color": "#ffffff",
        "textAlign": "left",
        textType: "25"
    },
    gameEffectsLabel: {
        "top": 320,
        "left": "8%",
        "type": "Text",
        "text": "Game Effects",
        "font": "25pt Calibri",
        "color": "#ffffff",
        "textAlign": "left",
        textType: "25"
    },
    gameSoundButton: {
        type: "Switcher",
        top: 169,
        left: "50%",
        width: 120,
        height: 63,
        len: 2,
        trackSprite: {
            images: ["setting_slide_button_bg"],
            frames: [[0,0,122,61],[0,65,122,61]],
            animations: {normal: [1], active: [0]}
        },
        thumbSprite: {
            top:1,
            scaleX: 0.97,
            scaleY: 0.97,
            spriteSheet: {
                images: ["setting_slide_button_element"],
                frames: [[0,0,62,63],[0,63,62,63]],
                animations: {normal: [1], active: [0]}
            }
        }
    },
    gameEffectsButton: {
        type: "Switcher",
        top: 298,
        left: "50%",
        width: 120,
        height: 63,
        len: 2,
        trackSprite: {
            images: ["setting_slide_button_bg"],
            frames: [[0,0,122,61],[0,65,122,61]],
            animations: {normal: [1], active: [0]}
        },
        thumbSprite: {
            top:1,
            scaleX: 0.97,
            scaleY: 0.97,
            spriteSheet: {
                images: ["setting_slide_button_element"],
                frames: [[0,0,62,63],[0,63,62,63]],
                animations: {normal: [1], active: [0]}
            }
        }
    }
};

export default panelSound;
