<template>
  <div class="g-left-nav hide-scroll">
    <div style="background-color:#545c64" class="collapse-change" @click="isCollapse=!isCollapse">
      <icon size="10" style="transition: all .5s;" :class="{collapse:!isCollapse}">icon-caidan</icon>
    </div>
    <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :open="defaultActive" unique-opened :default-active="defaultActive" :router="router" class="my-el-menu-vertical hide-scroll" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
      <el-submenu v-if="item.children" :index="item.path||''" v-for="item in nav" :key="item.id">
        <div slot="title" :class="{ac:!isCollapse||!item.children}">
          <icon :size="''+item.iconSize||14" style="margin:0 5px">{{item.icon}}</icon>
          <div v-if="!isCollapse || !item.children" class="tf1" style="width:110px" slot="title">
            {{item.name}}
          </div>
        </div>
        <el-menu-item :index="sub.path" v-for="sub in item.children" :key="sub.id">
          <div slot="title" class="ac">
            <icon :size="''+sub.iconSize||14" style="margin:0 5px">{{sub.icon}}</icon>
            <div slot="title" class="tf1">
              {{sub.name}}
            </div>
          </div>
        </el-menu-item>
      </el-submenu>
      <el-menu-item :index="item.path||''" v-else>
        <el-badge v-if="item.badge!==undefined && item.badge>0 && isCollapse" :value="item.badge">
          <icon :size="''+item.iconSize||14" style="margin:0 5px">{{item.icon}}</icon>
        </el-badge>
        <icon v-else :size="''+item.iconSize||14" style="margin:0 5px">{{item.icon}}</icon>
        <span slot="title">{{item.name}}</span>
        <el-badge v-if="item.badge!==undefined && item.badge>0 && !isCollapse" style="float:right" class="mark" :value="item.badge" />
        <div v-if="item.badge!==undefined && item.badge===0 && !isCollapse" style="float:right">
          <icon color="#aaa">icon-nothing</icon>
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
  height: calc(100vh - 50px - 37px);
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}
.my-el-menu-vertical.el-menu--collapse {
  border-right: 1px solid #545c64;
  height: calc(100vh - 50px - 36px);
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}
.collapse-change {
  text-align: center;
  cursor: pointer;
  border-bottom: 1px solid #aaa;
  /* border-right: 1px solid #aaa; */
  color: #aaa;
  height: 36px;
  line-height: 36px;
  box-sizing: border-box;
}
.collapse {
  transform: rotate(90deg);
}
.badgeNull {
  background: #eee;
  display: inline-block;
  clear: both;
}
</style>