<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>{{field.AccountChange.type.option[$route.query.type] || '收款'}}单</strong>
        </div>
        <my-form width="24%" size="mini">
          <div class="jc jb" style="margin-top:15px;">
            <bank-cart :data.sync="data" :initData="newData" style="width:100%"></bank-cart>
          </div>
        </my-form>
      </div>
      <div class="tr jb" style="margin-top:30px">
        <div>
          <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        </div>
        <el-button size="small" type="primary" @click="sub">添 加</el-button>
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
      }
    },
    data() {
      return {
        loadingText: '',
        data: {},
        newData: {
          value: 0,
          from: {
            bank: '',
            bankName: '',
            account: '',
            type: ''
          },
          to: {
            bank: '',
            bankName: '',
            account: '',
            type: ''
          },
          remittanceTime: '',
          accountingTime: '',
          toCompany: {},
          company: {}
        },
      };
    },
    methods: {
      async sub() {
        if (this.edmit) {
          this.edmitAccountChange();
        } else {
          this.setAccountChange();
        }
      },
      async edmitAccountChange() {
        try {
          this.loadingText = '添加中';
          let find = {
            _id: this.$route.params._id
          };
          let update = {
            value: this.data.value,
            from: this.data.from,
            to: this.data.to,
            payUserType: this.data.from.type,
            type: Number(this.$route.query.type),
            remittanceTime: this.formatTime(this.data.remittanceTime, 'YYYY-MM-DD'),
            accountingTime: this.formatTime(this.data.accountingTime, 'YYYY-MM-DD'),
          }
          this.$set(update, 'company', this.data.company._id);
          if (typeof(this.data.toCompany) === 'string') {
            this.$set(update, 'mobile', this.data.toCompany);
          } else {
            this.$set(update, 'toCompany', this.data.toCompany._id);
          }
          await this.$ajax.post('/accountChange/update', {
            find,
            update
          });
        } catch (error) {}
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
          console.log('this.$route.query.type',this.$route.query.type);
          if (this.$route.query.type === '5') {
            this.$set(setOption, 'type', 1);
            this.$set(setOption, 'toCompany', this.data.toCompany._id);
            console.log('typeof(this.data.company) === string',typeof(this.data.company) === 'string');
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
          await this.$ajax.post('/accountChange/set', setOption);
          this.$message.success('添加成功');
          this.$router.push({
            path: '/company/account'
          });
        } catch (error) {}
        this.loadingText = '';
      }
    },
    created() {
      console.log('initData', this.initData);
      if (Object.keys(this.initData).length > 0) {
        this.newData = JSON.parse(JSON.stringify(this.initData));
      }
      if (!this.edmit) {
        if (this.$route.query.type === '5') {
          this.$set(this.newData, 'toCompany', this.company);
          this.$set(this.newData, 'ompany', {});
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