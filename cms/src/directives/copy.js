function copy(el, binding) {
  el.addEventListener('click', (e) => {
    console.log(el, binding);
    el.style.position = 'relative';
    let input = document.createElement('input');
    input.setAttribute('value', binding.value);
    input.setAttribute('readonly', 'readonly');
    input.style.background = 'none';
    input.style.display = 'none';
    input.style.border = 'none';
    input.style.position = 'absolute';
    input.style.opacity = 0;
    el.appendChild(input);
    input.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      let div = document.createElement('div');
      let node = document.createTextNode("复制成功！");
      div.appendChild(node);
      div.style.opacity = 0.6;
      div.style.width = '100px';
      div.style.height = '30px';
      div.style.position = 'absolute';
      div.style.top = '200px';
      div.style.left = '50%';
      document.body.appendChild(div);
      setTimeout(()=>{
        document.body.removeChild(div);
      },500)
    }
    el.removeChild(input);
  })
}

export default {
  install(Vue) {
    Vue.directive('copy', {
      inserted: copy,
      update: copy
    })
  }
}
