function tip(el, binding) {
  let div = "";
  el.addEventListener('mouseover', () => {
    div = createdNode(el, binding);
  });
  console.log(div);
  el.addEventListener('mouseout', () => {
    if (div) {
      el.removeChild(div)
    }
  })
}

function createdNode(el, binding) {
  let value = typeof (binding.value) === 'object' ? binding.value.text : binding.value;
  let div = document.createElement('div');
  let node = document.createTextNode(JSON.stringify(value));
  el.style.position = 'relative';
  el.style.cursor = 'pointer';
  div.style.position = 'absolute';
  let obj = {
    top: {
      transform: ['-50%', '-20px'],
      key: 'left'
    },
    bottom: {
      transform: ['-50%', '20px'],
      key: 'left'
    },
    right: {
      transform: ['20px', '-50%'],
      key: 'top'
    },
    left: {
      transform: ['-20px', '-50%'],
      key: 'top'
    }
  };
  for (const key in binding.modifiers) {
    if (binding.modifiers.hasOwnProperty(key)) {
      div.style[key] = '-20px';
      div.style.transform = `translate(${obj[key].transform[0]},${obj[key].transform[1]})`;
      div.style[obj[key].key] = '50%';
    }
  }
  div.style.zIndex = 9999;
  div.appendChild(node);
  el.appendChild(div);
  return div;
}

export default {
  install(Vue) {
    Vue.directive('tip', {
      bind: tip,
      // update: tip
    })
  }
}
