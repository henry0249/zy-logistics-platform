<template>
  <loading-box v-model="loadingText">
    <All @sub="sub"></All>
  </loading-box>
</template>

<script>
  import All from './All.vue';
  export default {
    components: {
      All
    },
    data() {
      return {
        loadingText: '',
      }
    },
    methods: {
      async sub(val) {
        console.log(val);
        try {
          this.loadingText = '添加中';
          if (val.table.length > 0) {} else {}
          await this.$ajax.post('/invoice/set', { ...val.cartData,
            toType: val.cartData.to.userType,
          });
          this.$message.success('添加成功!');
          this.$router.push({
            path: '/company/account'
          })
        } catch (error) {}
        this.loadingText = '';
      },
    },
    created() {}
  }
</script>

<style scoped>

</style>