<template>
  <loading-box class="g-common-table" v-model="loadingText">
    <my-table highlight-current-row :selection="selection" index border size="mini" :height="height" :loadmore="loadmore" :thead="thead" :data.sync="data"  @selection-change="handleSelectionChange" @current-change="handleCurrentChange">
      <div class="flex jb" style="padding:12px 0" slot="header" v-if="showSearch">
        <div class="f1">
          <slot name="header"></slot>
        </div>
        <el-button style="margin-left:15px" type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
      </div>
      <template slot-scope="scope">
        <slot :row="scope.row" :prop="scope.prop" :index="scope.index"></slot>
      </template>
    </my-table>
  </loading-box>
</template>

<script>
export default {
  props: {
    path: {
      type: String,
      default: "/order/pending/all"
    },
    thead: {
      type: Object,
      default() {
        return {};
      }
    },
    limit: {
      type: [String, Number],
      default: "10"
    },
    height: {
      type: String,
      default: "100vh - 50px"
    },
    selection: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loadingText: "",
      data: []
    };
  },
  computed: {
    showSearch() {
      if (this.$attrs.option === undefined) {
        return false;
      }
      return true;
    }
  },
  methods: {
    async getData() {
      let option = this.$attrs.option || {};
      this.loadingText = "加载中";
      try {
        this.data = [];
        this.data = await this.$ajax.post(this.path, {
          limit: Number(this.limit),
          ...option
        });
      } catch (error) {}
      this.loadingText = "";
    },
    async loadmore() {
      let option = this.$attrs.option || {};
      return await this.$ajax.post(this.path, {
        limit: Number(this.limit),
        skip: this.data.length,
        ...option
      });
    },
    async search() {
      this.getData();
    },
    handleSelectionChange(val) {
      this.$emit("selection-change", val);
    },
    handleCurrentChange(val) {
      if (!this.selection) {
        this.$emit("current-change", val);
      }
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style scoped>
.g-common-table {
  padding: 0% 5%;
}
.link {
  color: #409eff;
  cursor: pointer;
}
.link:hover {
  text-decoration: underline;
}
</style>