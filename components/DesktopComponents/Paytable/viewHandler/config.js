import buttons from "./partials/buttons";
import paytable from "./partials/paytable";
import lines from "./partials/lines";
import bonusGame from "./partials/bonusGame";
import scatters from "./partials/scatters";
import wild from "./partials/wild";

import {numbersSmallSpriteSheet} from "../../../CommonComponents/BonusGame/viewHandler/elements/numbersSpriteSheet.js"

let config = {

    infoPopup: {
        children: {
            pageContainer: {
                type: "Container",
                width: 960,
                //align: "center",
                left: 0,

                children: {
                    paytable,
                    lines,
                    wild,
                    scatters,
                    bonusGame
                }
            },

            buttons
        }
    },

    miniPaytablePopup: {
        correctionTop: -13,
        correctionLeft: 28,


        children: {
            background: {
                type: "Bitmap",
                src: "mini_background",
                scaleX: .7,
                scaleY: .7,

                cursor: "pointer"
            },

            scatterDescription: {
                type: "Container",
                left: "50%",
                width: "50%",
                height: "100%",

                visible: false,

                children: {
                    shadow: {
                        type: "Bitmap",
                        src: "miniBlockShadow",
                        left: -57,
                        top: 19,
                        //debugDrag: true,
                        height: 136,
                        zIndex: 1
                    },

                    /*x3: {
                        type: "Sprite",
                        width: 28,
                        height: 18,
                        left: -20,
                        verticalAlign: "middle",
                        spriteSheet: {
                            images: ["bonus_x_numbers"],
                            frames: { width: 64, height: 43},
                            animations: {
                                "3_yellow": 3
                            }
                        },
                        defaultAnimation: "3_yellow",
                        alias: "bonus"
                    },

                    x3equal: {
                        type: "Bitmap",
                        src: "equal",
                        left: 16,
                        verticalAlign: "middle",
                        scaleX: 0.7,
                        scaleY: 0.7,
                    },*/
                    x3: {
                        type: "Text",
                        width: 28,
                        height: 18,
                        left: -20,
                        top: 55,
                        //verticalAlign: "middle",
                        text: "x3 = 5TB",
                        color: "#321809",
                        font: "bold 20px Arial"
                    },
                    x2: {
                        type: "Text",
                        width: 28,
                        height: 18,
                        left: -20,
                        top: 85,
                        //verticalAlign: "middle",
                        text: "x2 = 2TB",
                        color: "#321809",
                        font: "bold 20px Arial"
                    }
                }
            },

            wildDescription: {
                type: "Container",
                left: "50%",
                width: "50%",
                height: "100%",
                visible: false,

                children: {
                    shadow: {
                        type: "Bitmap",
                        src: "miniBlockShadow",
                        left: -57,
                        top: 19,
                        //debugDrag: true,
                        height: 136,
                        zIndex: 1
                    },

                    "wildDescription": {
                        type: "Text",
                        font: "bold 15px Arial",
                        color: "#080d3e",
                        top: "25%",
                        left: "20%",
                        lineHeight: 27,
                        textAlign: "center",
                        verticalAlign: "middle",
                        lineWidth: 140,
                        text: "wild_description"
                    }
                }
            },

            bonusDescription: {
                type: "Container",
                left: "50%",
                width: "50%",
                height: "100%",
                visible: false,

                children: {
                    shadow: {
                        type: "Bitmap",
                        src: "miniBlockShadow",
                        left: -57,
                        top: 19,
                        //debugDrag: true,
                        height: 136,
                        zIndex: 1
                    },

                    "bonusDescription": {
                        type: "Text",
                        font: "bold 15px Arial",
                        color: "#3d1700",
                        top: "30%",
                        left: "20%",
                        lineHeight: 24,
                        textAlign: "center",
                        text: "bonus_description"
                    }
                }
            },

            simpleSymbolDescription: {
                type: "Container",
                left: "20%",
                height: "100%",
                visible: false,

                children: {
                    simpleSymbolDescriptionContainer: {
                        type: "Container",
                        left: -30,
                        height: "100%",
                        children: {

                            shadow: {
                                type: "Bitmap",
                                src: "miniSimpleShadow",
                                left: -66,
                                top: 23,
                                //debugDrag: true
                                zIndex: 1
                            },

                            x5: {
                                type: "Text",
                                text:"x5 = ",
                                left: -5,
                                top: "20%",
                                fontSize: "bold 22px",
                                color: "#3d1700"
                            },

                            x5Value: {
                                type: "BitmapText",
                                text: "555",
                                top: "20%",
                                left: 50,
                                alias: "bonus",

                                spriteSheet: numbersSmallSpriteSheet
                            },


                            x4: {
                                type: "Text",
                                text:"x4 = ",
                                left: -5,
                                top: "43%",
                                fontSize: "bold 22px",
                                color: "#3d1700"
                            },

                            x4Value: {
                                type: "BitmapText",
                                text: "55",
                                top: "43%",
                                left: 50,
                                alias: "bonus",
                                //scaleX: 0.3,
                                //scaleY: 0.3,

                                spriteSheet: numbersSmallSpriteSheet
                            },

                            x3: {
                                type: "Text",
                                text:"x3 = ",
                                left: -5,
                                top: "66%",
                                fontSize: "bold 22px",
                                color: "#3d1700"
                            },

                            x3Value: {
                                type: "BitmapText",
                                text: "5",
                                top: "66%",
                                left: 45,
                                alias: "bonus",
                                //scaleX: 0.3,
                                //scaleY: 0.3,

                                spriteSheet: numbersSmallSpriteSheet
                            }
                        }
                    }
                }
            },

            richSymbolDescription: {
                type: "Container",
                left: "20%",
                height: "100%",
                visible: false,

                children: {
                    simpleSymbolDescriptionContainer: {
                        type: "Container",
                        left: -30,
                        height: "100%",
                        children: {

                            shadow: {
                                type: "Bitmap",
                                src: "miniSimpleShadow",
                                left: -66,
                                top: 23//,
                                //debugDrag: true
                            },

                            x5: {
                                type: "Text",
                                text:"x5 = ",
                                left: -10,
                                top: "17%",
                                fontSize: "bold 22px",
                                color: "#3d1700"
                            },

                            x5Value: {
                                type: "BitmapText",
                                text: "555",
                                top: "17%",
                                left: 48,
                                alias: "bonus",

                                spriteSheet: numbersSmallSpriteSheet
                            },


                            x4: {
                                type: "Text",
                                text:"x4 = ",
                                left: -10,
                                top: "34%",
                                fontSize: "bold 22px",
                                color: "#3d1700"
                            },

                            x4Value: {
                                type: "BitmapText",
                                text: "55",
                                top: "34%",
                                left: 48,
                                alias: "bonus",
                                //scaleX: 0.3,
                                //scaleY: 0.3,

                                spriteSheet: numbersSmallSpriteSheet
                            },

                            x3: {
                                type: "Text",
                                text:"x3 = ",
                                left: -10,
                                top: "52%",
                                fontSize: "bold 22px",
                                color: "#3d1700"
                            },

                            x3Value: {
                                type: "BitmapText",
                                text: "5",
                                top: "52%",
                                left: 48,
                                alias: "bonus",
                                //scaleX: 0.3,
                                //scaleY: 0.3,

                                spriteSheet: numbersSmallSpriteSheet
                            },

                            x2: {
                                type: "Text",
                                text:"x2 = ",
                                left: -10,
                                top: "69%",
                                fontSize: "bold 22px",
                                color: "#3d1700"
                            },

                            x2Value: {
                                type: "BitmapText",
                                text: "5",
                                top: "69%",
                                left: 38,
                                alias: "bonus",
                                //scaleX: 0.3,
                                //scaleY: 0.3,

                                spriteSheet: numbersSmallSpriteSheet
                            }
                        }
                    }
                }
            },

            symbolContainer: {
                type: "Container",
                width: "50%",
                height: "100%"
            }
        }
    }
};

export default config;