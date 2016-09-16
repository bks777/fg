let systemPopup = {
    type: "Container",
        align: "center",
        //verticalAlign: "middle",

        children: {

        background: {
            type: "Bitmap",
                src: "UI_MG_popup_system",
                align: "center",
                scaleX: 1.3,
                scaleY: 1.3,
                zIndex: 0
        },

        title: {
            type: "Text",
                text: "MESSAGE",
                "font": "bold 18pt Calibri",
                color: "#FFFFFF",
                top: 10,
                left: 10
        },

        messageContainer: {
            type: "Container",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",

                children: {
                    message: {
                        type: "Text",
                        text: "The game is currently not available.\nTry again later.",
                        color: "#FFFFFF",
                        "font": "bold 13pt Calibri",
                        left: "50%",
                        lineHeight: 18,
                        lineWidth: 380,

                        textAlign: "center",
                        verticalAlign: "middle"
                    },

                    okButton: {
                        type: "Container",
                        align: "center",
                        bottom: 50,

                        children: {
                            button: {
                                type: "Button",
                                "spriteSheet": {
                                    "images": ["popup_ok_button"],
                                    "frames": {"width": 48, "height": 25},
                                    "animations": {"normal": [2], "hover": [3], "clicked": [0], "disabled": [1]}
                                }
                            },

                            buttonText: {
                                type: "Text",
                                text: "Ok",
                                font: "bold 12pt Calibri",
                                "color": "#55702B",
                                "left": "50%",
                                "textAlign": "center",
                                "textBaseline": "middle",
                                top: "50%",
                                mouseEnabled: false
                            }
                        },
                        visible: false
                    }
            }
        }

    },
    visible: false
};

export default systemPopup;