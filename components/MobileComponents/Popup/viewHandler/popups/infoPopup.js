let infoPopup = {
    type: "Container",
        align: "center",
        //verticalAlign: "middle",

        children: {

        background: {
            type: "Bitmap",
                src: "UI_MG_popup_system",
                align: "center",
                zIndex: 0
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
                    color: "#f8a116",
                    "font": "bold 24pt Calibri",
                    left: "50%",
                    lineHeight: 32,
                    lineWidth: 500,

                    textAlign: "center",
                    verticalAlign: "middle"
                },

                okButton: {
                    type: "Container"
                }
            }
        }

    },
    visible: false
};

export default infoPopup;