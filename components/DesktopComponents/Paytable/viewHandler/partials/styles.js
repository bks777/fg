let defaultFont = {
    type: "Text",
    font: "bold 16px Arial",
    color: "#451408",
    textAlign: "center",
    left: "50%",
    lineHeight: 20,
    stroke: {
        color: "#ccc06a",
        outline: 3
    }
};
export {defaultFont};


let titleStyle = {
    type: "Text",
    align: "center",
    top: 101,
    font: "bold 24px Arial",
    color: "#832d16",
    stroke: {
        color: "#ccc06a",
        outline: 3
    },
    fontTransform: "uppercase"
};
export {titleStyle};

let background = {
    type: "Bitmap",
        src: "background",
        scaleX: 1,
        scaleY: 1
};
export {background};