<template>
  <div>
    <my-table op v-if="payName && table_js" opWidth="45" :height="tableHeight" :loadmore="loadmore" index stripe :thead="table_js[payName].thead" :data.sync="newData" size="mini" border>
      <div slot="op" class="jc" slot-scope="scope">
        <div class="pointer" @click="check(scope)" :title="table_js[payName].title">
          <icon size="16" color="#909399">icon-caozuo</icon>
        </div>
      </div>
      <div slot-scope="scope">
        <div v-if="scope.prop === 'value'" class="blue">{{scope.row[scope.prop]}}</div>
        <div v-if="scope.prop === 'payUser'">
          {{payUser(scope.row).name}}
          <el-tag size="mini" :type="payUser(scope.row).type">{{payUser(scope.row).typeText}}</el-tag>
        </div>
        <div v-if="scope.prop === 'getUser'">
          {{getUser(scope.row).name}}
          <el-tag size="mini" :type="getUser(scope.row).type">{{getUser(scope.row).typeText}}</el-tag>
        </div>
        <el-tag v-if="!isInvo &&scope.prop === 'type'" size="mini" :type="typeChange(scope.row[scope.prop])">{{field.AccountChange.type.option[scope.row[scope.prop]]}}</el-tag>
        <div v-if="!isInvo && scope.prop === 'remittanceTime'">{{formatTime(scope.row[scope.prop],'YYYY-MM-DD')}}</div>
        <div v-if="!isInvo && scope.prop === 'accountingTime'">{{formatTime(scope.row[scope.prop],'YYYY-MM-DD')}}</div>
        <el-tag v-if="isInvo &&scope.prop === 'type'" size="mini" :type="typeChange(scope.row[scope.prop])">{{field.Invoice.type.option[scope.row[scope.prop]]}}</el-tag>
        <div v-if="isInvo &&scope.prop === 'taxRate'" class="warn">{{scope.row[scope.prop]}}</div>
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
        return this.table_js[this.payName].type === 'isInvoice';
      },
      tableHeight() {
        return 'calc(100vh - 50px - 70px - 138px - 1vh)';
      },
    },
    methods: {
      typeChange(val) {
        let data = {
          0: '',
          1: 'success',
          2: 'info',
          3: 'warning',
          4: 'danger',
        }
        return data[val];
      },
      getUser(val) {
        let data = {
          company: {
            typeText: '公司',
            type: 'success',
            key: 'toCompany'
          },
          user: {
            typeText: '用户',
            type: 'warning',
            key: 'toUser'
          },
          mobile: {
            typeText: '未注册手机',
            type: 'info',
            key: 'toMobile'
          }
        };
        return {
          type: data[val.relationType].type,
          typeText: data[val.relationType].typeText,
          name: val[data[val.relationType].key].name
        }
      },
      payUser(val) {
        let data = {
          company: {
            typeText: '公司',
            type: 'success',
            key: 'company'
          },
          user: {
            typeText: '用户',
            type: 'warning',
            key: 'user'
          },
          mobile: {
            typeText: '未注册手机',
            type: 'info',
            key: 'mobile'
          }
        };
        return {
          type: data[val.relationType].type,
          typeText: data[val.relationType].typeText,
          name: val[data[val.relationType].key].name
        }
      },
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
        console.log(scope);
        let query = {
          activeName: this.activeName,
          payName: this.payName,
          show: 'true',
          relationType: scope.row.relationType,
          toUserType: scope.row.toType,
          titleType: this.table_js[this.payName].type,
          // type: this.table_js[this.payName].type === 'isReceive' ? scope.row.type
        }
        if (this.isInvo) {
          query.type = scope.row.type;
        } else {
          if (scope.row.type === 1) {
            query.type = '5';
          } else if (scope.row.type === 4) {
            query.type = '6';
          }
        }
        this.$router.push({
          path: '/company/account/account_edit/' + scope.row._id,
          query
        });
      }
    },
    created() {
      this.newData = JSON.parse(JSON.stringify(this.data));
      console.log(this.newData);
    }
  }
</script>

<style scoped>

</style>