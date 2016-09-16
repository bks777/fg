let defaultFont = {
    font: "bold 30px Arial",
    color: "#FFFFFF",
};

let leftCol = "50%";
let rightCol = "50%";

let lineHeight = 30;

let wild = {
    type: "Container",
    //height:"100%",
    //scaleX: 1.25,
    //scaleY: 1.25,
    //width: 960 / 1.25,

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

export default wild;