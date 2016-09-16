let defaultFont = {
    type: "Text",
    font: "bold 16px Arial",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 25
};

let strokeConfig = {
    color: "#FFFFFF",
    stroke: {
        color: "#1c595c",
        outline: 3,
        alpha: 0.75
    }
};

let leftCol = "23%";
let rightCol = "77%";

let lineHeight = 20;

let wild = {
    type: "Container",
    width: "100%",
    //height:"100%",

    children: {

        title: {
            "top": 20,
            "left": "50%",
            "font": "bold 27pt Arial",
            "color": "#ffffff",
            "textAlign": "center"
        },

        topLine: {
            type: "Bitmap",
            src: "settings_top_line",
            width: "100%",
            top: 70
        }
    }
};

export default wild;