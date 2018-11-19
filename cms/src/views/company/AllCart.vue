<template>
  <bank-cart :data.sync="newData" :initData="initData" style="width:100%">
  </bank-cart>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default () {
          return {};
        }
      },
      initData: {
        type: Object,
        default () {
          return {};
        }
      },
    },
    data() {
      return {
        newData: {},
      }
    },
    watch: {
      newData: {
        handler(val) {
          this.$emit('update:data', val);
        },
        deep: true
      }
    },
    methods: {},
    created() {}
  }
</script>

<style scoped>

</style>