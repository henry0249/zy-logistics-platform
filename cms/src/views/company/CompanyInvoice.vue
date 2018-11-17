<template>
  <loading-box v-model="loadingText">
    <company-invoice-item v-if="!loadingText"></company-invoice-item>
  </loading-box>
</template>

<script>
  import CompanyInvoiceItem from './CompanyInvoiceItem.vue';
  export default {
    components: {
      CompanyInvoiceItem
    },
    data() {
      return {
        loadingText: '',
      }
    }
  }
</script>

<style scoped>

</style>