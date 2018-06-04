<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>添加商品</strong>
        </div>
        <my-form size="mini" width="24%" style="margin:15px 0" v-if="!loadingText">
          <div class="flex form-box">
            <my-form-item class="form-right" input v-model="goods.name" filterable label="商品名">
            </my-form-item>
            <my-form-item class="form-right" input v-model="goods.unit" filterable label="单位">
            </my-form-item>
            <my-form-item class="form-right" input v-model="goods.spec" filterable label="规格">
            </my-form-item>
            <my-form-item select v-model="goods.category" label="分类" :options="category">
            </my-form-item>
          </div>
          <div class="flex form-box" style="margin-top:20px;">
            <my-form-item class="form-right" select v-model="goods.brand" filterable label="品牌" :options="brand">
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
              <el-tag size="mini" style="margin-right:10px;" :key="tag" v-for="tag in goods.tag" closable :disable-transitions="false" @close="handleClose(goods.tag,tag)">
                {{tag}}
              </el-tag>
              <el-input style="width:60px" size="mini" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" @keyup.enter.native="handleInputConfirm(goods.tag)" @blur="handleInputConfirm(goods.tag)">
              </el-input>
              <el-button size="mini" v-else class="button-new-tag" @click="showInput">添加标签</el-button>
            </div>
          </div>
        </my-form>
        <my-form-item size="mini" v-model="goods.detail" width="100%" class="form-right" input type="textarea" autosize label="订单备注">
        </my-form-item>
        <my-table style="margin-top:20px;" border index size="mini" edit :thead="tableTeader" :data.sync="tableList" op>
          <div slot="op" slot-scope="scope">
            <i v-if="tableList.length>1" title="删除该地区" class="pointer" style="margin-right:10px" @click="delAdr(scope['index'])">
                                    <icon size="16px">icon-ec1</icon>
                                  </i>
            <i v-if="scope['index'] === tableList.length - 1" title="增加一个地区" class="pointer" @click="addAdr">
                                    <icon size="16px">icon-54</icon>
                                  </i>
          </div>
          <template slot-scope="scope" v-if="scope.column.property === 'address'">
                                  <my-form-item :change-on-select="true" size="mini" style="width:100%" label="区域数据" v-model="scope.row[scope.column.property]" :area="area" :level="areaLevel" placeholder="选择数据" @change="areaChange"/>
</template>
        </my-table>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" @click="$router.go(-1)">取 消</el-button>
        <el-button size="small" type="primary" @click="sub">添 加</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  import cityData from "../common/cityData.js";
  import cityKey from "./cityKey.js";
  import {
    keyArr1,
    keyArr2,
    keyArr3,
    keyArr4,
  } from "./add.js";
  export default {
    data() {
      return {
        goods: {
          name: '',
          unit: '',
          spec: '',
          category: '',
          brand: '',
          mfrs: '',
          saleState: '',
          selfDeliverySupport: false,
          freeDelivery: false,
          tag: [],
          detail: '',
        },
        category: [],
        brand: [],
        mfrs: [],
        loadingText: '',
        areaLevel: 5,
        areaObj: {},
        area: {},
        loading: false,
        inputVisible: false,
        inputValue: "",
        cityData: [],
        tableTeader: {
          address: {
            name: "地区",
            options: [],
            readOnly: true,
            slot: true
          },
          factory: {
            name: "出厂价"
          },
          sell: {
            name: "销售价"
          },
          transport: {
            name: "运输价"
          }
        },
        tableList: [{
          address: {},
          factory: 0,
          sell: 0,
          transport: 0
        }]
      };
    },
    computed: {
      length() {
        return this.price.length;
      }
    },
    methods: {
      areaChange(val) {
        this.areaObj = val
      },
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
      addAdr() {
        let obj = JSON.parse(JSON.stringify(this.tableList[this.tableList.length - 1]));
        this.tableList.push(obj);
      },
      async addGoods() {
        let obj = {
          model: 'goods',
          curdType: 'add',
          name: this.goods.name,
          unit: this.goods.unit,
          spec: this.goods.spec,
          category: this.goods.category,
          brand: this.goods.brand,
          mfrs: this.goods.mfrs,
          saleState: this.goods.saleState,
          selfDeliverySupport: this.goods.selfDeliverySupport,
          freeDelivery: this.goods.freeDelivery,
          tag: this.goods.tag,
          detail: this.goods.detail,
        };
        if (this.platform.name) {
          obj.platform = this.platform._id;
          delete obj.company;
        }
        if (this.company.name) {
          obj.company = this.company._id;
          delete obj.platform;
        }
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (!obj[key]) {
              delete obj[key]
            }
          }
        }
        try {
          let res = await this.$api.curd(obj)
          if (res) {
            await this.addPrice(res._id)
          }
        } catch (error) {
        }
      },
      async addPrice(id) {
        for (let index = 0; index < this.tableList.length; index++) {
          for (const key in this.tableList[index]) {
            if (this.tableList[index].hasOwnProperty(key)) {
              if (key !== 'address') {
                let _id = ''
                for (const k in this.area) {
                  if (this.area.hasOwnProperty(k)) {
                    if (this.area[k].length > 0) {
                      this.area[k].forEach(item => {
                        if (Number(this.tableList[index].address[this.tableList[index].address.length - 1]) === item.key) {
                          _id = item._id
                        }
                      });
                    }
                  }
                }
                if (_id !== '') {
                  let priceOp = {
                    model: 'price',
                    curdType: 'add',
                    area: _id,
                    goods: id,
                    value: this.tableList[index][key],
                    type: key
                  }
                  let price = await this.$api.curd(priceOp)
                } else {
                }
              }
            }
          }
        }
      },
      async sub() {
        let io = false
        this.tableList.forEach(item => {
          if (item.address.length === 0) {
            io = true
          }
        });
        if (!this.goods.name) {
          this.$alert('请先填写名字', '提示', {
            confirmButtonText: '确定',
            callback: action => {}
          });
        } else if (io) {
          this.$alert('请选择地区', '提示', {
            confirmButtonText: '确定',
            callback: action => {}
          });
        } else {
          this.loadingText = '加载中'
          await this.addGoods()
          this.loadingText = ''
        }
      },
      switchChange(val) {},
      handleInputConfirm(options) {
        let inputValue = this.inputValue;
        if (inputValue) {
          options.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = "";
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
            let {
              _id,
              name
            } = resItem
            this.mfrs.push({
              _id,
              name
            })
          });
        } catch (error) {}
      },
      async getBrand() {
        try {
          let res = await this.$api.curd({
            model: 'brand',
            curdType: 'find',
          })
          res.forEach(resItem => {
            let {
              _id,
              name
            } = resItem
            this.brand.push({
              _id,
              name
            })
          });
        } catch (error) {}
      },
      async getCategory() {
        try {
          let res = await this.$api.curd({
            model: 'category',
            curdType: 'find',
          })
          res.forEach(resItem => {
            let {
              _id,
              name
            } = resItem
            this.category.push({
              _id,
              name
            })
          });
        } catch (error) {}
      },
      async getArea() {
        try {
          this.area = await this.$api.getArea()
        } catch (error) {
        }
      },
    },
    async created() {
      this.loadingText = '加载中'
      await this.getCategory()
      await this.getBrand()
      await this.getMfrs()
      await this.getArea()
      this.loadingText = ''
    }
  };
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