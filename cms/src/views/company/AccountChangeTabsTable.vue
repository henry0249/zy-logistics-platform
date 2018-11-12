<template>
  <loading-box v-loading.fullscreen.lock="loadingText" :element-loading-text="loadingText" element-loading-spinner="el-icon-loading">
    <my-table :op="op" opWidth="45" :selection="isInvo" :height="tableHeight" index :loadmore="loadmore" stripe :thead="thead" :data.sync="newData" @selection-change="selectionChange" size="mini" border>
      <div slot="op" class="jc" slot-scope="scope">
        <i style="color:#909399" class="el-icon-view pointer" @click="check(scope)" :title="title"></i>
      </div>
      <div slot-scope="scope">
        <span v-if="payName === 'repulse' && scope.prop === 'text'" class="warning">{{scope.row[scope.prop]}}</span>
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
    <div class="jc jb" style="height:45px;background:#f3f4f5;margin-top:15px;padding:0 15px;" v-if="payName === 'invoice'">
      <div>
        <div style="font-size:13px;" v-if="selectionData.length > 0">已选择待开票数量：
          <span class="warning">{{selectionData.length}}</span>
        </div>
      </div>
      <div class="jc js">
        <div class="marginRight" style="font-size:13px;">可开票总金额：<span class="blue"> {{invoiceTotal}}</span></div>
        <div class="marginRight jc js" style="font-size:13px;">开票金额：
          <my-form-item width="120px" number :min="0" :max="invoiceTotal" v-model="invoiceVal" size="mini"></my-form-item>
        </div>
        <el-button class="marginRight" type="primary" size="mini" @click="distribution">分配</el-button>
        <el-button type="success" size="mini" @click="res">确认开票</el-button>
      </div>
    </div>
  </loading-box>
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
      invoiceTotal: {
        type: Number,
        default: 0
      },
      loadmore: [Function]
    },
    data() {
      return {
        invoiceVal: 0,
        loadingText: '',
        indexData: [],
        newData: [],
        selectionData: [],
      }
    },
    watch: {
      data: {
        handler(val) {
          let value = JSON.parse(JSON.stringify(val));
          this.changData(value);
        },
        deep: true
      }
    },
    computed: {
      title() {
        let data = '点击查看详情';
        if (this.payName === 'repulse') {
          data = '点击查看该被打回发票';
        }
        if (this.payName === 'noCheck' || this.payName === 'invoNoCheck') {
          data = '点击进行审核'
        }
        return data;
      },
      total() {
        let total = 0;
        if (this.selectionData.length > 0) {
          this.selectionData.forEach(item => {
            total += item.invoiceBalance;
          });
        }
        return total;
      },
      op() {
        if (this.isInvo) {
          return this.role.financialManager;
        } else {
          return this.role.financialManager;
        }
      },
      isInvo() {
        return this.payName === 'invoNoCheck' || this.payName === 'repulse';
      },
      tableHeight() {
        if (this.isInvo) {
          return 'calc(100vh - 50px - 70px - 62px - 53px - 40px - 30px - 30px - 37px - 40px - 60px)';
        } else {
          return 'calc(100vh - 50px - 70px - 62px - 53px - 40px - 30px - 30px - 37px - 40px)';
        }
      },
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
        let thead1 = {
          value: {
            name: '金额',
            slot: true
          },
          taxRate: {
            name: '税率',
            readOnly: true,
            slot: true
          },
          type: {
            name: '发票类型',
            slot: true
          },
          company: {
            name: '开票公司',
            slot: true
          },
          toCompany: {
            name: '收方公司',
            slot: true
          },
          'to.account': {
            name: '付款卡号',
            readOnly: true
          },
          'from.account': {
            name: '收款卡号',
            readOnly: true
          },
        };
        if (this.isInvo) {
          if (this.payName === 'repulse') {
            this.$set(thead1, 'text', {
              name: '打回理由',
              slot: true
            })
          }
          return thead1;
        } else {
          return thead;
        }
      },
    },
    methods: {
      distribution() {
        if (this.selectionData.length === 0) {
          this.$message.warn('请先选择开票');
        } else if (this.invoiceVal === 0) {
          this.$message.warn('开票金额不能等于0');
        } else {
          this.indexData = [];
          this.selectionData.forEach(item => {
            this.newData.forEach((newItem, index) => {
              if (newItem._id === item._id) {
                this.indexData.push(index);
              }
            });
          });
          this.recursion(this.invoiceVal, this.indexData);
        }
      },
      recursion(val, data) {
        if (data.length > 0) {
          if (val > 0) {
            let value = val;
            if (this.newData[data[0]].invo <= value) {
              this.$set(this.newData[data[0]], 'invoiceBalance', this.newData[data[0]].invo);
              let newData = [];
              data.forEach(item => {
                if (item !== data[0]) {
                  newData.push(item);
                }
              });
              this.recursion(value - this.newData[data[0]].invo, newData);
            } else {
              this.$set(this.newData[data[0]], 'invoiceBalance', value);
            }
          }
        }
      },
      res() {
        if (this.selectionData.length > 0) {
          this.setInvoice();
        } else {
          this.$message.warn('请先选择开票');
        }
      },
      async setInvoice() {
        try {
          this.loadingText = '开票中';
          let data = [];
          this.indexData.forEach(item => {
            data.push({
              _id: this.newData[item]._id,
              preInvoiced: this.newData[item].invoiceBalance
            });
          });
          await this.$ajax.post('/invoice/set', data);
        } catch (error) {}
        this.loadingText = '';
      },
      resCheck() {
        let canRes = true;
        if (this.total === 0) {
          this.$message.warn('开票金额不能为0');
          return canRes = false;
        }
      },
      selectionChange(val) {
        this.selectionData = val;
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
          if (this.role.financialManager) {
            if (this.payName === 'invoNoCheck' || this.payName === 'repulse') {
              this.goInvoCheck(scope);
            } else {
              this.resMethods(scope, true);
            }
          }
        } else {
          this.resMethods(scope);
        }
      },
      goInvoCheck(scope) {
        let query = {
          show: true,
          payName: this.payName,
          activeName: this.$attrs.activeName
        }
        if (this.payName === 'repulse') {
          query.checkFail = 'financialManager';
        }
        this.$router.push({
          path: '/company/account/invoice_edit/' + scope.row._id,
          query
        })
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
      async getCurdLog(_id) {
        return await this.$ajax.post('/curdLog/findOne', {
          invoice: _id,
          type: 'invoiceCheckFail'
        })
      },
      async changData(val) {
        if (this.isInvo) {
          if (this.payName === 'repulse') {
            let data = [];
            try {
              this.loadingText = '加载中';
              for (let index = 0; index < val.length; index++) {
                let res = await this.getCurdLog();
                let obj = val[index];
                this.$set(obj, 'invo', val[index].balancedSettlement + val[index].balancedPrepaid - val[index].invoiced);
                this.$set(obj, 'invoiceBalance', 0);
                this.$set(obj, 'text', res.remark);
                data.push(obj);
              }
            } catch (error) {}
            this.newData = data;
            this.loadingText = '';
          } else {
            let data = [];
            val.forEach(item => {
              let obj = item;
              this.$set(obj, 'invo', item.balancedSettlement + item.balancedPrepaid - item.invoiced);
              this.$set(obj, 'invoiceBalance', 0);
              data.push(obj);
            });
            this.newData = data;
          }
        } else {
          this.newData = JSON.parse(JSON.stringify(val));
        }
      }
    },
    async created() {
      if (this.data.length > 0) {
        this.changData(this.data);
      }
    }
  }
</script>

<style scoped>
  .marginRight {
    margin-right: 15px;
  }
</style>