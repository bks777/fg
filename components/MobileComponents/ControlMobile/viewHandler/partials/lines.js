import paytableSpriteSheet from "../../../../DesktopComponents/Paytable/viewHandler/paytableAtlasSpriteSheet";

let page_lines = {
    type: "Container",
        width: "100%",
        height: "100%",
        top: 390,

        children: {

            title: {
                "top": 70,
                "left": "50%",
                "type": "Text",
                "text": "lines_title",
                "font": "bold 27pt Arial",
                "color": "#ffffff",
                "textAlign": "center",
                fontTransform: "uppercase"
            },

            topLine: {
                type: "Bitmap",
                    src: "settings_top_line",
                    width: "100%",
                    top: 120
            },

            lines: {
                type: "Sprite",
                spriteSheet: paytableSpriteSheet,
                defaultAnimation: "paylines",
                align: "center",
                top: 150
            },

            promptLabel: {
                type: "Text",
                text: "paytable_prompt",
                font: "bold 16pt Arial",
                color: "#ffffff",
                textAlign: "center",
                lineHeight: 20,
                left: "50%",
                top: 420
            }
    }
};

export default page_lines;