<template>
  <loading-box v-model="loadingText">
    <div style="padding:0 3%">
      <my-table border size="mini" height="100vh - 50px" index :loadmore="loadmore" :thead="thead" :data.sync="data">
        <div class="flex ac jb" slot="header" style="padding:15px 0">
          <div style="width:20%">
            <my-form-item label="运单号" size="mini" ></my-form-item>
          </div>
          <div style="width:20%">
            <my-form-item label="客户类型" size="mini" ></my-form-item>
          </div>
          <div style="width:20%">
            <my-form-item label="收货区域" size="mini" ></my-form-item>
          </div>
          <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
          <div style="width:25%"></div>
        </div>
        <template slot-scope="scope">
          <span @click="$router.push('/edit/distribution/'+scope.row._id)" class="link" v-if="scope.prop==='no'">
            {{scope.row.no}}
          </span>
          <div v-if="scope.prop==='transportation'">
            <my-select truck :type.sync="scope.row.transportation" :data.sync="scope.row[scope.row.transportation]" placeholder="运输工具" disabled></my-select>
          </div>
          <div v-if="scope.prop==='loading'">
            {{scope.row.loading}}
          </div>
          <div v-if="scope.prop==='landed'">
            {{scope.row.landed}}
          </div>
          <div v-if="scope.prop==='state'" >
            {{field.Logistics.state.option[scope.row.state]}}
          </div>
        </template>
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
      data: []
    };
  },
  methods: {
    async getData() {
      this.loadingText = "加载中";
      try {
        this.data = await this.$ajax.post("/logistics/find", {
          limit: this.limit,
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
        populate: [
          {
            path: "truck"
          },
          {
            path: "ship"
          }
        ]
      });
    }
  },
  mounted() {
    this.getData();
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