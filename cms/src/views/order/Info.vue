<template>
  <loading-box v-model="loadingText">
    <div v-if="title" class="order-title" style="margin-bottom:15px">
      <strong>{{title}}</strong>
    </div>
    <my-form v-show="!hideForm" size="mini" width="24%" :edit="edit">
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
        <my-form-item input :popover="companyUserCascader.length>0?true:undefined" v-model="order.contactName" label="收货人">
          <div slot="inputPopover">
            <free-select :data="companyUserCascader" @change="companyUserCascaderChange"></free-select>
          </div>
        </my-form-item>
        <my-form-item input v-model="order.contactNumber" label="联系电话">
        </my-form-item>
        <my-form-item v-model="areaSelect" area filterable @change="areaCascaderChange" :show-all-levels="false" label="送货地址">
        </my-form-item>
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
    title: {
      type: String,
      default: ""
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
  watch: {
    order: {
      handler: function(val) {
        this.$emit("update:data", val);
      },
      deep: true
    }
  },
  data() {
    return {
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
      loadingText: "",
      hideForm: false,
      customer: [],
      areaSelect: [],
      areaCascader: [],
      userCascader: [],
      companyUserCascader: []
    };
  },
  methods: {
    async getData() {
      this.loadingText = "加载中";
      this.userCascader = [];
      this.areaCascader = [];
      try {
        this.userCascader = await this.$ajax("/user/cascader");
        this.areaCascader = await this.$ajax("/area/cascader");
      } catch (error) {}
      this.loadingText = "";
    },
    async areaCascaderChange(val) {
      this.order.area = val[val.length - 1];
      let area = await this.$ajax.post("/area/findOne", {
        _id: val[val.length - 1],
        populate: [
          {
            path: "province"
          },
          {
            path: "city"
          },
          {
            path: "county"
          },
          {
            path: "township"
          },
          {
            path: "street"
          }
        ]
      });
      this.order.address = this.area2name(area);
    },
    async userCascaderChange(val) {
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
      if (val[0] === "user") {
        delete this.order.company;
      }
      if (val[0] === "company") {
        delete this.order.user;
      }
      this.order[val[0]] = val[1];
      this.order.contactName = data.name;
      this.order.contactNumber = data.mobile || data.tel;
      if (val[0] === "company") {
        this.companyUserCascader = await this.$ajax(
          "/company/user/cascader?company=" + val[1]
        );
      }
    },
    companyUserCascaderChange(val){
      if (val) {
        if (val.name) {
          this.order.contactName = val.name;
        }
        if (val.mobile || val.tel) {
          this.order.contactNumber = val.mobile || val.tel;
        }
      }
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
    await this.getData();
    for (const key in this.order) {
      if (this.data.hasOwnProperty(key)) {
        this.order[key] = this.data[key];
      }
    }
    //初始化客户选择
    if (this.data.user) {
      this.customer = ["user", this.data.user._id];
    }
    if (this.data.company) {
      this.customer = ["company", this.data.company._id];
    }
    //初始化区域选择
    if (this.data.area) {
      this.areaSelect = [];
      let areaSelectType = ["province", "city", "county", "township"];
      areaSelectType.forEach(item => {
        if (this.data.area[item]) {
          this.areaSelect.push(this.data.area[item]._id);
        }
      });
      this.areaSelect.push(this.data.area._id);
    }
  }
};
</script>

<style scoped>
.order-title {
  font-size: 20px;
  text-align: center;
}
</style>