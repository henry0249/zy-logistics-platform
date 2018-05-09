import {
  Loading,
  Button,
  Dialog,
  Input
} from 'element-ui';
 
export default {
  install(Vue) {
    Vue.use(Loading)
    Vue.use(Button)
    Vue.use(Dialog)
    Vue.use(Input)
  }
}
