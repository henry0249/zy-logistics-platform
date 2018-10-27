<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>{{field.AccountChange.type.option[accountChangData.type] || '收款'}}单</strong>
        </div>
        <my-form width="24%" size="mini">
          <div class="jc jb">
            <my-form-item label="类型" @change="typeChange" select v-model="accountChangData.type" :options="field.AccountChange.type.option"></my-form-item>
            <my-form-item label="金额" number v-model="accountChangData.num" :min="0"></my-form-item>
            <my-form-item label="税率" number v-model="accountChangData.taxRate"></my-form-item>
            <common-select-by-code width="24%" user check :data.sync="accountChangData.toCompany" size="mini" label="付款公司"></common-select-by-code>
          </div>
          <div class="jc jb" style="margin-top:15px;">
            <brank-cart :data.sync="data" :initData="initData" style="width:100%"></brank-cart>
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
        clickName: 0,
        data:[],
        initData: [{
          title: '付款方',
          name: 'A公司',
          account: '',
          bank: '',
          bankName:'',
          num:0,
          // disabled:true,
          remittanceTime:'2018-10-22'
        }, {
          title: '收款方',
          name: 'B公司',
          account: '',
          bank: '',
          bankName:'',
          num:0,
          accountingTime:'2018-10-26'
        }],
        accountChangData: {
          type: 0,
          num: 0,
          taxRate: 0,
          toCompany: {},
          from: {
            account: '',
            number: '',
            bank: ''
          },
          to: {
            account: '',
            number: '',
            bank: ''
          }
        },
        input: "",
        input1: "",
        dialogTableVisible: false
      };
    },
    watch: {
      'accountChangData.num'(val){
        this.$set(this.initData[0],'num',val)
      },
      data:{
        handler(val){
          console.log(val);
        },
        deep:true
      },
      'accountChangData.toCompany': {
        handler(val) {
          this.$set(this.accountChangData.from, 'account', val.name);
        },
        deep: true
      }
    },
    methods: {
      async sub() {
        try {
          this.loadingText = "...";
          let setAccountChange = await this.$ajax.post('accountChange/set', {
            type: this.accountChangData.type,
            num: this.accountChangData.num,
            taxRate: this.accountChangData.taxRate,
            toCompany: this.accountChangData.toCompany._id,
            from: this.accountChangData.from,
            to: this.accountChangData.to,
            company: this.$route.params._id || this.$route.query._id || this.company._id,
          })
        } catch (error) {}
        this.loadingText = "";
      },
      go(key) {
        console.log(key);
        this.clickName = key;
        this.$set(this.accountChangData, "type", Number(key));
        this.dialogTableVisible = true;
      },
      toCompanyChange(val) {
        this.companyArr.forEach(item => {
          if (item._id === val) {
            this.$set(this.accountChangData, 'from', {
              account: item.name,
              number: '',
              bank: ''
            })
          }
        });
      },
      typeChange(val) {
        console.log(val);
      }
    },
    created() {
      if (this.$route.query.type) {
        this.$set(this.accountChangData, 'type', Number(this.$route.query.type));
      }
      this.$set(this.accountChangData, 'to', {
        account: this.company.name,
        number: '',
        bank: ''
      })
      this.$set(this.initData[0],'name',this.accountChangData.toCompany.name);
      this.$set(this.initData[1],'name',this.company.name);
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