<template>
  <loading-box v-model="loadingText" class="body-padding">
    <div class="g-order-body">
      <div class="my-title">物流单<span class="warning" style="font-weight:600">{{logistics.no}}</span>详情</div>
      <div style="margin-top:15px" v-if="logistics.checkFail">
        <el-alert :title="`${formatTime(checkFailLog.createdAt)} ${field.Logistics.checkFail.option[logistics.checkFail]}：${checkFailLog.remark}`" type="error" show-icon :closable="false">
        </el-alert>
      </div>
      <div style="margin-top:15px"></div>
      <el-alert title="商品信息" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <my-form size="mini" width="19%">
        <div class="flex ac jb" v-if="order.goods">
          <my-form-item label="名称" v-model="order.goods.name" disabled>
          </my-form-item>
          <my-form-item label="品牌" v-model="order.goods.brand.name" disabled>
          </my-form-item>
          <my-form-item label="规格" v-model="order.goods.spec" disabled>
          </my-form-item>
          <my-form-item label="库存" :value="order.goods.stock+' '+order.goods.unit" disabled>
          </my-form-item>
          <my-form-item label="下单数量" v-model="order.count" disabled>
          </my-form-item>
        </div>
      </my-form>
      <el-alert title="贸易链" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <div class="hor-scroll" style="font-size:13px;margin-bottom:10px" >
        <div class="hor-scroll-item" v-for="(item,index) in order.businessTrains" :key="index">
          <div class="flex ac">
            <el-card class="black" style="margin:10px 5px" :body-style="{ padding: '10px' }">
              <div v-if="item.customerType === 'company'">
                {{item.company && item.company.name}}
              </div>
              <div v-if="item.customerType === 'user'">
                {{(item.user && item.user.name ) + '(个人)'}}
              </div>
            </el-card>
            <div v-if="index!==order.businessTrains.length-1" class="tc" style="width:40px">
              <i class="el-icon-d-arrow-right success"></i>
            </div>
          </div>
        </div>
      </div>
      <el-alert title="物流链" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <div class="hor-scroll" style="font-size:13px;margin-bottom:10px" >
        <div class="hor-scroll-item" v-for="(item,index) in order.transportTrains" :key="index">
          <div class="flex ac">
            <el-card class="black"  style="margin:10px 5px" :body-style="{ padding: '10px' }" :style="{background:item._id === logistics.transportTrains ? '#409eff':'',color:item._id === logistics.transportTrains ? '#fff':''}">
              {{item.areaInfo}}
            </el-card>
            <div v-if="index!==order.transportTrains.length-1" class="tc" style="width:40px">
              <i class="el-icon-d-arrow-right success"></i>
            </div>
          </div>
        </div>
      </div>
      <el-alert title="物流单信息" type="info" :closable="false" style="margin:15px 0">
      </el-alert>
      <my-form size="mini" width="24%">
        <div class="flex ac jb">
          <div style="width:24%">
            <my-select label="运输工具" truck :type.sync="logisticsForm.transportation" :data.sync="logisticsForm[logisticsForm.transportation]" placeholder="运输工具"></my-select>
          </div>
          <my-form-item label="装货数量" v-model="logisticsForm.loading" type="number">
          </my-form-item>
          <my-form-item label="卸货数量" v-model="logisticsForm.landed" type="number">
          </my-form-item>
          <my-form-item label="运输单价" v-model="logisticsForm.price" type="number">
          </my-form-item>
        </div>
        <div class="flex ac jb" style="margin-top:15px">
          <my-form-item label="收货人" v-model="logisticsForm.contactName">
          </my-form-item>
          <my-form-item label="联系电话" v-model="logisticsForm.contactNumber" type="number">
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
        <div class="info">
          <i class="el-icon-info"></i> 如果物流单出于审核失败状态,更新信息可重新进行审核流程
        </div>
        <div class="f1"></div>
        <el-button icon="el-icon-refresh" size="small" type="primary" @click="update" :disabled="$route.query.role === 'dispatcherManager'">更新物流单信息</el-button>
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
      <el-button size="small" v-if="logistics.dispatcherManagerCheck && logistics.logisticsClerkCheck" type="danger">删除运单</el-button>
      <div style="padding-right:10px" v-else>
        <el-button type="danger" size="small" @click="checkFail" :disabled="!($route.query.role === 'dispatcherManager' || $route.query.role === 'logisticsClerk')">审核失败</el-button>
      </div>
      <div class="f1"></div>
      <el-button size="small" @click="back()">返回</el-button>
      <el-button v-if="logistics.dispatcherManagerCheck && logistics.logisticsClerkCheck" size="small" type="success" @click="finish()">运单完成</el-button>
      <el-button v-else size="small" type="primary" @click="check" :disabled="!($route.query.role === 'dispatcherManager' || $route.query.role === 'logisticsClerk')">审核通过</el-button>
    </div>
  </loading-box>
</template>

<script>
import Info from "../order/Info.vue";
import DistributionMap from "./DistributionMap.vue";
export default {
  components: {
    Info,
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
      order: {},
      checkFailLog: {}
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
        if (this.logistics.checkFail) {
          this.checkFailLog = await this.$ajax.post("/curdLog/findOne", {
            type: "logisticsCheckFail",
            logistics: this.logistics._id,
            sort: {
              createdAt: -1
            }
          });
        }
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
        this.$message.success("修改成功");
      } catch (error) {}
      this.loadingText = "";
    },
    async finish() {
      this.logisticsForm.state = 5;
      this.loadingText = "正在修改";
      try {
        let res = await this.$ajax.post("/logistics/update", {
          _id: this.$route.params._id,
          ...this.logisticsForm
        });
        this.back();
      } catch (error) {}
      this.loadingText = "";
    },
    async check() {
      this.loadingText = "正在修改";
      try {
        await this.$ajax.post("/logistics/check", {
          logistics: this.$route.params._id,
          role: this.$route.query.role
        });
        this.$message.success("审核成功");
        this.back();
      } catch (error) {}
      this.loadingText = "";
    },
    async checkFail() {
      this.$prompt("请输入审核失败原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputErrorMessage: "失败原因不能为空",
        inputPattern: /\S/
      })
        .then(async ({ value }) => {
          this.loadingText = "提交中";
          try {
            await this.$ajax.post("/logistics/checkFail", {
              logistics: this.$route.params._id,
              role: this.$route.query.role,
              text: value
            });
            this.back();
          } catch (error) {}
          this.loadingText = "";
        })
        .catch(() => {});
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