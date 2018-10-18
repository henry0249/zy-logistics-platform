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
        <el-tabs type="card" v-model="logisticsListRole">
          <el-tab-pane :name="key" v-for="(val,key) in roleTabs" :key="key">
            <div slot="label">
              {{val}}
              <el-badge :value="orderBadge.logistics[key]" v-if="orderBadge.logistics !== undefined && orderBadge.logistics[key]!==undefined && orderBadge.logistics[key]>0">
              </el-badge>
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
      logisticsListRole: "dispatcherManager",
      roleTabs: {
        dispatcherManager: "调度经理审核",
        logisticsClerk: "物流文员审核",
        dispatcher: "已审核物流单",
        dispatcherManagerCheckFail: "未通过调度经理审核的物流单",
        logisticsClerkCheckFail: "未通过物流文员审核的物流单"
      },
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
    async logisticsListRole(val) {
      await this.$store.dispatch("getOrderBadge");
      await this.getData();
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
    setFindBody() {
      let body = {
        limit: this.limit,
        handle: this.activeCompany,
        ...this.searchOption,
        checkFail: ""
      };
      let logisticsListRole = this.logisticsListRole;
      if (logisticsListRole === "dispatcher") {
        body.dispatcherManagerCheck = true;
        body.logisticsClerkCheck = true;
        body.role = "dispatcher";
      }
      if (logisticsListRole === "dispatcherManager") {
        body.dispatcherManagerCheck = false;
        body.logisticsClerkCheck = false;
        body.role = "dispatcherManager";
      }
      if (logisticsListRole === "logisticsClerk") {
        body.dispatcherManagerCheck = true;
        body.logisticsClerkCheck = false;
        body.role = "logisticsClerk";
      }
      if (logisticsListRole === "dispatcherManagerCheckFail") {
        body.dispatcherManagerCheck = false;
        body.logisticsClerkCheck = false;
        body.checkFail = "dispatcherManager";
        body.role = "dispatcher";
      }
      if (logisticsListRole === "logisticsClerkCheckFail") {
        body.dispatcherManagerCheck = true;
        body.logisticsClerkCheck = false;
        body.checkFail = "logisticsClerk";
        body.role = "dispatcher";
      }
      return body;
    },
    async getData() {
      this.loadingText = "加载中";
      try {
        let body = this.setFindBody();
        this.data = [];
        this.companyList = [];
        this.companyList = await this.$ajax.post(
          "/logistics/company/badge",
          body
        );
        body.state = {
          $nin: [5]
        };
        this.data = await this.$ajax.post(`/logistics/find`, body);
      } catch (error) {}
      this.loadingText = "";
    },
    async loadmore() {
      let body = this.setFindBody();
      body.skip = this.data.length;
      body.state = {
        $nin: [5]
      };
      return await this.$ajax.post(`/logistics/find`, body);
    },
    toDetail(item, index) {
      if (item._id) {
        this.$router.push(
          `${this.$route.path}/edit/${item._id}?role=${this.logisticsListRole}`
        );
      }
    }
  },
  async mounted() {
    this.activeCompany = this.handle || this.company._id;
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