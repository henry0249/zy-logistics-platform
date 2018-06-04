<template>
  <loading-box class="goods-box" v-model="loadingText">
    <my-table index size="mini" edit :thead="tableHeader" :data.sync="tableList" op @op="op">
    </my-table>
    <el-dialog :title="title" :visible.sync="show">
      <component :show.sync="show" :is="componentName" :key-arr="keyArr" :key-data="keyData" :str="str"></component>
    </el-dialog>
  </loading-box>
</template>

<script>
  import SeeModel from "../common/SeeModel.vue";
  import CategoryEdmit from './brandData';
  import {
    categoryThead,
    keyArr
  } from "./brandData.js";
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
          path: 'category'
        }],
      };
    },
    methods: {
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
        try {
          this.loadingText = '加载中'
          let data = {
            model: "brand",
            curdType: "find",
            populate: this.populate,
            limit: 20,
            skip: 0,
          };
          console.log('data', data);
          let res = await this.$api.curd(data);
          console.log(res);
          this.tableList = res;
        } catch (error) {}
        this.loadingText = ''
      }
    },
    async created() {
      console.log(this.tableHeader);
      await this.getData();
    }
  };
</script>

<style scoped>
  .goods-box {
    width: calc(100% - 40px);
    margin: 0 auto;
  }
</style>