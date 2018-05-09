<template>
  <div class="flex add-main">
    <div class="flex add-header">{{$route.query.title}}</div>
    <div class="flex add-box">
      <div class="flex add-list" v-for="item in key" :key="item.id">
        <span style="width:70px">{{item.keyValue}}:</span>
        <div class="flex add-select" v-if="item.type == 'input'">
          <el-input v-model="item.value" :placeholder="'请输入'+item.keyValue"></el-input>
        </div>
        <div class="flex add-select" v-else>
          <span style="flex:1"></span>
          <el-button size="small">默认按钮</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import keyObj from './key';
  export default {
    data() {
      return {
        key: [],
        keyObj,
      }
    },
    created() {
      console.log(this.$route);
      this.key = this.keyObj[this.$route.query.str]
    }
  }
</script>

<style scoped>
  .add-main {
    width: 100%;
    height: 100%;
    background: #fff;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .add-header {
    width: calc(100% - 40px);
    height: 45px;
    border-bottom: 1px solid #c9cbcc;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .add-box {
    width: calc(100% - 40px);
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .add-list {
    width: 500px;
    height: 40px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .add-select {
    flex: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 100%；
  }
</style>