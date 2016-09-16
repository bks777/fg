import panelDefault from "./panelDefault";

let panelFast = getClone (panelDefault);

panelFast.children.panelWrapper.children = {
    topLine: {
        type: "Bitmap",
        src: "settings_top_line",
        width: "100%",
        top: 70
    },
    titleFast: {
        "top": 20,
        "left": "50%",
        "type": "Text",
        "text": "SPIN SETTINGS",
        "font": "bold 27pt Calibri",
        "color": "#ffffff",
        "textAlign": "center",
        textType: "bold 27"
    },
    gameAutoPlayLabel: {
        "top": 184,
        "left": "8%",
        "type": "Text",
        "text": "Autoplay",
        "font": "25pt Calibri",
        "color": "#ffffff",
        "textAlign": "left",
        textType: "25"
    },
    autoPlayInfoLabel: {
        type: "Container",
        width: 114,
        height: 100,
        top: 80,
        left: 315,
        children: {
            "apIlBg": {
                type: "Bitmap",
                src: "settings_bg_value",
                left: 0,
                top: 10,
                width: 90,
                height: 80
            },
            "apIlText": {
                "top": 22,
                "left": 44,
                "type": "Text",
                "text": "0",
                "font": "32pt Calibri",
                "color": "#fff",
                "textAlign": "center",
                textType: "32"
            }
        }
    },
    autoFromLabel: {
        "width": 20,
        "top": 183,
        "left": "34%",
        "type": "Text",
        "text": "10",
        "font": "24pt Calibri",
        "color": "#7b7d80",
        "textAlign": "right",
        textType: "24"
    },
    autoToLabel: {
        "width": 20,
        "top": 183,
        "right": "12%",
        "type": "Text",
        "text": ":char:8734",
        "font": "24pt Calibri",
        "color": "#7b7d80",
        "textAlign": "left",
        textType: "24"
    },
    gameQuickSpinLabel: {
        "top": 320,
        "left": "8%",
        "type": "Text",
        "text": "Quick Spin",
        "font": "25pt Calibri",
        "color": "#ffffff",
        "textAlign": "left",
        textType: "25"
    },
    gameAutoPlayButton: {
        type: "Slider",
        top: 175,
        left: "35%",
        width: "50%",
        height: 90,
        len: 7,
        trackSprite: {
            width: "100%",
            images: ["setting_slide_flow"],
            frames: {width: 507, height: 43},
            animations: {normal: [0], active: [0]}
        },
        trackActiveSprite: {
            width: 0,
            images: ["setting_slide_flow_active"],
            frames: {width: 507, height: 43},
            animations: {normal: [0], active: [0]}
        },
        thumbSprite: {
            images: ["settings_slide_swipe_button"],
            frames: {width: 44, height: 44},
            animations: {normal: [0], active: [0]}
        }
    },
    gameQuickSpinButton: {
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

export default panelFast;
