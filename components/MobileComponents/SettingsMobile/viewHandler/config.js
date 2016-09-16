let config = {
    layerSizeType: "overLayer",
    zIndex: 10,

    children: {

        "topBar": {
            type: "Container",
            width: "100%",
            height: 52,
            backgroundColor: "#000",

            children: {
                "messageContainer": {
                    type: "Container",
                    width: 607,
                    height: 52,
                    align: "center",
                    overflow: "hidden",
                    children: {
                        "message": {
                            type: "Text",
                            font: "16pt Calibri",
                            text: "This is the first message in this toolbar",
                            color: "#FFFFFF",
                            textBaseline: "middle",
                            top: "50%",
                            visible: true
                        }
                    }
                },
                "fastMessageContainer": {
                    type: "Container",
                    width: 607,
                    height: 52,
                    align: "center",
                    overflow: "hidden",
                    children: {
                        "fastMessage": {
                            type: "Text",
                            font: "16pt Calibri",
                            text: "",
                            color: "#FFFFFF",
                            textBaseline: "middle",
                            top: "50%",
                            visible: true
                        }
                    },
                    alpha: 0,
                    visible: false
                }

            }
        }

    }
};

export default config;