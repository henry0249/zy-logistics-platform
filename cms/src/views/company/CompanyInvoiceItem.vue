<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>{{title}}</strong>
        </div>
        <company-invoice-table v-if="!loadingText" :selection.sync="selection" :edit="edit" :data.sync="tableData" :initData="tableInitData" :invoiceTotal="invoiceTotal" :isCheck.sync="isCheck" :invoiceValue.sync="invoiceValue"></company-invoice-table>
        <bank-cart v-if="!loadingText && show" isInvoice style="margin-top:15px;width:100%" :data.sync="cartData" :initData="initCartData"></bank-cart>
      </div>
      <el-dialog :visible.sync="dialogVisible">
        <div class="jc jb">
          <span class="js" style="width:100px;margin-right:20px;">审核错误原因</span>
          <el-input class="f1" v-model="input" placeholder="请输入审核错误原因"></el-input>
        </div>
        <div slot="footer" class="jb">
          <el-button size="small" @click="dialogVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="repulseInvoice">确 定</el-button>
        </div>
      </el-dialog>
      <div class="jb" style="margin:30px 0 15px 0">
        <div>
          <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        </div>
        <div class="jc js">
          <el-button v-if="edit && !isCheckFail" size="small" type="primary" @click="repulse">打回发票</el-button>
          <el-button v-if="edit && isCheckFail" size="small" type="primary" @click="delInvoice">删除发票</el-button>
          <el-button size="small" type="primary" @click="sub">{{subText}}</el-button>
        </div>
      </div>
    </div>
  </loading-box>
</template>

<script>
  import CompanyInvoiceTable from "./CompanyInvoiceTable.vue";
  import CompanyInvoiceCart from "./CompanyInvoiceCart.vue";
  export default {
    components: {
      CompanyInvoiceTable,
      CompanyInvoiceCart
    },
    props: {
      edit: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      invoiceData: {
        type: Object,
        default () {
          return {};
        }
      }
    },
    data() {
      return {
        loadingText: "",
        input: "",
        invoiceValue: 0,
        index: 0,
        show: true,
        isCheck: false,
        dialogVisible: false,
        tableHeight: "calc(100vh - 50px - 70px - 62px - 53px - 40px - 60px - 77px)",
        tableData: [],
        tableInitData: [],
        newData: [],
        indexData: [],
        res: [],
        selection: [],
        cartData: {},
        initCartData: {
          value: 0,
          from: {
            name: "",
            bank: "",
            bankName: "",
            account: "",
            type: "",
            remark: "",
            disabled: true
          },
          to: {
            name: "",
            bank: "",
            bankName: "",
            account: "",
            type: "",
            remark: "",
            disabled: true
          },
          recordDate: "",
          openDate: "",
          toCompany: {},
          company: {},
          type: 0,
          taxRate: 0,
          contactNumber: '',
          address: '',
          billingDate: ''
        }
      };
    },
    watch: {
      invoiceValue(val) {
        this.$set(this.initCartData, "value", val);
      },
      tableData: {
        handler(val) {
          console.log(val);
        },
        deep: true
      }
    },
    computed: {
      invoiceTotal() {
        if (this.edit) {} else {
          return typeof(this.$route.query.total) === 'number' ? this.$route.query.total : Number(this.$route.query.total);
        }
      },
      subText() {
        let data = "开发票";
        if (this.edit) {
          if (this.$route.query.checkFail === "financialManager") {
            data = "回退发票";
          } else {
            data = "审核成功";
          }
        }
        return data;
      },
      title() {
        let data = "开发票";
        if (this.$route.query.checkFail === "financialManager") {
          data = "被打回发票";
        } else if (this.edit) {
          data = "审核发票";
        }
        return data;
      },
      isCheckFail() {
        return this.$route.query.checkFail === "financialManager";
      },
      isShow() {
        let data = true;
        if (this.edit) {
          if (this.isCheckFail) {
            data = true;
          } else {
            data = false;
          }
        } else {
          data = true;
        }
        return data;
      }
    },
    methods: {
      changUser(scope) {
        let data = {
          name: "",
          type: "",
          userType: ""
        };
        data = Object.assign({}, data, {
          name: scope.row.receivedCompany.name,
          userType: "公司",
          type: "warning"
        });
        return data;
      },
      async delInvoice() {
        try {
          this.loadingText = "删除中";
          await this.$ajax.post("/invoice/delete", {
            _id: this.$route.params._id
          });
          this.goback("删除成功");
        } catch (error) {}
        this.loadingText = "";
      },
      async sub() {
        if (!this.edit) {
          if (this.checkMethods()) {
            this.setInvoice("set");
          }
        } else {
          if (this.$route.query.checkFail === "financialManager") {
            this.setInvoice("update");
          } else {
            if (this.checkMethods()) {
              this.editInvoice();
            }
          }
        }
      },
      checkMethods(val) {
        let check = true;
        var integer1 = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
        var integer2 = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
        let data = false;
        this.tableData.forEach(item => {
          if (item.invoiceBalance > 0) {
            data = true;
            return;
          }
        });
        if (this.selection.length === 0) {
          this.$message.warn("请先选择开票");
          return (check = false);
        } else if (!data) {
          this.$message.warn("请先填写开票金额");
          return (check = false);
        } else if (!this.cartData.address) {
          this.$message.warn("地址不能为空");
          return (check = false);
        } else if (!this.cartData.billingDate) {
          this.$message.warn("开票日期不能为空");
          return (check = false);
        } else if (!this.cartData.contactNumber) {
          this.$message.warn("联系电话不能为空");
          return (check = false);
        } else if (!integer1.test(this.cartData.contactNumber) &&
          !integer2.test(this.cartData.contactNumber)
        ) {
          this.$message.warn("联系电话格式不正确");
          return (check = false);
        }
        return check;
      },
      repulse() {
        this.dialogVisible = true;
      },
      goback(text) {
        this.$message.success(text);
        this.$router.push({
          path: "/company/account"
        });
      },
      async repulseInvoice() {
        this.dialogVisible = false;
        try {
          this.loadingText = "打回中";
          await this.$ajax.post("/invoice/checkFail", {
            ...this.invoiceData,
            text: this.input
          });
          this.goback("打回成功");
        } catch (error) {}
        this.loadingText = "";
      },
      async editInvoice() {
        try {
          this.loadingText = "发票审核中";
          await this.$ajax.post("/invoice/check", this.invoiceData);
          this.goback("审核成功");
        } catch (error) {}
        this.loadingText = "";
      },
      async setInvoice(type) {
        try {
          this.loadingText = type === "set" ? "添加中" : "回退中";
          let cartData = type === "set" ? this.cartData : this.initCartData;
          let data = {
            value: cartData.value,
            type: cartData.type,
            taxRate: cartData.taxRate,
            to: cartData.to,
            from: cartData.from,
            toType: this.newData.isUser ? "user" : "company",
            company: this.company._id,
            contactNumber: cartData.contactNumber,
            address: cartData.address,
            billingDate: cartData.billingDate
          };
          if (type === 'set') {
            if (this.$route.query.type === 'company') {
              data.toCompany = this.$route.query._id;
            } else {
              data.toUser = this.$route.query._id;
            }
          } else {
            // if (this.newData.isUser) {
            //   data.toUser = this.activeName;
            // } else {
            //   data.toCompany = this.activeName;
            // }
          }
          let businessTrainsArr = [];
          let logisticsArr = [];
          if (type === "set") {
            this.tableData.forEach(item => {
              if (item.isBusinessTrains) {
                businessTrainsArr.push({
                  _id: item._id,
                  preInvoiced: item.invoiceBalance
                });
              } else {
                logisticsArr.push({
                  _id: item._id,
                  preInvoiced: item.invoiceBalance
                });
              }
            });
            if (businessTrainsArr.length > 0) {
              data.businessTrainsArr = businessTrainsArr;
            }
            if (logisticsArr.length > 0) {
              data.logisticsArr = logisticsArr;
            }
          } else {
            data._id = this.invoiceData._id;
            if (this.invoiceData.businessTrainsArr.length > 0) {
              data.businessTrainsArr = this.invoiceData.businessTrainsArr;
            }
            if (this.invoiceData.logisticsArr.length > 0) {
              data.logisticsArr = this.invoiceData.logisticsArr;
            }
          }
          let path = "/invoice/set";
          if (type === "update") {
            path = "/invoice/update";
          }
          await this.$ajax.post(path, data);
          this.goback(`${type === "set" ? "开发票成功" : "回退成功"}`);
        } catch (error) {}
        this.loadingText = "";
      },
      async getInvoice() {
        let data = {
          fromCompany: this.company._id,
          limit: 0
        };
        if (this.$route.query.type === 'user') {
          data.toUser = this.$route.query._id;
          data.toType = "user";
        } else {
          data.toCompany = this.$route.query._id;
          data.toType = "company";
        }
        this.tableInitData = await this.$ajax.post("/invoice/wait/list", data);
      },
      async getUser(type) {
        let path = type === 'user' ? '/user/findOne' : '/company/findOne';
        let key = type === 'user' ? 'toUser' : 'toCompany';
        let res = await this.$ajax.post(path, {
          _id: this.$route.query._id
        });
        this.$set(this.initCartData, type, res);
      },
      async getBusinessTrains() {
        let data = [];
        for (
          let index = 0; index < this.invoiceData.businessTrainsArr.length; index++
        ) {
          let res = await this.$ajax.post("businessTrains/findOne", {
            _id: this.invoiceData.businessTrainsArr[index]._id
          });
          if (res) {
            this.$set(
              res,
              "invoiceBalance",
              this.invoiceData.businessTrainsArr[index].preInvoiced
            );
            data.push(res);
          }
        }
        this.tableInitData = data;
      },
      async isEditChange() {
        await this.getBusinessTrains();
        for (const key in this.initCartData) {
          if (this.invoiceData[key]) {
            this.$set(this.initCartData, key, this.invoiceData[key]);
          }
        }
      },
      async noEditCHange() {
        await this.getInvoice();
        await this.getUser(this.$route.query.type);
        this.$set(this.initCartData, 'billingDate', new Date());
        this.$set(this.initCartData.to, 'recordDate', new Date());
        this.$set(this.initCartData.to, 'userStr', this.$route.query.type);
      },
    },
    async created() {
      try {
        this.loadingText = "加载中";
        if (this.edit) {
          await this.isEditChange();
        } else {
          await this.noEditCHange();
        }
      } catch (error) {}
      this.loadingText = "";
    }
  };
</script>

<style scoped>
  .g-order-create {
    padding: 0 1%;
  }
  .g-order {
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
    position: relative;
  }
  .marginRight {
    margin-right: 15px;
  }
</style>