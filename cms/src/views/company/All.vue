<template>
  <loading-box v-model="loadingText" class="g-order-create">
    <div class="tab-box">
      <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
        <strong>{{title}}</strong>
      </div>
      <div v-if="!loadingText">
        <common-alert style="margin:15px 0">{{isInvoice?'发票信息':'流水信息'}}</common-alert>
        <all-cart :isUser="isUser" :data.sync="cartData" :init-data="initCartData"></all-cart>
        <common-alert v-if="showTable" style="margin:15px 0">运单或者订单信息</common-alert>
        <all-table :isUser="isUser" v-if="showTable" :data.sync="tableData" :init-data="initTableData"></all-table>
      </div>
      <div v-if="isShow">
        <common-alert style="margin:15px 0">下方是申请修改的数据（可以选择替换数据，然后点击审核通过按钮通过审核，也可以直接审核通过）</common-alert>
        <all-cart :data.sync="childCartData" :init-data="initChildCartData"></all-cart>
        <common-alert v-if="showTable" style="margin:15px 0">运单或者订单信息</common-alert>
        <all-table v-if="showTable" :data.sync="tableData" :init-data="initTableData"></all-table>
      </div>
    </div>
    <div class="jb" style="margin:30px 0 15px 0">
      <div>
        <el-button v-if="!edit" size="small" @click="showTableMethods">选择关联订单或运单</el-button>
        <el-button type="danger" v-if="edit && js[$route.query.payName].leftText" size="small" @click="leftOp">{{js[$route.query.payName].leftText}}</el-button>
      </div>
      <div>
        <el-button size="small" @click="back">返 回</el-button>
        <el-button v-if="isShow" size="small" @click="replaceData">替换数据</el-button>
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
      },
      isUser: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loadingText: "",
        show: false,
        showChild: true,
        js,
        cartData: {},
        childCartData: {},
        initCartData: {},
        initTableData: [],
        tableData: []
      };
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
      initChildCartData() {
        return this.data.children;
      },
      isShow() {
        if (this.showChild && this.$route.query.payName === 'invoiceCheck') {
          return this.hasChild;
        } else {
          return false;
        }
      },
      hasChild() {
        return this.data.children;
      }
    },
    methods: {
      replaceData() {
        this.initCartData = Object.assign({}, this.initCartData, {
          value: this.data.children.value,
          to: this.data.children.to,
          from: this.data.children.from,
          remittanceTime: this.data.children.remittanceTime,
          accountingTime: this.data.children.accountingTime,
          taxRate: this.data.children.taxRate,
          type: this.data.children.type,
          address: this.data.children.address,
          billingDate: this.data.children.billingDate,
        });
        this.showChild = false;
      },
      async leftOp() {
        if (this.edit) {
          let payName = this.$route.query.payName;
          let data = { ...this.cartData
          };
          let arr = ['company', 'user', 'mobile', 'toCompany', 'toUser', 'toMobile'];
          for (const item of arr) {
            if (this.cartData[item]) {
              this.$set(data, item, this.cartData[item]._id);
            }
          }
          if (payName === "receivedCheck" || payName === "invoiceCheck") {
            //打回付款流水 打回开票
            this.$prompt('请输入打回理由', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(async({
              value
            }) => {
              if (value) {
                try {
                  this.loadingText = '打回中';
                  await this.$ajax.post(this.js[payName].leftPath, { ...data,
                    text: value
                  });
                  this.$message.success('回退成功');
                  let path = '/company/account';
                  if (this.sys) path = '/sys/company';
                  this.$router.push({
                    path
                  });
                } catch (error) {}
                this.loadingText = '';
              }
            })
          }
          if (payName === "receivedEditCheck" || payName === "invoiceEditCheck") {
            //删除开票
            //删除付款流水
            this.$confirm(`是否要删除该${this.js[payName].title}`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(async() => {
              try {
                this.loadingText = '删除中';
                await this.$ajax.post(this.js[payName].leftPath, {
                  _id: data._id
                })
                this.$message.success('删除成功');
                let path = '/company/account';
                if (this.sys) path = '/sys/company';
                this.$router.push({
                  path
                });
              } catch (error) {}
              this.loadingText = '';
            });
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
              obj.toUser = this.cartData.toUser._id;
            } else if (obj.to.userType === 'company') {
              obj.toCompany = this.cartData.toCompany._id;
            }
            if (obj.from.userType === 'user') {
              obj.user = this.cartData.user._id;
            } else if (obj.from.userType === 'company') {
              obj.company = this.cartData.company._id;
            }
            if (this.hasChild) {
              obj.value = this.data.children.value;
              obj.to = this.data.children.to;
              obj.from = this.data.children.from;
              obj.remittanceTime = this.data.children.remittanceTime;
              obj.accountingTime = this.data.children.accountingTime;
              obj.taxRate = this.data.children.taxRate;
              obj.type = this.data.children.type;
              obj.address = this.data.children.address;
              obj.billingDate = this.data.children.billingDate;
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
            if (this.$route.query.titleType === 'isReceive') {
              if (this.$route.query.type === "5") {
                obj.type = 1;
              } else if (this.$route.query.type === "6") {
                obj.type = 4;
              } else {
                obj.type = this.$route.query.type;
              }
            }
            this.$set(obj, "_id", this.$route.params._id);
            this.$set(obj, "handle", this.company._id);
          }
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
          this.$message.warn(`付款金额不能为0`);
          return
        }
        if (this.cartData.from.userType === "company") {
          if (Object.keys(this.cartData.company).length === 0 || !this.cartData.company) {
            this.$message.warn("付款公司必填");
            return
          }
        } else if (Object.keys(this.cartData.user).length === 0 || !this.cartData.user) {
          this.$message.warn("付款用户必填");
          return
        }
        if (this.cartData.to.userType === "company") {
          if (Object.keys(this.cartData.toCompany).length === 0) {
            this.$message.warn("收款公司必填");
            return
          }
        } else if (Object.keys(this.cartData.toUser).length === 0 || !this.cartData.toUser) {
          this.$message.warn("收款用户必填");
          return
        }
        if (!this.cartData.remittanceTime && this.$route.query.titleType === 'isReceive') {
          this.$message.warn("汇款时间必填");
          return
        }
        if (!this.cartData.accountingTime && this.$route.query.titleType === 'isReceive') {
          this.$message.warn("到账时间必填");
          return
        }
        if (!this.cartData.billingDate && this.$route.query.titleType === 'isInvoice') {
          this.$message.warn("开票日期必填");
          return
        }
        if (!this.cartData.address && this.$route.query.titleType === 'isInvoice') {
          this.$message.warn("地址必填");
          return
        }
        if (!this.cartData.contactNumber && this.$route.query.titleType === 'isInvoice') {
          this.$message.warn("联系必填");
          return
        }
        return check;
      },
      async getRelator() {
        let isUser = this.$route.query.relationType === "user";
        let path = "/user/findOne";
        if (this.$route.query.titleType === 'isReceive') {
          if (!isUser) path = "/company/findOne";
        } else {
          if (this.$route.query.toUserType === 'company') path = "/company/findOne";
        }
        let res = await this.$ajax.post(path, {
          _id: this.$route.query.activeName
        });
        if (this.$route.query.titleType === 'isReceive') {
          if (isUser) {
            this.$set(this.initCartData, "user", res);
          } else {
            this.$set(this.initCartData, "company", res);
          }
        } else {
          if (this.$route.query.toUserType === 'user') this.$set(this.initCartData, 'toUser', res);
          this.$set(this.initCartData, 'toCompany', res);
        }
      }
    },
    async created() {
      try {
        this.loadingText = "加载中";
        if (!this.edit) {
          this.initCartData = this.js[this.$route.query.titleType].key;
          this.$set(this.initCartData.to, "userType", this.$route.query.toUserType);
          this.$set(this.initCartData.from, "userType", this.$route.query.relationType);
          this.$set(this.initCartData.to, 'disabled', true);
          if (this.$route.query.titleType === 'isReceive') {
            if (this.$route.query.toUserType === 'company') this.$set(this.initCartData, "toCompany", this.company);
            if (this.$route.query.toUserType === 'user') this.$set(this.initCartData, "toUser", this.user);
          } else {
            this.$set(this.initCartData, 'company', this.company);
          }
          if (this.$route.query.activeName) await this.getRelator();
          if (this.$route.query.activeName) this.$set(this.initCartData.from, 'disabled', true);
        } else {
          this.initCartData = JSON.parse(JSON.stringify(this.data));
        }
        // if (this.isInvoice) {
        //   this.invoice();
        //   return;
        // }
        // this.receive();
      } catch (error) {}
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