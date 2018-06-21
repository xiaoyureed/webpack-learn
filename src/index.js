import _ from 'lodash';

function component() {
    var element = document.createElement('div');
  
    // Lodash, js工具库
    element.innerHTML = _.join(['你好', 'webpack'], ' ');
    
    return element;
  }
  
document.body.appendChild(component());