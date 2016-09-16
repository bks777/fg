import {background, defaultFont, titleStyle} from "./styles";

let symbolsStyle = {
    type: "ReelSymbol" ,
    symbolNumber: 10,
    regX: "50%",
    top: 223
};

let wild = {
    type: "Container",

    children: {
        background,

        titleLabel: Object.assign ({}, titleStyle, {
            text: "wild_title"
        }),

        topLabel: Object.assign ({}, defaultFont, {
            text: "wild_description",
            left: "50%",
            top: 154,
            lineWidth: 280
        }),

        wildX2: Object.assign ({}, symbolsStyle, {
            symbolNumber: 10,
            left: "30%"
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
            bottom: 60,
            lineWidth: 300
        })
    }
};

export default wild;
