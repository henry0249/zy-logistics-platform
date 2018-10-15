<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>账户管理</strong>
        </div>
      </div>
      <div class="tr jb" style="margin-top:30px">
        <div>
          <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        </div>
        <el-button size="small" type="primary" @click="sub">修 改</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  export default {
    props: {
      sys: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        loadingText: ''
      }
    },
    methods: {
      async sub() {},
      async getAccount() {
        try {
          this.loadingText = '加载中...';
          let account = await this.$ajax.post('/account/find', {
            company: this.company._id
          })
        } catch (error) {}
        this.loadingText = '';
      }
    },
    created() {
      this.getAccount();
    }
  }
</script>

<style scoped>
  .g-order-create {
    padding: 0 1% 1% 1%;
  }
  .g-order {
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>