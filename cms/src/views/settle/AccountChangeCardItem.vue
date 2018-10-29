<template>
  <el-card class="box-card">
    <div slot="header" class="flex ac jb">
      <div type="text" :class="isFrom?'warning':'success'" style="margin-right:15px">
        {{isFrom?'付款方':'收款方'}}
      </div>
      <div class="info">
        {{name}}
        <i v-if="isFrom" class="el-icon-edit el-icon--left blue pointer"></i>
      </div>
      <div class="f1"></div>
      <div class="warning">¥</div>
      <div style="font-size:18px;width:25%;margin-left:5px;">
        <input :disabled="!isFrom" class="f1 warning tr" type="number" style="border:none;outline:none;border-bottom: 1px solid #eee;font-size:18px;width:100%" v-model="data.value">
      </div>
    </div>
    <div class="flex ac form-item info" v-for="(val,key) in formField" :key="key">
      <div>{{val}}</div>
      <div style="width:5%"></div>
      <input class="f1 my-input" type="text" v-model="data[type][key]">
    </div>
    <div class="flex ac form-item info" v-if="isFrom">
      <div>汇款时间</div>
      <div style="width:5%"></div>
      <input class="f1 my-input" type="text" v-model="data[type].remittanceTime">
    </div>
    <div class="flex ac form-item info" v-else>
      <div>到账时间</div>
      <div style="width:5%"></div>
      <input class="f1 my-input" type="text" v-model="data[type].accountingTime">
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      formField: {
        bankNo: "银行卡号",
        bankName: "所属银行",
        bankInfo: "银行名称"
      }
    };
  },
  computed: {
    type() {
      let res = "from";
      if (this.$attrs.to !== undefined) {
        res = "to";
      }
      return res;
    },
    isFrom() {
      return this.type === "from";
    },
    name() {
      let res = "";
      if (this.type === "to") {
        res =
          this.data.toCompany &&
          this.data.toCompany.mobile &&
          this.data.toCompany.name;
      }
      if (this.type === "from") {
        if (this.data.payUserType === "company") {
          res =
            this.data.fromCompany &&
            this.data.toCompany.mobile &&
            this.data.toCompany.name;
        }
        if (this.data.payUserType === "user") {
          res =
            this.data.fromUser &&
            this.data.fromUser.mobile &&
            this.data.fromUser.name;
        }
        if (this.data.payUserType === "mobile") {
          res = this.data.mobile;
        }
      }
      return res || "未填写";
    }
  }
};
</script>

<style scoped>
.form-item {
  padding: 15px 0;
}
.my-input {
  border: none;
  outline: none;
  border-bottom: 1px solid #eee;
  border: 1px solid #eee;
  padding: 5px 10px;
  border-radius: 4px;
  box-sizing: border-box;
  color: #606266
}
</style>