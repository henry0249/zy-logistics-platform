<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div v-if="!loadingText" class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>账户管理</strong>
        </div>
        <user-account-edit-item v-if="!loadingText" :accountValue="value" @recharge="recharge" :data="data" :accountObj.sync="accountObj"></user-account-edit-item>
      </div>
      <div class="je" style="margin-top:20px;">
        <el-button size="small" type="primary" @click="sub">修 改</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  import UserAccountEditItem from './UserAccountEditItem.vue';
  export default {
    components: {
      UserAccountEditItem
    },
    data() {
      return {
        loadingText: '',
        value: 0,
        accountObj: {},
        data: {},
      }
    },
    methods: {
      async recharge(val) {
        try {
          let recharge = await this.$api.curd({
            model: 'accountChange',
            curdType: 'add',
            account: this.data._id,
            value: val,
            type: 0,
            user: this.$route.params._id
          })
          if (recharge) {
            this.$alert('充值成功', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.$router.go(0);
              }
            });
          } else {
            this.$alert('充值失败', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.$router.go(0);
              }
            });
          }
        } catch (error) {}
      },
      sub() {},
      async getAccount() {
        try {
          this.data = await this.$api.curd({
            model: 'account',
            curdType: 'findOne',
            user: this.$route.params._id
          })
          console.log(this.data);
          for (let index = 0; index < 3; index++) {
            let recharge = await this.$api.curd({
              model: 'accountChange',
              curdType: 'find',
              type: index,
              account: this.data._id,
              check: true
            });
            if (index === 0 || index === 2) {
              recharge.forEach(item => {
                this.value += item.value
              });
            } else {
              this.value -= item.value
            }
          }
          console.log(recharge);
        } catch (error) {}
      },
      async test() {
        try {
          let res = await this.$api.curd({
            model: 'account',
            curdType: 'set',
            value: 10000,
            type: 'user',
            user: this.$route.params._id
          })
          console.log(res);
          // if (res) {
          //   let accountChange = await this.$api.curd({
          //     model:'AccountChange',
          //     curdType:'set',
          //     value:
          //   })
          // }
        } catch (error) {}
      }
    },
    async created() {
      this.loadingText = '加载中';
      // await this.getAccount();
      // await this.test();
      this.loadingText = '';
    }
  }
</script>

<style scoped>
  .g-order-create {
    padding: 3% 5%;
    height: calc(100vh - 50px);
  }
  .g-order {
    height: calc(100% - 60px);
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>