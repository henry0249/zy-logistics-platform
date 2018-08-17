<template>
  <!-- <transition name="fade-in"> -->
  <div class="message" :style="{zIndex:zIndex}">
    <transition-group name="list-complete" tag="p">
      <Item :key="item.text" @hide="hide" :data="item" :index="index" v-for="(item,index) in list" class="list-complete-item">
      </Item>
    </transition-group>
  </div>
  <!-- </transition> -->
</template>

<script>
import Vue from "vue";
import Item from "./MessageItem";
export default {
  components: {
    Item
  },
  data() {
    return {
      list: [],
      zIndex: -1
    };
  },
  methods: {
    show(
      data = {
        text: "一般消息",
        icon: "icon-ebc",
        color: "#42A5F5",
        time: 2000
      }
    ) {
      this.getMaxZIndex();
      let flag = true;
      this.list.forEach(item => {
        if (item.text === data.text) {
          flag = false;
        }
      });
      if (flag) {
        this.list.unshift(data);
        setTimeout(() => {
          this.list.splice(this.list.length - 1, 1);
        }, data.time);
      }
    },
    hide(index) {
      this.list.splice(index, 1);
    },
    success(text) {
      this.show({
        text: text || "成功消息",
        icon: "icon-e2",
        color: "#4CAF50",
        time: 2000
      });
    },
    error(text) {
      this.show({
        text: text || "错误消息",
        icon: "icon-edc",
        color: "#FF5252",
        time: 2000
      });
    },
    warn(text) {
      this.show({
        text: text || "警告消息",
        icon: "icon-e3",
        color: "#FFC107",
        time: 2000
      });
    },
    warning(text) {
      this.show({
        text: text || "警告消息",
        icon: "icon-e3",
        color: "#FFC107",
        time: 2000
      });
    },
    info(text) {
      this.show({
        text: text || "一般消息",
        icon: "icon-ebc",
        color: "#2196F3",
        time: 2000
      });
    },
    getMaxZIndex() {
      var divs = document.getElementsByTagName("div");
      for (var i = 0, max = 0; i < divs.length; i++) {
        max = Math.max(max, divs[i].style.zIndex || 0);
      }
      this.zIndex = max + 1;
    }
  },
  mounted() {
    Vue.prototype.$message = this;
    window.$message = this;
  }
};
</script>

<style scoped>
.message {
  position: fixed;
  font-size: 16px;
  top: 35vh;
  left: calc(50% - 110px);
}
.list-complete-item {
  transition: all 300ms;
  display: inline-block;
}
.list-complete-enter,
  .list-complete-leave-to
  /* .list-complete-leave-active for below version 2.1.8 */
 {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>

