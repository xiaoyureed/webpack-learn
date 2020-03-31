const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');// 使用webpack 内建的插件, 实现 HMR功能(hmr: 无刷新更新页面), 如果使用的是webpack-dev-middleware instead of webpack-dev-server, 则无法使用内建插件实现 hmr, 需要 webpack-hot-middleware插件

module.exports = {
    // entry: './src/index.js', // 等同于  main: './path/to/my/entry/file.js'
    // 多页面
    // entry: {
    //     pageOne: './src/pageOne/index.js',
    //     pageTwo: './src/pageTwo/index.js',
    //     pageThree: './src/pageThree/index.js'
    // },
    entry: {
        app: './src/index.js'
    },
    output: {
        // filename: 'main.js',
        // [name]表示entry中的key, app.bundle.js
        filename: '[name].bundle.js', // 最少必须, 默认输出到 'dist' 文件夹
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/' // 表示 express将会启动在 http://localhost:3000, 在 server.js中指定
    },
    // mode: 'production', // none, development or production(default). 或者在cli中 'webpack --mode=production'
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [// 更多 loader: https://webpack.js.org/guides/hot-module-replacement/#other-code-and-frameworks
                    // 一般来说需要引入css-loader和style-loader，其中css-loader用于解析，而style-loader则将解析后的样式嵌入js代码。
                    'style-loader', 'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'output manage',// 指定index.html的title
            // template: './src/index.html', // 指定一个index.html模板, 会原样赋值到dist
        }),
        new webpack.NamedModulesPlugin(),// 方便的查看module的依赖关系, HMR用; // development 会将 process.env.NODE_ENV 的值设为 development 。启用 NamedChunksPlugin 和 NamedModulesPlugin。
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