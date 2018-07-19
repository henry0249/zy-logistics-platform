<template>
  <div class="jc js g-form-item" :style="selectStyle">
    <div class="tf1" v-if="label" :style="{width:labelWidth || $parent.labelWidth,fontSize:fontSize}">
      {{label}}
    </div>
    <div :class="border?'border':''" :style="newSelectStyle" class="flex f1 jc jb select-box">
      <div class="f1 flex" style="height:20px;">
        <div v-if="data._id||data.length > 0" class="tf1 io" style="padding:0 5px 0 10px;">
          {{selectTxt}}
          <i v-if="!disabled" class="el-icon-error pointer del" @click="del"></i>
        </div>
        <div style="background: #E4E7ED;border-radius: 5px;padding:0 5px;margin-left:5px;" v-if="typeIo && data.length >1">+{{data.length - 1}}</div>
      </div>
      <i v-if="!disabled" class="el-icon-edit pointer" style="color:#409eff;fontSize:12px" @click="dialogVisible = true"></i>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="800px">
      <span style="fontSize:16px;" slot="title">{{title}}</span>
      <common-select-item :option="option" v-if="dialogVisible" :one="one" :type="type" :data.sync="itemData" :startData="data"></common-select-item>
      <div slot="footer" class="dialog-footer jb">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" :disabled="btmDisabled" @click="go">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
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
        default () {
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
        btmDisabled: true,
        itemData: [],
      }
    },
    watch: {
      data(val) {},
      itemData(val, old) {
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
          this.btmDisabled = true;
        } else {
          this.btmDisabled = false;
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
        style.padding = '0 10px';
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
            } else if (this.type === 'area') {
              return this.data.name || this.data.key
            }
          } else if (Object.prototype.toString.call(this.data) === '[object Array]') {
            if (this.type === 'user') {
              return this.data[0].name || this.data[0].mobile || this.data[0].email;
            } else if (this.type === 'company') {
              return this.data[0].name || this.data[0].nick;
            } else if (this.type === 'goods') {
              return this.data[0].name;
            } else if (this.type === 'area') {
              return this.data[0].name || this.data[0].key;
            }
          }
        }
      }
    },
    methods: {
      go() {
        this.dialogVisible = false;
        if (Object.prototype.toString.call(this.data) === '[object Object]') {
          this.$emit('change', this.itemData[0]);
          this.$emit('update:data', this.itemData[0]);
          this.typeIo = false;
        } else if (Object.prototype.toString.call(this.data) === '[object Array]') {
          this.$emit('update:data', this.itemData);
          this.$emit('change', this.itemData);
          this.typeIo = true;
        }
      },
      del() {
        console.log(Object.prototype.toString.call(this.data) === '[object Object]');
        if (Object.prototype.toString.call(this.data) === '[object Object]') {
          this.$emit('update:data', {});
        } else {
          this.data.splice(0, 1);
        }
      },
    },
    created() {
      if (this.type === 'area') {
        this.option.populate = [{
          path: 'province'
        }, {
          path: 'city'
        }, {
          path: 'county'
        }];
        this.option.type = 'township'
      }
      if (this.type === 'goods') {
        // this.option.populate = [{
        //   path: 'category'
        // }]
      }
      if (Object.prototype.toString.call(this.data) === '[object Array]') {
        if (this.data.length > 0) {
          this.typeIo = true;
        }
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