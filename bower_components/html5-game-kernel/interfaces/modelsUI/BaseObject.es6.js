export default class BaseObject {

    constructor (config) {

    }

    set left (left) {
        this.x = left;
    }
    get left (){
        return this.x;
    }

    set top (top){
        this.y = top;
    }
    get top(){
        return this.y;
    }

    set width (width) {
        this._width = width;
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

    set height (height) {
        this._height = height;
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