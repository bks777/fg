let config = {
    winChildren: {
        black: {
            type: "Container",
            width: "100%",
            height: "100%",
            backgroundColor: "#000000",
            alpha: 0.75
        },

        emitter: {
            type: "ProtonEmitter",
            top: "40%",
            left: "43%",
            targetConfig: {
                spriteSheet: {
                    "images": "starParticle",
                    "frames": [[1, 1, 194, 195, 0, 0, 0]],
                    "animations": {
                        "star": { "frames": [0] }
                    },
                    framerate: 10,
                },
                regX: 99,
                regY: 99
            },
            emitterConfig: {"initializes":{"Mass":{"massPan":{"isArray":false,"a":1,"b":1,"center":false}},"ImageTarget":{"w":20,"h":20},"Life":{"lifePan":{"isArray":false,"a":1.6,"b":2.8000000000000003,"center":false}},"Velocity":{"rPan":{"isArray":false,"a":0,"b":0,"center":false},"thaPan":{"isArray":false,"a":0,"b":0,"center":false},"type":"polar"}},"behaviours":{"Alpha":{"id":"Behaviour_1","age":105926.84401473704,"energy":0.9430678691418031,"dead":false,"same":false,"a":{"isArray":false,"a":0,"b":0.6000000000000001,"center":false},"b":{"isArray":false,"a":0,"b":0,"center":false}},"Attraction":{"energy":0.9430678691418031,"dead":false,"targetPosition":{"x":0,"y":0},"radius":200,"force":100,"radiusSq":40000,"attractionForce":{"x":-640,"y":-360},"lengthSq":539200},"Gravity":{"force":{"x":0,"y":0}},"RandomDrift":{"id":"Behaviour_3","age":105926.84401473704,"energy":0.9430678691418031,"dead":false,"panFoce":{"x":0,"y":0},"delay":0,"time":0},"Rotate":{"a":{"isArray":false,"a":0,"b":0,"center":false},"b":{"isArray":false,"a":-1,"b":1,"center":false}},"Scale":{"a":{"isArray":false,"a":1.5,"b":1.5,"center":false},"b":{"isArray":false,"a":7.800000000000001,"b":10,"center":false}}},"rate":{"Rate":{"numPan":{"isArray":false,"a":1,"b":1,"center":false},"timePan":{"isArray":false,"a":0.1,"b":0.2,"center":false}}}}

        },
        congratulationStroke: {
            type: "Text",
            text: "free_spins_end_popup_congratulations",
            left: "43%",
            top: "24%",

            font: "bold 60px Arial",
            color: "#923831",
            textBaseline: "bottom",
            textAlign: "center",
            outline: 7
        },

        congratulationText: {
            type: "Text",
            text: "free_spins_end_popup_congratulations",
            left: "43%",
            top: "24%",

            font: "bold 60px Arial",
            color: "#ffde8a",
            textBaseline: "bottom",
            textAlign: "center",
            stroke: {
                color: "#e67b2c",
                outline: 3
            }
        },

        youWonStroke: {
            type: "Text",
            text: "free_spins_end_you_won",
            top: "55%",
            left: "43%",

            font: "bold 60px Arial",
            color: "#923831",
            textBaseline: "top",
            textAlign: "center",
            outline: 7
        },

        youWonText: {
            type: "Text",
            text: "free_spins_end_you_won",
            top: "55%",
            left: "43%",

            font: "bold 60px Arial",
            color: "#ffde8a",
            textBaseline: "top",
            textAlign: "center",
            stroke: {
                color: "#e67b2c",
                outline: 3
            }
        }
    },
    noWinChildren: {
        black: {
            type: "Container",
            width: "100%",
            height: "100%",
            backgroundColor: "#000000",
            alpha: 0.75
        },

        emitter: {
            type: "ProtonEmitter",
            top: "40%",
            left: "43%",
            targetConfig: {
                spriteSheet: {
                    "images": "starParticle",
                    "frames": [[1, 1, 194, 195, 0, 0, 0]],
                    "animations": {
                        "star": { "frames": [0] }
                    },
                    framerate: 10,
                },
                regX: 99,
                regY: 99
            },
            emitterConfig: {"initializes":{"Mass":{"massPan":{"isArray":false,"a":1,"b":1,"center":false}},"ImageTarget":{"w":20,"h":20},"Life":{"lifePan":{"isArray":false,"a":1.6,"b":2.8000000000000003,"center":false}},"Velocity":{"rPan":{"isArray":false,"a":0,"b":0,"center":false},"thaPan":{"isArray":false,"a":0,"b":0,"center":false},"type":"polar"}},"behaviours":{"Alpha":{"id":"Behaviour_1","age":105926.84401473704,"energy":0.9430678691418031,"dead":false,"same":false,"a":{"isArray":false,"a":0,"b":0.6000000000000001,"center":false},"b":{"isArray":false,"a":0,"b":0,"center":false}},"Attraction":{"energy":0.9430678691418031,"dead":false,"targetPosition":{"x":0,"y":0},"radius":200,"force":100,"radiusSq":40000,"attractionForce":{"x":-640,"y":-360},"lengthSq":539200},"Gravity":{"force":{"x":0,"y":0}},"RandomDrift":{"id":"Behaviour_3","age":105926.84401473704,"energy":0.9430678691418031,"dead":false,"panFoce":{"x":0,"y":0},"delay":0,"time":0},"Rotate":{"a":{"isArray":false,"a":0,"b":0,"center":false},"b":{"isArray":false,"a":-1,"b":1,"center":false}},"Scale":{"a":{"isArray":false,"a":1.5,"b":1.5,"center":false},"b":{"isArray":false,"a":7.800000000000001,"b":10,"center":false}}},"rate":{"Rate":{"numPan":{"isArray":false,"a":1,"b":1,"center":false},"timePan":{"isArray":false,"a":0.1,"b":0.2,"center":false}}}}

        },

        youLoseStroke: {
            type: "Text",
            text: "free_spins_end_you_lose",
            top: "40%",
            left: "43%",

            font: "bold 60px Arial",
            color: "#923831",
            textBaseline: "top",
            textAlign: "center",
            outline: 7
        },

        youLoseText: {
            type: "Text",
            text: "free_spins_end_you_lose",
            top: "40%",
            left: "43%",

            font: "bold 60px Arial",
            color: "#ffde8a",
            textBaseline: "top",
            textAlign: "center",
            stroke: {
                color: "#e67b2c",
                outline: 3
            }
        }
    }
};

export default config;