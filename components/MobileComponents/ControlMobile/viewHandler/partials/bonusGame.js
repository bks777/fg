let lineHeight = 24;

let defaultFont = {
    type: "Text",
    font: "bold 16px Arial",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: lineHeight
};

let bonusGame = {
    type: "Container",
    width: "100%",
    height:2000,
    top: 1350,

    children: {

        title: {
            "top": 10,
            "left": "50%",
            "type": "Text",
            text: "bonus_title",
            "font": "bold 27pt Arial",
            "color": "#ffffff",
            "textAlign": "center",
            fontTransform: "uppercase"
        },

        topLine: {
            type: "Bitmap",
            src: "settings_top_line",
            width: "100%",
            top: 73
        },

        bonus_1: {
            type: "Container",
            width: 400,
            height: "500px",
            align: "center",

            children: {

                bonusSymbol: {
                    type: "ReelSymbol",
                    regX: "50%",
                    top: 115,
                    left: 195,
                    symbolNumber: 14
                },

                bonusDescription: Object.assign({}, defaultFont, {
                    text: "trigger_bonus_game",
                    font: "bold 22px Arial",
                    top: 290,
                    lineWidth: 350,
                    left: 200
                })
            }
        },

        bonus_2: {
            type: "Container",
            width: 400,
            height: "500px",
            align: "center",
            top: 430,

            children: {

                topLine: {
                    type: "Bitmap",
                    src: "settings_top_line",
                    width: "100%",
                    top: -50
                },

                screen_1: {
                    type: "Bitmap",
                    src: "screen_1",
                    visible: true,
                    top: 0,
                    regX: "50%",
                    left: 235,
                    scaleX: 1.2,
                    scaleY: 1.2
                },

                bonusPrompt: Object.assign({}, defaultFont, {
                    text: "bonus_prompt",
                    font: "bold 20px Arial",
                    lineWidth: 450,
                    left: 200,
                    top: 260
                })
            }
        }
    }
};

export default bonusGame;