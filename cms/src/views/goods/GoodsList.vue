<template>
  <goods-list class="body-padding" :sys="false" path="/goods/list/edit">
  </goods-list>
</template>

<script>
import GoodsList from "../sys/goods/GoodsList.vue";
export default {
  components: {
    GoodsList
  },
  data() {
    return {
      show: false
    };
  },
  watch: {
    option: {
      handler(val) {
        this.show = true;
        setTimeout(() => {
          this.show = false;
        }, 200);
      },
      deep: true
    }
  },
  computed: {
    option() {
      return {
        company: this.company._id
      };
    }
  }
};
</script>

<style scoped>
</style>