<template>
  <loading-box class="goods-box" v-model="loadingText">
    <my-table index size="mini" edit :thead="tableHeader" :data.sync="tableList" op @op="op">
    </my-table>
    <el-dialog :title="title" :visible.sync="show">
      <component :show.sync="show" :is="componentName" :key-arr="key" :key-data="keyData" :str="str"></component>
    </el-dialog>
  </loading-box>
</template>

<script>
  import SeeModel from "../common/SeeModel.vue";
  import CategoryEdmit from './CategoryEdmit';
  import {
    categoryThead,
    keyArr
  } from "./categoryData.js";
  export default {
    components: {
      SeeModel,
      CategoryEdmit
    },
    data() {
      return {
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
        await this.getData()
      },
      op(val) {
        if (val.type === "read") {
          this.componentName = "SeeModel";
          this.title = "查看详情";
          this.show = true;
          this.keyData = val.value.row;
          this.str = this.$route.path
        } else if (val.type === "edit") {
          this.componentName = "CategoryEdmit";
          this.title = "修改信息";
          this.show = true;
          this.keyData = val.value.row;
          this.str = this.$route.path
        }
      },
      async getData() {
        let i = 0;
        try {
          this.loadingText = '加载中'
          let data = {
            model: "category",
            curdType: "find",
            populate: this.populate,
            limit: 20,
            skip: 0,
          };
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
      }
    },
    async created() {
      console.log(this.$route);
      await this.changePath(this.$route);
    }
  };
</script>

<style scoped>
  .goods-box {
    width: calc(100% - 40px);
    margin: 0 auto;
  }
</style>