<template>
  <div>
    <loading-box v-model="laodingText">
      <my-table style="padding:0 1%" size="mini" height="100vh - 50px" index border :loadmore="loadmore" :thead="thead" :data.sync="data">
        <div class="flex ac" slot="header" style="padding:1% 0">
          <div class="f1"></div>
          <el-button icon="el-icon-plus" style="margin-left:20px" size="mini" type="primary" @click="$router.push('/platform/transfer')">添加中转点</el-button>
        </div>
      </my-table>
    </loading-box>
  </div>
</template>

<script>
export default {
  data() {
    return {
      laodingText: "",
      thead: {
        key: "编码",
        name: "名称",
        area: {
          name: "地址",
          slot: true
        }
      },
      data: [],
      limit: 10
    };
  },
  methods: {
    async getAreaTable() {
      this.laodingText = "加载中...";
      this.data = [];
      try {
        let findOption = {
          limit: this.limit || 10,
          skip: this.data.length
        };
        this.data = await this.$ajax.post("/area/find", findOption);
      } catch (error) {}
      this.laodingText = "";
    },
    async loadmore() {
      let res = [];
      try {
        let findOption = {
          limit: this.limit || 10,
          skip: this.data.length
        };
        res = await this.$ajax.post("/area/find", findOption);
      } catch (error) {}
      return res;
    }
  },
  created() {
    this.getAreaTable();
  }
};
</script>

<style scoped>
</style>