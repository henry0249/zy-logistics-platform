<template>
  <loading-box v-if="!routeShow" v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>账户管理</strong>
        </div>
        <div class="tab-box">
          <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick	">
            <el-tab-pane v-for="item in accountData" :name="item.type === 'company'?item.relationCompany._id : item.relationUser._id" :key="item.id" :label="item.type === 'company'?item.relationCompany.name : item.relationUser.name + '(个人)'">
              <div class="col-flex tab-height">
                <div class="tab-top">
                  <span>结算款：<span class="blue">{{item.value}}</span> 预付款：<span class="danger">{{item.prepaid}}</span></span>
                </div>
                <el-tabs v-model="payName" @tab-click="payTabClick" type="card">
                  <el-tab-pane v-for="(v,i) in payArr" :name="v.key" :label="v.label" :key="`${i}pay`">
                    <my-table height="calc(100vh - 50px - 70px - 62px - 53px - 40px - 30px - 30px - 37px - 40px)" index :loadmore="loadmore" stripe :thead="thead" :data.sync="accountChangeData" size="mini" border>
                      <div slot-scope="scope">
                        <el-tag size="mini" v-if="scope.prop === 'type'" :type="typeOption(scope.row[scope.prop])">{{field.AccountChange.type.option[scope.row[scope.prop]]}}</el-tag>
                        <div v-if="scope.prop === 'payUser'">{{payUser(scope.row).user}}
                          <el-tag size="mini" :type="payUser(scope.row).type">{{field.AccountChange.payUserType.option[scope.row.payUserType]}}</el-tag>
                        </div>
                        <div v-if="scope.prop === 'value'" class="link" title="点击查看详情" @click="res(scope)">{{scope.row[scope.prop]}}</div>
                        <div v-if="scope.prop === 'check'" :class="scope.row[scope.prop]?'blue':'link'" :title="scope.row[scope.prop]?'':'点击进行审核'" @click="check(scope)">{{scope.row[scope.prop]?'已审核':'待审核'}}</div>
                      </div>
                    </my-table>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="btm-box jc js">
          <el-button v-if="false" @click="go(key)" v-for="(item,key) in field.AccountChange.type.option" :key="key" size="mini">{{item}}</el-button>
          <el-button @click="go('5')" size="mini">收款</el-button>
        </div>
      </div>
    </div>
  </loading-box>
  <router-view v-else></router-view>
</template>

<script>
  import AccountChangeType from "./AccountChangeType.vue";
  export default {
    components: {
      AccountChangeType
    },
    props: {
      sys: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        show: true,
        str: '',
        payName: 'pay',
        loadingText: "",
        activeName: "",
        io: false,
        tableHeight: 'calc(100% - 37px)',
        accountData: [],
        accountChangeData: [],
        payArr: [{
          key: 'pay',
          label: '付款流水'
        }, {
          key: 'get',
          label: '收款记录'
        }]
      };
    },
    watch: {
      async routeShow(val) {
        if (!val) {
          await this.getData();
        }
      }
    },
    computed: {
      routeShow() {
        return this.$route.query.show;
      },
      thead() {
        let thead = {
          value: {
            name: '金额',
            readOnly: true,
            slot: true
          },
          type: {
            name: '类型',
            slot: true
          },
          payUser: {
            name: '付款方',
            slot: true
          },
          'from.account': {
            name: '收款卡号',
            readOnly: true
          },
          'to.account': {
            name: '付款卡号',
            readOnly: true
          },
          remittanceTime: {
            name: '转账日期',
            readOnly: true
          },
          accountingTime: {
            name: '到账日期',
            readOnly: true
          },
          check: {
            name: '是否已审核',
            slot: true
          }
        };
        return thead;
      },
      companyArr() {
        let data = [];
        this.accountData.forEach(item => {
          data.push(item.relationCompany);
        });
        return data;
      }
    },
    methods: {
      check(scope) {
        if (!scope.row.check) {
          if (this.role.financialManager) {
            this.resMethods(scope, true);
          }
        }
      },
      resMethods(scope, check) {
        this.$router.push({
          path: '/company/account/account_edmit/' + scope.row._id,
          query: {
            type: this.payName === 'get' ? '5' : scope.row.type,
            check: check ? true : false,
            show: true
          }
        })
      },
      res(scope, check) {
        if (scope.row.check) {
          if (this.role.financialManager) {
            this.resMethods(scope);
          }
        } else {
          if (this.role.financialManager || this.role.settle) {
            this.resMethods(scope);
          }
        }
      },
      async loadmore() {
        return await this.getAccountChange(this.activeName, this.str, this.io);
      },
      payUser(val) {
        let data = {};
        if (val.payUserType === 'user') {
          this.$set(data, 'user', val.user.name);
          this.$set(data, 'type', 'success');
        } else if (val.payUserType === 'company') {
          this.$set(data, 'user', val.company.name);
          this.$set(data, 'type', 'info');
        } else {
          data = val.mobile;
          this.$set(data, 'user', val.mobile);
          this.$set(data, 'type', 'warning');
        }
        return data;
      },
      typeOption(val) {
        let data = {
          0: '',
          1: 'success',
          2: 'info',
          3: 'warning',
          4: 'danger',
        };
        return data[val];
      },
      async payTabClick(val) {
        try {
          this.loadingText = '加载中';
          if (val.name === 'get') {
            this.io = true;
          } else {
            this.io = false;
          }
          this.accountChangeData = [];
          this.accountChangeData = await this.getAccountChange(this.activeName, this.str, this.io);
        } catch (error) {}
        this.loadingText = '';
      },
      async tabClick(val) {
        try {
          this.io = false;
          this.payName = 'pay';
          this.accountChangeData = [];
          this.loadingText = "加载中";
          if (val.label.substr(val.label.length - 5, 4) === "(个人)") {
            this.str = "user";
          } else {
            this.str = "toCompany";
          }
          this.accountChangeData = [];
          this.accountChangeData = await this.getAccountChange(this.activeName, this.str, this.io);
        } catch (error) {}
        this.loadingText = "";
      },
      go(key) {
        this.show = false;
        this.$router.push({
          path: "/company/account/account_change_type",
          query: {
            type: key,
            show: true
          }
        });
      },
      async sub() {},
      async getAccount() {
        let _id = this.sys ? this.$route.parmas._id : this.company._id;
        this.accountData = await this.$ajax.post("/account/find", {
          company: _id,
          populate: [{
              path: "relationCompany"
            },
            {
              path: "relationUser"
            }
          ]
        });
        if (this.accountData.length > 0) {
          this.activeName = this.accountData[0].type === 'company' ? this.accountData[0].relationCompany._id : this.accountData[0].relationUser._id;
        }
      },
      async getAccountChange(_id, str, io) {
        let company_id = this.company._id
        let data = {
          company: company_id,
          populate: [{
            path: 'toCompany'
          }, {
            path: 'company'
          }, {
            path: 'user'
          }],
          limit: 10,
          skip: this.accountChangeData.length
        };
        if (str) {
          this.$set(data, str, _id);
        }
        if (io) {
          this.$set(data, str, company_id);
          this.$set(data, 'company', _id);
        }
        return await this.$ajax.post("/accountChange/find", data);
      },
      async getBusinessTrains() {
        this.businessTrainsData = await this.$ajax.post("businessTrains/find", {
          company: this.company._id,
          receivedCompany: {
            $exists: true
          }
        });
      },
      async getData() {
        try {
          this.loadingText = "加载中...";
          await this.getAccount();
          if (this.activeName) {
            if (this.accountData[0].type === 'company') {
              this.str = 'toCompany';
            } else {
              this.str = 'user';
            }
            this.accountChangeData = [];
            this.accountChangeData = await this.getAccountChange(this.activeName, this.str, this.io);
          }
          await this.getBusinessTrains();
        } catch (error) {}
        this.loadingText = "";
      }
    },
    async created() {
      console.log(this.$route.query.show);
      if (this.$route.query.show === 'false') {
        this.$router.push({
          path: '/company/account',
          query: {}
        })
      }
      this.$store.dispatch('getRole', this.company._id);
      await this.getData();
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
</style>