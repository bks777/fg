import {numbersSmallSpriteSheet} from "../../../CommonComponents/BonusGame/viewHandler/elements/numbersSpriteSheet.js"

let config = {
    children: {
        "linesManager": {
            type: "LineCarribeanManager",
            rowPadding: 0,
            imageAlias: "line", /* if imageAlias = "line" then for line N alias for background  = "line_N"  */
            debug: false, /* if == N, then show only N line */

            defaultLine: {
                //width: "90%",
                //height: "100%",

                background: {
                    //width: "100%",
                    //scaleX: 1.6,
                    //scaleY: 1.4
                    //height: "100%"
                }

            },

            defaultLeftLine: {
                //align: "left",
                backgroundLeftAbsolute: 272 - 160,

                labels: {
                    "left": {
                        //align: "left",
                        leftAbsolute: 272 - 160 - 11,
                        font: "bold 14px Arial",
                        color: "#876a37",
                        backgroundImage: {
                            on: "marker_on",
                            off: "marker_off",
                            win: "star",
                            over_on: "marker_over_on",
                            over_off: "marker_over_off"
                        }
                    }
                }
            },

            defaultRightLine: {
                //align: "right",
                backgroundRightAbsolute: 1009 - 160,

                labels: {
                    "right": {
                        //align: "right",
                        leftAbsolute: 1009 - 160,
                        font: "bold 14px Arial",
                        color: "#876a37",

                        backgroundImage: {
                            on: "marker_on",
                            off: "marker_off",
                            win: "star",
                            over_on: "marker_over_on",
                            over_off: "marker_over_off"
                        }
                    }
                }
            },

            lines: {
                "1": {
                    type: "left",
                    backgroundTop: 4,
                    backgroundTopAbsolute: 305,
                    leftLabelTopAbsolute: 305,
                    start: {
                        row: 2,
                        position: 2
                    }
                },
                "2": {
                    type: "left",
                    backgroundTop: 4,
                    backgroundTopAbsolute: 182,
                    leftLabelTopAbsolute: 182,
                    start: {
                        row: 1,
                        position: 2
                    }
                },
                "3": {
                    type: "left",

                    backgroundTop: 4,
                    backgroundTopAbsolute: 462,
                    leftLabelTopAbsolute: 462,
                    start: {
                        row: 3,
                        position: 2
                    }
                },
                "4": {
                    type: "left",
                    backgroundTop: 29,
                    backgroundTopAbsolute: 215,
                    leftLabelTopAbsolute: 230,
                    start: {
                        row: 1,
                        position: 3
                    }
                },
                "5": {
                    type: "left",
                    backgroundTop: 430,
                    backgroundTopAbsolute: 131,
                    leftLabelTopAbsolute: 415,
                    start: {
                        row: 3,
                        position: 1
                    }
                },
                "6": {
                    type: "left",
                    backgroundTop: 367,
                    backgroundTopAbsolute: 132,
                    leftLabelTopAbsolute: 374,
                    start: {
                        row: 2,
                        position: 4
                    }
                },
                "7": {
                    type: "left",
                    backgroundTop: 0,
                    backgroundTopAbsolute: 272,
                    leftLabelTopAbsolute: 272,
                    start: {
                        row: 2,
                        position: 1
                    }
                },
                "8": {
                    type: "left",
                    backgroundTop: 4,
                    backgroundTopAbsolute: 132,
                    leftLabelTopAbsolute: 132,

                    start: {
                        row: 1,
                        position: 1
                    }
                },
                "9": {
                    type: "left",
                    backgroundTop: 533,
                    backgroundTopAbsolute: 165,
                    leftLabelTopAbsolute: 509,
                    start: {
                        row: 3,
                        position: 3
                    }
                },
                "10": {
                    type: "left",
                    backgroundTop: 267,
                    backgroundTopAbsolute: 163,
                    leftLabelTopAbsolute: 337,
                    start: {
                        row: 2,
                        position: 3
                    }
                },
                "11": {
                    type: "right",
                    backgroundTop: 3,
                    backgroundTopAbsolute: 132,
                    rightLabelTopAbsolute: 132,
                    start: {
                        row: 1,
                        position: 1
                    }
                },
                "12": {
                    type: "right",
                    backgroundTop: 242,
                    backgroundTopAbsolute: 354,
                    rightLabelTopAbsolute: 511,
                    start: {
                        row: 3,
                        position: 3
                    }
                },
                "13": {
                    type: "right",
                    backgroundTop: 3,
                    backgroundTopAbsolute: 182,
                    rightLabelTopAbsolute: 182,
                    start: {
                        row: 1,
                        position: 2
                    }
                },
                "14": {
                    type: "right",
                    backgroundTop: 382,
                    backgroundTopAbsolute: 214,
                    rightLabelTopAbsolute: 463,
                    start: {
                        row: 3,
                        position: 2
                    }
                },
                "15": {
                    type: "right",
                    backgroundTop: 3,
                    backgroundTopAbsolute: 232,
                    rightLabelTopAbsolute: 231,
                    start: {
                        row: 1,
                        position: 3
                    }
                },
                "16": {
                    type: "right",
                    backgroundTop: 382,
                    backgroundTopAbsolute: 165,
                    rightLabelTopAbsolute: 416,
                    start: {
                        row: 3,
                        position: 1
                    }
                },
                "17": {
                    type: "right",
                    backgroundTop: 192,
                    backgroundTopAbsolute: 148,
                    rightLabelTopAbsolute: 272,
                    start: {
                        row: 2,
                        position: 1
                    }
                },
                "18": {
                    type: "right",
                    backgroundTop: 79,
                    backgroundTopAbsolute: 321,
                    rightLabelTopAbsolute: 371,
                    start: {
                        row: 2,
                        position: 4
                    }
                },
                "19": {
                    type: "right",
                    backgroundTop: 25,
                    backgroundTopAbsolute: 288,
                    rightLabelTopAbsolute: 303,
                    start: {
                        row: 2,
                        position: 2
                    }
                },
                "20": {
                    type: "right",
                    backgroundTop: 240,
                    backgroundTopAbsolute: 181,
                    rightLabelTopAbsolute: 338,
                    start: {
                        row: 2,
                        position: 3
                    }
                }
            }
        },

        winLineAmount: {
            type: "Container",
            width: 258,
            height: 79,
            visible: false,
            children: {
                "background": {
                    type: "Bitmap",
                    src: "winLineAmountBackground",
                    left: "50%",
                    top: 40,
                    visible: true
                },
                value: {
                    type: "BitmapText",
                    text: "0",
                    alias: "bonus",
                    //scaleX: 0.4,
                    //scaleY: 0.4,
                    spriteSheet: numbersSmallSpriteSheet
                }
            }
        }
    },

    freezScatterScale: 1
};

export default config;