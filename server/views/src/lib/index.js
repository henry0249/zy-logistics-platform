import Vue from 'vue'

let libdocs = require.context('./', true, /\.js$/)
libdocs.keys().forEach(item => {
  let libItem = libdocs(item).default
  if (libItem) {
    Vue.use(libItem)
  }
  // exports.attempt = function (promiseFn, ...args) {
  //   return promiseFn.apply(null, args).then(
  //     function (result) {
  //       return result;
  //     },
  //     function (e) {
  //       return _.isError(e) ? e : new Error(e);
  //     }
  //   ).catch(function (e) {
  //     return e;
  //   });
  // };
})
