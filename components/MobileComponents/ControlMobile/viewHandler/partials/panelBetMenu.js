import panelDefault from "./panelDefault";

let panelBetMenu = getClone (panelDefault);

panelBetMenu.children.panelWrapper.children = {
    topLine: {
        type: "Bitmap",
        src: "settings_top_line",
        width: "100%",
        top: 70
    },
    titleBet: {
        "top": 20,
        "left": "50%",
        "type": "Text",
        "text": "BET SETTINGS",
        "font": "bold 27pt Calibri",
        "color": "#ffffff",
        "textAlign": "center",
        textType: "bold 27"
    },
    gameBetLabel: {
        "top": 184,
        "left": "8%",
        "type": "Text",
        "text": "Bet_",
        "font": "25pt Calibri",
        "color": "#ffffff",
        "textAlign": "left",
        textType: "25"

    },
    betInfoLabel: {
        type: "Container",
        top: 80,
        left: 315,
        children: {
            "betIlBg": {
                type: "Bitmap",
                src: "settings_bg_value",
                left: 0,
                top: 10,
                width: 90,
                height: 80
            },
            "betIlText": {
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
    betFromLabel: {
        "width": 20,
        "top": 183,
        "left": "34%",
        "type": "Text",
        "text": "1",
        "font": "24pt Calibri",
        "color": "#7b7d80",
        "textAlign": "right",
        textType: "24"
    },
    betToLabel: {
        "width": 20,
        "top": 183,
        "right": "12%",
        "type": "Text",
        "text": "100",
        "font": "24pt Calibri",
        "color": "#7b7d80",
        "textAlign": "left",
        textType: "24"
    },
    betSliderButton: {
        type: "Slider",
        top: 175,
        left: "35%",
        width: "50%",
        len: 5,
        trackSprite: {
            width: "100%",
            images: ["setting_slide_flow"],
            frames: {width: 507, height: 43},
            animations: {normal: [0], active: [0]}
        },
        trackActiveSprite: {
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
    lineContainer: {
        type: "Container",
        width: "100%",
        children: {

            gameLinesLabel: {
                "top": 400,
                "left": "10%",
                "type": "Text",
                "text": "Lines",
                "font": "36pt Calibri",
                "color": "#ffffff",
                "textAlign": "left",
                textType: "36"
            },

            linesInfoLabel: {
                type: "Container",
                width: 114,
                height: 100,
                top: 300,
                left: 385,

                children: {
                    "linesIlBg": {
                        type: "Bitmap",
                        src: "settings_bg_value",
                        left: 0,
                        top: 0
                    },
                    "lineIlText": {
                        "top": 20,
                        "left": 56,
                        "type": "Text",
                        "text": "0",
                        "font": "40pt Calibri",
                        "color": "#fff",
                        "textAlign": "center",
                        textType: "40"
                    }
                }
            },
            linesFromLabel: {
                "width": 20,
                "top": 400,
                "left": "28%",
                "type": "Text",
                "text": "0",
                "font": "33pt Calibri",
                "color": "#7b7d80",
                "textAlign": "left",
                textType: "33"
            },
            linesToLabel: {
                "width": 20,
                "top": 400,
                "right": "10%",
                "type": "Text",
                "text": "1000",
                "font": "33pt Calibri",
                "color": "#7b7d80",
                "textAlign": "left",
                textType: "33"
            },
            linesSliderButton: {
                type: "Slider",
                top: 400,
                left: "35%",
                width: "50%",
                height: 90,
                len: 5,
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
            }
        },
        visible: false
    },
    totalBetContainer: {
        type: "Container",
        width: "100%",
        children: {
            gameTotalBetLabel: {
                "top": 320,
                "left": "8%",
                "type": "Text",
                "text": "Total bet_",
                "font": "25pt Calibri",
                "color": "#ffffff",
                "textAlign": "left",
                textType: "25"
            },
            gameTotalBetValueLabel: {
                "top": 320,
                "width": 100,
                "left": "37%",
                "type": "Text",
                "text": "399",
                "font": "25pt Calibri",
                "color": "#ffffff",
                "textAlign": "left",
                textType: "25"
            }

        },
        visible: false
    }
};

export default panelBetMenu;
