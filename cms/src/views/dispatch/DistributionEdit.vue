<template>
  <loading-box v-model="loadingText" class="body-padding">
    <div class="g-order-body">
      <div class="my-title">运单{{logistics.no}}详情</div>
      <goods-table :order="order" :edit="false"></goods-table>
      <el-alert title="运单信息" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <my-form size="mini" width="24%">
        <div class="flex ac jb">
          <div style="width:24%">
            <my-select label="运输工具" truck :type.sync="logisticsForm.transportation" :data.sync="logisticsForm[logisticsForm.transportation]" placeholder="运输工具"></my-select>
          </div>
          <my-form-item label="装货数量" v-model="logisticsForm.loading">
          </my-form-item>
          <my-form-item label="卸货数量" v-model="logisticsForm.landed">
          </my-form-item>
          <my-form-item label="运费单价" v-model="logisticsForm.price">
          </my-form-item>
        </div>
        <div class="flex ac jb" style="margin-top:15px">
          <my-form-item label="收货人" v-model="logisticsForm.contactName">
          </my-form-item>
          <my-form-item label="联系电话" v-model="logisticsForm.contactNumber">
          </my-form-item>
          <my-form-item label="配送时间" datetime size="mini" v-model="logisticsForm.startAt">
          </my-form-item>
          <my-form-item label="送达时间" datetime size="mini" v-model="logisticsForm.finishAt">
          </my-form-item>
        </div>
        <div class="flex ac jb" style="margin-top:15px">
          <my-form-item label="运单状态" select size="mini" v-model="logisticsForm.state" :options="field.Logistics.state.option">
          </my-form-item>
          <div style="width:24%">
            <my-select label="送货地址" area :data.sync="logisticsForm.area"></my-select>
          </div>
          <my-form-item width="49%" label="详细地址" size="mini" v-model="logisticsForm.areaInfo">
          </my-form-item>
        </div>
        <my-form-item style="margin-top:15px" width="100%" label="运单备注" v-model="logisticsForm.remark">
        </my-form-item>
      </my-form>
      <div class="flex ac" style="margin-top:15px">
        <!-- <el-button size="small" @click="back()">返回</el-button> -->
        <div class="f1"></div>
        <el-button size="small" type="primary" @click="update()">更新运单信息</el-button>
      </div>
      <el-alert title="物流信息" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <div>
        <distribution-map></distribution-map>
      </div>
    </div>
    <el-alert style="margin:15px 0" title="运单完成后可结算" type="info" center show-icon :closable="false">
    </el-alert>
    <div class="flex ac" style="margin:15px 0">
      <el-button size="small" type="danger">删除运单</el-button>
      <div class="f1"></div>
      <el-button size="small" @click="back()">返回</el-button>
      <el-button size="small" type="success" @click="finish()">运单完成</el-button>
    </div>
  </loading-box>
</template>

<script>
import Info from "../order/Info.vue";
import GoodsTable from "../order/GoodsTable.vue";
import DistributionMap from "./DistributionMap.vue";
export default {
  components: {
    Info,
    GoodsTable,
    DistributionMap
  },
  data() {
    return {
      loadingText: "加载中",
      logistics: {},
      logisticsForm: {
        transportation: "truck",
        truck: {},
        ship: {},
        state: 0,
        loading: 0,
        landed: 0,
        price: 0,
        contactName: "",
        contactNumber: "",
        startAt: "",
        finishAt: "",
        area: {},
        areaInfo: "",
        remark: ""
      },
      order: {}
    };
  },
  methods: {
    tsChange(val) {
      delete this.logisticsForm.ship;
      delete this.logisticsForm.truck;
      this.logisticsForm[val[1]] = val[2];
    },
    areaCascaderChange(val) {
      this.logisticsForm.area = val[val.length - 1];
    },
    async getOrderInfo() {
      this.loadingText = "正在获取订单数据";
      try {
        this.logistics = await this.$ajax.post("/logistics/findOne", {
          _id: this.$route.params._id,
          populate: [
            {
              path: "order"
            },
            {
              path: "goods"
            },
            {
              path: "area"
            },
            {
              path: "ship"
            },
            {
              path: "truck"
            }
          ]
        });
        for (const key in this.logistics) {
          if (this.logisticsForm.hasOwnProperty(key)) {
            this.logisticsForm[key] = this.logistics[key];
          }
        }
        this.order = await this.$ajax(
          "/order/info/" + this.logistics.order._id
        );
      } catch (error) {}
      setTimeout(() => {
        this.loadingText = "";
      }, 200);
    },
    async update() {
      this.loadingText = "正在修改";
      try {
        await this.$ajax.post("/logistics/update", {
          _id: this.$route.params._id,
          ...this.logisticsForm
        });
        await this.getOrderInfo();
      } catch (error) {}
      this.loadingText = "";
    },
    async finish() {
      this.logisticsForm.state = 5;
      try {
        let res = await this.$ajax.post("/logistics/update", {
          _id: this.$route.params._id,
          ...this.logisticsForm
        });
        this.back();
      } catch (error) {}
      this.loadingText = "";
    }
  },
  created() {
    this.getOrderInfo();
  }
};
</script>

<style scoped>
.sub-title {
  color: #aaa;
  font-size: 16px;
  padding: 15px 0;
}
</style>