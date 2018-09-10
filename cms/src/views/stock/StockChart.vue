<template>
  <chart style="width:100%;height:100%" :options="options">
  </chart>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default () {
          return {};
        }
      }
    },
    data() {
      return {
        options: {
          tooltip: {
            trigger: 'axis',
          },
          grid: {
            containLabel: true
          },
          legend: {
            data: ['库存', '入库', '出库', '增益', '损耗'],
            selected: {
              '增益': false,
              '损耗': false
            }
          },
          xAxis: [{
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              rotate: 45
            },
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
          }],
          yAxis: [{
            type: 'value',
            name: '库存',
            min: 0,
            position: 'left',
            axisLabel: {
              formatter: '{value}'
            }
          }, {
            type: 'value',
            name: '数量',
            min: 0,
            position: 'right',
            axisLabel: {
              formatter: '{value}'
            }
          }],
          dataZoom: [{
              show: true,
              height: 30,
              xAxisIndex: [0],
              bottom: 0,
              start: 0,
              end: 100,
              textStyle: {
                color: "#fff"
              },
              borderColor: "#90979c"
            },
            {
              type: "inside",
              show: true,
              height: 15,
              start: 1,
              end: 35
            }
          ],
          series: [{
            name: '库存',
            key: 'stock',
            type: 'line',
            label: {
              normal: {
                show: true,
                position: 'top',
              }
            },
            lineStyle: {
              normal: {
                width: 3,
                shadowColor: 'rgba(0,0,0,0.4)',
                shadowBlur: 10,
                shadowOffsetY: 10
              }
            },
            data: []
          }, {
            name: '入库',
            key: 'in',
            type: 'bar',
            yAxisIndex: 1,
            data: []
          }, {
            name: '出库',
            key: 'out',
            type: 'bar',
            yAxisIndex: 1,
            data: []
          }, {
            name: '增益',
            key: 'increase',
            type: 'bar',
            yAxisIndex: 1,
            data: []
          }, {
            name: '损耗',
            key: 'decrease',
            type: 'bar',
            yAxisIndex: 1,
            data: []
          }]
        }
      };
    },
    watch: {},
    methods: {
      changeStock() {
        this.options.series.forEach((seriesItem, index) => {
          for (const key in this.data.yData) {
            if (seriesItem.key === key) {
              this.$set(this.options.series[index], 'data', this.data.yData[key]);
            }
          }
        });
        this.$set(this.options.xAxis[0], 'data', this.data.xData);
      }
    },
    created() {
      this.changeStock();
    }
  };
</script>

<style scoped>

</style>