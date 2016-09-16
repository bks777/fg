import Container from "./Container.es6";
import Text from "./Text.es6";

export default class RichText extends Text {
    constructor(config, alias) {
        super(config, alias);

        let textConfig = $_t.get(config.text);

        if(textConfig instanceof Object){

            let keys = Object.keys(textConfig);

            for(let i = 0, l = keys.length; i < l; i++){
                var name = keys[i];
                config[name] = textConfig[name];
            }
        } else {
            config.text = textConfig;
        }

        this._componentAlias = alias;
        this.setConfigs(config.configs);
    }

    setConfigs (_configs) {

        let numOfTexts = this.text.split ("|").length;

        let defaultConfig = Object.assign ({}, {
            font: "bold 20px Arial",
            color: "#FFFFFF"
        }, (_configs ? _configs[0] : {}));

        let configs = [];
        for (let i = 0; i < numOfTexts; i++) {
            configs[i] = Object.assign ({}, defaultConfig);
        }

        const assignConfig = (key, c) => {
            if (key < 0 || key >= numOfTexts) {
                $_log.error (`not correct key ${key} for RichText ${this.text} in component ${this._componentAlias}`);
            }
            configs[key] = Object.assign ({}, configs[key], c.config);
        };

        for (let i = 1; i < _configs.length; i++) {

            let c = _configs[i];

            if (c.keys === undefined) {
                continue;
            }

            if ( Array.isArray(c.keys) ) {
                for (let j = 0; j < c.keys.length; j++) {
                    let key = Number(c.keys[j]);
                    assignConfig (key, c);
                }
            } else if (typeof c.keys === "string") {
                let key = Number(c.keys);
                assignConfig (key, c);
            } else if (typeof c.keys === "number") {
                let key = c.keys;
                assignConfig (key, c);
            }
        }

        this.configs = configs;
    }

    /**
     * Draws multiline text.
     * @method _drawText
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} o
     * @param {Array} lines
     * @return {Object}
     * @protected
     **/
    _drawText (ctx, o, lines) {
        var paint = !!ctx;
        if (!paint) {
            ctx = Text._workingContext;
            ctx.save();
            this._prepContext(ctx);
        }

        let key = 0;
        var lineHeight = this.lineHeight||this.getMeasuredLineHeight();

        var maxW = 0, count = 0;
        var hardLines = String(this.text).split(/(?:\r\n|\r|\n)/);

        let strLines = [];

        for (var i=0, l=hardLines.length; i<l; i++) {
            var str = hardLines[i];
            var w = null;
            if (this.lineWidth != null && (w = ctx.measureText(str).width) > this.lineWidth) {
                // text wrapping:
                var words = str.split(/(\s)/);

                str = words[0];
                w = ctx.measureText(str).width;

                for (var j = 1, jl = words.length; j < jl; j += 2) {
                    // Line needs to wrap:
                    var wordW = ctx.measureText(words[j] + words[j + 1]).width;

                    if (w + wordW > this.lineWidth) {
                        strLines.push(str);
                        if (w > maxW) {
                            maxW = w;
                        }
                        str = words[j + 1];
                        w = ctx.measureText(str).width;
                    } else {
                        str += words[j] + words[j + 1];
                        w += wordW;
                    }
                }

                strLines.push(str);

                str = "";
                for (let line in strLines) {
                    if (line !== strLines.length - 1) {
                        str += strLines[line] + "\r\n";
                    } else {
                        str += strLines[line];
                    }
                }
            } else {
                strLines.push (str);
            }
        }

        for (var i=0, l=strLines.length; i<l; i++) {
            var str = strLines[i];
            var w = null;

            let strs = str.split ("|");

            if (strs.length > 0) {
                let positions = [];

                positions[0] = 0;

                let _key = key;
                ctx.save();
                for (let s = 1; s < strs.length; s++) {
                    positions[s] = ctx.measureText(strs[s-1]).width + positions[s-1];
                    if (s !== 0) key++;
                    this.applyConfig(ctx, this.configs[key]);
                }
                let lineWidth = positions[strs.length-1] + ctx.measureText(strs[strs.length-1]).width;

                key = _key;
                ctx.restore();

                if (this.textAlign === "center") {
                    for (let s = 0; s < strs.length; s++) {
                        positions[s] -= lineWidth/2;
                    }
                }

                for (let s = 0; s < strs.length; s++) {
                    ctx.save();

                    if (s !== 0) key++;

                    this.applyConfig(ctx, this.configs[key]);

                    let outlineOffset = (this.configs[key].stroke ? this.configs[key].stroke.outline/2 : 0);

                    if (this.configs[key].stroke) {
                        ctx.save();
                        this.applyConfig(ctx, this.configs[key].stroke);

                        this.outline = this.configs[key].stroke.outline+1;

                        this.strokeOffsetX = this.configs[key].stroke.offsetX;
                        this.strokeOffsetY = this.configs[key].stroke.offsetY;

                        if (paint) {
                            this._drawTextLine(ctx, strs[s], (count+0)*lineHeight - outlineOffset, positions[s]);
                        }

                        delete this.strokeOffsetX;
                        delete this.strokeOffsetY;
                        delete this.outline;

                        ctx.restore();
                    }

                    if (paint) { this._drawTextLine(ctx, strs[s], (count+0)*lineHeight - outlineOffset, positions[s]); }
                    ctx.restore();

                }
            } else {
                if (paint) { this._drawTextLine(ctx, str, count*lineHeight); }
                if (lines) { lines.push(str); }
                if (o && w == null) { w = ctx.measureText(str).width; }
                if (w > maxW) { maxW = w; }
            }

            count++;
        }

        if (o) {
            o.width = maxW;
            o.height = count*lineHeight;
        }
        if (!paint) { ctx.restore(); }
        return o;
    };

    applyConfig (ctx, config) {
        if (config.font) {
            this.font = config.font;
            ctx.font = config.font;
        }
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = config.color;
        ctx.globalAlpha = (config.alpha !== undefined ? config.alpha : 1);

        if (config.color !== undefined) ctx.strokeStyle = config.color;
        if (config.outline !== undefined) ctx.lineWidth = config.outline*1;
        if (config.miterLimit !== undefined) ctx.miterLimit = config.miterLimit;
        ctx.lineJoin = config.lineJoin || "round";
        ctx.globalAlpha = (config.alpha !== undefined ? config.alpha : 1);

        /*if (config.stroke) {
            ctx.strokeStyle = config.stroke.color || "#000";
            ctx.lineWidth = config.stroke.outline*1;
            ctx.miterLimit = config.stroke.miterLimit;
            ctx.lineJoin = config.stroke.lineJoin || "round";
            ctx.globalAlpha = (config.stroke.alpha !== undefined ? config.stroke.alpha : 1);
        }*/
    }



}