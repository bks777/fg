/**
 * Extend two classes
 * @param Child
 * @param Parent
 */
function extend(Child, Parent)
{
    var F = function() {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
}

/**
 * Array diff
 * @param a1
 * @param a2
 * @returns {Array}
 */
function array_diff(a1, a2) {
    var result = [];
    for (var i = 0; i < a1.length; i++) {
        if (a2.indexOf(a1[i]) === -1) {
            result.push(a1[i]);
        }
    }
    return result;
}

/**
 * Array min
 * @param numArray
 * @returns {number}
 */
function array_min(numArray) {
    return Math.min.apply(null, numArray);
}

/**
 * Array max
 * @param numArray
 * @returns {number}
 */
function array_max(numArray) {
    return Math.max.apply(null, numArray);
}

/**
 * Number format
 * @param number
 * @param decimals
 * @param dec_point
 * @param thousands_sep
 * @returns {string}
 */
function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '')
        .replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function(n, prec) {
            var k = Math.pow(10, prec);
            return '' + (Math.round(n * k) / k)
                .toFixed(prec);
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
        .split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '')
            .length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1)
            .join('0');
    }
    return s.join(dec);
}

/**
 * Sort array by unique values
 * @param arr
 * @returns {Array.<T>}
 */
function sort_unique(arr) {
    return arr.sort().filter(function(el,i,a) {
        return (i==a.indexOf(el));
    });
}

/**
 * Unique concat 2 arrays
 * @param array1
 * @param array2
 */
function concat_unique(array1, array2){
    return array1.concat(array2.filter(function(item){
        return array1.indexOf(item) < 0;
    }));
}

/**
 * Sort numbers by range
 * @param list
 * @returns {*}
 */
function sort_number(list){
    var _sort = function(a, b){
        return a - b;
    };

    list.sort(_sort);
    return list;
}

/**
 * Get Near number from list array
 * @param find
 * @param list
 * @returns {*}
 */
function find_near_number(find, list)
{
    var _cl = null, _cr = null, _cc;

    for(var i = 0; i<list.length; i++){
        _cc = list[i];
        if(_cc < find && ( _cl === null || _cl < _cc)){
            _cl = _cc;
        } else if(_cc > find && ( _cr === null || _cr > _cc)){
            _cr = _cc;
        }
    }

    return [_cl, _cr];
}

/**
 * Find max number from list numbers
 * @param list
 * @returns {number}
 */
function find_max(list){
    var _m = 0;

    for(var i = 0, l = list.length; i<l; i++){
        if(list[i] > _m){
            _m = list[i];
        }
    }

    return _m;
}

/**
 * Generate array range
 * @param from
 * @param to
 * @param step
 * @returns {Array}
 */
function array_range(from, to, step)
{
    var _r = [];
    var _len = getRound((to - from) / step);
    for(var _i = 0; _i < _len; _i++){
        _r.push(from + (_i * step));
    }

    return _r;
}

/**
 * Convert object arguments to string
 * @param object
 * @returns {Array}
 * @constructor
 */
function ObjectToArray(object)
{
    var _ar = [];
    var _key = Object.keys(object);

    for(var _i = 0, _l = _key.length; _i < _l; _i++){
        _ar.push(object[ _key[_i] ]);
    }

    return _ar;
}

/**
 * Get random
 * @param min
 * @param max
 * @returns {*}
 */
function getRandomInt(min, max)
{
    return parseInt(Math.random() * (max - min + 1)) + min;
}

/**
 * Get round number
 * @param numeric
 * @returns {number}
 */
function getRound(numeric)
{
    return ~~ (0.5 + numeric);
}

/**
 * Object clone
 * @param object
 * @returns {*}
 */
function getClone(object)
{
    return JSON.parse(JSON.stringify(object));
}

/**
 * Instance of Classes
 * @param object
 * @param constructor
 * @returns {boolean}
 */
function instanceOf(object, constructor)
{
    var o = object;

    while (o.__proto__ != null) {
        if (o.__proto__ === constructor.prototype) return true;
        o = o.__proto__;
    }

    return false;
}

/**
 * First, checks if it isn't implemented yet.
 */
//if (!String.prototype.format) {
String.prototype.format = function() {
    var args = arguments;
    if(args && args[0] instanceof Array){
        args = args[0];
    }

    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
};
//}

if (typeof Object.assign != 'function') {
    (function () {
        Object.assign = function (target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    })();
}

/**
 * To Translite
 * @param text
 * @returns {XML|string|*|void}
 */
function toTranslite(text)
{
    return (text + "").replace(/([а-яё])|([\s_-])|([^a-z\d])/gi,
        function (all, ch, space, words, i) {
            if (space || words) {
                return space ? '-' : '';
            }
            var code = ch.charCodeAt(0),
                index = code == 1025 || code == 1105 ? 0 :
                    code > 1071 ? code - 1071 : code - 1039,
                t = ['yo', 'a', 'b', 'v', 'g', 'd', 'e', 'zh',
                    'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p',
                    'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh',
                    'shch', '', 'y', '', 'e', 'yu', 'ya'
                ];
            return t[index];
        });
}

/**
 * Get iframe window
 * @param iframe_object
 * @returns {*}
 */
function getIframeWindow(iframe_object) {
    var doc;

    if (iframe_object.contentWindow) {
        return iframe_object.contentWindow;
    }

    if (iframe_object.window) {
        return iframe_object.window;
    }

    if (!doc && iframe_object.contentDocument) {
        doc = iframe_object.contentDocument;
    }

    if (!doc && iframe_object.document) {
        doc = iframe_object.document;
    }

    if (doc && doc.defaultView) {
        return doc.defaultView;
    }

    if (doc && doc.parentWindow) {
        return doc.parentWindow;
    }

    return undefined;
}

/**
 * Decodes data encoded with MIME base64 // base64_decode
 * @param data
 * @returns {string}
 */
function b64d( data ) {	//
    //
    // +   original by: Tyler Akins (http://rumkin.com)

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i=0, enc='';

    do {  // unpack four hexets into three octets using index points in b64
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));

        bits = h1<<18 | h2<<12 | h3<<6 | h4;

        o1 = bits>>16 & 0xff;
        o2 = bits>>8 & 0xff;
        o3 = bits & 0xff;

        if (h3 == 64)	  enc += String.fromCharCode(o1);
        else if (h4 == 64) enc += String.fromCharCode(o1, o2);
        else			   enc += String.fromCharCode(o1, o2, o3);
    } while (i < data.length);

    return enc;
}

/**
 * Delay for Promise
 * @param duration
 * @returns {Function}
 */
function delayPromise(duration){
    return function(){
        return new Promise(function(resolve, reject){
            setTimeout(function(){
                resolve();
            }, duration)
        });
    };
}


var _canvasType = null;

/**
 * WebGl detect function
 * @param return_context
 * @returns {*}
 */
function webgl_detect(return_context)
{//return true;
    if (!!window.WebGLRenderingContext) {
        var canvas = document.createElement("canvas"),
            names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"],
            context = false;

        for(var i=0;i<4;i++) {
            try {
                context = canvas.getContext(names[i]);
                if (context && typeof context.getParameter == "function") {
                    // WebGL is enabled
                    if (return_context) {
                        // return WebGL object if the function's argument is present
                        _canvasType = names[i];
                        return true;// {name:names[i], gl:context};
                    }
                    // else, return just true
                    return true;
                }
            } catch(e) {}
        }

    }

    // WebGL not supported
    return false;
}

/**
 * Run the application by initializing all the events and their method...
 * @type {{list: Array, run: Function}}
 * @private
 */
var __RunApplication = {
    list: [],
    run: function()
    {
        document.getElementById('wrapper').innerHTML = "";
        document.getElementsByTagName("html")[0].className = __RunPartialApplication.type;

        if(this.list instanceof Array && this.list.length > 0){

            for(var i=0; i<this.list.length; i++){

                setTimeout((function(window, event, i){

                    try{

                        window[ event[i] ].run();

                        if(typeof window[ event[i]].completeRun == "function"){
                            window[ event[i]].completeRun();
                        }

                        } catch(e) {
                            $_log.error(e, window[ event[i] ], event[i]);
                        }

                }(window, this.list, i)), 1);

                if(this.list.length - 1 == i){
                    //$_event.setEvent('startLoading');

                    $_view_canvas.initMainCanvas();
                    $_signal.goTo("preloader.startLoading");
                }
            }
        }
    }
};

