<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>修改商品</strong>
        </div>
        <my-form size="mini" width="24%" style="margin:15px 0">
          <div class="flex form-box" v-if="!loadingText">
            <my-form-item class="form-right" input v-model="goods.name" filterable label="商品名">
            </my-form-item>
            <my-form-item class="form-right" input v-model="goods.unit" filterable label="单位">
            </my-form-item>
            <my-form-item class="form-right" input v-model="goods.spec" filterable label="规格">
            </my-form-item>
            <my-form-item select v-model="goods.category" label="分类" :options="category">
            </my-form-item>
          </div>
          <div class="flex form-box" style="margin-top:20px;" v-if="!loadingText">
            <my-form-item class="form-right" select v-model="goods.brand" filterable label="品牌" :options="brand">
            </my-form-item>
            <my-form-item class="form-right" v-if="company.name&&!loadingText" select v-model="goods.company" filterable label="发布公司" :options="companyArr">
            </my-form-item>
            <my-form-item class="form-right" v-if="platform.name&&!loadingText" select v-model="goods.platform" filterable label="发布平台" :options="platformArr">
            </my-form-item>
            <my-form-item class="form-right" select v-model="goods.mfrs" filterable label="生产厂商" :options="mfrs">
            </my-form-item>
            <my-form-item select v-model="goods.saleState" filterable label="售卖状态" :options="field.Goods.saleState.option">
            </my-form-item>
          </div>
          <div class="flex form-box" style="margin-top:20px;">
            <my-form-item class="form-right" switch v-model="goods.selfDeliverySupport" label="支持自提" active-text="支持" inactive-text="不支持">
            </my-form-item>
            <my-form-item class="form-right" switch v-model="goods.freeDelivery" label="包配送费" active-text="包" inactive-text="不包">
            </my-form-item>
            <div class="flex edmit-tag">
              <i style="width:60px">标签</i>
              <el-tag size="mini" style="margin-right:10px;" :key="tag" v-for="tag in goods.tag" closable :disable-transitions="false" @close="handleClose(tag)">
                {{tag}}
              </el-tag>
              <el-input style="width:60px" size="mini" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
              </el-input>
              <el-button size="mini" v-else class="button-new-tag" @click="showInput">+ New Tag</el-button>
            </div>
          </div>
        </my-form>
        <my-form-item size="mini" v-model="goods.detail" width="100%" class="form-right" input type="textarea" autosize label="订单备注">
        </my-form-item>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" @click="$router.go(-1)">取 消</el-button>
        <el-button size="small" type="primary" @click="sub">立即修改</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  export default {
    data() {
      return {
        loadingText: '加载中',
        inputVisible: false,
        inputValue: '',
        goods: {
          name: '',
          unit: '',
          spec: '',
          category: '',
          brand: '',
          company: '',
          platform: '',
          mfrs: '',
          saleState: '',
          selfDeliverySupport: false,
          freeDelivery: false,
          tag: [],
          detail: '',
        },
        category: [],
        brand: [],
        companyArr: [],
        platformArr: [],
        mfrs: [],
        saleStateArr: [],
      }
    },
    methods: {
      handleClose(tag) {
        this.goods.tag.splice(this.goods.tag.indexOf(tag), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.goods.tag.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      async getPlatform() {
        try {
          let res = await this.$api.curd({
            model: 'platform',
            curdType: 'find'
          })
          res.forEach(resItem => {
            let obj = {}
            obj.value = resItem._id
            obj.label = resItem.name
            this.platformArr.push(obj)
          });
          this.goods.platform = this.platform._id
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
          res.forEach(resItem => {
            let obj = {}
            obj._id = resItem._id
            obj.name = resItem.name
            this.mfrs.push(obj)
          });
          console.log('mfrs', this.mfrs);
        } catch (error) {}
      },
      async getBrand() {
        try {
          let res = await this.$api.curd({
            model: 'brand',
            curdType: 'find'
          })
          res.forEach(resItem => {
            let obj = {}
            obj._id = resItem._id
            obj.name = resItem.name
            this.brand.push(obj)
          });
          console.log(this.brand);
        } catch (error) {}
      },
      async getCategory() {
        try {
          let res = await this.$api.curd({
            model: 'category',
            curdType: 'find'
          })
          res.forEach(resItem => {
            let obj = {}
            obj._id = resItem._id
            obj.name = resItem.name
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
          })
          console.log(res);
          for (const key in this.goods) {
            if (this.goods.hasOwnProperty(key)) {
              this.goods[key] = res[key]
            }
          }
        } catch (error) {}
      },
      async sub(){

      }
    },
    async created() {
      let str = this.$route.query.str
      if (str === 'goods') {
        this.loadingText = '加载中'
        await this.getCategory()
        await this.getBrand()
        await this.getPlatform()
        await this.getMfrs()
        await this.getGoods()
        this.goods.company = this.company._id;
        this.loadingText = '';
        console.log('categry', this.category);
        this.goods.test = 1
      }
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
  .edmit-from {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 24%;
    float: left;
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
    margin-right: 20px
  }
</style>