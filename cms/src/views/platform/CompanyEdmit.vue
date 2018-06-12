<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div v-if="!loadingText" class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>公司详情</strong>
        </div>
        <company-edmit-item @sub="sub"></company-edmit-item>
      </div>
    </div>
  </loading-box>
</template>

<script>
import CompanyEdmitItem from './CompanyEdmitItem';
  export default {
    components: {
      CompanyEdmitItem
    },
    data() {
      return {
        loadingText: '',

      }
    },
    methods: {
      sub(val){
        console.log(val);
      },
      async getData() {
        try {
          let res = await this.$api.curd({
            model: 'company',
            curdType: 'findOne',
            _id: this.$route.params._id
          })
          console.log(res);
        } catch (error) {}
      }
    },
    async created() {
      await this.getData()
    }
  }
</script>

<style scoped>
  .g-order-create {
    padding: 3% 5%;
  }
  .g-order {
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>