<template>
  <div>
    组织架构主页
    <br>
    <button @click="test">测试</button>
    <br>
    <button @click="$store.dispatch('logout')">注销</button>
    this.$store.state.user
  </div>
</template>

<script>
  export default {
    methods: {
      async test() {
        let res = await this.$api.curd({
          model:'user',
          curdType:'find'
        })
        console.log(res);
      },
      async logout() {
        await this.$store.dispatch('logout')
      },
    },
  };
</script>

<style scoped>

</style>