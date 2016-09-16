import numbersSpriteSheet from "../../../../CommonComponents/BonusGame/viewHandler/elements/numbersSpriteSheet.js"
import {background, defaultFont, titleStyle} from "./styles";

import {left, center, right} from "../../../../CommonComponents/Freespins/viewHandler/freeSpinStartPopup/config";



let lineHeight = 20;

let strokeConfig = {
    color: "#FFFFFF",
    stroke: {
        color: "#1c595c",
        outline: 4,
        alpha: 0.5
    }
};

let leftCol = 152;
let rightCol = 585;

let crunchOffset = /Firefox/.test(navigator.userAgent) ? 4 : 0;

let scatters = {
    type: "Container",
    visible: false,

    children: {
        background: {
            type: "Bitmap",
            src: "background",
            scaleX: 1,
            scaleY: 1
        },

        titleLabel: Object.assign({}, titleStyle, {
            left: 205,
            align: undefined,
            textAlign: "center",
            text: "SCATTER"
        }),

        title2Label: Object.assign({}, titleStyle, {
            text: "free_spins",
            right: -20,
            //debugDrag: true
            align: undefined,
            textAlign: "center"
        }),

        scatterText: {
            type: "Container",
            width: 100,
            height: 70,
            left: 150,
            top: 180,

            children: {
                scatter_x3: Object.assign({}, defaultFont, {
                    text: "x3 = 5TB",
                    color: "#321809",
                    font: "bold 20px Arial"
                }),
                scatter_x2: Object.assign({}, defaultFont, {
                    text: "x2 = 2TB",
                    color: "#321809",
                    font: "bold 20px Arial",
                    top: 30
                })
            }
        },

        scatterDescription: Object.assign({}, defaultFont, {
            text: "scatter_freespins",
            font: "bold 16px Arial",
            top: 400,
            lineWidth: 200,
            left: 200
        }),
        scatterFreeDescription: Object.assign({}, defaultFont, {
            text: "scatter_desc_freespins",
            font: "bold 16px Arial",
            top: 150,
            lineWidth: 300,
            right: 40,
            left: undefined
        }),

        scatterFreeDescContainer: {
            type: "Container",
            width: 390,
            height: 225,
            right: 50,
            top: 210,
            children: {
                left: Object.assign({}, left, {
                    scaleX: 0.6,
                    scaleY: 0.6,
                    top: 110,
                    left: 0,
                    cursor: "default"
                }),
                center: Object.assign({}, center, {
                    scaleX: 0.6,
                    scaleY: 0.6,
                    top: 110,
                    left: 140,
                    cursor: "default"
                }),
                right: Object.assign({}, right, {
                    scaleX: 0.6,
                    scaleY: 0.6,
                    top: 110,
                    left: 280,
                    cursor: "default"
                })
            }
        }


    }
};

export default scatters;