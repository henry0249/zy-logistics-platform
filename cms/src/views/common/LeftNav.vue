<template>
  <div class="g-left-nav">
    <div class="g-nav">
      <div @click="toggleMenu" v-ripple class="tc nav-item" style="border-bottom:1px solid #F5F5F5">
        <icon size="10">{{mini?'menuunfold':'meunfold'}}</icon>
      </div>
      <div v-for="item in nav" :key="item.id">
        <el-tooltip v-if="item.icon" effect="dark" :content="item.name" placement="right" :disabled="!mini">
          <div v-ripple class="nav-item flex ac">
            <div>
              <icon>{{item.icon}}</icon>
            </div>
            <div style="width:120px" v-if="!mini" class="f1 tf1" :style="{marginLeft:item.icon?'10px':''}">
              {{ item.name }}定位及对外的忘记大家玩i的经纬度
            </div>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Tooltip
  } from "element-ui";
  export default {
    components: {
      [Tooltip.name]: Tooltip
    },
    props: {
      nav: {
        type: Array,
        default () {
          return [{
              name: "商品类型",
              color: "red",
              icon: "ec"
            },
            {
              name: "商品列表",
              color: "orange",
              icon: "icon-liebiao",
              count: 10
            },
            {
              name: "上架管理",
              icon: "icon-shangjia2",
              color: "green"
            },
            {
              name: "添加商品",
              icon: "icon-tianjiashangpin",
              color: "blue"
            }
          ];
        }
      }
    },
    data() {
      return {
        mini: false
      };
    },
    methods: {
      toggleMenu() {
        this.mini = !this.mini;
      }
    }
  };
</script>

<style scoped>
  .g-left-nav {
    border-right: 1px solid #eee;
    color: #263238;
  }
  .nav-item {
    padding: 0px 2rem;
    line-height: 50px;
    height: 50px;
  }
  .nav-item:hover {
    background: #eee;
    cursor: pointer;
  }
</style>