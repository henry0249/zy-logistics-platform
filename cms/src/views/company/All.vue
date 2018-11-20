<template>
  <loading-box v-model="loadingText" class="g-order-create">
    <div class="tab-box">
      <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
        <strong>{{title}}</strong>
      </div>
      <div v-if="!loadingText">
        <common-alert style="margin:15px 0">{{isInvoice?'发票信息':'流水信息'}}</common-alert>
        <all-cart :data.sync="cartData" :init-data="initCartData"></all-cart>
        <common-alert v-if="showTable" style="margin:15px 0">运单或者订单信息</common-alert>
        <all-table v-if="showTable" :data.sync="tableData" :init-data="initTableData"></all-table>
      </div>
      <div v-if="hasChild"></div>
    </div>
    <div class="jb" style="margin:30px 0 15px 0">
      <div>
        <el-button v-if="!edit" size="small" @click="showTableMethods">选择关联订单或运单</el-button>
        <el-button type="danger" v-if="edit && js[$route.query.payName].leftText" size="small" @click="leftOp">{{js[$route.query.payName].leftText}}</el-button>
      </div>
      <div>
        <el-button size="small" @click="back">返 回</el-button>
        <el-button size="small" type="primary" @click="sub">{{edit?js[$route.query.payName].subText:'添 加'}}</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  import js from "./CompanyAccount.js";
  import AllCart from "./AllCart.vue";
  import AllTable from "./AllTable.vue";
  export default {
    components: {
      AllCart,
      AllTable
    },
    props: {
      data: {
        type: Object,
        default () {
          return {};
        }
      },
      edit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loadingText: "",
        show: false,
        js,
        cartData: {},
        initCartData: {},
        initTableData: [],
        tableData: []
      };
    },
    watch: {
      cartData: {
        handler(val) {
          console.log(val);
        },
        deep: true
      }
    },
    computed: {
      showTable() {
        if (this.show) {
          return true;
        } else {
          if (this.edit) {
            return this.initTableData.length > 0;
          } else {
            if (this.initTableData.length > 0) {
              return false;
            }
          }
        }
      },
      isInvoice() {
        return this.$route.query.titleType === "isInvoice";
      },
      title() {
        if (this.$route.query.payName) {
          return this.js[this.$route.query.payName].title;
        } else {
          if (this.$route.query.titleType === "isReceive") {
            if (this.$route.query.type === "5") {
              return "收款单";
            } else if (this.$route.query.type === "6") {
              return "预收款单";
            }
          } else {
            return "开票单";
          }
        }
      },
      hasChild() {
        return this.data.children;
      }
    },
    methods: {
      leftOp() {
        if (this.edit) {
          let payName = this.$route.query.payName;
          if (payName === "receivedCheck") {
            //打回付款流水
          } else if (payName === "receivedEditCheck") {
            //回退付款流水
          } else if (payName === "invoiceCheck") {
            //打回开票
          } else if (payName === "invoiceEditCheck") {
            //回退开票
          }
        }
      },
      showTableMethods() {
        if (this.initTableData.length === 0) {
          this.$message.warn("无可关联的运单或订单");
        }
      },
      sub() {
        if (this.checkMethods()) {
          let data = {};
          let obj = JSON.parse(JSON.stringify(this.cartData));
          if (this.edit) {
            delete obj.company;
            delete obj.toCompany;
            obj.relationType = obj.from.userType;
            obj.toType = obj.to.userType;
            if (obj.to.userType === 'user') {
              obj.toUser = this.user._id;
            } else if (obj.to.userType === 'company') {
              obj.toCompany = this.company._id;
            }
            if (obj.from.userType === 'user') {
              obj.user = this.$route.query.activeName;
            } else if (obj.to.userType === 'company') {
              obj.company = this.$route.query.activeName;
            } else {
              obj.mobile = this.$route.query.activeName;
            }
          } else {
            if (this.$route.query.relationType === "company") {
              obj.company = this.cartData.company._id;
            } else if (this.$route.query.relationType === "user") {
              obj.user = this.cartData.user._id;
            }
            if (this.$route.query.toUserType === "company") {
              obj.toCompany = this.cartData.toCompany._id;
            } else if (this.$route.query.toUserType === "user") {
              obj.toUser = this.cartData.toUser._id;
            }
          }
          if (this.$route.query.type === "5") {
            obj.type = 1;
          } else if (this.$route.query.type === "6") {
            obj.type = 4;
          } else {
            obj.type = this.$route.query.type;
          }
          this.$set(obj, "_id", this.$route.params._id);
          this.$set(obj, "handle", this.company._id);
          data = {
            table: this.tableData,
            cartData: obj
          };
          this.$emit("sub", data);
        }
      },
      checkMethods(val) {
        let check = true;
        let arr = {
          account: "银行卡号",
          bank: "所属银行",
          bankName: "银行全称"
        };
        for (const key in this.cartData) {
          if (arr[key]) {
            if (!this.cartData[key]) {
              this.$message.warn(`${arr[key]}为空或格式不对`);
              return (check = false);
            }
          }
        }
        if (this.cartData.value === 0) {
          this.$message.warn("付款金额不能为0");
          return (check = false);
        }
        if (this.$route.query.relationType === "company") {
          if (Object.keys(this.cartData.company).length === 0) {
            this.$message.warn("付款公司必填");
            return (check = false);
          }
        } else if (Object.keys(this.cartData.user).length === 0) {
          this.$message.warn("付款用户必填");
          return (check = false);
        }
        if (this.$route.query.toUserType === "company") {
          if (Object.keys(this.cartData.toCompany).length === 0) {
            this.$message.warn("收款公司必填");
            return (check = false);
          }
        } else if (Object.keys(this.cartData.user).length === 0) {
          this.$message.warn("收款用户必填");
          return (check = false);
        }
        if (!this.cartData.remittanceTime) {
          this.$message.warn("汇款时间必填");
          return (check = false);
        }
        if (!this.cartData.accountingTime) {
          this.$message.warn("到账时间必填");
          return (check = false);
        }
        return check;
      },
      async setReceive() {
        try {
          this.loadingText = "添加中";
          let data = {};
        } catch (error) {}
        this.loadingText = "";
      },
      invoice() {},
      receive() {
        let type = this.$route.query.type;
        if (this.edit) {
          let data = {};
          for (const key in this.initCartData) {
            if (this.initCartData.hasOwnProperty(key)) {
              this.$set(data, key, this.data[key]);
            }
          }
          console.log('00',this.data);
          this.initCartData = data;
          console.log('11',this.initCartData);
          this.$set(this.initCartData.from, "disabled", true);
        } else {}
        if (type === "5" || type === "6") {
          this.$set(this.initCartData, "toCompany", this.company);
          this.$set(this.initCartData.to, "disabled", true);
        }
      },
      async getRelator() {
        let isUser = this.$route.query.relationType === "user";
        let res = await this.$ajax.post(
          isUser ? "/user/findOne" : "/company/findOne", {
            _id: this.$route.query.activeName
          }
        );
        if (isUser) {
          this.$set(this.initCartData, "user", res);
        } else {
          this.$set(this.initCartData, "company", res);
        }
      }
    },
    async created() {
      try {
        this.loadingText = "加载中";
        this.initCartData = this.js[this.$route.query.titleType];
        if (this.$route.query.activeName) {
          await this.getRelator();
        }
        this.$set(this.initCartData.to, "userType", this.$route.query.toUserType);
        this.$set(
          this.initCartData.from,
          "userType",
          this.$route.query.relationType
        );
        if (this.isInvoice) {
          this.invoice();
        } else {
          this.receive();
        }
        this.$set(this.initCartData.to, "userType", this.$route.query.toUserType);
        this.$set(
          this.initCartData.from,
          "userType",
          this.$route.query.relationType
        );
        console.log(this.initCartData);
      } catch (error) {
        console.log(error);
      }
      this.loadingText = "";
    }
  };
</script>

<style scoped>
  .g-order-create {
    padding: 0 1%;
  }
  .tab-top {
    padding: 0 0 15px 0;
    border-bottom: 1px solid #dcdfe6;
  }
</style>