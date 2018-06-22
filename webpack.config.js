const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    // entry: './src/index.js',
    entry: {
        app: './src/index.js',
        print: './src/print.js'
    },
    output: {
        // filename: 'main.js',
        // [name]表示entry中的key
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/' // 表示 express将会启动在 http://localhost:3000, 在 server.js中指定
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'output manage'// 指定index.html的title
        })
    ],
    devtool: 'inline-source-map',// 追溯错误源文件, 仅需要这一行配置
    devServer: {
        contentBase: './dist',// 命令行指定 --content-base dist
        port: 18080 // 默认: localhost:8080
    }
};