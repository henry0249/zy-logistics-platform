<template>
  <div class="flex a-main">
    <el-button type="success" size="mini" :title="title" @click="add">{{title}}</el-button>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '添加平台'
      },
    },
    methods: {
      add() {
        this.$emit('add')
      }
    }
  }
</script>

<style scoped>
  .a-main {
    width: 100%;
    height: 43px;
    background: #f3f4f5;
    border-bottom: 1px solid #ccc;
    justify-content: flex-end;
    align-items: center;
  }
</style>