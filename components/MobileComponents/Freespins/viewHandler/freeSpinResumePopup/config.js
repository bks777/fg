import spriteSheet from "../spriteSheetConfig";
import numbersSpriteSheet from "../elements/numbersSpriteSheet.js";

let singlePopup = {
    type: "Container",
    width: 221,
    top: "40%",
    left: "40%",
    cursor: "pointer",
    regX: 110,
    regY: 209,
    visible: false,
    children: {
        background: {
            type: "Sprite",
            spriteSheet,
            defaultAnimation: "fs_menu_1",
        },

        symbol: {
            type: "ReelSymbol" ,
            symbolNumber: 10,
            align: "center",
            top: 50
        },

        value: {
            type: "BitmapText",
            spriteSheet: numbersSpriteSheet,
            text: "15",
            //align:"center",
            left: "50%",
            top: 214+36,
            scaleX: 0.75,
            scaleY: 0.75,
            regX: "50%",
            regY: "50%",
            alias: "bonus"
        },

        attemptText: {
            type: "Text",
            text: "freespins_start_popup_bottom_text",
            font: "bold 16pt Arial",
            color: "#ECCB1F",
            left: "50%",
            textAlign: "center",
            top: 308,
            lineWidth: 200,
            stroke: {
                color: "#292020",
                outline: 3
            }
        }

    }

};

let left = getClone (singlePopup);
let center = getClone (singlePopup);

center.children.background.defaultAnimation = "fs_menu_2";
center.children.symbol.symbolNumber = 11;
center.children.value.text = "10";

let right = getClone (singlePopup);
right.children.background.defaultAnimation = "fs_menu_3";
right.children.symbol.symbolNumber = 12;
right.children.value.text = "5";

let startPopupConfig = {
    children: {
        black: {
            type: "Container",
            width: "100%",
            height: "100%",
            backgroundColor: "#000000",
            alpha: .75
        },


        left,
        center,
        right,

        message: {
            type: "Text",
            text: "freespins_resume_popup_top_text",
            font: "bold 16pt Arial",
            color: "#ECCB1F",
            top: "6%",
            left: "40%",
            textAlign: "center",
            stroke: {
                color: "#623C00",
                outline: 3
            },

            //top: "108%"
        }
    }
};

export default startPopupConfig;