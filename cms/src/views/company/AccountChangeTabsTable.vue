<template>
  <my-table op opWidth="45" height="calc(100vh - 50px - 70px - 62px - 53px - 40px - 30px - 30px - 37px - 40px)" index :loadmore="loadmore" stripe :thead="thead" :data.sync="data" size="mini" border>
    <div slot="op" class="jc" slot-scope="scope">
      <i style="color:#909399" class="el-icon-view pointer" @click="check(scope)" :title="payName === 'noCheck'?'点击进行审核':'点击查看详情'"></i>
    </div>
    <div slot-scope="scope">
      <el-tag size="mini" v-if="scope.prop === 'type'" :type="typeOption(scope.row[scope.prop])">{{field.AccountChange.type.option[scope.row[scope.prop]]}}</el-tag>
      <div v-if="scope.prop === 'payUser'">{{payUser(scope.row).user}}
        <el-tag size="mini" :type="payUser(scope.row).type">{{field.AccountChange.payUserType.option[scope.row.payUserType]}}</el-tag>
      </div>
      <div v-if="scope.prop === 'getUser'">{{getUser(scope.row).user}}
        <el-tag size="mini" :type="getUser(scope.row).type">{{field.AccountChange.payUserType.option[scope.row.payUserType]}}</el-tag>
      </div>
      <div v-if="scope.prop === 'value'" class="blue">{{scope.row[scope.prop]}}</div>
    </div>
  </my-table>
</template>

<script>
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
      loadmore: [Function]
    },
    data() {
      return {}
    },
    computed: {
      thead() {
        let thead = {
          value: {
            name: '金额',
            readOnly: true,
            slot: true
          },
          type: {
            name: '类型',
            slot: true,
            width: 70
          },
          payUser: {
            name: '付款方',
            slot: true
          },
          'to.account': {
            name: '付款卡号',
            readOnly: true
          },
          getUser: {
            name: '收款方',
            slot: true
          },
          'from.account': {
            name: '收款卡号',
            readOnly: true
          },
          remittanceTime: {
            name: '转账日期',
            readOnly: true
          },
          accountingTime: {
            name: '到账日期',
            readOnly: true
          },
        };
        return thead;
      },
    },
    methods: {
      check(scope) {
        if (!scope.row.check) {
          if (this.role.financialManager) {
            this.resMethods(scope, true);
          }
        } else {
          this.resMethods(scope);
        }
      },
      resMethods(scope, check) {
        let type = scope.row.type;
        if (this.payName === 'get' || this.payName === 'noCheck') {
          if (scope.row.type === 1) {
            type = '5';
          } else if (scope.row.type === 4) {
            type = '6';
          }
        };
        this.$router.push({
          path: '/company/account/account_edmit/' + scope.row._id,
          query: {
            type,
            check: check ? true : false,
            show: true,
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
    }
  }
</script>

<style scoped>

</style>