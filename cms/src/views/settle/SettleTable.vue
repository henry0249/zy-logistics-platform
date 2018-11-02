<template>
  <loading-box v-model="loadingText">
    <div class="body-padding body-height">
      <div slot="header">
        <div class="flex ac jb" style="color:#909399;background:#f4f4f5;font-size:13px;border-radius:4px;padding:10px 15px;margin-bottom:15px;">
          <div class="info">
            <i class="el-icon-info"></i> 订单结算
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
              从 <span class="blue fw600">{{tabLabel(item)}}</span> 处收款
            </div>
            <div class="f1"></div>
            <div class="flex ac jb" v-if="account._id">
              <div class="info">
                账户信息
              </div>
              <div class="success" style="padding:0 30px">
                结算款：{{account.value}}
              </div>
              <div class="warning">
                预付款：{{account.prepaid}}
              </div>
            </div>
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
                  <div>
                    <div v-html="checkFailText(scope.row.stateCheckFailLog)"></div>
                  </div>
                  <i slot="reference" class="el-icon-error danger pointer" style="margin-left:5px"></i>
                </el-popover>
              </div>
            </el-table-column>
            <el-table-column :prop="key" :label="val" v-for="(val,key) in thead" :key="key">
            </el-table-column>
            <el-table-column label="待结算总额">
              <div slot-scope="scope" class="warning">
                ¥ {{Number(scope.row.balancePrice) * Number(scope.row.balanceCount) - scope.row.balancedSettlement - scope.row.balancedPrepaid}}
              </div>
            </el-table-column>
            <el-table-column label="已结算金额">
              <div slot-scope="scope" class="danger">
                ¥ {{(scope.row.balancedSettlement + scope.row.balancedPrepaid)}}
              </div>
            </el-table-column>
            <el-table-column prop="preSettlement" label="使用结算款" :width="200">
              <div slot-scope="scope" class="flex ac">
                <el-checkbox v-model="scope.row.useAccount" @change="useAccountChange($event,scope)"></el-checkbox>
                <div class="f1" style="padding:0 10px" v-if="scope.row.useAccount">
                  <my-form-item size="mini" number v-model="scope.row.preSettlement" :min="0" :max="getItemMax(scope.row)">
                  </my-form-item>
                </div>
              </div>
            </el-table-column>
            <el-table-column prop="prePrepaid" label="使用预付款" :width="200">
              <div slot-scope="scope" class="flex ac">
                <el-checkbox v-model="scope.row.usePrepaid" @change="usePrepaidChange($event,scope)"></el-checkbox>
                <div class="f1" style="padding:0 10px" v-if="scope.row.usePrepaid">
                  <my-form-item size="mini" number v-model="scope.row.prePrepaid" :min="0" :max="getItemMax(scope.row,1)">
                  </my-form-item>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="结算总额">
              <div slot-scope="scope" class="warning">
                ¥ {{(scope.row.prePrepaid + scope.row.preSettlement)}}
              </div>
            </el-table-column>
          </el-table>
        </loading-box>
      </el-tabs>
      <div>
        <div class="flex ac" style="padding:15px 0">
          <div style="padding-right:10px">
            <el-button type="danger" size="small" @click="checkFail">回退修改</el-button>
          </div>
          <div v-if="quickTool">
            <el-button size="mini" type="success" @click="mutilUserAccount">一键分配结算款</el-button>
            <el-button size="mini" type="warning" style="margin-left:15px" @click="mutilUsePrepaid">一键分配预付款</el-button>
          </div>
          <div class="f1">
          </div>
          <el-checkbox v-model="arrears">允许欠款</el-checkbox>
          <div class="info" style="padding:0 15px">
            已选 <span class="blue">{{select.length}}</span> 条
          </div>
          <el-button size="mini" type="primary" @click="submit">{{submitText}}</el-button>
        </div>
      </div>
    </div>
  </loading-box>
</template>

<script>
export default {
  props: {
    quickTool: {
      type: Boolean,
      default: false
    },
    currentState: {
      type: String,
      default: "settle"
    },
    newState: {
      type: String,
      default: "financialManager"
    },
    submitText: {
      type: String,
      default: "确认结算"
    }
  },
  data() {
    return {
      loadingText: "",
      tableLoadingText: "",
      activeTab: "",
      thead: {
        "goods.name": "商品",
        preBalancePrice: "贸易单价",
        balanceCount: "结算数量",
        balancePrice: "结算价格"
      },
      tableHeight:
        "calc( 100vh - 50px - 70px - 39px - 15px - 39px - 30px - 22px - 58px - 2px)",
      tab: [],
      receivables: [],
      select: [],
      mutilBalancePrice: 0,
      account: {},
      arrears: false
    };
  },
  watch: {
    activeTab(newValue, oldValue) {
      this.activeTabChange(newValue);
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
          settleState: this.currentState
        });
        this.tab = res;
        if (res.length > 0) {
          this.activeTab = res[0]._id;
        }
      } catch (error) {}
      this.loadingText = "";
    },
    useAccountChange(val, scope) {
      if (val === false) {
        scope.row.preSettlement = 0;
      }
      scope.row.useAccount = val;
      this.$set(this.receivables, scope.$index, scope.row);
    },
    usePrepaidChange(val, scope) {
      if (val === false) {
        scope.row.prePrepaid = 0;
      }
      scope.row.usePrepaid = val;
      this.$set(this.receivables, scope.$index, scope.row);
    },
    async getReceivables(account) {
      if (!account) {
        return;
      }
      this.tableLoadingText = "加载中";
      try {
        this.receivables = [];
        let findBody = {
          receivedCompany: account.company._id || account.company,
          settleState: this.currentState
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
        this.receivables.forEach((item, index) => {
          item.useAccount = true;
          item.usePrepaid = item.prePrepaid > 0;
          this.$set(this.receivables, index, item);
        });
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
        oldSettleState: this.currentState,
        newSettleState: this.newState,
        account: this.account._id,
        arrears: this.arrears,
        businessTrains: []
      };
      for (let i = 0; i < this.select.length; i++) {
        const item = this.select[i];
        let balanceTotal =
          item.balancePrice * item.balanceCount -
          item.balancedSettlement -
          item.balancedPrepaid;
        if (item.preSettlement + item.prePrepaid <= 0) {
          this.$message.warning("结算总额必须大于0");
          return;
        }
        if (item.preSettlement + item.prePrepaid > balanceTotal) {
          this.$message.warning("总结算金额不能大于待结算金额");
          return;
        }
        postData.businessTrains.push(item);
      }
      this.loadingText = "正在结算";
      try {
        await this.$ajax.post("/businessTrains/multi/update", postData);
        this.$message.success("操作成功");
        let item = this.getTabItem(this.activeTab);
        if (item) await this.getReceivables(item);
      } catch (error) {}
      this.loadingText = "";
    },
    async activeTabChange(_id) {
      let item = this.getTabItem(_id);
      if (!item) {
        return;
      }
      this.account = item;
      await this.getReceivables(item);
    },
    mutilUserAccount() {
      if (this.select.length === 0) {
        this.$message.warning("尚未选择");
        return;
      }
      let account = this.account.value;
      this.select.forEach(item => {
        if (account > 0 && item.useAccount) {
          let balanceTotal =
            item.balancePrice * item.balanceCount -
            item.balancedSettlement -
            item.balancedPrepaid;
          if (item.prePrepaid < balanceTotal) {
            if (account > balanceTotal - item.prePrepaid) {
              item.preSettlement = balanceTotal - item.prePrepaid;
              account -= balanceTotal;
            } else {
              item.preSettlement = account;
              account -= account;
            }
          }
          this.receivables.forEach((receivablesItem, index) => {
            if (receivablesItem._id === item._id) {
              this.$set(this.receivables, index, item);
            }
          });
        }
      });
    },
    mutilUsePrepaid() {
      if (this.select.length === 0) {
        this.$message.warning("尚未选择");
        return;
      }
      let account = this.account.prepaid;
      this.select.forEach(item => {
        if (account > 0 && item.usePrepaid) {
          let balanceTotal =
            item.balancePrice * item.balanceCount -
            item.balancedSettlement -
            item.balancedPrepaid;
          if (item.preSettlement < balanceTotal) {
            if (account > balanceTotal - item.preSettlement) {
              item.prePrepaid = balanceTotal - item.preSettlement;
              account -= balanceTotal;
            } else {
              item.prePrepaid = account;
              account -= account;
            }
          }
          this.receivables.forEach((receivablesItem, index) => {
            if (receivablesItem._id === item._id) {
              this.$set(this.receivables, index, item);
            }
          });
        }
      });
    },
    getItemMax(item, type = 0) {
      let typeObj = {
        0: "prePrepaid",
        1: "preSettlement"
      };
      return (
        item.balancePrice * item.balanceCount -
        item.balancedSettlement -
        item.balancedPrepaid -
        item[typeObj[type]]
      );
    },
    checkFail() {
      if (this.select.length === 0) {
        this.$message.warning("尚未选择");
        return;
      }
      this.$prompt("请输入回退原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputErrorMessage: "原因不能为空",
        inputPattern: /\S/
      })
        .then(async ({ value }) => {
          this.loadingText = "提交中";
          try {
            let backState = "";
            if (this.currentState === "financial") return;
            if (this.currentState === "settle") backState = "financial";
            if (this.currentState === "financialManager") backState = "settle";
            let businessTrains = [];
            for (let i = 0; i < this.select.length; i++) {
              const item = this.select[i];
              let balanceTotal =
                item.balancePrice * item.balanceCount -
                item.balancedSettlement -
                item.balancedPrepaid;
              if (item.preSettlement + item.prePrepaid > balanceTotal) {
                this.$message.danger("总结算金额不能大于待结算金额");
                return;
              }
              businessTrains.push({
                _id: item._id
              });
            }
            await this.$ajax.post("/businessTrains/multi/checkFail", {
              company: this.company._id,
              newSettleState: backState,
              businessTrains: this.receivables,
              text: value
            });
            this.$message.success("操作成功");
            let item = this.getTabItem(this.activeTab);
            if (item) await this.getReceivables(item);
          } catch (error) {}
          this.loadingText = "";
        })
        .catch(() => {});
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      sums[0] = "合计";
      let selectPreBalanced = 0;
      let selectBalanced = 0;
      let selectPreSettlement = 0;
      let selectPrePrepaid = 0;
      this.select.forEach(item => {
        selectPreBalanced +=
          item.balancePrice * item.balanceCount -
          item.balancedSettlement -
          item.balancedPrepaid;
        selectBalanced += item.prePrepaid + item.preSettlement;
        selectPreSettlement += item.preSettlement;
        selectPrePrepaid += item.prePrepaid;
      });
      sums[6] = "¥ " + selectPreBalanced;
      sums[8] = "¥ " + selectPreSettlement;
      sums[9] = "¥ " + selectPrePrepaid;
      sums[10] = "¥ " + selectBalanced;
      return sums;
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