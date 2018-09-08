export default {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
      textStyle: {
        color: "#fff"
      }
    }
  },
  grid: {
    borderWidth: 0,
    top: 110,
    bottom: 95,
    textStyle: {
      color: "#fff"
    }
  },
  legend: {
    textStyle: {
      color: "#90979c"
    },
    data: ["入库", "出库", "损耗", "增益", "盘点", "库存"]
  },
  calculable: true,
  xAxis: [{
    type: "category",
    axisLine: {
      lineStyle: {
        color: "#90979c"
      }
    },
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitArea: {
      show: false
    },
    axisLabel: {
      interval: 0
    },
    data: []
  }],
  yAxis: [{
    type: "value",
    splitLine: {
      show: false
    },
    axisLine: {
      lineStyle: {
        color: "#90979c"
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      interval: 0
    },
    splitArea: {
      show: false
    }
  }],
  dataZoom: [{
      show: true,
      height: 30,
      xAxisIndex: [0],
      bottom: 30,
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
      name: "入库",
      type: "bar",
      key: 'in',
      stack: "总量",
      itemStyle: {
        normal: {
          color: '#3fb1e3'
        }
      },
      data: []
    },
    {
      name: "出库",
      type: "bar",
      key: 'out',
      stack: "总量",
      itemStyle: {
        normal: {
          color: '#6be6c1'
        }
      },
      data: []
    },
    {
      name: "损耗",
      type: "bar",
      key: 'decrease',
      stack: "总量",
      itemStyle: {
        normal: {
          color: '#626c91'
        }
      },
      data: []
    },
    {
      name: "增益",
      type: "bar",
      key: 'increase',
      stack: "总量",
      itemStyle: {
        normal: {
          color: '#a0a7e6'
        }
      },
      data: []
    },
    {
      name: "盘点",
      type: "bar",
      stack: "总量",
      key: 'check',
      itemStyle: {
        normal: {
          color: '#c4ebad'
        }
      },
      data: []
    },
    {
      name: "库存",
      type: "line",
      key: 'stock',
      stack: "总量",
      symbol: "circle",
      itemStyle: {
        normal: {
          color: '#96dee8'
        }
      },
      data: []
    }
  ]
}
