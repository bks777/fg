/**
 * Text Model fro UI
 * @with Translations
 */
export default class Text extends createjs.Text {
    constructor (config) {

        config = config || {};

        /**
         * To translate alias of text
         */
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

        let {
                text = "",
                font = "12pt Arial",
                fontFamily = "Arial",
                textAlign,
                textBaseline,
                lineHeight,
                lineWidth,
                outline,

                color = "#000000",
                fontSize = "12pt",
                fontStyle = "",
                lineJoin = "round",
                miterLimit,
                circleText,
                stroke

            } = config;

        if (config.font === undefined) {
            font = `${fontStyle} ${fontSize} ${fontFamily}`;
        }

        /**
         * If isset text Transform
         */
        if(config.fontTransform != undefined){
            switch (config.fontTransform){
                case "uppercase": config.text = config.text.toUpperCase(); break;
                default:
            }
        }

        super(text, font, color);

        this.lineJoin = lineJoin;

        if (miterLimit !== undefined) {
            this.miterLimit = miterLimit;
        }

        if (textAlign !== undefined) {
            this.textAlign = textAlign;
        }

        if (textBaseline !== undefined) {
            this.textBaseline = textBaseline;
        }

        if (lineHeight !== undefined) {
            this.lineHeight = lineHeight;
        }

        if (lineWidth !== undefined) {
            this.lineWidth = lineWidth;
        }

        if (lineWidth !== undefined) {
            this.lineWidth = lineWidth;
        }

        if (outline !== undefined) {
            this.outline = outline;
        }

        if (circleText) {
            this.circleText = {
                diameter: 100,
                startAngle: 0,
                align: "center",
                clockwise: 1,
                textInside: false,
                inwardFacing: true,
                kerning: 0,
                inverse:false
            };

            Object.assign (this.circleText, circleText);
        }

        //this.radius = radius;
        this.stroke = stroke;

        //this.textBaseline = "center";
    }

    setText (text) {
        //TODO: text = a18i(text);
        let textConfig = $_t.get(text);

        if(textConfig instanceof Object){
            text = textConfig.text;
        } else {
            text = textConfig;
        }
        this.text = text;
    }

    draw (ctx, ignoreCache) {
        if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }

        if (this.stroke) {
            ctx.save();
            ctx.strokeStyle = this.stroke.color || "#000";
            ctx.lineWidth = this.stroke.outline*1;
            ctx.miterLimit = this.stroke.miterLimit;
            ctx.lineJoin = this.stroke.lineJoin || "round";
            ctx.globalAlpha = this.stroke.alpha;

            let outline = this.outline;
            this.outline = this.stroke.outline+1;

            this.strokeOffsetX = this.stroke.offsetX;
            this.strokeOffsetY = this.stroke.offsetY;

            this._drawText(this._prepContext(ctx));

            delete this.strokeOffsetX;
            delete this.strokeOffsetY;
            this.outline = outline;
            ctx.restore();
        }

        var col = this.color || "#000";
        if (this.outline) {
            ctx.strokeStyle = col;
            ctx.lineWidth = this.outline*1;
            ctx.miterLimit = this.miterLimit;
            ctx.lineJoin = this.lineJoin;
        } else {
            ctx.fillStyle = col;
        }

        this._drawText(this._prepContext(ctx));
        return true;
    }

    _drawTextOverCircle (ctx, text, diameter, startAngle, align, clockwise, textInside, inwardFacing, kerning, inverse) {
        // text:         The text to be displayed in circular fashion
        // diameter:     The diameter of the circle around which the text will
        //               be displayed (inside or outside)
        // startAngle:   In degrees, Where the text will be shown. 0 degrees
        //               if the top of the circle
        // align:        Positions text to left right or center of startAngle
        // textInside:   true to show inside the diameter. False to show outside
        // inwardFacing: true for base of text facing inward. false for outward
        // kearning:     0 for normal gap between letters. positive or
        //               negative number to expand/compact gap in pixels
        //------------------------------------------------------------------------

        let textHeight = 0;

        align = align.toLowerCase();
        startAngle = startAngle * (Math.PI / 180); // convert to radians

        // Setup letters and positioning
        //ctx.translate(diameter / 2, diameter / 2); // Move to center
        ctx.translate(0, diameter / 2); // Move to center
        startAngle += (Math.PI * !inwardFacing); // Rotate 180 if outward
        ctx.textBaseline = 'middle'; // Ensure we draw in exact center
        ctx.textAlign = 'center'; // Ensure we draw in exact center

        // rotate 50% of total angle for center alignment
        if (align == "center") {
            for (var j = 0; j < text.length; j++) {
                var charWid = ctx.measureText(text[j]).width;
                startAngle += ((charWid + (j == text.length-1 ? 0 : kerning)) / (diameter / 2 - textHeight)) / 2 * -clockwise;
            }
        }

        // Phew... now rotate into final start position
        ctx.rotate(startAngle);

        if (inverse) {
            //ctx.scale(1,-1);

            for (var j = 0; j < text.length; j++) {
                var charWid = ctx.measureText(text[j]).width; // half letter
                //ctx.translate(0, diameter / 2); // Move to center
                ctx.rotate((charWid/2) / (diameter / 2 - textHeight) * clockwise);

                //ctx.translate(0, (inwardFacing ? 1 : -1) * (0 - diameter / 2 + textHeight / 2));
                //ctx.rotate(Math.PI);
                this.__drawTextLine(ctx, text[j], (inwardFacing ? 1 : -1) * (0 - diameter / 2 + textHeight / 2));
                //ctx.rotate(Math.PI);

                //ctx.translate(0, diameter / 2);
                ctx.rotate((charWid/2 + kerning) / (diameter / 2 - textHeight) * clockwise); // rotate half letter
            }

        } else {
            // Now for the fun bit: draw, rotate, and repeat
            for (var j = 0; j < text.length; j++) {
                var charWid = ctx.measureText(text[j]).width; // half letter
                // rotate half letter
                ctx.rotate((charWid/2) / (diameter / 2 - textHeight) * clockwise);
                // draw the character at "top" or "bottom"
                // depending on inward or outward facing
                //ctx.fillText(text[j], 0, (inwardFacing ? 1 : -1) * (0 - diameter / 2 + textHeight / 2));
                this.__drawTextLine(ctx, text[j], (inwardFacing ? 1 : -1) * (0 - diameter / 2 + textHeight / 2));
                ctx.rotate((charWid/2 + kerning) / (diameter / 2 - textHeight) * clockwise); // rotate half letter
            }
        }
    }

    _drawTextLine (ctx, text, y, x = 0) {

        if (this.circleText) {
            this._drawTextOverCircle(ctx, text,
                this.circleText.diameter, this.circleText.startAngle, this.circleText.align, this.circleText.clockwise,
                this.circleText.textInside, this.circleText.inwardFacing, this.circleText.kerning, this.circleText.inverse);
                //950, 0,  "center", 1, false, true, 2);
        } else {
            this.__drawTextLine(ctx, text, y, x);
        }
    }

    /**
     * @method _drawTextLine
     * @param {CanvasRenderingContext2D} ctx
     * @param {String} text
     * @param {Number} y
     * @param {Number} x
     * @protected
     **/
    __drawTextLine (ctx, text, y, x = 0) {
        // Chrome 17 will fail to draw the text if the last param is included but null, so we feed it a large value instead:

        if (this.outline) {

            if (this.strokeOffsetX) {
                for (let i = 0; i < this.stroke.offsetX; i++) {
                    ctx.strokeText(text, i, y, this.maxWidth||0xFFFF);
                }
            } else if (this.strokeOffsetY) {
                for (let i = 0; i < this.stroke.offsetY; i++) {
                    ctx.strokeText(text, x, y+i, this.maxWidth||0xFFFF);
                }
            } else {
                ctx.strokeText(text, x, y, this.maxWidth||0xFFFF);
            }
        }
        else {
            ctx.fillText(text, x, y, this.maxWidth||0xFFFF);
        }
    };


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
        var lineHeight = this.lineHeight||this.getMeasuredLineHeight();

        var maxW = 0, count = 0;
        var hardLines = String(this.text).split(/(?:\r\n|\r|\n)/);
        for (var i=0, l=hardLines.length; i<l; i++) {
            var str = hardLines[i];
            var w = null;

            if (this.lineWidth != null && (w = ctx.measureText(str).width) > this.lineWidth) {
                // text wrapping:
                var words = str.split(/(\s)/);
                str = words[0];
                w = ctx.measureText(str).width;

                for (var j=1, jl=words.length; j<jl; j+=2) {
                    // Line needs to wrap:
                    var wordW = ctx.measureText(words[j] + words[j+1]).width;
                    if (w + wordW > this.lineWidth) {
                        if (paint) { this._drawTextLine(ctx, str, count*lineHeight); }
                        if (lines) { lines.push(str); }
                        if (w > maxW) { maxW = w; }
                        str = words[j+1];
                        w = ctx.measureText(str).width;
                        count++;
                    } else {
                        str += words[j] + words[j+1];
                        w += wordW;
                    }
                }
            }

            if (paint) { this._drawTextLine(ctx, str, count*lineHeight); }
            if (lines) { lines.push(str); }
            if (o && w == null) { w = ctx.measureText(str).width; }
            if (w > maxW) { maxW = w; }
            count++;
        }

        if (o) {
            o.width = maxW;
            o.height = count*lineHeight;
        }
        if (!paint) { ctx.restore(); }
        return o;
    };

}