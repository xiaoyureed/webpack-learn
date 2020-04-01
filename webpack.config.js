// 处理路径
const path = require('path');
// - 创建html入口文件，比如单页面可以生成一个html文件入口，配置N个html-webpack-plugin可以生成N个页面入口
// - 为引入的静态资源添加 hash. 每次 compile 后, 为 html 页面引入的外部资源如script、link动态添加 hash，防止引用缓存的外部文件问题
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 每次 buid 前先清除一下 dist 目录 , 防止 这个目录积累的编译文件过多
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 使用webpack 内建的插件
// 如: 实现 HMR功能(hmr: 无刷新更新页面), 如果
// 使用的是webpack-dev-middleware instead of webpack-dev-server, 
// 则无法使用内建插件实现 hmr, 需要 webpack-hot-middleware插件
const webpack = require('webpack');

module.exports = {
    // entry 入口文件：webpack 打包的时候的从哪个文件开始。 相当于webpack 命令中 src/index.js 
    // 单页面
    // entry: './src/index.js', // 等同于  main: './path/to/my/entry/file.js'

    // 多页面
    // entry: {
    //     pageOne: './src/pageOne/index.js',
    //     pageTwo: './src/pageTwo/index.js',
    //     pageThree: './src/pageThree/index.js'
    // },
    entry: {
        // app 在 output 中会被引用, 通过 `[name]`, 
        app: './src/index.js'
    },

    output: {
        // 不使用 entry 中的 key
        // filename: 'main.js',

        // [name]表示entry中的key, app.bundle.js
        filename: '[name].bundle.js',
        // 可省略, 默认输出到 'dist' 文件夹
        path: path.resolve(__dirname, 'dist'), // 等价 `${__dirname}/dist`
        publicPath: '/' // 表示 express将会启动在 http://localhost:3000, 在 server.js中指定
    },

    // 三个选项: none, development or production(default). 
    // 或者在 npm scripts 中 'webpack --mode=production'
    // mode: 'production', 

    module: {
        rules: [{
            // 配置 css loader
            // Webpack 本身只能处理 JavaScript 模块，如果要处理其他类型的
            // 文件，就需要使用 loader 进行转换
            // 更多 loader: https://webpack.js.org/guides/hot-module-replacement/#other-code-and-frameworks
            test: /\.css$/,
            use: [
                // 一般来说需要引入css-loader和style-loader，其中css-loader用
                // 于解析，而style-loader则将解析后的样式嵌入js代码。
                // 顺序不可变: 从左到右 越来越具体
                'style-loader', 'css-loader'
            ]
        }]
    },

    // 插件用于拓展 webpack 功能
    // 是一个数组, 每个元素都是一个 插件对象
    // 自定义参数通过插件的构造函数传入
    plugins: [
        // 默认 清除这个目录: output.path
        new CleanWebpackPlugin(),

        new HtmlWebpackPlugin({
            title: 'Hello World app',// 指定index.html的title

            // template: './src/index.html', // 指定一个index.html模板, 会原样复制到dist

            // filename: 'index.html',

            minify: { // 压缩HTML文件
                removeComments: true, // 移除HTML中的注释
                collapseWhitespace: true, // 删除空白符与换行符
                minifyCSS: true// 压缩内联css
              },
        }),

        // 方便的查看module的依赖关系, HMR用; 
        // development 会将 process.env.NODE_ENV 的值设为 development 。启用 NamedChunksPlugin 和 NamedModulesPlugin。
        new webpack.NamedModulesPlugin(),
        // 开启hmr支持
        new webpack.HotModuleReplacementPlugin() 
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