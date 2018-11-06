<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick	">
    <el-tab-pane v-for="item in newData" :name="item._id" :key="item.id" :label="item.userType === 'company'?item.name : item.name + '(个人)'">
      <div class="col-flex tab-height">
        <div class="tab-top jc jb">
          <span>结算款：<span style="margin-right:30px;" class="blue">{{accountObj.value}}</span> 预付款：<span class="danger">{{accountObj.prepaid}}</span></span>
          <div class="js">
            <el-button @click="go('5',activeName)" size="mini">收款</el-button>
            <el-button @click="go('6',activeName)" size="mini">预收款</el-button>
          </div>
        </div>
        <el-tabs v-model="payName" @tab-click="payTabClick" type="card">
          <el-tab-pane v-for="(v,i) in payArr" :name="v.key" :label="v.label" :key="`${i}pay`">
            <div slot="label">
              {{v.label}}
              <el-badge v-if="v.key === 'noCheck' || v.key === 'hasChild' || v.key === 'applyEdit'" :value="badge(v.key)" />
            </div>
            <Account-change-tabs-table :loadmore="loadmore" :data="accountChangeData" :payName="payName"></Account-change-tabs-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import AccountChangeTabsTable from './AccountChangeTabsTable.vue';
  export default {
    components: {
      AccountChangeTabsTable
    },
    props: {
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      loadingText: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        activeName: '',
        payName: 'pay',
        accountObj: {
          value: 0,
          prepaid: 0
        },
        noCheckCount: undefined,
        hasChildCount: undefined,
        applyEditCount: undefined,
        newData: [],
        accountChangeData: [],
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
        }, {
          key: 'applyEdit',
          label: '申请修改'
        }, {
          key: 'invoice',
          label: '待开票'
        }]
      }
    },
    methods: {
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
      badge(val) {
        let data = {
          noCheck: this.noCheckCount ? this.noCheckCount : undefined,
          hasChild: this.hasChildCount ? this.hasChildCount : undefined,
          applyEdit: this.applyEditCount ? this.applyEditCount : undefined
        };
        return data[val];
      },
      go(key, val) {
        this.show = false;
        let query = {
          type: key,
          show: true
        }
        if (val) {
          this.$set(query, 'company', val);
        }
        this.$router.push({
          path: "/company/account/account_change_type",
          query
        });
      },
      async payTabClick(val) {
        try {
          console.log(val);
          this.$emit('update:loadingText', '加载中');
          this.accountChangeData = [];
          if (val.name === 'invoice') {} else {
            if (val.name === 'pay' || val.name === 'applyEdit') {
              this.io = false;
            } else {
              this.io = true;
            }
            this.accountChangeData = await this.getAccountChange(this.activeName, this.str, this.io, this.payName);
          }
          this.noCheckCount = await this.getCount('noCheck');
          this.hasChildCount = await this.getCount('hasChild');
          this.applyEditCount = await this.getCount('applyEdit');
        } catch (error) {}
        this.$emit('update:loadingText', '');
      },
      async tabClick(val) {
        try {
          this.accountObj = {
            value: 0,
            prepaid: 0
          };
          this.io = false;
          this.payName = 'pay';
          this.accountChangeData = [];
          this.$emit('update:loadingText', '加载中');
          if (val.label.substr(val.label.length - 5, 4) === "(个人)") {
            this.str = "user";
          } else {
            this.str = "toCompany";
          }
          await this.getAccountValue(this.activeName);
          this.accountChangeData = [];
          this.accountChangeData = await this.getAccountChange(this.activeName, this.str, this.io, this.payName);
          this.noCheckCount = await this.getCount('noCheck');
          this.hasChildCount = await this.getCount('hasChild');
          this.applyEditCount = await this.getCount('applyEdit');
        } catch (error) {};
        this.$emit('update:loadingText', '');
      },
      async getAccountValue(_id) {
        let res = await this.$ajax.post("/account/findOne", {
          company: this.company._id,
          relationCompany: _id
        });
        if (Object.keys(res).length > 0) {
          this.accountObj = res;
        }
      },
      async getAccountChange(_id, str, io, payName) {
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
        let op = {
          pay: {
            check: true,
          },
          get: {
            check: true,
          },
          noCheck: {
            check: false,
            company: _id,
          },
          hasChild: {
            children: {
              $exists: true
            }
          },
          applyEdit: {
            children: {
              $exists: true
            }
          }
        };
        this.$set(data, 'parent', {
          $exists: false
        });
        if (payName !== 'hasChild' || payName !== 'applyEdit') {
          this.$set(data, 'children', {
            $exists: false
          });
        }
        return await this.$ajax.post("/accountChange/find", { ...data,
          ...op[payName]
        });
      },
      async getCount(val) {
        let data = {
          noCheck: {
            check: false,
            parent: {
              $exists: false
            },
            children: {
              $exists: false
            },
          },
          hasChild: {
            children: {
              $exists: true
            },
            parent: {
              $exists: false
            },
            check: true,
          },
          applyEdit: {
            children: {
              $exists: true
            },
          }
        };
        let op = {
          toCompany: this.company._id,
          company: this.activeName
        }
        if (val === 'applyEdit') {
          op = Object.assign({}, op, {
            company: this.company._id,
            toCompany: this.activeName
          })
        }
        return await this.$ajax.post('/accountChange/count', { ...data[val],
          ...op
        });
      },
      async getData() {
        try {
          this.$emit('update:loadingText', '加载中');
          if (this.activeName) {
            if (this.newData[0].userType === 'company') {
              this.str = 'toCompany';
            } else {
              this.str = 'user';
            }
            this.io = false;
            this.payName = 'pay';
            await this.getAccountValue(this.activeName);
            this.accountChangeData = [];
            this.accountChangeData = await this.getAccountChange(this.activeName, this.str, this.io, this.payName);
            this.noCheckCount = await this.getCount('noCheck');
            this.hasChildCount = await this.getCount('hasChild');
            this.applyEditCount = await this.getCount('applyEdit');
          }
        } catch (error) {
          console.log(error);
        }
        this.$emit('update:loadingText', '');
      }
    },
    async created() {
      this.newData = JSON.parse(JSON.stringify(this.data));
      this.activeName = this.newData[0]._id;
      this.$store.dispatch('getRole', this.company._id);
      await this.getData();
      if (!this.role.financialManager) {
        this.payArr.splice(2, 1);
      }
    }
  }
</script>

<style scoped>

</style>