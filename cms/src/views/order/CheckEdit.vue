<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac" style="padding-top:10px;color:#aaa;font-size:14px">
          <div>创建时间：{{orderInfo.createdAt | formatTime}}</div>
          <div class="f1"></div>
          <div>订单号：{{orderInfo.createdAt | date2no}}</div>
        </div>
        <div class="tc" style="font-size:22px;padding-bottom:15px">
          <strong>订单审核</strong>
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
            <my-form-item v-model="areaSelect" area filterable @change="areaCascaderChange" label="送货地址">
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
      <div class="flex ac" style="margin-top:30px">
        <el-button v-if="orderHasChange" size="small" type="primary" icon="el-icon-edit" plain>修改订单</el-button>
        <div class="f1"></div>
        <el-button size="small" type="primary" @click="takingOrder">审核通过</el-button>
        <el-button size="small">取消</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
import { goods } from "./field";
export default {
  data() {
    return {
      loadingText: "",
      tableLoading: "",
      orderInfo: {},
      customer: [],
      areaSelect: [],
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
      goodsData: [],
      areaCascader: [],
      userCascader: [],
      goodsCascader: [],
      orderHasChange: false
    };
  },
  watch: {
    order: {
      handler: function() {
        this.orderHasChange = true;
      },
      deep: true
    },
    goodsData: {
      handler: function() {
        this.orderHasChange = true;
      },
      deep: true
    }
  },
  methods: {
    async getOrderInfo() {
      this.loadingText = "正在获取订单数据";
      try {
        this.orderInfo = await this.$ajax("/order/" + this.$route.params._id);
        if (this.orderInfo.user) {
          this.customer = ["user", this.orderInfo.user._id];
        }
        if (this.orderInfo.company) {
          this.customer = ["company", this.orderInfo.company._id];
        }
        this.areaSelect = [];
        let areaSelectType = ["province", "city", "county", "township"];
        areaSelectType.forEach(item => {
          if (this.orderInfo.area[item]) {
            this.areaSelect.push(this.orderInfo.area[item]._id);
          }
        });
        this.areaSelect.push(this.orderInfo.area._id);
        for (const key in this.order) {
          if (this.orderInfo.hasOwnProperty(key)) {
            this.order[key] = this.orderInfo[key];
          }
        }
        this.order.area = this.orderInfo.area._id;
        this.order[this.customer[0]] = this.customer[1];
        this.goodsData = [];
        this.orderInfo.goods.forEach(item => {
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
        setTimeout(() => {
          this.orderHasChange = false;
        }, 200);
      } catch (error) {}
      this.loadingText = "";
    },
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
      this.order.area = val.last._id;
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
      this.order.contactName = data.name;
      this.order.contactNumber = data.mobile || data.tel;
      if (data.area) {
        this.areaCascader = data.area;
      }
    },
    async takingOrder() {
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
      this.loadingText = "审核中...";
      try {
        this.order.state = "distribution";
        this.order._id = this.orderInfo._id;
        await this.$ajax.post("/order/update", {
          order: this.order,
          goods: this.goodsData
        });
        await this.$store.dispatch("orderBadgeNotify");
        this.$message.success("订单审核成功");
        this.$router.push("/order/check");
      } catch (error) {}
      this.loadingText = "";
    }
  },
  async created() {
    await this.getOrderInfo();
    await this.getData();
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
  padding-top: 0;
  /* box-shadow: 0 0 10px rgba(0,0,0,.2); */
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>