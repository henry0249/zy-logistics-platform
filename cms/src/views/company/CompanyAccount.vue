<template>
  <loading-box v-if="!routeShow" v-model="loadingText">
    <div class="g-order-create" v-if="!loadingText && accountData.length > 0">
      <div class="tab-box">
        <company-account-tabs :loadingText.sync="tabsLoadingText" :userType="userType" :isUser="isUser" :initActiveName.sync="activeName" :initPayName.sync="payName" :payArr="payArr" :data="accountData" :data-js="data" @tab-click="tabClick" @tab-pay-click="tabPayClick"></company-account-tabs>
        <loading-box v-model="tableLoadingText" style="height:calc(100vh - 50px - 70px - 138px - 1vh)">
          <company-account-table v-if="!tableLoadingText" :userType="userType" :isUser="isUser" :data="tableData" :activeName="activeName" :pay-name="payName"></company-account-table>
        </loading-box>
      </div>
    </div>
    <div v-else class="tab-height noData jc">
      <span>未发现账户，你可以<el-button style="margin:0 10px;" plain size="mini" type="primary" @click="goAccountChange('5')">收款</el-button>或者<el-button plain size="mini" @click="goAccountChange('6')">预收款</el-button></span>
    </div>
  </loading-box>
  <router-view v-else></router-view>
</template>

<script>
  import CompanyAccountTabs from './CompanyAccountTabs.vue';
  import CompanyAccountTable from './CompanyAccountTable.vue';
  import data from './CompanyAccount.js';
  export default {
    components: {
      CompanyAccountTabs,
      CompanyAccountTable
    },
    props: {
      userType: {
        type: String,
        default: 'company'
      },
    },
    data() {
      return {
        loadingText: '',
        tableLoadingText: '',
        tabsLoadingText: '',
        activeName: '',
        payName: '',
        data,
        accountData: [],
        tableData: [],
        payArr: []
      }
    },
    watch: {
      $route: {
        handler(val) {
          this.$store.dispatch('getRole', this.company._id);
        }
      },
      async routeShow(val) {
        if (!val) {
          try {
            this.loadingText = '加载中';
            await this.getTabsData();
            if (this.accountData.length > 0) {
              this.obj = this.accountData[0];
              this.activeName = this.accountData[0].relationCompany._id;
              await this.getData(this.obj, 'received');
            }
            if (this.payArr.length > 0) {
              this.tableData = this.payArr[0].list;
              this.isUser = this.payArr[0].isUser;
              this.payName = this.payArr[0].type;
            } else {
              this.isUser = false;
            }
          } catch (error) {}
          this.loadingText = '';
        }
      }
    },
    computed: {
      routeShow() {
        return this.$route.query.show === 'true';
      }
    },
    methods: {
      goAccountChange(val) {
        this.$router.push({
          path: '/company/account/account_change',
          query: {
            type: val,
            titleType: 'isReceive',
            show: 'true',
            relationType: 'company',
            toUserType: 'company'
          }
        })
      },
      async tabClick(val) {
        try {
          this.tabsLoadingText = '加载中';
          await this.getTabsData();
          this.obj = this.accountData[val.index];
          this.activeName = val.name;
          this.payName = 'received';
          await this.getData(this.obj, 'received');
          this.tableData = this.payArr[val.index].list;
          this.isUser = this.payArr[val.index].isUser;
        } catch (error) {}
        this.tabsLoadingText = '';
      },
      async tabPayClick(val) {
        try {
          this.tableLoadingText = '加载中';
          this.payName = val.name;
          await this.getData(this.obj, val.name);
          this.tableData = this.payArr[val.index].list;
          this.isUser = this.payArr[val.index].isUser;
        } catch (error) {}
        this.tableLoadingText = '';
      },
      async getTabsData() {
        this.accountData = await this.$api.company.getAccountRelationTab({
          company: this.company._id
        });
      },
      async getData(obj, type) {
        let data = {
          limit: 10,
          relationType: obj.relationType
        };
        data[obj.type] = obj[obj.type];
        if (obj.relationType === 'company') {
          data.relationCompany = obj.relationCompany._id;
        } else if (obj.relationType === 'user') {
          data.relationUser = obj.relationUser._id;
        }
        if (type) {
          data.listType = type;
        }
        this.payArr = await this.$api.company.getAccountRelationList(data);
      },
    },
    async created() {
      this.$store.dispatch('getRole', this.company._id);
      if (!this.routeShow) {
        try {
          this.loadingText = '加载中';
          await this.getTabsData();
          if (this.accountData.length > 0) {
            this.obj = this.accountData[0];
            this.activeName = this.accountData[0].relationCompany._id;
            await this.getData(this.obj, 'received');
          }
          if (this.payArr.length > 0) {
            this.tableData = this.payArr[0].list;
            this.isUser = this.payArr[0].isUser;
            this.payName = this.payArr[0].type;
          } else {
            this.isUser = false;
          }
        } catch (error) {}
        this.loadingText = '';
      }
    }
  }
</script>

<style scoped>
  .g-order-create {
    padding: 0 1%;
  }
  .tab-top {
    padding: 0 0 15px 0;
    border-bottom: 1px solid #dcdfe6;
  }
</style>