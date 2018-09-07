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
            <i class="el-icon-remove-outline danger pointer" style="font-size:18px"></i>
          </el-tooltip>
        </div>
        <div class="info" style="font-size:70px">
          {{stock}}
        </div>
        <div>
          <el-tooltip effect="dark" content="增益" placement="top">
            <i class="el-icon-circle-plus-outline success pointer" style="font-size:18px"></i>
          </el-tooltip>
        </div>
      </div>
      <div class="flex ac jb" style="padding:0 1px">
        <div class="line"></div>
        <div class="pointer blue">入库</div>
        <div class="line"></div>
        <div class="pointer danger">出库</div>
        <div class="line"></div>
        <div class="pointer warning">盘点</div>
        <div class="line"></div>
      </div>
      <el-alert :title="company.name" type="info" center style="margin:25px 0" :closable="false">
      </el-alert>
      <div class="flex ac jb">
        <div class="info"><i class="el-icon-date el-icon--right"></i>库存变化记录</div>
        <div></div>
        <div>
          <el-select v-model="historyType" placeholder="请选择" size="mini">
            <el-option v-for="item in historyTypeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div style="width:67%">
      <div style="width:100%;height:40vh;margin: 0 auto">
        <Test></Test>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      loadingText: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        stock: 0,
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
    methods: {
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
        console.log(stock);
      },
      async getStockByDate(type) {
        let typeObj = {
          week:7,
          month:30,
          quarter:90,
          year:365
        }
        let date = new Date();
        let data = {
          model: 'stock',
          curdType: 'find',
          company: this.company._id,
          sort: {
            createdAt: -1
          }
        }
        let newDate = new Date(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()} 00:00:000`)
        console.log(newDate.getTime() - typeObj[type]*24*60*60*1000);
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

</style>