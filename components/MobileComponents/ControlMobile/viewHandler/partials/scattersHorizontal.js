let lineHeight = 20;

let defaultFont = {
    type: "Text",
    font: "bold 16px Arial",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: lineHeight
};

let strokeConfig = {
    color: "#FFFFFF",
    stroke: {
        color: "#1c595c",
        outline: 4,
        alpha: 0.5
    }
};

let leftCol = "25%";
let rightCol = "72%";

let scatters = {
    type: "Container",
    width: "100%",
    height:"100%",
    top: 470,

    children: {

        title: {
            "top": 20,
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
            top: 60
        }
    }
};

export default scatters;