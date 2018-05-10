import {
  Loading,
  Button,
  Dialog,
  Input,
  TableColumn,
  Table,
  // Loading,
  // Loading
} from 'element-ui';

export default {
  install(Vue) {
    Vue.use(Loading)
    Vue.use(Button)
    Vue.use(Dialog)
    Vue.use(Input) 
    Vue.use(TableColumn)
    Vue.use(Table)
    // Vue.use(Loading.directive);
    // Vue.use(Loading)
  }
}
