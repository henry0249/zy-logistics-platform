<template>
  <loading-box v-model="loadingText" class="g-order-container">
    <div class="g-order-body" v-if="!bodyLoading">
      <div class="my-title">运单{{logistics.no}}详情</div>
      <el-alert title="运单信息" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <my-form size="mini" width="24%">
        <div class="flex ac jb">
          <my-form-item v-if="!loadingText" :label="tsLabel" v-model="ts" cascader :options="truckAndShipCascader" :props="{value:'_id',label:'no'}" :show-all-levels="false" size="mini">
          </my-form-item>
          <my-form-item label="装货数量" v-model="logistics.loading">
          </my-form-item>
          <my-form-item label="卸货数量" v-model="logistics.landed">
          </my-form-item>
          <my-form-item label="运费单价" v-model="logistics.transportPrice">
          </my-form-item>
        </div>
        <div class="flex ac jb" style="margin-top:15px">
          <my-form-item label="收货人" v-model="logistics.contactName">
          </my-form-item>
          <my-form-item label="联系电话" v-model="logistics.contactNumber">
          </my-form-item>
          <my-form-item label="配送时间" datetime size="mini" v-model="logistics.startAt">
          </my-form-item>
          <my-form-item label="送达时间" datetime size="mini" v-model="logistics.finishAt">
          </my-form-item>
        </div>
        <div class="flex ac jb" style="margin-top:15px">
          <my-form-item label="运单状态" select size="mini" v-model="logistics.state" :options="field.Logistics.state.option">
          </my-form-item>
          <my-form-item v-model="areaSelect" area filterable @change="areaCascaderChange" :show-all-levels="false" label="送货地址">
          </my-form-item>
          <my-form-item width="50%" label="详细地址" size="mini" v-model="logistics.address">
          </my-form-item>
        </div>
        <my-form-item style="margin-top:15px" width="100%" label="运单备注" v-model="logistics.remark">
        </my-form-item>
      </my-form>
      <el-alert title="商品信息" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <goods-table :order="order" :edit="false"></goods-table>
      <el-alert title="物流信息" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <div>
        <distribution-map></distribution-map>
      </div>
    </div>
    <el-alert style="margin:15px 0" title="运单完成后可结算" type="info" center show-icon :closable="false">
    </el-alert>
    <div class="tr">
      <el-button size="small" @click="back()">返回</el-button>
      <el-button size="small" type="success" @click="dispatch">运单完成</el-button>
    </div>
  </loading-box>
</template>

<script>
import Info from "./Info.vue";
import GoodsTable from "./GoodsTable.vue";
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
      bodyLoading: true,
      truckAndShipCascader: [],
      ts: [],
      areaSelect:[],
      logistics: {},
      order: {},
      goods: [],
      
    };
  },
  computed: {
    tsLabel() {
      let res = "未选择";
      if (this.ts[1] === "truck") {
        res = "车辆号码";
      }
      if (this.ts[1] === "ship") {
        res = "船舶号码";
      }
      return res;
    }
  },
  methods: {
    areaCascaderChange(){

    },
    async getOrderInfo() {
      this.bodyLoading = true;
      this.loadingText = "正在获取订单数据";
      try {
        this.truckAndShipCascader = await this.$ajax("/company/ts/cascader");
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
        if (this.logistics.truck) {
          this.ts = [
            this.logistics.truck.company,
            "truck",
            this.logistics.truck._id
          ];
        }
        if (this.logistics.ship) {
          this.ts = [
            this.logistics.ship.company,
            "ship",
            this.logistics.ship._id
          ];
        }
        this.areaSelect = this.area2arr(this.logistics.area);
        this.order = await this.$ajax(
          "/order/info/" + this.logistics.order._id
        );
        this.goods = [];
        this.goods.push(this.logistics.goods);
      } catch (error) {}
      setTimeout(() => {
        this.loadingText = "";
        this.bodyLoading = false;
      }, 200);
    },
    async dispatch() {
      this.loadingText = "调度中";
      try {
        let flag = true;
        this.$refs.trains.forEach(item => {
          if (item.check() !== true) {
            flag = false;
          }
        });
        if (flag) {
          let transportTrains = [];
          this.goods.forEach(item => {
            item.transportTrains.forEach(trainsItem => {
              transportTrains.push(trainsItem);
            });
          });
          await this.$ajax.post("/order/dispatch", {
            order: this.$route.params._id,
            transportTrains: transportTrains
          });
        }
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