import Container from "./Container.es6";
import Sprite from "./Sprite.es6";

export default class ProtonEmitter extends Container {

    constructor (config, alias) {

        super(config, alias);

        this.emitterModel = {
            "initializes": [
                {"Mass": ["massPan"]},
                {"ImageTarget": ["w","h"]},
                {"Life": ["lifePan"]},
                {"Velocity": ["rPan", "thaPan", "type"]}
            ],
            "behaviours": [
                {"Alpha":  ["id", "age", "energy", "dead","same", "a", "b"]},
                {"Attraction": [ "energy", "dead","targetPosition", "radius", "force", "radiusSq", "attractionForce", "lengthSq"]},
                {"Gravity": ["force"]},
                {"RandomDrift": ["id", "age", "energy", "dead", "panFoce", "delay", "time"]},
                {"Rotate":  ["a", "b"]},
                {"Scale": [ "a", "b"]}
            ],
            "rate": {
                "Rate": ["numPan", "timePan"]
            }
        };

        this._proton = this._initProton();

        if (!(config.target instanceof Sprite)) {
            if (config.targetConfig) {
                config.target = new Sprite (config.targetConfig, alias);
                if (config.targetConfig.regX) config.target.regX = config.targetConfig.regX;
                if (config.targetConfig.regY) config.target.regY = config.targetConfig.regY;
            } else {
                $_log.error (`Target not found for ProtonEmiitter. Component = ${alias}`);
            }
        }

        this._emitter = this._initEmitter(
            config.target
        );

        let keys = Object.keys(this.emitterModel);

        for(var i = 0, l = keys.length; i < l; i++){
            this._importModule(config.emitterConfig[keys[i] ], keys[i]);
        }

        this._renderer = new Proton.Renderer('easel', this._proton, this);

        this.addEventListener("added", () => {
            try {
                this._renderer.start();
                this._proton.addEmitter(this._emitter);

                this._tickHandler = this._protonTickHandler.bind(this);

                createjs.Ticker.addEventListener("tick", this._tickHandler);

            } catch (e) {
                $_log.error(e);
            }

        });

        this.addEventListener("removed", () => {
            try {
                //this._emitter.removeAllParticles();
                this._emitter.stopEmit();
                this._renderer.stop();
                this._proton.removeEmitter(this._emitter);

                createjs.Ticker.removeEventListener("tick", this._tickHandler);

            } catch (e) {
                $_log.error(e);
            }

        });

    }

    _protonTickHandler (event) {

        if ($_view_canvas._freezeTicker) {
            return;
        }

        this._proton.update();

    }


    _initProton () {
        let proton = new Proton();

        return proton;
    }

    set gravity (gravity) {
        this.removeGravityBehaviour();
        this.addGravityBehaviour(gravity);
    }

   /* get gravity () {
        return 1;
    }*/

    addGravityBehaviour (num) {
        this._gravityBehavour = new Proton.Gravity(num);
        this._emitter.addBehaviour(this._gravityBehavour);
    }

    removeGravityBehaviour () {
        if (this._gravityBehavour) {
            this._emitter.removeBehaviour(this._gravityBehavour);
            delete this._gravityBehavour;
        }
    }

    _initEmitter(target){
        let emitter = new Proton.Emitter();

        emitter.rate = new Proton.Rate(new Proton.Span(100 , 1000), new Proton.Span(0.01, 0.1));
        emitter.addInitialize(new Proton.Mass(0));
        emitter.addInitialize(new Proton.ImageTarget(target));
        emitter.addInitialize(new Proton.Life(0, 0));
        emitter.addInitialize(new Proton.Velocity(new Proton.Span(1, 4), new Proton.Span(-360, 360), 'polar'));

        /*Behaiviors*/
        emitter.addBehaviour(new Proton.Alpha(1, 1));
        //emitter.addBehaviour(new Proton.Attraction({x : 0, y : 0}, 0, 200));
        emitter.addBehaviour(new Proton.Gravity(0));
        emitter.addBehaviour(new Proton.RandomDrift(0, 0, 0.00));
        emitter.addBehaviour(new Proton.Rotate(Proton.getSpan(0, 0), Proton.getSpan(0, 0), 'add'));
        emitter.addBehaviour(new Proton.Scale(new Proton.Span(1, 1), new Proton.Span(1, 1)));

        return emitter;
    }

    get protonRenderer(){
        return this._renderer;
    }

    _importModule(list, type) {

        var key;

        for(key in list){
            var object = this._findClassInArray(type, key);

            if(object == null){
                new Error("Not found Class in emitter", type, key);
            }

            var model = this._findModel(type, key);

            this._setupProperties(object, model, list[key]);
        }
    }

    _findClassInArray(type, className) {

        var list = this._emitter[type];

        if(this.emitterModel[type] instanceof Array){
            var instance = Proton[className];

            for(var i = 0, l = list.length; i < l; i++){
                if(list[i] instanceof instance){
                    return list[i];
                }
            }
        } else {
            return list
        }

        return null;
    }

    _findModel(type, nameClass) {
        var _typeModels = this.emitterModel[type];

        if(_typeModels instanceof Array){

            for(var i = 0, l = _typeModels.length; i < l; i++){
                var el = _typeModels[i];

                if(Object.keys(el).indexOf(nameClass) != -1){
                    return el[nameClass];
                }
            }

            return null;
        }

        if(_typeModels instanceof Object){
            return _typeModels[nameClass];
        }
    }

    _setupProperties(object, model, properties) {

        for(var i = 0, l = model.length; i < l; i++){

            try{
                if(typeof properties[model[i]] == "object"){

                    for(var key in properties[model[i]]){
                        object[model[i]][key] = properties[model[i]][key];
                    }

                } else {
                    object[model[i]] = properties[model[i]];
                }
            } catch(e){
                console.error(e);
                break;
            }
        }
    }

    stop () {

    }

    start () {

    }

    get emitter () {
        return this._emitter;
    }
}