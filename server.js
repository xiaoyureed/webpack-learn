// webpack-dev-middleware 用, 实际将编译后的文件放到server, 借助express提供web访问
// 相比 webapck-dev-server 有更多的自定义配置, 更大的自由 , 区别: https://www.cnblogs.com/wangpenghui522/p/6826182.html

const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath // 就是 "/"
}));

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});