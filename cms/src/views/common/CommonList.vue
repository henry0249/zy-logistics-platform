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
      <div class="addBox">
        <el-button size="medium" type="primary" style="margin-right:30px;" @click="dialogShow = true">添 加</el-button>
      </div>
      <goods-table :tableHeader="tableHeader" :tableList="data" :boxStyle="boxStyle" :heightValue="height" @scrollMore="scrollMore">
        <div slot-scope="scope">
          <!-- <el-button size="mini">查看</el-button> -->
          <span class="pointer list-color">查看</span>
          <slot name="operation" :row="scope.scope"></slot>
        </div>
      </goods-table>
    </div>
    <el-dialog :title="`添加${title}`" :visible.sync="dialogShow">
      <slot name="addModel"></slot>
    </el-dialog>
    <el-dialog :title="`查看${title}`" :visible.sync="seeShow">
      <slot name="seeModel"></slot>
    </el-dialog>
  </loading-box>
</template>

<script>
  import GoodsTable from "../common/Table.vue";
  export default {
    components: {
      GoodsTable
    },
    props: {
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
        default: 'calc(100vh - 102px)'
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
        default: ''
      }
    },
    data() {
      return {
        n: 20,
        dialogShow: false,
        seeShow: false,
        loadingText: "",
        data: ""
      };
    },
    methods: {
      scrollMore(val) {
        this.loadingText = "加载中";
        console.log(val);
        setTimeout(() => {
          this.n = (val + 1) * 20;
          this.loadingText = "";
        }, 1500);
      },
      add() {
        this.dialogShow = true;
      },
      test(row) {
        console.log(row);
      },
      async getGoods() {
        this.loadingText = "加载中";
        try {
          this.data = await this.$api.curd({
            model: this.str,
            curdType: "find"
          });
          console.log(this.data);
          console.log(this.tableHeader);
        } catch (error) {}
        this.loadingText = "";
      }
    },
    async created() {
      console.log("this.testArr", this.str);
      this.getGoods();
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
  }
  .list-color {
    color: #2196f3;
    margin-right: 10px;
  }
</style>