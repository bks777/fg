export default class SpriteSheet extends createjs.SpriteSheet {
    constructor (_config, alias = null) {

        let config = Object.assign({}, _config);

        var src = config.images;
        if (typeof src === "string"){

            if(alias === null){
                $_log.error(`Not found "alias" parameter for new SpriteSheet! Src => "${src}"`);
                return ;
            }
            src = $_required.getImageRawData(src, alias);
            if (!src) {
                $_log.error (`Not found image for new SpriteSheet! alias => "${alias}" image_alias => "${config.images}"`);
                return;
            }

            config.images = [src];

        } else if (src instanceof HTMLImageElement || src instanceof HTMLCanvasElement) {

            config.images = [src];

        } else if (src instanceof Array) {

            if(alias === null){
                $_log.error(`Not found "alias" parameter for new SpriteSheet! Src => "${src}"`);
                return ;
            }

            let images = [];
            for (let i = 0; i < src.length; i++) {

                if (typeof src[i] === "string") {

                    let img = $_required.getImageRawData(src[i], alias);
                    if (!img) {
                        $_log.error (`Not found image for new SpriteSheet! alias => "${alias}" image_alias => "${config.images}", ${src[i]} `);
                        continue;
                    }

                    images.push (img);

                } else if (src[i] instanceof HTMLImageElement || src[i] instanceof HTMLCanvasElement) {
                    images.push(src[i]);
                }
            }

            config.images = images;

        }

       /* config.images = config.images.map ((image) => {

            let canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            let ctx = canvas.getContext("2d");

            ctx.drawImage(image, 0, 0, image.width, image.height);

            return canvas;
        });*/

        super(config);
    }
}