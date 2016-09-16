import {background, defaultFont, titleStyle} from "./styles";
import paytableSpriteSheet from "../paytableAtlasSpriteSheet";

let lines = {
    type: "Container",
    visible: false,

    children: {
        background,

        titleLabel: Object.assign ({}, titleStyle, {
            text: "lines_title"
        }),

        lines: {
            type: "Sprite",
            spriteSheet: paytableSpriteSheet,
            defaultAnimation: "paylines",
            align: "center",
            top: 150
        },

        promptLabel: Object.assign ({}, defaultFont, {
            text: "paytable_prompt",
            left: "50%",
            bottom: 30
        })
    }
};

export default lines;