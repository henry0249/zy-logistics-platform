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
              从 <span class="blue fw600">{{item.name}}</span> 处收款
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
          <el-table size="small" :data="receivables" :height="tableHeight" style="width: 100%" @selection-change="handleSelectionChange" show-summary>
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="订单号">
              <div slot-scope="scope" class="blue"> 
                {{scope.row.order.no}}
              </div>
            </el-table-column>
            <el-table-column :prop="key" :label="val" v-for="(val,key) in thead" :key="key">
            </el-table-column>
            <el-table-column label="待结算总额">
              <div slot-scope="scope" class="warning"> 
                ¥ {{Number(scope.row.balancePrice) * Number(scope.row.balanceCount)}}
              </div>
            </el-table-column>
            <el-table-column label="已结算金额">
              <div slot-scope="scope" class="danger"> 
                ¥ {{scope.row.balanced}}
              </div>
            </el-table-column>
            <el-table-column prop="balanceForAccount" label="使用结算款" :width="200">
              <div slot-scope="scope" class="flex ac">
                <el-checkbox v-model="scope.row.useAccount" @change="useAccountChange($event,scope)"></el-checkbox>
                <div class="f1" style="padding:0 10px" v-if="scope.row.useAccount">
                  <my-form-item size="mini" number v-model="scope.row.balanceForAccount" :min="0" :max="getItemMax(scope.row)">
                  </my-form-item>
                </div>
              </div>
            </el-table-column>
            <el-table-column prop="balanceForAccountPrepaid" label="使用预付款" :width="200">
              <div slot-scope="scope" class="flex ac">
                <el-checkbox v-model="scope.row.usePrepaid" @change="usePrepaidChange($event,scope)"></el-checkbox>
                <div class="f1" style="padding:0 10px" v-if="scope.row.usePrepaid">
                  <my-form-item size="mini" number v-model="scope.row.balanceForAccountPrepaid" :min="0" :max="getItemMax(scope.row,1)">
                  </my-form-item>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="结算总额">
              <div slot-scope="scope" class="warning"> 
                ¥ {{scope.row.balanceForAccountPrepaid + scope.row.balanceForAccount}}
              </div>
            </el-table-column>
          </el-table>
        </loading-box>
      </el-tabs>
      <div>
        <div class="flex ac" style="padding:15px 0">
          <el-button size="mini" type="success" @click="mutilUserAccount">一键分配结算款</el-button>
          <el-button size="mini" type="warning" style="margin-left:15px" @click="mutilUsePrepaid">一键分配预付款</el-button>
          <div class="f1">
          </div>
          <div class="info" style="padding:0 15px">
            已选 <span class="blue">{{select.length}}</span> 条
          </div>
          <el-button size="mini" type="primary" @click="submit">确认结算</el-button>
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
      account: {}
    };
  },
  watch: {
    activeTab(newValue, oldValue) {
      this.activeTabChange(newValue);
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
    async getAccountList() {
      this.loadingText = "加载中";
      try {
        let res = await this.$ajax.post("/company/receivablesTab", {
          company: this.company._id,
          role: "settle"
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
        scope.row.balanceForAccount = 0;
      }
      scope.row.useAccount = val;
      this.$set(this.receivables, scope.$index, scope.row);
    },
    usePrepaidChange(val, scope) {
      if (val === false) {
        scope.row.balanceForAccountPrepaid = 0;
      }
      scope.row.usePrepaid = val;
      this.$set(this.receivables, scope.$index, scope.row);
    },
    async getReceivables(payCompanyOrUser, isUser) {
      if (!payCompanyOrUser) {
        return;
      }
      this.tableLoadingText = "加载中";
      try {
        this.receivables = [];
        let findBody = {
          company: this.company._id,
          financial: true,
          role: "settle"
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
        this.receivables.forEach((item, index) => {
          item.useAccount = true;
          item.usePrepaid = false;
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
        businessTrains: []
      };
      for (let i = 0; i < this.select.length; i++) {
        const item = this.select[i];
        let balanceTotal =
          item.balancePrice * item.balanceCount - item.balanced;
        if (
          item.balanceForAccount + item.balanceForAccountPrepaid >
          balanceTotal
        ) {
          this.$message.danger("总结算金额不能大于待结算金额");
          return;
        }
        postData.businessTrains.push({
          _id: item._id,
          balanceForAccount: Number(item.balanceForAccount) || 0,
          balanceForAccountPrepaid: Number(item.balanceForAccountPrepaid) || 0
        });
      }
      this.loadingText = "正在结算";
      try {
        await this.$ajax.post("/businessTrains/settle", postData);
        this.$store.commit("setSettlelist", {
          type: "businessTrainsSettlelist",
          list: this.select
        });
        this.$router.push({
          path: "/settle/account",
          query: {
            parentPath: this.$route.path,
            parentName: this.$route.name
          }
        });
      } catch (error) {}
      this.loadingText = "";
    },
    async activeTabChange(_id) {
      let item = this.getTabItem(_id);
      if (!item) {
        return;
      }
      await this.getReceivables(item._id, item.isUser);
      let body = {
        company: this.company,
        type: "company"
      };
      if (item.isUser) {
        body.relationUser = item._id;
        body.type = "user";
      } else {
        body.relationCompany = item._id;
      }
      try {
        this.account = await this.$ajax.post("/account/set", body);
      } catch (error) {}
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
            item.balancePrice * item.balanceCount - item.balanced;
          if (item.balanceForAccountPrepaid < balanceTotal) {
            if (account > balanceTotal - item.balanceForAccountPrepaid) {
              item.balanceForAccount =
                balanceTotal - item.balanceForAccountPrepaid;
              account -= balanceTotal;
            } else {
              item.balanceForAccount = account;
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
            item.balancePrice * item.balanceCount - item.balanced;
          if (item.balanceForAccount < balanceTotal) {
            if (account > balanceTotal - item.balanceForAccount) {
              item.balanceForAccountPrepaid =
                balanceTotal - item.balanceForAccount;
              account -= balanceTotal;
            } else {
              item.balanceForAccountPrepaid = account;
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
        0: "balanceForAccountPrepaid",
        1: "balanceForAccount"
      };
      return (
        item.balancePrice * item.balanceCount -
        item.balanced -
        item[typeObj[type]]
      );
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