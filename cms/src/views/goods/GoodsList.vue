<template>
  <goods-list :sys="false" path="/goods/edmit">
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
        console.log(val);
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