/**
 * Canvas parser to page block
 * @constructor
 */
var CanvasParser = function(){

    this.init = function(data)
    {
        for(var key in data){
            this[key] = data[key];
        }
    };
};