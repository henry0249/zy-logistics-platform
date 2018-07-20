<template>
  <loading-box v-model="loadingText">
    <div v-if="title" class="order-title" style="margin-bottom:15px">
      <strong>{{title}}</strong>
    </div>
    <el-alert v-if="alert" title="订单信息" type="info" :closable="false" style="margin:15px 0">
      <el-checkbox v-model="isCompany" style="margin-left:50px;color:#909399;font-size:10px">公司订单</el-checkbox>
    </el-alert>
    <my-form v-show="!hideForm" size="mini" width="24%" :edit="edit">
      <div class="flex ac jb">
        <div style="width:24%">
          <common-select title="选择一个客户" :label="isCompany?'下单公司':'下单用户'" border :data.sync="customer" :type="order.type" @change="customerChange"></common-select>
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
        <my-form-item @click.native="showCompanyUserCascader" input :popover="isCompany?true:undefined" v-model="order.contactName" label="收货人">
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
      order: {
        type:'company',
        settlementMethod: 1,
        transportModel: 0,
        deliveryTime: "",
        invoiceType: 0,
        contactName: "",
        contactNumber: "",
        area: {},
        address: "",
        remark: ""
      },
      loadingText: "",
      hideForm: false,
      customer: {},
      isCompany: true,
      areaSelect: {},
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
    },
    isCompany(val) {
      delete this.order.user;
      delete this.order.company;
      if (val) {
        this.order.type = "company";
      } else {
        this.order.type = "user";
      }
      this.customer = {};
    }
  },
  methods: {
    async showCompanyUserCascader() {
      if (this.isCompany && this.customer._id) {
        this.companyUserCascaderLoaidng = "加载中...";
        try {
          this.companyUserCascader = await this.$ajax(
            "/company/user/cascader?company=" + this.customer._id
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
    customerChange(val){
      delete this.order.user;
      delete this.order.company;
      this.order[this.order.type] = val;
    },
    areaChange(val) {
      this.order.address = this.area2name(val) + " ";
    },
    check() {
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
      if (!order.user && !order.company) {
        this.$message.error("未选择客户");
        return;
      }
      if (order.user && order.company) {
        this.$message.error("客户不能同时选择个人和公司");
        return;
      }
      return true;
    }
  },
  async created() {
    for (const key in this.order) {
      if (this.val.hasOwnProperty(key)) {
        this.order[key] = this.val[key];
      }
    }
    this.loadingText = "加载中";
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