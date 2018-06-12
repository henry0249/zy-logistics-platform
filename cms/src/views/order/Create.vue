<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>销售订单</strong>
        </div>
        <my-form size="mini" width="24%" style="margin:15px 0">
          <div class="flex ac jb">
            <my-form-item cascader v-model="customer" filterable label="客户名称" :options="userCascader" @change="userCascaderChange">
            </my-form-item>
            <my-form-item datetime v-model="order.deliveryTime" label="配送时间">
            </my-form-item>
            <my-form-item select v-model="order.settlementMethod" label="结算方式" :options="field.Order.settlementMethod.option">
            </my-form-item>
            <my-form-item select v-model="order.transportModel" label="运输方式" :options="field.Order.transportModel.option">
            </my-form-item>
          </div>
          <div class="flex ac jb" style="margin:15px 0">
            <my-form-item select v-model="order.invoiceType" label="发票类型" :options="field.Order.invoiceType.option">
            </my-form-item>
            <my-form-item input v-model="order.contactName" label="收货人">
            </my-form-item>
            <my-form-item input v-model="order.contactNumber" label="联系电话">
            </my-form-item>
            <my-form-item v-model="test" area filterable @change="areaCascaderChange" label="送货地址">
            </my-form-item>
          </div>
          <my-form-item width="100%" style="margin:15px 0" input v-model="order.address" label="详细地址">
          </my-form-item>
          <my-form-item width="100%" input type="textarea" v-model="order.remark" autosize label="订单备注">
          </my-form-item>
        </my-form>
        <div>
          <my-table v-if="!tableLoading" size="small" index edit border :thead="thead" :data.sync="goodsData">
            <template slot-scope="scope">
              <my-form-item v-if="scope.prop === 'goods'" size="mini" cascader v-model="scope.row.goods" filterable :options="goodsCascader" @change="goodsCascaderChange(scope.row)">
              </my-form-item>
              <span v-if="scope.prop === 'totalPrice'">
                {{goodsTotalPrice(scope.row)}}
              </span>
            </template>
          </my-table>
        </div>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" type="primary" @click="createOrder">立即创建</el-button>
        <el-button size="small">取消</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
import { goods } from "./field";
export default {
  data() {
    let goodsItem = {};
    for (const key in goods) {
      goodsItem[key] = "";
      goodsItem.goods = [];
    }
    return {
      loadingText: "",
      tableLoading: "",
      customer: [],
      order: {
        settlementMethod: 1,
        transportModel: 0,
        deliveryTime: "",
        invoiceType: 0,
        contactName: "",
        contactNumber: "",
        area: "",
        address: "",
        remark: ""
      },
      thead: goods,
      goodsData: [
        {
          ...goodsItem
        }
      ],
      areaCascader: [],
      userCascader: [],
      goodsCascader: [],
      test: []
    };
  },
  methods: {
    async getData() {
      this.loadingText = "加载中";
      this.userCascader = [];
      this.areaCascader = [];
      this.goodsCascader = [];
      try {
        this.userCascader = await this.$ajax("/user/cascader");
        this.areaCascader = await this.$ajax("/area/cascader");
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
          if (this.order.area === item.area) {
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
        let count = Number(row.count),
          unitPrice = Number(row.unitPrice);
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
    areaCascaderChange(val) {
      this.order.area = val[val.length - 1];
      this.goodsData.forEach(item => {
        this.goodsCascaderChange(item);
      });
    },
    userCascaderChange(val) {
      let data = {};
      this.userCascader.forEach(item => {
        if (item.value === val[0]) {
          item.children.forEach(childrenItem => {
            if (childrenItem._id === val[1]) {
              data = childrenItem;
            }
          });
        }
      });
      this.order[val[0]] = val[1];
      if (val[0] === "user") {
        delete this.order.company;
      }
      if (val[0] === "company") {
        delete this.order.user;
      }
      this.order.contactName = data.name;
      this.order.contactNumber = data.mobile || data.tel;
      if (data.area) {
        this.areaCascader = data.area;
      }
    },
    async createOrder() {
      let order = this.order;
      if (!order.company && !order.user) {
        this.$message.error("未选择客户");
        return;
      }
      if (!order.contactName) {
        this.$message.error("未填写收货人");
        return;
      }
      if (!order.contactNumber) {
        this.$message.error("未填写收货人联系电话");
        return;
      }
      if (!order.area) {
        this.$message.error("未选择送货地址");
        return;
      }
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
      this.loadingText = "创建中...";
      try {
        await this.$ajax.post("/order/add", {
          order: this.order,
          goods: this.goodsData
        });
        await this.$store.dispatch("orderBadgeNotify");
        this.$message.success("成功创建订单");
        this.$router.push("/order/taking");
      } catch (error) {}
      this.loadingText = "";
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style scoped>
.g-order-create {
  padding: 3% 5%;
}
.g-order {
  margin: 0 auto;
  padding: 30px;
  /* box-shadow: 0 0 10px rgba(0,0,0,.2); */
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>