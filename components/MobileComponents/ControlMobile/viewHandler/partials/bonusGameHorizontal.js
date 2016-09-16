let lineHeight = 20;

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
    //height:"100%",
    top: 1300,

    children: {

        title: {
            "top": 10,
            "left": "50%",
            "type": "Text",
            "font": "bold 27pt Arial",
            "color": "#ffffff",
            "textAlign": "center"
        },

        topLine: {
            type: "Bitmap",
            src: "settings_top_line",
            width: "100%",
            top: 53
        }
    }
};

export default bonusGame;