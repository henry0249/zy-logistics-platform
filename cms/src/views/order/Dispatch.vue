<template>
  <loading-box v-model="loadingText">
    <div style="padding:0 3%">
      <my-table border size="mini" height="100vh - 50px" index :loadmore="loadmore" :thead="thead" :data.sync="data">
        <div class="flex ac jb" slot="header" style="padding:15px 0">
          <div style="width:20%">
            <my-form-item label="订单号" size="mini" ></my-form-item>
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
          <span @click="$router.push('/edit/dispatch/'+scope.row._id)" class="link" v-if="scope.prop==='_id'">
            {{scope.row.createdAt | date2no}}
          </span>
          <span v-if="scope.prop==='customer'">
            <el-tag v-if="scope.row.user" size="mini" style="margin-right:5px" type="warning">个人</el-tag>
            <el-tag v-if="scope.row.company" size="mini" style="margin-right:5px" type="success">公司</el-tag>
            {{customerName(scope.row)}}
          </span>
          <span v-if="scope.prop==='goodsName'">
            {{scope.row.goods[0].value.name}}
          </span>
          <span v-if="scope.prop==='goodsCount'">
            {{scope.row.goods[0].count}}
          </span>
          <span v-if="scope.prop==='area'">
            {{scope.row.area.name}}
          </span>
        </template>
      </my-table>
      
    </div>
  </loading-box>
</template>

<script>
import { taking } from "./field";
export default {
  data() {
    return {
      loadingText: "",
      thead: taking,
      limit: 10,
      data: []
    };
  },
  methods: {
    async getData() {
      this.loadingText = "加载中";
      try {
        this.data = await this.$ajax(
          "/order/pending/dispatch?limit=" + this.limit
        );
      } catch (error) {}
      this.loadingText = "";
    },
    customerName(row) {
      let res = "-";
      if (row.user) {
        res = row.user.name || row.user.mobile;
      }
      if (row.company) {
        res = row.company.name || row.company.mobile || row.company.tel;
      }
      return res;
    },
    async loadmore() {
      return await this.$ajax.post("/order/pending/dispatch", {
        limit: this.limit,
        skip: this.data.length
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