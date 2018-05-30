<template>
  <div class="goods-box">
    <my-table index size="mini" edit :thead="tableHeader" :data.sync="tableList" op @op="op">
      <template slot-scope="scope" v-if="scope.column.property === 'tag'">
                    <el-tag style="margin-right:10px;" size="mini" type="success" v-for="item in scope.row['tag']" :key="item.id">{{item}}</el-tag>
</template>
    </my-table>
    <el-dialog :title="title" :visible.sync="show">
      <component :is="componentName" :key-arr="key" :key-data="keyData" :str="str"></component>
    </el-dialog>
  </div>
</template>

<script>
  import AddKey from "./AddKey.js";
  import CommonList from "../common/CommonList.vue";
  import SeeModel from "../common/SeeModel.vue";
  import EdmitModel from "../common/EdmitModel.vue";
  import Add from "./Add.vue";
  import {
    goodsThead,
    populate,
    or,
    addkey
  } from "./key.js";
  export default {
    components: {
      CommonList,
      SeeModel,
      Add,
      EdmitModel
    },
    data() {
      return {
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
      async test() {},
      op(val) {
        if (val.type === "read") {
          this.componentName = "SeeModel";
          this.title = "查看详情";
          this.show = true;
          this.keyData = val.value.row;
        } else if (val.type === "edit") {
          this.$router.push({
            path: '/goods/edmit/' + val.value.row._id,
            query: {
              str: 'goods'
            }
          })
        }
      },
      async getData() {
        let i = 0;
        try {
          let data = {
            model: "goods",
            curdType: "find",
            populate: this.populate
          };
          let res = await this.$api.curd(data);
          console.log(res);
          this.tableList = res;
        } catch (error) {}
      }
    },
    async created() {
      this.getData();
    }
  };
</script>

<style scoped>
  .goods-box {
    width: calc(100% - 40px);
    margin: 0 auto;
  }
</style>