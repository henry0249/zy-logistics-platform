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
            <my-form-item class="form-right" input v-model.lazy="goods.unit" filterable label="单位">
            </my-form-item>
            <my-form-item class="form-right" input v-model="goods.spec" filterable label="规格">
            </my-form-item>
            <my-form-item select v-model="goods.category" label="分类" :options="categoryArr">
            </my-form-item>
          </div>
          <div class="flex form-box" style="margin-top:20px;">
            <my-form-item class="form-right" select v-model="goods.brand" filterable label="品牌" :options="brandArr">
            </my-form-item>
            <my-form-item select class="form-right" v-model="goods.saleState" filterable label="售卖状态" :options="field.Goods.saleState.option">
            </my-form-item>
            <common-select class="form-right" label="生产厂商" :disabled="!sys" :data.sync="goods.mfrs" border width="25%" title="公司选择" type="company" size="mini"></common-select>
            <my-form-item width="12.5%" class="form-right" switch v-model="goods.selfDeliverySupport" label="支持自提">
            </my-form-item>
            <my-form-item width="12.5%" switch v-model="goods.freeDelivery" label="包配送费">
            </my-form-item>
          </div>
          <div class="flex form-box" style="margin-top:20px;">
            <div class="flex edmit-tag">
              <span style="width:60px;font-size: 12px;">标签</span>
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
            <div class="jc je">
              <i class="el-icon-plus jc pointer" style="color:#67C23A;font-size:15px;" title="添加新的价格" @click="addPrice"></i>
            </div>
          </div>
        </common-alert>
        <my-table size="mini" edit :thead="thead" :data.sync="tableList" index border op opWidth="50px">
          <div slot="op" slot-scope="scope" class="tc" style="width:100%;color:#F56C6C">
            <i v-if="tableList.length>1" title="删除该地区" class="pointer" @click="delAdr(scope['index'])">
                      <icon size="16px">icon-ec1</icon>
                    </i>
          </div>
          <template slot-scope="scope" v-if="scope.column.property === 'area'">
                    <common-select :disabled="scope.row[scope.column.property]._id?true:false" :data.sync="scope.row[scope.column.property]" border width="100%" title="用户选择" type="area" size="mini"></common-select>
</template>
        </my-table>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        <el-button :disabled="disabled" size="small" type="primary" @click="sub">修 改</el-button>
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
        disabled: true,
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
          mfrs: {},
          detail: ''
        },
        inputVisible: false,
        inputValue: '',
        categoryArr: [],
        brandArr: [],
        mfrsArr: [],
        priceChange: false,
        goodsChange: false
      }
    },
    watch: {
      tableList: {
        handler: function(val, oldVal) {
          if (oldVal.length > 0) {
            console.log(val, oldVal);
            this.disabled = false;
            this.priceChange = true;
          }
        },
        deep: true
      },
      goods: {
        handler: function(val, oldVal) {
          if (oldVal.mfrs) {
            this.disabled = false;
            this.goodsChange = true;
          }
        },
        deep: true
      }
    },
    methods: {
      delAdr(i) {
        if (this.tableList.length > 1) {
          this.tableList.splice(i, 1);
        } else {
          this.$alert(`至少有一个地区`, "提示", {
            confirmButtonText: "确定",
            callback: () => {
              return;
            }
          });
        }
      },
      addPrice() {
        let obj = {};
        if (this.tableList > 0) {
          obj = JSON.parse(JSON.stringify(this.tableList[this.tableList.length - 1]));
          delete obj.area._id
        } else {
          obj = {
            area: {},
            sell: 0,
            factory: 0,
            transport: 0,
          }
        }
        this.tableList.push(obj);
      },
      async sub() {
        try {
          this.value = '更新中';
          let io = true;
          if (this.goodsChange) {
            let update = {
              name: this.goods.name,
              unit: this.goods.unit,
              spec: this.goods.spec,
              category: this.goods.category,
              brand: this.goods.brand,
              saleState: this.goods.saleState,
              selfDeliverySupport: this.goods.selfDeliverySupport,
              freeDelivery: this.goods.freeDelivery,
              tag: this.goods.tag,
              mfrs: this.goods.mfrs._id,
              detail: this.goods.detail
            };
            if (this.sys) {
              delete update.mfrs;
            }
            let goods = await this.$api.curd({
              model: 'goods',
              curdType: 'update',
              find: {
                _id: this.$route.params._id
              },
              update,
            })
            if (!goods) {
              io = false;
            } else {
              if (this.priceChange) {
                for (let index = 0; index < this.tableList.length; index++) {
                  let price = await this.$api.curd({
                    model: 'price',
                    curdType: 'add',
                    goods: this.$route.params._id,
                    area: this.tableList[index].area._id,
                    sell: Number(this.tableList[index].sell),
                    factory: Number(this.tableList[index].factory),
                    transport: Number(this.tableList[index].transport),
                  })
                  if (!price) {
                    io = false
                  }
                }
              }
            }
          }
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
              callback: action => {}
            });
          }
        } catch (error) {}
        this.value = '';
      },
      tagType(index, arr) {
        let type = ['success', 'info', 'warning', 'danger'];
        if (index <= type.length - 1) {
          return type[index];
        } else {
          return type[index - type.length - 1];
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
            _id: this.$route.params._id,
            populate: [{
              path: 'mfrs'
            }]
          })
          let goods = {};
          for (const key in this.goods) {
            goods[key] = res[key]
          }
          this.goods = JSON.parse(JSON.stringify(goods));
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
          let tableList = [];
          for (let index = 0; index < arr.length; index++) {
            let price = await this.$api.curd({
              model: 'price',
              curdType: 'findOne',
              area: arr[index],
              sort: {
                updatedAt: -1
              },
              populate: [{
                path: 'area'
              }]
            })
            tableList.push(price);
          }
          this.tableList = JSON.parse(JSON.stringify(tableList));
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