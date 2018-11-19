<template>
  <div>
    <my-table op v-if="payName && table_js" opWidth="45" :height="tableHeight" :loadmore="loadmore" index stripe :thead="table_js[payName].thead" :data.sync="newData" size="mini" border>
      <div slot="op" class="jc" slot-scope="scope">
        <div class="pointer" @click="check(scope)" :title="table_js[payName].title">
          <icon size="16" color="#909399">icon-caozuo</icon>
        </div>
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
  </div>
</template>

<script>
  import table_js from './CompanyAccount.js';
  export default {
    props: {
      payName: {
        type: String,
        default: ''
      },
      activeName: {
        type: String,
        default: ''
      },
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      isUser: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        table_js,
        newData: [],
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
        return await this.getData();
      },
      async getData() {
        let data = {
          company: this.company._id,
          limit: 10,
          onlyList: true,
          listType: this.payName,
          skip: this.newData.length
        }
        if (this.isUser) {
          data.relationType = 'user';
          data.relationUser = this.activeName;
        } else {
          data.relationType = 'company';
          data.relationCompany = this.activeName;
        };
        return await this.$ajax.post('/account/relation/list', data);
      },
      check(scope) {
        this.$router.push({
          path: '/company/account/all/' + scope.row._id,
          query: {
            payName: this.payName,
            activeName: this.activeName,
            show: 'true',
            titleType: this.table_js[this.payName].type,
            check: scope.row.check
          }
        })
        // if (!scope.row.check) {
        //   if (this.table_js[this.payName].type === 'invoice') {
        //     this.goInvoCheck(scope);
        //   } else {
        //     this.resMethods(scope, true);
        //   }
        // } else {
        //   if (this.table_js[this.payName].type === 'invoice') {
        //     this.goInvoCheck(scope);
        //   } else {
        //     this.resMethods(scope);
        //   }
        // }
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
    },
    created() {
      this.newData = JSON.parse(JSON.stringify(this.data));
    }
  }
</script>

<style scoped>

</style>