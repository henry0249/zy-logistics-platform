import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-carbon.css' // 使用 carbon 主题

export default {
  install(Vue) {
    Vue.use(MuseUI)
  }
}