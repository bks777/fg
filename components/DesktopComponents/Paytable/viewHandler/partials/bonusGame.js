import {background, defaultFont, titleStyle} from "./styles";

let screenShotStyle = {
    type: "Bitmap",
    src: "screen_1",
    visible: true,
    left: 460,
    top: 162,
    //scaleX: 0.9,
    //scaleY: 0.9
};

let screenshotLabelStyle = Object.assign({}, defaultFont, {
    top: 378,
    left: 604,
    visible: true
});

let bonusGame = {
    type: "Container",
    //align: "center",
    visible: false,
    cache: false,

    children: {
        background,

        titleLabel: Object.assign ({}, titleStyle, {
            text: "bonus_title"
        }),

        bonusSymbol: {
            type: "ReelSymbol" ,
            symbolNumber: 14,
            regX: "50%",
            left: 165,
            top: 170
        },

        bonusTriggerText: Object.assign ({}, defaultFont, {
            text: "trigger_bonus_game",
            top: 322,
            left: 165,
            lineWidth: 150
        }),

        screen_1: Object.assign ({}, screenShotStyle, {
            src: "screen_1"
        }),

       /* screen_2: Object.assign ({}, screenShotStyle, {
            src: "screen_2"
        }),

        screen_3: Object.assign ({}, screenShotStyle, {
            src: "screen_3"
        }),*/

        bonusPrompt: Object.assign({}, screenshotLabelStyle, {
            text: "bonus_prompt",
            lineWidth: 350,
            right: -70,
            left: undefined
        }),

       /* screenshotLabel_2: Object.assign({}, screenshotLabelStyle, {
            text: "bonus_crash_the_ice"
        }),

        screenshotLabel_3: Object.assign({}, screenshotLabelStyle, {
            text: "bonus_choose_multipliers"
        }),*/

        papirusLife: {
            type: "Container",
            top: 130,
            left: 670,

            width: 265,
            scaleX: 0.6,
            scaleY: 0.6,

            children: {
                background: {
                    type: "Bitmap",
                    src: "papirus",
                    alias: "bonus"
                },

                heart_1: {
                    type: "Bitmap",
                    src: "heart",
                    alias: "bonus",
                    regX: "50%",
                    regY: "50%",
                    top: "50%",
                    left: "25%"
                },

                heart_disable_2: {
                    type: "Bitmap",
                    src: "heart_disable",
                    alias: "bonus",
                    regX: "50%",
                    regY: "50%",
                    top: "50%",
                    left: "50%"
                },

                heart_disable_3: {
                    type: "Bitmap",
                    src: "heart_disable",
                    alias: "bonus",
                    regX: "50%",
                    regY: "50%",
                    top: "50%",
                    left: "75%"
                }
            }
        }

    }
};

export default bonusGame;