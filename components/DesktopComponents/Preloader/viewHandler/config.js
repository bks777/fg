let config = {
    "layerSizeType": "overLayer",
    zIndex: 100,
    "children": {
        "wrapper": {
            type: "Container",
            width: "100%",
            height: "100%",

            children: {
                "main": {
                    type: "Container",
                    width: 1280,
                    height: 720,
                    align:"center",

                    children: {
                        background1: {
                            type:"Bitmap",
                            src: "background",
                            width: "50%",
                            height: "100%"
                        },
                        background2: {
                            type:"Bitmap",
                            src: "background",
                            left: 1280,
                            width: "50%",
                            height: "100%",
                            scaleX: -1
                        },

                        button: {
                            type: "Container",
                            top: 628,
                            left: "50%",

                            visible: false,

                            children: {
                                /*background: {
                                    type:"Bitmap",
                                    src: "start_screen_button"
                                },
                                 */
                                arrow: {
                                    type:"Bitmap",
                                    src: "start_screen_arrow",
                                    top: 23,
                                    left: 5
                                }
                            }
                        },

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
                            width: "100%",
                            top: 0,
                            visible: false,

                            children: {
                                "preloaderImage": {
                                    "type": "Bitmap",
                                    "src": "loader",
                                    align: "center",
                                    top: 2
                                },
                                "loadingText": {
                                    type: "Text",
                                    text: "30%",
                                    font: "bold 23px Arial",
                                    color: "#9cdfb6",
                                    left: "50%",
                                    textAlign: "center",
                                    textBaseline: "bottom",
                                    top: 645
                                    //debugDrag: true
                                },
                                "progressbarBackground": {
                                    type: "Bitmap",
                                    src: "progressbar_background",
                                    align: "center",
                                    top: 660
                                },
                                "progressbar": {
                                    type: "Bitmap",
                                    src: "progressbar",
                                    left: 466,
                                    top: 665
                                },
                                /*"screenshot": {
                                    type: "Bitmap",
                                    src: "screenshot",
                                    //left: 456,
                                    align:"center",
                                    top: 274,
                                    //scaleX: 0.67,
                                    //scaleY: 0.67
                                },

                                "scatter": {
                                    type: "Bitmap",
                                    src: "scatter",
                                    left: 863,
                                    top: 286
                                },

                                "bonus": {
                                    type: "Bitmap",
                                    src: "bonus",
                                    left: 259,
                                    top: 291
                                },

                                "bonusText": {
                                    type: "Text",
                                    text: "preloader_bonus_description",
                                    font: "bold 14px Arial",
                                    color: "#FFF",
                                    left: 327,
                                    top: 250,
                                    textAlign: "center",
                                    textBaseline: "bottom",
                                    lineHeight: 16

                                },

                                "scatterTopText": {
                                    type: "Text",
                                    text: "preloader_scatter_top_description",
                                    font: "bold 14px Arial",
                                    color: "#FFF",
                                    left: 928,
                                    top: 250,
                                    textAlign: "center",
                                    textBaseline: "bottom",
                                    lineHeight: 16
                                },

                                "scatterBottomText": {
                                    type: "Text",
                                    text: "preloader_scatter_bottom_description",
                                    font: "bold 14px Arial",
                                    color: "#FFF",
                                    left: 928,
                                    top: 410,
                                    textAlign: "center",
                                    textBaseline: "bottom",
                                    lineHeight: 16
                                },

                                "wildTopText": {
                                    type: "Text",
                                    text: "preloader_wild_top_description",
                                    font: "bold 14px Arial",
                                    color: "#FFF",
                                    left: "50%",
                                    top: 219,
                                    textAlign: "center",
                                    lineHeight: 16
                                },

                                "wildBottomText": {
                                    type: "Text",
                                    text: "preloader_wild_bottom_description",
                                    font: "bold 14px Arial",
                                    color: "#FFF",
                                    left: "50%",
                                    top: 473,
                                    textAlign: "center",
                                    textBaseline: "bottom",
                                    lineHeight: 16
                                }*/

                                gameSlider: {
                                    type: "Container",
                                    width: 790,
                                    height: 437,
                                    left: 243,
                                    top: 147,

                                    children: {

                                        step1: {
                                            type: "Container",
                                            width: "100%",
                                            height: "100%",
                                            alpha: 1,

                                            children: {
                                                "scatter": {
                                                    "type": "Bitmap",
                                                    src: "scatter",
                                                    top: 102,
                                                    left: 158
                                                },
                                                "scatterTopText": {
                                                    type: "Text",
                                                    text: "preloader_scatter_top_description",
                                                    font: "bold 20px Arial",
                                                    color: "#ffe775",
                                                    left: 230,
                                                    top: 280,
                                                    textAlign: "center",
                                                    textBaseline: "bottom",
                                                    lineHeight: 23
                                                },
                                                bonus: {
                                                    type: "Bitmap",
                                                    src: "bonus",
                                                    top: 102,
                                                    left: 516
                                                },
                                                "bonusText": {
                                                    type: "Text",
                                                    text: "preloader_bonus_description",
                                                    font: "bold 20px Arial",
                                                    color: "#ffe775",
                                                    left: 595,
                                                    top: 280,
                                                    textAlign: "center",
                                                    textBaseline: "bottom",
                                                    lineHeight: 23

                                                }
                                            }
                                        },

                                        step2: {
                                            type: "Container",
                                            width: "100%",
                                            height: "100%",
                                            alpha: 0,

                                            children: {
                                                x2: {
                                                    type: "Bitmap",
                                                    src: "wild_2",
                                                    top: 85,
                                                    left: 143
                                                },
                                                x3: {
                                                    type: "Bitmap",
                                                    src: "wild_3",
                                                    top: 85,
                                                    left: 319
                                                },
                                                x5: {
                                                    type: "Bitmap",
                                                    src: "wild_5",
                                                    top: 85,
                                                    left: 495
                                                },

                                                "preloader_text_wilds": {
                                                    type: "Text",
                                                    text: "preloader_wilds",
                                                    font: "bold 20px Arial",
                                                    color: "#ffe775",
                                                    left: 404,
                                                    top: 280,
                                                    textAlign: "center",
                                                    textBaseline: "bottom",
                                                    lineHeight: 23
                                                }

                                            }
                                        },

                                        step3: {
                                            type: "Container",
                                            width: "100%",
                                            height: "100%",
                                            alpha: 0,

                                            children: {

                                                topWildChoose: {
                                                    type: "Text",
                                                    text: "preloader_choose_wilds",
                                                    font: "bold 20px Arial",
                                                    color: "#ffe775",
                                                    left: 395,
                                                    top: 45,
                                                    textAlign: "center",
                                                    textBaseline: "bottom",
                                                    lineHeight: 23
                                                },

                                                "columns_wilds": {
                                                    type: "Bitmap",
                                                    src: "columns_wilds",
                                                    width: 453,
                                                    height: 273,
                                                    top: 72,
                                                    left: 170
                                                }
                                            }
                                        },

                                        star1: {
                                            type: "Bitmap",
                                            src: "star",
                                            width: 68,
                                            height: 67,
                                            left: 346 - 21,
                                            top: 388,
                                            scaleX: 0.73,
                                            scaleY: 0.73
                                        },
                                        star2: {
                                            type: "Bitmap",
                                            src: "star",
                                            width: 68,
                                            height: 67,
                                            left: 396 - 10,
                                            top: 393 + 6,
                                            scaleX: 0.4,
                                            scaleY: 0.4,
                                            alpha: 0.7
                                        },
                                        star3: {
                                            type: "Bitmap",
                                            src: "star",
                                            width: 68,
                                            height: 67,
                                            left: 445 - 10,
                                            top: 393 + 6,
                                            scaleX: 0.4,
                                            scaleY: 0.4,
                                            alpha: 0.7
                                        }

                                    }
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
