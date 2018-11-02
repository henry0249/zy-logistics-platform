<template>
  <loading-box v-model="loadingText">
    <div class="body-padding body-height">
      <div slot="header">
        <div class="flex ac jb" style="color:#909399;background:#f4f4f5;font-size:13px;border-radius:4px;padding:10px 15px;margin-bottom:15px;">
          <div class="info">
            <i class="el-icon-info"></i> 订单预审
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
          <el-table size="small" :data="receivables" :height="tableHeight" style="width: 100%" @selection-change="handleSelectionChange" show-summary :summary-method="getSummaries">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="订单号" width="120">
              <div slot-scope="scope" class="blue flex ac">
                {{scope.row.order.no}}
                <el-popover placement="top" trigger="hover" v-if="scope.row.stateCheckFail">
                  <div >
                    <div v-html="checkFailText(scope.row.stateCheckFailLog)"></div>
                  </div>
                  <i slot="reference" class="el-icon-error danger pointer" style="margin-left:5px"></i>
                </el-popover>
              </div>
            </el-table-column>
            <el-table-column v-if="key !== 'balancePrice'" :prop="key" :label="val" v-for="(val,key) in thead" :key="key">
            </el-table-column>
            <el-table-column prop="balancePrice" label="结算价格">
              <my-form-item number size="mini" slot-scope="scope" v-model="scope.row.balancePrice" :min="0">
              </my-form-item>
            </el-table-column>
            <el-table-column label="已结算金额">
              <div slot-scope="scope" class="danger">
                ¥ {{(scope.row.balancedSettlement + scope.row.balancedPrepaid)}}
              </div>
            </el-table-column>
            <el-table-column label="待结算总额">
              <div slot-scope="scope" class="warning">
                {{Number(scope.row.balancePrice) * Number(scope.row.balanceCount) - scope.row.balancedSettlement - scope.row.balancedPrepaid}}
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
      this.getReceivables(item);
    }
  },
  methods: {
    checkFailText(checkFailLog) {
      return `<span class="info">${this.formatTime(
        checkFailLog.createdAt
      )}</span>: <span class="danger">${checkFailLog.remark}</span>`;
    },
    tabLabel(item) {
      let res = "";
      if (item.type === "user" && item.relationUser) {
        res = item.relationUser.name || item.relationUser.mobile + "(个人)";
      }
      if (item.type === "company" && item.relationCompany) {
        res = item.relationCompany.name || item.relationCompany.mobile;
      }
      return res;
    },
    async getAccountList() {
      this.loadingText = "加载中";
      try {
        let res = await this.$ajax.post("/company/receivablesTab", {
          company: this.company._id,
          settleState: "financial"
        });
        this.tab = res;
        if (res.length > 0) {
          this.activeTab = res[0]._id;
        }
      } catch (error) {}
      this.loadingText = "";
    },
    async getReceivables(account) {
      if (!account._id) {
        return;
      }
      this.tableLoadingText = "加载中";
      try {
        this.receivables = [];
        let findBody = {
          receivedCompany: account.company._id || account.company,
          settleState: "financial"
        };
        if (account.type === "user") {
          findBody.user = account.relationUser._id;
        } else {
          findBody.company = account.relationCompany._id;
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
        oldSettleState: "financial",
        newSettleState: "settle",
        businessTrains: []
      };
      for (let i = 0; i < this.select.length; i++) {
        const item = this.select[i];
        if ((Number(item.balancePrice) || 0) === 0) {
          this.$message.warning("结算价格不能为0");
          return;
        }
        postData.businessTrains.push(item);
      }
      this.loadingText = "正在审核";
      try {
        await this.$ajax.post("/businessTrains/multi/update", postData);
        this.$message.success("预审成功");
        let item = this.getTabItem(this.activeTab);
        if (item) await this.getReceivables(item);
      } catch (error) {}
      this.loadingText = "";
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      sums[0] = "合计";
      let selectPreBalanced = 0;
      this.select.forEach(item => {
        selectPreBalanced +=
          item.balancePrice * item.balanceCount -
          item.balancedSettlement -
          item.balancedPrepaid;
      });
      sums[9] = "¥ " + selectPreBalanced;
      return sums;
    }
  },
  async mounted() {
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