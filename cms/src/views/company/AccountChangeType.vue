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
            account: ''
          },
          to: {
            bank: '',
            bankName: '',
            account: ''
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
    watch: {},
    methods: {
      async sub() {}
    },
    created() {}
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