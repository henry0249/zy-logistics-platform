<template>
  <loading-box v-model="loadingText">
    <div>
      <div class="info tc" v-if="order.transportTrains.length===0">
        订单中尚未添加任何物流运单，请添加后再尝试关联
      </div>
    </div>
  </loading-box>
</template>

<script>
  export default {
    props: {
      order: {
        type: Object,
        default () {
          return {};
        }
      },
      list: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    data() {
      return {
        loadingText: ""
      }
    },
  };
</script>

<style scoped>

</style>