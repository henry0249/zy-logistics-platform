<template>
  <loading-box class="g-container g-box" v-model="loadingText">
    <div v-if="!data" class="no-platform">
      <div v-if="!loadingText">
        <div>
          <icon size="30vw">meiyoushuju</icon>
        </div>
        <div style="margin-bottom:20px">
          没有找到商品数据
        </div>
        您可以
        <div v-ripple class="platform-init" @click="add">
          添加商品
        </div>或
        <div class="platform-back" @click="$router.push('/home')">
          返回主页
        </div>
      </div>
    </div>
    <div class="flex g-box" v-else>
      <div class="flex addBox">
        <el-button size="medium" type="primary" style="margin-right:30px;" @click="dialogShow = true">添 加</el-button>
      </div>
      <goods-table :tableHeader="tableHeader" :tableList="testArr" :boxStyle="boxStyle" :heightValue="height" @scrollMore="scrollMore">
        <div slot-scope="scope" @click="test(scope)">test</div>
      </goods-table>
    </div>
    <el-dialog title="添加商品" :visible.sync="dialogShow">
      <goods-add v-model="dialogShow"></goods-add>
    </el-dialog>
  </loading-box>
</template>

<script>
  import GoodsTable from '../common/Table.vue';
  import GoodsAdd from './Add.vue';
  export default {
    components: {
      GoodsTable,
      GoodsAdd
    },
    data() {
      return {
        n: 20,
        dialogShow: false,
        loadingText: "",
        data: "",
        boxStyle: {
          width: 'calc(100% - 20px)',
          height: 'calc(100vh - 100px)'
        },
        height: 'calc(100vh - 100px)',
        tableHeader: [{
          key: 'name',
          keyValue: '分类名',
        }, {
          key: 'desc',
          keyValue: '描述',
        }, {
          key: 'remark',
          keyValue: '备注',
        }, {
          key: 'creater',
          keyValue: '创建人',
        }]
      };
    },
    computed: {
      testArr() {
        let obj = {
          name: '分类名',
          desc: '描述',
          remark: '备注',
          creater: '创建人'
        }
        let test = []
        for (let index = 0; index < this.n; index++) {
          console.log(1111);
          let arr = {}
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              arr[key] = obj[key] + index
              console.log(arr);
            }
          }
          test.push(arr)
        }
        return test
      }
    },
    methods: {
      scrollMore(val) {
        console.log(val);
      },
      add() {
        this.dialogShow = true
      },
      test(row) {
        console.log(row);
      },
      async getGoods() {
        this.loadingText = "加载中";
        try {
          this.data = await this.$api.curd({
            model: "category",
            curdType: "find",
          });
        } catch (error) {}
        this.loadingText = "";
      }
    },
    async created() {
      console.log('this.testArr', this.testArr);
      this.getGoods()
    }
  };
</script>

<style scoped>
  .g-box {
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
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
    /* font-size: 10px; */
    cursor: pointer;
    color: #2196f3;
  }
  .addBox {
    width: calc(100% - 20px);
    height: 50px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    justify-content: flex-end;
    align-items: center;
    flex-direction: row;
  }
</style>