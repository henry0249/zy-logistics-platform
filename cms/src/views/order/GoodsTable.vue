<template>
  <loading-box style="min-height:20px">
    <el-alert title="商品信息" type="info" :closable="false" style="margin-bottom:15px">
    </el-alert>
    <my-table v-if="order.area && order.area._id" size="small" border :thead="thead" :data.sync="goodsData">
      <div slot-scope="scope">
        <my-select v-if="scope.prop === 'value'" goods :data.sync="order.goods" size="mini" @change="goodsChange"></my-select>
        <!-- <common-select :disabled="thead[scope.prop].disabled" :data.sync="order.goods" border v-if="scope.prop === 'value'" type="goods" @change="goodsChange" size="mini"></common-select> -->
        <div v-if="scope.prop === 'brand'">
          {{order.goods.brand ? order.goods.brand.name : '-'}}
        </div>
        <div v-if="scope.prop === 'stock'">
          {{order.goods.stock || '-'}}
        </div>
        <div v-if="scope.prop === 'unit'">
          {{order.goods.unit || '-'}}
        </div>
        <div v-if="scope.prop === 'count'">
          <my-form-item :disabled="thead[scope.prop].disabled" size="mini" v-model="order.count"></my-form-item>
        </div>
        <div v-if="scope.prop === 'factoryPrice'">
          <my-form-item :disabled="thead[scope.prop].disabled" size="mini" v-model="order.factory"></my-form-item>
        </div>
        <div v-if="scope.prop === 'unitPrice'">
          <my-form-item :disabled="thead[scope.prop].disabled" size="mini" v-model="order.sell"></my-form-item>
        </div>
        <div v-if="scope.prop === 'transportPrice'">
          <my-form-item :disabled="thead[scope.prop].disabled" size="mini" v-model="order.transport"></my-form-item>
        </div>
        <div v-if="scope.prop === 'totalPrice'">
          {{goodsTotalPrice}}
        </div>
      </div>
    </my-table>
    <div class="tc" style="color:#ccc;padding:10px 0" v-else>
      请先选择收货地址
    </div>
  </loading-box>
</template>

<script>
import { orderGoods } from "./field";
export default {
  props: {
    order: {
      type: Object,
      default() {
        return {};
      }
    },
    edit: {
      type: Boolean,
      default: true
    },
    thead: {
      type: Object,
      default() {
        return orderGoods;
      }
    }
  },
  watch: {
    "order.area"(val, old) {
      this.goodsChange(this.order.goods);
    }
  },
  data() {
    return {
      goodsData: [{}]
    };
  },
  computed: {
    goodsTotalPrice() {
      let total = 0;
      let count = Number(this.order.count);
      let sell = Number(this.order.sell);
      if (this.is("number", count) && this.is("number", sell)) {
        total = count * sell;
      }
      return total;
    }
  },
  methods: {
    goodsChange(val) {
      let price = {};
      if (val.price && val.price instanceof Array) {
        val.price.forEach(item => {
          if (
            this.order.area !== undefined &&
            (item.area === this.order.area || item.area === this.order.area._id)
          ) {
            price = item;
          }
        });
        this.order.sell = price.sell || 0;
        this.order.factory = price.factory || 0;
        this.order.transport = price.transport || 0;
        this.$emit("update:data", this.order);
      }
    }
  }
};
</script>

<style scoped>
</style>