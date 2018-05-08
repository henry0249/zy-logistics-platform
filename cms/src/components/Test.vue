<template>
  <div>
    test
    <div>
      <slot :data="test">
        666
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        test: 'slot-scope'
      }
    },
  }
</script>

<style scoped>

</style>