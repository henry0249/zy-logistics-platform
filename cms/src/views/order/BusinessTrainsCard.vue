<template>
  <div :style="{width:width}">
    <el-card class="box-card" shadow="hover" :style="isHandle ? 'border:1px solid #67C23A':''">
      <div class="flex ac jb" v-if="title" slot="header" style="font-size:12px">
        <el-popover placement="top" trigger="hover">
          <div slot="reference" style="color:#ffd700;margin-right:5px">
            ¥
          </div>
          <div class="tc">
            <loading-box v-model="loadingText">
              <div class="flex ac jc">
                <div v-if="type !== 'customer'" style="padding:0 10px">
                  应收:
                  {{Number(next.preBalancePrice) * Number(next.balanceCount)}}
                </div>
                <div v-if="data.account && type !== 'customer'" style="padding:0 10px">
                  预收: 
                  {{data.account.prepaid}}
                </div>
                <div v-if="type !== 'supplier'" style="padding:0 10px">
                  应付:
                  {{Number(data.preBalancePrice) * Number(data.balanceCount)}}
                </div>
              </div>
            </loading-box>
          </div>
        </el-popover>
        {{title}}
        <div v-if="type==='pool'">{{index}}</div>
        <transport-trains-select v-if="type!=='customer'" :businessTrains="data" :logistics="data.logistics" :order="order"></transport-trains-select>
        <div class="f1"></div>
        <remove-check @remove="remove" v-if="type !== 'customer'"></remove-check>
      </div>
      <div class="marginBottom">
        <relation-company v-if="order._id && type !== 'customer'" business :order="order" :data.sync="data.company"></relation-company>
        <my-select v-if="type === 'customer'" :data.sync="data[order.type]" disabled></my-select>
      </div>
      <div v-if="type === 'supplier'">
        <my-form-item v-if="order.goods" class="marginBottom" :value="order.goods.stock+' '+order.goods.unit" text label="商品库存" size="mini">
        </my-form-item>
        <my-form-item class="marginBottom" v-model="data.supplyPrice" label="供货单价" size="mini" number :min="0">
        </my-form-item>
        <my-form-item class="marginBottom" v-model="data.supplyCount" label="供货数量" size="mini" number :min="0">
        </my-form-item>
        <my-form-item v-if="settle" class="marginBottom" v-model="data.loss" label="承担损耗" size="mini" number :min="0">
        </my-form-item>
        <my-form-item v-if="settle" class="marginBottom" v-model="data.preBalancePrice" label="贸易单价" size="mini" number :min="0">
        </my-form-item>
        <my-form-item v-if="settle" v-model="data.balanceCount" label="结算数量" size="mini" number :min="0">
        </my-form-item>
      </div>
      <div v-if="type === 'pool'">
        <my-form-item class="marginBottom" v-model="data.receive" label="实收数量" size="mini" number :max="last.supplyCount">
        </my-form-item>
        <my-form-item class="marginBottom" v-model="data.supplyCount" label="供货数量" size="mini" number :min="0" :max="data.receive">
        </my-form-item>
        <my-form-item class="marginBottom" v-model="data.supplyPrice" label="供货单价" size="mini" number :min="0">
        </my-form-item>
        <my-form-item v-if="settle" class="marginBottom" v-model="data.loss" label="承担损耗" size="mini" number :min="0">
        </my-form-item>
        <my-form-item v-if="settle" class="marginBottom" v-model="data.preBalancePrice" label="贸易单价" size="mini" number :min="0">
        </my-form-item>
        <my-form-item v-if="settle" v-model="data.balanceCount" label="结算数量" size="mini" number :min="0">
        </my-form-item>
      </div>
      <div v-if="type === 'customer'">
        <my-form-item class="marginBottom" v-model="order.sell" label="商品单价" size="mini" text>
        </my-form-item>
        <my-form-item class="marginBottom" v-model="order.count" label="订单数量" size="mini" text>
        </my-form-item>
        <my-form-item class="marginBottom" v-model="data.receive" label="实收数量" size="mini" number :min="0" :max="last.supplyCount">
        </my-form-item>
        <my-form-item v-if="settle" class="marginBottom" v-model="data.loss" label="承担损耗" size="mini" number :min="0">
        </my-form-item>
        <my-form-item v-if="settle" class="marginBottom" v-model="data.preBalancePrice" label="贸易单价" size="mini" number :min="0">
        </my-form-item>
        <my-form-item v-if="settle" v-model="data.balanceCount" label="结算数量" size="mini" number :min="0">
        </my-form-item>
      </div>
    </el-card>
  </div>
</template>

<script>
import TransportTrainsSelect from "./TransportTrainsSelect";
import RelationCompany from "./RelationCompany";
export default {
  components: {
    TransportTrainsSelect,
    RelationCompany
  },
  props: {
    index: {
      type: Number,
      default: 0
    },
    length: {
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
    },
    settle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loadingText: "",
      account: {}
    };
  },
  computed: {
    type() {
      if (this.index === 0) return "supplier";
      if (this.index === this.length - 1) return "customer";
      return "pool";
    },
    title() {
      if (this.index === 0) return "源头供货商";
      if (this.index === this.length - 1) return "客户";
      return "联营商";
    },
    isHandle() {
      let handle = this.order.handle;
      if (this.order.handle && this.order.handle._id) handle = this.order.handle._id;
      let company = this.data.company;
      if (this.data.company && this.data.company._id) company = this.data.company._id;
      return company === handle;
    }
  },
  methods: {
    remove() {
      if (this.isHandle) {
        this.$message.warn(`不能删除主导公司`);
        return;
      }
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