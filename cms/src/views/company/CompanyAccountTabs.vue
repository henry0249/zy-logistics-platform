<template>
  <loading-box v-model="loadingText">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane v-for="item in data" :name="item._id" :key="item.id" :label="item.isUser?item.name + '(个人)' : item.name">
        <div class="col-flex tab-height">
          <div class="tab-top jc jb" style="margin:15px 0;">
            <div class="jc js">
              <span>结算款：<span style="margin-right:30px;" class="blue">{{item.value}}</span> 预付款：<span class="danger">{{item.prepaid}}</span></span>
              <div class="marginRight" style="font-size:13px;margin:0 30px;">可开票总金额：<span class="blue"> {{item.waitingForInvoice.total}}</span></div>
              <el-button :disabled="item.waitingForInvoice.total === 0" type="success" size="mini" @click="setInvoice">去开票</el-button>
            </div>
            <div class="js">
              <el-button @click="goAccountChange('5',activeName)" size="mini">收款</el-button>
              <el-button @click="goAccountChange('6',activeName)" size="mini">预收款</el-button>
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
  </loading-box>
</template>

<script>
  import table_js from './CompanyAccount.js';
  export default {
    props: {
      dataJs: {
        type: Object,
        default () {
          return {};
        }
      },
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      payArr: {
        type: Array,
        default () {
          return [];
        }
      },
      initActiveName: {
        type: String,
        default: ''
      },
      initPayName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        loadingText: '',
        activeName: '',
        payName: '',
        table_js
      }
    },
    watch: {},
    methods: {
      goAccountChange(val, _id) {
        this.$router.push({
          path: '/company/account/account_change',
          query: {
            type: val,
            activeName: _id,
            show: 'true',
            titleType: 'isReceive',
          }
        })
      },
      tabClick(val) {
        this.$emit('tab-click', {
          name: val.name,
          index: val.index
        });
      },
      tabPayClick(val) {
        this.$emit('tab-pay-click', {
          name: val.name,
          index: val.index
        });
      },
      setInvoice() {},
      badge(val) {
        if (val.type === 'receivedCheck' || val.type === 'receivedEditCheck' || val.type === 'invoiceCheck' || val.type === 'invoiceEditCheck') {
          if (val.count) {
            return val.count;
          } else {
            return undefined;
          }
        } else {
          return undefined;
        }
      },
    },
    created() {
      this.activeName = this.initActiveName;
      this.payName = this.initPayName;
    }
  }
</script>

<style scoped>

</style>