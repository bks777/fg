import {background, defaultFont, titleStyle} from "./styles";

let paytable = {
    type: "Container",

    children: {
        background,

        titleLabel: Object.assign ({}, titleStyle, {
            text: "paytable_title"
        }),

        promptLabel: Object.assign ({}, defaultFont, {
            text: "paytable_prompt",
            left: "50%",
            bottom: 30
        })
    }
};

export default paytable;