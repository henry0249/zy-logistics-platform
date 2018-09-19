<template>
  <div>
    <div class="flex jb" style="padding:15px 3%;width:100%;height:30vh">
      <div style="width:30%;" class="col-flex jb">
        <div class="flex ac jb">
          <div class="blue">
            <i class="el-icon-menu el-icon--right"></i>当前库存
          </div>
          <div class="info">
            <i class="el-icon-time el-icon--right"></i>更新于<span style="color:#ccc">{{updateAt|formatTime}}</span>
          </div>
        </div>
        <div class="flex ac jb" style="padding:15px 15%">
          <div>
            <el-tooltip effect="dark" content="损耗" placement="top">
              <i class="el-icon-remove-outline danger pointer" style="font-size:18px" @click="add('decrease')"></i>
            </el-tooltip>
          </div>
          <div class="info" :style="{fontSize:fontSize}">
            {{stock || 0}}
          </div>
          <div>
            <el-tooltip effect="dark" content="增益" placement="top">
              <i class="el-icon-circle-plus-outline success pointer" @click="add('increase')" style="font-size:18px"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="flex ac jb" style="padding:0 1px">
          <div class="line"></div>
          <div class="pointer blue" @click="add('in')">入库</div>
          <div class="line"></div>
          <div class="pointer danger" @click="add('out')">出库</div>
          <div class="line"></div>
          <div class="pointer warning" @click="add('check')">盘点</div>
          <div class="line"></div>
        </div>
        <el-alert :title="company.name" type="info" center style="margin:25px 0" :closable="false">
        </el-alert>
        <div class="flex ac jb">
          <div class="info"><i class="el-icon-date el-icon--right"></i>库存变化记录</div>
          <div></div>
          <div>
            <el-select v-model="historyType" @change="typeChange" placeholder="请选择" size="mini">
              <el-option v-for="item in historyTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="jb" style="width:68%;padding:2%;color:#fff;">
        <div class="js col-flex" style="width:30%;height:100%;background:#409EFF;border-radius:4px;">
          <div>累计入库</div>
          <div class="jc f1">
            <span>累计入库</span>
            <span class="jc">10000</span>
          </div>
          <div>今日库存</div>
        </div>
        <div style="width:30%;height:100%;background:#67C23A;border-radius:4px;"></div>
        <div style="width:30%;height:100%;background:#E6A23C;border-radius:4px;"></div>
      </div>
    </div>
    <loading-box style="width:100%;padding:15px 3%;">
      <div style="width:100%;height:calc(70vh - 80px);margin: 0 auto">
        <stock-chart v-if="!loadingText" :historyType="historyType" :data="stockObj"></stock-chart>
      </div>
    </loading-box>
  </div>
</template>

<script>
  import StockChart from './StockChart.vue'
  export default {
    components: {
      StockChart,
    },
    props: {
      loadingText: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        stockTopShow: true,
        type: '',
        stock: 0,
        stockObj: {},
        updateAt: '',
        historyType: "week",
        historyTypeOptions: [{
            value: "week",
            label: "最近一周"
          },
          {
            value: "month",
            label: "最近一月"
          },
          {
            value: "quarter",
            label: "最近一季度"
          },
          {
            value: "year",
            label: "最近一年"
          }
        ],
      }
    },
    watch: {
      stockTopShow(val) {
        this.$emit('update:show', val);
      }
    },
    computed: {
      fontSize() {
        let arr = [{
            option: [0, 99],
            fontSize: '70px'
          },
          {
            option: [100, 999],
            fontSize: '65px'
          },
          {
            option: [1000, 9999],
            fontSize: '60px'
          },
          {
            option: [10000, 99999],
            fontSize: '55px'
          },
          {
            option: [100000, 999999],
            fontSize: '45px'
          },
          {
            option: [1000000, 9999999],
            fontSize: '40px'
          }
        ];
        let fontSize = '30px'
        arr.forEach(item => {
          if (this.stock >= item.option[0] && this.stock <= item.option[1]) {
            fontSize = item.fontSize;
          }
        });
        return fontSize;
      }
    },
    methods: {
      add(type) {
        this.$router.push({
          path: '/stock/add',
          query: {
            type
          }
        })
      },
      async typeChange(val) {
        try {
          this.$emit('update:loadingText', '加载中');
          await this.getStockByDate(val);
        } catch (error) {}
        this.$emit('update:loadingText', '');
      },
      async getStock() {
        let stock = await this.$api.curd({
          model: 'stock',
          curdType: 'find',
          company: this.company._id,
          sort: {
            createdAt: -1
          },
          state: 'finish'
        })
        this.stock = stock[0].new || 0;
        this.updateAt = this.changeDate(stock[0].createdAt);
      },
      changeDate(msec) {
        let datetime = new Date(msec);
        let year = datetime.getFullYear();
        let month = datetime.getMonth();
        let date = datetime.getDate();
        let hour = datetime.getHours();
        let minute = datetime.getMinutes();
        let second = datetime.getSeconds();
        let result =
          year +
          "-" +
          (month + 1 >= 10 ? month + 1 : "0" + (month + 1)) +
          "-" +
          (date + 1 < 10 ? "0" + date : date) +
          " " +
          (hour + 1 < 10 ? "0" + hour : hour) +
          ":" +
          (minute + 1 < 10 ? "0" + minute : minute) +
          ":" +
          (second + 1 < 10 ? "0" + second : second);
        return result;
      },
      async getStockByDate(type) {
        this.stockObj = await this.$ajax.post('stock/chart', {
          type,
          company: this.company._id
        });
      },
    },
    async created() {
      try {
        this.$emit('update:loadingText', '加载中');
        await this.getStock();
        await this.getStockByDate('week');
      } catch (error) {}
      this.$emit('update:loadingText', '');
    }
  }
</script>

<style scoped>
  .line {
    height: 20px;
    width: 1px;
    background: #ccc;
  }
</style>