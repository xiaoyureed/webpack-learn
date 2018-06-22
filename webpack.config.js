const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');// 使用webpack 内建的插件, 实现 HMR功能(hmr: 无刷新更新页面), 如果使用的是webpack-dev-middleware instead of webpack-dev-server, 则无法使用内建插件实现 hmr, 需要 webpack-hot-middleware插件

module.exports = {
    // entry: './src/index.js',
    entry: {
        app: './src/index.js'
    },
    output: {
        // filename: 'main.js',
        // [name]表示entry中的key
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/' // 表示 express将会启动在 http://localhost:3000, 在 server.js中指定
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [// 更多 loader: https://webpack.js.org/guides/hot-module-replacement/#other-code-and-frameworks
                    'style-loader', 'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'output manage'// 指定index.html的title
        }),
        new webpack.NamedModulesPlugin(),// 方便的查看module的依赖关系, HMR用
        new webpack.HotModuleReplacementPlugin() // 支持hmr
    ],
    // mode: "development", // 设定为开发模式(代码不会压缩), 还有 production模式(压缩代码), 命令行指定: --mode xxx
    devtool: 'inline-source-map',// 追溯错误源文件, 仅需要这一行配置
    devServer: {
        contentBase: './dist',// 命令行指定 --content-base dist
        port: 18080, // 默认: localhost:8080
        hot: true, // Enabling HMR, 对应的命令行参数 webpack-dev-server --hot
        inline: true // 如果 hot(hmr)无效, 则inline(页面整个刷新)
    }
};