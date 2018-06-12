<template>
  <loading-box class="goods-box" v-model="loadingText">
    <my-table index size="mini" edit :thead="tableHeader" :data.sync="tableList">
      <div slot="header" class="flex header-box">
        <div class="flex search-box">
          <el-input size="mini" clearable placeholder="请输入品牌名或类型" @clear="clear" v-model="input">
            <div slot="append" class="pointer" @click="search">搜索
            </div>
          </el-input>
        </div>
        <div class="right-box">
          <el-button type="primary" size="mini" @click="add">添加</el-button>
        </div>
      </div>
      <template slot-scope="scope" v-if="scope.column.property === 'name' ">
         <i title="点击查看详情" class="pointer name-txt" v-if="scope.column.property === 'name'" @click="op({type:'read',value:scope})">{{scope.row['name']}}</i>
      </template>
    </my-table>
    <el-dialog :title="title" :visible.sync="show">
      <component :parent="parent" :categoryId="categoryId" :show.sync="show" :is="componentName" :key-arr="key" :key-data="keyData" :str="str"></component>
    </el-dialog>
  </loading-box>
</template>

<script>
  import SeeModel from "../common/SeeModel.vue";
  import CategoryEdmit from './CategoryEdmit';
  import CategoryAdd from './CategoryAdd';
  import {
    categoryThead,
    keyArr
  } from "./categoryData.js";
  export default {
    components: {
      SeeModel,
      CategoryEdmit,
      CategoryAdd
    },
    data() {
      return {
        input: '',
        skip: 0,
        limit: 20,
        categoryId: '',
        parent: [],
        str: "",
        show: false,
        title: "",
        loadingText: "",
        componentName: "",
        data: "",
        keyData: {},
        boxStyle: {
          width: "calc(100% - 20px)",
          height: "calc(100% - 10px)"
        },
        heightValue: "calc(100% - 10px)",
        tableList: [],
        tableHeader: categoryThead,
        keyArr,
        populate: [{
          path: 'parent'
        }],
      };
    },
    computed: {
      key() {
        let i = null;
        let arr = JSON.parse(JSON.stringify(this.keyArr));
        arr.forEach((item, index) => {
          if (item.key === "company.name" && !this.company.name) {
            i = index;
          } else if (item.key === "platform.name" && !this.platform.name) {
            i = index;
          }
        });
        if (i) {
          arr.splice(i, 1);
        }
        return arr;
      }
    },
    watch: {
      async $route(val) {
        this.changePath(val)
      }
    },
    methods: {
      async clear() {
        let data = {};
        await this.getData(data);
      },
      async search() {
        let data = {
          $or: [{
            name: {
              $regex: this.input
            }
          }]
        };
        await this.getData(data);
      },
      async changePath(val) {
        let parent = {
          "parent.name": {
            readOnly: true,
            name: '上级分类'
          },
        }
        if (val.path === '/goods/category/1') {
          let i = null
          delete this.tableHeader['parent.name']
          this.keyArr.forEach((item, index) => {
            if (item.key === 'parent.name') {
              i = index
            }
          });
          if (i) {
            this.keyArr.splice(i, 1)
          }
        } else if (val.path === '/goods/category/2') {
          let i = null
          this.tableHeader['parent.name'] = {
            name: '上级分类'
          }
          this.keyArr.forEach((item, index) => {
            if (item.key === 'parent.name') {
              i = index
            }
          });
          if (!i) {
            this.keyArr.push({
              key: 'parent.name',
              value: null,
              type: 'select',
              keyValue: '上级分类',
              options: []
            })
          }
        }
        console.log(val.path);
        await this.getData({})
      },
      add() {
        this.componentName = "CategoryAdd";
        this.title = "添加品牌";
        this.show = true;
      },
      op(val) {
          this.componentName = "CategoryEdmit";
          this.title = "查看详情";
          this.show = true;
          this.keyData = JSON.parse(JSON.stringify(val.value.row));
          this.str = this.$route.path
          if (this.$route.path === '/goods/category/2') {
            this.categoryId = val.value.row.parent._id || ''
          }
      },
      async getData(data) {
        let i = 0;
        try {
          this.loadingText = '加载中'
          data.model = "category";
          data.curdType = "find";
          data.limit = this.limt;
          data.skip = this.skip;
          data.populate = this.populate;
          if (this.$route.path === '/goods/category/2') {
            data.parent = {
              $exists: true
            }
          }
          if (this.$route.path === '/goods/category/1') {
            data.parent = {
              $exists: false
            }
          }
          console.log('data', data);
          let res = await this.$api.curd(data);
          console.log(res);
          this.tableList = res;
        } catch (error) {}
        this.loadingText = ''
      },
      async getParent() {
        try {
          this.loadingText = '加载中';
          let data = {
            model: 'category',
            curdType: 'find',
            parent: {
              $exists: false
            }
          }
          let res = await this.$api.curd(data)
          console.log('res', res);
          res.forEach(resItem => {
            let obj = {}
            obj.name = resItem.name
            obj._id = resItem._id
            this.parent.push(obj)
          });
        } catch (error) {
          console.log(error);
        }
        this.loadingText = '';
      },
    },
    async created() {
      console.log(this.$route);
      await this.changePath(this.$route);
      await this.getParent()
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