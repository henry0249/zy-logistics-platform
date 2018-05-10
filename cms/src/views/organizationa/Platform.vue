<template>
  <loading-box class="g-container" v-model="loadingText">
    <div v-if="!platform" class="no-platform">
      <div v-if="!loadingText">
        <div>
          <icon size="30vw">meiyoushuju</icon>
        </div>
        没有找到平台数据
      </div>
    </div>
    <div v-else>
      平台管理
    </div>
  </loading-box>
</template>

<script>
  export default {
    data() {
      return {
        loadingText: "",
        platform: ""
      };
    },
    async created() {
      this.loadingText = "加载中";
      try {
        this.platform = await this.$api.curd({
          model: "company",
          curdType: 'findOne',
          isPlatform: true
        });
      } catch (error) {}
      this.loadingText = "";
    }
  };
</script>

<style scoped>
  .no-platform {
    margin: 0 auto;
    text-align: center;
  }
</style>