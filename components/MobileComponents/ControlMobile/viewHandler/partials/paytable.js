let paytable = {
    type: "Container",
        width: "100%",
        //height: "100%",

        children: {
        title: {
            "top": 20,
            "left": "50%",
            "type": "Text",
            "text": "paytable_title",
            "font": "bold 27pt Arial",
            "color": "#ffffff",
            "textAlign": "center",
            fontTransform: "uppercase"
        },
        topLine: {
            type: "Bitmap",
                src: "settings_top_line",
                width: "100%",
                top: 70
        }
    }
};

export default paytable;