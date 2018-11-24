<template>
  <loading-box class="chartBox">
    <chart ref="chart" style="width:100%;height:100%" :options="options" @datarangeselected="datarangeselected">
    </chart>
    <div v-if="!goods" class="noDataText">无数据</div>
  </loading-box>
</template>

<script>
  export default {
    props: {
      goods: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        stockDateTypeObj: {
          // day: "日",
          week: "周",
          month: "月",
          year: "年"
        },
        stockDateType: "week",
        dataType: {
          stock: "库存",
          in: "入库",
          out: "出库",
          check: "盘点",
          increase: "增益",
          decrease: "损耗"
        },
        options: {
          // title: {
          //   text: "堆叠区域图"
          // },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#6a7985"
              }
            }
          },
          legend: {},
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: {},
          yAxis: [{
            type: "value"
          }],
          series: []
        }
      };
    },
    // watch: {
    //   company: {
    //     handler(val) {
    //       this.getChartData();
    //     },
    //     deep: true
    //   }
    // },
    methods: {
      async getChartData() {
        if (this.$refs.chart) {
          this.$refs.chart.showLoading("default", {
            text: "加载中..."
          });
        }
        try {
          let data = await this.$api.stock.stockChart({
            company: this.company._id,
            type: this.stockDateType,
            goods: this.goods
          });
          let xAxis = {
            type: "category",
            boundaryGap: false,
            data: data.xData
          };
          let series = [];
          let legend = {
            right: "3%",
            selectedMode: "single",
            data: []
          };
          for (const key in this.dataType) {
            series.push({
              name: this.dataType[key],
              type: "line",
              stack: "总量",
              areaStyle: {
                normal: {}
              },
              data: data.yData[key],
              markPoint: {
                data: [{
                    type: "max",
                    name: "最大值",
                    itemStyle: {
                      color: "#c23531"
                    }
                  },
                  {
                    type: "min",
                    name: "最小值",
                    itemStyle: {
                      color: "#2f4554"
                    }
                  }
                ]
              },
              markLine: {
                data: [{
                  type: "average",
                  name: "平均值",
                  itemStyle: {
                    color: "#409EFF"
                  }
                }]
              }
            });
            legend.data.push(this.dataType[key]);
          }
          let visualMap = [];
          for (const key in this.stockDateTypeObj) {
            let item = this.stockDateTypeObj[key];
            let color = key === this.stockDateType ? "#F56C6C" : "#ccc";
            visualMap.push({
              type: "piecewise",
              orient: "horizontal",
              categories: [item],
              hoverLink: false,
              selectedMode: "single",
              top: "top",
              left: 5 * (visualMap.length + 1) + "%",
              inRange: {
                symbol: "circle",
                color
              },
              outOfRange: {
                symbol: "circle",
                color
              },
              seriesIndex: series.length + 1
            });
          }
          if (this.stockDateType === "year") {
            this.options.dataZoom = {
              show: true,
              type: "slider",
              bottom: 10,
              start: 70,
              end: 100,
              handleIcon: "M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
              handleSize: "85%"
            };
            this.options.grid.bottom = "12%";
          } else {
            this.options.dataZoom = {
              show: false
            };
            this.options.grid.bottom = "3%";
          }
          this.options.legend = legend;
          this.options.xAxis = xAxis;
          this.options.series = series;
          this.options.visualMap = visualMap;
        } catch (error) {}
        if (this.$refs.chart) {
          this.$refs.chart.hideLoading();
        }
      },
      datarangeselected(val) {
        for (const name in val.selected) {
          if (val.selected[name] === true) {
            for (const key in this.stockDateTypeObj) {
              if (this.stockDateTypeObj[key] === name) {
                this.stockDateType = key;
              }
            }
          }
        }
        this.getChartData();
      }
    },
    mounted() {
      this.$nextTick(() => {
        if (this.goods) {
          this.getChartData();
        }
      });
    }
  };
</script>

<style scoped>
  .chartBox {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .noDataText {
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(-50%, -50%);
    font-size: 15px;
    color: #909399;
  }
</style>