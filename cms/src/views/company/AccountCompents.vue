<template>
  <loading-box v-if="!routeShow" v-model="loadingText">
    <div class="g-order-create">
      <div class="tab-box">
        <account-change-tabs v-if="!loadingText" :loadingText.sync="loadingText"></account-change-tabs>
      </div>
    </div>
  </loading-box>
  <router-view v-else></router-view>
</template>

<script>
  import AccountChangeTabs from "./AccountChangeTabs.vue";
  export default {
    components: {
      AccountChangeTabs
    },
    props: {
      sys: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        loadingText: "",
      };
    },
    computed: {
      routeShow() {
        return this.$route.query.show === true || this.$route.query.show === 'true';
      },
    },
    async created() {}
  };
</script>

<style scoped>
  .g-order-create {
    padding: 0 1%;
  }
  .tab-top {
    padding: 0 0 15px 0;
    border-bottom: 1px solid #dcdfe6;
  }
</style>