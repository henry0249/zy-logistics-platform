<template>
  <loading-box v-model="loadingText">
    <company-invoice-item v-if="!loadingText" :accountData="accountData"></company-invoice-item>
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
      }
    },
    methods: {
      async getAccount() {
        try {
          this.loadingText = '加载中';
          this.accountData = await this.$ajax.post('/invoice/wait/tab', {
            company: this.company._id
          });
        } catch (error) {
          console.log(error);
        }
        this.loadingText = '';
      },
    },
    async created() {
      await this.getAccount();
    }
  }
</script>

<style scoped>

</style>