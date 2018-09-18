<template>
  <loading-box v-model="loadingText" style="padding: 3% 5%;margin:0 auto">
    <stock-info v-if="!loadingText" :goodsId.sync="goodsId" :goods="goods" @submit="submit"></stock-info>
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
        goodsId: '',
        data: {},
        goods: [],
        loadingText: ''
      };
    },
    watch: {
      company: {
        async handler(val) {
          await this.getGoodsBycompany();
          this.goodsId = '';
        },
        deep: true
      }
    },
    methods: {
      async getGoodsBycompany() {
        try {
          this.loadingText = '加载中';
          this.goods = await this.$api.curd({
            model: 'goods',
            curdType: 'find',
            company: this.company._id,
            populate: [{
              path: 'brand'
            }, {
              path: 'category'
            }]
          })
        } catch (error) {}
        this.loadingText = '';
      },
      async submit(data) {
        if (this.checkMethods(data)) {
          try {
            this.loadingText = '加载中';
            let op = {
              model: 'stock',
              curdType: 'set',
            };
            for (const key in data) {
              this.$set(op, key, data[key])
            }
            this.$set(op, 'goods', this.goodsId);
            let res = await this.$api.curd(op);
            this.$message.success('操作成功！');
            // this.$router.push({
            //   path: '/stock/index'
            // })
          } catch (error) {}
          this.loadingText = '';
        }
      },
      checkMethods(data) {
        let check = true;
        if (data.num <= 0) {
          this.$message.warn('数量必须大于0');
          check = false;
        } else if (!this.goodsId) {
          this.$message.warn('必须选择商品');
          check = false;
        }
        return check;
      }
    },
    created() {
      this.getGoodsBycompany();
    }
  };
</script>

<style scoped>

</style>