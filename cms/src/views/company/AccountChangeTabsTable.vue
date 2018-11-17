<template>
  <loading-box v-loading.fullscreen.lock="loadingText" :element-loading-text="loadingText" element-loading-spinner="el-icon-loading">
    <my-table op v-if="payName && table_js" opWidth="45" :selection="isInvo" :height="tableHeight" index :loadmore="loadmore" stripe :thead="table_js[payName].thead" :data.sync="newData" size="mini" border>
      <div slot="op" class="jc" slot-scope="scope">
        <i style="color:#909399" class="el-icon-view pointer" @click="check(scope)" :title="table_js[payName].title"></i>
      </div>
      <div slot-scope="scope">
        <span v-if="payName === 'invoiceEditCheck' && scope.prop === 'text'" class="warning">{{scope.row[scope.prop]}}</span>
        <span v-if="isInvo && scope.prop === 'taxRate'" class="warning">{{scope.row[scope.prop]}}</span>
        <div v-if="isInvo && scope.prop === 'company'">{{scope.row[scope.prop].name}}
          <el-tag size="mini" type="warning">公司</el-tag>
        </div>
        <div v-if="isInvo && scope.prop === 'toCompany'">{{changUser(scope).name}}
          <el-tag size="mini" :type="changUser(scope).type">{{changUser(scope).userType}}</el-tag>
        </div>
        <el-tag size="mini" v-if="isInvo && scope.prop === 'type'" :type="typeOption(scope.row[scope.prop])">{{field.Invoice.type.option[scope.row[scope.prop]]}}</el-tag>
        <el-tag size="mini" v-if="!isInvo && scope.prop === 'type'" :type="typeOption(scope.row[scope.prop])">{{field.AccountChange.type.option[scope.row[scope.prop]]}}</el-tag>
        <div v-if="!isInvo && scope.prop === 'payUser'">{{payUser(scope.row).user}}
          <el-tag size="mini" :type="payUser(scope.row).type">{{field.AccountChange.payUserType.option[scope.row.payUserType]}}</el-tag>
        </div>
        <div v-if="!isInvo && scope.prop === 'getUser'">{{getUser(scope.row).user}}
          <el-tag size="mini" :type="getUser(scope.row).type">{{field.AccountChange.payUserType.option[scope.row.payUserType]}}</el-tag>
        </div>
        <div v-if="scope.prop === 'value'" class="blue">{{scope.row[scope.prop]}}</div>
      </div>
    </my-table>
  </loading-box>
</template>

<script>
  import table_js from './AccountChangeTabsTable.js';
  export default {
    props: {
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      payName: {
        type: String,
        default: ''
      },
      invoiceTotal: {
        type: Number,
        default: 0
      },
    },
    data() {
      return {
        invoiceVal: 0,
        table_js,
        loadingText: '',
        indexData: [],
        newData: [],
        selectionData: [],
      }
    },
    computed: {
      isInvo() {
        return this.payName === 'invoiceEditCheck' || this.payName === 'invoiceCheck' || this.payName === 'invoice';
      },
      tableHeight() {
        return 'calc(100vh - 50px - 70px - 138px - 1vh)';
      },
    },
    methods: {
      async loadmore() {
        return await this.getList();
      },
      async getList() {
        return await this.$ajax.post('/account/relation/list', {
          company: this.company._id,
          relationType: 'company',
          relationCompany: this.$attrs.activeName,
          onlyList: true,
          listType: this.payName,
          skip: this.newData.length
        });
      },
      changUser(scope) {
        let op = {
          user: {
            name: scope.row.toUser ? scope.row.toUser.name : '',
            type: 'success',
            userType: '用户'
          },
          company: {
            name: scope.row.toCompany ? scope.row.toCompany.name : '',
            type: 'warning',
            userType: '公司'
          },
          mobile: {
            name: scope.row.toMobile ? scope.row.toMobile : '',
            type: undefined,
            userType: '手机号'
          }
        }
        return op[scope.row.toType];
      },
      check(scope) {
        if (!scope.row.check) {
          if (this.table_js[this.payName].type === 'invoice') {
            this.goInvoCheck(scope);
          } else {
            this.resMethods(scope, true);
          }
        } else {
          if (this.table_js[this.payName].type === 'invoice') {
            this.goInvoCheck(scope);
          } else {
            this.resMethods(scope);
          }
        }
      },
      goInvoCheck(scope) {
        let query = {
          show: 'true',
          payName: this.payName,
          activeName: this.$attrs.activeName,
          type: this.$attrs.isUser?'user':'company'
        }
        if (this.payName === 'invoiceEditCheck') {
          query.checkFail = 'financialManager';
        }
        this.$router.push({
          path: '/company/account/invoice_edit/' + scope.row._id,
          query
        })
      },
      resMethods(scope, check) {
        this.$router.push({
          path: '/company/account/account_edmit/' + scope.row._id,
          query: {
            type: scope.row.type,
            check: check ? 'true' : 'false',
            show: 'true',
            payName: this.payName
          }
        })
      },
      getUser(val) {
        let data = {};
        if (val.payUserType === 'user') {
          this.$set(data, 'user', val.toUser.name);
          this.$set(data, 'type', 'info');
        } else if (val.payUserType === 'company') {
          this.$set(data, 'user', val.toCompany.name);
          this.$set(data, 'type', 'success');
        } else {
          data = val.mobile;
          this.$set(data, 'user', val.mobile);
          this.$set(data, 'type', 'warning');
        }
        return data;
      },
      payUser(val) {
        let data = {};
        if (val.payUserType === 'user') {
          this.$set(data, 'user', val.user.name);
          this.$set(data, 'type', 'info');
        } else if (val.payUserType === 'company') {
          this.$set(data, 'user', val.company.name);
          this.$set(data, 'type', 'success');
        } else {
          data = val.mobile;
          this.$set(data, 'user', val.mobile);
          this.$set(data, 'type', 'warning');
        }
        return data;
      },
      typeOption(val) {
        let data = {
          0: '',
          1: 'success',
          2: 'info',
          3: 'warning',
          4: 'danger',
        };
        return data[val];
      },
      async getCurdLog(_id, val) {
        let data = {
          invoiceEditCheck: {
            op: {
              invoice: _id,
              type: 'invoiceCheckFail'
            },
          },
          receivedEditCheck: {
            op: {
              type: 'accountChangeCheckFail',
              accountChange: _id
            }
          }
        }
        return await this.$ajax.post('/curdLog/findOne', data[val].op);
      },
    },
    async created() {
      let data = [];
      for (let index = 0; index < this.data.length; index++) {
        try {
          this.loadingText = '加载中';
          let obj = this.data[index];
          if (this.payName === 'receivedEditCheck' || this.payName === 'invoiceEditCheck') {
            let res = await this.getCurdLog(this.data[index]._id, this.payName);
            this.$set(obj, 'text', res.remark);
          }
          data.push(obj);
        } catch (error) {}
      }
      this.newData = data;
      this.loadingText = '';
    }
  }
</script>

<style scoped>
  .marginRight {
    margin-right: 15px;
  }
</style>