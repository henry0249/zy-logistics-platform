<template>
  <common-table :path="'/order/pending/'+state" :thead="thead" :option="option">
    <my-form width="24%" class="flex ac" slot="header">
      <my-form-item size="mini" v-model="no" label="单号"></my-form-item>
    </my-form>
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
        {{scope.row.goods[0].value.name}}
      </div>
      <div v-if="scope.prop==='goodsCount'">
        {{scope.row.goods[0].count}}{{scope.row.goods[0].value.unit}}
      </div>
      <div v-if="scope.prop==='area'">
        {{area2name(scope.row.area)}}
      </div>
    </div>
  </common-table>
</template>

<script>
import { table } from "./field";
export default {
  props: {
    state: {
      type: String,
      default: "all"
    }
  },
  data() {
    return {
      thead: table,
      no: ""
    };
  },
  computed: {
    option() {
      let res = {};
      res.no = {
        $regex: this.no
      };
      if (!this.no) {
        delete res.no;
      }
      return res;
    }
  },
  methods: {
    handelCurrentChange(val) {
      console.log(val);
    },
    handelSelectionChange(val) {
      console.log(val);
    },
    toDetail(item, index) {
      if (item._id) {
        let state = this.state || "detail";
        this.$router.push(`/edit/${state}/${item._id}`);
      }
    }
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