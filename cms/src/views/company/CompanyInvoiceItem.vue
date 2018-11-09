<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>开发票</strong>
        </div>
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane v-for="item in newData" :name="item._id" :key="item.id" :label="item.userType === 'company'?item.name : item.name + '(个人)'"></el-tab-pane>
        </el-tabs>
        <company-invoice-table v-if="!loadingText" :loadmore="loadmore" :data="tableData" :invoiceTotal="invoiceTotal"></company-invoice-table>
        <bank-cart :data.sync="cartData" :initData="initCartData" style="width:100%" :key="1"></bank-cart>
        <!-- <company-invoice-cart :data.sync="cartData"></company-invoice-cart> -->
      </div>
      <div class="tr jb" style="margin:30px 0 15px 0">
        <div>
          <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        </div>
        <el-button size="small" type="primary" @click="sub">添 加</el-button>
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
    },
    data() {
      return {
        loadingText: '',
        invoiceTotal: 0,
        activeName: '',
        tableHeight: 'calc(100vh - 50px - 70px - 62px - 53px - 40px - 60px - 77px)',
        tableData: [],
        newData: [],
        indexData: [],
        res: [],
        cartData: {},
        initCartData: {
          value: 0,
          from: {
            bank: '',
            bankName: '',
            account: '',
            type: '',
            remark: ''
          },
          to: {
            bank: '',
            bankName: '',
            account: '',
            type: '',
            remark: ''
          },
          remittanceTime: '',
          accountingTime: '',
          toCompany: {},
          company: {}
        }
      }
    },
    watch: {
      tableData: {
        handler(val) {
          console.log(val);
        },
        deep: true
      },
    },
    computed: {
      thead() {
        let thead = {
          balancedSettlement: {
            name: '已用结算款结算金额',
          },
          balancedPrepaid: {
            name: '已用预付款结算金额',
          },
          invoiced: {
            name: '已开票金额',
            slot: true
          },
          invo: {
            name: '可开票金额',
            slot: true
          },
          invoiceBalance: {
            name: '选择开票金额',
            slot: true
          },
          company: {
            name: '支付方',
            slot: true,
            readOnly: true
          },
          receivedCompany: {
            name: '收款方',
            readOnly: true,
            slot: true
          },
        };
        return thead;
      }
    },
    methods: {
      async getTotal() {
        let res = await this.$ajax.post('/businessTrains/invoice/summary', {
          company: this.company._id
        });
        this.invoiceTotal = res.total;
      },
      async tabClick(val) {
        try {
          this.loadingText = '加载中';
          await this.getTotal();
          this.tableData = [];
          this.tableData = await this.getInvoice();
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
      sub() {},
      async loadmore() {
        return await this.getInvoice();
      },
      async getInvoice() {
        try {
          return await this.$ajax.post('/businessTrains/invoice/list', {
            company: this.company._id,
            limit: 10,
            skip: this.tableData.length,
            populate: [{
              path: 'company'
            }, {
              path: 'user'
            }, {
              path: 'receivedCompany'
            }]
          })
        } catch (error) {}
      },
    },
    async created() {
      try {
        this.loadingText = '加载中';
        this.newData = JSON.parse(JSON.stringify(this.accountData));
        this.activeName = this.newData[0]._id;
        this.tableData = await this.getInvoice();
      } catch (error) {}
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