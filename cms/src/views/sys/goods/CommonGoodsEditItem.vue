<template>
  <loading-box v-model="value">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>查看详情</strong>
        </div>
        <common-alert style="margin:15px 0">商品详情</common-alert>
        <my-form size="mini" width="24%" style="margin:15px 0" v-if="!value">
          <div class="jb">
            <my-form-item input v-model="goods.name" filterable label="商品名">
            </my-form-item>
            <my-form-item input v-model.lazy="goods.unit" filterable label="单位">
            </my-form-item>
            <my-form-item input v-model="goods.spec" filterable label="规格">
            </my-form-item>
            <my-form-item select v-model="goods.category" label="分类" :options="categoryArr">
            </my-form-item>
          </div>
          <div class="jb" style="margin-top:20px;">
            <div style="width:24%">
              <my-select :disabled="!sys" label="所属公司" :data.sync="goods.company" company></my-select>
            </div>
            <my-form-item select v-model="goods.brand" filterable label="品牌" :options="brandArr">
            </my-form-item>
            <my-form-item select v-model="goods.saleState" filterable label="售卖状态" :options="field.Goods.saleState.option">
            </my-form-item>
            <div style="width:24%">
              <my-select label="生产厂商" :preOption="preOption" :data.sync="goods.manufacturer" company></my-select>
            </div>
          </div>
          <div class="jb" style="margin-top:20px;">
            <my-form-item select v-model="goods.packingType" filterable label="包装类型" :options="field.Goods.packingType.option"></my-form-item>
            <div style="width:24%" class="jb">
              <my-form-item width="49%" switch v-model="goods.selfDeliverySupport" label="支持自提">
              </my-form-item>
              <my-form-item width="49%" switch v-model="goods.freeDelivery" label="包配送费"></my-form-item>
            </div>
              <my-form-item width="24%" number size="mini" v-model="goods.recommenderBonus" :min="0" :max="100" label="推荐人提成"></my-form-item>
            <!-- <div style="width:24%"></div> -->
            <div style="width:24%"></div>
          </div>
          <div class="jb" style="margin-top:20px;">
            <div class="flex edit-tag">
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
            <div v-if="tableList.length>0" title="删除该地区" class="pointer" @click="delAdr(scope['index'])">
              <icon size="16px">icon-ec1</icon>
            </div>
          </div>
          <template slot-scope="scope">
            <my-select v-if="scope.column.property === 'area'" :disabled="scope.row[scope.column.property]._id?true:false" :data.sync="scope.row[scope.column.property]" company></my-select>
            <el-input-number v-if="scope.column.property === 'factory'||scope.column.property === 'transport'||scope.column.property === 'sell'" v-model="scope.row[scope.column.property]" controls-position="right" size="mini" :min="1"></el-input-number>
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
        default: true
      }
    },
    data() {
      return {
        companyDisabled: false,
        disabled: true,
        tableList: [],
        preOption: {
          type: {
            $in: ['manufacturer']
          }
        },
        thead: {
          area: {
            name: "地区",
            slot: true,
            readOnly: true
          },
          factory: {
            name: "出厂价",
            slot: true,
            readOnly: true
          },
          sell: {
            name: "销售价",
            slot: true,
            readOnly: true
          },
          transport: {
            name: "运输价",
            slot: true,
            readOnly: true
          }
        },
        value: "",
        goods: {
          name: "",
          unit: "",
          spec: "",
          category: "",
          brand: "",
          saleState: 1,
          manufacturer: {},
          packingType: 'bag',
          selfDeliverySupport: false,
          freeDelivery: false,
          tag: [],
          company: {},
          detail: "",
          recommenderBonus:0
        },
        inputVisible: false,
        inputValue: "",
        categoryArr: [],
        brandArr: [],
        companyArr: [],
        priceChange: false,
        goodsChange: false
      };
    },
    watch: {
      company: {
        handler(val) {
          if (this.$route.path.split('/')[1] === 'goods') {
            this.$router.push({
              path: '/goods'
            })
          }
        },
        deep: true
      },
      tableList: {
        handler: function(val, oldVal) {
          if (oldVal.length > 0) {
            this.disabled = false;
            this.priceChange = true;
          }
        },
        deep: true
      },
      goods: {
        handler: function(val, oldVal) {
          if (oldVal.company) {
            this.disabled = false;
            this.goodsChange = true;
          }
        },
        deep: true
      }
    },
    methods: {
      delAdr(i) {
        this.tableList.splice(i, 1);
      },
      addPrice() {
        let obj = {};
        if (this.tableList > 0) {
          obj = JSON.parse(
            JSON.stringify(this.tableList[this.tableList.length - 1])
          );
          delete obj.area._id;
        } else {
          obj = {
            area: {},
            sell: 0,
            factory: 0,
            transport: 0
          };
        }
        this.tableList.push(obj);
      },
      async sub() {
        console.log(!this.goods.manufacturer || !this.goods.manufacturer._id);
        try {
          this.value = "更新中";
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
              company: this.goods.company._id,
              detail: this.goods.detail,
              packingType: this.goods.packingType,
              recommenderBonus: this.goods.recommenderBonus,
            };
            if (!this.goods.manufacturer || !this.goods.manufacturer._id) {
              delete update.manufacturer;
            } else {
              this.$set(update, 'manufacturer', this.goods.manufacturer._id);
            }
            let goods = await this.$api.curd({
              model: "goods",
              curdType: "update",
              find: {
                _id: this.$route.params._id
              },
              update
            });
            if (this.priceChange) {
              for (let index = 0; index < this.tableList.length; index++) {
                let price = await this.$api.curd({
                  model: "price",
                  curdType: "add",
                  goods: this.$route.params._id,
                  area: this.tableList[index].area._id,
                  sell: Number(this.tableList[index].sell),
                  factory: Number(this.tableList[index].factory),
                  transport: Number(this.tableList[index].transport)
                });
                if (!price) {
                  io = false;
                }
              }
            }
          }
          this.$message.success("修改成功！");
          if (this.sys) {
            this.$router.push({
              path: "/sys/goods"
            });
          } else {
            this.$router.push({
              path: "/goods/list"
            });
          }
        } catch (error) {
          console.log(error);
        }
        this.value = "";
      },
      tagType(index, arr) {
        let type = ["success", "info", "warning", "danger"];
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
            model: "brand",
            curdType: "find"
          });
        } catch (error) {}
      },
      async getCompany() {
        try {
          this.companyArr = await this.$api.curd({
            model: "company",
            curdType: "find",
          });
        } catch (error) {}
      },
      async getCategory() {
        try {
          this.categoryArr = await this.$api.curd({
            model: "category",
            curdType: "find"
          });
        } catch (error) {}
      },
      async getGoods() {
        try {
          let res = await this.$api.curd({
            model: "goods",
            curdType: "findOne",
            _id: this.$route.params._id,
            populate: [{
              path: "company"
            }, {
              path: "manufacturer"
            }]
          });
          let goods = {};
          for (const key in this.goods) {
            goods[key] = res[key];
          }
          this.goods = JSON.parse(JSON.stringify(goods));
        } catch (error) {}
      },
      async getPrice() {
        try {
          let res = await this.$api.curd({
            model: "price",
            curdType: "find",
            goods: this.$route.params._id
          });
          let areaArr = [];
          res.forEach(resItem => {
            areaArr.push(resItem.area);
          });
          let newAreaArr = new Set(areaArr);
          let arr = [...newAreaArr];
          let tableList = [];
          for (let index = 0; index < arr.length; index++) {
            let price = await this.$api.curd({
              model: "price",
              curdType: "findOne",
              area: arr[index],
              sort: {
                updatedAt: -1
              },
              populate: [{
                path: "area"
              }]
            });
            tableList.push(price);
          }
          this.tableList = JSON.parse(JSON.stringify(tableList));
        } catch (error) {}
      }
    },
    async created() {
      this.value = "加载中";
      await this.getCategory();
      await this.getGoods();
      await this.getBrand();
      await this.getCompany();
      await this.getPrice();
      if (!this.sys) {
        this.companyDisabled = true;
      }
      this.value = "";
    }
  };
</script>

<style scoped>
  .g-order-create {
    padding: 0 1% 1% 1%;
  }
  .g-order {
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
  .edit-tag {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .form-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .form-right {
    padding-right: 20px;
  }
</style>