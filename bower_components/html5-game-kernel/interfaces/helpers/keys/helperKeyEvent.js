/**
 * Helper for check event key in other browsers
 */
var HelperKeyEvent = new function()
{
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

    //alert(isMobile);

    /**
     * List checked events
     * @type {{startEvent: string[], moveEvent: string[], endEvent: string[]}}
     * @private
     */
    var _listMainEvent = {
        "startEvent": ["ontouchstart","onmousedown"],
        "clickEvent": ["ontouchstart","onclick"],
        "moveEvent": ["ontouchmove","onmousemove"],
        "endEvent": ["ontouchend","onmouseup"],
        "activeEvent": ["ontouchstart", "onmousedown"],
        "unActiveEvent": ["ontouchend", "onmouseup"],
        "hoverEvent": ["ontouchstart", "onmouseover"],
        "unHoverEvent": ["ontouchstart", "onmouseleave"]
    };

    var _cache = {};

    /**
     * Check action method
     * @param nameEvent
     * @param returnShortName
     * @returns {*}
     */
    this.check = function(nameEvent, returnShortName)
    {
        if(typeof _cache[nameEvent] != 'undefined'){
            return returnShortName ? _cache[nameEvent].slice(2) : _cache[nameEvent];
        }

        var _keys = Object.keys(_listMainEvent);

        if(_keys.indexOf(nameEvent) == -1){
            $_log.error("Can not found a type of key event!", nameEvent);
            return null;
        }

        if(isMobile === false){
            _cache[nameEvent] = _listMainEvent[nameEvent][1];

        } else {

            for(var i=0; i<_listMainEvent[nameEvent].length; i++){

                if((_listMainEvent[nameEvent][i] in window) === true){
                    _cache[nameEvent] = _listMainEvent[nameEvent][i];
                    break;
                }
            }
        }

        return returnShortName ? _cache[nameEvent].slice(2) : _cache[nameEvent];
    };

    /**
     * Show cache event for debug
     * @returns {{}}
     */
    this.showCache = function()
    {
        return _cache;
    };
};
