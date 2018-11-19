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
        loadingText: ''
      }
    },
    computed: {},
    methods: {
      async sub(val) {
        try {
          this.loadingText = '添加中';
          let data = {};
          if (val.table.length > 0) {} else {}
          await this.$ajax.post('/accountChange/set', { ...val.cartData,
            handle: this.company._id,
            payUserType:this.$route.query.payUserType,
            toType:this.$route.query.toUserType,
          });
        } catch (error) {}
        this.loadingText = '';
      }
    },
    created() {}
  }
</script>

<style scoped>

</style>