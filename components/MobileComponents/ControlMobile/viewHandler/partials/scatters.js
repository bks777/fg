let lineHeight = 24;

import {left, center, right} from "../../../../CommonComponents/Freespins/viewHandler/freeSpinStartPopup/config";

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
    top: 490,

    children: {

        title: {
            "top": 20,
            "left": "50%",
            "type": "Text",
            "text": "SCATTER",
            "font": "bold 27pt Arial",
            "color": "#ffffff",
            "textAlign": "center",
            fontTransform: "uppercase"
        },

        topLine: {
            type: "Bitmap",
            src: "settings_top_line",
            width: "100%",
            top: 80
        },

        scatter_1: {
            type: "Container",
            width: 400,
            height: "500px",
            align: "center",

            children: {
                scatterText: {
                    type: "Container",
                    width: 100,
                    height: 70,
                    left: 280,
                    top: 190,

                    children: {
                        scatter_x3: Object.assign({}, defaultFont, {
                            text: "x3 = 5TB",
                            font: "bold 20px Arial"
                        }),
                        scatter_x2: Object.assign({}, defaultFont, {
                            text: "x2 = 2TB",
                            font: "bold 20px Arial",
                            top: 30
                        })
                    }
                },

                scatterSymbol: {
                    type: "ReelSymbol",
                    regX: "50%",
                    top: 145,
                    left: 130,
                    symbolNumber: 13
                },

                scatterDescription: Object.assign({}, defaultFont, {
                    text: "scatter_freespins",
                    font: "bold 22px Arial",
                    top: 320,
                    lineWidth: 300,
                    left: 200
                })
            }
        },

        scatter_2: {
            type: "Container",
            width: 400,
            top: 430,
            align: "center",

            children: {

                topLine: {
                    type: "Bitmap",
                    src: "settings_top_line",
                    width: "100%",
                    top: -30
                },

                scatterFreeDescription: Object.assign({}, defaultFont, {
                    text: "scatter_desc_freespins",
                    font: "bold 22px Arial",
                    top: 10,
                    lineWidth: 400,
                    left: 200
                }),

                scatterFreeDescContainer: {
                    type: "Container",
                    width: 350,
                    height: 225,
                    align: "center",
                    top: 110,
                    children: {
                        left: Object.assign({}, left, {
                            scaleX: 0.7,
                            scaleY: 0.7,
                            top: 110,
                            left: 0,
                            cursor: "default"
                        }),
                        center: Object.assign({}, center, {
                            scaleX: 0.7,
                            scaleY: 0.7,
                            top: 110,
                            left: 170,
                            cursor: "default"
                        }),
                        right: Object.assign({}, right, {
                            scaleX: 0.7,
                            scaleY: 0.7,
                            top: 110,
                            left: 340,
                            cursor: "default"
                        })
                    }
                }
            }

        }
    }
};

export default scatters;