<template>
  <div class="g-business-trains">
    <el-tabs type="border-card" style="box-shadow:none">
      <el-tab-pane :label="item.value.name " v-for="item in order.goods" :key="item._id">
        <my-table opWidth="45" size="mini" index border edit op :thead="thead" :data.sync="data">
          <div class="tc" slot="op" slot-scope="scope">
            <i @click="add(scope)" v-if="scope.index === data.length-1" style="color:#67C23A" class="el-icon-plus pointer"></i>
            <i v-else style="color:#F56C6C" class="el-icon-delete pointer"></i>
          </div>
        </my-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {
    businessTrains
  } from "./field";
  export default {
    props: {
      order: {
        type: Object,
        default () {
          return {};
        }
      }
    },
    data() {
      return {
        thead: businessTrains,
        data: []
      };
    },
    methods: {
      add(scope) {
        let item = scope.row;
        this.data.push({
          purchasePrice: item.purchasePrice,
          purchaseCount: item.purchaseCount,
          sellPrice: item.purchasePrice,
          sellCount: item.purchaseCount
        });
      }
    },
    created() {
      this.order.goods.forEach(item => {
        this.data.push({
          purchasePrice: item.unitPrice,
          purchaseCount: item.count,
          lastCompany: item.value.mfrs.name
        });
      });
    }
  };
</script>

<style scoped>
  .g-business-trains {}
</style>