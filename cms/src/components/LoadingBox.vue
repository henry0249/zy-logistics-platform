<template>
  <div  v-loading="value" :element-loading-text="value" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: String,
        default: ''
      },
    },
  }
</script>

<style scoped>

</style>