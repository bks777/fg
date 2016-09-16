/**
 * HHS Shifter templates
 * @constructor
 */
var HHSShifterTemplates = function()
{
    var _cssIsset = false;
    var _css = "<style type='text/css'>\
        #hhs_shifter_block, #hhs_shifter_popup{font-size: 16px;}\
        #hhs_shifter_block ._check_ { background-image: url('data:image/png;base64,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'); }\
        #hhs_shifter_block ._keys_, #hhs_shifter_popup ._keys_ { background-image: url('data:image/png;base64,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'); }\
        #hhs_shifter_block ._key_up_ {padding: 10px; position: relative; color: #000; border: 1px solid #ccc; border-radius: 5px;}\
        #hhs_shifter_block{width: 100%; height: 100%; position: absolute; top: 0; left: 0; background: #efefef; overflow: hidden; overflow-y: scroll; z-index: 5000010;}\
        #hhs_shifter_block h4, #hhs_shifter_popup h4{color: #000; text-align: center; border-bottom: 1px solid #ccc; position: relative; font-size: 1.2rem;}\
        #hhs_shifter_block ._close_, #hhs_shifter_popup ._close_{position: absolute; top: 1.5rem; right: 0.2rem; width: 3.9rem; height:1.9rem; background-size: 700% 300%; background-position: 15% 92%; z-index: 1000}\
        #hhs_shifter_popup ._list_{padding-top: 1rem; width: 100%; height: 100%; overflow-y:scroll;}\
        #hhs_shifter_block table tr td:first-child {color: rgba(29, 27, 92, 0.87); padding: 0.1rem 0.1rem 0.1rem 0.2rem; border-bottom: 1px solid #ccc;}\
        #hhs_shifter_block table tr td:last-child {color: rgba(29, 27, 92, 0.87); padding: 0.1rem; border-bottom: 1px solid #ccc;}\
        #hhs_shifter_block ._check_._ch_{display: inline-block; margin-top:0.2rem; width: 2.6rem; height: 0.9rem; background-size: 100% 260%; background-position :0 -60%;}\
        #hhs_shifter_block ._check_._ch_._active_{background-position: 0 0;}\
        \
        #hhs_shifter_popup{width: 100%; height: 100%; overflow:hidden; position: absolute; top: 0; left: 0; padding: 0; background: #efefef; z-index: 5000020;}\
        #_shif_value{width: 80%; display: block; padding: 4px; font-size: 0.8rem; color: #000; border: 1px solid #000; margin: 10px auto; border-radius: 3px; box-shadow: 2px 1px 1px #999;}\
        \
        #hhs_shifter_popup ._i_key{width: 2.2rem; height: 2.2rem; margin: 2px 7px; float: left; background-size: 1600% 310%;}\
        #hhs_shifter_popup ._clear_{width: 100%; clear:both; height: 0.3rem;}\
        #hhs_shifter_popup ._i_key._n1{background-position: 0 0;}\
        #hhs_shifter_popup ._i_key._n2{background-position: -100.2% 0;}\
        #hhs_shifter_popup ._i_key._n3{background-position: -93.4% 0;}\
        #hhs_shifter_popup ._i_key._n4{background-position: -86.8% 0;}\
        #hhs_shifter_popup ._i_key._n5{background-position: -80.0% 0;}\
        #hhs_shifter_popup ._i_key._n6{background-position: -73.6% 0;}\
        #hhs_shifter_popup ._i_key._n7{background-position: -67.1% 0;}\
        #hhs_shifter_popup ._i_key._n8{background-position: -60.2% 0;}\
        #hhs_shifter_popup ._i_key._n9{background-position: -53.7% 0;}\
        #hhs_shifter_popup ._i_key._n0{background-position: -46.8% 0;}\
        \
        #hhs_shifter_popup ._i_key._n_bp{background-position: -12.2% 0; width: 2.8rem; background-size: 1000% 310%;}\
        #hhs_shifter_popup ._i_key._n_k{background-position: -39.8% 0;}\
        #hhs_shifter_popup ._i_key._n_set{background-position: -34.5% 0; width: 2.8rem; background-size: 1000% 310%;}\
        #hhs_shifter_popup ._i_key._n_del{background-position: -23.5% 0; width: 2.8rem; background-size: 1000% 310%;}\
        #hhs_shifter_block #_shifter_trace_console{display:block; width: 100%; height: 30%; position: fixed; bottom: 0; left: 0; border-top: 1px solid #000; }\
        #hhs_shifter_block #_shifter_trace_console #_trace_console{display:block; width: 100%; height: 100%;  background: #fff; color: #000; font-size: 1rem; line-height: 12px; padding: 5px}\
        #hhs_shifter_block ._shifter._trace_dom{display:block; width: 100%; height: 100%;  background: #fff; color: #000; font-size: 1rem; line-height: 12px; padding: 5px; position: absolute; overflow-y: scroll; top: 0; left: 0; z-index: 10000}\
        #hhs_shifter_block #list_dom_log{display:block; width: 100%; height: 100%;  background: #fff; color: #000; font-size: 1rem; line-height: 12px; padding: 5px; }\
        #hhs_shifter_popup ._e_ {width: 99%; clear: both; border-bottom: 1px solid #ccc; padding: 1px;}\
        #hhs_shifter_popup ._e_t {width: 20%; float: left; border-right: 1px solid  #ccc; color: #000;}\
        #hhs_shifter_popup ._e_p {width: 5%; float: left; color: red; border-right: 1px solid  #ccc; color: #000;}\
        #hhs_shifter_popup ._e_l {width: 74%; float: left; height: 12px; position: relative;}\
        #hhs_shifter_popup ._e_l ._i_ {position: absolute; background-color: red; height: 12px; top: 1px; left: 0; width: 2px;}\
        </style>";

    var _templates = {
        'init': '<a id="{{=it._id }}" oncontextmenu="return false" style="cursor: pointer; display:block; z-index: 5000000; background: red; width: 50px; height: 50px; position: absolute; bottom: 1rem; left: 1rem; opacity: 0.1;" {{=HelperKeyEvent.check("clickEvent")}}="$_shifter.open();"></a>',
        'main': '<div id="{{=it._id }}">\
                    <h4>\
                        Shifter for &laquo;{{=it._title }}&raquo;\
                        (<a href="#" onclick="{{=it._trace_key }} return false" style="display: inline-block" class="allowMultiClick">Trace</a>)\
                        <a href="#" class="_close_ _keys_ allowMultiClick" onclick="{{=it._close }} return false" style=""></a>\
                    </h4>\
                    <div class="_list_"><table width="100%" class="_scroll" border="0" cellspacing="0" cellpadding="0">\
                        {{ for(var key in it._list) { }}\
                            <tr>\
                                <td width="50%"><strong>{{=it._list[key].name }}</strong></td>\
                                <td width="50%" id="__shifter_{{=key }}">\
                                    {{? !it._data[key] || (it._data[key] && it._data[key].length == 0) }}\
                                        {{=it._r(\'emptyData.\' + it._list[key].type, {_name: key})}}\
                                    {{?}}\
                                    \
                                    {{? it._data[key] }}\
                                        {{=it._r(\'issetData.\' + it._list[key].type, {_name: key, value: it._data[key]})}}\
                                    {{?}}\
                                    \
                                </td>\
                            </tr>\
                        {{ } }}\
                    </table></div>\
                </div>',

        'emptyData': {
            'text': '<div style="color: gray; display: inline-block" class="allowMultiClick" onclick="$_shifter.openChange(\'{{=it._name}}\'); return false">empty</div>',
            'boolean': '<div class="_check_ _ch_ allowMultiClick" onclick="$_shifter.changeBoolean(\'{{=it._name }}\', this); return false" ontouchstart="$_shifter.changeBoolean(\'{{=it._name }}\', this); return false"></div>',
            'button': '<div class="_check_ _ch_ allowMultiClick" onclick="$_shifter.openButton(\'{{=it._name }}\', this); return false" ontouchstart="$_shifter.openButton(\'{{=it._name }}\', this); return false"></div>',
            'titles': '===================='
        },

        'issetData': {
            'text': '<div style="color: red; display: inline-block" class="allowMultiClick" onclick="$_shifter.openChange(\'{{=it._name}}\'); return false" ontouchstart="$_shifter.openChange(\'{{=it._name}}\'); return false">{{=it.value}}</div>',
            'boolean': '<div class="_check_ _ch_ _active_ allowMultiClick" onclick="$_shifter.changeBoolean(\'{{=it._name }}\', this); return false" ontouchstart="$_shifter.changeBoolean(\'{{=it._name }}\', this); return false"></div>',
            'button': '<div class="_check_ _ch_ _active_ allowMultiClick" onclick="$_shifter.openButton(\'{{=it._name }}\', this); return false" ontouchstart="$_shifter.openButton(\'{{=it._name }}\', this); return false"></div>',
            'titles': '===================='
        },

        'keys': '<a href="#" style="color: blue; text-decoration: underline; float: right; margin-right: 10%" class="allowMultiClick" onclick="$_shifter.openChange(\'{{=it.name}}\'); return false">Change</a>',

        'popupData': '<div id="{{=it._id }}">\
                          <h4>\
                              Change setting :<br /> &laquo;{{=it._name }}&raquo;\
                              <a href="#" class="_close_ _keys_ allowMultiClick" onclick="{{=it._close }} return false"></a>\
                          </h4>\
                          <input type="text" id="_shif_value" value="{{=it._value}}">\
                          <div>\
                               <div style="width: 40%; float: left;"> \
                                    <div class="_keys_ _i_key _n1 allowMultiClick" onclick="$_shifter.setNumber(1); return false"></div>\
                                    <div class="_keys_ _i_key _n2 allowMultiClick" onclick="$_shifter.setNumber(2); return false"></div>\
                                    <div class="_keys_ _i_key _n3 allowMultiClick" onclick="$_shifter.setNumber(3); return false"></div>\
                                    <div class="_keys_ _i_key _n_bp allowMultiClick" onclick="$_shifter.setNumber(-1); return false"></div>\
                                    <div class="_clear_"></div>\
                                    <div class="_keys_ _i_key _n4 allowMultiClick" onclick="$_shifter.setNumber(4); return false"></div>\
                                    <div class="_keys_ _i_key _n5 allowMultiClick" onclick="$_shifter.setNumber(5); return false"></div>\
                                    <div class="_keys_ _i_key _n6 allowMultiClick" onclick="$_shifter.setNumber(6); return false"></div>\
                                    <div class="_keys_ _i_key _n_k allowMultiClick" onclick="$_shifter.setNumber(\',\'); return false"></div>\
                                    <div class="_clear_"></div>\
                                    <div class="_keys_ _i_key _n7 allowMultiClick" onclick="$_shifter.setNumber(7); return false"></div>\
                                    <div class="_keys_ _i_key _n8 allowMultiClick" onclick="$_shifter.setNumber(8); return false"></div>\
                                    <div class="_keys_ _i_key _n9 allowMultiClick" onclick="$_shifter.setNumber(9); return false"></div>\
                                    <div class="_keys_ _i_key _n0 allowMultiClick" onclick="$_shifter.setNumber(0); return false"></div>\
                               \
                               </div>\
                               <div style="width: 30%; float: left">\
                               {{? it._shifts.length > 0 }}\
                               <ul>\
                               {{ for(var key in it._shifts) { }}\
                               <li><a href="#" onclick="$_shifter.addShifts({{=key}}); return false">{{=it._shifts[key].name}}</a></li>\
                               {{ } }}\
                               {{?}}\
                               </div>\
                               <div style="width: 30%; float: left;"> \
                                    <div class="_keys_ _i_key _n_set allowMultiClick" onclick="$_shifter.saveText(); return false"></div>\
                                    <div class="_keys_ _i_key _n_del allowMultiClick" onclick="$_shifter.removeText(); return false"></div>\
                               </div>\
                          </div>\
                     </div>',
        'traceConsole': '<div class="_shifter _trace" id="_shifter_trace_console"><div id="_trace_console" contenteditable="true"></div></div>',
        'traceDOMConsole': '<div class="_shifter _trace_dom _scroll" id="_shifter_trace_dom">\
                                <a href="#" class="_close_ _keys_ allowMultiClick" onclick="{{=it._close }} return false" style=""></a>\
                                <div id="list_dom_log">\
                                {{ for(var key in it._list) { }}\
                                    <p>{{=JSON.stringify(it._list[key]) }}</p>\
                                {{ } }}\
                                </div>\
                            </div>',

        'timeLoading': '<div id=\"hhs_shifter_popup\">\
                            <h4>\
                                Time loading \
                                <a href="#" class="_close_ _keys_ allowMultiClick" onclick="{{=it._close }} return false"></a>\
                            </h4>\
                            <div style="width: 100%; height: 95%; overflow-y: scroll" id="_time_list">\
                            <a href="#" class=" _key_up_" onclick="{{=it._update }} return false">Update 5 sec</a>\
                                {{ for(var key in it._list) { var _e = it._list[key]; }}\
                                <div class="_e_">\
                                    <div class="_e_t">\
                                        <strong>{{=_e.name}}</strong>\
                                    </div>\
                                    <div class="_e_p">#st - {{=_e.stream}}</div>\
                                    <div class="_e_l">\
                                        <div class="_i_" style="left: {{=((_e.start - it._min) * 100)/it._time}}%; width: {{=((_e.end - _e.start) * 100)/it._time}}%"></div>\
                                    </div>\
                                </div>\
                                {{ } }}\
                            </div>\
                        </div>'
    };

    /**
     * Init css
     */
    this.initCss = function()
    {
        if(_cssIsset === false){
            _cssIsset = true;


            $('body').append(_css);
        }
    };

    /**
     * Render template
     * @param name
     * @param objectData
     */
    this.render = function(name, objectData)
    {
        if(!doT){
            $_log.error('Not found doT template pattern!');
            return ;
        }

        if(!objectData){
            objectData = {};
        }

        objectData._r = this.render;

        var _templ = null;

        var _l_ = name.split('.');
        if(_l_.length > 1){
            _templ = _templates[_l_[0]][_l_[1]];
        } else {
            _templ = _templates[_l_[0]]
        }

        if(typeof _templ ==  'undefined'){
            $_log.error('Not found template name in HHS Shifter:' + name);
            return ;
        }

        var tempFn = doT.template(_templ);
        return tempFn(objectData);
    };

    /**
     * Append to html
     * @param el
     * @param str
     */
    this.appendHtml = function(el, str) {
        var div = document.createElement('div');
        div.innerHTML = str;
        while (div.children.length > 0) {
            el.appendChild(div.children[0]);
        }
    };

    /**
     * Inner to block
     * @param elem
     * @param str
     */
    this.innerHtml = function (elem, str) {
        elem.innerHTML = str;
    };

    /**
     * Add class to object HTML
     * @param className
     * @param object
     */
    this.addClass = function (className, object) {
        var list = object.className.split(" ");
        if(list.indexOf(className) == -1){
            list.push(className);
        }

        object.className = list.join(" ");
    };

    /**
     * Remove element
     * @param elID
     */
    this.remove = function (elID) {
        var el = document.getElementById(elID);
        el.parentNode.removeChild(el);
    };

    /**
     * Remove class from object HTML
     * @param className
     * @param object
     */
    this.removeClass = function (className, object) {
        var list = object.className.split(" ");

        var newList = [];

        for(var i = 0, l = list.length; i < l; i++){

            if(list[i] != className){
                newList.push(list[i]);
            }
        }

        object.className = newList.join(" ");
    };


};
