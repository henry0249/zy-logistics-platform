<template>
  <div :style="{color:'#606266',width:$attrs.width || '100%',}">
    <div class="jc jb" style="width:100%;padding:5px 0;color:#303133">
      <div class="f1 jc js" :style="{fontSize:fontSize}">
        <div v-if="$attrs.label" :title="$attrs.label" class="tf1" :style="{fontSize:fontSize,width:labelWidth}">{{$attrs.label}}</div>
        <div style="margin-left:5px;flex:0 0 150px">{{totalText}}</div>
      </div>
      <div class="jc pointer" @click="dialogTableVisible = true">
        <div :style="{fontSize:fontSize,marginRight:'5px',color:'#67C23A'}">添加{{getKey().obj.name}}</div>
        <i class="el-icon-plus" :style="{color:'#67C23A',fontSize:fontSize}"></i>
      </div>
    </div>
    <div class="f1 jc js" :style="{'min-height':'23px',border:'1px solid #DCDFE6','border-radius': '5px','box-sizing':'border-box'}">
      <div class="f1" ref="body" :style="{fontSize:fontSize,padding:'5px 5px 5px 10px',maxHeight:'60px',overflow:'auto'}">
        <common-multi-selection-tag v-if="startNewData.length > 0 && show" :fontSize="fontSize" :startDat="startNewData" :data.sync="newData"></common-multi-selection-tag>
        <div v-else>未选择</div>
      </div>
    </div>
    <el-dialog :title="`添加${getKey().obj.name}`" width="70%" top="15vh" :visible.sync="dialogTableVisible">
      <common-multi-selection-table v-if="dialogTableVisible" :keyData="getKey()" :data.sync="tableData"></common-multi-selection-table>
      <div slot="footer" class="jb">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="go">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import CommonMultiSelection from "./CommonMultiSelection.js";
  export default {
    props: {
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      labelSize: {
        type: String,
        default: ""
      },
      size: {
        type: String,
        default: ""
      },
      labelWidth: {
        type: String,
        default: ""
      },
      border: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        show: true,
        dialogTableVisible: false,
        iconHeight: "",
        path: "",
        newData: [],
        startNewData:[],
        key: CommonMultiSelection,
        tableData: []
      };
    },
    watch: {
      newData: {
        handler(val) {
          this.$emit("update:data", val);
        },
        deep: true
      }
    },
    computed: {
      totalText() {
        return `(共选${this.startNewData.length +
            this.getKey().obj.unit +
            this.getKey().obj.name})`;
      },
      fontSize() {
        let option = {
          large: "15px",
          medium: "14px",
          small: "13px",
          mini: "12px"
        };
        if (this.labelSize) {
          return this.labelSize;
        } else {
          return option[this.size || this.$parent.size] || "15px";
        }
      }
    },
    methods: {
      go() {
        this.dialogTableVisible = false;
        let data = JSON.parse(JSON.stringify(this.startNewData));
        let mySet = new Set();
        this.tableData.forEach(item => {
          data.push(item);
        });
        data.forEach(item => {
          mySet.add(item);
        });
        this.startNewData = [];
        [...mySet].forEach(item => {
          this.startNewData.push(item);
        });
        this.show = false;
        this.$nextTick(() => {
          this.show = true;
        });
      },
      getKey() {
        let path = "";
        for (const key in this.$attrs) {
          if (this.$attrs.hasOwnProperty(key)) {
            for (const k in this.key) {
              if (key === k) {
                path = key;
              }
            }
          }
        }
        return {
          key: path,
          obj: this.key[path]
        };
      }
    },
    mounted() {
      this.$nextTick(() => {
        if (this.$refs.body.clientHeight < 23) {
          this.iconHeight = "23px";
        } else {
          this.iconHeight = this.$refs.body.clientHeight + "px";
        }
      });
    },
    created() {
      this.path = this.getKey().key;
      if (this.data.length > 0) {
        this.startNewData = JSON.parse(JSON.stringify(this.data));
      }
    }
  };
</script>

<style scoped>
  .t {
    border-radius: 5px;
    overflow: auto;
    flex-wrap: wrap;
  }
</style>