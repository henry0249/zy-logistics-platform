<template>
  <div class="g-left-nav hide-scroll">
    <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :open="defaultActive" unique-opened :default-active="defaultActive" :router="router" class="my-el-menu-vertical hide-scroll">
      <el-menu-item  v-for="item in nav" :key="item.id" :index="item.path||''" :disabled="item.disabled">
        <div slot="title" style="display:inline">
          <icon v-if="item.icon" :size="''+item.iconSize||14" style="margin-right:10px">{{item.icon}}</icon>
          {{item.name}}
        </div>
        <div style="position:absolute;right:20px;top:3.5px">
          <el-badge v-if="item.badge!==undefined && item.badge>0" class="mark" :value="item.badge" /> 
        </div>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {
    nav: {
      type: Array,
      default() {
        return [];
      }
    },
    router: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      mini: false,
      isCollapse: false,
      defaultActive: ""
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  watch: {
    $route() {
      this.defaultActive = this.$route.path;
    }
  },
  mounted() {
    this.defaultActive = this.$route.path;
  }
};
</script>

<style>
.g-left-nav {
  font-size: 14px;
}
.my-el-menu-vertical:not(.el-menu--collapse) {
  border-right: 1px solid #545c64;
  width: 200px;
  height: calc(100vh - 50px);
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}
/* .my-el-menu-vertical.el-menu--collapse {
  border-right: 1px solid #545c64;
  height: calc(100vh - 50px - 36px);
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
} */
</style>