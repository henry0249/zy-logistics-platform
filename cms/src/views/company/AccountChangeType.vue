<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>{{field.AccountChange.type.option[$route.query.type] || '收款'}}单</strong>
        </div>
        <my-form width="24%" size="mini">
          <div class="jc jb" style="margin-top:15px;">
            <bank-cart :data.sync="data" :initData="initData" style="width:100%"></bank-cart>
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
      }
    },
    data() {
      return {
        loadingText: '',
        data: {},
        initData: {
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
          accountingTime: '2018-10-21',
          toCompany: {
            name: 'B'
          },
          company: {
            name: "A"
          }
        },
      };
    },
    watch: {
      data: {
        handler(val) {
          console.log(val);
        },
        deep: true
      }
    },
    methods: {
      async sub() {
        console.log(this.data);
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
          }
          if (this.$route.query.type === '5') {
            this.$set(setOption, 'type', 1);
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
          console.log(setOption);
          await this.$ajax.post('/accountChange/set', setOption);
          this.$message.success('添加成功');
          this.$router.push({
            path: '/company/account'
          });
        } catch (error) {
          console.log(error);
        }
        this.loadingText = '';
      }
    },
    created() {
      console.log(this.$route.query.type);
      if (this.$route.query.type === '5') {
        this.$set(this.initData, 'toCompany', this.company);
        this.$set(this.initData, 'ompany', {});
        console.log(this.initData.toCompany);
      } else {
        this.$set(this.initData, 'company', this.company);
        this.$set(this.initData, 'toCompany', {});
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