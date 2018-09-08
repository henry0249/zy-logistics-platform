<template>
  <div class="flex jb" style="padding:15px 3%;width:100%">
    <div style="width:30%;height:40vh">
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
        <div class="info" style="font-size:70px">
          {{stock}}
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
    <div style="width:67%">
      <div style="width:100%;height:40vh;margin: 0 auto">
        <stock-chart v-if="!loadingText" :data="stockObj"></stock-chart>
      </div>
    </div>
    <el-dialog width="70%" :visible.sync="dialogTableVisible">
      <edmit-item show.sync="stockTopShow" @back="back" @sub="sub" v-if="dialogTableVisible" :type="type"></edmit-item>
    </el-dialog>
  </div>
</template>

<script>
  import StockChart from './StockChart.vue'
  import EdmitItem from './EdmitItem.vue';
  export default {
    components: {
      StockChart,
      EdmitItem
    },
    props: {
      loadingText: {
        type: String,
        default: ''
      },
    },
    watch: {
      show(val) {
        console.log(val);
      }
    },
    data() {
      return {
        stockTopShow: true,
        type: '',
        dialogTableVisible: false,
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
    methods: {
      back(val) {
        this.dialogTableVisible = val;
      },
      sub(val) {
        this.dialogTableVisible = false;
        this.$emit('sub', false);
      },
      add(type) {
        this.dialogTableVisible = true;
        this.type = type;
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
          }
        })
        this.stock = stock[0].new;
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
      } catch (error) {
        console.log(error);
      }
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