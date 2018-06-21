import _ from 'lodash';
import './style.css';
import Icon from './icon.png';
import Data from './data.xml';

function component() {
    var element = document.createElement('div');
  
    // Lodash, js工具库
    element.innerHTML = _.join(['你好', 'webpack'], ' ');
    element.classList.add('hello');

    // 添加图片, 还可以在css中使用 background: url('./icon.png')
    const icon = new Image();
    icon.src = Icon;
    element.appendChild(icon);

    console.log(Data);
  
    return element;
  }
  
document.body.appendChild(component());