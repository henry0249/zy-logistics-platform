<template>
  <loading-box v-model="loadingText">
    <company-invoice-item edit v-if="!loadingText" :accountData="accountData" :invoiceData="invoiceData"></company-invoice-item>
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
        accountData: [],
        invoiceData: {}
      }
    },
    methods: {
      async getAccount() {
        this.accountData = await this.$ajax.post('/invoice/wait/tab', {
          company: this.company._id
        });
      },
      async getInvoice() {
        this.invoiceData = await this.$ajax.post('/invoice/findOne', {
          _id: this.$route.params._id
        })
      },
    },
    async created() {
      try {
        this.loadingText = '加载中';
        await this.getAccount();
        await this.getInvoice();
      } catch (error) {}
      this.loadingText = '';
    }
  }
</script>

<style scoped>

</style>