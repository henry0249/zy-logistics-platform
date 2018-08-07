<template>
  <loading-box v-model="value">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>查看详情</strong>
        </div>
        <common-alert style="margin:15px 0">商品详情</common-alert>
        <my-form size="mini" width="25%" style="margin:15px 0" v-if="!value">
          <div class="flex form-box">
            <my-form-item class="form-right" input v-model="goods.name" filterable label="商品名">
            </my-form-item>
            <my-form-item class="form-right" input v-model="goods.unit" filterable label="单位">
            </my-form-item>
            <my-form-item class="form-right" input v-model="goods.spec" filterable label="规格">
            </my-form-item>
            <my-form-item select v-model="goods.category" label="分类" :options="categoryArr">
            </my-form-item>
          </div>
          <div class="flex form-box" style="margin-top:20px;">
            <my-form-item class="form-right" select v-model="goods.brand" filterable label="品牌" :options="brandArr">
            </my-form-item>
            <my-form-item class="form-right" select v-model="goods.mfrs" :disabled="sys" filterable label="生产厂商" :options="mfrsArr">
            </my-form-item>
            <my-form-item select class="form-right" v-model="goods.saleState" filterable label="售卖状态" :options="field.Goods.saleState.option">
            </my-form-item>
          </div>
          <div class="flex form-box" style="margin-top:20px;">
            <my-form-item class="form-right" switch v-model="goods.selfDeliverySupport" label="支持自提" active-text="支持" inactive-text="不支持">
            </my-form-item>
            <my-form-item class="form-right" switch v-model="goods.freeDelivery" label="包配送费" active-text="包" inactive-text="不包">
            </my-form-item>
            <div class="flex edmit-tag">
              <i style="width:60px">标签</i>
              <el-tag size="mini" style="margin-right:10px;" :type="tagType(index,goods.tag)" :key="tag" v-for="(tag,index) in goods.tag" closable :disable-transitions="false" @close="handleClose(goods.tag,tag)">
                {{tag}}
              </el-tag>
              <el-input style="width:60px" size="mini" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" @keyup.enter.native="handleInputConfirm(goods.tag)" @blur="handleInputConfirm(goods.tag)">
              </el-input>
              <el-button size="mini" v-else class="button-new-tag" @click="showInput">添加标签</el-button>
            </div>
          </div>
          <my-form-item style="margin-top:20px;" size="mini" v-model="goods.detail" width="100%" input type="textarea" autosize label="商品详情">
          </my-form-item>
        </my-form>
        <common-alert style="margin:15px 0">
          <div style="width:100%" class="jb">
            <p>商品价格</p>
            <p>11111111111</p>
          </div>
        </common-alert>
        <my-table size="mini" edit :thead="thead" :data.sync="tableList" index border>
          <template slot-scope="scope" v-if="scope.column.property === 'address'">
            <common-select :data.sync="scope.row[scope.column.property]" border width="100%" title="用户选择" type="area" size="mini"></common-select>
          </template>
        </my-table>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        <el-button size="small" type="primary" @click="sub">修 改</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  export default {
    props: {
      sys: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        tableList: [],
        thead: {
          area: {
            name: '地区',
            slot: true,
            readOnly: true,
          },
          factory: {
            name: '出厂价',
          },
          sell: {
            name: '销售价',
          },
          transport: {
            name: '运输价',
          }
        },
        value: '',
        goods: {
          name: '',
          unit: '',
          spec: '',
          category: '',
          brand: '',
          saleState: '',
          selfDeliverySupport: false,
          freeDelivery: false,
          tag: [],
          mfrs: '',
          detail: ''
        },
        inputVisible: false,
        inputValue: '',
        categoryArr: [],
        brandArr: [],
        mfrsArr: []
      }
    },
    methods: {
      sub() {},
      tagType(index, arr) {
        let type = ['success', 'info', 'warning', 'danger'];
        if (index <= arr.length - 1) {
          return type[index];
        } else {
          return type[index - arr.length - 1];
        }
      },
      handleClose(options, tag) {
        options.splice(options.indexOf(tag), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm(options) {
        let inputValue = this.inputValue;
        if (inputValue) {
          options.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = "";
      },
      async getBrand() {
        try {
          this.brandArr = await this.$api.curd({
            model: 'brand',
            curdType: 'find'
          })
        } catch (error) {}
      },
      async getCompany() {
        try {
          this.mfrsArr = await this.$api.curd({
            model: 'company',
            curdType: 'find',
            type: {
              $in: ['shipper']
            }
          })
        } catch (error) {}
      },
      async getCategory() {
        try {
          this.categoryArr = await this.$api.curd({
            model: 'category',
            curdType: 'find'
          })
        } catch (error) {}
      },
      async getGoods() {
        try {
          let res = await this.$api.curd({
            model: 'goods',
            curdType: 'findOne',
            _id: this.$route.params._id
          })
          for (const key in this.goods) {
            this.goods[key] = res[key]
          }
        } catch (error) {}
      },
      async getPrice() {
        try {
          let res = await this.$api.curd({
            model: 'price',
            curdType: 'find',
            goods: this.$route.params._id
          })
          let areaArr = [];
          res.forEach(resItem => {
            areaArr.push(resItem.area)
          });
          let newAreaArr = new Set(areaArr);
          let arr = [...newAreaArr];
          for (let index = 0; index < arr.length; index++) {
            let price = await this.$api.curd({
              model: 'price',
              curdType: 'findOne',
              area: arr[index],
              populate: [{
                path: 'area'
              }]
            })
            this.tableList.push(price);
          }
          console.log(this.tableList);
        } catch (error) {}
      }
    },
    async created() {
      this.value = '加载中';
      await this.getCategory();
      await this.getGoods();
      await this.getBrand();
      await this.getCompany();
      await this.getPrice();
      this.value = '';
    }
  }
</script>

<style scoped>
  .g-order-create {
    padding: 3% 5%;
  }
  .g-order {
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
  .edmit-tag {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center
  }
  .form-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center
  }
  .form-right {
    padding-right: 20px
  }
</style>