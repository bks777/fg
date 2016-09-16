let config = {
    "layerSizeType": "overLayer",
    zIndex: 100,
    "children": {

        "main": {
            type: "Container",
            backgroundColor: "#000",
            width: "100%",
            height: "100%",

            children: {
                logoCompany: {
                    type: "Sprite",
                    framerate: 30,
                    align: "center",
                    top: "40%",
                    spriteSheet: {
                        images: ["logo"],
                        frames: {
                            width: 254,
                            height: 60,
                            count: 12,
                            framerate: 10
                        },
                        animations: {
                            last: 39
                        }
                    }
                },

                logoGame: {
                    type:"Container",
                    align: "center",
                    //top: "20%",
                    verticalAlign: "middle",
                    height: 530,
                    visible: false,

                    children: {
                        "preloaderImage": {
                            "type": "Bitmap",
                            "src": "loader"
                        },
                        "loadingText": {
                            type: "Text",
                            text: "30%",
                            font: "bold 23px Arial",
                            color: "#9cdfb6",
                            left: "50%",
                            textAlign: "center",
                            textBaseline: "bottom",
                            bottom: 25,
                            visible: false
                        },
                        "progressContainer": {
                            type: "Container",
                            left: 305,
                            bottom: 19,
                            width: 500,
                            height: 30,

                            children: {
                                "progressbarBackground": {
                                    type: "Bitmap",
                                    src: "progressbar_background"
                                },
                                "progressbar": {
                                    type: "Bitmap",
                                    src: "progressbar",
                                    top: 4
                                }
                            }
                        }
                    }
                }


            }
        }
    }
};

export default config;
