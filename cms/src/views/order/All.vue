<template>
  <common-table :thead="thead" :option="option">
    <div class="flex ac" slot="header">
      <my-form-item size="mini" v-model="no" label="单号"></my-form-item>
    </div>
    <div slot-scope="scope">
      <div class="link" v-if="scope.prop==='no'">
        {{scope.row.no}}
      </div>
      <div v-if="scope.prop==='customer'">
        客户名称自定义
      </div>
    </div>
  </common-table>
</template>

<script>
  import {
    taking
  } from "./field";
  import CommonTable from "../common/CommonTable";
  export default {
    components: {
      CommonTable
    },
    data() {
      return {
        thead: taking,
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