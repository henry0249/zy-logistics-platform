<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div v-if="!loadingText" class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>账户管理</strong>
        </div>
        <user-account-edit></user-account-edit>
      </div>
      <div class="je" style="margin-top:20px;">
        <el-button size="small" type="primary" @click="sub">修 改</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  import UserAccountEdit from '../../platform/UserAccountEdit.vue';
  export default {
    components: {
      UserAccountEdit
    },
    props: {
      propName: {
        type: Number,
        default: 0
      },
    },
    data() {
      return {
        loadingText: ''
      }
    },
    methods: {
      sub() {},
    },
    created() {
    }
  }
</script>

<style scoped>
  .g-order-create {
    padding: 0 1% 1% 1%;
    max-height: calc(100vh - 50px);
  }
  .g-order {
    height: calc(100% - 60px);
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>