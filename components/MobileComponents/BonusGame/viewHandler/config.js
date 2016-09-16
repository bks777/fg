let config = {

    layerSizeType: "fullsize",

    children: {

        roof: {
            type: "Container",
            width: 1280,
            height: 157,
            top: 1
        },

        background: {
            type: "Bitmap",
            src: "background",
            top: 158,
        },

        floor: {
            type: "Container",
            width: 1280,
            height: 157,
            top: 720-157
        },

        columnContainer: {
            type: "Container",
            top: 158,
            height: 405
        },

        elementsContainer: {
            type: "Container",
            top: 158,
            height: 405,
            width: "100%"
        },

        papirusRounds: {
            type: "Container",
            top: 40,
            left: 200,

            children: {
                background: {
                    type: "Bitmap",
                    src: "papirus"
                },

                roundText: {
                    type: "Text",
                    top: 26,
                    text: "bonus_rounds_left",
                    left: "50%",
                    textAlign: "center",
                    font: "bold 20pt Arial",
                    color: "#2d1e04"
                },

                levelMap: {
                    type: "Bitmap",
                    src: "level_map",
                    align: "center",
                    top: 60
                }
            }
        },

        papirusLife: {
            type: "Container",
            top: 40 + 48,
            right: 200-132,
            width: 265,
            height: 97,
            regX: "50%",
            regY: "50%",

            children: {
                background: {
                    type: "Bitmap",
                    src: "papirus"
                },

                heart_disable_1: {
                    type: "Bitmap",
                    src: "heart_disable",
                    regX: "50%",
                    regY: "50%",
                    top: "50%",
                    left: "25%"
                },

                heart_disable_2: {
                    type: "Bitmap",
                    src: "heart_disable",
                    regX: "50%",
                    regY: "50%",
                    top: "50%",
                    left: "50%"
                },

                heart_disable_3: {
                    type: "Bitmap",
                    src: "heart_disable",
                    regX: "50%",
                    regY: "50%",
                    top: "50%",
                    left: "75%"
                },

                heart_1: {
                    type: "Bitmap",
                    src: "heart",
                    regX: "50%",
                    regY: "50%",
                    top: "50%",
                    left: "25%"
                },

                heart_2: {
                    type: "Bitmap",
                    src: "heart",
                    regX: "50%",
                    regY: "50%",
                    top: "50%",
                    left: "50%"
                },

                heart_3: {
                    type: "Bitmap",
                    src: "heart",
                    regX: "50%",
                    regY: "50%",
                    top: "50%",
                    left: "75%"
                }
            }
        },

        promptText: {
            type: "Text",
            text: "bonus_prompt_text",
            top: 65,
            left: "50%",
            textAlign:"center",
            lineWidth: 270,
            color:"#9ba5c3",
            font: "bold 11pt Arial"
        }

    }
};

export default config;