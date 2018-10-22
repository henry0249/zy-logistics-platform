function init(el, binding) {
  //核心:定位 el: top,bottom,left,right,居中,边缘处理
  //参数配置
  let param = {
    text: '',
    placement: 'top'
  };
  let isObj = false;
  for (const key in param) {
    if (binding.value[key]) {
      isObj = true;
      param[key] = binding.value[key];
    }
  }
  if (!isObj) {
    param.text = binding.value;
  }
  let positionObj = el.getBoundingClientRect();
  console.log(positionObj);
  let appendDiv;
  el.addEventListener('mouseenter',()=>{
    appendDiv = initTipEl(positionObj,param);
  });
  el.addEventListener('mouseout',()=>{
    removeTipEl(appendDiv);
  });
}

function initTipEl(positionObj,param) {
  let div = document.createElement('div');
  let styleObj = setStyle(positionObj,param.placement);
  for (const key in styleObj) {
    div.style[key] = styleObj[key];
  }
  console.log(styleObj);
  div.innerHTML = param.text;
  document.documentElement.appendChild(div);
  return div;
}

function removeTipEl(el) {
  if (el) {
    document.documentElement.removeChild(el);
  }
}

function setStyle(positionObj, placement) {
  let styleObj = {
    position: 'fixed'
  };
  let placementObj = {
    top: {
      top: positionObj.top - positionObj.height + 'px'
    },
    bottom: {
      bottom: positionObj.bottom + positionObj.height + 'px'
    },
    left: {
      left: positionObj.left + positionObj.width + 'px'
    },
    right: {
      right: positionObj.right + positionObj.width + 'px'
    }
  }
  return {
    ...styleObj,
    ...placementObj[placement]
  };
}
export default {
  install(Vue) {
    Vue.directive('tooltip', {
      inserted: init
    })
  }
}
