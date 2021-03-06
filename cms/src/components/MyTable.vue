<template>
  <div>
    <div ref="header">
      <slot name="header">
      </slot>
    </div>
    <loading-box v-model="loadingText">
      <el-table ref="table" @cell-click="cellClick" @row-click="rowClick" v-bind="$attrs" :data="data" :height="tableHeight" @selection-change="handleSelectionChange" @current-change="handleCurrentChange">
        <el-table-column v-if="selection" type="selection" width="30">
        </el-table-column>
        <el-table-column class="point" v-if="index" show-overflow-tooltip type="index" width="30">
        </el-table-column>
        <template  v-for="(item, key) in thead">
          <el-table-column v-if="item.slot" show-overflow-tooltip :prop="key" :label="is('json',item)?item.name:item" :width="''+(item.width||'')" :key="key">
            <template slot-scope="scope">
              <slot :prop="key" :row="scope.row" :column="scope.column" :index="scope.$index">{{deepKey(scope.row,scope.column.property)}}</slot>
            </template>
          </el-table-column>
          <el-table-column v-else show-overflow-tooltip :prop="key" :label="is('json',item)?item.name:item" :width="''+(item.width||'')" :key="key">
          
          </el-table-column>
        </template>

        <el-table-column label="操作" v-if="op" :width="''+opWidth">
          <div slot-scope="scope" style="width:100%">
            <slot name="op" :row="scope.row" :column="scope.column" :index="scope.$index">
              <i style="color:#909399" @click="handleOp('read',scope)" class="el-icon-view pointer"></i>
              <i style="color:#409EFF;margin:0 10px" @click="handleOp('edit',scope)" class="el-icon-edit pointer"></i>
              <i style="color:#F56C6C" @click="handleOp('delete',scope)" class="el-icon-delete pointer"></i>
            </slot>
          </div>
        </el-table-column>
        <div slot="append">
          <div v-ripple @click="loadmoreFun" v-if="loadmore&&data.length>0 && loadmoreText!=='nomore'" class="loadmore">
            <i class="el-icon-refresh el-icon--right"></i>{{loadmoreText}}
            <span v-if="Number(count)>0"> - 共 <span class="blue fw500">{{count}}</span> 条数据，已加载 <span class="success fw500">{{data.length}}</span> 条数据</span>
          </div>
          <div v-if="loadmore&&data.length>0&&loadmoreText==='nomore'" class="loadmore nomore">
            <i class="el-icon-warning el-icon--right"></i>没有更多数据了，已加载全部 <span class="info fw500">{{data.length}}</span> 条数据
          </div>
        </div>
      </el-table>
    </loading-box>
    <div ref="footer">
      <slot name="footer">
      </slot>
    </div>
    <input ref="fixedInput" v-model="fixedInputVal" @blur="fixedInputBlur" @keyup.enter="fixedInputBlur" v-if="showFixedInput" class="fixed-input" :style="fixedInputStyle"/>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: ""
    },
    selection: {
      type: Boolean,
      default: false
    },
    select: {
      type: [Array, Object],
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
    edit: {
      type: [Boolean, Object],
      default: undefined
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
    },
    loadmore: {
      type: Function
    },
    opWidth: {
      type: [String, Number],
      default: "90"
    },
    count: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      tableHeight: undefined,
      loadingText: "加载中",
      loadmoreText: "加载更多",
      fixedInputStyle: {},
      showFixedInput: false,
      fixedInputVal: "",
      currentRowIndex: -1,
      currentRowKey: "",
      currentRow: {},
      showColumnSlot: true
    };
  },
  watch: {
    height() {
      this.setTableHeight();
    },
    showFixedInput(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.fixedInput.focus();
        });
      }
    },
    data() {
      this.loadmoreText = "加载更多";
    }
  },
  methods: {
    fixedInputBlur() {
      this.showFixedInput = false;
      if (this.currentRowKey.indexOf(".") > -1) {
        let keyArr = this.currentRowKey.split(".");
        this.currentRow[keyArr[0]][keyArr[1]] = this.fixedInputVal;
      } else {
        this.currentRow[this.currentRowKey] = this.fixedInputVal;
      }
      // this.data.splice(this.currentRowIndex, 1, this.currentRow);
      // this.$emit("update:data", this.data);
    },
    handleSelectionChange(val) {
      this.$emit("selection-change", val);
      // this.$emit("update:select", val);
    },
    handleOp(type, value) {
      this.$emit("op", {
        type,
        value
      });
    },
    cellClick(row, column, cell, event) {
      this.$emit("cellClick", {
        row,
        column,
        cell,
        event
      });
      if (!this.edit) {
        return;
      }
      if (!column.property) {
        return;
      }
      if (this.is("json", this.thead)) {
        if (!this.thead[column.property]) {
          return;
        }
        if (this.thead[column.property].readOnly) {
          return;
        }
      }
      if (this.is("array", this.thead)) {
        let edit = true;
        this.thead.forEach(item => {
          if (item.key === column.property && item.readOnly) {
            edit = false;
          }
        });
        if (!edit) {
          return;
        }
      }
      this.showFixedInput = true;
      let { width, height, top, left } = cell.getBoundingClientRect();
      this.fixedInputStyle = {
        width: width + "px",
        height: height + "px",
        top: top + "px",
        left: left + "px"
      };
      this.fixedInputVal = this.deepKey(row, column.property);
      this.currentRowIndex = this.data.indexOf(row);
      this.currentRowKey = column.property;
      this.currentRow = row;
      this.$emit("cellEdit", {
        key: column.property,
        index: this.data.indexOf(row),
        row: row
      });
    },
    rowClick(row, event, column) {
      this.$emit("rowClick", {
        row,
        column,
        event
      });
    },
    setTableHeight() {
      if (this.height) {
        let headerHeight = this.$refs.header
          ? this.$refs.header.clientHeight
          : 0;
        let footerHeight = this.$refs.footer
          ? this.$refs.footer.clientHeight
          : 0;
        this.tableHeight = `calc(${
          this.height
        } - ${headerHeight}px - ${footerHeight}px)`;
      } else {
        this.tableHeight = undefined;
      }
    },
    async loadmoreFun() {
      this.loadingText = "加载中";
      try {
        let res = await this.loadmore();
        if (res instanceof Array) {
          if (res.length === 0) {
            this.loadmoreText = "nomore";
          } else {
            res.forEach(item => {
              this.data.push(item);
            });
            this.loadmoreText = "加载更多";
          }
        } else {
          this.loadmoreText = "nomore";
        }
      } catch (error) {}
      this.loadingText = "";
    },
    handleCurrentChange(val) {
      this.$emit("current-change", val);
    },
    toggleRowSelection(data) {
      if (this.$refs.table) {
        this.$refs.table.clearSelection();
      }
      data.forEach(item => {
        this.data.forEach(row => {
          if (item._id === row._id) {
            this.$refs.table.toggleRowSelection(row);
          }
        });
      });
    }
  },
  mounted() {
    setTimeout(() => {
      this.loadingText = "";
      this.setTableHeight();
      if (this.is("array", this.select)) {
        this.toggleRowSelection(this.select);
      }
    }, 300);
  }
};
</script>

<style scoped>
.loadmore {
  text-align: center;
  line-height: 36px;
  cursor: pointer;
  color: #409eff;
}
.nomore {
  color: #aaa;
  cursor: default;
}
.fixed-input {
  position: fixed;
  box-sizing: border-box;
  border: none;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  padding: 0px 10px;
  /* border: 1px dashed #eee; */
  /* border-bottom: 1px dashed #409eff; */
  border-radius: 2px;
  color: #606266;
}
</style>