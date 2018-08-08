<template>
  <loading-box v-model="loadingText">
    <div v-if="title" class="order-title" style="margin-bottom:15px">
      <strong>{{title}}</strong>
    </div>
    <el-alert v-if="alert" title="订单信息" type="info" :closable="false" style="margin:15px 0">
      <span>&nbsp;&nbsp;({{order.type==='company'?'公司订单':'个人订单'}})</span>
    </el-alert>
    <my-form v-show="!hideForm" size="mini" width="24%" :edit="edit">
      <div class="flex ac jb">
        <div style="width:24%">
          <common-select :disabled="!edit" title="选择一个客户" label="下单客户" border :data.sync="customer" type="company" :changeType.sync="order.type" @change="customerChange" is-switch @switchChange="customerTypeChange"></common-select>
        </div>
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
        <my-form-item @click.native="showCompanyUserCascader" input :popover="order.type==='company'?true:undefined" v-model="order.contactName" label="收货人">
          <div slot="inputPopover">
            <loading-box v-model="companyUserCascaderLoaidng">
              <free-select :data="companyUserCascader" @change="companyUserCascaderChange"></free-select>
            </loading-box>
          </div>
        </my-form-item>
        <my-form-item input v-model="order.contactNumber" label="联系电话">
        </my-form-item>
        <common-select style="width:24%" title="选择送货地址" label="送货地址" border :data.sync="order.area" type="area" @change="areaChange"></common-select>
      </div>
      <my-form-item width="100%" style="margin:15px 0" input v-model="order.address" label="详细地址">
      </my-form-item>
      <my-form-item width="100%" input type="textarea" v-model="order.remark" autosize label="订单备注">
      </my-form-item>
    </my-form>
  </loading-box>
</template>

<script>
import { goods } from "./field";
export default {
  props: {
    alert: {
      type: Boolean,
      default: true
    },
    selectType: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    val: {
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
    edit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      customer: {},
      order: {
        type: "company",
        mfrs: {},
        user: {},
        company: {},
        settlementMethod: 1,
        transportModel: 0,
        deliveryTime: "",
        invoiceType: 0,
        contactName: "",
        contactNumber: "",
        area: {},
        address: "",
        remark: "",
        goods: {},
        count: 0,
        factory: 0,
        sell: 0,
        transport: 0
      },
      loadingText: "",
      hideForm: false,
      companyUserCascaderLoaidng: "加载中...",
      companyUserCascader: []
    };
  },
  watch: {
    order: {
      handler: function(val) {
        this.$emit("update:data", val);
      },
      deep: true
    }
  },
  methods: {
    orderTypeChange(val) {
      this.order.user = {};
      this.order.company = {};
      if (val) {
        this.order.type = "company";
      } else {
        this.order.type = "user";
      }
    },
    async showCompanyUserCascader() {
      if (this.order.type === "company" && this.order.company._id) {
        this.companyUserCascaderLoaidng = "加载中...";
        try {
          this.companyUserCascader = await this.$ajax(
            "/company/user/cascader?company=" + this.order.company._id
          );
        } catch (error) {}
        this.companyUserCascaderLoaidng = "";
      } else {
        this.companyUserCascaderLoaidng = "";
      }
    },
    companyUserCascaderChange(val) {
      if (val) {
        if (val.name) {
          this.order.contactName = val.name;
        }
        if (val.mobile || val.tel) {
          this.order.contactNumber = val.mobile || val.tel;
        }
      }
    },
    customerChange(val) {
      this.order[this.order.type] = val;
      if (this.order.type === "user") {
        this.order.contactName = val.name || "";
        this.order.contactNumber = val.mobile || "";
      }
    },
    customerTypeChange(val) {
      this.order.type = val;
    },
    areaChange(val) {
      this.order.address = this.area2name(val) + " ";
    },
    check() {
      let order = this.order;
      if (!order[order.type]._id) {
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
      if (!order.area._id) {
        this.$message.error("未选择送货地址");
        return;
      }
      if (!order.goods._id) {
        this.$message.error("未选择商品");
        return;
      }
      if (Number(order.count)<=0) {
        this.$message.error("商品数量必须大于0");
        return;
      }
      if (Number(order.factory)<=0) {
        this.$message.error("商品出厂单价必须大于0");
        return;
      }
      if (Number(order.sell)<=0) {
        this.$message.error("商品销售单价必须大于0");
        return;
      }
      if (Number(order.transport)<=0) {
        this.$message.error("商品运输单价必须大于0");
        return;
      }
      return true;
    }
  },
  async created() {
    this.loadingText = "加载中";
    if (this.val._id) {
      this.customer = this.val[this.val.type];
      this.order = JSON.parse(JSON.stringify(this.val));
    } else {
      this.order.orderCompany = this.loginInfo.company._id;
      this.$emit("update:data", JSON.parse(JSON.stringify(this.order)));
    }
    setTimeout(() => {
      this.loadingText = "";
    }, 200);
  }
};
</script>

<style scoped>
.order-title {
  font-size: 20px;
  text-align: center;
}
</style>