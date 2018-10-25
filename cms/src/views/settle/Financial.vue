<template>
  <loading-box v-model="loadingText">
    <div class="body-padding body-height">
      <div slot="header">
        <div class="flex ac jb" style="color:#909399;background:#f4f4f5;font-size:13px;border-radius:4px;padding:10px 15px;margin-bottom:15px;">
          <div class="info">
            <i class="el-icon-info"></i>
            订单预审
            <!-- <el-radio v-model="radio" label="businessTrains">订单结算</el-radio>
            <el-radio v-model="radio" label="logistics">物流结算</el-radio> -->
          </div>
          <div class="f1"></div>
        </div>
      </div>
      <el-tabs type="border-card" v-model="activeTab">
        <el-tab-pane :label="tabLabel(item)" v-for="item in tab" :key="item._id" :name="item._id">
          <div class="flex ac jb">
            <div>
              从 <span class="blue fw600">{{item.name}}</span> 处收款
            </div>
            <div class="f1"></div>
          </div>
        </el-tab-pane>
        <loading-box v-model="tableLoadingText">
          <el-table size="small" :data="receivables" :height="tableHeight" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column v-if="key !== 'balancePrice'" :prop="key" :label="val" v-for="(val,key) in thead" :key="key">
            </el-table-column>
            <el-table-column prop="balancePrice" label="结算价格">
              <my-form-item number size="mini" slot-scope="scope" v-model="scope.row.balancePrice" :min="0">
              </my-form-item>
            </el-table-column>
            <el-table-column label="结算总价">
              <div slot-scope="scope" class="warning"> 
                {{Number(scope.row.balancePrice) * Number(scope.row.balanceCount)}}
              </div>
            </el-table-column>
          </el-table>
        </loading-box>
      </el-tabs>
      <div>
        <div class="flex ac" style="padding:15px 0">
          <my-form-item label="结算价格" width="20%" size="mini" number :min="0" v-model="mutilBalancePrice">
          </my-form-item>
          <el-button size="mini" type="warning" style="margin-left:15px" @click="mutilSetBalancePrice">批量修改</el-button>
          <el-button size="mini" type="primary" style="margin-left:15px" icon="el-icon-refresh" @click="mutilSetBalancePrice(true)">恢复默认</el-button>
          <div class="f1">
          </div>
          <div class="info" style="padding:0 15px">
            已选 <span class="blue">{{select.length}}</span> 条
          </div>
          <el-button size="mini" type="primary" @click="submit">预审通过</el-button>
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
      tableLoadingText: "",
      activeTab: "",
      thead: {
        "order.no": "订单号",
        "goods.name": "商品",
        receive: "实收数量",
        loss: "损耗数量",
        balanceCount: "结算数量",
        preBalancePrice: "贸易单价",
        balancePrice: "结算价格"
      },
      tableHeight:
        "calc( 100vh - 50px - 70px - 39px - 15px - 39px - 30px - 22px - 58px - 2px)",
      tab: [],
      receivables: [],
      select: [],
      mutilBalancePrice: 0
    };
  },
  watch: {
    activeTab(newValue, oldValue) {
      let item = this.getTabItem(newValue);
      if (!item) {
        return;
      }
      this.getReceivables(item._id, item.isUser);
    }
  },
  methods: {
    tabLabel(item) {
      let res = item.name;
      if (item.isUser) {
        res += "(个人)";
      }
      return res;
    },
    getHeight(val) {
      this.tableHeight = val;
    },
    async getAccountList() {
      this.loadingText = "加载中";
      try {
        let res = await this.$ajax.post("/company/receivablesTab", {
          company: this.company._id,
          type: this.radio
        });
        this.tab = res;
        if (res.length > 0) {
          this.activeTab = res[0]._id;
        }
      } catch (error) {}
      this.loadingText = "";
    },
    async getReceivables(payCompanyOrUser, isUser) {
      if (!payCompanyOrUser) {
        return;
      }
      this.tableLoadingText = "加载中";
      try {
        this.receivables = [];
        let findBody = {
          company: this.company._id
        };
        if (isUser) {
          findBody.payUser = payCompanyOrUser;
        } else {
          findBody.payCompany = payCompanyOrUser;
        }
        this.receivables = await this.$ajax.post(
          "/company/receivables",
          findBody
        );
        this.setBalancePrice();
      } catch (error) {}
      this.tableLoadingText = "";
    },
    getTabItem(_id) {
      let res;
      this.tab.forEach(item => {
        if (item._id === _id) {
          res = JSON.parse(JSON.stringify(item));
        }
      });
      return res;
    },
    handleSelectionChange(val) {
      this.select = val;
    },
    setBalancePrice() {
      this.receivables.forEach((item, index) => {
        item.balancePrice = item.preBalancePrice;
        this.$set(this.receivables, index, item);
      });
    },
    mutilSetBalancePrice(setDefault) {
      if (this.select.length === 0) {
        this.$message.warning("尚未选择");
        return;
      }
      this.receivables.forEach((item, index) => {
        let inSelect = false;
        this.select.forEach(selectItem => {
          if (selectItem._id === item._id) {
            inSelect = true;
          }
        });
        if (inSelect) {
          if (setDefault === true) {
            item.balancePrice = item.preBalancePrice;
          } else {
            item.balancePrice = this.mutilBalancePrice;
          }
          this.$set(this.receivables, index, item);
        }
      });
    },
    async submit() {
      if (this.select.length === 0) {
        this.$message.warning("尚未选择");
        return;
      }
      let postData = {
        company: this.company._id,
        businessTrains: []
      };
      for (let i = 0; i < this.select.length; i++) {
        const item = this.select[i];
        if ((Number(item.balancePrice) || 0) == 0) {
          this.$message.warning("结算价格不能为0");
          return;
        }
        postData.businessTrains.push({
          _id: item._id,
          balancePrice: Number(item.balancePrice) || 0
        });
      }
      this.loadingText = "正在审核";
      try {
        await this.$ajax.post("/businessTrains/financial", postData);
        this.$message.success("预审成功");
        let item = this.getTabItem(this.activeTab);
        if (item) {
          await this.getReceivables(item._id, item.isUser);
        }
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
  height: calc(
    100vh - 50px - 35px - 35px - 80px - 80px - 40px - 2px - 40px - 20px
  );
}
</style>