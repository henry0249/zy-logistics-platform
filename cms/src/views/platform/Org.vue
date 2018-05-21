<template>
  <loading-box class="g-container" v-model="loadingText">
    <div v-if="is('empty',platform)" class="no-platform">
      <div v-if="!loadingText">
        <div>
          <icon size="30vw">meiyoushuju</icon>
        </div>
        <div style="margin-bottom:20px">
          没有找到平台数据
        </div>
        您可以
        <div v-ripple class="platform-init" @click="init">
          快速初始化
        </div>或
        <a class="platform-back" @click="$router.push('/home')">
              返回主页
            </a>
      </div>
    </div>
    <div v-else>
      <org-tree></org-tree>
    </div>
  </loading-box>
</template>

<script>
  import OrgTree from './OrgTree'
  export default {
    components: {
      OrgTree
    },
    data() {
      return {
        loadingText: ""
      };
    },
    methods: {
      init() {
        this.$prompt("请输入平台名称", "初始化平台以便进行管理", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPlaceholder: "请输入平台名称",
          inputPattern: /^[\u4E00-\u9FA5\uF900-\uFA2D\w]+$/,
          inputErrorMessage: "平台名称不能为空"
        }).then(async({
          value
        }) => {
          this.loadingText = "正在初始化";
          try {
            this.$store.dispatch('addPlatform', {
              name: value
            });
          } catch (error) {}
          this.loadingText = "";
        });
      }
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
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
    color: #fff;
    background: #ef5350;
    cursor: pointer;
  }
  .platform-back {
    color: #aaa;
    margin-top: 15px;
    /* font-size: 10px; */
    cursor: pointer;
    color: #2196f3;
  }
</style>