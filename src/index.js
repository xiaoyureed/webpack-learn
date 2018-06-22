import _ from 'lodash';
import printSth from './print.js';

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
  
document.body.appendChild(component());