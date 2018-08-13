function createBadge(el, binding) {
  let count = Number(binding.value);
  if (count <= 0) {
    return;
  }
  let div = document.createElement('div');
  div.innerHTML = binding.value;
  div.style.position = 'absolute';
  div.style.right = '0';
  div.style.top = '0';
  el.style.position = 'relative'
  el.appendChild(div);

}
export default {
  install(Vue) {
    Vue.directive('badge', {
      inserted: createBadge
    })
  }
}
