<template>
  <loading-box v-model="loadingText" v-if="!loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>{{title}}单</strong>
        </div>
        <my-form width="24%" size="mini">
          <div class="jc jb" style="margin-top:15px;">
            <bank-cart v-if="showCart" :data.sync="data" :initData="newData" style="width:100%" :key="1"></bank-cart>
          </div>
          <div v-if="showBtm">
            <div class="jc" style="margin:30px 0">修改后</div>
            <bank-cart v-if="showCart" :data.sync="children" :initData="childrenData" style="width:100%" :key="2"></bank-cart>
          </div>
        </my-form>
      </div>
      <div class="tr jb" style="margin-top:30px">
        <div>
          <el-button v-if="leftText" size="small" type="danger" @click="res">{{leftText}}</el-button>
        </div>
        <div class="jc js" v-if="$route.query.payName !== 'applyEdit'">
          <el-button size="small" @click="$router.go(-1)">返 回</el-button>
          <el-button v-if="showBtm" size="small" @click="changeInitData">使用申请修改的数据</el-button>
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
        showCart: true,
        show: true,
        data: {},
        children: {},
        accountChangeData: {},
        childrenData: {},
        obj: {
          received: {
            text: '付款流水',
            subText: '修改'
          },
          receivedCheck: {
            text: '待审核付款流水',
            leftText: "回退修改",
            subText: '通过审核'
          },
          receivedEditCheck: {
            text: '未通过审核付款流水',
            leftText: "",
            subText: '修改'
          }
        },
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
      data: {
        handler(val) {
          this.io = true;
        },
        deep: true
      }
    },
    computed: {
      showBtm() {
        return this.hasChild && this.show && this.$route.query.payName === 'receivedCheck';
      },
      hasChild() {
        return this.initData.children;
      },
      title() {
        let data = '';
        if (this.$route.query.type === '5') {
          data = '收款';
        } else if (this.$route.query.type === '6') {
          data = '预收款';
        } else {
          data = this.obj[this.$route.query.payName].text;
        }
        return data;
      },
      leftText() {
        let data = '';
        if (this.edmit) {
          data = this.obj[this.$route.query.payName].leftText;
        }
        return data;
      },
      subText() {
        let data = '添加';
        if (this.edmit) {
          data = this.obj[this.$route.query.payName].subText;
        }
        return data;
      },
    },
    methods: {
      res() {
        this.$prompt('请输入回退修改的原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async({
          value
        }) => {
          await this.repulse(value);
        }).catch(() => {});
      },
      async repulse(value) {
        try {
          this.loadingText = '加载中';
          let data = {};
          await this.$ajax.post('/accountChange/checkFail', {
            _id: this.$route.params._id,
            text: value
          });
          this.postSuccess('操作成功');
        } catch (error) {}
      },
      postSuccess(data) {
        this.$message.success(data);
        this.$router.push({
          path: '/company/account',
          query: {
            show: false
          }
        })
      },
      changeInitData() {
        this.$confirm('将原来的数据替换为即将要修改的数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.newData = Object.assign({}, this.newData, {
            value: this.childrenData.value,
            to: this.childrenData.to,
            from: this.childrenData.from,
            remittanceTime: this.childrenData.remittanceTime,
            accountingTime: this.childrenData.accountingTime,
          });
          this.show = false;
        }).catch(() => {});
      },
      async sub() {
        if (this.checkMethods()) {
          if (this.$route.query.check === true || this.$route.query.check === 'true') {
            if (this.role.financialManager) {
              this.edmitAccountChange('check');
            } else {
              this.$message.warn('您不是财务经理，没有该权限');
            }
          } else {
            if (this.edmit) {
              if (this.role.financialManager) {
                this.edmitAccountChange();
              } else {
                this.$confirm('修改不会立即生效, 是否发起修改申请?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(async() => {
                  await this.edmitAccountChange('', true);
                }).catch(() => {});
              }
            } else {
              this.setAccountChange();
            }
          }
        }
      },
      checkMethods() {
        let data = true;
        if (this.io) {
          if (this.data.value === 0) {
            this.$message.warn('金额必须大于0');
            return data = false;
          }
        } else {
          if (this.newData.value === 0) {
            this.$message.warn('金额必须大于0');
            return data = false;
          }
        }
        return data;
      },
      async edmitAccountChange(check, io) {
        try {
          this.loadingText = check ? '审核中...' : '修改中...';
          let find = {
            _id: this.$route.params._id
          };
          let newData = this.io ? this.data : this.newData;
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
          if (this.$route.query.payName === 'receivedEditCheck') {
            path = '/accountChange/update';
            data = '修改成功'
          }
          if (io) {
            data = '申请修改成功';
          }
          await this.$ajax.post(path, update);
          this.postSuccess(data);
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
      async getCompanyByQuery() {
        try {
          this.loadingText = '加载中...';
          let res = await this.$ajax.post('/company/findOne', {
            _id: this.$route.query.company
          })
          if (res) {
            this.$set(this.newData, 'company', res);
          }
        } catch (error) {}
        this.loadingText = '';
      }
    },
    async created() {
      if (Object.keys(this.initData).length > 0) {
        this.newData = JSON.parse(JSON.stringify(this.initData));
      }
      if (this.hasChild) {
        this.childrenData = this.newData.children;
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
      if (this.$route.query.company) {
        await this.getCompanyByQuery();
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
  }
</style>