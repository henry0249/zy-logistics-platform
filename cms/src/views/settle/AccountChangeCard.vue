<template>
  <loading-box v-model="loadingText">
    <div class="flex ac jb">
      <div class="f1">
        <AccountChangeCardItem :data.sync="form" from>
        </AccountChangeCardItem>
      </div>
      <div class="tc success" style="width:15%">
        <i class="el-icon-d-arrow-right"></i>
        <i class="el-icon-d-arrow-right"></i>
        <br><br>
        <i class="el-icon-d-arrow-right"></i>
        <i class="el-icon-d-arrow-right"></i>
      </div>
      <div class="f1">
        <AccountChangeCardItem :data.sync="form" to>
        </AccountChangeCardItem>
      </div>
    </div>
  </loading-box>
</template>

<script>
import AccountChangeCardItem from "./AccountChangeCardItem";
export default {
  components: {
    AccountChangeCardItem
  },
  data() {
    return {
      loadingText: "",
      form: {
        payUserType: "company",
        type: 1,
        value: 0,
        author: "",
        businessTrains: [],
        remittanceTime: "",
        accountingTime: "",
        from: {
          bankNo: "",
          bankName: "",
          bankInfo: ""
        },
        to: {
          bankNo: "",
          bankName: "",
          bankInfo: ""
        }
      }
    };
  },
  mounted() {
    this.form.toCompany = this.company;
  }
};
</script>

<style scoped>
</style>