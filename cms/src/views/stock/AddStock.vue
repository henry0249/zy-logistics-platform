<template>
  <loading-box v-model="loadingText" style="padding: 3% 5%;margin:0 auto">
    <stock-info @submit="submit"></stock-info>
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
        data: {},
        loadingText: ''
      };
    },
    methods: {
      async submit(data) {
        if (this.checkMethods(data)) {
          try {
            this.loadingText = '加载中';
            let op = {
              model: 'stock',
              curdType: 'set',
            };
            for (const key in data) {
              this.$set(op, key, data[key])
            }
            let res = await this.$api.curd(op);
            this.$message.warn('添加成功！');
            this.$router.push({
              path: '/stock/index'
            })
          } catch (error) {}
          this.loadingText = '';
        }
      },
      checkMethods(data) {
        let check = true;
        if (data.num <= 0) {
          this.$message.warn('数量必须大于0');
          check = false;
        }
        return check;
      }
    },
  };
</script>

<style scoped>

</style>