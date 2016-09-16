import {left, center, right} from "../../../../CommonComponents/Freespins/viewHandler/freeSpinStartPopup/config";

let lineHeight = 34;

let defaultFont = {
    font: "bold 30px Arial",
    color: "#FFFFFF",
    //lineHeight: lineHeight
};

let leftCol = "50%";
let rightCol = "50%";

let scatters = {
    type: "Container",
    width: "100%",
    height:"100%",
    top: 520,

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

export default scatters;