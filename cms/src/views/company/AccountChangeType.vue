<template>
  <loading-box v-model="loadingText" v-if="!loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>{{title}}单</strong>
        </div>
        <my-form width="24%" size="mini">
          <div class="jc jb" style="margin-top:15px;">
            <bank-cart :data.sync="data" :initData="newData" style="width:100%" :key="1"></bank-cart>
          </div>
        </my-form>
        <div v-if="hasChild">
          <div class="flex ac jc" style="font-size:22px;padding:31px 0 20px 0">
            <strong>修改后</strong>
          </div>
          <my-form width="24%" size="mini">
            <div class="jc jb" style="margin-top:15px;">
              <bank-cart :data.sync="children" :initData="childrenData" style="width:100%" :key="2"></bank-cart>
            </div>
          </my-form>
        </div>
      </div>
      <div class="tr jb" style="margin-top:30px">
        <div>
          <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        </div>
        <div class="jc js">
          <el-button size="small" type="primary" @click="sub">{{subText}}</el-button>
        </div>
      </div>
    </div>
  </loading-box>
</template>

<script>
  export default {
    props: {
      companyArr: {
        type: Array,
        default () {
          return [];
        }
      },
      edmit: {
        type: Boolean,
        default: false
      },
      initData: {
        type: Object,
        default () {
          return {}
        }
      },
      isUser: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loadingText: '',
        io: false,
        changeChild: false,
        data: {},
        children: {},
        accountChangeData: {},
        childrenData: {},
        newData: {
          value: 0,
          from: {
            bank: '',
            bankName: '',
            account: '',
            type: '',
            remark: ''
          },
          to: {
            bank: '',
            bankName: '',
            account: '',
            type: '',
            remark: ''
          },
          remittanceTime: '',
          accountingTime: '',
          toCompany: {},
          company: {}
        },
      };
    },
    watch: {
      children: {
        handler(val) {
          this.changeChild = true;
        }
      },
      data: {
        handler(val) {
          this.io = true;
        },
        deep: true
      }
    },
    computed: {
      hasChild() {
        if (this.accountChangeData.children) {
          return true;
        } else {
          return false;
        }
      },
      title() {
        let data = '';
        if (this.$route.query.type === '5') {
          data = '收款';
        } else if (this.$route.query.type === '6') {
          data = '预收款';
        } else {
          data = this.field.AccountChange.type.option[this.$route.query.type]
        }
        return data;
      },
      subText() {
        let data = '添加';
        if (this.edmit) {
          if (this.$route.query.check) {
            data = '审核';
          } else if (this.ispay) {
            if (this.hasChild) {
              data = '确认修改';
            } else {
              data = '修改';
            }
          } else {
            data = '提交修改申请';
          }
        }
        return data;
      },
      ispay() {
        let data = false;
        if (this.isUser) {
          //  
          //    判断该用户是否有直接修改流水权限的代码逻辑
          //
          //
        } else {
          if (this.accountChangeData.toCompany._id === this.company._id) {
            data = true;
          } else {
            data = false;
          }
        }
        return data;
      },
    },
    methods: {
      async sub() {
        if (this.$route.query.check) {
          if (this.role.financialManager) {
            this.edmitAccountChange('check');
          } else {
            this.$message.warn('您不是财务经理，没有该权限');
          }
        } else {
          if (this.edmit) {
            this.edmitAccountChange();
          } else {
            this.setAccountChange();
          }
        }
      },
      async edmitAccountChange(check) {
        try {
          this.loadingText = check ? '提交审核中...' : '修改中...';
          if (!this.ispay) {
            this.loadingText = '提交修改申请中...';
          };
          let find = {
            _id: this.$route.params._id
          };
          let newData = this.io ? this.data : this.newData;
          if (this.hasChild) {
            newData = this.changeChild ? this.children : this.childrenData;
            this.$set(newData, '_id', this.newData._id);
            delete newData.parent;
          }
          let update = JSON.parse(JSON.stringify(newData));
          this.$set(update, 'company', this.data.company._id);
          if (typeof(this.data.toCompany) === 'string') {
            this.$set(update, 'mobile', this.data.toCompany);
          } else {
            this.$set(update, 'toCompany', this.data.toCompany._id);
          }
          if (check) {
            this.$set(update, 'check', true);
          }
          let path = check ? '/accountChange/check' : '/accountChange/update';
          let data = check ? '已审核' : '修改成功';
          if (!this.ispay) {
            path = '/accountChange/payUserUpdateApply';
            data = '提交修改申请成功';
          }
          await this.$ajax.post(path, update);
          this.$message.success(data);
          this.$router.push({
            path: '/company/account',
            query: {
              show: false
            }
          })
        } catch (error) {}
        this.loadingText = '';
      },
      async setAccountChange() {
        try {
          this.loadingText = '添加中';
          let setOption = {
            value: this.data.value,
            from: this.data.from,
            to: this.data.to,
            payUserType: this.data.from.type,
            type: Number(this.$route.query.type),
            remittanceTime: this.formatTime(this.data.remittanceTime, 'YYYY-MM-DD'),
            accountingTime: this.formatTime(this.data.accountingTime, 'YYYY-MM-DD'),
            handle: this.company._id
          }
          if (this.$route.query.type === '5') {
            this.$set(setOption, 'type', 1);
            this.$set(setOption, 'toCompany', this.data.toCompany._id);
            if (typeof(this.data.company) === 'string') {
              this.$set(setOption, 'mobile', this.data.company);
            } else {
              this.$set(setOption, 'company', this.data.company._id);
            }
          } else if (this.$route.query.type === '6') {
            this.$set(setOption, 'type', 4);
            this.$set(setOption, 'toCompany', this.data.toCompany._id);
            if (typeof(this.data.company) === 'string') {
              this.$set(setOption, 'mobile', this.data.company);
            } else {
              this.$set(setOption, 'company', this.data.company._id);
            }
          } else {
            this.$set(setOption, 'company', this.data.company._id);
            if (typeof(this.data.toCompany) === 'string') {
              this.$set(setOption, 'mobile', this.data.toCompany);
            } else {
              this.$set(setOption, 'toCompany', this.data.toCompany._id);
            }
          }
          if (this.io) {
            await this.$ajax.post('/accountChange/set', setOption);
          }
          this.$message.success('添加成功');
          this.$router.push({
            path: '/company/account',
            query: {
              show: false
            }
          });
        } catch (error) {}
        this.loadingText = '';
      },
      async getAccountChange() {
        try {
          this.loadingText = '加载中...';
          this.accountChangeData = await this.$ajax.post('/accountChange/findOne', {
            _id: this.$route.params._id,
            populate: [{
              path: 'toCompany'
            }, {
              path: 'children',
              populate: [{
                path: 'toCompany'
              }, {
                path: 'company'
              }]
            }]
          })
          if (this.accountChangeData.children) {
            this.childrenData = this.accountChangeData.children;
          }
        } catch (error) {}
        this.loadingText = '';
      },
    },
    async created() {
      if (Object.keys(this.initData).length > 0) {
        this.newData = JSON.parse(JSON.stringify(this.initData));
      }
      if (!this.edmit) {
        if (this.$route.query.type === '5' || this.$route.query.type === '6') {
          this.$set(this.newData, 'toCompany', this.company);
          this.$set(this.newData, 'company', {});
          this.$set(this.newData.to, 'disabled', true);
        } else {
          this.$set(this.newData, 'company', this.company);
          this.$set(this.newData, 'toCompany', {});
          this.$set(this.newData.from, 'disabled', true);
        }
      } else {
        this.$set(this.newData.to, 'disabled', true);
        this.$set(this.newData.from, 'disabled', true);
      }
      await this.getAccountChange();
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
  }
</style>