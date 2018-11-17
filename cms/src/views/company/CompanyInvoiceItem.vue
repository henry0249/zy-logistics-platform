<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>{{title}}</strong>
        </div>
        <common-alert style="margin:15px 0">发票信息</common-alert>
        <bank-cart v-if="!loadingText" isInvoice style="margin-top:15px;width:100%" :data.sync="cartData" :initData="initCartData"></bank-cart>
        <common-alert style="margin:15px 0">关联运单或订单</common-alert>
        <company-invoice-table v-if="!loadingText" :isInvoice="isInvoice" :selection.sync="selection" :edit="edit" :data.sync="tableData" :initData="tableInitData" :invoiceTotal="invoiceTotal" :isCheck.sync="isCheck" :invoiceValue.sync="invoiceValue"></company-invoice-table>
      </div>
      <div class="jb" style="margin:30px 0 15px 0">
        <div>
          <el-button v-if="edit && !isCheckFail && $route.query.payName !== 'invoice'" size="small" type="danger" @click="repulse">打回发票</el-button>
          <el-button v-if="edit && isCheckFail && $route.query.payName !== 'invoice'" size="small" type="danger" @click="delInvoice">删除发票</el-button>
        </div>
        <div class="jc js">
          <el-button size="small" @click="$router.go(-1)">返 回</el-button>
          <el-button size="small" type="primary" @click="sub">{{subText}}</el-button>
        </div>
      </div>
    </div>
  </loading-box>
</template>

<script>
  import CompanyInvoiceTable from "./CompanyInvoiceTable.vue";
  export default {
    components: {
      CompanyInvoiceTable,
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
        isCheck: false,
        tableData: [],
        tableInitData: [],
        selection: [],
        cartData: {},
        arr: {},
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
      selection: {
        handler(val) {
          let data = 0
          if (this.selection.length > 0) {
            this.selection.forEach(item => {
              data += item.invoiceBalance || 0;
            });
          }
          console.log(data);
          this.$set(this.initCartData, 'value', data);
        },
        deep: true
      },
      value(val) {
        console.log(val);
      }
    },
    computed: {
      value() {
        let data = 0
        if (this.selection.length > 0) {
          this.selection.forEach(item => {
            data += item.invoiceBalance || 0;
          });
        }
        return data;
      },
      isInvoice() {
        return this.edit && this.$route.query.payName === 'invoice';
      },
      invoiceTotal() {
        let data = 0;
        if (!this.edit) {
          data = this.arr.total;
        } else {
          this.tableInitData.forEach(item => {
            data += item.invoiceBalance;
          });
        }
        return data;
      },
      subText() {
        let data = "开发票";
        if (this.edit) {
          if (this.$route.query.checkFail === "financialManager") {
            data = "回退发票";
          } else if (this.isInvoice) {
            data = '修改'
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
          if (this.$route.query.payName !== 'invoice') {
            data = "审核发票";
          } else {
            data = "发票详情";
          }
        }
        return data;
      },
      isCheckFail() {
        return this.$route.query.checkFail === "financialManager";
      },
    },
    methods: {
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
            this.postInvoice('set');
          }
        } else {
          if (this.$route.query.checkFail === "financialManager") {
            this.postInvoice('checkFail');
          } else if (this.isInvoice) {
            this.postInvoice('update');
          } else {
            if (this.checkMethods()) {
              this.postInvoice('check');
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
        if (this.selection.length === 0 && !this.edit) {
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
        this.$prompt('请输入审核错误原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async({
          value
        }) => {
          await this.repulseInvoice(value);
        }).catch(() => {});
      },
      goback(text) {
        this.$message.success(text);
        this.$router.push({
          path: "/company/account"
        });
      },
      async repulseInvoice(value) {
        try {
          this.loadingText = "打回中";
          await this.$ajax.post("/invoice/checkFail", {
            ...this.invoiceData,
            text: value
          });
          this.goback("打回成功");
        } catch (error) {}
        this.loadingText = "";
      },
      async postInvoice(type) {
        try {
          let typeObj = {
            set: {
              loadingText: '添加中',
              cartData: this.cartData,
              successText: '添加成功',
              path: '/invoice/set'
            },
            check: {
              loadingText: '审核中',
              successText: '审核成功',
              path: '/invoice/check'
            },
            update: {
              loadingText: '更新中',
              cartData: this.cartData,
              successText: '更新成功',
              path: '/invoice/update'
            },
            checkFail: {
              loadingText: '回退中',
              cartData: this.initCartData,
              path: '/invoice/update',
              successText: '回退成功',
            }
          }
          this.loadingText = typeObj[type].loadingText;
          let data = {};
          if (type === 'check') {
            data = { ...this.invoiceData
            };
          } else {
            if (type !== 'set') {
              data._id = this.invoiceData._id;
            }
            let cartData = typeObj[type].cartData;
            data = Object.assign({}, data, {
              value: cartData.value,
              type: cartData.type,
              taxRate: cartData.taxRate,
              to: cartData.to,
              from: cartData.from,
              toType: this.$route.query.type,
              company: this.company._id,
              contactNumber: cartData.contactNumber,
              address: cartData.address,
              billingDate: cartData.billingDate
            })
            if (this.$route.query.type === 'company') {
              data.toCompany = this.$route.query.activeName || this.$route.query._id;
            } else {
              data.toUser = this.$route.query.activeName || this.$route.query._id;
            }
            let settleRelation = [];
            if (type === 'set' || type === 'update') {
              this.selection.forEach(item => {
                let obj = {
                  dataType: item.isBusinessTrains ? 'businessTrains' : 'logistics',
                  invoiced: item.invoiceBalance,
                  modelType: 'invoice'
                };
                obj[obj.dataType] = item._id;
                settleRelation.push(obj);
              });
              data.settleRelation = settleRelation;
            } else {
              data.settleRelation = this.invoiceData.settleRelation;
            }
          }
          await this.$ajax.post(typeObj[type].path, data);
          this.goback(typeObj[type].successText);
        } catch (error) {}
        this.loadingText = "";
      },
      async getInvoice() {
        let data = {
          company: this.company._id,
          relationType: this.$route.query.type,
        };
        if (this.$route.query.type === 'user') {
          data.relationUser = this.$route.query._id;
        } else {
          data.relationCompany = this.$route.query._id;
        }
        this.arr = await this.$ajax.post("/account/relation/waiting_for_invoice", data);
        this.tableInitData = this.arr.list;
      },
      async getUser(type) {
        let path = type === 'user' ? '/user/findOne' : '/company/findOne';
        let key = type === 'user' ? 'toUser' : 'toCompany';
        let res = await this.$ajax.post(path, {
          _id: this.$route.query._id
        });
        this.$set(this.initCartData, key, res);
      },
      async isEditChange() {
        this.tableInitData = this.invoiceData.settleRelation;
        for (const key in this.initCartData) {
          if (this.invoiceData[key]) {
            this.$set(this.initCartData, key, this.invoiceData[key]);
          }
        }
        if (this.invoiceData.toType === 'company') {
          this.$set(this.initCartData, 'toCompany', this.invoiceData.toCompany);
        } else {
          this.$set(this.initCartData, 'toUser', this.invoiceData.toUser);
        }
        console.log(this.tableInitData);
      },
      async noEditCHange() {
        await this.getInvoice();
        this.$set(this.initCartData, 'billingDate', new Date());
        this.$set(this.initCartData.to, 'recordDate', new Date());
        this.$set(this.initCartData.to, 'userStr', this.$route.query.type);
        await this.getUser(this.$route.query.type);
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
        this.$set(this.initCartData, 'company', this.company);
        this.$set(this.initCartData, 'value', 0);
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