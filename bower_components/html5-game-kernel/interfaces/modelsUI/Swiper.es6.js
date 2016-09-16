import Container from "./Container.es6";

export default class Swiper extends Container {
    constructor (config, alias) {
        super(config);


        this.on("mousedown", this._handleStart, this);
        this.on("pressup", this._handleEnd, this);
        this.on("pressmove", this._handleSwipe, this);

        this.currentPage = 0;
        this.pages = [];

        this.speed = 200;
        this.tweenId = null;

        this.enableClickableBackground();
        this.enableOverflowHidden();
    }

    addChild (child) {
        if (this.pages.length > 1) {
            child.visible = false;
        }

        if (this.pages.length === 0) {
            child.x = 0;
            child.y = 0;
        } else {
            child.x = this.width;
            child.y = 0;
        }

        this.pages[this.pages.length] = child;
        super.addChild(child);
    }

    _handleSwipe(e) {
        this.pages[this.currentPage].x = e.localX - this._startX;
        if (this.currentPage > 0) {
            this.pages[this.currentPage-1].x = -this.width + e.localX - this._startX;
        }
        if (this.currentPage < this.pages.length-1) {
            this.pages[this.currentPage+1].x = this.width + e.localX - this._startX;
        }
        this._update();
    }

    _handleStart (e) {
        this._startX = e.localX;
    }

    _handleEnd (e) {
        if (this.pages[this.currentPage].x < -this.width/6) {

            if (this.currentPage < this.pages.length-1) {
                this.setCurrentPage(this.currentPage+1);
            }

        } else if (this.pages[this.currentPage].x > this.width/6) {

            if (this.currentPage > 0) {
                this.setCurrentPage(this.currentPage-1);
            }
        }

        this._goToStartPosition();
    }

    setCurrentPage (i) {

        for (let p = 0; p < this.pages.length; p++) {
            if (p === i - 1) {
                this.pages[p].visible = true;
                this.pages[i-1].x = -this.width + this.pages[i].x;
            } else if (p === i) {
                this.pages[p].visible = true;
            } else if (p === i + 1) {
                this.pages[p].visible = true;
                this.pages[i+1].x = this.width + this.pages[i].x;
            } else {
                this.pages[p].visible = false;
            }
        }

        this.currentPage = i;

        this.dispatchEvent("change");
    }

    getCurrentPage () {
        return this.currentPage;
    }

    _goToStartPosition () {
        if (!this.tweenId) {
            this.tweenId = this.stage.startTween(new createjs.Rectangle(0,0,this.width, this.height));
        }

        if (this.currentPage > 0) {
            createjs.Tween.get(this.pages[this.currentPage-1]).to({x: -this.width}, this.speed);
        }
        if (this.currentPage < this.pages.length-1) {
            createjs.Tween.get(this.pages[this.currentPage+1]).to({x: this.width}, this.speed);
        }
        createjs.Tween.get(this.pages[this.currentPage]).to({x: 0}, this.speed).call ( () => {
            this.stage.endTween(this.tweenId);
            this.tweenId = null;
            this.stage.requestUpdate();
        });

    }

    _update () {
        let pt = this.localToGlobal(0,0);
        let rect = new createjs.Rectangle (pt.x, pt.y, this.width, this.height);
        if (this.stage) {
            this.stage.requestUpdate(rect, this.alias);
        }
    }

}