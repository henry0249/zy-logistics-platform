<template>
  <div :style="{color:'#606266',width:$attrs.width || '100%',}">
    <div class="jc jb" style="width:100%;color:#606266;margin-bottom:5px;">
      <div class="f1 jc js" :style="{fontSize:fontSize}">
        <div v-if="$attrs.label" :title="$attrs.label" class="tf1" :style="{fontSize:fontSize,width:labelWidth}">{{$attrs.label}}</div>
        <div v-if="show" style="margin-left:5px;flex:0 0 150px">/共选 <span class="success">{{this.startNewData.length}}</span>{{getKey().obj.unit}}{{getKey().obj.name}}</div>
      </div>
      <div class="jc pointer" @click="dialogTableVisible = true">
        <div :style="{fontSize:fontSize,marginRight:'5px',color:'#67C23A'}">添加{{getKey().obj.name}}</div>
        <i class="el-icon-plus" :style="{color:'#67C23A',fontSize:fontSize}"></i>
      </div>
    </div>
    <div class="f1 jc js" :style="{'min-height':'23px',border:'1px solid #DCDFE6','border-radius': '5px','box-sizing':'border-box'}">
      <div class="f1" ref="body" :style="{fontSize:fontSize,padding:'5px 5px 5px 10px',maxHeight:'60px',overflow:'auto'}">
        <common-multi-selection-tag v-if="startNewData.length > 0 && show" :fontSize="fontSize" :startData="startNewData" :data.sync="newData"></common-multi-selection-tag>
        <div v-else style="height:18px;line-height:18px;">未选择</div>
      </div>
    </div>
    <el-dialog :title="`添加${getKey().obj.name}`" width="70%" top="15vh" :visible.sync="dialogTableVisible">
      <common-multi-selection-table :option="op" :type="typeChange" v-if="dialogTableVisible" :selectIo.sync="selectIo" :keyData="getKey()" :data.sync="tableData"></common-multi-selection-table>
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
      option: {
        type: Object,
        default () {
          return {}
        }
      },
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
        op: {},
        selectIo: false,
        show: true,
        dialogTableVisible: false,
        iconHeight: "",
        path: "",
        newData: [],
        startNewData: [],
        key: CommonMultiSelection,
        tableData: []
      };
    },
    watch: {
      newData: {
        handler(val, oldVal) {
          this.$emit("update:data", val);
          this.startNewData = JSON.parse(JSON.stringify(this.newData));
        },
        deep: true
      }
    },
    computed: {
      typeChange(){
        return this.getKey().key;
      },
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
        if (this.selectIo) {
          let data = JSON.parse(JSON.stringify(this.startNewData));
          this.tableData.forEach(item => {
            data.push(item);
          });
          for (let index = 0; index < data.length; index++) {
            for (let i = index + 1; i < data.length; i++) {
              if (data[index]._id === data[i]._id) {
                data.splice(i, 1);
              }
            }
          }
          this.startNewData = JSON.parse(JSON.stringify(data));
          this.show = false;
          this.$nextTick(() => {
            this.show = true;
          });
        }
        this.selectIo = false;
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
      if (Object.keys(this.option).length > 0) {
        this.op = this.option;
      }else if (Object.keys(this.getKey().obj.option).length > 0) {
        this.op = this.getKey().obj.option;
      }
      console.log(this.op);
    }
  };
</script>

<style scoped>
</style>