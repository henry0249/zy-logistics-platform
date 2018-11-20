<template>
  <view-app :router="router" badge-type="order"></view-app>
</template>

<script>
  import router from "./router.js";
  export default {
    data() {
      return {
        router: router
      }
    },
  }
</script>