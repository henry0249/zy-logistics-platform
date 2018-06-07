<template>
  <edmit-tem v-model="loadingText" :goods="goods" :category="category" :mfrs="mfrs" :brand="brand" :tableList="tableList" :area="area">
  </edmit-tem>
</template>

<script>
  import EdmitTem from './EdmitTem';
  export default {
    components: {
      EdmitTem
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
      async getBrand() {
        try {
          let res = await this.$api.curd({
            model: 'brand',
            curdType: 'find',
          })
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
            goods: this.$route.params._id
          })
          let i = new Set();
          res.forEach(resItem => {
            i.add(resItem.area)
          });
          for (let index = 0; index < [...i].length; index++) {
            let obj = {
              address: [],
              factory: 0,
              sell: 0,
              transport: 0
            }
            let price = await this.$api.curd({
              model: 'price',
              curdType: 'find',
              goods: this.$route.params._id,
              area: [...i][index],
              populate: [{
                path: 'area',
                // populate: [{
                //   path: 'city'
                // }, {
                //   path: 'county'
                // }, {
                //   path: 'province'
                // }]
              }],
            })
            let io = true
            for (const key in this.field.Area.type.option) {
              if (this.field.Area.type.option.hasOwnProperty(key)) {
                if (key === price[0].area.type) {
                  obj.address.push(price[0].area._id)
                  io = false
                } else {
                  if (io) {
                    obj.address.push(price[0].area[key])
                  }
                }
              }
            }
            price.forEach(priceItem => {
              obj[priceItem.type] = priceItem.value
            });
            console.log('object', obj.address);
            this.tableList.push(obj)
          }
          console.log('this.tableList', this.tableList);
        } catch (error) {}
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
      // let arr = [450000, 450800, 450802, 450802101];
      // let tableList = []
      // let obj = {
      //   address: [],
      //   factory: 0,
      //   sell: 0,
      //   transport: 0
      // }
      // arr.forEach(item => {
      //   obj.address.push(item)
      // });
      // tableList.push(obj)
      // console.log(tableList);
      // this.tableList = JSON.parse(JSON.stringify(tableList))
      // console.log(this.tableList);
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