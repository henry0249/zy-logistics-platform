<template>
  <loading-box v-model="loadingText">
    <el-tabs v-if="newData.length > 0" v-model="activeName" @tab-click="tabClick">
      <el-tab-pane v-for="item in newData" :name="item._id" :key="item.id" :label="item.isUser?item.name + '(个人)' : item.name">
        <div class="col-flex tab-height">
          <div class="tab-top jc jb" style="margin:15px 0;">
            <div class="jc js">
              <span>结算款：<span style="margin-right:30px;" class="blue">{{item.value}}</span> 预付款：<span class="danger">{{item.prepaid}}</span></span>
              <div class="marginRight" style="font-size:13px;margin:0 30px;">可开票总金额：<span class="blue"> {{item.waitingForInvoice.total}}</span></div>
              <el-button :disabled="item.waitingForInvoice.total === 0" type="success" size="mini" @click="setInvoice">去开票</el-button>
            </div>
            <div class="js">
              <el-button @click="go('5',activeName)" size="mini">收款</el-button>
              <el-button @click="go('6',activeName)" size="mini">预收款</el-button>
            </div>
          </div>
          <el-tabs v-model="payName" type="card" @tab-click="tabPayClick">
            <el-tab-pane v-for="(v,i) in payArr" :name="v.type" :key="`${i}pay`">
              <div slot="label">
                {{v.name}}
                <el-badge :value="badge(v)" />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div v-else class="tab-height noData jc">
      <span>未发现账户，你可以<el-button style="margin:0 10px;" plain size="mini" type="primary" @click="go('5')">收款</el-button>或者<el-button plain size="mini" @click="go('6')">预收款</el-button></span>
    </div>
    <Account-change-tabs-table :isUser="isUser" v-if="!loadingText && newData.length > 0" :activeName="activeName" :data="tableData" :payName="payName"></Account-change-tabs-table>
  </loading-box>
</template>

<script>
  import AccountChangeTabsTable from './AccountChangeTabsTable.vue';
  export default {
    components: {
      AccountChangeTabsTable
    },
    props: {
      data: {
        type: Array,
        default () {
          return [];
        }
      },
    },
    data() {
      return {
        activeName: '',
        loadingText: '',
        payName: '',
        str: '',
        show: false,
        invoiceTotal: 0,
        newData: [],
        tableData: [],
        obj: {},
        payArr: [],
      }
    },
    watch: {
      show(val) {
        console.log('show', val);
      },
      tableArr: {
        handler(val) {
          console.log(val);
        },
        deep: true
      },
    },
    computed: {},
    methods: {
      setInvoice() {
        this.$router.push({
          path: '/company/account/invoice',
          query: {
            show: 'true',
            _id: this.obj[this.activeName]._id,
            total: this.obj[this.activeName].waitingForInvoice.total,
            name: this.obj[this.activeName].name,
            type: this.obj[this.activeName].isUser ? 'user' : 'company',
          }
        })
      },
      res(scope, check) {
        if (scope.row.check) {
          if (this.role.financialManager) {
            this.resMethods(scope);
          }
        } else {
          if (this.role.financialManager || this.role.settle) {
            this.resMethods(scope);
          }
        }
      },
      badge(val) {
        let data = {
          receivedCheck: val.count,
          receivedEditCheck: val.count,
          invoiceEditCheck: val.count,
          invoiceCheck: val.count,
        };
        return data[val.type] ? data[val.type] : undefined;
      },
      go(key, val) {
        this.show = false;
        let query = {
          type: key,
          show: true
        }
        if (val) {
          this.$set(query, 'company', val);
        }
        this.$router.push({
          path: "/company/account/account_change_type",
          query
        });
      },
      async tabPayClick(val) {
        try {
          this.loadingText = '加载中';
          this.tableData = [];
          await this.getAllTab(val.name);
          this.tableData = this.payArr[val.index].list;
        } catch (error) {}
        this.loadingText = '';
      },
      async tabClick(val) {
        if (val.label.substr(val.label.length - 5, 4) === "(个人)") {
          this.isUser = true;
        } else {
          this.isUser = false;
        }
        await this.getData();
      },
      async getData() {
        try {
          this.loadingText = '加载中';
          await this.getAccount();
          await this.getAllTab();
          this.payName = this.payArr[0].type;
          this.tableData = this.payArr[0].list;
          if (this.activeName) {
            this.obj = {};
            this.newData.forEach(item => {
              this.$set(this.obj, item._id, item);
            });
            this.$store.dispatch('getRole', this.company._id);
          }
        } catch (error) {}
        this.loadingText = '';
      },
      async getAllTab(type) {
        let data = {
          company: this.company._id,
        }
        if (this.isUser) {
          data.relationType = 'user';
          data.relationUser = this.activeName;
        } else {
          data.relationType = 'company';
          data.relationCompany = this.activeName;
        }
        if (type) {
          data.listType = type;
        };
        this.payArr = await this.$ajax.post('/account/relation/list', data);
      },
      async getAccount() {
        this.newData = await this.$ajax.post('/account/relation/tab', {
          company: this.company._id
        });
        this.activeName = this.newData[0]._id;
        this.isUser = this.newData[0].isUser ? this.newData[0].isUser : false;
      },
    },
    async created() {
      await this.getData();
    }
  }
</script>

<style scoped>

</style>