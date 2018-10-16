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
        <el-tabs type="card" v-model="logisticsListState">
          <el-tab-pane name="check">
            <div slot="label">
              已审核物流单
            </div>
          </el-tab-pane>
          <el-tab-pane name="dispatcherManagerCheck">
            <div slot="label">
              调度经理审核
            </div>
          </el-tab-pane>
          <el-tab-pane name="logisticsClerkCheck">
            <div slot="label">
              物流文员审核
            </div>
          </el-tab-pane>
          <el-tab-pane name="dispatcherManagerCheckFail">
            <div slot="label">
              未通过调度经理审核的物流单
            </div>
          </el-tab-pane>
          <el-tab-pane name="logisticsClerkCheckFail">
            <div slot="label">
              未通过物流文员审核的物流单
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-tabs v-model="activeCompany">
          <el-tab-pane :name="item._id" v-for="(item) in companyList" :key="item._id">
            <div slot="label">
              {{item.name || item.nick}}
              <el-badge :value="item.badge" v-if="item.badge!==undefined && item.badge>0">
              </el-badge>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="flex jb" style="padding:12px 0">
          <my-form class="flex ac">
            <my-form-item size="mini" v-model="no" label="物流单号"></my-form-item>
          </my-form>
          <div class="f1">
          </div>
          <el-button style="margin-left:15px" type="primary" icon="el-icon-search" size="mini" @click="getData">搜索</el-button>
        </div>
      </div>
      <div slot-scope="scope">
        <div @click="toDetail(scope.row)" class="link" v-if="scope.prop==='no'">
          {{scope.row.no}}
        </div>
        <div v-if="scope.prop==='transportation'">
          <my-select truck :type.sync="scope.row.transportation" :data.sync="scope.row[scope.row.transportation]" placeholder="运输工具" disabled></my-select>
        </div>
        <div v-if="scope.prop==='loading'">
          {{scope.row.loading}}
        </div>
        <div v-if="scope.prop==='landed'">
          {{scope.row.landed}}
        </div>
        <div v-if="scope.prop==='state'">
          {{field.Logistics.state.option[scope.row.state]}}
        </div>
      </div>
    </my-table>
  </div>
</loading-box>

</template>

<script>
import { logisticsTable } from "./field";
export default {
  props: {
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
      logisticsListState: "check",
      companyList: [],
      activeCompany: "",
      tableHeight: 0,
      thead: logisticsTable,
      data: [],
      limit: 10,
      no: ""
    };
  },
  watch: {
    activeCompany(val, old) {
      if (old) {
        this.getData();
      }
    },
    company: {
      handler: function(val) {
        this.activeCompany = val._id;
      },
      deep: true
    },
    logisticsListState(val) {
      this.getData();
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
    async getCompanyList() {
      this.loadingText = "加载中";
      try {
        this.companyList = [];
        this.companyList = await this.$ajax.post("/order/company/badge", {
          state: this.state,
          handle: this.activeCompany
        });
      } catch (error) {}
      this.loadingText = "";
    },
    setFindBody() {
      let body = {
        limit: this.limit,
        handle: this.activeCompany,
        ...this.searchOption
      };
      let logisticsListState = this.logisticsListState;
      if (logisticsListState === "check") {
        body.dispatcherManagerCheck = true;
        body.logisticsClerkCheck = true;
      }
      if (logisticsListState === "dispatcherManagerCheck") {
        body.dispatcherManagerCheck = false;
        body.logisticsClerkCheck = false;
      }
      if (logisticsListState === "logisticsClerkCheck") {
        body.dispatcherManagerCheck = true;
        body.logisticsClerkCheck = false;
      }
      if (logisticsListState === "dispatcherManagerCheckFail") {
        body.dispatcherManagerCheck = false;
        body.logisticsClerkCheck = false;
        body.checkFail = "dispatcherManager";
      }
      if (logisticsListState === "logisticsClerkCheckFail") {
        body.dispatcherManagerCheck = true;
        body.logisticsClerkCheck = false;
        body.checkFail = "logisticsClerk";
      }
      return body;
    },
    async getData() {
      this.loadingText = "加载中";
      try {
        this.data = [];
        let body = this.setFindBody();
        this.data = await this.$ajax.post(`/logistics/find`, body);
      } catch (error) {}
      this.loadingText = "";
    },
    async loadmore() {
      let body = this.setFindBody();
      body.skip = this.data.length;
      return await this.$ajax.post(`/logistics/find`, body);
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
    await this.getCompanyList();
    await this.getData();
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