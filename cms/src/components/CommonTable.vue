<template>
  <loading-box class="g-common-table" v-model="loadingText">
    <my-table highlight-current-row :selection="selection" index border size="mini" :height="height" :loadmore="loadmore" :thead="thead" :data.sync="data" @selection-change="handleSelectionChange" @current-change="handleCurrentChange">
      <div slot="header">
        <div name="company" v-if="showCompany" style="height:40px">
          <el-tabs v-model="activeCompany">
            <el-tab-pane :label="item.name || item.nick" :name="item._id" v-for="(item) in companylist" :key="item._id"></el-tab-pane>
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
      if (this.$attrs.option === undefined) {
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
          ...option
        };
        if (this.showCompany) {
          body.handle = this.activeCompany;
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
        ...option
      };
      if (this.showCompany) {
        body.handle = this.activeCompany;
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
    },
    setTabBadge() {
      let tab = this.getElementByAttr("div", "role", "tab");
      tab.forEach(item => {
        let appedndFlag = false;
        let value = 0;
        this.companylist.forEach(companyItem => {
          if ("tab-" + companyItem._id === item.id && companyItem.badge > 0) {
            appedndFlag = true;
            value = companyItem.badge;
          }
        });
        if (appedndFlag) {
          appedndFlag = true;
          let div = document.createElement("div");
          div.innerHTML = value + "";
          let style = {
            position: "absolute",
            top: "0",
            right: "0",
            height: "20px",
            minWidth: "20px",
            lineHeight: "20px",
            fontSize: "10px",
            textAlign: "center",
            borderRadius: "20px",
            padding: "0px 5px",
            background: "#F56C6C",
            color: "#fff",
            transform: "scale(.9)",
            zIndex: 1
          };
          for (const key in style) {
            div.style[key] = style[key];
          }
          item.style.position = "relative";
          item.appendChild(div);
        }
      });
    }
  },
  async mounted() {
    this.activeCompany = this.handle || this.company._id;
    if (this.showCompany) {
      this.loadingText = "加载中";
      try {
        this.companylist = await this.$ajax.post("/order/company/badge", {
          state: this.state
        });
      } catch (error) {}
      this.loadingText = "";
    }
    await this.getData();
    this.$nextTick(() => {
      this.setTabBadge();
    });
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