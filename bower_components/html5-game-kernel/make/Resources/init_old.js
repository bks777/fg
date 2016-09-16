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
        var args = allowedKeys.map(function(item) {
            return item + '=' + encodeURIComponent(options[item]);
        });

        var url = options.game_path + 'index.html?' + args.join('&');
        var html = '<iframe src="{url}" style="border: none; height: 100%; width: 100%;" border="0" frameborder="0" cellspacing="0" cellpadding="0"></iframe>';
        html = html.replace('{url}', url);
        $element.innerHTML = html;
    }
};