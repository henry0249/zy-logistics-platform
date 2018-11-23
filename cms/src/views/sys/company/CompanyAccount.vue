<template>
  <loading-box>
    <div class="g-order">
      <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
        <strong>{{$route.query.company_name}}账户管理</strong>
      </div>
      <company-account sys></company-account>
    </div>
  </loading-box>
</template>

<script>
  import CompanyAccount from '../../company/CompanyAccount.vue';
  export default {
    components: {
      CompanyAccount
    }
  }
</script>

<style scoped>
  .g-order {
    margin: 0 auto;
  }
</style>