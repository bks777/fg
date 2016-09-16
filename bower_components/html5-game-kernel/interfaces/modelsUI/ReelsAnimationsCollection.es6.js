import Reel from "./Reel.es6";

function parabolaAnimation (target, size = 0, time = 0) {

    return new Promise ((resolve, reject) => {
        createjs.Tween
            .get (target, {override: true})
            .to ({y: size}, time)
            .to ({y: 0}, time)
            .call(resolve);

        setTimeout (reject, time+500);
    });
}

function findBottomElement (reel) {
    let el = reel.getChildAt(0);

    for (let i=1; i < reel.numChildren; i++) {
        if (el.y < reel.getChildAt(i).y) {
            el = reel.getChildAt(i);
        }
    }

    return el;
}

function findTopElement (reel) {
    let el = reel.getChildAt(0);

    for (let i=1; i < reel.numChildren; i++) {
        if (el.y > reel.getChildAt(i).y) {
            el = reel.getChildAt(i);
        }
    }

    return el;
}

export default class ReelsAnimationsCollection {

    static standardTween (event) {
        let maxY = this.config.height+this.config.rowHeight;
        let startPosition = -this.config.rowHeight;

        let velocity;

        if(this.intrigueMode){
            velocity = this.config.intrigueMode.speed * event.delta/1000;
        } else if (!this.quickMode) {
            velocity = this.config.speed * event.delta/1000;
        } else {
            velocity = this.config.quickMode.speed * event.delta/1000;
        }

        if (this.state === Reel.STATE_NEED_START) {
            this.state = Reel.STATE_STARTING;

            if (!this.quickMode) {
                parabolaAnimation.call (this, this, this.config.startParabolaSize, this.config.startParabolaTime)
                    .then (() => {
                        if (this.state === Reel.STATE_STARTING) {
                            this.state = Reel.STATE_RUN;
                        }
                    });
            } else {
                this.state = Reel.STATE_RUN;
            }

            return;
        }

        if (this.state === Reel.STATE_STARTING || this.state === Reel.STATE_FINISHING) {
            return;
        }

        if (this.state === Reel.STATE_RUN || this.state === Reel.STATE_STOPPING) {
            this.state = 20;
            let s = this.y;

            let self = this;

            const tween = () => {
                createjs.Tween
                    .get(this, {override: true})
                    .to ({y: this.config.rowHeight}, 100)
                    .call (() => {
                        this.y = s;
                        let lastEl = findBottomElement(this);
                        this.elements.splice(this.elements.length-1, 1);
                        this.removeChild(lastEl);

                        for (let i = 0; i < this.elements.length; i++) {
                            this.elements[i].y += this.config.rowHeight;
                        }

                        let newEl = this.nextElement();
                        newEl.y = -this.config.rowHeight;
                        this.elements.splice(0,0,newEl);
                        this.addChildAt(newEl,0);

                        tween();
                    });
            };

            tween();


        }

        if (this.state === Reel.STATE_NEED_FINISH){
            this.state = Reel.STATE_FINISHING;
            if (!this.quickMode) {

                $_signal.goTo('!reels.sounds.stopReel', this.number);

                createjs.Tween.removeTweens(this);

                parabolaAnimation.call (this, this, this.config.endParabolaSize, this.config.endParabolaTime)
                    .then (() => this.state = Reel.STATE_STOP);

                //parabolaAnimation.bind(this)(false, () => this.state = Reel.STATE_STOP);
            } else {
                this.state = Reel.STATE_STOP;
            }
        }

    }


    static standard (event) {
        let maxY = this.config.height+this.config.rowHeight;
        let startPosition = -this.config.rowHeight;

        let velocity;

        if(this.intrigueMode){
            velocity = this.config.intrigueMode.speed/60;
        } else if (!this.quickMode) {
            velocity = this.config.speed/60;// * event.delta/1000;
        } else {
            velocity = this.config.quickMode.speed/60;// * event.delta/1000;
        }

        if (this.state === Reel.STATE_NEED_START) {
            this.state = Reel.STATE_STARTING;

            let startParabolaSize, startParabolaTime;

            if (!this.quickMode) {
                startParabolaSize = this.config.startParabolaSize;
                startParabolaTime = this.config.startParabolaTime;
            } else {
                startParabolaSize = this.config.quickMode.startParabolaSize;
                startParabolaTime = this.config.quickMode.startParabolaTime;
            }

            parabolaAnimation.call (this, this, startParabolaSize, startParabolaTime)
                .then (() => {
                    if (this.state === Reel.STATE_STARTING) {
                        this.state = Reel.STATE_RUN;
                    }
                });

            return;
        }

        if (this.state === Reel.STATE_STARTING || this.state === Reel.STATE_FINISHING) {
            return;
        }

        if (this.state === Reel.STATE_RUN || this.state === Reel.STATE_STOPPING) {
            let lastEl = findBottomElement(this);

            if (lastEl.y + velocity >= maxY) {
                this.elements.splice(this.elements.length-1, 1);
                this.removeChild(lastEl);

                let newEl = this.nextElement(); //!* if this is the last element than state will change to STATE_NEED_FINISH *!/
                newEl.x = 0;
                newEl.y = (lastEl.y-maxY) + startPosition;
                this.elements.splice(0,0,newEl);
                this.addChildAt(newEl,0);
            }

            if (this.state === Reel.STATE_NEED_FINISH){
                velocity = maxY - lastEl.y;
            }

            for (let i=0; i < this.numChildren; i++) {
                this.getChildAt(i).y += velocity;
            }

            setTimeout(() => {
                let pt = this.localToGlobal(0,0);
                this.stage.requestUpdate(new createjs.Rectangle( pt.x, pt.y, this.config.width, this.config.height ));
                //this.stage.requestUpdate();
            },0);
        }

        if (this.state === Reel.STATE_NEED_FINISH){
            this.state = Reel.STATE_FINISHING;

            $_signal.goTo('!reels.sounds.stopReel', this.number);

            let endParabolaSize, endParabolaTime;

            if (!this.quickMode) {
                endParabolaSize = this.config.endParabolaSize;
                endParabolaTime = this.config.endParabolaTime;
            } else {
                endParabolaSize = this.config.quickMode.endParabolaSize;
                endParabolaTime = this.config.quickMode.endParabolaTime;
            }

            parabolaAnimation.call (this, this, endParabolaSize, endParabolaTime)
                .then (() => this.state = Reel.STATE_STOP);

        }

    }

    static reverse () {

        var minY = -this.config.rowHeight*2;
        var startPosition = this.config.height;
        let velocity = this.velocity;

        if (this.state === Reel.STATE_NEED_START) {
            this.state = Reel.STATE_STARTING;
            if (!this.quickMode) {
                parabolaAnimation.bind(this)(false, () => {
                    if (this.state === Reel.STATE_STARTING) {
                        this.state = Reel.STATE_RUN;
                    }
                });
            } else {
                this.state = Reel.STATE_RUN;
            }

            return;
        }

        if (this.state === Reel.STATE_STARTING || this.state === Reel.STATE_FINISHING) {
            return;
        }

        if (this.state === Reel.STATE_RUN || this.state === Reel.STATE_STOPPING) {
            let lastEl = findTopElement(this);
            if (lastEl.y - velocity < minY) {
                this.elements.splice(0, 1);
                this.removeChild(lastEl);

                let newEl = this.nextElement(); /* if this is the last element than state will change to STATE_NEED_FINISH */
                newEl.x = 0;
                newEl.y = (lastEl.y-minY) + startPosition;
                //this.elements.splice(this.elements.length-1,0,newEl);
                this.elements.push(newEl);
                this.addChildAt(newEl);
            }

            if (this.state === Reel.STATE_NEED_FINISH){
                velocity = lastEl.y - minY ;
            }

            for (let i=0; i < this.numChildren; i++) {
                this.getChildAt(i).y -= velocity;
            }
        }

        if (this.state === Reel.STATE_NEED_FINISH){
            this.state = Reel.STATE_FINISHING;
            if (!this.quickMode) {
                parabolaAnimation.bind(this)(true, () =>  {
                    this.state = Reel.STATE_STOP
                });
            } else {
                this.state = Reel.STATE_STOP;
            }

        }

    }

    static freez () {
        this.state = Reel.STATE_STOP;
    }

}