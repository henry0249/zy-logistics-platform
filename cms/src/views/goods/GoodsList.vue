<template>
  <loading-box class="goods-box" v-model="loadingText">
    <common-table style="padding:0" path="/goods/find" height="calc(100vh - 51px)" :thead="tableHeader" border index :option="option">
      <div slot="header" class="jc js">
        <my-form-item style="margin-right:10px;" size="mini" width='200px' :placeholder="placeholder" input v-model="input"></my-form-item>
        <my-form-item width='200px' @change="brandChange" style="padding-right:10px;" size="mini" collapse-tags placeholder="选择品牌" v-model="brandData" :options="brandArr" select></my-form-item>
        <my-form-item @change="categoryChange" style="padding-right:10px;" filterable width="200px" size="mini" placeholder="选择分类" v-model="categoryData" :options="categoryArr" select></my-form-item>
      </div>
      <template slot-scope="scope" v-if="scope.prop === 'tag'||scope.prop === 'name'">
            <el-tag v-if="scope.prop === 'tag'" style="margin-right:10px;" size="mini" type="success" v-for="item in scope.row['tag']" :key="item.id">{{item}}</el-tag>
            <i title="点击查看详情" class="pointer name-txt" v-if="scope.prop === 'name'" @click="op({type:'read',value:scope})">{{scope.row['name']}}</i>
</template>
    </common-table>
    <el-dialog :title="title" :visible.sync="show">
      <component :is="componentName" :key-arr="key" :key-data="keyData" :str="str"></component>
    </el-dialog>
  </loading-box>
</template>

<script>
  import AddKey from "./AddKey.js";
  import {
    goodsThead,
    populate,
    or,
    addkey
  } from "./key.js";
  export default {
    data() {
      return {
        option: {},
        brandArr: [],
        categoryArr: [],
        brandData: '',
        categoryData: '',
        placeholder: '输入商品名称',
        input: '',
        str: "goods",
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
        tableHeader: goodsThead,
        keyArr: addkey,
        populate,
        or
      };
    },
    watch: {
      input(val) {
        if (val) {
          this.option.$or = [{
            name: {
              $regex: this.input
            }
          }]
        } else {
          delete this.option.$or
        }
      }
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
    methods: {
      brandChange(val) {
        this.$set(this.option, 'brand', val);
      },
      categoryChange(val) {
        this.$set(this.option, 'category', val);
      },
      async getBrand() {
        try {
          this.brandArr = await this.$api.curd({
            model: 'brand',
            curdType: 'find',
            limit: 0
          })
        } catch (error) {
        }
      },
      async getCategory() {
        try {
          this.categoryArr = await this.$api.curd({
            model: 'category',
            curdType: 'find',
            limit: 0
          })
        } catch (error) {
        }
      },
      async test() {},
      op(val) {
        this.$router.push({
          path: '/goods/edmit/' + val.value.row._id,
          query: {
            str: val.type
          }
        })
      },
      async getData() {
        let i = 0;
        try {
          let data = {
            model: "goods",
            curdType: "find",
            limit: 20,
            skip: 0
          };
          let res = await this.$api.curd(data);
          console.log(res);
          this.tableList = res;
        } catch (error) {}
      }
    },
    async created() {
      this.loadingText = '加载中';
      await this.getData();
      await this.getBrand();
      await this.getCategory();
      this.loadingText = '';
    }
  };
</script>

<style scoped>
  .goods-box {
    width: calc(100% - 40px);
    margin: 0 auto;
  }
  .name-txt {
    color: #42a5f5;
  }
  .name-txt:hover {
    text-decoration: underline;
  }
</style>