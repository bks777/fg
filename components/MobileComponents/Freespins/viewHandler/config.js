import spriteSheet from "./spriteSheetConfig";

let config = {
    layerSizeType: "fullsize",
    zIndex: 60,

    children: {
        girl: {
            type: "Sprite",
            top: 407,
            left: 159,
            spriteSheet,
            defaultAnimation: "freespins_girl",
            framerate: 18,
        },

        cutLine: {
            type: "Bitmap",
            top: 50,
            align:"center",
            src: "cut_line"
        },

        corner: {
            type: "Bitmap",
            top: 482,
            left: 952,
            src: "corner",
        },

        header: {
            type: "Sprite",
            top: 42,
            left: 511,
            spriteSheet,
            defaultAnimation: "Cut_head_10",
        }
    }
};


export default config;