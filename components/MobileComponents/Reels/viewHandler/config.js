import atlas from "./atlasConfig";
import reelAnimationsAtlasConfig from "./reelAnimationsAtlasConfig";

let config = {

    reelAnimationsAtlasConfig,

    "children": {

        "slotMachine": {
            "type": "SlotMachine",

            "left": 130,
            "top": 113,

            "width": 700,
            "height": 420,

            "distanceBetweenReels": 0,
            "blurCoefficient": 15,

            "delayBetweenReelsStart": 0,
            "delayBetweenReelsStop": 200,

            quickMode: {
                "delayBetweenReelsStart": 0,
                "delayBetweenReelsStop": 0
            },



            atlas,
            //atlasMini,

            "defaultReel": {
                "left": "auto",
                "top": 0,
                "width": 140,
                "height": 420,
                "numOfRows": 5,
                "rowHeight": 140,
                "distanceBetweenRows": 0,
                "animation": "standard",
                "numOfSymbols": 14,
                "blurWhileRun": true,

                "speed": 3500,

                startParabolaSize: 0,
                startParabolaTime: 0,

                endParabolaSize: 40,
                endParabolaTime: 80,

                quickMode: {
                    "speed": 5000,

                    startParabolaSize: 0,
                    startParabolaTime: 0,

                    endParabolaSize: 40,
                    endParabolaTime: 40
                },

                intrigueMode: {
                    "speed": 6000
                },

                "defaultTypeOfSymbol": "def",
                "symbols": {
                    "1": {
                        "types": ["def", "blur", "short"],
                        "name": "el_10"
                    },
                    "2": {
                        "types": ["def", "blur", "short"],
                        "name": "el_J"
                    },
                    "3": {
                        "types": ["def", "blur", "short"],
                        "name": "el_Q"
                    },
                    "4": {
                        "types": ["def", "blur", "short"],
                        "name": "el_K"
                    },
                    "5": {
                        "types": ["def", "blur", "short"],
                        "name": "el_A"
                    },
                    "6": {
                        "types": ["def", "blur", "short"],
                        "name": "el_scorpion"
                    },
                    "7": {
                        "types": ["def", "blur", "short"],
                        "name": "el_cobra"
                    },
                    "8": {
                        "types": ["def", "blur", "short"],
                        "name": "el_black_cat"
                    },
                    "9": {
                        "types": ["def", "blur", "short"],
                        "name": "el_Nefertiti"
                    },
                    "10": {
                        "name": "wild_pharaon_simple",
                        "types": ["def", "blur"]
                    },
                    "11": {
                        "name": "wild_pharaon_red",
                        "types": ["def", "blur", "short"]
                    },
                    "12": {
                        "name": "wild_pharaon_gold",
                        "types": ["def", "blur", "short"]
                    },
                    "13": {
                        "name": "scatter",
                        "types": ["def", "blur", "short"]
                    },
                    "14": {
                        "name": "bonus",
                        "types": ["def", "blur", "short"]
                    }
                },
                "symbolTypes": {
                    "def": {
                        "scale": 1
                    },
                    "disable": {
                        "scale": 1
                    },
                    "blur": {
                        "scale": 1.43
                    },
                    "short": {
                        "scale": 1.43,
                        "framerate": 27
                    },
                    "freez": {
                        "scale": 1,
                        "framerate": 27
                    },
                    "disable_freespins": {
                        "scale": 1
                    }
                },

                allowedSymbolTypes: {
                    "default": {
                        "def": "def",
                        "short": "short",
                        "disable": "disable",
                        "blur": "blur"
                    },
                    "freespins": {
                        "def": "def",
                        "short": "short",
                        "disable": "disable_freespins",
                        "blur": "blur"
                    }
                },

                bigWild: {
                    enable: false,
                    scale: 1,
                    framerate: 25,
                    //topCorrection: -34
                },

                "fps": 60
            },

            "reels": [
                {
                    "animation": "standard",
                    allowedSymbols: {
                        spins: [1,2,3,4,5,6,7,8,9],
                        freespins: [1,2,3,4,5,6,7,8,9]
                    }
                },
                {
                    "animation": "standard",
                    allowedSymbols: {
                        spins: [1,2,3,4,5,6,7,8,10,11],
                        freespins: [1,2,3,4,5,6,7,8,10]
                    }
                },
                {
                    "animation": "standard",
                    allowedSymbols: {
                        spins: [1,2,3,4,5,6,7,8,9,11],
                        freespins: [1,2,3,4,5,6,7,8,9]
                    }
                },
                {
                    "animation": "standard",
                    allowedSymbols: {
                        spins:[1,2,3,4,5,6,7,8,10,11],
                        freespins: [1,2,3,4,5,6,7,8,10]
                    }
                },
                {
                    "animation": "standard",
                    allowedSymbols: {
                        spins: [1,2,3,4,5,6,7,8,9],
                        freespins: [1,2,3,4,5,6,7,8,9]
                    }
                }
            ]
        }
    }
};


export default config;