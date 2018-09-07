<template>
  <chart style="width:100%;height:100%" :options="option">
  </chart>
</template>

<script>
  export default {
    data() {
      return {
        option: {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['入库', '出库', '损耗', '增益', '库存']
          },
          grid: {
            left: '2%',
            right: '5%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [{
              name: '入库',
              type: 'line',
              smooth: true,
              data: []
            },
            {
              name: '出库',
              type: 'line',
              smooth: true,
              data: []
            },
            {
              name: '损耗',
              type: 'line',
              smooth: true,
              data: []
            },
            {
              name: '增益',
              type: 'line',
              smooth: true,
              data: []
            },
            {
              name: '库存',
              type: 'line',
              smooth: true,
              data: [],
              markPoint: {
                data: [{
                    type: 'max',
                    name: '最大值'
                  },
                  {
                    type: 'min',
                    name: '最小值'
                  }
                ]
              }
            }
          ]
        }
      }
    },
    methods: {
      changeDate(msec) {
        let datetime = new Date(msec);
        let year = datetime.getFullYear();
        let month = datetime.getMonth();
        let date = datetime.getDate();
        let hour = datetime.getHours();
        let minute = datetime.getMinutes();
        let second = datetime.getSeconds();
        let result = year +
          '-' +
          ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
          '-' +
          ((date + 1) < 10 ? '0' + date : date) +
          ' ' +
          ((hour + 1) < 10 ? '0' + hour : hour) +
          ':' +
          ((minute + 1) < 10 ? '0' + minute : minute) +
          ':' +
          ((second + 1) < 10 ? '0' + second : second);
        return result;
      },
      async getStock() {
        try {
          let res = await this.$api.curd({
            model: 'stock',
            curdType: 'find',
            sort: {
              createdAt: -1
            },
            limit: 0
          })
          let date = [];
          let inArr = [];
          let outArr = [];
          let increaseArr = [];
          let decreaseArr = [];
          res.forEach(item => {
            let obj = {};
            date.unshift(this.changeDate(item.createdAt));
            obj.createdAt = item.createdAt;
            obj.num = item.num;
            if (item.type === 'in') {
              inArr.unshift(obj);
            }
            if (item.type === 'out') {
              outArr.unshift(obj);
            }
            if (item.type === 'decrease') {
              decreaseArr.unshift(obj);
            }
            if (item.type === 'increase') {
              increaseArr.unshift(obj);
            }
          });
          let newInArr = [];
          let newOutArr = [];
          let newIncreaseArr = [];
          let newDecreaseArr = [];
          date.forEach(item => {
            newInArr.push(0);
            newOutArr.push(0);
            newIncreaseArr.push(0);
            newDecreaseArr.push(0);
          });
          date.forEach((dateItem, index) => {
            inArr.forEach(inItem => {
              if (JSON.stringify(this.changeDate(inItem.createdAt)) === JSON.stringify(dateItem)) {
                newInArr.splice(index, 1, inItem.num);
              }
            });
            outArr.forEach(outItem => {
              if (JSON.stringify(this.changeDate(outItem.createdAt)) === JSON.stringify(dateItem)) {
                newOutArr.splice(index, 1, outItem.num);
              }
            });
            decreaseArr.forEach(decreaseItem => {
              if (JSON.stringify(this.changeDate(decreaseItem.createdAt)) === JSON.stringify(dateItem)) {
                newDecreaseArr.splice(index, 1, decreaseItem.num);
              }
            });
            increaseArr.forEach(increaseItem => {
              if (JSON.stringify(this.changeDate(increaseItem.createdAt)) === JSON.stringify(dateItem)) {
                newIncreaseArr.splice(index, 1, increaseItem.num);
              }
            });
          });
          let stockArr = [];
          res.forEach(resItem => {
            stockArr.push(resItem.new);
          });
          this.$set(this.option.xAxis, 'data', date.map(function(str) {
            return str.replace(' ', '\n')
          }));
          this.$set(this.option.series[0], 'data', newInArr);
          this.$set(this.option.series[1], 'data', newOutArr);
          this.$set(this.option.series[2], 'data', newDecreaseArr);
          this.$set(this.option.series[3], 'data', newIncreaseArr);
          this.$set(this.option.series[4], 'data', stockArr);
          console.log(this.option);
        } catch (error) {
          console.log(error);
        }
      }
    },
    created() {
      this.getStock();
    }
  }
</script>

<style scoped>

</style>