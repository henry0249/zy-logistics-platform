<template>
  <settle-table current-state="financialManager" new-state="finish" submit-text="审核通过并结账"></settle-table>
</template>

<script>
  import SettleTable from './SettleTable.vue';
  export default {
    components: {
      SettleTable
    }
  }
</script>

<style scoped>

</style>