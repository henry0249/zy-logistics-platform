<template>
<loading-box v-model="loadingText">
  <div class="body-height body-padding" v-getHeight>
    <my-table 
      v-if="tableHeight>0" 
      :height="tableHeight+'px'" 
      index 
      border 
      size="mini"
      :thead="thead"
      :data.sync="data"
      :loadmore="loadmore"
    >
      <div slot="header">
        <el-tabs v-model="tabIndex">
          <el-tab-pane :name="index.toString()" v-for="(item,index) in tab" :key="item._id + item.listType">
            <div slot="label" style="position:relative">
              {{item.name || item.nick}}
              <el-badge :value="item.badge" v-if="item.badge!==undefined && item.badge>0">
              </el-badge>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="flex jb" style="padding:12px 0">
          <my-form class="flex ac">
            <my-form-item size="mini" v-model="no" label="订单号"></my-form-item>
          </my-form>
          <div class="f1">
          </div>
          <el-button style="margin-left:15px" type="primary" icon="el-icon-search" size="mini" @click="getData">搜索</el-button>
        </div>
      </div>
      <div slot-scope="scope">
        <div class="link" v-if="scope.prop==='no'" @click="toDetail(scope.row,scope.index)">
          {{scope.row.no}}
        </div>
        <div v-if="scope.prop==='customer'">
          <el-tag v-if="scope.row.user" size="mini" style="margin-right:5px" type="warning">个人</el-tag>
          <el-tag v-if="scope.row.company" size="mini" style="margin-right:5px" type="success">公司</el-tag>
          {{scope.row | customerName}}
        </div>
        <div v-if="scope.prop==='goodsName'">
          {{scope.row.goods && scope.row.goods.name}}
        </div>
        <div v-if="scope.prop==='goodsCount'">
          {{scope.row.count}}{{scope.row.goods && scope.row.goods.unit}}
        </div>
        <div v-if="scope.prop==='area'">
          {{area2name(scope.row.area)}}
        </div>
      </div>
    </my-table>
  </div>
</loading-box>

</template>

<script>
import { table } from "./field";
export default {
  props: {
    state: {
      type: String,
      default: ""
    },
    linkPath: {
      type: String,
      default: ""
    },
    handle: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loadingText: "",
      tab: [],
      tabIndex: "0",
      tabItem: {},
      activeCompany: "",
      tableHeight: 0,
      thead: table,
      data: [],
      limit: 10,
      no: ""
    };
  },
  watch: {
    tabIndex(val) {
      this.tabItem = this.tab[Number(val)];
    },
    tabItem: {
      handler: function(val) {
        this.activeCompany = this.tabItem._id;
        this.getData();
      },
      deep: true
    },
    company: {
      handler: function(val) {
        this.activeCompany = val._id;
      },
      deep: true
    }
  },
  computed: {
    searchOption() {
      let res = {};
      res.no = this.no;
      if (!this.no) {
        delete res.no;
      }
      return res;
    }
  },
  directives: {
    getHeight: {
      inserted(el, binding, vnode) {
        vnode.context.tableHeight = el.clientHeight;
      }
    }
  },
  methods: {
    async getTab() {
      this.loadingText = "加载中";
      try {
        this.tab = [];
        this.tab = await this.$ajax.post("/logistics/handleTab", {
          company: this.activeCompany
        });
        this.tabItem = this.tab[0];
      } catch (error) {}
      this.loadingText = "";
    },
    async getData() {
      this.loadingText = "加载中";
      try {
        this.data = [];
        this.data = await this.$ajax.post(`/logistics/handleList`, {
          limit: this.limit,
          listType: this.tabItem.listType,
          company: this.tabItem._id,
          ...this.searchOption
        });
      } catch (error) {}
      this.loadingText = "";
    },
    async loadmore() {
      return await this.$ajax.post(`/logistics/handleList`, {
        limit: this.limit,
        skip: this.data.length,
        listType: this.tabItem.listType,
        company: this.tabItem._id,
        ...this.searchOption
      });
    },
    toDetail(item, index) {
      if (item._id) {
        if (this.path) {
          this.$router.push(`/${this.path}/${item._id}`);
        } else {
          this.$router.push(`${this.$route.path}/edit/${item._id}`);
        }
      }
    }
  },
  async mounted() {
    this.activeCompany = this.handle || this.company._id;
    await this.getTab();
  }
};
</script>

<style scoped>
.link {
  color: #409eff;
  cursor: pointer;
}
.link:hover {
  text-decoration: underline;
}
</style>