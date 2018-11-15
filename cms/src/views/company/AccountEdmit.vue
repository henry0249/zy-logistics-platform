<template>
  <loading-box v-model="loadingText">
    <account-change-type :init-data="initData" v-if="!loadingText" edmit></account-change-type>
  </loading-box>
</template>

<script>
  import AccountChangeType from './AccountChangeType.vue';
  export default {
    components: {
      AccountChangeType
    },
    data() {
      return {
        loadingText: '',
        initData: {}
      }
    },
    methods: {
      async getAccountChange() {
        let data = {
          _id: this.$route.params._id,
          populate: [{
            path: 'user'
          }, {
            path: 'company'
          }, {
            path: 'toCompany'
          }, {
            path: 'children',
            populate: [{
              path: 'user'
            }, {
              path: 'company'
            }, {
              path: 'toCompany'
            }]
          }]
        }
        this.initData = await this.$ajax.post('/accountChange/findOne', data);
      },
      async getCompanyByQuery() {
        let res = await this.$ajax.post('/company/findOne', {
          _id: this.$route.query.company
        })
        if (res) {
          this.$set(this.initData, 'company', res);
        }
        this.loadingText = '';
      }
    },
    async created() {
      try {
        this.loadingText = '加载中...';
        await this.getAccountChange();
        if (this.$route.query.company) {
          await this.getCompanyByQuery();
        }
      } catch (error) {}
      this.loadingText = '';
    }
  }
</script>

<style scoped>

</style>