/**
 * hmr(模块热替换) demo
 * 
 * 它允许在运行时更新各种模块, 而无需进行页面的完全刷新
 * 
 * 原理: https://www.jianshu.com/p/95f5f51e6fc7 //todo
 * 
 * 依赖 webpack-hot-middleware - 一个结合webpack-dev-middleware使用的middleware，它
 * 可以实现浏览器的无刷新更新（hot reload），也就是 HMR（Hot Module Replacement）。
 * 
 * HMR和热加载的区别是：热加载是刷新整个页面。热替换仅仅刷新改动的module
 */
import _ from 'lodash';
import printSth from './print.js';
// import './styles.css';
import css from './styles.css';

/**
 * 构建一个 div
 */
function component() {
    var element = document.createElement('div');
    element.className = 'demo';
    element.style = css;
    // Lodash, js工具库
    element.innerHTML = _.join(['你好', 'webpack'], ' ');
    ``
    var btn = document.createElement('button');
    btn.innerHTML = '点击, 然后到console查看';
    btn.onclick = printSth;// 不要带括号 加上括号会自动执行， 不点击就执行了

    element.appendChild(btn);
    
    return element;
}
  
const exec = () => {
  let element = component(); // 给下面的 hmr代码用
  document.body.appendChild(element);

  // HMR代码
  if (module.hot) {
    // 语法:accept('moduleId', callback), 
    // 这里仅仅针对print.js热替换, 如果是accept(), 全体热替换
    module.hot.accept('./print.js', function() {
      console.log('探测到 printSth 的更新.');
      document.body.removeChild(element);
      // 从新构建 div 元素
      element = component();
      document.body.appendChild(element);
    });

  }
};

export default exec;
