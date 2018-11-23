<template>
  <view-app :router="router" badge-type="dispatch"></view-app>
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