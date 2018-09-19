<template>
  <loading-box v-model="value">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>添加商品</strong>
        </div>
        <common-alert style="margin:15px 0">商品详情</common-alert>
        <my-form size="mini" width="24%" style="margin:15px 0" v-if="!value">
          <div class="jb">
            <my-form-item placeholder="请输入商品名" input v-model="goods.name" filterable label="商品名">
            </my-form-item>
            <my-form-item placeholder="请输入单位" input v-model.lazy="goods.unit" filterable label="单位">
            </my-form-item>
            <my-form-item placeholder="请输入规格" input v-model="goods.spec" filterable label="规格">
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
            <div style="width:24%" class="jb">
              <my-form-item width="50%" switch v-model="goods.selfDeliverySupport" label="支持自提">
              </my-form-item>
              <my-form-item class="flex" style="justify-content: flex-end;" width="50%" switch v-model="goods.freeDelivery" label="包配送费">
              </my-form-item>
            </div>
          </div>
          <div class="jb" style="margin-top:20px;">
            <div class="flex edit-tag" style="width:24%">
              <i style="width:60px;font-size: 12px;">标签</i>
              <el-tag size="mini" style="margin-right:10px;" :type="tagType(index,goods.tag)" :key="index" v-for="(tag,index) in goods.tag" closable :disable-transitions="false" @close="handleClose(goods.tag,tag)">
                {{tag}}
              </el-tag>
              <el-input style="width:60px" size="mini" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" @keyup.enter.native="handleInputConfirm(goods.tag)" @blur="handleInputConfirm(goods.tag)">
              </el-input>
              <el-button size="mini" v-else class="button-new-tag" @click="showInput">添加标签</el-button>
            </div>
            <div style="width:24%" v-if="!sys"></div>
          </div>
          <my-form-item style="margin-top:20px;" size="mini" placeholder="请输入商品详情" v-model="goods.detail" width="100%" input type="textarea" autosize label="商品详情">
          </my-form-item>
        </my-form>
        <common-alert style="margin:15px 0">
          <div style="width:100%" class="jb">
            <div>商品价格</div>
            <div class="jc je">
              <i class="el-icon-plus jc pointer" style="color:#67C23A;font-size:15px;" title="添加新的价格" @click="addPrice"></i>
            </div>
          </div>
        </common-alert>
        <div class="jc" style="color:#ccc;" v-if="tableList.length === 0">请先添加价格</div>
        <my-table v-else size="mini" edit :thead="thead" :data.sync="tableList" index border op opWidth="50px">
          <div slot="op" slot-scope="scope" class="tc" style="width:100%;color:#F56C6C">
            <i v-if="tableList.length>0" title="删除该地区" class="pointer" @click="delAdr(scope['index'])">
                                                <icon size="16px">icon-ec1</icon>
                                              </i>
          </div>
          <template slot-scope="scope">
                                  <my-select v-if="scope.column.property === 'area'" :disabled="scope.row[scope.column.property]._id?true:false" :data.sync="scope.row[scope.column.property]" area></my-select>
                                              <el-input-number v-if="scope.column.property === 'factory'||scope.column.property === 'transport'||scope.column.property === 'sell'" v-model="scope.row[scope.column.property]" controls-position="right" size="mini" :min="1"></el-input-number>
</template>
        </my-table>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        <el-button :disabled="disabled" size="small" type="primary" @click="checkMethods">添 加</el-button>
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
        disabled: true,
        value: "",
        tableList: [],
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
        goods: {
          name: "",
          unit: "",
          spec: "",
          category: "",
          brand: "",
          saleState: 1,
          selfDeliverySupport: false,
          freeDelivery: false,
          tag: [],
          company: {},
          detail: ""
        },
        inputVisible: false,
        inputValue: "",
        categoryArr: [],
        brandArr: [],
        companyArr: []
      };
    },
    watch: {
      async 'goods.company' (val) {
        await this.getBrand();
      },
      company: {
        handler(val) {
          if (!this.sys) {
            this.$set(this.goods, 'company', val);
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
          this.disabled = false;
          this.goodsChange = true;
        },
        deep: true
      }
    },
    methods: {
      delAdr(i) {
        this.tableList.splice(i, 1);
      },
      addPrice() {
        let obj = {
          area: {},
          sell: 0,
          transport: 0,
          factory: 0
        };
        this.tableList.push(obj);
      },
      tagType(index, arr) {
        let type = ["success", "info", "warning", "danger"];
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
      async checkMethods() {
        if (!this.goods.name) {
          this.$message.warn('名字是必填的');
          return;
        }
        if (this.sys && !Object.keys(this.goods.company).length === 0) {
          this.$message.warn('生产厂商是必填的');
          return;
        }
        if (this.tableList.length > 0) {
          this.tableList.forEach(tableListItem => {
            if (Object.keys(tableListItem.area).length === 0) {
              this.$message.warn('地区是必填的');
              return;
            }
            if (!/(^[1-9]\d*$)/.test(tableListItem.sell) ||
              !/(^[1-9]\d*$)/.test(tableListItem.factory) ||
              !/(^[1-9]\d*$)/.test(tableListItem.transport)
            ) {
              this.$message.warn('价格必须是数字并且大于0');
              return;
            }
          });
        }
        await this.sub();
      },
      async sub() {
        try {
          this.value = "更新中";
          let io = true;
          let goodsOp = {
            model: "goods",
            curdType: "add"
          };
          for (const key in this.goods) {
            goodsOp[key] = this.goods[key];
          }
          let goods = await this.$api.curd(goodsOp);
          for (let index = 0; index < this.tableList.length; index++) {
            let price = await this.$api.curd({
              model: "price",
              curdType: "add",
              sell: this.tableList[index].sell,
              factory: this.tableList[index].factory,
              transport: this.tableList[index].transport,
              goods: goods._id,
              area: this.tableList[index].area._id
            });
          }
          this.$message.success("添加成功！");
          if (this.sys) {
            this.$router.push({
              path: "/sys/goods"
            });
          } else {
            this.$router.push({
              path: "/goods/list"
            });
          }
        } catch (error) {}
        this.value = "";
      },
      async getBrand() {
        try {
          let data = {
            model: "brand",
            curdType: "find",
            limit: 0
          }
          if (!this.sys) {
            this.$set(data, 'company', this.company._id);
          }
          this.brandArr = await this.$api.curd(data);
        } catch (error) {}
      },
      async getCategory() {
        try {
          this.categoryArr = await this.$api.curd({
            model: "category",
            curdType: "find",
            limit: 0
          });
        } catch (error) {}
      }
    },
    async created() {
      this.value = "加载中";
      await this.getBrand();
      await this.getCategory();
      if (!this.sys) {
        this.$set(this.goods, 'company', this.company);
      }
      this.value = "";
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