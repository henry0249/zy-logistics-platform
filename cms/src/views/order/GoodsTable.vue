<template>
  <loading-box v-model="loadingText" style="min-height:20px">
    <my-table size="small" index edit border :thead="thead" :data.sync="goodsData">
      <template slot-scope="scope">
        <my-form-item v-if="scope.prop === 'goods'" size="mini" cascader v-model="scope.row.goods" filterable :options="goodsCascader" @change="goodsCascaderChange(scope.row)">
        </my-form-item>
        <span v-if="scope.prop === 'totalPrice'">
          {{goodsTotalPrice(scope.row)}}
        </span>
      </template>
    </my-table>
  </loading-box>
</template>

<script>
import { goods } from "./field";
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
    }
  },
  watch: {
    "order.area"(val, old) {
      this.goodsData.forEach(item => {
        this.goodsCascaderChange(item);
      });
    }
  },
  data() {
    let goodsItem = {};
    for (const key in goods) {
      goodsItem[key] = "";
      goodsItem.goods = [];
    }
    return {
      loadingText: "加载中",
      thead: goods,
      goodsData: [
        {
          ...goodsItem
        }
      ],
      goodsCascader: []
    };
  },
  watch: {
    goodsData: {
      handler: function(val) {
        this.$emit("update:data", val);
      },
      deep: true
    },
    "order.area"() {
      this.goodsData.forEach(item => {
        this.goodsCascaderChange(item);
      });
    }
  },
  methods: {
    async getData() {
      this.loadingText = "加载中";
      this.goodsCascader = [];
      try {
        this.goodsCascader = await this.$ajax("/goods/cascader");
      } catch (error) {}
      this.loadingText = "";
    },
    getGoodsById(_id) {
      let res = {};
      this.goodsCascader.forEach(brandItem => {
        brandItem.children.forEach(goodsItem => {
          if (goodsItem._id === _id) {
            res = goodsItem;
          }
        });
      });
      return res;
    },
    goodsUnit(row) {
      let val = row.goods;
      if (val.length === 2) {
        return this.getGoodsById(val[1]).unit || "-";
      }
    },
    goodsPrice(row, type) {
      let val = row.goods;
      if (val.length === 2 && this.order.area) {
        let goods = this.getGoodsById(val[1]);
        let price = "-";
        goods.price.forEach(item => {
          if (
            this.order.area === item.area ||
            this.order.area._id === item.area
          ) {
            price = item[type] || 0;
          }
        });
        return price;
      }
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
    goodsCascaderChange(row) {
      setTimeout(() => {
        let goods = this.getGoodsById(row.goods[1]);
        row.unit = this.goodsUnit(row);
        row.unitPrice = this.goodsPrice(row, "sell");
        row.transportPrice = this.goodsPrice(row, "transport");
        row.factoryPrice = this.goodsPrice(row, "factory");
        row.value = row.goods[1];
      }, 200);
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
          value: item.value._id,
          goods: [item.value.brand, item.value._id],
          count: item.count,
          unit: item.value.unit,
          factoryPrice: item.factoryPrice,
          unitPrice: item.unitPrice,
          transportPrice: item.transportPrice
        });
      });
    }
    await this.getData();
    this.loadingText = "";
  }
};
</script>

<style scoped>
</style>