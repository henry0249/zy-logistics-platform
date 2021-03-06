import Vue from 'vue'

let filters = {
  init(val) {
    return 'filter init'
  }
}
for (var key in filters) {
  Vue.filter(key, filters[key])
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  }
  let deepKey = function(obj, key, index = 0) {
    if (!key) {
      return obj;
    }
    if (key.indexOf(".") <= -1) {
      return obj[key];
    }
    let keyArr = key.split(".");
    if (index !== keyArr.length - 1 && obj[keyArr[index]]) {
      return deepKey(obj[keyArr[index]], key, index + 1);
    }else{
      return obj[keyArr[index]];
    }
  }
  Vue.prototype.deepKey = deepKey
  Vue.prototype.getQueryString = getQueryString
}
