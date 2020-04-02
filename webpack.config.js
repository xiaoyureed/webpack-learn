// 处理路径, 常用的 有 2 个 api
//path.resolve("__dirname","js","main.js"); 当前目录下的 js 文件夹的 main.js 文件的路径
//path.join("source","js","main.js"); ----> //source/js/main.js
const path = require('path');
// - 创建html入口文件，比如单页面可以生成一个html文件入口，配置N个html-webpack-plugin可以生成N个页面入口
// - 为引入的静态资源添加 hash. 每次 compile 后, 为 html 页面引入的外部资源如script、link动态添加 hash，防止引用缓存的外部文件问题
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 每次 build 前先清除一下 dist 目录 , 防止 这个目录积累的编译文件过多
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 使用webpack 内建的插件
// 如: 实现 HMR功能(hmr: 无刷新更新页面), 如果
// 使用的是webpack-dev-middleware instead of webpack-dev-server, 
// 则无法使用内建插件实现 hmr, 需要 webpack-hot-middleware插件
const webpack = require('webpack');

//抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象。
//目前还没有webpack4版本 , 
// npm install --save-dev extract-webpack-plugin@next
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function resolve(relatedPath) {
    return path.join(__dirname, relatedPath)
}

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
        // 可省略, 默认输出到 'dist' 文件夹, 'dist' (去掉 /) 也可
        path: path.resolve(__dirname, '/dist'), // 等价 `${__dirname}/dist`
        // 表示 express将会启动在 http://localhost:3000/, 
        // 如果自定义, 可以在 server.js中指定
        publicPath: '/'
    },

    // 配置如何解析源文件
    resolve: {
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        // extensions: [".js", ".html", ".css", ".txt","less","ejs","json"],

        // modules: [ // 指定以下目录寻找第三方模块，避免webpack往父级目录递归搜索
        //   resolve('app'),
        //   resolve('node_modules'),
        // ],

        //模块别名定义，直接 require('AppStore') 即可,方便后续直接引用别名, 这个比较有用
        // alias: { Temp: path.resolve(__dirname, "src/templates/") },
    },

    module: {
        // 配置 loader, 用来处理源文件, 可以把es6, jsx等转换成js, sass, less等转换成css
        rules: [{
            // 配置 css loader
            // Webpack 本身只能处理 JavaScript 模块，如果要处理其他类型的
            // 文件，就需要使用 loader 进行转换
            // 更多 loader: https://webpack.js.org/guides/hot-module-replacement/#other-code-and-frameworks
            test: /\.css$/,

            // use: [
            //     // 一般来说需要引入css-loader和style-loader，其中css-loader用
            //     // 于解析，而style-loader则将解析后的样式嵌入js代码。
            //     // { loader: 'style-loader' },
            //     // { loader: 'css-loader' },

            //     // 简写方式
            //     // 顺序不可变: 从右到左, 越来越顶层, 执行的时候也是从右到左
            //     'style-loader', 'css-loader'
            // ]

            // 输出文件中分离出 css
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",

                //这样使用会出现 css 中 使用 url()解析路径错误的问题
                //use : "css-loader"

                use: [
                    {
                        loader: "css-loader",
                        options: {
                            //用于解决url()路径解析错误
                            url: false,
                            minimize: true,
                            sourceMap: true
                        }
                    }
                ]
            }),
        }, {
            test: /\.jsx?$/, // 匹配 js 或者 jsx
            loader: 'babel-loader',
            exclude: /(node_modules|bower_components)/,
        },]
    },

    // 插件用于拓展 webpack 功能
    // 是一个数组, 每个元素都是一个 插件对象
    // 自定义参数通过插件的构造函数传入
    plugins: [
        // 默认 清除这个目录: output.path
        new CleanWebpackPlugin(),

        new HtmlWebpackPlugin({
            // title: 'Hello World app',// 指定index.html的title
            // filename: 'index.html',

            template: './src/index.html', // 指定一个index.html模板, 会原样复制到dist

            // minify: { // 压缩HTML文件
            //     removeComments: true, // 移除HTML中的注释
            //     collapseWhitespace: true, // 删除空白符与换行符
            //     minifyCSS: true// 压缩内联css
            // },
        }),

        // 方便的查看module的依赖关系, HMR用; 
        // development 会将 process.env.NODE_ENV 的值设为 development 。启用 NamedChunksPlugin 和 NamedModulesPlugin。
        new webpack.NamedModulesPlugin(),
        // //启用 webpack 内置的 HMR 插件
        // 启用后, module.hot 接口就会暴露在 index.js 中, 接下来需要在 index.js 中配
        //置告诉 webpack 接受HMR的模块
        new webpack.HotModuleReplacementPlugin(),

        // 配置分离出来的 样式文件的名字, 单入口可以指定固定的名字 , 如: 'styles.css'
        // 多入口需要如下配置:
        new ExtractTextPlugin('[name].css'),
    ],

    // 三个选项: none, development or production(default). 
    // 推荐在 npm scripts 中 配置即可. 'webpack --mode=production'
    // 设定为开发模式(代码不会压缩), 还有 production模式(压缩代码), 命令行指定: --mode xxx
    // mode: "development", 

    // 有多个选项
    //source-map 此选项具有最完备的source map，但会减慢打包的速度
    // cheap-module-source-map 生成一个不带列映射的map
    devtool: 'inline-source-map',// 追溯错误源文件, 仅需要这一行配置

    // webpack-dev-server 配置
    devServer: {
        ////将dist目录下的文件(index.html)作为可访问文件, 如果不写这个参数
        //则默认与webpack.cofig.js的同级目录
        contentBase: './dist',// 命令行指定 --content-base dist
        port: 18080, // 默认: localhost:8080
        hot: true, // 热加载, 不是 hmr, 对应的命令行参数 webpack-dev-server --hot
        inline: true // 如果 hot(hmr)无效, 则inline(页面整个刷新)
    }
};