<template>
  <loading-box v-loading.fullscreen.lock="loadingText" :element-loading-text="loadingText" element-loading-spinner="el-icon-loading">
    <my-table selection :height="tableHeight" index :loadmore="loadmore" stripe :thead="thead" :data.sync="newData" @selection-change="selectionChange" size="mini" border>
      <div slot-scope="scope">
        <span v-if="scope.prop === 'invoiced'" class="blue">{{scope.row[scope.prop]}}</span>
        <span v-if="scope.prop === 'invo'" class="warning">{{scope.row[scope.prop]}}</span>
        <my-form-item v-if="scope.prop === 'invoiceBalance'" number :min="0" :max="scope.row.balancedSettlement + scope.row.balancedPrepaid" v-model="scope.row[scope.prop]" size="mini"></my-form-item>
        <div v-if="scope.prop === 'company'">{{scope.row[scope.prop].name}}
          <el-tag size="mini" :type="scope.row.customerType === 'user'?'success':'warning'">{{scope.row.customerType === 'user'?'用户':'公司'}}</el-tag>
        </div>
        <div v-if="scope.prop === 'receivedCompany'">{{changUser(scope).name}}
          <el-tag size="mini" :type="changUser(scope).type">{{changUser(scope).userType}}</el-tag>
        </div>
      </div>
    </my-table>
    <div class="jc jb" style="height:45px;background:#f3f4f5;margin-top:15px;padding:0 15px;">
      <div>
        <div style="font-size:13px;" v-if="selectionChangeData.length > 0">已选择待开票数量：
          <span class="warning">{{selectionChangeData.length}}</span>
        </div>
      </div>
      <div class="jc js">
        <div class="marginRight" style="font-size:13px;">可开票总金额：<span class="blue"> {{invoiceTotal}}</span></div>
        <div class="marginRight jc js" style="font-size:13px;">开票金额：
          <my-form-item width="120px" number :min="0" :max="invoiceTotal" v-model="invoiceVal" size="mini"></my-form-item>
        </div>
        <el-button class="marginRight" type="primary" size="mini" @click="distribution">分配</el-button>
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
        tableHeight: 'calc(100vh - 50px - 70px - 62px - 53px - 40px - 60px - 77px)',
        newData: [],
        selectionChangeData: [],
      }
    },
    watch: {
      data: {
        handler(val) {
          console.log(val);
          let value = JSON.parse(JSON.stringify(val))
          if (this.isInvo) {
            let data = [];
            value.forEach(item => {
              let obj = item;
              this.$set(obj, 'invo', item.balancedSettlement + item.balancedPrepaid - item.invoiced);
              this.$set(obj, 'invoiceBalance', 0);
              data.push(obj);
            });
            this.newData = data;
          } else {
            this.newData = value;
          }
        },
        deep: true
      }
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
      },
    },
    methods: {
      selectionChange(val) {
        this.selectionChangeData = val;
      },
      distribution() {
        if (this.selectionChangeData.length === 0) {
          this.$message.warn('请先选择开票');
        } else if (this.invoiceVal === 0) {
          this.$message.warn('开票金额不能等于0');
        } else {
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
      if (this.data.length > 0) {
        let data = [];
        this.data.forEach(item => {
          let obj = item;
          this.$set(obj, 'invo', item.balancedSettlement + item.balancedPrepaid - item.invoiced);
          this.$set(obj, 'invoiceBalance', 0);
          data.push(obj);
        });
        this.newData = data;
      }
    }
  }
</script>

<style scoped>
  .marginRight {
    margin-right: 15px;
  }
</style>