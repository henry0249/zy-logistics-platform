function tip(el, binding) {
  let div = "";
  el.addEventListener('mouseover', () => {
    div = createdNode(el, binding);
  });
  el.addEventListener('mouseout', () => {
    if (div) {
      el.removeChild(div)
    }
  })
}

function createdNode(el, binding) {
  console.log(binding);
  let value = typeof (binding.value) === 'object' ? binding.value.text : binding.value;
  let div = document.createElement('div');
  let node = document.createTextNode(JSON.stringify(value));
  el.style.position = 'relative';
  el.style.cursor = 'pointer';
  div.style.position = 'absolute';
  // div.style.left = '100%';
  // div.style.top = '50%';
  // div.style.transform = 'translate(20px,-50%)';
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
      inserted: tip,
      update: tip
    })
  }
}
