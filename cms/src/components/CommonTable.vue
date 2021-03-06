<template>
  <loading-box class="g-common-table" v-model="loadingText">
    <my-table :select="select" highlight-current-row :selection="selection" index border size="mini" :height="height" :loadmore="loadmore" :thead="thead" :data.sync="data" @selection-change="handleSelectionChange" @current-change="handleCurrentChange">
      <div slot="header">
        <div name="company" v-if="showCompany" style="height:40px">
          <el-tabs v-model="activeCompany">
            <el-tab-pane :name="item._id" v-for="(item) in companylist" :key="item._id">
              <div slot="label" style="position:relative">
                {{item.name || item.nick}}
                <el-badge :value="item.badge" v-if="item.badge!==undefined && item.badge>0">
                </el-badge>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div v-if="showSearch" class="flex jb" style="padding:12px 0">
          <div class="f1">
            <slot name="header"></slot>
          </div>
          <el-button style="margin-left:15px" type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
        </div>
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
    },
    select: {
      type: [Array, Object],
      default() {
        return [];
      }
    },
    state: {
      type: String,
      default: "taking"
    },
    showCompany: {
      type: Boolean,
      default: false
    },
    handle: {
      type: String,
      default: ""
    },
    searchSlot: {
      type: Boolean,
      default: true
    },
    currentCompany: {
      type: String,
      default: ""
    },
    preOption: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      loadingText: "",
      data: [],
      activeCompany: "",
      companylist: []
    };
  },
  watch: {
    activeCompany(val, old) {
      if (old) {
        this.getData();
      }
    }
  },
  computed: {
    showSearch() {
      if (this.$attrs.option === undefined || !this.searchSlot) {
        return false;
      }
      return true;
    }
  },
  methods: {
    refresh() {
      this.getData();
    },
    async getData() {
      let option = this.$attrs.option || {};
      this.loadingText = "加载中";
      try {
        this.data = [];
        let body = {
          limit: Number(this.limit),
          ...option,
          ...this.preOption
        };
        if (this.showCompany) {
          body.handle = this.activeCompany;
        }
        if (this.currentCompany) {
          body.company = this.currentCompany;
        }
        this.data = await this.$ajax.post(this.path, body);
      } catch (error) {}
      this.loadingText = "";
    },
    async loadmore() {
      let option = this.$attrs.option || {};
      let body = {
        limit: Number(this.limit),
        skip: this.data.length,
        ...option,
        ...this.preOption
      };
      if (this.showCompany) {
        body.handle = this.activeCompany;
      }
      if (this.currentCompany) {
        body.company = this.currentCompany;
      }

      return await this.$ajax.post(this.path, body);
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
  async mounted() {
    this.activeCompany = this.handle || this.company._id;
    if (this.showCompany) {
      this.loadingText = "加载中";
      try {
        this.companylist = await this.$ajax.post("/order/company/badge", {
          state: this.state,
          handle: this.activeCompany
        });
      } catch (error) {}
      this.loadingText = "";
    }
    await this.getData();
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