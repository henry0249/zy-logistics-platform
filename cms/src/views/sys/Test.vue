<template>
  <div>
    <common-multi-selection company :data.sync="data" :label="label" width="50%" size="mini" border></common-multi-selection>
    <!-- <my-select :data.sync="value" label="国会山" user width="35%"></my-select> -->
    <!-- <Test :data.sync="data"></Test>
    <company-role-user></company-role-user> -->
  </div>
</template>

<script>
import Test from '../common/CommonCompanyRole.vue';
import CompanyRoleUser from '../common/CompanyRoleUser.vue';
export default {
  components: {
    Test,
    CompanyRoleUser
  },
  data() {
    return {
      label:'用户',
      data:[],
      value:''
    };
  },
  watch: {
    data:{
      handler(val){
        console.log(val);
      },
      deep:true
    }
  }
};
</script>

<style scoped>
</style>