var path = require("path");
var webpack = require("webpack");
var WriteFilePlugin = require("write-file-webpack-plugin");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {

    entry: [/*'webpack/hot/dev-server',*/"./app/dependency_es6"],

    devServer: {
        outputPath: path.join(__dirname, './app')
    },

    output: {
        path: path.join(__dirname, './app'),
        filename: "bundle.js"
    },

    module: {
        loaders: [
            {
                loader: "babel-loader",
                test: /(\.jsx|\.js)$/,
                query: {
                    presets: "es2015"
                }
            }
        ]
    },

    debug: false,

    plugins: [
        new WriteFilePlugin
    ]

};

/**
 * If not prod env, add to webpack dev hot server with debug mode
 */
if(process.env.npm_lifecycle_event != "prod"){
    module.exports.entry.unshift('webpack/hot/dev-server');
    module.exports.debug = true;

} else {

    /*module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: false,
                unsafe: true
            }
        })
    );*/

    //module.exports.plugins.push(new CommonsChunkPlugin("../dist/game.js"))
    //module.exports.plugins.push(new CommonsChunkPlugin("../dist/game.js"))
}
