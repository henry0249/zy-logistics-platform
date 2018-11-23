<template>
  <view-app :router="router" badge-type="order"></view-app>
</template>

<script>
import router from "./router.js";
export default {
  data() {
    return {
      router: router
    };
  },
  async mounted() {
    let res = await this.$api.order.getOrderById('5bf279e6b03ea5f6a86ab598');
    console.log(res);
  }
};
</script>