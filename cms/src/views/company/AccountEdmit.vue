<template>
  <loading-box v-model="loadingText">
    <account-change-type :init-data="initData" v-if="!loadingText" edmit>
    </account-change-type>
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
        try {
          this.loadingText = '加载中';
          let data = {
            _id: this.$route.params._id,
            populate: [{
              path: 'user'
            }, {
              path: 'company'
            }, {
              path: 'toCompany'
            }]
          }
          this.initData = await this.$ajax.post('/accountChange/findOne', data);
        } catch (error) {
          console.log(error);
        }
        this.loadingText = '';
      }
    },
    created() {
      console.log(this.$route);
      this.getAccountChange();
    }
  }
</script>

<style scoped>

</style>