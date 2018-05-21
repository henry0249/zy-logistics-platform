<template>
  <div>
    <el-table @cell-click="cellClick" @row-click="rowClick" size="mini" class-name="mylist" style="width: 100%;font-size:13px" :data="data" :height="height" @selection-change="handleSelectionChange">
      <el-table-column v-if="selection" type="selection" width="30">
      </el-table-column>
      <el-table-column v-if="index" show-overflow-tooltip type="index" width="30">
      </el-table-column>
      <el-table-column show-overflow-tooltip :prop="key" :label="item.name" :width="''+(item.width||'')" v-for="(item, key) in thead" :key="key">
        <template slot-scope="scope">
          <slot :row="scope.row" :column="scope.column" :index="scope.$index">
            {{scope.row[scope.column.property]}}
          </slot>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="op">
        <div slot-scope="scope">
          <i style="color:#909399" @click="handleRead(scope)" class="el-icon-view pointer"></i>
          <i style="color:#409EFF;margin:0 10px" @click="handleEdit(scope)" class="el-icon-edit pointer"></i>
          <i style="color:#F56C6C" @click="handleDelete(scope)" class="el-icon-delete pointer"></i>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: "calc(100vh - 50px)"
    },
    selection: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    index: {
      type: Boolean,
      default: false
    },
    op: {
      type: Boolean,
      default: false
    },
    thead: {
      type: [Object, Array],
      default() {
        return {};
      }
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit("input", val);
    },
    handleEdit(val) {
      this.$emit("edit", val);
    },
    handleRead(val) {
      this.$emit("read", val);
    },
    handleDelete(val) {
      this.$emit("delete", val);
    },
    cellClick(row, column, cell, event) {
      this.$emit("cellClick", {
        text: row[column.property],
        row,
        column,
        cell,
        event
      });
    },
    rowClick(row, event, column) {
      this.$emit("rowClick", {
        text: row[column.property],
        row,
        column,
        event
      });
    }
  }
};
</script>

<style scoped>

</style>