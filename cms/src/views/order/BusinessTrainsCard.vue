<template>
  <div style="width:220px">
    <el-card class="box-card" shadow="hover">
      <div class="flex ac jb" v-if="title" slot="header" style="font-size:12px">
        {{title}}
        <div v-if="data.type==='pool'">{{index}}</div>
        <div v-if="data.type==='pool'" class="link" style="margin:0 5px" @click="dialogVisible = true">关联物流</div>
        <i v-if="data.type==='pool'" class="el-icon-question info"></i>
        <div class="f1"></div>
        <remove-check @remove="remove" v-if="data.type === 'pool'"></remove-check>
      </div>
      <div class="marginBottom">
        <my-select v-if="data.type === 'supplier'" :data.sync="data.company" disabled></my-select>
        <my-select v-if="data.type === 'pool'" :data.sync="data.company" placeholder="联营商公司"></my-select>
        <my-select v-if="data.type === 'customer'" :data.sync="data[data.customerType]" disabled></my-select>
      </div>
      <div v-if="data.type === 'supplier'">
        <my-form-item class="marginBottom" value="0" text label="库存数量" size="mini">
        </my-form-item>
        <my-form-item class="marginBottom" v-model="data.supplyPrice" label="供货单价" size="mini" number :min="0" :step="100">
        </my-form-item>
        <my-form-item class="marginBottom" v-model="data.supplyCount" label="供货数量" size="mini" number :min="0">
        </my-form-item>
        <my-form-item text v-model="data.loss" label="损耗数量" size="mini">
        </my-form-item>
      </div>
      <div v-if="data.type === 'pool'">
        <my-form-item class="marginBottom" v-model="data.supplyPrice" label="供货单价" size="mini" number :max="last.supplyPrice" :min="0" :step="100">
        </my-form-item>
        <my-form-item class="marginBottom" v-model="data.receive" label="实收数量" size="mini" number :max="last.type==='supplier'?last.supplyCount:last.receive">
        </my-form-item>
        <my-form-item class="marginBottom" value="0" text label="运输数量" size="mini">
        </my-form-item>
        <my-form-item text v-model="data.loss" label="损耗数量" size="mini">
        </my-form-item>
      </div>
      <div v-if="data.type === 'customer'">
        <my-form-item class="marginBottom" v-model="order.sell" label="商品单价" size="mini" text>
        </my-form-item>
        <my-form-item class="marginBottom" v-model="order.count" label="订单数量" size="mini" text>
        </my-form-item>
        <my-form-item class="marginBottom" v-model="data.receive" label="实收数量" size="mini" number :max="Number(last.receive) || Number(last.supplyCount)">
        </my-form-item>
        <my-form-item value="0" text label="运输数量" size="mini">
        </my-form-item>
      </div>
    </el-card>
    <el-dialog title="选择关联物流单" :visible.sync="dialogVisible" width="70%">
      <div>
        
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
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
    }
  },
  watch: {
    "data.supplyCount"(val) {
      this.next.receive = val;
    },
    "data.receive"(val) {
      this.next.receive = val;
      if (this.last.type === "supplier") {
        this.last.loss = this.last.supplyCount - val;
      } else {
        this.last.loss = this.last.receive - val;
      }
    },
    "data.supplyPrice"(val) {
      this.next.supplyPrice = val;
    }
  },
  data() {
    return {
      dialogVisible: false
      // company: {}
    };
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