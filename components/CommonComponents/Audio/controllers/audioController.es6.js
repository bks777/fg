/**
 * Work with --- website@https://github.com/tonistiigi/audiosprite
 */

import Controller from "../../../../bower_components/html5-game-kernel/interfaces/controllers/Controller.es6.js";
import AudioConditions from "../../../../bower_components/html5-game-kernel/interfaces/conditions/audioConditions.es6.js";

import config from "./config.js"
import volumes from "./volumes.js"

export default class AudioController extends Controller {

    constructor(data = {}){
        super(data);

        //createjs.Sound.initializeDefaultPlugins();
        createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]);

        this._backgroundPlay = [];

        this._backgroundOut = false;

        this._tryPlayBgSound = 50;
        this._tryPlayBgSoundCounter = 0;

        this._prewLastSound = null;

        this._promiseBackground = [];
        this._promiseBgInt = null;

        this.getService("SoundService").setVolumeAudio(volumes);
    }

    /**
     * Play line combinations
     * @param winLine
     * @param hasWild
     * @param resolve
     * @param volume
     */
    playLineCombination(winLine, hasWild, resolve, volume = 0.4){

        if(hasWild){
            this.playWildCombination(resolve, volume);
            return null;
        }

        this.backgroundSoundFadeOut();

        let condition = new AudioConditions(config.combinations,
            [
                winLine.amount,
                winLine.line,
                winLine.occurrences,
                winLine.symbol
            ],
            {
                exec: "play",
                params: "amount,line,occurrences,symbol"
            }
        );

        /**
         * If find combination
         */
        condition.setCallback("play", (a, b) => {

console.log('!!! FIND ', a, volume);
            let promises = [];

            a.forEach((sound)=>{
                promises.push(this.getService("SoundService").playPromise(sound, this.alias, {volume: volume}));
            });

            Promise.all(promises).then(()=>{
                resolve();
            });
        });

        /**
         * Default conditions if combination was not be found
         */
        condition.setCallback(ConditionInterface._DEFAULT, ()=>{
            console.log('!!! NO FIND ');
            resolve();
        });

        condition.execute();
    }

    /**
     * Play max of line combination
     * @param winLines
     * @param hasWild
     * @param resolve
     * @returns {null}
     */
    playMaxOfLineCombination(winLines, hasWild, resolve){

        let max = 0, keyMax = null;

        if(!(winLines instanceof Array) || winLines.length == 0){
            resolve();
            return null;
        }

        if(hasWild){
            this.playWildCombination(resolve);
            return null;
        }

        winLines.forEach((data, i) => {
            if(data.amount >= max && !data.trigger){
                max = data.amount;
                keyMax = i;
            }
        });

        if(keyMax === null){
            resolve();
            return ;
        }

        this.playLineCombination(winLines[keyMax], hasWild, resolve, 0.5);
    }

    /**
     * Play wild combination
     * @param resolve
     * @param volume
     */
    playWildCombination(resolve = null, volume = 0.4){

        this.backgroundSoundFadeOut();

        let promises = [];

        promises.push(this.getService("SoundService").playPromise("sound_7", this.alias, {volume: volume}));

        Promise.all(promises).then(()=>{
            resolve();
        });

    }

    /**
     * Play line in bonus game
     * @param symbolID
     * @param resolve
     */
    playLineBonusCombination(symbolID, resolve){

        this.backgroundSoundFadeOut();

        let condition = new AudioConditions(config.combinations,
            [
                3,
                symbolID
            ],
            {
                exec: "play",
                params: "occurrences,symbol"
            }
        );

        /**
         * If find combination
         */
        condition.setCallback("play", (a, b) => {

            let promises = [];

            //promises.push(this.getService("SoundService").playPromise(a[1], this.alias));

            a.forEach((sound)=>{
                promises.push(this.getService("SoundService").playPromise(sound, this.alias));
            });

            Promise.all(promises).then(()=>{
                resolve();
            });
        });

        /**
         * Default conditions if combination was not be found
         */
        condition.setCallback(ConditionInterface._DEFAULT, ()=>{
            resolve();
        });

        condition.execute();
    }

    /**
     * Play sound with callback Promise
     * @param name
     * @param resolve
     * @param volume
     * @param loop
     */
    playSound(name, resolve = null, volume = 1, loop = false){

        let _p = [];
        _p.push(this.getService("SoundService").playPromise(name, this.alias, {volume: volume, loop: loop}));

        Promise.all(_p).then(resolve);
    }

    /**
     * Change background sound with catch
     * @param action
     * @returns {null}
     * @private
     */
    _changeBackgroundSound(action = null){
        if(!this.getService("SoundService").isBackgroundLoaded()){
            this.getService("SoundService").backgroundLoadSubscribe = action;
            return null;
        }

        let config = {
            "spins": "mainform_track",
            "freespins": "mainform_freespin",
            "bonus": "mainform_bonus"
        };

        if(config[action] == undefined ){
            return ;
        }

        let enableVolume = this.getService("SoundService").getGameSound();

        /**
         * Drop no used background sound
         */
        const dropNoUsed = () => {

            if(this._backgroundPlay.length == 0){
                return ;
            }

            let current = createjs.indexOf(this._backgroundPlay, getLastSound());

            this._backgroundPlay.forEach((el, re)=>{

                if(re == current){
                    return ;
                }

                el.setPaused(true);
                el.stop();
                this.getService("SoundService").removeInstance(el);

                setTimeout(()=>{

                    let index = createjs.indexOf(this._backgroundPlay, el);

                    if(index > -1){
                        this._backgroundPlay.splice(index, 1);
                    }
                }, 500);
            })
        };

        /**
         * Get last sound
         * @returns {*}
         */
        const getLastSound = () => {

            if(this._backgroundPlay.length == 0){
                return null;
            }

            let current = this._backgroundPlay[this._backgroundPlay.length - 1];

            if(current){
                return current;
            }

            return null;
        };

        let last = getLastSound();

        if(last && last._aliasName == config[action]){
            return ;
        }


        if(this._promiseBgInt !== null){
            clearTimeout(this._promiseBgInt);
        }

        this._promiseBackground = [];

        let promise = new Promise((res, rej) => {

            this._prewLastSound = getLastSound();

            let background = this.getService("SoundService").play(config[action], "audio", {loop: true, volume: 0});

            background.__name = `audio_${config[action]}`;

            if(background && background.playState == "playFailed" && this._tryPlayBgSoundCounter < this._tryPlayBgSound){
                rej();
                return ;
            }

            this._backgroundPlay.push(background);

            res(background);
        });

        promise.catch(()=>{

            this._promiseBgInt = setTimeout(()=>{
                this.changeBackgroundSound();
                this._tryPlayBgSoundCounter++;
            }, 500);
        });

        this._promiseBackground.push(promise);

        Promise.all(this._promiseBackground).then((res)=> {

            let [audio] = res;

            if(this._prewLastSound){

                if(this._prewLastSound.__name == audio.__name){
                    return null;
                }

                this._promiseBackground.push(
                    new Promise((res1, reg1)=>{
                        this.getService("SoundService").fadeSound(this._prewLastSound.__name, null, 1000, res1, 0);
                    })
                );
            }

            this._promiseBackground.push(
                new Promise((res2, reg2)=>{
                    this.getService("SoundService").fadeSound(audio.__name, null, 600, res2, enableVolume ? 0.6 : 0);
                })
            );

            Promise.all(this._promiseBackground).then((res)=> {
                this._prewLastSound = null;

                dropNoUsed();
            });
        })
            .catch((e)=>{
                $_log.error(e);
            });

    }

    /**
     * Background sound
     */
    changeBackgroundSound(action = this.getService("ProtocolService").getCurrentAction()){

        try{
            this._changeBackgroundSound(action);
        } catch(e){
            $_log.error("changeBackgroundSound", e);
        }

    }

    /**
     * Fade in background
     * @param resolve
     */
    backgroundSoundFadeIn(resolve = null){

        if(/*this._backgroundOut === false || */this.getService("SoundService").getGameSound() === false || this.getService("SoundService").getGameEffects() === false){
            return ;
        }

        this._backgroundOut = false;
        this.getService("SoundService").fadeGroup("background", "in", 1000, resolve);

    }

    /**
     * Fade out background
     * @param resolve
     * @param volume
     */
    backgroundSoundFadeOut(resolve = null, volume = null){

        if(/*this._backgroundOut === true || */this.getService("SoundService").getGameSound() === false || this.getService("SoundService").getGameEffects() === false){
            return ;
        }

        this._backgroundOut = true;
        this.getService("SoundService").fadeGroup("background", "out", 200, resolve, volume);
    }


}