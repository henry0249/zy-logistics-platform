<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>付款单</strong>
        </div>
        <my-form width="24%" size="mini">
          <div class="jc jb">
            <my-form-item label="类型" @change="typeChange" select v-model="accountChangData.type" :options="field.AccountChange.type.option"></my-form-item>
            <my-form-item label="金额" number v-model="accountChangData.num" :min="0"></my-form-item>
            <my-form-item label="税率" number v-model="accountChangData.taxRate"></my-form-item>
            <my-form-item @change="toCompanyChange" label="付款公司" select v-model="accountChangData.toCompany" :options="companyArr"></my-form-item>
          </div>
          <div class="jc jb" style="margin-top:15px;">
            <my-form-item label="付款方账户" input v-model="accountChangData.from.account"></my-form-item>
            <my-form-item label="付款方账号" input v-model="accountChangData.from.number"></my-form-item>
            <my-form-item label="开户行" input v-model="accountChangData.from.bank"></my-form-item>
            <div style="width:24%"></div>
          </div>
          <div class="jc jb" style="margin-top:15px;">
            <my-form-item label="收款方账户" input v-model="accountChangData.to.account"></my-form-item>
            <my-form-item label="收款方账号" input v-model="accountChangData.to.number"></my-form-item>
            <my-form-item label="开户行" input v-model="accountChangData.to.bank"></my-form-item>
            <div style="width:24%"></div>
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
        accountChangData: {
          type: 0,
          num: 0,
          taxRate: 0,
          toCompany: "",
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
    watch: {},
    methods: {
      async sub() {
        try {
          this.loadingText = "...";
          let setAccountChange = await this.$ajax.post('accountChange/set', {
            type: this.accountChangData.type,
            num: this.accountChangData.num,
            taxRate: this.accountChangData.taxRate,
            toCompany: this.accountChangData.toCompany,
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