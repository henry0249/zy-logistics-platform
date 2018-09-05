<template>
  <loading-box v-if="show" v-model="loadingText">
    <div class="jc jb">
      <div class="jc js">
        <my-form-item style="margin:10px 0 10px 8px;" v-model="input" @change="inputChange" select size="mini" :options="option" width="200px" label="选择模式"></my-form-item>
        <div style="margin:10px 8px 10px 10px;">当前库存：<span :style="stock<0?{color:'#E6A23C'}:{color:'#67C23A'}">{{stock}}</span></div>
      </div>
      <div class="js" style="height:28px;">
        <el-button size="mini" @click="add('out')">增加出库</el-button>
        <el-button size="mini" @click="add('in')">增加入库</el-button>
        <el-button size="mini" @click="add('increase')">增加增益</el-button>
        <el-button size="mini" style="margin-right:10px;" @click="add('decrease')">增加损耗</el-button>
      </div>
    </div>
    <chart v-if="!loadingText" key="line" style="width: 100%;height:400px;" :options="lineOption"></chart>
    <el-dialog v-if="dialogTableVisible" width="70%" :visible.sync="dialogTableVisible">
      <edmit-item @sub="sub" @back="back" :type="type"></edmit-item>
    </el-dialog>
  </loading-box>
</template>

<script>
  import stockData from './stock.js';
  import StockBox from './StockBox.vue';
  import EdmitItem from './EdmitItem.vue';
  export default {
    components: {
      StockBox,
      EdmitItem
    },
    data() {
      return {
        show: true,
        type: '',
        dialogTableVisible: false,
        stock: 0,
        data: {
          stock: 363,
          createdAt: '2018-08-15 08:47:24',
          type: 'in'
        },
        loadingText: '',
        show: true,
        input: 'day',
        option: [{
            label: '最近一周',
            value: 'day'
          },
          {
            label: '最近几个月',
            value: 'month'
          }
        ],
        lineOption: {
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
            data: ['出库', '入库', '盘点', '增益', '损耗', '盘点增益', '盘点损耗']
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
          series: []
        },
        dayData: stockData.dayData,
        monthData: stockData.monthData
      }
    },
    watch: {
      company: {
        handler(val) {
          this.show = false;
          setTimeout(() => {
            this.show = true;
          }, 200);
          console.log(val);
        },
        deep: true
      }
    },
    computed: {},
    methods: {
      back(val) {
        this.dialogTableVisible = val;
      },
      sub(val) {
        this.dialogTableVisible = val;
      },
      add(type) {
        this.dialogTableVisible = true;
        this.type = type;
      },
      inputChange(val) {
        this.loadingText = '加载中';
        if (val === 'day') {
          this.$set(this.lineOption, 'xAxis', [{
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }])
          this.$set(this.lineOption, 'series', this.dayData);
        } else if (val === 'month') {
          let date = new Date().getMonth() + 1;
          let data = [];
          for (let index = 6; index >= 0; index--) {
            if (date - index > 0) {
              data.push(date - index + '月');
            } else if (date - index === 0) {
              data.push('12月');
            } else {
              data.push(-(date - index) + '月');
            }
          }
          this.$set(this.lineOption, 'xAxis', [{
            type: 'category',
            boundaryGap: false,
            data: data
          }])
          this.$set(this.lineOption, 'series', this.monthData);
        }
        this.$nextTick(() => {
          this.loadingText = '';
        })
      },
      async getStock() {
        let stock = await this.$api.curd({
          model: 'stock',
          curdType: 'findOne',
          sort: {
            createdAt: -1
          }
        });
        if (Object.keys(stock).length > 0) {
          this.stock = stock.new;
        }
      }
    },
    async created() {
      try {
        this.loadingText = '加载中';
        await this.getStock();
      } catch (error) {}
      this.$set(this.lineOption, 'series', this.dayData);
      this.loadingText = '';
    }
  }
</script>

<style scoped>

</style>