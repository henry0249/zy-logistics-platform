<template>
  <div class="jc js g-form-item" :style="selectStyle">
    <div class="tf1" v-if="label" :style="{width:labelWidth || $parent.labelWidth,fontSize:fontSize}">
      {{label}}
    </div>
    <div :class="border?'border':''" :style="newSelectStyle" class="flex jc jb select-box">
      <div class="f1 flex">
        <div style="padding:0 5px 0 10px;" :class="typeIo?'io':''">
          {{selectTxt}}
          <i v-if="typeIo" class="el-icon-error pointer del" @click="del"></i>
        </div>
        <div style="background: #E4E7ED;border-radius: 5px;padding:0 5px;margin-left:5px;" v-if="typeIo && data.length >1">+{{data.length - 1}}</div>
        <div class="f1" style="height:100%;"></div>
      </div>
      <i class="el-icon-edit pointer" style="color:#409eff;fontSize:12px" @click="dialogVisible = true"></i>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="800px">
      <span style="fontSize:16px;" slot="title">{{title}}</span>
      <user-select-item :option="option" v-if="dialogVisible" :one="one" :type="type" :data.sync="itemData" :startData="data"></user-select-item>
      <div slot="footer" class="dialog-footer jb">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" :disabled="disabled" @click="go">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      labelWidth: {
        type: String,
        default: '60px'
      },
      label: {
        type: String,
        default: ''
      },
      option: {
        type: Object,
        default(){
          return {}
        }
      },
      title: {
        type: String,
        default: ''
      },
      width: {
        type: String,
        default: '100%'
      },
      type: {
        type: String,
        default: ''
      },
      data: {
        type: [Object, Array],
        default () {
          return {}
        }
      },
      border: {
        type: Boolean,
        default: false
      },
      io: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        typeIo: false,
        one: false,
        dialogVisible: false,
        disabled: true,
        itemData: [],
      }
    },
    watch: {
      itemData(val, old) {
        console.log(val, this.data);
        let io = true;
        if (val.length === this.data.length) {
          val.forEach((item, index) => {
            if (item._id === this.data[index]._id) {
              io = true;
            } else {
              io = false;
            }
          });
        } else {
          io = false;
        }
        if (io) {
          this.disabled = true;
        } else {
          this.disabled = false;
        }
      }
    },
    computed: {
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
      },
      newSelectStyle() {
        let style = {};
        if (this.typeIo) {
          style.padding = '0 10px';
        }
        return style
      },
      selectStyle() {
        let style = {};
        if (this.width) {
          style.width = this.width
        }
        return style
      },
      selectTxt() {
        if (this.data._id || this.data.length > 0) {
          if (Object.prototype.toString.call(this.data) === '[object Object]') {
            if (this.type === 'user') {
              return this.data.name || this.data.mobile || this.data.email;
            } else if (this.type === 'company') {
              return this.data.name || this.data.nick;
            } else if (this.type === 'goods') {
              return this.data.name;
            }
          } else if (Object.prototype.toString.call(this.data) === '[object Array]') {
            if (this.type === 'user') {
              return this.data[0].name || this.data[0].mobile || this.data[0].email;
            } else if (this.type === 'company') {
              return this.data[0].name || this.data[0].nick;
            } else if (this.type === 'goods') {
              return this.data[0].name;
            }
          }
        } else {
          return ''
        }
      }
    },
    methods: {
      go() {
        this.dialogVisible = false;
        console.log(this.itemData);
        this.$emit('update:data', this.itemData);
      },
      del() {
        this.data.splice(0, 1);
      },
    },
    created() {
      if (Object.prototype.toString.call(this.data) === '[object Array]') {
        this.typeIo = true;
        this.one = false;
      } else if (Object.prototype.toString.call(this.data) === '[object Object]') {
        this.one = true;
        this.typeIo = false;
      }
    }
  }
</script>

<style scoped>
  .g-form-item {
    color: #606266;
  }
  .select-box {
    box-sizing: border-box;
    height: 28px;
    width: 100%;
    padding: 0 10px 0 0;
    color: #606266;
    font-size: 12px;
  }
  .border {
    border: 1px solid #DCDFE6;
    border-radius: 5px;
  }
  .io {
    background: #E4E7ED;
    border-radius: 5px;
  }
  .del {
    color: #c0c4cc;
    margin-left: 5px;
  }
  .del:hover {
    color: #909399;
  }
</style>