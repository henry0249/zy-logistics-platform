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
    methods: {},
    async created() {
    }
  };
</script>

<style scoped>
  .g-order-create {
    padding: 0 1% 1% 1%;
  }
  .g-order {
    margin: 0 auto;
    padding: 30px;
    position: relative;
  }
  .tab-height {
    height: calc(100vh - 50px - 70px - 62px - 53px - 40px - 30px - 30px);
    padding: 0 10px;
  }
  .tab-top {
    padding: 0 0 15px 0;
    border-bottom: 1px solid #dcdfe6;
  }
  .btm-box {
    position: absolute;
    right: 30px;
    top: 30px;
    height: 33px;
  }
  .noData {
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
  }
</style>