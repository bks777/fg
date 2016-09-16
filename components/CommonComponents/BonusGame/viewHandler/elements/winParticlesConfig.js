let winParticlesConfig = {"initializes":{"Mass":{"massPan":{"isArray":false,"a":5,"b":1,"center":false}},"ImageTarget":{"w":20,"h":20},"Life":{"lifePan":{"isArray":false,"a":4.2,"b":11.200000000000001,"center":false}},"Velocity":{"rPan":{"isArray":false,"a":0,"b":0,"center":false},"thaPan":{"isArray":false,"a":85,"b":-85,"center":false},"type":"polar"}},"behaviours":{"Alpha":{"id":"Behaviour_1","age":59206.61200206233,"energy":0.9893517181825577,"dead":false,"same":false,"a":{"isArray":false,"a":1,"b":1,"center":false},"b":{"isArray":false,"a":0,"b":0,"center":false}},"Attraction":{"energy":0.9893517181825577,"dead":false,"targetPosition":{"x":0,"y":0},"radius":200,"force":100,"radiusSq":40000,"attractionForce":{"x":-454.9840447773555,"y":-474.98184219193433},"lengthSq":432618.23141400627},"Gravity":{"force":{"x":0,"y":-50}},"RandomDrift":{"id":"Behaviour_3","age":59206.61200206233,"energy":0.9893517181825577,"dead":false,"panFoce":{"x":200,"y":0},"delay":0,"time":0},"Rotate":{"a":{"isArray":false,"a":0,"b":0,"center":false},"b":{"isArray":false,"a":0,"b":0,"center":false}},"Scale":{"a":{"isArray":false,"a":0.30000000000000004,"b":0.5,"center":false},"b":{"isArray":false,"a":0.2,"b":0.30000000000000004,"center":false}}},"rate":{"Rate":{"numPan":{"isArray":false,"a":2,"b":3,"center":false},"timePan":{"isArray":false,"a":0.2,"b":0.30000000000000004,"center":false}}}};
export {winParticlesConfig};

let targetSpriteSheetConfig = {
    "images": "star_particle",
    "frames": [
        [1, 1, 50, 50, 0, 0, 0]
    ],
    "animations": {
        "star_particle_anim": {"frames": [0]}
    }
};

export {targetSpriteSheetConfig};