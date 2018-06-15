<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: ""
    },
    labelWidth: {
      type: String,
      default: "60px"
    },
    labelSize: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: ""
    },
    edit: {
      type: [Boolean],
      default: true
    }
  }
};
</script>

<style scoped>
</style>