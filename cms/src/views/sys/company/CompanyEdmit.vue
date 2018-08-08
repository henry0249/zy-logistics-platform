<template>
  <loading-box v-model="value">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>查看详情</strong>
        </div>
        <common-alert style="margin:15px 0">公司详情</common-alert>
        <company-edmit-item v-model="value" :data.sync="companyArr" :startData="startCompanyArr"></company-edmit-item>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        <el-button :disabled="disabled" size="small" type="primary" @click="sub">修 改</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  import CompanyEdmitItem from './CompanyEdmitItem';
  export default {
    components: {
      CompanyEdmitItem
    },
    data() {
      return {
        value: '',
        disabled: true,
        companyArr: {},
        startCompanyArr:{},
        roleStartDate:[],
        roleArr:[]
      }
    },
    methods: {
      sub() {},
      async getCompany() {
        try {
          this.startCompanyArr = await this.$api.curd({
            model: 'company',
            curdType: 'findOne',
            _id:this.$route.params._id
          })
        } catch (error) {}
      },
      async getCompanyRole(){
        try {
          let res = await this.$api.curd({
            model:'role',
            curdType:'find',
            company:this.$route.params._id,
            populate
          })
          if (res) {
            res.forEach(resItem => {
              
            });
          }
        } catch (error) {
          
        }
      }
    },
    async created() {
      this.value = '加载中';
      await this.getCompany();
      await this.getCompanyRole();
      this.value = '';
    }
  }
</script>

<style scoped>
  .g-order-create {
    padding: 3% 5%;
  }
  .g-order {
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>