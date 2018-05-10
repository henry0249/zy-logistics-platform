<template>
  <loading-box class="g-container" v-model="loadingText">
    <div v-if="!platform" class="no-platform">
      <div v-if="!loadingText">
        <div>
          <icon size="30vw">meiyoushuju</icon>
        </div>
        <div style="margin-bottom:20px">
          没有找到平台数据
        </div>
        您可以
        <div v-ripple class="platform-init" @click="$router.push('/org/platform_init')">
          初始化平台
        </div>或
        <a class="platform-back" @click="$router.push('/home')">
          返回主页
        </a>
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
  .platform-init {
    margin-top: 20px;
    margin: 0 10px;
    display: inline-block;
    padding: 10px 15px;
    text-align: center;
    border-radius: 3px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, .15);
    color: #fff;
    background: #EF5350;
    cursor: pointer;
  }
  .platform-back {
    color: #aaa;
    margin-top: 15px;
    /* font-size: 10px; */
    cursor: pointer;
    color: #2196F3
  }
</style>