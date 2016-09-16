let defaultFont = {
    type: "Text",
    font: "bold 22px Arial",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 24
};
let symbolsStyle = {
    type: "ReelSymbol" ,
    symbolNumber: 10,
    regX: "50%",
    top: 205
};


let wild = {
    type: "Container",
    width: "100%",
    //height:"100%",

    children: {

        title: {
            "top": 20,
            "left": "50%",
            "type": "Text",
            "text": "wild_title",
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

        topLabel: Object.assign ({}, defaultFont, {
            text: "wild_description",
            left: "50%",
            top: 110,
            lineWidth: 450
        }),

        wildX2: Object.assign ({}, symbolsStyle, {
            symbolNumber: 10,
            left: "29.4%"
        }),

        wildX3: Object.assign ({}, symbolsStyle, {
            symbolNumber: 11,
            left: "50%"
        }),

        wildX4: Object.assign ({}, symbolsStyle, {
            symbolNumber: 12,
            left: "70%"
        }),

        bottomLabel: Object.assign ({}, defaultFont, {
            text: "wild_bottom_text",
            left: "50%",
            top: 400,
            lineWidth: 450
        })
    }
};

export default wild;