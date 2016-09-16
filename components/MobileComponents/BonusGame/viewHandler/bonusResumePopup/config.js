let config = {
    children: {
        black: {
            type: "Container",
            width: "100%",
            height: "100%",
            backgroundColor: "#000000",
            alpha: 0.7
        },

        youWonStroke: {
            type: "Text",
            text: "You won Bonus game!",
            left: "50%",
            top: "50%",

            textBaseline: "middle",
            font: "bold 60px Arial",
            color: "#923831",
            textAlign: "center",
            outline: 7
        },

        youWonText: {
            type: "Text",
            text: "You won Bonus game!",
            left: "50%",
            top: "50%",

            textBaseline: "middle",
            textAlign: "center",
            font: "bold 60px Arial",
            color: "#ffde8a",
            stroke: {
                color: "#e67b2c",
                outline: 3
            }
        }
    }
};

export default config;