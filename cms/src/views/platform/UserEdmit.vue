<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <user-item :loadingText.sync="loadingText" sub-txt="修 改" title="用户详情">
        <my-form slot="form" size="mini" width="24%" style="margin:15px 0" v-if="!loadingText">
          <div class="flex form-box">
            <my-form-item class="form-right" input v-model="userObj.name" filterable label="用户名称"></my-form-item>
            <my-form-item class="form-right" input v-model="userObj.mobile" filterable label="手机号"></my-form-item>
            <my-form-item class="form-right" input v-model="userObj.type" filterable label="类型"></my-form-item>
            <my-form-item input v-model="userObj.email" filterable label="邮箱"></my-form-item>
          </div>
        </my-form>
      </user-item>
    </div>
  </loading-box>
</template>

<script>
  import UserItem from './UserItem.vue';
  export default {
    components: {
      UserItem,
    },
    data() {
      return {
        loadingText: '',
        userData: {},
        userObj: {
          name: '',
          mobile: '',
          type: '',
          tag: [],
          email: '',
          balance: 0,
          platform: [],
          company: [],
          recommendedByUser: '',
          superior: '',
          parent: '',
          defaultAddress: '',
          address: [],
        }
      }
    },
    methods: {
      async getUser() {
        try {
          console.log(111);
          let user = await this.$api.curd({
            model: 'user',
            curdType: 'findOne',
            _id: this.$route.params._id
          });
          console.log(user);
        } catch (error) {}
      }
    },
    async created() {
      console.log(this.$route);
      this.loadingText = '加载中';
      await this.getUser();
      this.loadingText = '';
    }
  }
</script>

<style scoped>
  .g-order-create {
    padding: 3% 5%;
  }
  .form-right {
    margin-right: 20px;
  }
  .form-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
</style>