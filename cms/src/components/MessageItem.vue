<template>
  <div class="main">
    <div class="msg-icon">
      <icon :color="data.color" size="16">{{data.icon}}</icon>
    </div>
    <!-- <i class="material-icons msg-icon" :style="{color:data.color}">{{data.icon}}</i> -->
    <div class="text" :style="{color:data.color}">
      {{data.text}}
    </div>
    <div class="close" @click.stop="hide(index)">
      <icon>icon-ee1</icon>
    </div>
    <!-- <i @click.stop="hide(index)" class="material-icons close">close</i> -->
    <div v-if="this.data.time > 0" class="progress" :style="{background:data.color,width:progress+'%'}">
    </div>
  </div>
</template>

<script>
export default {
  props: ["data", "index"],
  methods: {
    hide() {
      this.$emit("hide", this.index);
    }
  },
  data() {
    return {
      progress: 0,
      sti: ""
    };
  },
  mounted() {
    if (this.data.time > 0) {
      let sti = setInterval(() => {
        if (this.progress < 100) {
          this.progress++;
        }
        if (this.progress === 100) {
          if (sti) {
            window.clearTimeout(sti);
          }
        }
      }, this.data.time / 100);
    }
  }
};
</script>

<style scoped>
.main {
  margin: 0 auto;
  padding: 10px 10px;
  border-radius: 2px;
  background: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  width: 220px;
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 10px;
}
.text {
  font-size: 14px;
  flex: 1;
  text-align: center;
}
.msg-icon {
  margin-right: 10px;
}
.close {
  margin-left: 10px;
  color: #ccc;
  cursor: pointer;
}
.progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  border-radius: 2px;
  /* animation: progress 2000ms 1 linear */
}
/* @keyframes progress {
        from {
          width: 0%
        }
        to {
          width: 100%
        }
      } */
</style>


