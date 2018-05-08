import {
  Loading,
  Button,
  Dialog
} from 'element-ui';
 
export default {
  install(Vue) {
    Vue.use(Loading)
    Vue.use(Button)
    Vue.use(Dialog)
  }
}
