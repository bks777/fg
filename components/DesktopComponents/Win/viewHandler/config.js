import coinSpriteSheet from "../resources/spriteSheets/coinSpriteSheetConfig.js";
import bigWinEmitter from "../resources/emitters/bigWinEmitterConfig.js";

let config = {
    zIndex: 51,
    coinSpriteSheet,
    bigWinEmitter,
    children:{
        black: {
            type: "Container",
            width: "100%",
            height: "100%",
            backgroundColor: "#000000",
            alpha: 0
        }
    },
    textsOffset: 15,
    types_map: [
        ['big_','_win'],//BigWin
        ['mega_','_win'],//MegaWin
        ['super_','_win'],//SuperWin
        ['super_','mega_','_win'] //SuperMegaWin
    ],
    available_types: ['Big', 'Mega', 'Super', 'SuperMega'],
    emitterRates: [
        [0, 1],//BigWin
        [0, 2],//MegaWin
        [1, 2],//SuperWin
        [2 ,3]//SuperMegaWin
    ],
    emitterScales: [
        .85,//BigWin
        1,//MegaWin
        1.2,//SuperWin
        1.5//SuperMegaWin
    ],
    backColors: [
        '#000000',
        '#001920',
        '#0B0135',
        '#3E0024'
    ],
    shapesMap: [
        "shape_mega",
        "shape_super",
        "shape_super_mega",
        "shape"
    ]
};

export default config;