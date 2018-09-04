import ECharts from 'vue-echarts/components/ECharts.vue';

import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/tree'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'

export default {
  install(Vue) {
    Vue.component('chart', ECharts)
  }
}