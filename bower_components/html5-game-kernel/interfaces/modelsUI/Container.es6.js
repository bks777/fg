

export default class Container extends createjs.Container {

    constructor (config) {
        super();

        config = config || {};
        this.left = config.left || 0;
        this.top = config.top || 0;

        this.relative = {
            width: {},
            height: {},
            left: {},
            right: {},
            top: {},
            bottom: {},
            align: {},
            verticalAlign: {}
        };

        if (config.width) this.width = config.width;
        if (config.height) this.height = config.height;

        if (config.backgroundColor !== undefined) {
            this.setBacgkroundColor(config.backgroundColor);
            /*
            this.backgroundColorFill = new createjs.Shape();
            let b = this.backgroundColorFill.graphics;
            b.beginFill(config.backgroundColor).drawRect(0,0,1,1);
            this.addChild(this.backgroundColorFill);*/
        }

        if (config.backgroundClickable) {
            this.enableClickableBackground();
        }

        if (config.overflow === "hidden") {
            this.enableOverflowHidden ();
        }

        if (config.mouseChildren !== undefined) {
            this.mouseChildren = config.mouseChildren;
        }
    }

    addChild(child) {

        super.addChild(child);

        if (this.backgroundColorFill) {
            this.backgroundColorFill.scaleX = this.width;
            //this.backgroundColorFill.updateCache();
        }

        if (this.backgroundClickable) {
            this.setClickableBackground();
        }

        if (this.overflowHidden) {
            this.setOverflowHidden();
        }
    }

    setBacgkroundColor (color) {
        if (!this.backgroundColorFill) {
            this.backgroundColorFill = new createjs.Shape();
        }
        let b = this.backgroundColorFill.graphics;
        b.beginFill(color).drawRect(0,0,1,1);
        this.addChildAt(this.backgroundColorFill, 0);

        this.backgroundColorFill.scaleX = this.width;
        this.backgroundColorFill.scaleY = this.height;
        //this.backgroundColorFill.cache(0,0,this.width, this.height);
    }

    enableOverflowHidden () {
        this.overflowHidden = true;
        this.setOverflowHidden();
    }

    disableOverflowHidden () {
        this.overflowHidden = false;
        this.mask = null;
    }

    setOverflowHidden () {
        if (this.width && this.height) {
            var maskShape = new Shape();
            maskShape.graphics.drawRect(this.x, this.y, this.width, this.height);
            this.mask = maskShape;
        }
    }

    enableClickableBackground () {
        this.backgroundClickable = true;
        this.setClickableBackground();
    }

    disableClickableBackground () {
        this.backgroundClickable = false;
        this.hitArea = null;
    }

    setClickableBackground () {
        if (this.width && this.height) {
            var hitArea = new createjs.Shape();
            var g = hitArea.graphics;
            g.beginFill("#000").drawRect(0, 0, this.width, this.height).endFill();
            this.hitArea = hitArea;
        }
    }

    setChildAlign (align, child) {
        if (this.getChildByName(child.name) === null) {
            $_log.warning("child not found", child.name, this.name);
            //return false;
        }

        let width = this.width;
        let childWidth = child.width || (child.getBounds() !== null ? child.getBounds().width : 0);

        if (width === undefined || childWidth === undefined) {
            return false;
        }

        if (child.name && (align === "left" || align === "center" || align === "right")) {
            if (this.relative.left[child.name]) {
                delete this.relative.left[child.name];
            }
            if (this.relative.right[child.name]) {
                delete this.relative.right[child.name];
            }
        }

        if (align === "left") {
            child.x = 0;
            return true;
        }

        if (align === "center") {
            child.x = width/2 - childWidth/2;
            if (child.name) {
                this.relative.align[child.name] = align;
            }
            return true;
        } else if (align === "right") {
            child.x = width - childWidth;
            if (child.name) {
                this.relative.align[child.name] = align;
            }
            return true;
        }

        return false;
    }

    setChildVerticalAlign (align, child) {
        if (this.getChildByName(child.name) === null) {
            $_log.warning("child not found", child.name, this.name);
            //return false;
        }

        let height = this.height;

        let childHeight;

        if (child.height === undefined){
            let b = child.getBounds();
            if (b === null) {
                return false;
            }
            childHeight =  b.height;
        } else {
            childHeight = child.height;
        }

        if (height === undefined || childHeight === undefined) {
            return false;
        }

        if (child.name && (align === "top" || align === "middle" || align === "bottom")) {
            if (this.relative.top[child.name]) {
                delete this.relative.top[child.name];
            }
            if (this.relative.bottom[child.name]) {
                delete this.relative.bottom[child.name];
            }
        }

        if (align === "top") {
            child.y = 0;
            return true;
        }

        if (align === "middle") {
            child.y = height/2 - childHeight/2;
            if (child.name) {
                this.relative.verticalAlign[child.name] = align;
            }
            return true;
        } else if (align === "bottom") {
            child.y = height - childHeight;
            if (child.name) {
                this.relative.verticalAlign[child.name] = align;
            }
            return true;
        } else

        return false;
    }

    setChildLeft (child, left) {
        if (this.getChildByName(child.name) === null) {
            $_log.warning("child not found", child.name, this.name);
            //return false;
        }
        if (typeof left === "string" && left.indexOf("%") > -1) {
            if (child.name) {
                this.relative.left[child.name] = left;
            }
            let leftPercent = parseFloat(left)/100;
            if (this.width === undefined) {
                return false;
            }
            left = this.width * leftPercent;
        } else {
            if (this.relative.left[child.name]) {
                delete this.relative.left[child.name];
            }
        }

        if (child.name) {
            if (this.relative.right[child.name]) {
                delete this.relative.right[child.name];
            }
            if (this.relative.align[child.name]) {
                delete this.relative.align[child.name];
            }
        }

        child.x = left;

        return true;
    }

    setChildRight (child, right) {
        if (this.getChildByName(child.name) === null) {
            $_log.warning("child not found", child.name, this.name);
            //return false;
        }

        if (typeof right === "string" && right.indexOf("%") > -1) {
            let rightPercent = parseFloat(right)/100;
            if (this.width === undefined) {
                return false;
            }
            right = this.width * rightPercent;
        }

        if (child.name) {
            this.relative.right[child.name] = right;

            if (this.relative.left[child.name]) {
                delete this.relative.left[child.name];
            }

            if (this.relative.align[child.name]) {
                delete this.relative.align[child.name];
            }
        }

        let childWidth = child.width || (child.getBounds() === null ? 0 : child.getBounds().width);
        child.x = this.width - childWidth - right;

        return true;
    }

    setChildTop (child, top) {
        if (this.getChildByName(child.name) === null) {
            $_log.warning("child not found", child.name, this.name);
            //return false;
        }

        if (typeof top === "string" && top.indexOf("%") > -1) {
            if (child.name) {
                this.relative.top[child.name] = top;
            }
            let topPercent = parseFloat(top)/100;
            if (this.height === undefined) {
                return false;
            }
            top = this.height * topPercent;
        } else {
            if (child.name) {
                if (this.relative.top[child.name]) {
                    delete this.relative.top[child.name];
                }
            }
        }

        if (child.name) {
            if (this.relative.bottom[child.name]) {
                delete this.relative.bottom[child.name];
            }
            if (this.relative.verticalAlign[child.name]) {
                delete this.relative.verticalAlign[child.name];
            }
        }

        child.y = top;

        return true;
    }

    setChildBottom (child, bottom) {
        if (this.getChildByName(child.name) === null) {
            $_log.warning("child not found", child.name, this.name);
            //return false;
        }

        if (typeof bottom === "string" && bottom.indexOf("%") > -1) {
            let bottomPercent = parseFloat(bottom)/100;
            if (this.height === undefined) {
                return false;
            }
            bottom = this.height * bottomPercent;
        }

        if (child.name) {
            this.relative.bottom[child.name] = bottom;

            if (this.relative.top[child.name]) {
                delete this.relative.top[child.name];
            }

            if (this.relative.verticalAlign[child.name]) {
                delete this.relative.verticalAlign[child.name];
            }
        }

        let childHeight = child.height || (child.getBounds() === null ? 0 : child.getBounds().height);
        child.y = this.height - childHeight - bottom;

        return true;
    }

    setChildWidth (child, width) {
        if (this.getChildByName(child.name) === null) {
            $_log.warning("child not found", child.name, this.name);
            //return false;
        }
        if (typeof width === "string" && width.indexOf("%") > -1) {
            if (child.name) {
                this.relative.width[child.name] = width;
            }

            let widthPercent = parseFloat(width)/100;
            if (this.width === undefined) {
                return false;
            }
            width = this.width * widthPercent;
        } else {
            if (child.name) {
                if (this.relative.width[child.name]) {
                    delete this.relative.width[child.name];
                }
            }
        }
        child.width = width;

        return true;
    }

    setChildHeight (child, height) {
        if (this.getChildByName(child.name) === null) {
            $_log.warning("child not found", child.name, this.name);
            //return false;
        }
        if (typeof height === "string" && height.indexOf("%") > -1) {

            if (child.name) {
                this.relative.height[child.name] = height;
            }

            let heightPercent = parseFloat(height)/100;
            if (this.height === undefined) {
                return false;
            }
            height = this.height * heightPercent;
        } else {
            if (child.name) {
                if (this.relative.height[child.name]) {
                    delete this.relative.height[child.name];
                }
            }
        }
        child.height = height;

        return true;
    }

    set x (value) {
        this._x = value;
        if (this.overflowHidden) {
            this.setOverflowHidden();
        }
    }

    get x () {
        return this._x;
    }

    set y (value) {
        this._y = value;
        if (this.overflowHidden) {
            this.setOverflowHidden();
        }
    }

    get y () {
        return this._y;
    }

    set left (left) {
        this.x = left;

       /* if (this.overflowHidden) {
            this.setOverflowHidden();
        }*/
    }
    get left (){
        return this.x;
    }

    set top (top){
        this.y = top;

       /* if (this.overflowHidden) {
            this.setOverflowHidden();
        }*/
    }
    get top(){
        return this.y;
    }

    _setWidth (width) {
        this._width = width;

        for (let child in this.relative.width) {
            let childInstance = this.getChildByName(child);
            if (childInstance) {
                this.setChildWidth(childInstance, this.relative.width[child]);
            } else {
                delete this.relative.width[child];
            }
        }

        for (let child in this.relative.align) {
            let childInstance = this.getChildByName(child);
            if (childInstance) {
                this.setChildAlign( this.relative.align[child], childInstance);
            } else {
                delete this.relative.align[child];
            }
        }

        for (let child in this.relative.right) {
            let childInstance = this.getChildByName(child);
            if (childInstance) {
                this.setChildRight(childInstance, this.relative.right[child]);
            } else {
                delete this.relative.right[child];
            }
        }

        for (let child in this.relative.left) {
            let childInstance = this.getChildByName(child);
            if (childInstance) {
                this.setChildLeft(childInstance, this.relative.left[child]);
            } else {
                delete this.relative.left[child];
            }
        }
        if (this.backgroundColorFill) {
            this.backgroundColorFill.scaleX = width;
            //this.backgroundColorFill.updateCache();
        }

        if (this.backgroundClickable) {
            this.setClickableBackground();
        }

        if (this.overflowHidden) {
            this.setOverflowHidden();
        }
    }

    set width (width) {
        this._setWidth(width);
    }

    get width () {
        if (this._width !== undefined) {
            return this._width;
        }
        let b = this.getBounds();
        if (b !== null) {
            return b.width;
        } else {
            return undefined;
        }
    }

    _setHeight (height) {
        this._height = height;

        for (let child in this.relative.height) {
            let childInstance = this.getChildByName(child);
            if (childInstance) {
                this.setChildHeight(childInstance, this.relative.height[child]);
            } else {
                delete this.relative.height[child];
            }
        }

        for (let child in this.relative.bottom) {
            let childInstance = this.getChildByName(child);
            if (childInstance) {
                this.setChildBottom(childInstance, this.relative.bottom[child]);
            } else {
                delete this.relative.bottom[child];
            }
        }

        for (let child in this.relative.verticalAlign) {
            let childInstance = this.getChildByName(child);
            if (childInstance) {
                this.setChildVerticalAlign( this.relative.verticalAlign[child], childInstance);
            } else {
                delete this.relative.verticalAlign[child];
            }
        }
        if (this.backgroundColorFill) {
            this.backgroundColorFill.scaleY = height;
            //this.backgroundColorFill.updateCache();
        }

        if (this.backgroundClickable) {
            this.setClickableBackground();
        }

        if (this.overflowHidden) {
            this.setOverflowHidden();
        }
    }

    set height (height) {
        this._setHeight(height);

    }
    get height () {
        if (this._height !== undefined) {
            return this._height;
        }
        let b = this.getBounds();
        if (b !== null) {
            return b.height;
        } else {
            return undefined;
        }
    }

}