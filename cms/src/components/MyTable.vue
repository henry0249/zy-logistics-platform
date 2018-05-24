<template>
  <div>
    <div ref="header">
      <slot name="header">
      </slot>
    </div>
    <loading-box v-model="loadingText">
      <el-table v-if="tableHeight" @cell-click="cellClick" @row-click="rowClick" size="mini" class-name="mylist" style="width: 100%;font-size:13px" :data="data" :height="tableHeight" @selection-change="handleSelectionChange">
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
            <i style="color:#909399" @click="handleOp('read',scope)" class="el-icon-view pointer"></i>
            <i style="color:#409EFF;margin:0 10px" @click="handleOp('edit',scope)" class="el-icon-edit pointer"></i>
            <i style="color:#F56C6C" @click="handleOp('delete',scope)" class="el-icon-delete pointer"></i>
          </div>
        </el-table-column>
        <div v-ripple @click="loadmoreFun" v-if="data.length>0 && loadmoreText!=='nomore'" class="loadmore" slot="append">
          {{loadmoreText}}
        </div>
        <div v-if="data.length>0&&loadmoreText==='nomore'" class="loadmore nomore" slot="append">
          没有更多数据了
        </div>
      </el-table>
    </loading-box>
    <div ref="footer">
      <slot name="footer">
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: "100vh - 50px"
    },
    selection: {
      type: Boolean,
      default: false
    },
    select: {
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
    },
    loadmore: {
      type: Function
    }
  },
  data() {
    return {
      tableHeight: "",
      loadingText: "加载中",
      loadmoreText: "加载更多"
    };
  },
  watch: {
    height() {
      this.setTableHeight();
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit("update:select", val);
    },
    handleOp(type, value) {
      this.$emit("op", {
        type,
        value
      });
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
    },
    setTableHeight() {
      let headerHeight = this.$refs.header ? this.$refs.header.clientHeight : 0;
      let footerHeight = this.$refs.footer ? this.$refs.footer.clientHeight : 0;
      this.tableHeight = `calc(${
        this.height
      } - ${headerHeight}px - ${footerHeight}px)`;
    },
    async loadmoreFun() {
      this.loadingText = "加载中";
      try {
        let res = await this.loadmore();
        console.log(res);
        if (res instanceof Array) {
          if (res.length === 0) {
            this.loadmoreText = "nomore";
          } else {
            this.$emit("update:data", [...this.data, ...res]);
            this.loadmoreText = "加载更多";
          }
        } else {
          this.loadmoreText = "nomore";
        }
      } catch (error) {
        console.log(error);
      }
      this.loadingText = "";
    }
  },
  updated() {
    this.setTableHeight();
  },
  mounted() {
    this.setTableHeight();
    setTimeout(() => {
      this.loadingText = "";
    }, 300);
  }
};
</script>

<style scoped>
.loadmore {
  text-align: center;
  line-height: 37px;
  cursor: pointer;
  color: #409eff;
}
.nomore {
  color: #aaa;
  cursor: default;
}
</style>