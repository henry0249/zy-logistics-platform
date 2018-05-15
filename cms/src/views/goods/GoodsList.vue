<template>
  <loading-box class="g-container g-box" v-model="loadingText">
    <div v-if="!platform" class="no-platform">
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
      <goods-table :tableHeader="tableHeader" :tableList="platform" :boxStyle="boxStyle">
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
        dialogShow: false,
        loadingText: "",
        platform: "",
        boxStyle: {
          width: 'calc(100% - 20px)',
          height: 'calc(100% - 50px)'
        },
        tableHeader: [{
          key: 'brand',
          keyValue: '品牌',
          // width: '100'
        }, {
          key: 'category',
          keyValue: '分类',
          // width: '100'
        }, {
          key: 'name',
          keyValue: '名称',
          // width: '200'
        }, {
          key: 'unit',
          keyValue: '单位',
          // width: '100'
        }, {
          key: 'tag',
          keyValue: '标签',
          // width: '200'
        }]
      };
    },
    methods: {
      add() {
        this.dialogShow = true
      },
      test(row) {
        console.log(row);
      },
      async getGoods() {
        this.loadingText = "加载中";
        try {
          this.platform = await this.$api.curd({
            model: "goods",
            curdType: "find",
          });
          console.log(this.platform);
        } catch (error) {}
        this.loadingText = "";
      }
    },
    async created() {
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