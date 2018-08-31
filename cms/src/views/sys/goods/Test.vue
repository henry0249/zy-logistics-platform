<template>
  <div @click="test">
    1111111111
  </div>
</template>

<script>
  export default {
    methods: {
      test() {
        this.$emit('test', 'hi');
      }
    },
    mounted() {
      this.$on(['test'], function(msg) {
        console.log(msg)
      })
    }
  }
</script>

<style scoped>

</style>