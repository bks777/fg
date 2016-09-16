import numbersSpriteSheet from "../../../../CommonComponents/BonusGame/viewHandler/elements/numbersSpriteSheet.js"
let crunchOffset = /Chrome/.test(navigator.userAgent) && /Win/.test(navigator.platform) ? -3 : 0;

let defaultFont = {
    type: "Text",
    font: "bold 34px Arial",
    color: "#fbffb8",
    left: "50%",
    textAlign: "center",
    //verticalAlign: "middle",
    lineHeight: 40,
    lineWidth: 400,
    stroke: {
        color: "#2c4f5f",
        outline: 4,
        alpha: 0.75,
        offsetY: 3
    }
};

let message_free_spins_start = {
    type: "Container",
    width: "100%",
    height: "100%",

    children: {
        message_1: Object.assign ({}, defaultFont, {
            text: "free_spins_start_congratulations",
            font: "bold 24px Arial",
            textAlign: "left",
            left: "50%",
            top: 92
        }),
        message_2: Object.assign ({}, defaultFont, {
            text: "free_spins_start_you_won",
            top: 155,
            left: 158,
            textAlign:"left",
            font: "bold 18px Arial"
        }),

        message_3: Object.assign ({}, defaultFont, {
            text: "free_spins_start_free_spins",
            top: 155,
            left: 321,
            textAlign:"left",
            font: "bold 18px Arial"
        }),

        winValue: {
            type: "BitmapText",
            text: "15",
            left: "50%",
            scaleX: 0.4,
            scaleY: 0.4,
            top: 143,
            alias: "bonus",

            spriteSheet: numbersSpriteSheet
        }
    }
};
let message_free_spins_end = {
    type: "Container",
    width: "100%",
    height: "100%",

    children: {
        message_1: Object.assign ({}, defaultFont, {
            text: "Congratulations!",
            font: "bold 24px Arial",
            textAlign: "left",
            left: "50%",
            top: 70,
        }),
        message_2: Object.assign ({}, defaultFont, {
            text: "free_spins_end_you_won",
            top: 184,
            left: "50%",
            textAlign:"left",
            font: "bold 18px Arial",

        }),

        winValue: {
            type: "BitmapText",
            text: "15",
            left: "50%",
            scaleX: 0.4,
            scaleY: 0.4,
            top: 125,
            alias: "bonus",
            
            spriteSheet: numbersSpriteSheet
        }
    }
};
let message_free_spins_end_zero = {
    type: "Container",
    width: "100%",
    height: "100%",

    children: {
        message_1: Object.assign ({}, defaultFont, {
            text: "Better luck next time!",
            font: "bold 18px Arial",
            textAlign: "left",
            left: "50%",
            top: "50%",
            
        })
    }
};
let message_free_spins_add = {
    type: "Container",
    width: "100%",
    height: "100%",

    children: {
        message_1: Object.assign ({}, defaultFont, {
            text: "Congratulations!",
            font: "bold 24px Arial",
            textAlign: "left",
            left: "50%",
            top: 66,
        }),
        message_2: Object.assign ({}, defaultFont, {
            text: "free_spin_add_you_won",
            top: 112,
            left: "50%",
            textAlign:"left",
            font: "bold 18px Arial"
        }),

        message_3: Object.assign ({}, defaultFont, {
            text: "additional Free Spins!",
            top: 157,
            left: "50%",
            textAlign:"center",
            font: "bold 18px Arial"
        }),

        winValue: {
            type: "BitmapText",
            text: "15",
            left: "50%",
            top: "50%",
            scaleX: 0.4,
            scaleY: 0.4,
            //top: 199,
            alias: "bonus",
            
            spriteSheet: numbersSpriteSheet
        }
    }
};
let message_bonus_start = {
    type: "Container",
    width: "100%",
    height: "100%",

    children: {
        message_1: Object.assign ({}, defaultFont, {
            text: "Congratulations!",
            font: "bold 24px Arial",
            textAlign: "left",
            left: "50%",
            top: 80
            
        }),
        message_2: Object.assign ({}, defaultFont, {
            text: "You won Bonus game!",
            left: "50%",
            top: "54%",
            textAlign:"left",
            font: "bold 18px Arial",
            
        })
    }
};

let message_auto_game_end = {
    type: "Container",
    width: "100%",
    height: "100%",

    children: {
        message_1: {
            type: "Container",
            left: "50%", //255 for russian, 248 - zh, 215 - tr, 225 - es
            top: 106,
            width:160,
            height: 30,
            children: {
                message: Object.assign ({}, defaultFont, {
                    text: "Spins made:",
                    font: "bold 18px Arial",
                    textAlign: "left",
                    left: 0,
                    top: 0,
                    
                }),
                winValue: {
                    type: "BitmapText",
                    text: "15",
                    left: 182,
                    scaleX: 0.4,
                    scaleY: 0.4,
                    top: -4,
                    alias: "bonus",
                    
                    spriteSheet: numbersSpriteSheet
                }

            }
        },

        message_2: Object.assign ({}, defaultFont, {
            text: "Resume autoplay?",
            top: 158,
            left: "50%",
            textAlign:"left",
            font: "bold 18px Arial",
        })

    }
};

let gamePopup = {
    type: "Container",
    align: "center",
    //verticalAlign: "middle",
    width: 503,
    height: 308,

    children: {

        background: {
            type: "Bitmap",
            src: "popup_back",
            zIndex: 0,
            //left:15,
            //top:30,
            //debugDrag:true
        },

        messageAliasContainer: {
            type: "Container",
            width: "100%",
            height: "100%",
            zIndex: 10,
            children: {
                message_free_spins_start,
                message_free_spins_end,
                message_free_spins_end_zero,
                message_free_spins_add,
                message_bonus_start,
                message_auto_game_end
            }
        },

        messageContainer: {
            type: "Container",
            width: "100%",
            height: "100%",
            zIndex: 10,
            children: {

                message: {
                    type: "Text",
                    text: "The game is currently not available.\nTry again later.",
                    font: "bold 34px Arial",
                    color: "#fbffb8",
                    left: "50%",
                    lineHeight: 40,
                    lineWidth: 400,

                    stroke: {
                        color: "#2c4f5f",
                        outline: 4,
                        alpha: 0.75
                    },

                    textAlign: "center",
                    verticalAlign: "middle"
                }
            }
        },

        okButton: {
            type: "Container",
            //align: "center",
            left: "50%",
            width: 110,
            height: 37,
            regX: "50%",
            regY: "50%",
            bottom: 3,
            zIndex: 10,
            children: {
                button: {
                    type: "Button",
                    //scaleX: 1.5,
                    //scaleY: 1.5,
                    "width": 110,
                    "height": 37,
                    "spriteSheet": {
                        "images": ["popup_ok_button"],
                        "frames": {"width": 48, "height": 25},
                        "animations": {"normal": [2], "hover": [3], "clicked": [0], "disabled": [1]}
                    }
                },

                buttonText: {
                    type: "Text",
                    text: "OK",
                    font: "bold 14pt Calibri",
                    "color": "#55702B",
                    "left": "50%",
                    "textAlign": "center",
                    "textBaseline": "middle",
                    top: 22+crunchOffset,
                    mouseEnabled: false
                }
            }
        }

    },
    visible: false
};


export default gamePopup;