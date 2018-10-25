<template>
  <loading-box v-if="show" v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>账户管理</strong>
        </div>
        <div class="tab-box">
          <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane v-for="item in accountData" :name="item._id" :key="item.id" :label="item.relationCompany?item.relationCompany.name : item.relationUser.name + '(个人)'">
              <div class="col-flex tab-height">
                <div class="tab-top">
                  <span>金额：<span class="blue">{{item.value}}</span> 预付款：<span class="danger">{{item.prepaid}}</span></span>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="btm-box jc js">
          <el-button v-if="false" @click="go(key)" v-for="(item,key) in field.AccountChange.type.option" :key="key" size="mini">{{item}}</el-button>
          <el-button  @click="go(5)" size="mini">收款</el-button>
        </div>
      </div>
    </div>
  </loading-box>
  <router-view v-else></router-view>
</template>

<script>
  import AccountChangeType from './AccountChangeType.vue';
  export default {
    components: {
      AccountChangeType
    },
    props: {
      sys: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        show: true,
        loadingText: '',
        activeName: '',
        accountData: [],
        accountChangeData: [],
      }
    },
    watch: {
      $route: {
        handler(val) {
          if (val.query.type) {
            this.show = false;
          } else {
            this.show = true;
          }
        },
        deep: true
      }
    },
    computed: {
      companyArr() {
        let data = [];
        this.accountData.forEach(item => {
          data.push(item.relationCompany);
        });
        return data;
      }
    },
    methods: {
      go(key) {
        this.show = false;
        this.$router.push({
          path: '/company/account/account_change_type',
          query: {
            type: key
          }
        })
      },
      async sub() {},
      async getAccount() {
        let _id = this.sys ? this.$route.parmas._id : this.company._id;
        this.accountData = await this.$ajax.post('/account/find', {
          company: _id,
          populate: [{
            path: 'relationCompany'
          },{
            path: 'relationUser'
          }]
        })
        if (this.accountData.length > 0) {
          this.activeName = this.accountData[0]._id;
          console.log(this);
        }
      },
      async getAccountChange() {
        let data = [];
        this.accountData.forEach(item => {
          data.push(item.relationCompany._id);
        });
        this.accountChangeData = await this.$ajax.post('/accountChange/find', {
          account: {
            $in: data
          }
        })
      },
      async getBusinessTrains() {
        this.businessTrainsData = await this.$ajax.post('businessTrains/find', {
          company: this.company._id,
          receivedCompany: {
            $exists: true
          }
        })
      }
    },
    async created() {
      if (!this.$route.query.type) {
        this.show = true;
        try {
          this.loadingText = '加载中...';
          await this.getAccount();
          await this.getAccountChange();
          await this.getBusinessTrains();
        } catch (error) {}
        this.loadingText = '';
      } else {
        this.show = false;
      }
    },
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
    position: relative;
  }
  .tab-height {
    height: calc(100vh - 50px - 70px - 62px - 53px - 40px - 30px - 30px);
    padding: 0 10px;
  }
  .tab-top {
    padding: 0 0 15px 0;
    border-bottom: 1px solid #DCDFE6;
  }
  .btm-box {
    position: absolute;
    right: 30px;
    top: 30px;
    height: 33px;
  }
</style>