<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>{{title}}</strong>
        </div>
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane :disabled="disabled(item._id)" v-for="item in newData" :name="item._id" :key="item.id" :label="item.isUser?item.name + '(个人)' : item.name"></el-tab-pane>
        </el-tabs>
        <company-invoice-table v-if="!loadingText" :edit="edit" :data.sync="tableData" :initData="tableInitData" :invoiceTotal="invoiceTotal" :isCheck.sync="isCheck" :invoiceValue.sync="invoiceValue"></company-invoice-table>
        <bank-cart v-if="!loadingText && show" isInvoice style="margin-top:15px;width:100%" :data.sync="cartData" :initData="initCartData" :key="1"></bank-cart>
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
  import CompanyInvoiceTable from './CompanyInvoiceTable.vue';
  import CompanyInvoiceCart from './CompanyInvoiceCart.vue';
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
      accountData: {
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
      },
    },
    data() {
      return {
        loadingText: '',
        input: '',
        invoiceTotal: 0,
        invoiceValue: 0,
        index: 0,
        show: true,
        isCheck: false,
        dialogVisible: false,
        activeName: '',
        tableHeight: 'calc(100vh - 50px - 70px - 62px - 53px - 40px - 60px - 77px)',
        tableData: [],
        tableInitData: [],
        newData: [],
        indexData: [],
        res: [],
        cartData: {},
        initCartData: {
          value: 0,
          from: {
            name: '',
            bank: '',
            bankName: '',
            account: '',
            type: '',
            remark: '',
            disabled: true
          },
          to: {
            name: '',
            bank: '',
            bankName: '',
            account: '',
            type: '',
            remark: '',
            disabled: true
          },
          recordDate: '',
          openDate: '',
          toCompany: {},
          company: {},
          type: 0,
          taxRate: 0,
        }
      }
    },
    watch: {
      invoiceValue(val) {
        this.$set(this.initCartData, 'value', val);
      }
    },
    computed: {
      subText() {
        let data = '开发票'
        if (this.edit) {
          if (this.$route.query.checkFail === 'financialManager') {
            data = '回退发票';
          } else {
            data = '审核成功';
          }
        }
        return data;
      },
      title() {
        let data = '开发票';
        if (this.$route.query.checkFail === 'financialManager') {
          data = '被打回发票'
        } else if (this.edit) {
          data = '审核发票';
        }
        return data;
      },
      isCheckFail() {
        return this.$route.query.checkFail === 'financialManager'
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
      disabled(name) {
        if (this.edit) {
          if (name === this.activeName) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      },
      async tabClick(val) {
        this.index = val.index;
        try {
          this.loadingText = '加载中';
          this.tableInitData = [];
          await this.getInvoice();
          await this.getCompany();
        } catch (error) {}
        this.loadingText = '';
      },
      changUser(scope) {
        let data = {
          name: '',
          type: '',
          userType: ''
        };
        data = Object.assign({}, data, {
          name: scope.row.receivedCompany.name,
          userType: '公司',
          type: 'warning',
        })
        return data;
      },
      async delInvoice() {
        try {
          this.loadingText = '删除中';
          await this.$ajax.post('/invoice/delete', {
            _id: this.$route.params._id
          })
          this.goback('删除成功');
        } catch (error) {}
        this.loadingText = '';
      },
      async sub() {
        if (!this.edit) {
          this.setInvoice('set');
        } else {
          if (this.$route.query.checkFail === 'financialManager') {
            this.setInvoice('update');
          } else {
            this.editInvoice();
          }
        }
      },
      repulse() {
        this.dialogVisible = true
      },
      goback(text) {
        this.$message.success(text);
        this.$router.push({
          path: '/company/account'
        })
      },
      async repulseInvoice() {
        this.dialogVisible = false;
        try {
          this.loadingText = '打回中';
          await this.$ajax.post('/invoice/checkFail', { ...this.invoiceData,
            text: this.input
          });
          this.goback('打回成功');
        } catch (error) {}
        this.loadingText = '';
      },
      async editInvoice() {
        try {
          this.loadingText = '发票审核中';
          await this.$ajax.post('/invoice/check', this.invoiceData);
          this.goback('审核成功');
        } catch (error) {}
        this.loadingText = '';
      },
      async setInvoice(type) {
        try {
          this.loadingText = type === 'set' ? '添加中' : '回退中';
          let data = {
            value: this.initCartData.value,
            type: this.initCartData.type,
            taxRate: this.initCartData.taxRate,
            to: this.initCartData.to,
            from: this.initCartData.from,
            toType: this.newData.isUser ? 'user' : 'company',
            company: this.company._id,
            contactNumber: this.initCartData.contactNumber || '448828292',
            address: this.initCartData.address || '5b18ff4b7e4da9b84b7e917e',
            billingDate: this.initCartData.billingDate || new Date(),
          };
          if (this.newData.isUser) {
            data.toUser = this.activeName;
          } else {
            data.toCompany = this.activeName;
          }
          let businessTrainsArr = [];
          let logisticsArr = [];
          if (type === 'set') {
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
                })
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
          let path = '/invoice/set'
          if (type === 'update') {
            path = '/invoice/update';
          };
          await this.$ajax.post(path, data);
          this.goback(`${type === 'set'?'开发票成功':'回退成功'}`);
        } catch (error) {}
        this.loadingText = '';
      },
      async getInvoice() {
        let data = {
          fromCompany: this.company._id,
          limit: 0,
        }
        if (this.newData[this.index].isUser) {
          data.toUser = this.activeName;
          data.toType = 'user';
        } else {
          data.toCompany = this.activeName;
          data.toType = 'company';
        }
        this.tableInitData = await this.$ajax.post('/invoice/wait/list', data);
        let invoiceTotal = 0;
        this.tableInitData.forEach(item => {
          invoiceTotal += item.balancedSettlement + item.balancedPrepaid - item.preInvoiced - item.invoiced;
        });
        this.invoiceTotal = invoiceTotal;
      },
      async getCompany() {
        let res = await this.$ajax.post('/company/findOne', {
          _id: this.activeName
        });
        this.$set(this.initCartData, 'toCompany', res);
      },
      async getBusinessTrains() {
        let data = [];
        for (let index = 0; index < this.invoiceData.businessTrainsArr.length; index++) {
          let res = await this.$ajax.post('businessTrains/findOne', {
            _id: this.invoiceData.businessTrainsArr[index]._id
          });
          if (res) {
            this.$set(res, 'invoiceBalance', this.invoiceData.businessTrainsArr[index].preInvoiced);
            data.push(res);
          }
        }
        this.tableInitData = data;
        let invoiceTotal = 0;
        this.tableInitData.forEach(item => {
          invoiceTotal += item.balancedSettlement + item.balancedPrepaid - item.preInvoiced - item.invoiced;
        });
        this.invoiceTotal = invoiceTotal;
      }
    },
    async created() {
      this.newData = JSON.parse(JSON.stringify(this.accountData));
      this.activeName = this.$route.query.activeName ? this.$route.query.activeName : this.newData[0]._id;
      try {
        this.loadingText = '加载中';
        if (!this.edit) {
          await this.getInvoice();
        } else {
          await this.getBusinessTrains();
        }
        await this.getCompany();
      } catch (error) {
        console.log(error);
      }
      if (Object.keys(this.invoiceData).length > 0) {
        let num = 0;
        this.invoiceData.businessTrainsArr.forEach(item => {
          num += item.preInvoiced;
        });
        this.invoiceData.logisticsArr.forEach(item => {
          num += item.preInvoiced;
        });
        this.$set(this.initCartData, 'value', num);
      }
      if (!this.edit) {
        this.$set(this.initCartData, 'recordDate', new Date());
      }
      this.$set(this.initCartData, 'company', this.company);
      if (this.newData[0].isUser) {
        this.$set(this.initCartData.to, 'userStr', 'user');
      } else {
        this.$set(this.initCartData.to, 'userStr', 'company');
      }
      this.loadingText = '';
    }
  }
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