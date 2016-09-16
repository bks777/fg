window.BOOONGO.game = {
    name: '{{s buffer::GAME_SETTING.alias s}}',
    build_ts: "{BUILD_TS}",

    init: function($element, options, OperatorEvent) {
        if (this.build_ts.indexOf('BUILD_TS') !== -1) {
            this.build_ts = "";
        }
        options.build_ts = this.build_ts || options.build_ts;

        var allowedKeys = ['endpoint', 'token', 'lang', 'build_ts',
            'wl', 'fail_timeout', 'max_fails', 'sound'];

        $element.innerHTML = "<canvas id=\"wrapper\">canvas is not supported</canvas>";

        /*
         Game parameters
         */
        window.$_args = {
            "opt": options,
            "game_path": options.game_path,
            "variablePageSettings": "$_args",
            "token": "",
            "exit_url": "http://google.com.ua",
            "endpoint": "http://betman-sharks.dev.booongo.com/gs/{0}/{1}/prod/",
            "lang": "en",
            "alias": "'{{s buffer::GAME_SETTING.alias s}}'",
            "build_ts": +new Date(),
            "wl": "wl",
            "env": "dist",
            "fail_timeout": 3,
            "max_fails": 3,
            "max_timeout": "3000",
            "sound": true
        };

        allowedKeys.map(function(item) {
            $_args[item] = options[item];
        });

        var style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', options.game_path + 'game.css?build_ts=' + options.build_ts);
        document.head.appendChild(style);

        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', options.game_path + 'game.js?build_ts=' + options.build_ts);
        document.body.appendChild(script);

    }
};