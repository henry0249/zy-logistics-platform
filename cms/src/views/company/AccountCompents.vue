<template>
  <loading-box v-if="!routeShow" v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>账户管理</strong>
        </div>
        <div v-if="accountData.length > 0" class="tab-box">
          <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick	">
            <el-tab-pane v-for="item in accountData" :name="item._id" :key="item.id" :label="item.userType === 'company'?item.name : item.name + '(个人)'">
              <div class="col-flex tab-height">
                <div class="tab-top">
                  <span>结算款：<span style="margin-right:30px;" class="blue">{{accountObj.value}}</span> 预付款：<span class="danger">{{accountObj.prepaid}}</span></span>
                </div>
                <el-tabs v-model="payName" @tab-click="payTabClick" type="card">
                  <el-tab-pane v-for="(v,i) in payArr" :name="v.key" :label="v.label" :key="`${i}pay`">
                    <my-table op opWidth="45" height="calc(100vh - 50px - 70px - 62px - 53px - 40px - 30px - 30px - 37px - 40px)" index :loadmore="loadmore" stripe :thead="thead" :data.sync="accountChangeData" size="mini" border>
                      <div slot="op" class="jc" slot-scope="scope">
                        <i style="color:#909399" class="el-icon-view pointer" @click="check(scope)" :title="payName === 'noCheck'?'点击进行审核':'点击查看详情'"></i>
                      </div>
                      <div slot-scope="scope">
                        <el-tag size="mini" v-if="scope.prop === 'type'" :type="typeOption(scope.row[scope.prop])">{{field.AccountChange.type.option[scope.row[scope.prop]]}}</el-tag>
                        <div v-if="scope.prop === 'payUser'">{{payUser(scope.row).user}}
                          <el-tag size="mini" :type="payUser(scope.row).type">{{field.AccountChange.payUserType.option[scope.row.payUserType]}}</el-tag>
                        </div>
                        <div v-if="scope.prop === 'getUser'">{{getUser(scope.row).user}}
                          <el-tag size="mini" :type="getUser(scope.row).type">{{field.AccountChange.payUserType.option[scope.row.payUserType]}}</el-tag>
                        </div>
                        <div v-if="scope.prop === 'value'" class="blue">{{scope.row[scope.prop]}}</div>
                        <div v-if="scope.prop === 'check'" :class="scope.row[scope.prop]?'blue':'link'" :title="scope.row[scope.prop]?'':'点击进行审核'" @click="check(scope)">{{scope.row[scope.prop]?'已审核':'待审核'}}</div>
                      </div>
                    </my-table>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-tab-pane>
          </el-tabs>
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
        accountObj: {
          value: 0,
          prepaid: 0
        },
        payArr: [{
          key: 'pay',
          label: '付款记录'
        }, {
          key: 'get',
          label: '收款记录'
        }, {
          key: 'noCheck',
          label: '待审核'
        }, {
          key: 'hasChild',
          label: '待修改'
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
          'to.account': {
            name: '付款卡号',
            readOnly: true
          },
          getUser: {
            name: '收款方',
            slot: true
          },
          'from.account': {
            name: '收款卡号',
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
          // check: {
          //   name: '是否已审核',
          //   slot: true
          // }
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
      addAcount() {
        this.$router.push({
          path: '/company/account/account_add',
          query: {
            type: 'company',
            relationType: 'company',
            show: true
          }
        })
      },
      check(scope) {
        if (!scope.row.check) {
          if (this.role.financialManager) {
            this.resMethods(scope, true);
          }
        } else {
          this.resMethods(scope);
        }
      },
      resMethods(scope, check) {
        let type = scope.row.type;
        if (this.payName === 'get' || this.payName === 'noCheck') {
          if (scope.row.type === 1) {
            type = '5';
          } else if (scope.row.type === 4) {
            type = '6';
          }
        };
        this.$router.push({
          path: '/company/account/account_edmit/' + scope.row._id,
          query: {
            type,
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
        return await this.getAccountChange(this.activeName, this.str, this.io, this.payName);
      },
      getUser(val) {
        let data = {};
        if (val.payUserType === 'user') {
          this.$set(data, 'user', val.toUser.name);
          this.$set(data, 'type', 'info');
        } else if (val.payUserType === 'company') {
          this.$set(data, 'user', val.toCompany.name);
          this.$set(data, 'type', 'success');
        } else {
          data = val.mobile;
          this.$set(data, 'user', val.mobile);
          this.$set(data, 'type', 'warning');
        }
        return data;
      },
      payUser(val) {
        let data = {};
        if (val.payUserType === 'user') {
          this.$set(data, 'user', val.user.name);
          this.$set(data, 'type', 'info');
        } else if (val.payUserType === 'company') {
          this.$set(data, 'user', val.company.name);
          this.$set(data, 'type', 'success');
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
          if (val.name === 'pay') {
            this.io = false;
          } else {
            this.io = true;
          }
          this.accountChangeData = [];
          this.accountChangeData = await this.getAccountChange(this.activeName, this.str, this.io, this.payName);
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
          await this.getAccountValue(this.activeName);
          this.accountChangeData = [];
          this.accountChangeData = await this.getAccountChange(this.activeName, this.str, this.io, this.payName);
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
      async getAccountValue(_id) {
        let res = await this.$ajax.post("/account/findOne", {
          company: this.company._id,
          relationCompany: _id
        });
        if (Object.keys(res).length > 0) {
          this.accountObj = res;
        }
      },
      async getAccount() {
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
        if (this.accountData.length > 0) {
          this.activeName = this.accountData[0]._id;
        }
      },
      async getAccountChange(_id, str, io, check) {
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
        if (check === 'noCheck') {
          this.$set(data, 'check', false);
          this.$set(data, str, company_id);
          this.$set(data, 'company', _id);
          this.$set(data, 'children', {
            $exists: false
          });
        } else if (check === 'hasChild') {
          this.$set(data, 'check', true);
          this.$set(data, 'children', {
            $exists: true
          });
        } else {
          this.$set(data, 'check', true);
          this.$set(data, 'children', {
            $exists: false
          });
        }
        this.$set(data, 'parent', {
          $exists: false
        });
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
            if (this.accountData[0].userType === 'company') {
              this.str = 'toCompany';
            } else {
              this.str = 'user';
            }
            this.io = false;
            this.payName = 'pay';
            await this.getAccountValue(this.activeName);
            this.accountChangeData = [];
            this.accountChangeData = await this.getAccountChange(this.activeName, this.str, this.io, this.payName);
          }
          await this.getBusinessTrains();
        } catch (error) {}
        this.loadingText = "";
      }
    },
    async created() {
      if (this.$route.query.show === 'false') {
        this.$router.push({
          path: '/company/account',
          query: {}
        })
      }
      this.$store.dispatch('getRole', this.company._id);
      await this.getData();
      if (!this.role.financialManager) {
        this.payArr.splice(2, 1);
      }
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