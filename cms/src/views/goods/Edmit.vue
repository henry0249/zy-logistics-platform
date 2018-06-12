<template>
  <edmit-tem v-model="loadingText" :str="str" :goods="goods" @sub="sub" :category="category" :mfrs="mfrs" :brand="brand" :tableList="tableList" :area="area">
  </edmit-tem>
</template>

<script>
  import EdmitTem from './EdmitTem';
  export default {
    components: {
      EdmitTem
    },
    props: {
      str: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        loadingText: '',
        goods: {
          name: '',
          unit: '',
          spec: '',
          category: '',
          brand: '',
          mfrs: '',
          saleState: 0,
          selfDeliverySupport: false,
          freeDelivery: false,
          tag: [],
          detail: '',
        },
        category: [],
        brand: [],
        mfrs: [],
        area: {},
        tableList: [],
      }
    },
    methods: {
      async sub(val) {
        console.log(val);
        this.loadingText = '更新中'
        let io = true
        try {
          let goods = await this.$api.curd({
            model: 'goods',
            curdType: 'update',
            find: {
              _id: this.$route.params._id
            },
            update: val.goods
          })
          for (let index = 0; index < val.tableList.length; index++) {
            let price = await this.$api.curd({
              model: 'price',
              curdType: 'add',
              factory: val.tableList[index].factory,
              sell: val.tableList[index].sell,
              transport: val.tableList[index].transport,
              area: val.tableList[index].address[val.tableList[index].address.length - 1],
              parent: val.tableList[index]._id,
              goods: this.$route.params._id
            })
            console.log('newPrice', price);
            let addOld = await this.$api.curd({
              model: 'price',
              curdType: 'update',
              find: {
                _id: val.tableList[index]._id
              },
              update: {
                history: true,
              }
            })
          }
        } catch (error) {
          io = false
        }
        this.loadingText = ''
        if (io) {
          this.$alert('更新成功', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$router.go(-1)
            }
          });
        } else {
          this.$alert('更新失败', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              // this.$router.go(-1)
            }
          });
        }
      },
      async getBrand() {
        try {
          let res = await this.$api.curd({
            model: 'brand',
            curdType: 'find',
          })
          console.log('brand', res);
          res.forEach(item => {
            let obj = {}
            obj.name = item.name
            obj._id = item._id
            this.brand.push(obj)
          });
        } catch (error) {}
      },
      async getMfrs() {
        try {
          let res = await this.$api.curd({
            model: 'company',
            curdType: 'find',
            type: {
              $in: ['shipper']
            }
          })
          console.log('mfrs', res);
          res.forEach(item => {
            let obj = {}
            obj.name = item.name
            obj._id = item._id
            this.mfrs.push(obj)
          });
        } catch (error) {}
      },
      async getCategory() {
        try {
          let res = await this.$api.curd({
            model: 'category',
            curdType: 'find',
            populate: [{
              path: 'parent'
            }]
          })
          console.log('category', res);
          res.forEach(item => {
            let obj = {}
            obj.name = item.name
            obj._id = item._id
            this.category.push(obj)
          });
        } catch (error) {}
      },
      async getGoods() {
        try {
          let res = await this.$api.curd({
            model: 'goods',
            curdType: 'findOne',
            _id: this.$route.params._id,
            populate: [{
              path: 'brand'
            }, {
              path: 'category'
            }, {
              path: 'mfrs'
            }, {
              path: 'platform'
            }]
          })
          console.log('goods', res);
          for (const key in this.goods) {
            if (this.goods.hasOwnProperty(key)) {
              if (key === 'category') {
                this.goods[key] = res.category._id
              } else if (key === 'brand') {
                this.goods[key] = res.brand._id
              } else if (key === 'mfrs') {
                this.goods[key] = res.mfrs._id
              } else {
                this.goods[key] = res[key]
              }
            }
          }
        } catch (error) {}
      },
      async getArea() {
        try {
          this.area = await this.$api.getArea()
        } catch (error) {}
      },
      async getPrice() {
        try {
          let res = await this.$api.curd({
            model: 'price',
            curdType: 'find',
            goods: this.$route.params._id,
            history: {
              $exists: false
            }
          })
          console.log('price', res);
          for (let index = 0; index < res.length; index++) {
            let obj = {};
            let area = await this.$api.curd({
              model: 'area',
              curdType: 'findOne',
              _id: res[index].area
            })
            if (area) {
              obj.address = []
              if (area.province) {
                obj.address.push(area.province)
              }
              if (area.city) {
                obj.address.push(area.city)
              }
              if (area.county) {
                obj.address.push(area.county)
              }
              if (area.township) {
                obj.address.push(area.township)
              }
            }
            obj.address.push(area._id)
            obj._id = res[index]._id;
            obj.factory = res[index].factory;
            obj.sell = res[index].sell;
            obj.transport = res[index].transport;
            this.tableList.push(obj)
          }
          console.log('this.tableList', this.tableList);
        } catch (error) {
          console.log(error);
        }
      }
    },
    async created() {
      this.loadingText = '加载中';
      await this.getGoods();
      await this.getCategory();
      await this.getBrand();
      await this.getMfrs();
      await this.getArea();
      await this.getPrice();
      this.loadingText = '';
    }
  }
</script>

<style scoped>
  .btmBox {
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }
</style>