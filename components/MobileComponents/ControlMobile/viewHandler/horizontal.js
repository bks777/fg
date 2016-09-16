import scatters from "./partials/scattersHorizontal";
import wild from "./partials/wildHorizontal";
import bonusGame from "./partials/bonusGameHorizontal";


let menuPanelConfig = {
    top: 5,
    scaleX: 1 / 1.9,
    scaleY: 1 / 1.9
};



let horizontalConfig = {
    background: {
        visible: false
    },
    main: {

        children: {
            SpinButton: {
                verticalAlign: "middle",
                right: 20,

                children: {
                    "expandSpinSettingsContainer": {

                        children: {
                            "expandSpinSettings": {

                                children: {
                                    "bg": {

                                    },
                                    "close": {

                                    },
                                    "autoBtn": {

                                        children: {
                                            "autoIcon": {

                                            },
                                            autoIconText: {

                                            }
                                        }
                                    },
                                    "fastBtn": {

                                        children: {
                                            fastButton: {

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "expandVerticalFastSettings": {

                        children: {
                            "bg": {

                            },
                            "fastBtnV": {

                                children: {
                                    fastButtonV: {

                                    }
                                }
                            }
                        }
                    },
                    "expandVerticalNormalSettings": {

                        children: {
                            "bg": {

                            },
                            "autoBtnV": {

                                children: {
                                    "autoIconV": {

                                    },
                                    autoIconTextV: {

                                    }
                                }
                            }
                        }

                    },
                    "defaultSpinBtn": {

                    },
                    "giftKey": {
                        children: {
                            "giftSpinBtn": {

                            },

                            giftSpinCounter: {

                            }
                        }
                    },
                    "expandSpinBtn": {
                        top: 80,
                        left: -20
                    },
                    "spinBtnStatesGl": {

                    },
                    "states": {
                        children: {
                            "play": {

                            },
                            "stop": {

                            },
                            "freeCounter": {

                            }
                        }
                    }
                }
            },
            homeButton: {
                top: 60,

                children: {
                    "homeBtn": {

                    }
                }
            },
            settingsButton: {
                left: 20,
                verticalAlign: "middle",

                children: {
                    "settingBtn": {

                    }
                }
            },
            topBar: {
                visible:true
            },
            winBar: {
                bottom: 34,

                children: {
                    background: {
                        visible:true
                    },
                    winContainer: {
                        top: 5,
                        left: "1%",
                        backgroundColor: "",
                        width: 0,
                        height: 0,
                        children: {
                            winText: {
                                font: "32pt Calibri",
                                color: "#fca316",
                                textAlign: "left",
                                top: 0,
                                left:0
                            }
                        }
                    },
                    totalWinContainer: {
                        top: 5,
                        backgroundColor: "",
                        left: "99%",
                        width: 0,
                        height: 0,
                        children: {
                            winText: {
                                font: "32pt Calibri",
                                color: "#fca316",
                                textAlign: "right",
                                top: 0,
                                left:0
                            }
                        }
                    }
                }
            }
        }
    },

    bottomBar: {
        verticalAlign: "bottom",

        children: {
            betText: {
                "font": "16pt Calibri",
            },
            balanceText: {
                "font": "16pt Calibri",
            }
        }
    },
    settingsPanel: {
        top: 0,
        children: {
            menuPanel: {
                height: 84,
                verticalAlign: "bottom",

                children: {
                    soundMenu: Object.assign ({}, menuPanelConfig),
                    fastMenu: Object.assign ({}, menuPanelConfig),
                    payTableMenu: Object.assign ({}, menuPanelConfig),
                    betMenu: Object.assign ({}, menuPanelConfig),
                    infoMenu: Object.assign ({}, menuPanelConfig),
                    backMenu: Object.assign ({}, {
                        left: "90%",
                    },menuPanelConfig)
                }
            },

            panel: {

                children: {

                    panelInfoMenu: {
                        children: {
                            panelWrapper: {
                                //height: 1200,
                                scaleX: 1,
                                scaleY: 1,
                                left: 0,
                                /*children: {
                                    wild,
                                    scatters,
                                    bonusGame
                                }*/

                                children: {
                                    wild: {
                                        children: {
                                            topLine: {
                                                scaleX: 0.86,
                                                left: 0
                                            }
                                        }
                                    },
                                    scatters: {
                                        children: {
                                            topLine: {
                                                scaleX: 0.86,
                                                left: 0
                                            }
                                        }
                                    },
                                    bonusGame: {
                                        children: {
                                            topLine: {
                                                scaleX: 0.86,
                                                left: 0
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },

                    panelPayTable: {
                        children: {
                            panelWrapper: {


                            }
                        }
                    }

                }
            }
        }
    }

};

export default horizontalConfig;