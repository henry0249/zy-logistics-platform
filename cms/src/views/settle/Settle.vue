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
            <el-table-column :prop="key" :label="val" v-for="(val,key) in thead" :key="key">
            </el-table-column>
            <el-table-column prop="balanceForAccount" label="使用结算款" :width="200">
              <div slot-scope="scope" class="flex ac">
                <el-checkbox v-model="useAccount" @change="useAccountChange($event,scope)"></el-checkbox>
                <div class="f1" style="padding:0 10px" v-if="useAccount">
                  <my-form-item size="mini" number v-model="scope.row.balanceForAccount" :min="0">
                  </my-form-item>
                </div>
              </div>
            </el-table-column>
            <el-table-column prop="balanceForAccountPrepaid" label="使用预付款" :width="200">
              <div slot-scope="scope" class="flex ac">
                <el-checkbox v-model="usePrepaid" @change="usePrepaidChange($event,scope)"></el-checkbox>
                <div class="f1" style="padding:0 10px" v-if="usePrepaid">
                  <my-form-item size="mini" number v-model="scope.row.balanceForAccountPrepaid" :min="0">
                  </my-form-item>
                </div>
              </div>
            </el-table-column>
          </el-table>
        </loading-box>
      </el-tabs>
      <div>
        <div class="flex ac" style="padding:15px 0">
          <el-button size="mini" type="success">使用结算款</el-button>
          <el-button size="mini" type="warning" style="margin-left:15px">使用预付款</el-button>
          <div class="f1">
          </div>
          <div class="info" style="padding:0 15px">
            已选 <span class="blue">{{select.length}}</span> 条
          </div>
          <el-button size="mini" type="primary" @click="submit">确认收款</el-button>
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
        preBalancePrice: "贸易单价",
        receive: "实收数量",
        loss: "损耗数量",
        balanceCount: "结算数量",
        balancePrice: "结算价格"
      },
      tableHeight:
        "calc( 100vh - 50px - 70px - 39px - 15px - 39px - 30px - 22px - 58px - 2px)",
      tab: [],
      receivables: [],
      select: [],
      mutilBalancePrice: 0,
      useAccount: true,
      usePrepaid: false,
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
          type: this.radio
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
        this.$set(this.receivables, scope.$index, scope.row);
      }
    },
    usePrepaidChange(val, scope) {
      if (val === false) {
        scope.row.balanceForAccountPrepaid = 0;
        this.$set(this.receivables, scope.$index, scope.row);
      }
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
          financial: true
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
        // await this.$ajax.post("/businessTrains/financial", postData);
        this.$message.success("收款成功");
        let item = this.getTabItem(this.activeTab);
        if (item) {
          await this.getReceivables(item._id, item.isUser);
        }
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
      this.useAccount = true;
      this.usePrepaid = false;
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