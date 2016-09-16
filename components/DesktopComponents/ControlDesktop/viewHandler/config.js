import {autoPlayCounterContainer, autoPlaySettingsContainer, autoPlayAdvancedSettingsContainer} from "./autoPlayUI.es6";
let crunchOffset = /Chrome/.test(navigator.userAgent) && /Win/.test(navigator.platform) ? -3 : 0;
let config = {
    zIndex: 50,

    "children": {

        "spinBtn": {
            "type": "Button",
            "left": 422,
            "top": 582,
            "spriteSheet": {
                "images": ["spin_default_button"],
                "frames": { "width": 117, "height": 116},
                "animations": { "normal": [2], "hover": [3], "clicked": [0], "disabled": [1] }
            },
            "visible": true
        },



        "infoBtn": {
            "type": "Button",
            "left": 340,
            "top": 652,
            "spriteSheet": {
                "images": ["info_button"],
                "frames": { "width": 45, "height": 44},
                "animations": { "normal": [2], "hover": [3], "clicked": [0], "disabled": [1] }
            },
            "visible": true
        },

        "containerOfMaxBet": {
            "type": "Container",
            "left": 311,
            "top": 582,
            "children": {

                "maxBetBtn": {
                    "type": "Button",
                    "left": 0,
                    "top": 0,
                    "spriteSheet": {
                        "images": ["default-button"],
                        "frames": { "width": 103, "height": 65},
                        "animations": { "normal": [2], "hover": [3], "clicked": [0], "disabled": [1] }
                    },
                    "visible": true
                },

                "maxLabel": {
                    "type": "Text",
                    "text": "desktop_control_max_bet",
                    "font": "bold 16px Calibri",
                    "color": "#55702B",
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "fontTransform": "uppercase",
                    "top": "39%",
                    mouseEnabled: false
                }
            }
        },


        "containerOfAutoPlay": {
            "type": "Container",
            "left": 545,
            "top": 582,
            "children": {

                "autoPlayBtn": {
                    "type": "Button",
                    "left": 0,
                    "top": 0,
                    "spriteSheet": {
                        "images": ["default-button"],
                        "frames": { "width": 103, "height": 65},
                        "animations": { "normal": [2], "hover": [3], "clicked": [0], "disabled": [1] }
                    },
                    "visible": true
                },

                "autoLabel": {
                    "type": "Text",
                    "text": "auto_play_key",
                    "font": "bold 16px Calibri",
                    "color": "#55702B",
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "top": "39%",
                    mouseEnabled: false
                }
            }
        },


        "containerOfAutoStop": {
            "type": "Container",
            "left": 545,
            "top": 582,
            visible: false,
            "children": {
                "autoStopBtn": {
                    "type": "Button",
                    "left": 0,
                    "top": 0,
                    "spriteSheet": {
                        "images": ["default-button"],
                        "frames": { "width": 103, "height": 65},
                        "animations": { "normal": [2], "hover": [3], "clicked": [0], "disabled": [1] }
                    }
                },

                "stopLabel": {
                    "type": "Text",
                    "text": "auto_play_stop",
                    "font": "bold 16px Calibri",
                    "color": "#55702B",
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "top": "50%",
                    mouseEnabled: false
                }
            }
        },



        "containerOfQuickSpin": {
            "type": "Container",
            "left": 565,
            "top": 661,
            cursor: "pointer",
            "children": {

                "background": {
                    "type": "Bitmap",
                    "src": "fastspin_back_label",
                    "left": 0,
                    "top": 0
                },

                "offBtn": {
                    "type": "Button",
                    "left": 2,
                    "top": 3,
                    "spriteSheet": {
                        "images": ["quick_spin_off_button"],
                        "frames": { "width": 33, "height": 21},
                        "animations": { "normal": [2], "hover": [3], "clicked": [0], "disabled": [1] }
                    },
                    "visible": true
                },
                "onBtn": {
                    "type": "Button",
                    "left": 29,
                    "top": 3,
                    "spriteSheet": {
                        "images": ["quick_spin_on_button"],
                        "frames": { "width": 33, "height": 21},
                        "animations": { "normal": [2], "hover": [3], "clicked": [0], "disabled": [1] }
                    },
                    "visible": false
                }
            }
        },


        "containerOfBet": {
            "type": "Container",
            "left": 20,
            "top": 586,
            "children": {

                "background": {
                    "type": "Bitmap",
                    "src": "MG_meters_bet_label",
                    "left": 0,
                    "top": 0,
                    "visible": true
                },

                "betLabel": {
                    "type": "Text",
                    "text": "BET",
                    "font": "bold 16px Calibri",
                    "color": "#C2C2C2",
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "fontTransform": "uppercase",
                    "top": 17 + crunchOffset
                },

                "betValue": {
                    "type": "Text",
                    "text": "0.01",
                    "font": "bold 20px Calibri",
                    "color": "#FFFFFF",
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "top": 40 + crunchOffset,
                    "shadow": {
                        "color": "#000000",
                        "offsetX": 1,
                        "offsetY": 3,
                        "blur": 3
                    }
                },

                "decBetBtn": {
                    "type": "Button",
                    "left": 8,
                    "top": 28,
                    "spriteSheet": {
                        "images": ["back_button"],
                        "frames": { "width": 21, "height": 22},
                        "animations": { "normal": [2], "hover": [3], "clicked": [0], "disabled": [1] }
                    },
                    "visible": true
                },
                "incBetBtn": {
                    "type": "Button",
                    "left": 153,
                    "top": 28,
                    "spriteSheet": {
                        "images": ["forward_button"],
                        "frames": { "width": 21, "height": 22},
                        "animations": { "normal": [2], "hover": [3], "clicked": [0], "disabled": [1] }
                    },
                    "visible": true
                }
            }
        },

        "containerOfLines": {
            "type": "Container",
            "left": 209,
            "top": 586,

            "children": {

                "background": {
                    "type": "Bitmap",
                    "src": "MG_meters_lines_label",
                    "left": 0,
                    "top": 0,
                    "visible": true
                },

                "linesLabel": {
                    "type": "Text",
                    "text": "LINES",
                    "font": "bold 16px Calibri",
                    "color": "#C2C2C2",
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "fontTransform": "uppercase",
                    "top": 17 + crunchOffset
                },
                "linesValue": {
                    "type": "Text",
                    "text": "20",
                    "font": "bold 20px Calibri",
                    "color": "#FFFFFF",
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "top": 40 + crunchOffset,
                    "shadow": {
                        "color": "#000000",
                        "offsetX": 1,
                        "offsetY": 3,
                        "blur": 3
                    }
                },

                "decLinesBtn": {
                    "type": "Button",
                    "left": 7,
                    "top": 28,
                    "spriteSheet": {
                        "images": ["back_button"],
                        "frames": { "width": 21, "height": 22},
                        "animations": { "normal": [2], "hover": [3], "clicked": [0], "disabled": [1] }
                    },
                    "visible": false
                },
                "incLinesBtn": {
                    "type": "Button",
                    "left": 66,
                    "top": 28,
                    "spriteSheet": {
                        "images": ["forward_button"],
                        "frames": { "width": 21, "height": 22},
                        "animations": { "normal": [2], "hover": [3], "clicked": [0], "disabled": [1] }
                    },
                    "visible": false
                }
            }
        },


        "containerOfTotalBet": {
            "type": "Container",
            "left":71,
            "top": 651,
            "children": {

                "background": {
                    "type": "Bitmap",
                    "src": "MG_meters_totalbet",
                    "left": 0,
                    "top": 0,
                    "visible": true
                },

                "totalBetLabel": {
                    "type": "Text",
                    "text": "TOTAL BET",
                    "font": "bold 16px Calibri",
                    "color": "#C2C2C2",
                    "top": 15 + crunchOffset,
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "fontTransform": "uppercase"
                },
                "totalBetValue": {
                    "type": "Text",
                    "text": "0.20 USD",
                    "font": "bold 20px Calibri",
                    "color": "#FFFFFF",
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "top": 34 + crunchOffset,
                    "shadow": {
                        "color": "#000000",
                        "offsetX": 1,
                        "offsetY": 3,
                        "blur": 3
                    }
                }
            }
        },

        "containerOfBalance": {
            "type": "Container",
            "left":647,
            "top": 651,
            "children": {

                "background": {
                    "type": "Bitmap",
                    "src": "MG_meters_balance_label",
                    "left": 0,
                    "top": 0,
                    "visible": true
                },

                "balanceLabel": {
                    "type": "Text",
                    "text": "BALANCE",
                    "font": "bold 16px Calibri",
                    "color": "#C2C2C2",
                    "top": 15 + crunchOffset,
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "fontTransform": "uppercase"
                },
                "balanceValue": {
                    "type": "Text",
                    "text": "500 USD",
                    "font": "bold 20px Calibri",
                    "color": "#FFFFFF",
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "top": 34 + crunchOffset,
                    "shadow": {
                        "color": "#000000",
                        "offsetX": 1,
                        "offsetY": 3,
                        "blur": 3
                    }
                }
            }
        },

        "containerOfFreeBetWins": {
            "type": "Container",
            "left":690,
            "top": 651,
            width: 212,
            "children": {

                "background": {
                    "type": "Bitmap",
                    "src": "MG_meters_balance_label",
                    "left": 0,
                    "top": 0,
                    "visible": true
                },

                "balanceLabel": {
                    "type": "Text",
                    "text": "FREE BETS WIN",
                    "font": "bold 16px Calibri",
                    "color": "#C2C2C2",
                    "top": 15 + crunchOffset,
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "fontTransform": "uppercase"
                },
                "balanceValue": {
                    "type": "Text",
                    "text": "0.00",
                    "font": "bold 20px Calibri",
                    "color": "#FFFFFF",
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "top": 34 + crunchOffset,
                    "shadow": {
                        "color": "#000000",
                        "offsetX": 1,
                        "offsetY": 3,
                        "blur": 3
                    }
                }
            },
            visible: false
        },


        "containerOfWin": {
            "type": "Container",
            "left":657,
            "top": 586,
            width: 273,
            "children": {

                "background": {
                    "type": "Bitmap",
                    "src": "MG_meters_win",
                    "left": 0,
                    "top": 0
                },

                "winLabel": {
                    "type": "Text",
                    "text": "WIN",
                    "font": "bold 16px Calibri",
                    "color": "#C2C2C2",
                    "top": 17 + crunchOffset,
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "lineHeight": 1,
                    "fontTransform": "uppercase"
                },
                "winValue": {
                    "type": "Text",
                    "text": "100 USD",
                    "font": "bold 20px Calibri",
                    "color": "#FFFFFF",
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "top": 40 + crunchOffset,
                    "shadow": {
                        "color": "#000000",
                        "offsetX": 1,
                        "offsetY": 3,
                        "blur": 3
                    }
                }
            }
        },

        /* freeGame control elements */

        "freeSpinBtn": {
            type: "Button",
            left: 422, //582 - (1280 - 960 = 320) /2
            top: 582,
            spriteSheet: {
                "images": ["free_spin_button"],
                "frames": { "width": 117, "height": 116},
                "animations": { "normal": [2], "hover": [2], "clicked": [2], "disabled": [2] }
            },
            visible: false,
            cursor: null
        },

        "spinCounter":{
            type: "Text",
            text: "50",
            "font": "bold 30pt Calibri",
            "color": "#FFFFFF",
            "left": "52.9%",
            top: 642 + crunchOffset,
            "textAlign": "center",
            "textBaseline": "middle",
            "shadow": {
                "color": "#000000",
                "offsetX": 1,
                "offsetY": 3,
                "blur": 3
            },
            "visible": false
        },

        "containerOfTotalWin": {
            "type": "Container",
            "left":101,
            "top": 586,
            "visible": false,
            "children": {

                "background": {
                    "type": "Bitmap",
                    "src": "MG_meters_win",
                    "left": 0,
                    "top": 0,
                    //width: 444,
                    "visible": true
                },

                "totalWinLabel": {
                    "type": "Text",
                    "text": "TOTAL WIN",
                    "font": "bold 16px Calibri",
                    "color": "#C2C2C2",
                    "top": 17 + crunchOffset,
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle"
                },
                "totalWinValue": {
                    "type": "Text",
                    "text": "100 USD",
                    "font": "bold 20px Calibri",
                    "color": "#FFFFFF",
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "top": 40 + crunchOffset,
                    "shadow": {
                        "color": "#000000",
                        "offsetX": 1,
                        "offsetY": 3,
                        "blur": 3
                    }
                }
            }
        },

        "containerOfBonusBet": {
            "type": "Container",
            top: 651,
            left: 236,
            "visible": false,
            "children": {

                "background": {
                    "type": "Bitmap",
                    "src": "MG_meters_balance_label",
                    "left": 0,
                    "top": 0
                },

                "betBonusLabel": {
                    "type": "Text",
                    "text": "TOTAL BET",
                    "font": "bold 16px Calibri",
                    "color": "#C2C2C2",
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "top": 15 + crunchOffset
                },

                "betBonusValue": {
                    "type": "Text",
                    "text": "0.01",
                    "font": "bold 20px Calibri",
                    "color": "#FFFFFF",
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    "top": 34 + crunchOffset,
                    "shadow": {
                        "color": "#000000",
                        "offsetX": 1,
                        "offsetY": 3,
                        "blur": 3
                    }
                }
            }
        },

        autoPlaySettingsContainer,
        autoPlayCounterContainer,
        autoPlayAdvancedSettingsContainer

    }

};

export default config;