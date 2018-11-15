<template>
  <loading-box v-model="loadingText">
    <company-invoice-item edit v-if="!loadingText" :invoiceData="invoiceData"></company-invoice-item>
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
        invoiceData: {},
        accountData: {}
      }
    },
    methods: {
      async getInvoice() {
        this.invoiceData = await this.$ajax.post('/invoice/findOne', {
          _id: this.$route.params._id,
        })
      },
    },
    async created() {
      try {
        this.loadingText = '加载中';
        await this.getInvoice();
      } catch (error) {}
      this.loadingText = '';
    }
  }
</script>

<style scoped>

</style>