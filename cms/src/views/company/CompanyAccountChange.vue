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
            relationType: this.$route.query.relationType,
            toType: this.$route.query.toUserType,
          });
          this.$message.success('添加成功!');
          this.$router.push({
            path: '/company/account'
          })
        } catch (error) {}
        this.loadingText = '';
      }
    },
    created() {}
  }
</script>

<style scoped>

</style>