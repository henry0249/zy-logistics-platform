<template>
  <loading-box v-model="loadingText">
    <company-invoice-item v-if="!loadingText" :loadmore="loadmore" :initData="initData" :accountData="accountData"></company-invoice-item>
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
        data: [],
        initData: [],
        accountData: [],
      }
    },
    computed: {},
    methods: {
      async loadmore() {
        return await this.getData();
      },
      async getData() {
        try {
          return await this.$ajax.post('/businessTrains/invoice/list', {
            company: this.company._id,
            limit: 10,
            skip: this.initData.length,
            populate: [{
              path: 'company'
            }, {
              path: 'user'
            }, {
              path: 'receivedCompany'
            }]
          })
        } catch (error) {}
      },
      async getAccount() {
        let _id = this.company._id;
        let data = [];
        let accountData1 = await this.$ajax.post("/account/find", {
          company: _id,
          populate: [{
              path: "relationCompany"
            },
            {
              path: "relationUser"
            }
          ]
        });
        let accountData2 = await this.$ajax.post('/account/find', {
          relationCompany: _id,
          populate: [{
            path: 'company'
          }, {
            path: 'user'
          }]
        });
        accountData1.forEach(item => {
          let obj = {};
          if (item.type === 'company') {
            obj = item.relationCompany;
          } else {
            obj = item.relationUser;
          }
          this.$set(obj, 'userType', item.type);
          data.push(obj);
        });
        accountData2.forEach(item => {
          let obj = {};
          if (item.type === 'company') {
            obj = item.company;
          } else {
            obj = item.user;
          }
          this.$set(obj, 'userType', item.type);
          data.push(obj);
        });
        let set = new Set()
        this.accountData = data.filter((item) => {
          return !set.has(item._id) && set.add(item._id);
        });
      },
    },
    async created() {
      try {
        this.loadingText = '加载中';
        // this.initData = await this.getData();
        await this.getAccount();
      } catch (error) {
        console.log(error);
      }
      this.loadingText = '';
    }
  }
</script>

<style scoped>

</style>