export default {
  title: {
    text: '库存变化图'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: ['出库', '入库', '增益', '损耗']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [{
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  }],
  yAxis: [{
    type: 'value'
  }],
  series: [{
      name: '出库',
      key: 'out',
      type: 'line',
      stack: '总量',
      areaStyle: {
        normal: {}
      },
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: '入库',
      key: 'out',
      type: 'line',
      stack: '总量',
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: '增益',
      key: 'increase',
      type: 'line',
      stack: '总量',
      areaStyle: {
        normal: {}
      },
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: '损耗',
      key: 'decrease',
      type: 'line',
      stack: '总量',
      label: {
        normal: {
          show: true,
          position: 'top'
        }
      },
      areaStyle: {
        normal: {}
      },
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
}
