<template>
  <div class="g-left-nav">
    <div class="g-nav">
      <el-tooltip  effect="dark" content="展开菜单" placement="right" :disabled="!mini">
        <div @click="toggleMenu" v-ripple class="tc nav-item" style="border-bottom:1px solid #F5F5F5">
          <icon color="#616161" size="10">{{mini?'menuunfold':'meunfold'}}</icon>
        </div>
      </el-tooltip>
      <div v-if="!item.hide" v-for="(item,index) in nav" :key="item.id">
        <el-tooltip v-if="item.icon" effect="dark" :content="item.name" placement="right" :disabled="!mini">
          <div @click="itemClick(item)" v-ripple class="nav-item flex ac" :class="{active:index === activeNavIndex}">
            <icon :color="item.color">{{item.icon}}</icon>
            <div style="width:120px" v-if="!mini" class="f1 tf1" :style="{marginLeft:item.icon?'10px':''}">
              {{ item.name }}
            </div>
            <div class="active-border" v-if="index === activeNavIndex">

            </div>
          </div>
        </el-tooltip>
      </div>
      <div class="nav-item" v-if="noMenu">
        无可操作菜单
      </div>
    </div>
  </div>
</template>

<script>
import { Tooltip } from "element-ui";
export default {
  components: {
    [Tooltip.name]: Tooltip
  },
  props: {
    autoJump: {
      type: Boolean,
      default: true
    },
    nav: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      mini: false
    };
  },
  computed: {
    activeNavIndex() {
      let res = -1;
      this.nav.forEach((item, index) => {
        if (item.path === this.$route.path) {
          res = index;
        }
      });
      return res;
    },
    noMenu() {
      if (!this.nav) {
        return true;
      }
      let hideCount = 0;
      this.nav.forEach(item => {
        if (item.hide) {
          hideCount++;
        }
      });
      return hideCount === this.nav.length;
    }
  },
  methods: {
    toggleMenu() {
      this.mini = !this.mini;
    },
    itemClick(item) {
      if (this.autoJump) {
        if (!item.path) {
          this.$message.info(item.name + "即将开放");
          return
        }
        this.$router.push(item.path);
      }
      this.$emit("itemClick", item);
    }
  }
};
</script>

<style scoped>
.g-left-nav {
  border-right: 1px solid #eee;
  color: #424242;
  height: calc(100vh - 41px);
  overflow-x: hidden;
  overflow-y: auto;
}
.g-left-nav::-webkit-scrollbar {
  display: none;
}
.nav-item {
  padding: 15px 2rem;
  position: relative;
  transition: all 300ms;
}
.nav-item:hover {
  /* background: #FAFAFA; */
  cursor: pointer;
  color: #42a5f5;
}
.nav-item.active {
  background: #eee;
}
.active-border {
  position: absolute;
  width: 2px;
  height: 100%;
  top: 0;
  right: 0;
  background: #42a5f5;
  border-radius: 4px;
}
</style>