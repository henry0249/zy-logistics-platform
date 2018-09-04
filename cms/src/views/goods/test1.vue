<template>
  <Chart :option="chartOption">
  </Chart>
</template>

<script>
  export default {
    props: {
      value: {
        type: [Object, Array],
        default () {
          return {}
        }
      },
      width: {
        type: [Number, String],
        default: '100%'
      },
      label: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        chartOption: {
          title: {
            text: 'ECharts 入门示例'
          },
          tooltip: {},
          legend: {
            data: ['销量']
          },
          xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        }
      }
    }
  }
</script>

<style scoped>
  .cascader-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .label-txt {
    display: inline-block;
    width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 10px;
  }
</style>