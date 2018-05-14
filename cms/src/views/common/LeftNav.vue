<template>
  <div class="g-left-nav">
    <div class="collapse-change" @click="isCollapse=!isCollapse">
      <icon size="10" style="transition: all .5s;" :class="{collapse:!isCollapse}">icon-caidan</icon>
    </div>
    <el-menu :open="defaultActive" unique-opened :default-active="defaultActive" router class="my-el-menu-vertical" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
      <el-submenu v-if="item.children" :index="item.path||''" v-for="item in nav" :key="item.id">
        <div slot="title" :class="{ac:!isCollapse||!item.children}">
          <icon size="14" style="margin:0 5px">{{item.icon}}</icon>
          <div v-if="!isCollapse || !item.children" class="tf1" style="width:110px" slot="title">
            {{item.name}}
          </div>
        </div>
        <el-menu-item :index="sub.path" v-for="sub in item.children" :key="sub.id">
          <div slot="title" class="ac">
            <!-- <i class="el-icon-location"></i> -->
            <icon size="14" style="margin:0 5px">{{sub.icon}}</icon>
            <div slot="title" class="tf1">
              {{sub.name}}
            </div>
          </div>
        </el-menu-item>
      </el-submenu>
      <el-menu-item :index="item.path||''" v-else>
        <icon size="14" style="margin:0 5px">{{item.icon}}</icon>
        <span slot="title">{{item.name}}</span>
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
    defaultActive: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      mini: false,
      isCollapse: false
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style>
.g-left-nav {
  font-size: 14px;
}
.my-el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  height: calc(100vh - 51px);
}
.collapse-change {
  padding: 10px 0;
  text-align: center;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
  color: #aaa;
}
.collapse {
  transform: rotate(90deg);
}
</style>