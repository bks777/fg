import panelInfoMenu from "./partials/panelInfoMenu";
import panelPayTable from "./partials/panelPaytable";
import panelFast from "./partials/panelFast";
import panelSound from "./partials/panelSound";
import panelBetMenu from "./partials/panelBetMenu";

let config = {
    layerSizeType: "overLayer",
    children: {
        background: {
            type: "Bitmap",
            src: "background",
            scaleY: 1.4,
            visible:false
        },
        main: {
            type: "Container",
            width: "100%",
            height: "100%",
            children: {
                SpinButton: {
                    type: "Container",
                    top: "50%",
                    right: 20,
                    width: 204,
                    children: {
                        "expandSpinSettingsContainer": {
                            type: "Container",
                            children: {
                                "expandSpinSettings": {
                                    type: "Container",
                                    left: 14,
                                    children: {
                                        "bg": {
                                            "type": "Bitmap",
                                            "src": "spin_expand_bg",
                                            "left": 7,
                                            "top": 1,
                                            scaleY: 0.985
                                        },
                                        "close": {
                                            "type": "Button",
                                            "top": 73,
                                            "left": 72,
                                            backgroundClickable: true,

                                            spriteSheet: {
                                                images: ["spin_states_close"],
                                                frames: {width: 53, height: 53},
                                                animations: {normal: [1], clicked: [0]}
                                            },
                                            visible: true
                                        },
                                        "autoBtn": {
                                            type: "Container",
                                            top: 40,
                                            left: 182,
                                            backgroundClickable: true,
                                            children: {
                                                autoIcon: {
                                                    type: "Sprite",
                                                    spriteSheet: {
                                                        images: ["spin_states","spin_state_global"],
                                                        frames: [
                                                            [0,125*3,143,125, 0],
                                                            [0,125*2,143,125, 0],
                                                            [0,132*5,138,132, 1]
                                                        ],
                                                        animations: {normal: [0], clicked: [1], stop: [2]}
                                                    }
                                                },
                                                autoIconText: {
                                                    textBaseline: "middle",
                                                    top: "51%",
                                                    align: "center",
                                                    "width": 100,
                                                    "type": "Text",
                                                    "text": "100",
                                                    "font": "bold 27pt Calibri",
                                                    "color": "#16fcc3",
                                                    "textAlign": "center",
                                                    "shadow": {
                                                        "color": "#000000",
                                                        "blur": 1
                                                    },
                                                    textType: "bold 27"
                                                }
                                            },
                                            visible: true
                                        },
                                        "fastBtn": {
                                            type: "Container",
                                            "top": 40,
                                            "left": 307,
                                            width: 143,
                                            height: 125,
                                            backgroundClickable: true,

                                            children: {
                                                fastButton: {
                                                    "type": "Button",

                                                    spriteSheet: {
                                                        images: ["spin_states"],
                                                        frames: {width: 143, height: 125},
                                                        animations: {normal: [1], clicked: [0]}
                                                    },
                                                    visible: true
                                                }
                                            }
                                        }
                                    },
                                    visible: false
                                }
                            }
                        },
                        "expandVerticalFastSettings": {
                            type: "Container",
                            left: -240,
                            children: {

                                "bg": {
                                    "type": "Bitmap",
                                    "src": "spin_menu_fast",
                                    "left": 103,
                                    "top": 0
                                },
                                "fastBtnV": {
                                    type: "Container",
                                    "top": 40,
                                    "left": 270,
                                    width: 143,
                                    height: 125,
                                    backgroundClickable: true,

                                    children: {
                                        fastButtonV: {
                                            "type": "Button",

                                            spriteSheet: {
                                                images: ["spin_states"],
                                                frames: {width: 143, height: 125},
                                                animations: {normal: [1], clicked: [0]}
                                            },
                                            visible: true
                                        }
                                    }
                                }
                            },
                            visible: false
                        },
                        "expandVerticalNormalSettings": {
                            type: "Container",
                            left: 69,
                            children: {
                                "bg": {
                                    "type": "Bitmap",
                                    "src": "spin_menu_normal",
                                    "top": 0
                                },
                                "autoBtnV": {
                                    type: "Container",
                                    top: 40,
                                    left: 100,
                                    backgroundClickable: true,

                                    children: {
                                        autoIconV: {
                                            type: "Sprite",
                                            spriteSheet: {
                                                images: ["spin_states","spin_state_global"],
                                                frames: [
                                                    [0,125*3,143,125, 0],
                                                    [0,125*2,143,125, 0],
                                                    [0,132*5,138,132, 1]
                                                ],
                                                animations: {normal: [0], clicked: [1], stop: [2]}
                                            }
                                        },
                                        autoIconTextV: {
                                            textBaseline: "middle",
                                            top: "51%",
                                            align: "center",
                                            "width": 100,
                                            "type": "Text",
                                            "text": "100",
                                            "font": "bold 27pt Calibri",
                                            "color": "#16fcc3",
                                            "textAlign": "center",
                                            "shadow": {
                                                "color": "#000000",
                                                "blur": 1
                                            },
                                            textType: "bold 27"
                                        }
                                    },
                                    visible: true
                                }
                            },
                            visible: false

                        },
                        "defaultSpinBtn": {
                            left: 0,
                            width: 204,
                            height: 204,
                            type: "Button",
                            spriteSheet: {
                                images: ["spin_btn"],
                                frames: {width: 204, height: 204},
                                animations: {normal: [0], clicked: [2]}
                            },
                            visible: true
                        },
                        "giftKey": {
                            type: "Container",
                            children: {
                                "giftSpinBtn": {
                                    left: 0,
                                    type: "Sprite",
                                    spriteSheet: {
                                        images: ["spin_btn"],
                                        frames: {width: 204, height: 204},
                                        animations: {gift: [1]}
                                    }
                                },

                                giftSpinCounter: {
                                    "top": 99,
                                    "left": 163,
                                    "width": 100,
                                    "type": "Text",
                                    "text": "99",
                                    "font": "bold 33pt Calibri",
                                    "color": "#16fcc3",
                                    "textAlign": "center"/*,
                                     "shadow": {
                                     "color": "#000000",
                                     "offsetX": 1,
                                     "offsetY": 3,
                                     "blur": 3
                                     }*/,
                                    textType: "bold 33"
                                }
                            },
                            visible: false
                        },
                        "expandSpinBtn": {
                            type: "Button",
                            top: 80,
                            left: -20,
                            width: 40,
                            height: 40,
                            spriteSheet: {
                                images: ["spin_expand"],
                                frames: {width: 40, height: 40},
                                animations: {normal: [0], clicked: [3], open: [1], openClicked: [2]}
                            },
                            visible: true
                        },
                        "spinBtnStatesGl": {
                            type: "Sprite",
                            top: 35,
                            align: "center",
                            mouseEnabled: false,

                            spriteSheet: {
                                images: ["spin_state_global"],
                                frames: {width: 138, height: 132},
                                animations: {
                                    normal: [0],
                                    clicked: [2],
                                    fast: [1],
                                    autoStart: [3],
                                    autoStartFast: [4],
                                    autoStop: [5],
                                    autoStopFast: [6]
                                }
                            },
                            visible: true
                        },
                        "states": {
                            type: "Container",
                            top: 0,
                            height: 210,
                            mouseEnabled: false,
                            children: {
                                "play": {
                                    type: "Sprite",
                                    top: 73,
                                    left: 85,

                                    spriteSheet: {
                                        images: ["spin_btn_states"],
                                        frames: {width: 48, height: 58},
                                        animations: {normal: [1], clicked: [2], fast: [4], fastClicked: [5]}
                                    },
                                    visible: false
                                },
                                "stop": {
                                    type: "Sprite",
                                    top: 65,
                                    left: 85,

                                    spriteSheet: {
                                        images: ["spin_btn_states"],
                                        frames: {width: 48, height: 58},
                                        animations: {normal: [2], clicked: [3], fast: [5]}
                                    },
                                    visible: false
                                },
                                freeCounter: {
                                    "width": 100,
                                    "type": "Text",
                                    "text": "99",
                                    "font": "bold 33pt Calibri",
                                    "color": "#16fcc3",
                                    "textAlign": "center",
                                    textBaseline: "middle",
                                    top: "51%",
                                    /*"shadow": {
                                     "color": "#000000",
                                     "offsetX": 1,
                                     "offsetY": 3,
                                     "blur": 3
                                     },*/
                                    visible: false,
                                    textType: "bold 33"
                                }
                            }
                        }
                    }
                },
                homeButton: {
                    type: "Container",
                    top: 60,
                    left: 20,
                    children: {
                        "homeBtn": {
                            type: "Button",
                            spriteSheet: {
                                images: ["home_btn"],
                                frames: {width: 88, height: 88},
                                animations: {normal: [0]}
                            },
                            visible: true
                        }
                    }
                },
                settingsButton: {
                    type: "Container",
                    top: "44%",
                    left: 20,
                    width: 118,
                    children: {
                        "settingBtn": {
                            type: "Button",
                            spriteSheet: {
                                images: ["settings_btn"],
                                frames: {width: 118, height: 118},
                                animations: {normal: [0]}
                            },
                            visible: true
                        }
                    }
                },
                topBar: {
                    type: "Container",
                    width: "100%",
                    children: {
                        "bg": {
                            type: "Bitmap",
                            src: "background_top",
                            top: 0,
                            left: 0,
                            width: "100%"
                        }
                    }
                },
                winBar: {
                    type: "Container",
                    width: "100%",
                    height:50,
                    children: {
                        background: {
                            type: "Bitmap",
                            src: "background_win",
                            width: "100%"
                        },
                        winContainer: {
                            type: "Container",
                            children: {
                                winText: {
                                    type: "Text",
                                    text: "WIN_",
                                    font: "32pt Calibri",
                                    color: "#fca316",
                                    textAlign: "left",
                                    shadow: {
                                        "color": "#000000",
                                        "offsetX": 1,
                                        "offsetY": 3,
                                        "blur": 3
                                    },
                                    textType: "32"
                                }
                            }
                        },
                        totalWinContainer: {
                            type: "Container",
                            children: {
                                winText: {
                                    type: "Text",
                                    text: "Total win: ",
                                    font: "32pt Calibri",
                                    color: "#fca316",
                                    textAlign: "right",
                                    shadow: {
                                        "color": "#000000",
                                        "offsetX": 1,
                                        "offsetY": 3,
                                        "blur": 3
                                    },
                                    textType: "32"
                                }
                            },
                            visible: false
                        }
                    },
                    visible: false
                }
            },
            visible: true
        },
        bottomBar: {
            type: "Container",
            width: "100%",
            height: 34,
            backgroundColor: "#151d26",
            children: {
                /*info: {
                    //top: 10,
                    type: "Bitmap",
                    src: "background_bottom",
                    width: "100%"
                },*/
                betText: {
                    "top": 8,
                    "left": "1%",
                    "type": "Text",
                    "text": "",
                    "font": "16pt Calibri",
                    "color": "#ffffff",
                    "textAlign": "left",
                    "shadow": {
                        "color": "#000000",
                        "offsetX": 1,
                        "offsetY": 3,
                        "blur": 3
                    },
                    textType: "16"
                },
                balanceText: {
                    "width": 200,
                    "top": 8,
                    "left": "99%",
                    "type": "Text",
                    "text": "BALANCE: $ ",
                    "font": "16pt Calibri",
                    "color": "#ffffff",
                    "textAlign": "right",
                    "shadow": {
                        "color": "#000000",
                        "offsetX": 1,
                        "offsetY": 3,
                        "blur": 3
                    },
                    textType: "16"
                }
            }
        },
        settingsPanel: {
            type: "Container",
            width: "100%",
            backgroundColor: "#151d26",

            children: {
                menuPanel: {
                    type: "Container",
                    zIndex: 10,
                    width: "100%",
                    backgroundColor: "#0d141b",
                    children: {
                        soundMenu: {
                            type: "Sprite",
                            left: "4%",
                            backgroundClickable: true,
                            verticalAlign: "middle",
                            spriteSheet: {
                                images: ["settings_sound_btn"],
                                frames: {width: 138, height: 134},
                                animations: {normal: [1], active: [0]}
                            }
                        },
                        fastMenu: {
                            type: "Sprite",
                            left: "19%",
                            backgroundClickable: true,
                            verticalAlign: "middle",
                            spriteSheet: {
                                images: ["settings_fast_spin_btn"],
                                frames: {width: 138, height: 134},
                                animations: {normal: [1], active: [0]}
                            }
                        },
                        payTableMenu: {
                            type: "Sprite",
                            left: "34%",
                            backgroundClickable: true,
                            verticalAlign: "middle",
                            spriteSheet: {
                                images: ["settings_paytable_btn"],
                                frames: {width: 138, height: 134},
                                animations: {normal: [1], active: [0]}
                            }
                        },
                        betMenu: {
                            type: "Sprite",
                            left: "49%",
                            backgroundClickable: true,
                            verticalAlign: "middle",
                            spriteSheet: {
                                images: ["settings_bet_btn"],
                                frames: {width: 138, height: 134},
                                animations: {normal: [1], active: [0]}

                            }
                        },
                        infoMenu: {
                            type: "Sprite",
                            left: "64%",
                            backgroundClickable: true,
                            verticalAlign: "middle",
                            spriteSheet: {
                                images: ["settings_info_btn"],
                                frames: {width: 138, height: 134},
                                animations: {normal: [1], active: [0]}
                            }
                        },
                        backMenu: {
                            type: "Sprite",
                            left: "87%",
                            backgroundClickable: true,
                            spriteSheet: {
                                images: ["settings_back_btn"],
                                frames: {width: 138, height: 134},
                                animations: {normal: [1], clicked: [0]}
                            },
                            mouseChildren: false
                        }
                    }
                },
                panel: {
                    type: "Container",
                    width: "100%",
                    height: "100%",
                    //align:"center",

                    children: {
                        panelSound,
                        panelFast,
                        panelPayTable,
                        panelBetMenu,
                        panelInfoMenu
                    }
                }
            },
            visible: false
        }
    }
};
export default config;