<template>
  <div class="body-height body-padding" v-getHeight>
    <common-table v-if="tableHeight>0" style="padding:0" :height="tableHeight+'px'" :path="'/order/pending/'+state" :thead="thead" :option="option" showCompany :state="state">
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
          {{scope.row.goods && scope.row.goods.name}}
        </div>
        <div v-if="scope.prop==='goodsCount'">
          {{scope.row.count}}{{scope.row.goods && scope.row.goods.unit}}
        </div>
        <div v-if="scope.prop==='area'">
          {{area2name(scope.row.area)}}
        </div>
      </div>
    </common-table>
  </div>
</template>

<script>
import { table } from "./field";
export default {
  props: {
    state: {
      type: String,
      default: "all"
    },
    autoHref: {
      type: Boolean,
      default: false
    },
    path: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      tableHeight: 0,
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
  directives: {
    getHeight: {
      inserted(el, binding, vnode) {
        vnode.context.tableHeight = el.clientHeight;
      }
    }
  },
  methods: {
    toDetail(item, index) {
      if (item._id) {
        if (this.path) {
          this.$router.push(`/${this.path}/${item._id}`);
        } else {
          this.$router.push(
            `${this.$route.path}/edit/${item._id}?parentPath=${
              this.$route.path
            }&parentName=${this.$route.name}`
          );
        }
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