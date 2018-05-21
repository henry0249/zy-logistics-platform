<template>
  <div>
  </div>
</template>

<script>
export default {
  methods: {
    async test() {
      let res = await this.$ajax.post("/test/find", {
        parent: {
          '$exists': false
        }
      });
    }
  }
};
</script>

<style scoped>

</style>