import winCommonViewHandler from "../../../CommonComponents/Win/viewHandler/winCommonViewHandler.es6";
import config from "./config";
import numbersSpriteSheet from './numbersSpriteSheet'

let _interval = null;
let transitionMultiplier = 1.5;

/**
 * View Handler for a Big Win
 * @constructor
 */
export default class winDesktopViewHandler extends winCommonViewHandler {

    initHandler(){
        super.initHandler();
        this.layout.zIndex = 151;
        this.initChildrenContainer(this.getLayout(), config.children);
        this.type = undefined;
        this.texts = {};
        this._totalShowTime = 100;
        this.shapeBitmaps = [];
        this._rootContainer = new Container();
        this.getLayout().addChild(this._rootContainer);

        config.available_types.forEach((item, i, arr)=>{
            if (arr.length - 1 >= i){
                let container = new Container();
                let shape = new Bitmap(config.shapesMap[i], this.alias);
                this.getLayout().addChildAt(shape, 1);
                shape.x = this.getLayout().width / 2;
                shape.y =  this.getLayout().height / 3;
                shape.regX = shape.width/2;
                shape.regY = shape.height/2;
                shape.scaleX = shape.scaleY = 4;
                shape.alpha = 0;
                this.shapeBitmaps.push(shape);

                for(let curTexture of config.types_map[i]){
                    let text = new Bitmap(curTexture, this.alias);
                    if(container.children.length > 0){
                        let totalWidth = 0;
                        for(let child of container.children){
                            totalWidth += child.width + config.textsOffset;
                        }
                        text.x = totalWidth;
                    }
                    container.addChild(text);
                }
                container.x = (this.getLayout().width / 2) ;
                container.y = (this.getLayout().height / 3);
                container.regX = container.width / 2;
                container.regY = container.height / 2;
                this.texts[item] = container;
            }
        });

        this.nextTextureIdx = undefined;
        this.currentCont = this.texts['Big'];

        for(let cont in this.texts ){
            this.getLayout().addChild(this.texts[cont]);
            this.texts[cont].visible = false;
        }

        this._back = this.getLayout().getChildByName("black");

    }

    _nextAction(resolveMain){
        if (this.isQuickStop){
            return;
        }
        this._shape.scaleX = this._shape.scaleY = .4;
        this._animateShape();
        if(this.nextTextureIdx){
            this._bwEmitter.emitter.rate.numPan.a = config.emitterRates[this.nextTextureIdx][0];
            this._bwEmitter.emitter.rate.numPan.b = config.emitterRates[this.nextTextureIdx][1];
            this._back.backgroundColorFill.graphics._fill.style = config.backColors[this.nextTextureIdx];
            this._shape = this.shapeBitmaps[this.nextTextureIdx];

            if(config.available_types.indexOf(this.type) == this.nextTextureIdx){
                this.setEndAnimation(resolveMain);
            }
            if(config.available_types.indexOf(this.type) > this.nextTextureIdx){
                this.setTransitionAnimation(resolveMain);
            }
        } else {
            this.setEndAnimation(resolveMain);
        }
    }

    _animateShape(){
        createjs.Tween
            .get(this._shape)
            .to({alpha: 1}, 0)
            .to({
                alpha: 1,
                scaleX: 1,
                scaleY: 1
            }, 80)
            .to({
                alpha: .6,
                scaleX: 5.56,
                scaleY: 5.56
            }, 410)
            .to({
                alpha: 0,
                scaleX: 6.75,
                scaleY: 6.75
            }, 500);

        createjs.Tween
            .get(this._shape, {loop:true})
            .to ({rotation: 360}, 10000);
    }

    setTransitionAnimation(resolveMain){
        this.currentCont.visible = false;
        this.currentCont = this.texts[config.available_types[this.nextTextureIdx]];
        this.currentCont.scaleX = this.currentCont.scaleY = .4;
        this.currentCont.visible = true;
        this._bwEmitter.emitter.behaviours[4].a.b = this._scaleConstA * config.emitterScales[this.nextTextureIdx];
        this._bwEmitter.emitter.behaviours[4].b.b = this._scaleConstA * config.emitterScales[this.nextTextureIdx];
        this.nextTextureIdx++;

        createjs.Tween
            .get(this.currentCont)
            // .to({scaleX:.4, scaleY:.4}, 0)
            .to({scaleX:1.15, scaleY:1.15}, 100 * transitionMultiplier)
            .to({scaleX:.9, scaleY:.9}, 160 * transitionMultiplier)
            .to({scaleX:1, scaleY:1}, 800 * transitionMultiplier)
            .to({scaleX:1.15, scaleY:1.15}, 100 * transitionMultiplier)
            .to({scaleX:.4, scaleY:.4}, 100 * transitionMultiplier)
            .call(this._nextAction.bind(this, resolveMain));
    }

    setEndAnimation(resolveMain){
        this.currentCont.visible = false;
        this.currentCont = this.texts[this.type];
        this.currentCont.visible = true;
        createjs.Tween
            .get(this.currentCont)
            // .to({scaleX:.4, scaleY:.4}, 0)
            .to({scaleX:1.15, scaleY:1.15}, 100)
            .to({scaleX:.9, scaleY:.9}, 160)
            .to({scaleX:1, scaleY:1}, 400)
            .to({scaleX:1.15, scaleY:1.15}, 2500)
            .call(this.stopBigWinAnimation.bind(this, resolveMain));
    }

    setQuickEndAnimation(){
        this.getCanvas().removeEventListener('click', this.bindedQS);
        if(this.isQuickStop) {
            return;
        }

        this._winCounter.visible = false;

        this._winCounter2 = new BitmapText({
            text: "0",
            spriteSheet: numbersSpriteSheet
        }, this.alias);
        this._winCounter2.name = "winCounter";
        this._winCounter2.x = this.getLayout().width / 2;
        this._winCounter2.y = this.getLayout().height / 1.75;
        this._rootContainer.addChild(this._winCounter2);
        this._winCounter2.text = (Number(this.getService("ProtocolService").getCurrentWin() / 100).toFixed(2)).toString();
        this._winCounter2.value = this.getService("ProtocolService").getCurrentWin() / 100;
        this._winCounter2.regX = this._winCounter2.getBounds().width/2;
        this._winCounter2.regY = this._winCounter2.getBounds().height/2;

        this._back.backgroundColorFill.graphics._fill.style = config.backColors[config.available_types.indexOf(this.type)];

        this._shape = this.shapeBitmaps[config.available_types.indexOf(this.type) - 1];

        //if it was final animation, don't show shape animation
        // if (true){
        //
        // }
        createjs.Tween
            .get(this._shape)
            .to({alpha: 1}, 0)
            .to({
                alpha: 1,
                scaleX: 1,
                scaleY: 1
            }, 80)

            .to({
                alpha: 0,
                scaleX: 6.75,
                scaleY: 6.75
            }, 400);

        createjs.Tween
            .get(this._shape, {loop:true})
            .to ({rotation: 360}, 10000);

        this.currentCont.visible = false;
        this.currentCont = this.texts[this.type];
        this.currentCont.visible = true;
        createjs.Tween
            .get(this.currentCont)
            .to({scaleX:1.15, scaleY:1.15}, 1500)
            .call(this.stopBigWinAnimation.bind(this, this._rm));
        this.isQuickStop = true;
    }

    counterEffect (target, start, end, lastInterval, onCountEndCallback) {
        target.text = (Number(start).toFixed(2)).toString();
        target.value = start;
        target.scaleX = target.scaleY = 0.5;

        target.regX = target.getBounds().width/2;
        target.regY = target.getBounds().height/2;

        let dif = (end - start);

        let step = dif / 125,
            currentValue = start,
            finished = false,
            tween = createjs.Tween
            .get(target)
            .to ({value: end, scaleX: 1, scaleY: 1}, this._totalShowTime)
            .call(() => {
                if (typeof onCountEndCallback === "function") {
                    onCountEndCallback();
                }
            })
            .to ({scaleX: 1.2, scaleY: 1.2}, lastInterval)


            .addEventListener("change", (ev) => {
                if (target.value - currentValue > step) {

                    currentValue = target.value;
                    target.text = (Number(target.value).toFixed(2)).toString();

                    target.regX = target.getBounds().width/2;
                    target.regY = target.getBounds().height/2;

                } else if (ev.target.position > ev.target.duration-lastInterval && !finished) {
                    target.text = (Number(target.value).toFixed(2)).toString();

                    target.regX = target.getBounds().width/2;
                    target.regY = target.getBounds().height/2;
                    // target.alpha = 0.5;
                    finished = true;
                }
            });
    }

      /**
     * Show big win
     * @param resolveMain callback for executor promise
     * @param type type of bigwin
     */
      showBigWin(resolveMain = null, type = false){
          if (!this.ready) {
              return;
          }
          this._winCounter = {};
          this._rm = resolveMain;
          this.getLayout().cursor = 'pointer';
          this.isQuickStop = false;
          this._back.backgroundColorFill.graphics._fill.style = config.backColors[0];
          this._shape = this.shapeBitmaps[0];
          let winCounter = new BitmapText({
              text: "0",
              spriteSheet: numbersSpriteSheet
          }, this.alias);
          this.bindedQS = this.setQuickEndAnimation.bind(this);
          this.getCanvas().addEventListener("click", this.bindedQS);
          winCounter.name = "winCounter";
          winCounter.x = this.getLayout().width / 2;
          winCounter.y = this.getLayout().height / 1.75;
          this._rootContainer.addChild(winCounter);
          // this._finalWinCounter = winCounter;
          this._totalShowTime =  (config.available_types.indexOf(type)* 1000) + 3000;
          for(let cont in this.texts ){
              this.texts[cont].scaleX = this.texts[cont].scaleY  = .4;
              this.texts[cont].visible = false;
          }
          HelperFlags.set("noSpin", null);
          if (this._bwEmitter) {

              this._bwEmitter.emitter.stopEmit();
              this.getLayout().removeChild(this._bwEmitter);
              delete this._bwEmitter;
          }

          this._back.alpha = 0;
          this.getLayout().alpha = 1;

          this.currentCont = this.texts['Big'];
          if(config.available_types.indexOf(type) > 0) {
              this.nextTextureIdx = 1;
          }
          this.type = type;
          this.getLayout().visible = true;
          this.activeBigWin = true;
          this.currentCont.scaleX = this.currentCont.scaleY = .4;
          this.currentCont.visible = true;


          createjs.Tween
              .get(this.getLayout().getChildByName('black'))
              .to({alpha: .75}, 300);

          if(type === config.available_types[0]){
              createjs.Tween
                  .get(this.currentCont)
                  // .to({scaleX:.4, scaleY:.4}, 0)
                  .to({scaleX:1.15, scaleY:1.15}, 200)
                  .to({scaleX:.9, scaleY:.9}, 160)
                  .to({scaleX:1, scaleY:1}, 800)
                  .to({scaleX:1.15, scaleY:1.15}, 100)
                  .to({scaleX:.4, scaleY:.4}, 100)
                  .call(this.setEndAnimation.bind(this, resolveMain));
          } else {
              createjs.Tween
                  .get(this.currentCont)
                  // .to({scaleX:.4, scaleY:.4}, 0)
                  .to({scaleX:1.15, scaleY:1.15}, 200)
                  .to({scaleX:.9, scaleY:.9}, 160)
                  .to({scaleX:1, scaleY:1}, 800)
                  .to({scaleX:1.15, scaleY:1.15}, 100)
                  .to({scaleX:.4, scaleY:.4}, 100)
                  .call(this._nextAction.bind(this, resolveMain));
          }

          HelperFlags.set("noSpin", true);
          this._bwEmitter = new ProtonEmitter ({
              left: this.getLayout().width/2,
              top: 720+100,
              target: new Sprite ({spriteSheet: config.coinSpriteSheet}, this.alias),
              emitterConfig: config.bigWinEmitter

          }, this.alias);

          this.getLayout().addChildAt(this._bwEmitter, 1);
          this._bwEmitter.emitter.emit();
          this._bwEmitter.emitter.rate.numPan.a = config.emitterRates[0][0];
          this._bwEmitter.emitter.rate.numPan.b = config.emitterRates[0][1];
          this._scaleConstA = this._bwEmitter.emitter.behaviours[4].a.b;
          this._scaleConstA = this._bwEmitter.emitter.behaviours[4].b.b;
          this._bwEmitter.emitter.behaviours[4].a.b = this._scaleConstA * config.emitterScales[0];
          this._bwEmitter.emitter.behaviours[4].b.b = this._scaleConstA * config.emitterScales[0];

          this._winCounter = winCounter;
          this.counterEffect (this._winCounter, 0, this.getService("ProtocolService").getCurrentWin() / 100, 3000);
      }

    hideBigWin(resolveMain){
        this.bigWinPromise = null;
        createjs.Tween
                .get(this.getLayout())
                .to({alpha: 0}, 300)
                .call(this._clearAnimations.bind(this, resolveMain));
    }

    _clearAnimations(resolveMain){
        if (this._bwEmitter) {
            this._bwEmitter.emitter.stopEmit();
            delete this._bwEmitter;
        }
        for(let cont in this.texts ){
            this.texts[cont].visible = false;
        }

        HelperFlags.set("noSpin", null);
        delete this.labelContainer;
        delete this.winValue;
        if(typeof resolveMain == "function"){
            resolveMain();
        }
        this.getLayout().cursor = 'normal';
        this._rootContainer.removeAllChildren();
        delete this._winCounter;
        delete this._winCounter2;
        this.getCanvas().removeEventListener('click', this.bindedQS);
    }

    stopBigWinAnimation(resolveMain){
        super.stopBigWinAnimation(resolveMain);
        if(_interval !== null){
            clearTimeout(_interval);
        }
        this.getService("SoundService").stop("audio_big_win");
        setTimeout(()=>{
            this.getService("SoundService").stop("audio_big_win");
        }, 100);
    }

    updateScreen(){
        //only for 4*3 desktop screen
        if (this.getLayout().width > 960){
            return;
        }

        let black = this.getChildByName('black');
        black.width = this.getCanvas().width * 1.5;
        black.x = -this.getGameContainer().x;
    }
}