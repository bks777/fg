let lineHeight = 34;

let defaultFont = {
    type: "Text",
    font: "bold 30px Arial",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: lineHeight
};

let bonusGame = {
    type: "Container",
    width: "100%",
    //height:"100%",
    top: 1550,

    children: {

        title: {
            "top": 20,
            "left": "50%",
            "font": "bold 40pt Arial",
            "color": "#ffffff",
            "textAlign": "center"
        },

        topLine: {
            type: "Bitmap",
            src: "settings_top_line",
            width: "100%",
            top: 90
        }
    }
};

export default bonusGame;