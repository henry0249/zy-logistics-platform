<template>
  <loading-box class="g-container" v-model="loadingText">
    <div v-if="!data || data.length==0" class="no-platform">
      <div v-if="!loadingText">
        <div>
          <icon size="30vw">meiyoushuju</icon>
        </div>
        <div style="margin-bottom:20px">
          没有找到{{title}}数据
        </div>
        您可以
        <div v-ripple class="platform-init" @click="add">
          添加{{title}}
        </div>或
        <div class="platform-back" @click="$router.push('/home')">
          返回主页
        </div>
      </div>
    </div>
    <div v-else style="margin-left:10px">
      <div class="flex addBox">
        <el-input placeholder="请输入名称、分类等关键字" v-model="input" style="width:300px">
          <div slot="append" class="pointer" @click="search">搜索</div>
        </el-input>
        <el-button size="medium" type="primary" style="margin-right:30px;" @click="dialogShow = true">添 加</el-button>
      </div>
      <goods-table :tableHeader="tableHeader" :tableList="data" :boxStyle="boxStyle" :heightValue="height" @scrollMore="scrollMore">
        <div slot-scope="scope">
          <!-- <el-button size="mini">查看</el-button> -->
          <span class="pointer list-color" @click="see(scope)">查看</span>
          <slot name="operation" :row="scope.scope"></slot>
        </div>
      </goods-table>
    </div>
    <el-dialog :title="`添加${title}`" :visible.sync="dialogShow">
      <add-model :key-arr="keyArr" :str="str"></add-model>
    </el-dialog>
    <el-dialog :title="`查看${title}`" :visible.sync="seeShow">
      <see-model :key-arr="keyArr" :key-data="keyData" :str="str" :populate="populate" :myid="id"></see-model>
    </el-dialog>
  </loading-box>
</template>

<script>
  import GoodsTable from "../common/Table.vue";
  import SeeModel from "../common/SeeModel.vue";
  import AddModel from "../common/AddModel.vue";
  export default {
    components: {
      GoodsTable,
      SeeModel,
      AddModel
    },
    props: {
      or: {
        type: Array,
        default () {
          return [];
        }
      },
      populate: {
        type: [Array, Object],
        default () {
          return [];
        }
      },
      boxStyle: {
        type: Object,
        default () {
          return {
            width: "calc(100% - 20px)",
            height: "calc(100vh - 102px)"
          };
        }
      },
      height: {
        type: [Object, String],
        default: "calc(100vh - 102px)"
      },
      tableHeader: {
        type: Array,
        default () {
          return [];
        }
      },
      title: {
        type: String,
        default: ""
      },
      str: {
        type: String,
        default: ""
      },
      keyArr: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    data() {
      return {
        id: '',
        input: "",
        skip: "0",
        limit: 20,
        n: 20,
        dialogShow: false,
        seeShow: false,
        loadingText: "",
        data: "",
        keyData: {}
      };
    },
    watch: {
      $route(val) {
        console.log("roter", val);
        if (val.path == "/goods/category/1" || val.path == "/goods/category/2") {
          let data = {
            skip: 0,
            limit: 20
          };
          this.getGoods(data);
        }
      }
    },
    methods: {
      see(row) {
        console.log(this.keyArr);
        this.id = row.scope._id
        let scope = JSON.parse(JSON.stringify(row.scope));
        for (const key in scope) {
          if (scope.hasOwnProperty(key)) {
            let op = [{
                value: 0,
                label: "未发布"
              },
              {
                value: 1,
                label: "已发布"
              },
              {
                value: 2,
                label: "已下架"
              },
              {
                value: 3,
                label: "缺货中"
              }
            ];
            if (key == "tag") {
              let str = "";
              console.log("object", scope[key]);
              if (scope[key].length > 0) {
                scope[key].forEach(item => {
                  console.log("item", item);
                  str += item + "、";
                });
                scope[key] = str.substr(0, str.length - 1);
              } else {
                scope[key] = str;
              }
            }
            if (key == "saleState") {
              op.forEach(item => {
                if (scope[key] == item.key) {
                  scope[key] = item.value;
                }
              });
            }
          }
        }
        this.keyData = scope;
        console.log("this.keyData", this.keyData);
        this.seeShow = true;
      },
      scrollMore(val) {
        this.loadingText = "加载中";
        console.log(val);
        setTimeout(() => {
          this.n = (val + 1) * 20;
          this.loadingText = "";
        }, 1500);
      },
      myAlert(comment, title, router) {
        this.$alert(comment, title, {
          confirmButtonText: "确定",
          callback: action => {
            // this.$router.push({
            //   path: router
            // })
          }
        });
      },
      async search() {
        if (this.input) {
          this.loadingText = "加载中";
          let data = {
            skip: 0,
            $or: []
          };
          console.log("this.or", this.or);
          for (let index = 0; index < this.or.length; index++) {
            let keyStr = this.or[index].key;
            if (this.or[index].type == "id") {
              console.log(keyStr);
              try {
                let id = await this.$api.curd({
                  model: keyStr,
                  curdType: "find",
                  $or: [{
                    name: this.input
                  }]
                });
                console.log("id", id);
                if (id.length > 0) {
                  let obj = {
                    keyStr: {
                      $in: []
                    }
                  };
                  id.forEach(idItem => {
                    obj.key.$in.push(idItem._id);
                  });
                  data.$or.push(obj);
                }
              } catch (error) {}
            }
          }
          this.loadingText = "";
          console.log(data);
        } else {
          console.log(22222222222);
        }
      },
      async add() {
        if (this.title == "二级分类") {
          try {
            this.loadingText = "加载中";
            let res = await this.$api.curd({
              model: "category",
              curdType: "find",
              parent: {
                $exists: false
              }
            });
            if (res.length > 0) {
              this.dialogShow = true;
            } else {
              this.myAlert("请先添加一级分类", "提示");
            }
          } catch (error) {}
          this.loadingText = "";
        } else {
          this.dialogShow = true;
        }
      },
      test(row) {
        console.log(row);
      },
      async getGoods(data) {
        this.loadingText = "加载中";
        console.log("this.str", this.str);
        console.log(data);
        data.model = this.str;
        data.curdType = "find";
        data.limit = this.limit;
        if (this.populate.length > 0 || this.populate.path) {
          data.populate = this.populate;
        }
        if (this.title == "二级分类") {
          data.parent = {
            $exists: true
          };
        }
        if (this.title == "一级分类") {
          data.parent = {
            $exists: false
          };
        }
        try {
          this.data = await this.$api.curd(data);
          console.log("this.data", this.data);
        } catch (error) {
          console.log(error);
        }
        this.loadingText = "";
      }
    },
    async mounted() {
      let data = {
        skip: 0,
        limit: 20
      };
      this.getGoods(data);
      console.log("this.keyArr", this.keyArr);
    }
  };
</script>

<style scoped>
  .g-box {}
  .no-platform {
    margin: 0 auto;
    text-align: center;
  }
  .platform-init {
    margin-top: 20px;
    margin: 0 10px;
    display: inline-block;
    padding: 10px 15px;
    text-align: center;
    border-radius: 3px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
    color: #fff;
    background: #ef5350;
    cursor: pointer;
  }
  .platform-back {
    color: #aaa;
    margin-top: 15px;
    cursor: pointer;
    color: #2196f3;
  }
  .addBox {
    width: calc(100% - 20px);
    line-height: 50px;
    height: 50px;
    text-align: right;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .list-color {
    color: #2196f3;
    margin-right: 10px;
  }
</style>