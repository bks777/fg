export default class Bitmap extends createjs.Bitmap {
    constructor (config, alias = null) {
        var src = config.src || config;
        if(!(src instanceof HTMLImageElement || src instanceof HTMLCanvasElement)){

            if(alias === null){
                $_log.error(`Not found "alias" parameter for new Bitmap! Src => "${src}"`);
                return ;
            }

            /**
             * If cross component alias
             */
            if(config.alias !== undefined){
                alias = config.alias;
            }

            let imageAlias = src;
            src = $_required.getImageRawData(src, alias);
            if (src === null) {
                $_log.error (`Image with alias = ${imageAlias} for component ${alias} not found`);
                return;
            }
        }

        super(src);

        this.componentAlias = alias;

        if (this.image === null) {
            $_log.error(`Cannot create Bitmap with alias = ${src}`);
            return;
        }

        this.left = config.left || 0;
        this.top = config.top || 0;

        if (config.width !== undefined) this.width = config.width;
        if (config.height !== undefined) this.height = config.height;
        if (config.scaleX !== undefined) this.scaleX = config.scaleX;
        if (config.scaleY !== undefined) this.scaleY = config.scaleY;
        if (config.rotation !== undefined) {
            this.rotation = config.rotation;
        }
    }

    set width(width) {
        if (width === "") {
            this.scaleX = 1;
            return;
        }
        if (this.image) {
            this.scaleX = width/this.image.width;
        } else {
            this.image.onload = () => {
                this.width = width;
            };
        }
       /* if (this.stage) {
            this.stage.requestUpdate();
        }*/
    }
    get width () {
        return this.image.width*this.scaleX;
    }

    set height(height) {
        if (height === "") {
            this.scaleY = 1;
            return;
        }
        if (this.image) {
            this.scaleY = height/this.image.height;
        } else {
            this.image.onload = () => {
                this.height = height;
            };
        }
        /*if (this.stage) {
            this.stage.requestUpdate();
        }*/
    }
    get height () {
        return this.image.height * this.scaleY;
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

    setImage (imageAlias, componentAlias = this.componentAlias) {
        if (!imageAlias) {
            return;
        }
        this.image = $_required.getImageRawData(imageAlias, componentAlias);
    }
}