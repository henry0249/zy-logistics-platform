<template>
  <div>
    <div class="g-order">
      <div v-if="!loadingText" class="flex ac jc" style="font-size:22px;padding-bottom:20px">
        <strong>{{title}}</strong>
      </div>
      <slot name="form"></slot>
    </div>
    <div class="tr" style="margin-top:30px">
      <el-button size="small" @click="back()">返 回</el-button>
      <el-button size="small" type="primary" @click="sub">{{subTxt}}</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      loadingText: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: '用户详情'
      },
      subTxt: {
        type: String,
        default: '修 改'
      }
    },
    data() {
      return {}
    },
    methods: {
      sub() {
        this.$emit('update:loadingText', '')
        this.$emit('sub', )
      }
    },
  }
</script>

<style scoped>
  .g-order {
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>