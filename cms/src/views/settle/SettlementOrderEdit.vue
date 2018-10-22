<template>
  <loading-box v-model="loadingText">
    <div class="body-padding body-height">
      <div slot="header">
        <div class="flex ac jb" style="color:#909399;background:#f4f4f5;font-size:13px;border-radius:4px;padding:10px 15px;margin-bottom:15px;">
          <div v-tooltip="'6666'">订单结算</div>
          <div class="f1"></div>
          <div class="warning">全部待收: 387786</div>
        </div>
      </div>
      <el-tabs type="border-card">
        <el-tab-pane :label="tabLabel(item)" v-for="item in receivables" :key="item._id">
          <el-table size="small" :data="item.orderPaylist" style="width: 100%">
            <el-table-column :prop="key" :label="val" v-for="(val,key) in thead" :key="key">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer">
        <div class="flex ac" style="padding:15px 0">
          <div class="f1">
          </div>
          <el-button size="small" type="primary">预审通过</el-button>
        </div>
      </div>
    </div>
  </loading-box>
</template>

<script>
  export default {
    data() {
      return {
        loadingText: "",
        thead:{
          _id:"id"
        },
        tableHeight: 0,
        receivables: []
      };
    },
    methods: {
      tabLabel(item){
        return item.name;
      },
      getHeight(val) {
        this.tableHeight = val;
      },
      async getAccountList() {
        this.loadingText = "加载中";
        try {
          let res = await this.$ajax.post("/company/receivables", {
            company: this.company._id
          });
          this.receivables = res.businessTrains;
        } catch (error) {}
        this.loadingText = "";
      }
    },
    mounted() {
      this.getAccountList();
    }
  };
</script>

<style scoped>
  .main-height {
    overflow: auto;
    padding: 0 2px;
    height: calc( 100vh - 50px - 35px - 35px - 80px - 80px - 40px - 2px - 40px - 20px);
  }
</style>