<template>
  <div>
    <my-form size="mini" width="24%" style="margin:15px 0">
      <div class="flex form-box">
        <my-form-item class="form-right" input v-model="companyData.name" filterable label="公司名称"></my-form-item>
      </div>
    </My-form>
    <div class="tr" style="margin-top:30px">
      <el-button size="small" @click="$router.go(-1)">返 回</el-button>
      <el-button size="small" type="primary" @click="sub">修 改</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        companyData: {
          name: '',
          type: '',
          mobile: '',
          tel: '',
          self: '',
          platform: '',
          setting: '',
          info: '',
          owner: '',
          admin: '',
          salesman: '',
          documentClerk: '',
          financial: '',
          address: '',
          area: '',
        }
      }
    },
    methods: {
      sub() {
        this.$emit('sub', this.companyData)
      }
    }
  }
</script>

<style scoped>
  .form-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center
  }
  .form-right {
    margin-right: 20px
  }
</style>