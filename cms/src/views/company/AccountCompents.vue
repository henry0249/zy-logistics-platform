<template>
  <loading-box v-if="!routeShow" v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>账户管理</strong>
        </div>
        <div v-if="accountData.length > 0" class="tab-box">
          <account-change-tabs v-if="show" :loadingText.sync="loadingText" :data="accountData"></account-change-tabs>
        </div>
        <div v-else class="tab-height noData jc">
          <span>未发现账户，你可以<el-button style="margin:0 10px;" plain size="mini" type="primary" @click="go('5')">收款</el-button>或者<el-button plain size="mini" @click="go('6')">预收款</el-button></span>
        </div>
        <div class="btm-box jc js">
          <el-button v-if="false" @click="go(key)" v-for="(item,key) in field.AccountChange.type.option" :key="key" size="mini">{{item}}</el-button>
          <el-button @click="go('5')" size="mini">收款</el-button>
          <el-button @click="go('6')" size="mini">预收款</el-button>
        </div>
      </div>
    </div>
  </loading-box>
  <router-view v-else></router-view>
</template>

<script>
  import AccountChangeType from "./AccountChangeType.vue";
  import AccountChangeTabs from "./AccountChangeTabs.vue";
  export default {
    components: {
      AccountChangeType,
      AccountChangeTabs
    },
    props: {
      sys: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        loadingText: "",
        show: true,
        accountData: [],
      };
    },
    computed: {
      routeShow() {
        return this.$route.query.show;
      },
    },
    methods: {
      async sub() {},
      async getAccount() {
        try {
          this.loadingText = '加载中...';
          this.show = false;
          let _id = this.sys ? this.$route.parmas._id : this.company._id;
          let data = [];
          let accountData1 = await this.$ajax.post("/account/find", {
            company: _id,
            populate: [{
                path: "relationCompany"
              },
              {
                path: "relationUser"
              }
            ]
          });
          let accountData2 = await this.$ajax.post('/account/find', {
            relationCompany: _id,
            populate: [{
              path: 'company'
            }, {
              path: 'user'
            }]
          });
          accountData1.forEach(item => {
            let obj = {};
            if (item.type === 'company') {
              obj = item.relationCompany;
            } else {
              obj = item.relationUser;
            }
            this.$set(obj, 'userType', item.type);
            data.push(obj);
          });
          accountData2.forEach(item => {
            let obj = {};
            if (item.type === 'company') {
              obj = item.company;
            } else {
              obj = item.user;
            }
            this.$set(obj, 'userType', item.type);
            data.push(obj);
          });
          let set = new Set()
          this.accountData = data.filter((item) => {
            return !set.has(item._id) && set.add(item._id);
          });
        } catch (error) {}
        this.loadingText = '';
        this.show = true;
      },
    },
    async created() {
      this.getAccount();
    }
  };
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
    position: relative;
  }
  .tab-height {
    height: calc(100vh - 50px - 70px - 62px - 53px - 40px - 30px - 30px);
    padding: 0 10px;
  }
  .tab-top {
    padding: 0 0 15px 0;
    border-bottom: 1px solid #dcdfe6;
  }
  .btm-box {
    position: absolute;
    right: 30px;
    top: 30px;
    height: 33px;
  }
  .noData {
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
  }
</style>