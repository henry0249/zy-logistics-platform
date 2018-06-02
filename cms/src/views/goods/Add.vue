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
        <el-button size="small" type="primary" @click="sub">立即修改</el-button>
      </div>
    </div>
  </loading-box>
  <!-- <div class="flex add-warp" v-loading="loading">
              <div class="flex add-header">
                <span>添加商品</span>
              </div>
              <div class="add-content">
                <div class="add-list-box">
                  <div class="flex add-list">
                    <div class="flex list-box" v-for="item in keyArr1" :key="item.id">
                      <span class="flex add-span">{{item.keyValue}}</span>
                      <el-input v-model="item.value" :placeholder="`请输入${item.keyValue}`" style="flex:1;margin-right:20px"></el-input>
                    </div>
                  </div>
                  <div class="flex add-list">
                    <div class="flex list-box" v-for="item in keyArr2" :key="item.id">
                      <span class="flex add-span">{{item.keyValue}}</span>
                      <el-select v-model="item.value" :placeholder="'请选择'+item.keyValue" style="flex:1;margin-right:20px">
                        <el-option v-for="v in item.options" :key="v.id" :label="v.label" :value="v.value">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="flex add-list">
                    <div class="flex list-box" v-for="item in keyArr3" :key="item.id">
                      <span class="flex add-span">{{item.keyValue}}</span>
                      <el-switch @change="switchChange" v-model="item.value" :active-text="item.options[0]" :inactive-text="item.options[1]">>
                      </el-switch>
                    </div>
                  </div>
                  <div class="flex add-list" style="margin-bottom:10px;">
                    <div class="flex list-box" v-for="item in keyArr4" :key="item.id" style="width:calc(50% - 10px)">
                      <span class="flex add-span">{{item.keyValue}}</span>
                      <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-if="item.type == 'textarea'" v-model="item.value" :placeholder="'请输入'+item.keyValue" style="flex:1;margin-right:20px"></el-input>
                      <div class="flex arr-box" v-else-if="item.type == 'Arr'" style="flex:1">
                        <el-tag style="margin:5px 0 0 5px" :key="tag" v-for="tag in item.options" closable :disable-transitions="false" @close="handleClose(item.options,tag)">
                          {{tag}}
                        </el-tag>
                        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(item.options)" @blur="handleInputConfirm(item.options)">
                        </el-input>
                        <el-button v-else class="button-new-tag" style="margin:5px 0 0 5px" size="small" @click="showInput">添加新标签</el-button>
                      </div>
                    </div>
                  </div>
                </div>
                <my-table v-if="!loading" index size="mini" edit :thead="tableTeader" :data.sync="tableList" op>
                  <div slot="op" slot-scope="scope">
                    <i v-if="tableList.length>1" title="删除该地区" class="pointer" style="margin-right:10px" @click="delAdr(scope['index'])">
                                                            <icon size="16px">icon-ec1</icon>
                                                          </i>
                    <i v-if="scope['index'] === tableList.length - 1" title="增加一个地区" class="pointer" @click="addAdr">
                                                            <icon size="16px">icon-54</icon>
                                                          </i>
                  </div>
<template slot-scope="scope" v-if="scope.column.property === 'address'">
  <my-form-item size="mini" style="width:100%" label="区域数据" v-model="scope.row[scope.column.property]" :area="area" :level="areaLevel" placeholder="选择数据" @change="areaChange" />
</template>
        </my-table>
    </div>
    <div class="add-footer">
      <el-button size="mini" @click="$router.go(0)">取 消</el-button>
      <el-button size="mini" type="success" @click="sub">提 交</el-button>
    </div>
  </div> -->
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
        keyArr4,
        cityKey,
        keyArr3,
        keyArr2,
        keyArr1,
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
          address: [],
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
        console.log(val);
        this.areaObj = val
      },
      add() {},
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
          obj.platform = this.platform._id
        }
        if (this.company.name) {
          obj.company = this.company._id
        }
        try {
          let res = await this.$api.curd(obj)
          if (res) {
            console.log('goods', res);
            await this.addPrice(res._id)
          }
        } catch (error) {
          console.log(error);
        }
      },
      async addPrice(id) {
        for (let index = 0; index < this.tableList.length; index++) {
          for (const key in this.tableList[index]) {
            if (this.tableList[index].hasOwnProperty(key)) {
              if (key !== 'address') {
                let priceOp = {
                  model: 'price',
                  curdType: 'add',
                  area: this.areaObj.last._id,
                  goods: id,
                  value: this.tableList[index][key],
                  type: key
                }
                let price = await this.$api.curd(priceOp)
                console.log('price', price);
              }
            }
          }
        }
      },
      async sub() {
        this.loading = true
        await this.addGoods()
        this.loading = false
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
      changeKeyData() {
        let i = 0;
        if (Object.keys(this.company).length <= 0) {
          for (let index = 0; index < this.keyArr2.length; index++) {
            if (this.keyArr2[index].key === "company.name") {
              i = index;
            }
          }
        } else if (Object.keys(this.platform).length <= 0) {
          for (let index = 0; index < this.keyArr2.length; index++) {
            if (this.keyArr2[index].key === "platform.name") {
              i = index;
            }
          }
        }
        this.keyArr2.splice(i, 1);
      },
      async getGoods() {
        try {
          let res = await this.$api.curd({
            model: 'goods',
            curdType: 'find',
          })
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
          console.log('res', res);
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
          console.log(this.area)
        } catch (error) {
          console.log(error)
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
  /* .add-warp {
                width: 100%;
                height: 100%;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
              }
              .add-header {
                height: 36px;
                width: calc(100% - 40px);
                border-bottom: 1px solid #ccc;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 10px;
                box-sizing: border-box;
              }
              .add-content {
                flex: 1;
                height: calc(100vh - 51px - 45px - 40px);
                width: calc(100% - 40px);
                overflow: auto;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
              }
              .add-list-box {
                width: calc(100% - 120px);
                margin: 0 auto;
              }
              .list-box {
                width: 33.3%;
                min-height: 40px;
                float: left;
                margin: 10px 0;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
              }
              .add-span {
                width: 100px;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
              }
              .add-list {
                width: 100%;
                flex-direction: row;
                justify-content: flex-start;
                align-items: flex-start;
                flex-wrap: wrap;
              }
              .arr-box {
                flex: 1;
                height: 96px;
                flex-direction: row;
                justify-content: flex-start;
                align-items: flex-start;
                flex-wrap: wrap;
                box-sizing: border-box;
                border: 1px solid #ccc;
                overflow: auto;
                border-radius: 4px;
              }
              .list-box:last-child {
              }
              .add-address-box {
                width: 100%;
                height: 200px;
                flex-direction: row;
                justify-content: center;
                align-items: flex-start;
                flex-wrap: wrap;
                position: relative;
              }
              .input-new-tag {
                width: 80px;
                margin: 5px 0 0 5px;
              }
              .icon-box {
                position: absolute;
                right: 0px;
                top: 50%;
                transform: translateY(-50%);
              }
              .add-footer {
                width: calc(100% - 40px);
                height: 40px;
              } */
</style>