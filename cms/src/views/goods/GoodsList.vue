<template>
  <loading-box class="goods-box" v-model="loadingText">
    <my-table index size="mini" edit :thead="tableHeader" :data.sync="tableList">
      <template slot-scope="scope" v-if="scope.column.property === 'tag'||scope.column.property === 'name'">
                      <el-tag  v-if="scope.column.property === 'tag'" style="margin-right:10px;" size="mini" type="success" v-for="item in scope.row['tag']" :key="item.id">{{item}}</el-tag>
                      <i title="点击查看详情" class="pointer name-txt" v-if="scope.column.property === 'name'" @click="op({type:'read',value:scope})">{{scope.row['name']}}</i>
</template>
    </my-table>
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
          this.loadingText = '加载中'
          let data = {
            model: "goods",
            curdType: "find",
            populate: this.populate,
            limit: 20,
            skip: 0
          };
          let res = await this.$api.curd(data);
          console.log(res);
          this.tableList = res;
        } catch (error) {}
        this.loadingText = ''
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
  .name-txt {
    color: #42a5f5;
  }
  .name-txt:hover {
    text-decoration: underline;
  }
</style>