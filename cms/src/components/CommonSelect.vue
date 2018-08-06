<template>
  <div class="jc js g-form-item" :style="selectStyle">
    <div class="tf1" v-if="label" :style="{width:labelWidth || $parent.labelWidth,fontSize:fontSize}">
      {{label}}
    </div>
    <div :class="border?'border':''" :style="newSelectStyle" class="flex f1 jc jb select-box">
      <div class="f1 jc js flex" style="height:20px;">
        <div class="tf1 jc js io" :class="isBg" :style="{fontSize:fontSize}">
          {{selectTxt}}
          <i v-if="showDelIcon" class="el-icon-error pointer del" @click="del"></i>
        </div>
        <div :style="{background: '#E4E7ED',borderRadius: '5px',padding:'0 5px',marginLeft:'5px',fontSize:fontSize}" v-if="typeIo && data.length >1">+{{data.length - 1}}</div>
      </div>
      <i v-if="!disabled" class="el-icon-edit pointer" :style="{color:'#409eff',fontSize:fontSize}" @click="dialogVisible = true"></i>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="70%" >
      <span style="fontSize:16px;" slot="title">{{title}}</span>
      <common-select-item @switchChange="switchChange" :changeType.sync="startType" :placeholder="newPlaceholder" :isSwitch="isSwitch" :option="option" v-if="dialogVisible" :one="one" :type="type" :data.sync="itemData" :startData="data"></common-select-item>
      <div slot="footer" class="dialog-footer jb">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" :disabled="btmDisabled" @click="go">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import commonSelect from './CommonSelect.js';
  export default {
    props: {
      changeType: {
        type: String,
        default: ''
      },
      isSwitch: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: ''
      },
      labelSize: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
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
        startType:'',
        typeIo: false,
        one: false,
        newPlaceholder: '',
        dialogVisible: false,
        btmDisabled: true,
        itemData: [],
        commonSelect,
        showDelIcon: true
      }
    },
    watch: {
      startType(val){
        console.log(val);
        this.$emit('update:changeType',val);
      },
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
      isBg() {
        if (this.disabled) {
          this.showDelIcon = false;
          if (this.is('array', this.data)) {
            return 'bg'
          } else {
            return ''
          }
        } else {
          this.showDelIcon = true;
          if (this.data.length > 0 || this.data._id) {
            return 'bg'
          } else {
            this.showDelIcon = false;
            return ''
          }
        }
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
      },
      newSelectStyle() {
        if (this.disabled) {
          return {
            cursor: 'not-allowed'
          }
        } else {
          return {}
        }
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
            } else if (this.type === 'ship') {
              return this.data.no
            } else if (this.type === 'truck') {
              return this.data.no
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
            } else if (this.type === 'ship') {
              return this.data[0].no;
            } else if (this.type === 'truck') {
              return this.data[0].no;
            }
          }
        } else {
          return '未选择';
        }
      }
    },
    methods: {
      switchChange(val) {
        this.$emit('switchChange', val)
      },
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
        if (Object.prototype.toString.call(this.data) === '[object Object]') {
          this.$emit('update:data', {});
        } else {
          this.data.splice(0, 1);
        }
      },
    },
    created() {
      if (this.type === 'area') {
        this.newPlaceholder = this.placeholder || '输入地名';
        this.option.populate = [{
          path: 'province'
        }, {
          path: 'city'
        }, {
          path: 'county'
        }];
        this.option.type = 'township'
      } else
      if (this.type === 'goods') {
        this.newPlaceholder = this.placeholder || '输入商品名';
      } else if (this.type === 'user') {
        this.newPlaceholder = this.placeholder || '输入用户名、电话或邮箱';
      } else if (this.type === 'company') {
        this.newPlaceholder = this.placeholder || '输入公司名称或别称';
      } else if (this.type === 'truck') {
        this.newPlaceholder = this.placeholder || '输入车牌号';
      } else if (this.type === 'ship') {
        this.newPlaceholder = this.placeholder || '输入船号';
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
      this.startType = JSON.parse(JSON.stringify(this.type));
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
    padding: 0 10px;
    color: #606266;
  }
  .border {
    border: 1px solid #DCDFE6;
    border-radius: 5px;
  }
  .io {
    border-radius: 5px;
    padding: 0 5px 0 10px;
  }
  .bg {
    background: #E4E7ED;
    padding: 0 5px 0;
  }
  .del {
    color: #c0c4cc;
    margin-left: 5px;
  }
  .del:hover {
    color: #909399;
  }
</style>