<template>
  <loading-box v-loading.fullscreen.lock="loadingText" :element-loading-text="loadingText" element-loading-spinner="el-icon-loading">
    <my-table :selection="select" :max-height="tableHeight" index stripe :thead="thead" :data.sync="newData" @selection-change="selectionChange" size="mini" border>
      <div slot-scope="scope">
        <span v-if="scope.prop === 'invoiced'" class="blue">{{$attrs.isInvoice?scope.row[scope.prop] -scope.row.invoiceBalance :scope.row[scope.prop]}}</span>
        <span v-if="scope.prop === 'invo'" class="warning">{{$attrs.isInvoice?invo(scope.row) + initData[scope.index].invoiceBalance:invo(scope.row)}}</span>
        <my-form-item :disabled="!select" v-if="scope.prop === 'invoiceBalance'" number :min="0" :max="scope.row.balancedSettlement + scope.row.balancedPrepaid" v-model="scope.row[scope.prop]" size="mini"></my-form-item>
        <!-- <div v-if="scope.prop === 'company'">{{scope.row[scope.row.customerType].name}}
                                <el-tag size="mini" :type="scope.row.customerType === 'user'?'success':'warning'">{{scope.row.customerType === 'user'?'用户':'公司'}}</el-tag>
                              </div>
                              <div v-if="scope.prop === 'receivedCompany'">{{changUser(scope).name}}
                                <el-tag size="mini" :type="changUser(scope).type">{{changUser(scope).userType}}</el-tag>
                              </div> -->
      </div>
    </my-table>
    <div class="jc jb" style="height:45px;background:#f3f4f5;margin-top:15px;padding:0 15px;">
      <div>
        <div style="font-size:13px;" v-if="selectionChangeData.length > 0 && select">已选择待开票数量：
          <span class="warning">{{selectionChangeData.length}}</span>
        </div>
      </div>
      <div class="jc js">
        <div class="marginRight" v-if="select" style="font-size:13px;">可开票总金额：<span class="blue"> {{invoiceTotal}}</span></div>
        <div class="marginRight jc js" style="font-size:13px;">开票总金额：
          <my-form-item width="120px" :disabled="!select" number :min="0" :max="invoiceTotal" v-model="invoiceVal" size="mini"></my-form-item>
        </div>
        <el-button :disabled="!select" class="marginRight" type="primary" size="mini" @click="distribution">分配</el-button>
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
      initData: {
        type: Array,
        default () {
          return [];
        }
      },
      invoiceValue: {
        type: Number,
        default: 0
      },
      isCheck: {
        type: Boolean,
        default: false
      },
      selection: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    data() {
      return {
        invoiceVal: 0,
        loadingText: '',
        tableHeight: 'calc(100vh - 50px - 70px - 62px - 53px - 40px - 60px - 77px - 120px)',
        newData: [],
        selectionChangeData: [],
      }
    },
    watch: {
      invoiceVal(val) {
        this.$emit('update:invoiceValue', val);
      },
      newData: {
        handler(val) {
          this.$emit('update:data', val);
        },
        deep: true
      },
      selectionChangeData: {
        handler(val) {
          this.$emit('update:selection', val);
        },
        deep: true
      }
    },
    computed: {
      invoiceTotal() {
        let num = 0;
        this.initData.forEach(item => {
          if (this.$attrs.isInvoice) {
            num += item.balancedSettlement + item.balancedPrepaid - item.preInvoiced - item.invoiced + item.invoiceBalance;
          } else {
            num = this.$attrs.invoiceTotal;
          }
        });
        return num;
      },
      select() {
        if (!this.$attrs.edit) {
          return true;
        } else {
          if (this.$attrs.isInvoice) {
            return true;
          } else {
            return false;
          }
        }
      },
      thead() {
        let thead = {
          'businessTrains.balancedSettlement': {
            name: '已用结算款结算金额',
          },
          'businessTrains.balancedPrepaid': {
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
            name: '开票金额',
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
        if (this.$route.query.payName === 'invoiceCheck' || this.$route.query.payName === 'invoiceEditCheck') {
          this.$set(thead, 'invoiceBalance', {
            name: '开票金额',
          })
        }
        return thead;
      },
    },
    methods: {
      invo(scope) {
        return scope.businessTrains.balancedSettlement + scope.businessTrains.balancedPrepaid - scope.invoiced;
      },
      selectionChange(val) {
        this.selectionChangeData = val;
      },
      distribution() {
        if (this.selectionChangeData.length === 0) {
          this.$message.warn('请先选择开票');
          this.$emit('update:isCheck', false);
        } else if (this.invoiceVal === 0) {
          this.$message.warn('开票金额不能等于0');
          this.$emit('update:isCheck', false);
        } else {
          this.$emit('update:isCheck', true);
          this.indexData = [];
          this.selectionChangeData.forEach(item => {
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
            let num = this.newData[data[0]].balancedSettlement + this.newData[data[0]].balancedPrepaid;
            if (num <= value) {
              this.$set(this.newData[data[0]], 'invoiceBalance', num);
              let newData = [];
              data.forEach(item => {
                if (item !== data[0]) {
                  newData.push(item);
                }
              });
              this.recursion(value - num, newData);
            } else {
              this.$set(this.newData[data[0]], 'invoiceBalance', value);
            }
          }
        }
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
    },
    created() {
      if (this.initData.length > 0) {
        let data = JSON.parse(JSON.stringify(this.initData));
        data.forEach(item => {
          let obj = {
            ...item,
            invo: item.balancedSettlement + item.balancedPrepaid - item.preInvoiced - item.invoiced,
            invoiceBalance: item.invoiced
          }
          this.newData.push(obj);
        });
      }
      if (this.$route.query.payName === 'invoice') {
        this.invoiceVal = 0;
      } else {
        this.initData.forEach(item => {
          this.invoiceVal += item.invoiced;
        });
      }
    }
  }
</script>

<style scoped>
  .marginRight {
    margin-right: 15px;
  }
</style>