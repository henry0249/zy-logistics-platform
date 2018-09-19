<template>
  <loading-box v-model="loadingText" style="padding: 3% 5%;margin:0 auto">
    <stock-info ref="info" v-if="!loadingText" :goodsId.sync="goodsId" :goods="goods" @submit="submit"></stock-info>
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
            limit: 0,
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
        if (this.$refs.info.checkMethods(data)) {
          try {
            this.loadingText = '加载中';
            let op = {
              model: 'stock',
              curdType: 'set',
            };
            for (const key in data.stock) {
              this.$set(op, key, data.stock[key]);
            }
            if (Array.isArray(data.goods) && data.goods.length > 0) {
              for (let index = 0; index < data.goods.length; index++) {
                let updateGoods = await this.$api.curd({
                  model: 'goods',
                  curdType: 'update',
                  find: {
                    _id: data.goods[index]._id
                  },
                  update: {
                    stock: data.goods[index].stock
                  }
                })
                this.$set(op, 'num', data.goods[index].stock);
                this.$set(op, 'goods', data.goods[index]._id);
                let res = await this.$api.curd(op);
              }
            } else {
              this.$set(op, 'num', data.goods.stock);
              this.$set(op, 'goods', this.goodsId);
              let res = await this.$api.curd(op);
            }
            this.$message.success('操作成功！');
            this.$router.push({
              path: '/stock/index'
            })
          } catch (error) {
          }
          this.loadingText = '';
        }
      }
    },
    created() {
      this.getGoodsBycompany();
    }
  };
</script>

<style scoped>

</style>