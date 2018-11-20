<template>
  <div>
    <div class="g-nav flex ac jc">
      <div @click="navClick(item)" class="flex ac nav-item" :class="{active:item.path === activePath,borderRight:index!== data.length-1}" v-for="(item,index) in data" :key="item.id">
        <icon v-if="item.icon" :size="''+item.iconSize||14" class="el-icon--left">{{item.icon}}</icon>
        {{ item.name }}
        <el-badge v-if="item.badge!==undefined && item.badge>0" :value="item.badge" />
      </div>
    </div>
    <div class="body-padding flex ac" style="height:35px">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/order' }"><i class="el-icon-menu el-icon--left"></i>首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in $route.matched" :key="item.id" :to="{ path: item.path }" v-if="item.name !== $route.name">{{item.name}}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.query.parentPath && $route.query.parentName" :to="{ path: $route.query.parentPath }">{{$route.query.parentName}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$route.name}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="f1"></div>
      <div class="info" v-if="$route.meta && $route.meta.desc">
        <i class="el-icon-warning"></i>
        {{$route.meta.desc}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    navClick(item) {
      if (!item.path) {
        this.$message.info(item.name + "即将开放");
        return;
      }
      this.$router.push(item.path);
      let res;
      if (this.$route.matched && this.$route.matched.length > 0) {
        res = this.$route.matched[0].path;
      }
      this.$emit("change", res);
    }
  },
  computed: {
    activePath() {
      let res = "";
      this.$route.matched.forEach(matchedItem => {
        this.data.forEach(navItem => {
          if (navItem.path === matchedItem.path) {
            res = navItem.path;
          }
        });
      });
      return res;
    }
  }
};
</script>

<style scoped>
.g-nav {
  background: #f3f4f5;
  color: #606266;
}
.nav-item {
  line-height: 35px;
  padding: 0 30px;
  cursor: pointer;
}
.borderRight {
  border-right: 1px solid #e4e7ed;
}
.nav-item.active {
  color: #409eff;
  background: #fff;
}
</style>