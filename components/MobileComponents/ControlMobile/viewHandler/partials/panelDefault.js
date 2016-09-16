let panelDefault =  {
    type: "Scroller",
    width: "100%",
    height: "100%",
    scrollingX: false,
    scrollingY: true,

    scrollbar: {
        backgroundImage: "scrollbar_background",
        backgroundWidth: 16,
        barImage: "scrollbar",
        barWidth: 10,
        offsetY: 80,
        offsetX: 10
    },

    children: {
        panelWrapper: {
            type: "Container",
            width: 960,
            //height: "100%",
            align:"center",

            children: {

            }
        }
    }
};

export default panelDefault;