<template>
  <loading-box v-model="loadingText">
    <All v-if="!loadingText" edit :data.sync="data" @sub="sub"></All>
  </loading-box>
</template>

<script>
  import All from './All.vue';
  import js from './CompanyAccount.js';
  export default {
    components: {
      All
    },
    data() {
      return {
        js,
        loadingText: '',
        data: {}
      }
    },
    methods: {
      async sub(val) {
        if (this.$route.query.payName === 'received' || this.$route.query.payName === 'invoice') {
          if (!this.role.financialManager) {
            this.$confirm('您不是财务经理，无法直接修改，是否提交修改申请', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              center: true,
              type: 'warning'
            }).then(async() => {
              await this.postData(val);
            }).catch(() => {});
            return;
          }
          await this.postData(val);
        } else {
          if (!this.role.financialManager) {
            this.$alert('您不是财务经理，无法进行该操作', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              center: true,
            });
            return;
          };
          await this.postData(val);
        }
      },
      async postData(val) {
        try {
          this.loadingText = '操作中';
          let path = this.js[this.$route.query.payName].postPath;
          if (val.hasChild && this.$route.query.payName !== 'invoiceEditCheck') path = '';
          await this.$api.company[this.js[this.$route.query.payName].postPath]({ ...val.cartData
          });
          this.$message.success('操作成功');
          this.$router.push({
            path: '/company/account'
          })
        } catch (error) {}
        this.loadingText = '';
      },
      async getData() {
        try {
          this.loadingText = '加载中';
          let path = this.$route.query.titleType === 'isReceive' ? 'getAccountChangeFIndOne' : 'getInvoiceFIndOne'
          this.data = await this.$api.company[path]({
            _id: this.$route.params._id,
            populate: [{
              path: 'company'
            }, {
              path: 'toCompany'
            }, {
              path: 'children',
              populate: [{
                path: 'company'
              }, {
                path: 'toCompany'
              }]
            }]
          })
        } catch (error) {}
        this.loadingText = '';
      }
    },
    created() {
      this.getData();
    }
  }
</script>

<style scoped>

</style>