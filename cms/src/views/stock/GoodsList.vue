<template>
  <loading-box v-model="loadingText">
    <common-alert style="margin-top:15px;">
      <div class="jc jb" style="width:100%">
        <div>商品信息</div>
        <div class="blue jc js" v-if="isCheck">
          <div class="jc js info">
            <span>总共有<span class="blue">{{allCount}}</span>件商品，</span>
            <span>已选<span class="success">{{count}}</span>件商品</span>
          </div>
          <div @click="checkAllMethods" v-if="!checkAll" style="margin:0 20px 0 20px;">
            <icon class="warning">icon-panxuan</icon>
            盘点所剩商品
          </div>
          <div class="success jc js" @click="addCheck = true">
            <i class="el-icon-plus"></i>
            <div>{{`添加盘点`}}</div>
          </div>
        </div>
      </div>
    </common-alert>
    <my-table @selection-change="selectionChange" :selection="$attrs.type === 'check'" size="mini" border stripe style="padding:0" :thead="thead" :op="$attrs.type === 'check'" opWidth="50px" :data.sync="goodsData" max-height="200">
      <div class="jc" slot="op" slot-scope="scope">
        <remove-check class="danger" @remove="remove(scope)"></remove-check>
      </div>
      <div slot-scope="scope">
        <my-form-item number v-if="scope.prop === 'key'" v-model="scope.row['key']" :min="0" size="mini"></my-form-item>
        <my-select v-if="scope.prop === 'name'" :currentCompany="company._id" :disabled="disabled" goods :data.sync="goodsData[scope.index]" size="mini"></my-select>
        <div v-if="scope.prop === 'add'">
        </div>
      </div>
    </my-table>
    <div class="jc je check-all-box" v-if="show">
      <my-form-item label="盘点数量" width="200px" number v-model="allCheckValue" :min="0" size="mini"></my-form-item>
      <el-button style="margin-left:20px;" type="primary" size="mini" @click="batchUpdate">批量盘点</el-button>
    </div>
  </loading-box>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      isCheck: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        show: false,
        allCount: 0,
        count: 0,
        allCheckValue: 0,
        checkAll: false,
        addCheck: false,
        loadingText: "",
        disabled: false,
        selectionChangeData: [],
        allGoodsData: [],
        goodsData: [{
          name: "",
          brand: "",
          category: "",
          unit: "",
          stock: 0,
          key: 0
        }]
      };
    },
    watch: {
      show(val) {
        if (!val) {
          this.allCheckValue = 0;
        }
      },
      allGoodsData: {
        handler(val) {
          console.log(val);
        },
        deep: true
      },
      addCheck(val) {
        if (val) {
          this.add();
        }
      },
      goodsData: {
        handler(val, oldVal) {
          let data = val;
          data.forEach((item, index) => {
            if (oldVal[index].key) {
              this.$set(data[index], 'key', oldVal[index].key);
            } else
            if (!item.key) {
              this.$set(data[index], 'key', 0);
            }
          });
          for (let index = 0; index < data.length; index++) {
            for (let i = index + 1; i < data.length; i++) {
              if (data[index]._id) {
                if (data[index]._id === data[i]._id) {
                  data.splice(i, 1, {
                    name: "",
                    brand: "",
                    category: "",
                    unit: "",
                    stock: 0,
                    key: 0
                  });
                  this.$message.warn('已选择该商品')
                }
              }
            }
          }
          this.goodsData = data;
          this.$emit("update:data", val);
        },
        deep: true
      },
      async "$attrs.type" (val) {
        if (val !== "check") {
          this.goodsData = [{
            name: "",
            brand: "",
            category: "",
            unit: "",
            stock: 0,
            key: 0
          }];
          this.disabled = false;
          this.checkAll = false
        } else {
          try {
            this.loadingText = "加载中";
            await this.getGoodsCount();
            await this.getGoodsByComapny();
          } catch (error) {}
          this.loadingText = "";
        }
      },
      async checkAll(val) {
        if (val && this.$attrs.type === "check") {
          this.disabled = true;
        } else {
          this.goodsData = [{
            name: "",
            brand: "",
            category: "",
            unit: "",
            stock: 0,
            key: 0
          }];
          this.disabled = false;
        }
      }
    },
    computed: {
      thead() {
        let obj = {
          name: {
            name: "商品名",
            slot: true
          },
          "brand.name": {
            readOnly: true,
            name: "品牌"
          },
          "category.name": {
            readOnly: true,
            name: "分类"
          },
          unit: {
            readOnly: true,
            name: "单位"
          },
          stock: {
            readOnly: true,
            name: "当前库存"
          },
          key: {
            readOnly: true,
            name: this.field.Stock.type.option[this.$attrs.type] + "数量",
            slot: true
          }
        };
        return obj;
      }
    },
    methods: {
      checkAllMethods() {
        let data = [];
        let goodsData = JSON.parse(JSON.stringify(this.allGoodsData));
        this.goodsData.forEach(item => {
          if (item._id) {
            data.push(item);
          }
        });
        goodsData.forEach((item, index) => {
          data.forEach(dataItem => {
            if (item._id === dataItem._id) {
              goodsData.splice(index, 1);
            }
          });
        });
        goodsData.forEach(item => {
          let obj = JSON.parse(JSON.stringify(item));
          obj.key = 0;
          data.push(obj);
        });
        for (let index = 0; index < data.length; index++) {
          for (let i = index + 1; i < data.length; i++) {
            if (data[i]._id === data[index]._id) {
              data.splice(i,1);
            }
          }
        }
        this.goodsData = data;
        this.disabled = true;
      },
      batchUpdate() {
        if (this.selectionChangeData.length > 0) {
          this.selectionChangeData.forEach(item => {
            if (!item._id) {
              this.$message.warn('请先选择商品');
              return;
            } else {
              this.goodsData.forEach((goodsItem, index) => {
                if (item._id === goodsItem._id) {
                  this.$set(this.goodsData[index], 'key', this.allCheckValue);
                }
              });
            }
          });
        }
      },
      selectionChange(val) {
        let io = true;
        val.forEach(item => {
          if (!item._id) {
            io = false;
            return;
          }
        });
        if (!io) {
          this.$message.warn('请先选择商品');
        }
        this.selectionChangeData = val;
        this.count = val.length;
        if (val.length > 0) {
          this.show = true;
        } else {
          this.show = false;
        }
      },
      remove(scope) {
        this.goodsData.splice(scope.index, 1);
      },
      add() {
        if (this.goodsData.length < this.allCount) {
          this.goodsData.push({
            name: "",
            brand: "",
            category: "",
            unit: "",
            stock: 0,
            key: 0
          })
        } else {
          this.$message.warn(`只能添加${this.allCount}个商品`);
        }
        this.addCheck = false;
      },
      async getGoodsByComapny() {
        let res = await this.$api.curd({
          model: "goods",
          curdType: "find",
          company: this.company._id,
          limit: 0
        });
        this.allGoodsData = [];
        res.forEach(item => {
          let obj = item;
          this.$set(obj, "key", 0);
          this.allGoodsData.push(obj);
        });
      },
      async getGoodsCount() {
        this.allCount = await this.$ajax.post('/goods/count', {
          company: this.company._id
        })
      }
    },
    created () {
      console.log(this.data);
      if (this.data.length > 0) {
        this.goodsData = JSON.parse(JSON.stringify(this.data));
        console.log(this.goodsData);
      }
    }
  };
</script>

<style scoped>
  .check-all-box {
    width: 100%;
    height: 40px;
    margin-top: 15px;
    border-right: none;
    border-left: none;
  }
</style>