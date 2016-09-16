import scatters from "./partials/scattersVertical";
import wild from "./partials/wildVertical";
import bonusGame from "./partials/bonusGameVertical";

let menuPanelConfig = {
    top: 20,
    scaleX: 1,
    scaleY: 1
};

let verticalConfig = {
    background: {
        visible:true
    },
    main: {

        children: {
            SpinButton: {
               align: "center",

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
                        top: 180,
                        left: 83
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
               bottom: 35,
                children: {
                    "homeBtn": {

                    }
                }
            },
            settingsButton: {
                right: 20,
                bottom: 20,
                children: {
                    "settingBtn": {

                    }
                }
            },
            topBar: {
               visible:false
            },
            winBar: {
                top: 50,
                children: {
                    background: {
                       visible:false
                    },
                    winContainer: {
                        top: 37,
                        left: 0,
                        backgroundColor: "#000000",
                        width: "100%",
                        height: 44,
                        children: {
                            winText: {
                                left: "50%",
                                textAlign: "center",
                                top: 5
                            }
                        }
                    },
                    totalWinContainer: {
                        top: 0,
                        left: 0,
                        backgroundColor: "#000000",
                        width: "100%",
                        height: 40,
                        children: {
                            winText: {
                                color: "#16fcc3",
                                font: "28pt Calibri",
                                textAlign: "center",
                                left: "50%",
                                top: 8
                            }
                        }
                    }
                }
            }
        }
    },

    bottomBar: {
        top: 0,
        height: 40,

        children: {
            betText: {
                font: "22pt Calibri"
            },
            balanceText: {
                font: "22pt Calibri"
            }
        }
    },
    settingsPanel: {
        top: 40,
        //height: "100%",

        children: {
            menuPanel: {
                height: 84 * 2.22,
                verticalAlign: "bottom",

                children: {
                    soundMenu: Object.assign ({}, menuPanelConfig),
                    fastMenu: Object.assign ({}, menuPanelConfig),
                    payTableMenu: Object.assign ({}, menuPanelConfig),
                    betMenu: Object.assign ({}, menuPanelConfig),
                    infoMenu: Object.assign ({}, menuPanelConfig),
                    backMenu: Object.assign ({}, {
                        left: "83%",
                    }, menuPanelConfig)
                }
            },
            panel: {

                children: {

                    panelInfoMenu: {
                        children: {
                            panelWrapper: {
                                scaleX: 1.6,
                                scaleY: 1.6,
                                left: -(470 / 1.6),

                                children: {
                                    wild: {
                                        children: {
                                            topLine: {
                                                scaleX: 0.5,
                                                left: "20%"
                                            }
                                        }
                                    },
                                    scatters: {
                                        children: {
                                            topLine: {
                                                scaleX: 0.5,
                                                left: "20%"
                                            }
                                        }
                                    },
                                    bonusGame: {
                                        children: {
                                            topLine: {
                                                scaleX: 0.5,
                                                left: "20%"
                                            }
                                        }
                                    }
                                }

                                //height: 3912,
                                /*children: {
                                    wild,
                                    scatters,
                                    bonusGame
                                }*/
                            }
                        }
                    },

                    panelPayTable: {
                        children: {
                            panelWrapper: {}
                        }
                    }

                }
            }
        }
    }
};

export default verticalConfig;
