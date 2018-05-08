<template>
  <transition name="fade">
    <div class="alert" v-show="showFlag" :style="{zIndex:zIndex}">
      <transition name="fade-in">
        <div class="alert-main" :style="{color:color}" v-if="showFlag">
          <i class="material-icons" style="font-size:40px">{{icon}}</i>
          <div style="font-weight:500;margin-bottom:5px">
            {{type}}
          </div>
          <div style="font-size:13px;color:#607D8B">
            {{text}}
          </div>
          <div v-ripple @click.stop="hide" class="btn" :style="{boxShadow:'0 0 4px'+color,color:color}">
            关闭
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  import Vue from 'vue'
  export default {
    data() {
      return {
        icon: 'info',
        type: '提示',
        text: '一般消息',
        color: '#42A5F5',
        showFlag: false,
        zIndex: 0
      }
    },
    methods: {
      show(data = {
        type: '提示',
        text: '一般消息',
        icon: 'info',
        color: '#42A5F5'
      }) {
        this.getMaxZIndex()
        this.type = data.type
        this.text = data.text
        this.icon = data.icon
        this.color = data.color
        this.showFlag = true
      },
      hide() {
        this.showFlag = false
      },
      success(text) {
        this.show({
          type: '成功',
          text: text || '成功提示',
          icon: 'check_circle',
          color: '#66BB6A'
        })
      },
      error(text) {
        this.show({
          type: '错误',
          text: text || '错误提示',
          icon: 'cancel',
          color: '#ff5252'
        })
      },
      warn(text) {
        this.show({
          type: '警告',
          text: text || '警告提示',
          icon: 'info',
          color: '#ff9900'
        })
      },
      getMaxZIndex() {
        var divs = document.getElementsByTagName("div")
        for (var i = 0, max = 0; i < divs.length; i++) {
          max = Math.max(max, divs[i].style.zIndex || 0)
        }
        this.zIndex = max + 1
      }
    },
    mounted() {
      Vue.prototype.$alert = this
      window.$alert = this
      console.log(this);
    }
  }
</script>

<style scoped>
  .alert {
    position: relative;
    height: 100vh;
    width: 100vw;
    position: fixed;
    background: rgba(0, 0, 0, .08);
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
  }
  .alert-main {
    margin: 0 auto;
    padding: 10px 10px;
    width: 220px;
    text-align: center;
    color: #42A5F5;
    background: #fff;
    border-radius: 2px;
    position: relative;
    margin-bottom: 20vh
  }
  .btn {
    margin: 0 auto;
    margin-top: 8px;
    padding: 3px 5px;
    width: 50px;
    color: #fff;
    font-size: 13px;
    border-radius: 2px;
    cursor: pointer;
  }
</style>

