let buttons = {
    type: "Container",
    align: "center",
    width: 380,
    top: 500,

    children: {
        back: {
            type: "Button",
            align: "center",
            spriteSheet: {
                images: ["paytableAtlas"],
                frames: [
                    [406, 251, 177, 153, 0, 0, 0],
                    [227, 251, 177, 154, 0, 0, 0]
                ],
                animations: { normal: [0], hover: [1], clicked: [1]}
            }
        },
        prev: {
            type: "Button",
            align: "left",
            verticalAlign: "bottom",
            spriteSheet: {
                images: ["paytableAtlas"],
                frames: [
                    [114, 251, 111, 155, 0, 0, 0],
                    [585, 159, 112, 156, 0, 0, 0]
                ],
                animations: { normal: [0], hover: [1], clicked: [1]}
            }
        },
        next: {
            type: "Button",
            align: "right",
            verticalAlign: "bottom",
            spriteSheet: {
                images: ["paytableAtlas"],
                frames: [
                    [1, 251, 111, 155, 0, 0, 0],
                    [584, 1, 112, 156, 0, 0, 0]

                ],
                animations: { normal: [0], hover: [1], clicked: [1]}
            }
        }
    }

};

export default buttons;