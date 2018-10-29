import 'iview/dist/styles/iview.css'
import { Cascader } from 'iview';
import iviewArea from 'iview-area';
export default {
  install(Vue) {
    Vue.component('Cascader', Cascader);
    Vue.use(iviewArea);
  }
}