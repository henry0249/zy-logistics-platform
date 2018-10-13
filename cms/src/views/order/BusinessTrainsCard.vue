<template>
  <div :style="{width:width}" style="min-height:270px">
    <el-card class="box-card" shadow="hover">
      <div class="flex ac jb" v-if="title" slot="header" style="font-size:12px">
        <el-popover placement="top" trigger="hover">
          <div slot="reference" style="color:#ffd700;margin-right:5px">
            ¥
          </div>
          <div class="tc">
            <loading-box v-model="loadingText">
              <div class="flex ac jc">
                <div v-if="data.type !== 'customer'" style="padding:0 10px">
                  应收: 
                  <span v-if="next.type === 'pool'">{{Number(next.balancePrice) * Number(next.balanceCount)}}</span>
                  <span v-if="next.type === 'customer'">{{Number(order.balancePrice) * Number(order.balanceCount)}}</span>
                </div>
                <div v-if="data.account && data.type !== 'customer'" style="padding:0 10px">
                  预收: {{data.account.prepaid}}
                </div>
                <div v-if="data.type !== 'supplier'" style="padding:0 10px">
                  应付: 
                  <span v-if="data.type === 'pool'">{{Number(data.balancePrice) * Number(data.balanceCount)}}</span>
                  <span v-if="data.type === 'customer'">{{Number(order.balancePrice) * Number(order.balanceCount)}}</span>
                </div>
              </div>
            </loading-box>
          </div>
        </el-popover>
        {{title}}
        <div v-if="data.type==='pool'">{{index}}</div>
        <transport-trains-select v-if="data.type!=='customer'" :businessTrains="data" :logistics="data.logistics" :order="order"></transport-trains-select>
        <div class="f1"></div>
        <remove-check @remove="remove" v-if="data.type === 'pool'"></remove-check>
      </div>
      <div class="marginBottom">
        <my-select v-if="data.type === 'supplier'" :data.sync="data.company" disabled></my-select>
        <el-tooltip v-if="data.type === 'pool'" effect="dark" content="仅可从本公司关联的贸易公司中选择" placement="top">
          <my-form-item v-if="order.handle" size="mini" v-model="data.company" select :options="order.handle.businessRelationCompany || []">
          </my-form-item>
        </el-tooltip>
        <my-select v-if="data.type === 'customer'" :data.sync="data[data.customerType]" disabled></my-select>
      </div>
      <div v-if="data.type === 'supplier'">
        <my-form-item v-if="order.goods" class="marginBottom" :value="order.goods.stock+' '+order.goods.unit" text label="商品库存" size="mini">
        </my-form-item>
        <my-form-item class="marginBottom" v-model="data.supplyPrice" label="供货单价" size="mini" number :min="0">
        </my-form-item>
        <my-form-item class="marginBottom" v-model="data.supplyCount" label="供货数量" size="mini" number :min="0">
        </my-form-item>
        <my-form-item v-if="order.state==='financialPretrial'" class="marginBottom" v-model="data.loss" label="承担损耗" size="mini" number :min="0">
        </my-form-item>
        <my-form-item v-if="order.state==='financialPretrial'" class="marginBottom" v-model="data.balancePrice" label="结算价格" size="mini" number :min="0">
        </my-form-item>
        <my-form-item v-if="order.state==='financialPretrial'" v-model="data.balanceCount" label="结算数量" size="mini" number :min="0">
        </my-form-item>
      </div>
      <div v-if="data.type === 'pool'">
        <my-form-item class="marginBottom" v-model="data.receive" label="实收数量" size="mini" number :max="last.supplyCount">
        </my-form-item>
        <my-form-item class="marginBottom" v-model="data.supplyCount" label="供货数量" size="mini" number :min="0" :max="data.receive">
        </my-form-item>
        <my-form-item class="marginBottom" v-model="data.supplyPrice" label="供货单价" size="mini" number :min="0">
        </my-form-item>
        <my-form-item v-if="order.state==='financialPretrial'" class="marginBottom" v-model="data.loss" label="承担损耗" size="mini" number :min="0">
        </my-form-item>
        <my-form-item v-if="order.state==='financialPretrial'" class="marginBottom" v-model="data.balancePrice" label="结算价格" size="mini" number :min="0">
        </my-form-item>
        <my-form-item v-if="order.state==='financialPretrial'" v-model="data.balanceCount" label="结算数量" size="mini" number :min="0">
        </my-form-item>
      </div>
      <div v-if="data.type === 'customer'">
        <my-form-item class="marginBottom" v-model="order.sell" label="商品单价" size="mini" text>
        </my-form-item>
        <my-form-item class="marginBottom" v-model="order.count" label="订单数量" size="mini" text>
        </my-form-item>
        <my-form-item class="marginBottom" v-model="data.receive" label="实收数量" size="mini" number :min="0" :max="last.supplyCount">
        </my-form-item>
        <my-form-item v-if="order.state==='financialPretrial'" class="marginBottom" v-model="data.loss" label="承担损耗" size="mini" number :min="0">
        </my-form-item>
        <my-form-item v-if="order.state==='financialPretrial'" class="marginBottom" v-model="order.balancePrice" label="结算价格" size="mini" number :min="0">
        </my-form-item>
        <my-form-item v-if="order.state==='financialPretrial'" v-model="order.balanceCount" label="结算数量" size="mini" number :min="0">
        </my-form-item>
      </div>
    </el-card>
  </div>
</template>

<script>
import TransportTrainsSelect from "./TransportTrainsSelect";
export default {
  components: {
    TransportTrainsSelect
  },
  props: {
    index: {
      type: Number,
      default: 0
    },
    order: {
      type: Object,
      default() {
        return {};
      }
    },
    last: {
      type: Object,
      default() {
        return {};
      }
    },
    next: {
      type: Object,
      default() {
        return {};
      }
    },
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    width: {
      type: String,
      default: "220px"
    }
  },
  data() {
    return {
      loadingText: "",
      account: {}
    };
  },
  watch: {
    // "data.supplyCount"(val) {
    //   if (Number(val) < Number(this.next.receive)) {
    //     this.next.receive = val;
    //   }
    // },
    // "data.receive"(val) {
    //   if (Number(val) < Number(this.next.receive)) {
    //     this.next.receive = val;
    //   }
    //   if (this.last.type === "supplier") {
    //     this.last.loss = this.last.supplyCount - val;
    //   } else {
    //     this.last.loss = this.last.receive - val;
    //   }
    // },
    // "data.supplyPrice"(val) {
    //   this.next.supplyPrice = val;
    // }
    // "order.balancePrice"(val){
    //   this.data.balancePrice = val;
    // },
    // "order.balanceCount"(val){
    //   this.data.balanceCount = val;
    // }
  },
  computed: {
    title() {
      let res = {
        supplier: "源头供货商",
        pool: "联营商",
        customer: "客户"
      };
      return res[this.data.type] || "客户";
    }
  },
  methods: {
    remove() {
      this.$emit("remove", this.data);
    }
  }
};
</script>

<style scoped>
.marginBottom {
  margin-bottom: 10px;
}
</style>