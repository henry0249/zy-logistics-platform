<template>
  <stock-list v-if="show" activeName="ready"></stock-list>
  <router-view v-else></router-view>
</template>

<script>
  import StockList from './StockList.vue';
  export default {
    components: {
      StockList
    },
    data () {
      return {
        show:true
      }
    },
    watch: {
      $route:{
        handler(val){
          if (val.query._id) {
            this.show = false;
          }else{
            this.show = true;
          }
        },
        deep:true
      }
    }
  }
</script>

<style scoped>

</style>