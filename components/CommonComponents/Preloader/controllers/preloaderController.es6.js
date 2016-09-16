import Controller from "../../../../bower_components/html5-game-kernel/interfaces/controllers/Controller.es6.js";

/**
 * Preloader controller
 * @constructor
 */
export default class PreloaderController extends Controller {

    constructor (data = {}) {
        super(data);

        this.fullscreenIOS = null;
        this.fullscreenAndroid = null;
        this.scrollable = ["._scroll", ".visibleZone"]; // Elements for disabling pullToReload

        this.rows = null;
        this._unscroll = null;
        this._activeFullscreen = false;

        this.is_chrome = navigator.userAgent.indexOf('CriOS') > -1;
        this.is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
        this.is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
        this.is_safari = navigator.userAgent.indexOf("Safari") > -1;
        this.is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
        if ((this.is_chrome)&&(this.is_safari)) {this.is_safari=false;}
        if ((this.is_chrome)&&(this.is_opera)) {this.is_chrome=false;}

        this.isIPhone = (window.navigator.userAgent && window.navigator.userAgent.match(/iPhone/i) ? true:false);
        this.isIPad = (window.navigator.userAgent && window.navigator.userAgent.match(/iPad/i) ? true:false);
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        this.isAndroid = (window.navigator.userAgent && window.navigator.userAgent.match(/Android/i) ? true:false);

        this.iOSVersion = this.getiOSVersion();

        var nua = navigator.userAgent;
        this.is_android_native = (((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1)) || nua.indexOf('SamsungBrowser') > -1);

        this._readyLoad = 0;

        this.init(data);

        this.keyStart = false;
    }

    /**
     * Find IOS Version
     * @private
     */
    getiOSVersion()
    {
        var userOS;    // will either be iOS, Android or unknown
        var userOSver; // this is a string, use Number(userOSver) to convert

        var ua = navigator.userAgent;
        var uaindex;

        // determine OS
        if ( ua.match(/iPad/i) || ua.match(/iPhone/i) )
        {
            userOS = 'iOS';
            uaindex = ua.indexOf( 'OS ' );
        } else {
            return false;
        }

        // determine version
        if ( userOS === 'iOS'  &&  uaindex > -1 )
        {
            userOSver = ua.substr( uaindex + 3, 3 ).replace( '_', '.' );
        }

        return Number(userOSver);
    }

    /**
     * Run game check audio
     * @param isIOS
     * @private
     */
    _runGameCheck (isIOS)
    {
        var _audio = function ()
        {
            $_audio_interface.play('reelrun', 'audio', false, 0);
            $_audio_interface.stop('reelrun', 'audio');

            $_audio_interface.play('buttonPaytbl', 'audio', false, 0);
            $_audio_interface.stop('buttonPaytbl', 'audio');
        };

        var yesBtn = document.getElementById('yesBtn'),
            noBtn = document.getElementById('noBtn');

        yesBtn.addEventListener('touchstart', onTouchStart);
        yesBtn.addEventListener('touchend', onTouchEnd);
        noBtn.addEventListener('touchstart', onTouchStart);
        noBtn.addEventListener('touchend', onTouchEnd);

        function onTouchStart()
        {
            if(AudioMaker.unlock() == false){
                _audio();
            }
            yesBtn.removeEventListener('touchstart', onTouchStart);
            noBtn.removeEventListener('touchstart', onTouchStart);
        }

        function onTouchEnd()
        {
            if(AudioMaker.unlock() == false){
                _audio();
            }
            yesBtn.removeEventListener('touchend', onTouchEnd);
            noBtn.removeEventListener('touchend', onTouchEnd);
        }
    };

   /*
    * Start loading game resources at the Game Sound screen
    */
    startEarlyLoading () {

        var _audioComponent = this.getInstCross("AudioViewHandler", "audio");

        var yesBtn = document.getElementById('yesBtn'),
            noBtn  = document.getElementById('noBtn');

        // prevent removing of DOM elements from a game component
        _audioComponent.frameReelsInit = function() {};

        $_event.setEvent('checkInitProtocol');

        HelperFlags.set('initProtocolChecked', true, 'init');

        yesBtn.addEventListener(HelperKeyEvent.check('startEvent', true), onBtnClick );
        noBtn.addEventListener(HelperKeyEvent.check('startEvent', true), onBtnClick );

        $(document.body).addClass('sound-selection');

        function onBtnClick() {
            $(document.body).removeClass('sound-selection');
            _audioComponent.getContainerID(true).fadeOut();
        }

    };

    /**
     * Loaded action
     * @param object
     */
    endLoadAction (object)
    {
        var self = this;

        this.startEarlyLoading();

        visibly.onVisible(function () {
            if ( self.getFlagGlobal('paytableOpened') ) {
                return;
            }

            $_event_blocked.setEvent(1);
            alert(1);
        });

        visibly.onHidden(function () {
            $_event_blocked.setEvent(0);
            alert(2);
        });

        FastClick.attach(document.body);

        this.setFlag("isIOS", this.isIOS);
        this.setFlag("iOSVersion", this.iOSVersion);

        if(this._activeFullscreen !== false){
            return null;
        }
        this._activeFullscreen = true;

        if(this.isIOS === true) {
            this._runGameCheck(true);

            this.fullscreenIOS.run(object, this);
        } else if (this.isAndroid === true) {
            this._runGameCheck();

            this.fullscreenAndroid.run(object, this);
        } else { /* For desctops */
            this.avaibleNoScroll();
        }

        this.disableMultiClickEvents();

    };

    /**
     * Scroll event
     * @returns {boolean}
     * @private
     */
   /* var _scrollEvent = function(q,w,e,r,t,y){

        if($.trim(q.currentTarget.className) == '_scrollBlock'){
            //q.preventDefault();
            q.stopPropagation();
            //return true;
        } else {
            console.log('TT', q.currentTarget.className);
            return false;
        }

    };
*/
    /**
     * Unable no scroll block game
     */
    avaibleNoScroll ()
    {
       /* if(this._unscroll === null){
            if($('body#body_wrapper').length == 0){
                $('body').attr('id', 'body_wrapper');
                $('#noScroll').addClass('noScroll');
                //$('#body_wrapper').append('<span id="noScroll" onclick="console.log(event);"></span>');
            }

            /!*this._unscroll = new Hammer(document.getElementById('body_wrapper'), {
             touchAction: 'pan-x'
             });*!/

            //$(document).delegate('div', 'touchmove', _scrollEvent);
            //$(document).off('div._scrollBlock', 'touchmove', _scrollEvent);
            //$(document).delegate('.noScroll:not(._scroll)', 'touchmove', _scrollEvent);
            $(window).scroll(function(){
                return false;
            });

        }*/
    };

    /**
     * Disable no scroll block game
     */
    unavalaibleNoScroll ()
    {
        /*if(this._unscroll !== null){
         this._unscroll.destroy();
         this._unscroll = null;
         }*/

        $(document).undelegate('div', 'touchmove', _scrollEvent);
    };

    /*
    *   Disable pull to reload (touchmove above the top and below the bottom, need for Chrome and Safari)
    */
    disablePullToReload () {

        var initialY = null,
            previousY = null;

        var blockScrollTop = function (e) {
            if(previousY && previousY < e.touches[0].clientY){ //Scrolling up
                e.preventDefault();
            }
            else if (initialY >= e.touches[0].clientY){ //Scrolling down
                document.removeEventListener("touchmove", blockScrollTop);
            }
            previousY = e.touches[0].clientY;
        };

        var blockScrollBottom = function (e) {

            if(previousY && previousY < e.touches[0].clientY){ //Scrolling up
                document.removeEventListener("touchmove", blockScrollBottom);

            }
            else if (initialY >= e.touches[0].clientY){ //Scrolling down
                e.preventDefault();
            }
            previousY = e.touches[0].clientY;
        };

        var onTouchStartScroll = function (e) {

            previousY = initialY = e.touches[0].clientY;

            var _scroll = e.currentTarget;

            if (_scroll && _scroll.scrollTop <= 0){ /* for top */
                document.addEventListener("touchmove", blockScrollTop);
            }

            if (_scroll && _scroll.scrollTop >= _scroll.scrollHeight - _scroll.clientHeight){ /* for bottom */
                document.addEventListener("touchmove", blockScrollBottom);
            }
        };

        var onTouchEndScroll = function (e) {

            document.removeEventListener ("touchmove", blockScrollTop);
            document.removeEventListener ("touchmove", blockScrollBottom);
        };

        var scrollable = this.scrollable;

        for (var i=0; i<scrollable.length; i++) {
            var targets = document.querySelectorAll (scrollable[i]);

            for (var j=0; j < targets.length; j++) {

                targets[j].addEventListener("touchstart",  onTouchStartScroll);
                targets[j].addEventListener("touchend",  onTouchEndScroll);
            }
        }
    };

    /*
     * Disable scrolling for all elements in document without exceptions
     * @param {(String|Array)} exceptions - Elements for which scrolling won't be blocked
     */
    disableScroll (exceptions) {

        var onTouchMoveScroll = function (e) {
            var $target = $(e.target);

            if (exceptions && exceptions.length > 0) {

                if (typeof(exceptions) === "string") {

                    if ($target.closest(exceptions).length) {
                        return;
                    }

                } else if (exceptions instanceof Array) {

                    for (var i=0; i<exceptions.length; i++) {
                        if ($target.closest(exceptions[i]).length) {
                            return;
                        }
                    }
                }
            }

            e.preventDefault();
        };

        document.addEventListener("touchmove",  onTouchMoveScroll);
    };


    /* disable multi click per short period for touch devices. */
    disableMultiClickEvents () {
        var scrollable = this.scrollable;
        var overlay    = $('<div id="overlay"/>');

        $('body').append(overlay);

        /* on first "touchstart" event all pointer events are disabled and enabled only if "touchstart" event doesn't fire per last 300 ms */

        var disableEvents = $.debounce( 300, true, function(e) {

            /* If element has class "allowMultiClick" (or something in such element, for example click on image in button) => don't disable */
            if ($(e.target).closest('.allowMultiClick').length) {
                return;
            }

            /* don't disable for scrollable elements */
            for (var i=0; i<scrollable.length; i++) {
                if ($(e.target).closest(scrollable[i]).length) {
                    return;
                }
            }

            overlay.css('display', 'block');

        });

        var enableEvents = $.debounce( 350, function(e) {
            overlay.css('display', 'none');
        });

        /* only for touchstart. It doesn't need for "click" for desktop. */
        document.addEventListener("touchstart", disableEvents, false );
        document.addEventListener("touchstart", enableEvents, true );
    }

    /**
     * Inc load
     */
    readyInc(){
        this._readyLoad++;

        if(this._readyLoad == 2){
            try{
                this.getState().nextState();
            } catch(e){
                setTimeout(()=>{
                    $_log.error("Try run StateMachine");
                    this.getState().nextState();
                }, 20);
            }

        }
    }

};
