<template>
  <div>
    <loading-box v-model="laodingText">
      <my-table style="padding:0 1%" size="mini" height="100vh - 50px" index border :loadmore="loadmore" :thead="thead" :data.sync="data">
        <div class="flex ac" slot="header" style="padding:1% 0">
          <my-form-item @change="areaTypeChange" style="width:20%" label="类型" v-model="areaType" select size="mini" :options="field.Area.type.option" placeholder="区域类型" />
          <my-form-item label="筛选" v-model="areaSelect" area size="mini" change-on-select style="width:35%;margin-left:20px" placeholder="区域数据" @change="areaChange"/>
          <div class="f1"></div>
          <el-button icon="el-icon-plus" style="margin-left:20px" size="mini" type="primary" @click="$router.push('/platform/areaAdd')">添加区域</el-button>
        </div>
        <template slot-scope="scope">
          <span v-if="scope.prop==='type'">{{field.Area.type.option[scope.row[scope.prop]]}}</span>
        </template>
      </my-table>
    </loading-box>
  </div>
</template>

<script>
export default {
  data() {
    return {
      laodingText: "",
      areaType: "province",
      areaSelect: [],
      thead: {
        type: {
          name: "类型",
          slot: true
        },
        key: "编码",
        name: "名称"
      },
      data: [],
      limit: 10,
      areaFilter: {}
    };
  },
  methods: {
    async areaChange(val) {
      let last = await this.$ajax("/area/findOne?_id=" + val[val.length - 1]);
      this.areaFilter = {};
      for (const key in last) {
        for (const areaType in this.field.Area.type.option) {
          if (last.hasOwnProperty(areaType)) {
            this.areaFilter[areaType] = last[areaType];
          }
        }
      }
      if (this.areaType === last.type) {
        this.areaFilter = {};
        this.areaFilter._id = last._id;
      } else {
        this.areaFilter[last.type] = last._id;
      }
      this.getAreaTable();
    },
    areaTypeChange(val) {
      this.areaFilter = {};
      this.areaType = val;
      this.getAreaTable();
    },
    async getAreaTable() {
      this.laodingText = "加载中...";
      this.data = [];
      try {
        let findOption = {
          type: this.areaType,
          limit: this.limit || 10,
          skip: this.data.length,
          ...this.areaFilter
        };
        this.data = await this.$ajax.post("/area/find", findOption);
      } catch (error) {}
      this.laodingText = "";
    },
    async loadmore() {
      let res = [];
      try {
        let findOption = {
          type: this.areaType,
          limit: this.limit || 10,
          skip: this.data.length,
          ...this.areaFilter
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