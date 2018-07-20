<template>
  <loading-box v-model="loadingText" style="min-height:20px">
    <my-table size="small" :edit="edit?true:undefined" border :thead="thead" :data.sync="goodsData">
      <template slot-scope="scope">
        <common-select :data.sync="scope.row.value" border v-if="scope.prop === 'value'" type="goods" @change="goodsChange($event,scope.index)"></common-select>
        <span v-if="scope.prop === 'totalPrice'">
          {{goodsTotalPrice(scope.row)}}
        </span>
      </template>
    </my-table>
  </loading-box>
</template>

<script>
import { orderGoods } from "./field";
export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
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
    goodsData: {
      handler: function(val) {
        console.log(val);
        this.$emit("update:data", val);
      },
      deep: true
    },
    "order.area"(val, old) {
      this.goodsData.forEach((item,index) => {
        if (item.value && item.value._id) {
          this.goodsChange(item.value,index);
        }
      });
    }
  },
  data() {
    let goodsItem = {};
    for (const key in orderGoods) {
      goodsItem[key] = "";
      goodsItem.value = {};
      goodsItem.order = this.order._id;
    }
    return {
      loadingText: "加载中",
      goodsData: [
        {
          ...goodsItem
        }
      ]
    };
  },
  methods: {
    goodsChange(val, index) {
      let price = {};
      val.price.forEach(item => {
        if (
          this.order.area !== undefined &&
          (item.area === this.order.area || item.area === this.order.area._id)
        ) {
          price = item;
        }
      });
      let item = JSON.parse(JSON.stringify(this.goodsData[index]));
      item.value = val;
      item.brand = val.brand.name;
      item.unit = val.unit;
      item.unitPrice = price.sell || 0;
      item.factoryPrice = price.factory || 0;
      item.transportPrice = price.transport || 0;
      this.goodsData.splice(index, 1, item);
    },
    goodsTotalPrice(row) {
      let total = 0;
      if (
        this.is("number", Number(row.count)) &&
        this.is("number", Number(row.unitPrice))
      ) {
        let count = Number(row.count);
        let unitPrice = Number(row.unitPrice);
        total = count * unitPrice;
      }
      return total;
    },
    check() {
      let goodsCheck = true;
      this.goodsData.forEach(item => {
        if (!item.value) {
          goodsCheck = "未选择商品";
          return;
        }
        if (!this.is("number", Number(item.count)) || Number(item.count) <= 0) {
          goodsCheck = "商品数量不正确";
          return;
        }
        if (
          !this.is("number", Number(item.factoryPrice)) ||
          Number(item.factoryPrice) <= 0
        ) {
          goodsCheck = "出厂价格不正确";
          return;
        }
        if (
          !this.is("number", Number(item.unitPrice)) ||
          Number(item.unitPrice) <= 0
        ) {
          goodsCheck = "销售单价不正确";
          return;
        }
        if (
          !this.is("number", Number(item.transportPrice)) ||
          Number(item.transportPrice) <= 0
        ) {
          goodsCheck = "运输单价不正确";
          return;
        }
      });
      if (goodsCheck !== true) {
        this.$message.error(goodsCheck);
        return;
      }
      return true;
    }
  },
  async created() {
    if (this.order.goods) {
      this.goodsData = [];
      this.order.goods.forEach(item => {
        this.goodsData.push({
          _id: item._id,
          order:this.order._id,
          value: item.value,
          count: item.count,
          unit: item.value.unit,
          factoryPrice: item.factoryPrice,
          unitPrice: item.unitPrice,
          transportPrice: item.transportPrice
        });
      });
    }
    this.loadingText = "";
  }
};
</script>

<style scoped>
</style>