import gamePopup from "./popups/gamePopup";
import systemPopup from "./popups/systemPopup";
import infoPopup from "./popups/infoPopup";

let config = {
    layerSizeType: "fullsize",
    zIndex: 100,

    children: {
        gameBlockPopup: {
            type: "Container",
            width: 1280,
            height: 720,
            top: 0,
            left: 0
        },
        backgroundContainer: {
            type: "Container",
            width: 1280,
            height: 720,
            top: 0,
            left: 0
        },
        systemPopup,
        infoPopup,
        gamePopup
    }
};

export default config;