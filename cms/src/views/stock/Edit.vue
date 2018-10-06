<template>
  <loading-box v-model="loadingText" style="padding: 0 1%;margin:0 auto">
    <stock-info v-if="!loadingText" @submit="submit" :val="data" :submit-text="`确认${field.Stock.type.option[$route.query.type]}`"></stock-info>
  </loading-box>
</template>

<script>
  import StockInfo from "./StockInfo.vue";
  export default {
    components: {
      StockInfo
    },
    data() {
      return {
        loadingText: '',
        data: {}
      }
    },
    methods: {
      async submit(val) {
        this.$confirm(`是否提交修改将该${this.field.Stock.type.option[this.$route.query.type]}单状态更改为完成？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.sub(val);
        }).catch(() => {});
      },
      async sub(val) {
        console.log(val);
        try {
          this.loadingText = '修改中';
          let delStock = await this.$api.curd({
            model: 'stock',
            curdType: 'delete',
            _id: this.$route.query._id
          })
          let setStock = await this.$api.curd({
            model: 'stock',
            curdType: 'set',
            goods: val[0].goods,
            name: val[0].name,
            num: val[0].num,
            remake: val[0].remake,
            type: val[0].type,
            state: 'finish',
            company: this.company._id
          })
          this.$router.push({
            path: '/stock/home'
          });
          this.$message.success('修改成功！');
        } catch (error) {}
        this.loadingText = '';
      },
      async getStockById() {
        try {
          this.loadingText = '加载中';
          this.data = await this.$api.curd({
            model: 'stock',
            curdType: 'findOne',
            _id: this.$route.query._id,
            populate: [{
              path: 'goods',
              populate: [{
                path: 'category'
              }, {
                path: 'brand'
              }]
            }]
          })
          this.$set(this.data, 'state', 'finish');
        } catch (error) {}
        this.loadingText = '';
      }
    },
    created() {
      this.getStockById();
    }
  }
</script>

<style scoped>

</style>