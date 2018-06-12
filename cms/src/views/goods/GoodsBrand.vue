<template>
  <loading-box class="goods-box" v-model="loadingText">
    <my-table index size="mini" edit :thead="tableHeader" :data.sync="tableList">
      <div slot="header" class="flex header-box">
        <div class="flex search-box">
          <el-input size="mini" clearable placeholder="请输入品牌名或类型" @clear="clear" v-model="input">
            <div slot="append" class="pointer" @click="search">搜索
            </div>
          </el-input>
          <my-form-item style="margin-left:10px;" clearable @clear="clearselect" @change="change" placeholder="按分类筛选" size="mini" width="300px" select v-model="brand.category" label="" :options="category">
          </my-form-item>
        </div>
        <div class="right-box">
          <el-button type="primary" size="mini" @click="add">添加</el-button>
        </div>
      </div>
      <template slot-scope="scope" v-if="scope.column.property === 'category' ||scope.column.property === 'tag' || scope.column.property === 'name' ">
                                            <el-tag v-if="scope.column.property === 'category'" style="margin-right:10px;" size="mini" type="success" v-for="item in scope.row['category']" :key="item.id">
                                              {{item.name}}</el-tag>
                                            <el-tag v-if="scope.column.property === 'tag'" style="margin-right:10px;" size="mini" type="success" v-for="item in scope.row['tag']" :key="item.id">{{item}}</el-tag>
                          <i title="点击查看详情" class="pointer name-txt" v-if="scope.column.property === 'name'" @click="op({type:'read',value:scope})">{{scope.row['name']}}</i>
</template>
    </my-table>
    <el-dialog width="70%" :title="title" :visible.sync="show">
      <component :show.sync="show" :is="componentName" :key-arr="keyArr" :key-data="keyData" :str="str" :category="category"></component>
    </el-dialog>
  </loading-box>
</template>

<script>
  import SeeModel from "../common/SeeModel.vue";
  import CategoryEdmit from "./brandEdmit";
  import BrandAdd from "./BrandAdd";
  import {
    categoryThead,
    keyArr
  } from "./brandData.js";
  export default {
    components: {
      SeeModel,
      CategoryEdmit,
      BrandAdd
    },
    data() {
      return {
        skip: 0,
        limt: 20,
        input: "",
        str: "",
        show: false,
        title: "",
        loadingText: "",
        componentName: "",
        data: "",
        brand: {
          category: ""
        },
        category: [],
        keyData: {},
        boxStyle: {
          width: "calc(100% - 20px)",
          height: "calc(100% - 10px)"
        },
        heightValue: "calc(100% - 10px)",
        tableList: [],
        tableHeader: categoryThead,
        keyArr
      };
    },
    methods: {
      async change(val) {
        console.log(val);
        let data = {
          category: val
        }
        if (this.input) {
          data.$or = [{
              name: {
                $regex: this.input
              }
            },
            {
              type: {
                $regex: this.input
              }
            }
          ]
        }
        await this.getData(data)
      },
      async clear() {
        let data = {};
        if (this.brand.category) {
          data.category = this.brand.category
        }
        await this.getData(data);
      },
      async clearselect() {
        let data = {}
        if (this.input) {
          data.$or = [{
              name: {
                $regex: this.input
              }
            },
            {
              type: {
                $regex: this.input
              }
            }
          ]
        }
        await this.getData(data)
      },
      async search() {
        let data = {
          $or: [{
              name: {
                $regex: this.input
              }
            },
            {
              type: {
                $regex: this.input
              }
            }
          ]
        };
        if (this.brand.category) {
          data.category = this.brand.category
        }
        await this.getData(data);
      },
      add() {
        this.componentName = "BrandAdd";
        this.title = "添加品牌";
        this.show = true;
      },
      op(val) {
          this.componentName = "CategoryEdmit";
          this.title = "查看详情";
          this.keyData = val.value.row;
          console.log(this.keyData);
          this.str = this.$route.path;
          this.show = true;
      },
      async getData(data) {
        try {
          this.loadingText = "加载中";
          data.model = "brand";
          data.curdType = "find";
          data.limit = this.limt;
          data.skip = this.skip;
          data.populate = [{
            path: "category"
          }];
          console.log("data", data);
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              if (!data[key]) {
                delete data[key]
              }
            }
          }
          let res = await this.$api.curd(data);
          console.log(res);
          this.tableList = res;
        } catch (error) {}
        this.loadingText = "";
      },
      async getCategory() {
        try {
          let res = await this.$api.curd({
            model: "category",
            curdType: "find"
          });
          res.forEach(resItem => {
            let obj = {};
            obj._id = resItem._id;
            obj.name = resItem.name;
            this.category.push(obj);
          });
        } catch (error) {}
      }
    },
    async created() {
      let data = {};
      await this.getCategory();
      await this.getData(data);
    }
  };
</script>

<style scoped>
  .goods-box {
    width: calc(100% - 40px);
    margin: 0 auto;
  }
  .header-box {
    height: 36px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }
  .search-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .name-txt {
    color: #42a5f5;
  }
  .name-txt:hover {
    text-decoration: underline;
  }
</style>