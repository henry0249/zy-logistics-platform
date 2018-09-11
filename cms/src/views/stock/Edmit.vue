<template>
  <loading-box v-model="loadingText" style="padding: 3% 5%;margin:0 auto">
    <stock-info v-if="!loadingText" @submit="submit" :val="data"></stock-info>
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
        this.$confirm(`是否提交修改将该${this.field.Stock.type.option[val.type]}单状态更改为完成？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.sub(val);
        }).catch(() => {});
      },
      async sub(val) {
        try {
          this.loadingText = '修改中';
          let data = {
            model: 'stock',
            curdType: 'set',
            state: 'finish',
            name: val.name,
            type: val.type,
            num: val.num,
            old: val.old,
            new: val.new,
            businessTrains: val.businessTrains,
            dv: val.dv,
            company: val.company,
          }
          let res = await this.$api.curd(data);
          let del = await this.$api.curd({
            model: 'stock',
            curdType: 'delete',
            _id: val._id
          })
          // this.$router.push({
          //   path: '/stock/index'
          // });
          this.$message.success('修改成功！');
        } catch (error) {
        }
        this.loadingText = '';
      },
      async getStockById() {
        try {
          this.loadingText = '加载中';
          this.data = await this.$api.curd({
            model: 'stock',
            curdType: 'findOne',
            _id: this.$route.query._id
          })
        } catch (error) {
        }
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