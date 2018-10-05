<template>
  <loading-box v-model="loadingText">
    <div style="padding:0 3%">
      <div style="height:40px">
        <el-tabs v-model="activeCompany">
          <el-tab-pane :label="item.name || item.nick" :name="item._id" v-for="(item) in companylist" :key="item._id">
            <div slot="label" style="position:relative">
              {{item.name || item.nick}}
              <el-badge :value="item.badge" v-if="item.badge!==undefined && item.badge>0">
              </el-badge>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <my-table border size="mini" height="100vh - 50px - 40px" index :loadmore="loadmore" :thead="thead" :data.sync="data">
        <my-form width="20%" class="flex ac jb" slot="header" style="padding:15px 0">
          <my-form-item label="运单号" size="mini"></my-form-item>
          <my-form-item label="客户类型" size="mini"></my-form-item>
          <my-form-item label="收货区域" size="mini"></my-form-item>
          <div style="width:15%"></div>
          <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
        </my-form>
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
  data() {
    return {
      loadingText: "",
      thead: logisticsTable,
      limit: 10,
      data: [],
      companylist: [],
      activeCompany: ""
    };
  },
  watch: {
    activeCompany() {
      this.getData();
    }
  },
  methods: {
    async getData() {
      this.loadingText = "加载中";
      try {
        this.data = [];
        this.data = await this.$ajax.post("/logistics/find", {
          limit: this.limit,
          handle: this.activeCompany,
          populate: [
            {
              path: "truck"
            },
            {
              path: "ship"
            }
          ]
        });
      } catch (error) {}
      this.loadingText = "";
    },
    async loadmore() {
      return await this.$ajax.post("/logistics/find", {
        limit: this.limit,
        skip: this.data.length,
        handle: this.activeCompany,
        populate: [
          {
            path: "truck"
          },
          {
            path: "ship"
          }
        ]
      });
    },
    toDetail(item) {
      if (item._id) {
        if (this.path) {
          this.$router.push(`/${this.path}/${item._id}`);
        } else {
          console.log(`${this.$route.path}/edit/${item._id}`);
          this.$router.push(`${this.$route.path}/edit/${item._id}?parentPath=${this.$route.path}&parentName=${this.$route.name}`);
        }
      }
    }
  },
  async mounted() {
    this.activeCompany = this.company._id;
    this.loadingText = "加载中";
    try {
      this.companylist = await this.$ajax.post("/logistics/company/badge", {
        handle: this.activeCompany
      });
    } catch (error) {}
    this.loadingText = "";
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