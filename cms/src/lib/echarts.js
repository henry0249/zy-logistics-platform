import ECharts from 'vue-echarts/components/ECharts.vue';

import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/tree'
import 'echarts/lib/component/tooltip'

export default {
  install(Vue) {
    Vue.component('chart', ECharts)
  }
}