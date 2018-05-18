<template>
  <div>
    <List :thead="filed" :data="data"></List>
  </div>
</template>

<script>
  import filed from './filed';
  import List from './List';
  export default {
    components: {
      List
    },
    data() {
      return {
        filed: filed,
        data: [{
          address: '上海市普陀'
        }, {
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
  }
</script>

<style scoped>

</style>