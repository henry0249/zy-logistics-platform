<template>
  <loading-box v-model="loadingText" style="padding: 0 1%;margin:0 auto">
    <stock-info ref="info" v-if="!loadingText" :goodsId.sync="goodsId" @submit="submit"></stock-info>
  </loading-box>
</template>

<script>
  import StockInfo from "./StockInfo.vue";
  export default {
    components: {
      StockInfo
    },
    data() {
      return {
        goodsId: '',
        data: {},
        goods: [],
        loadingText: ''
      };
    },
    watch: {
      company:{
        handler(val){
          this.loadingText = '加载中';
          this.$nextTick(()=>{
            this.loadingText = '';
          })
        }
      }
    },
    methods: {
      async submit(data) {
        console.log(data);
        try {
          this.loadingText = '加载中';
          console.log(data);
          let setStock = await this.$ajax.post('/stock/multi',data);
          this.$message.success('操作成功');
          this.$router.push({path:'/stock/home'});
        } catch (error) {}
        this.loadingText = '';
      }
    },
    created() {
    }
  };
</script>

<style scoped>

</style>