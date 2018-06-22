import _ from 'lodash';
import printSth from './print.js';
import './styles.css';

function component() {
    var element = document.createElement('div');
    // Lodash, js工具库
    element.innerHTML = _.join(['你好', 'webpack'], ' ');
    
    var btn = document.createElement('button');
    btn.innerHTML = '点击, 然后到console查看';
    btn.onclick = printSth;// 加上括号会自动执行， 不点击就执行了

    element.appendChild(btn);
    
    return element;
}
  
// document.body.appendChild(component());
let element = component(); // 给下面的 hmr代码用
document.body.appendChild(element);

// HMR代码
if (module.hot) {
  // accept('moduleId', callback), 这里仅仅针对print.js热替换, 如果是accept(), 全体热替换
  module.hot.accept('./print.js', function() {
    console.log('探测到 printSth 的更新.');
    // printSth();
    document.body.removeChild(element);
    element = component();//点击时, 重新渲染 component
    document.body.appendChild(element);
  });
}