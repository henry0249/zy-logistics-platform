<template>
  <loading-box v-model="loadingText" class="flex ac js">
    <div style="width:60px;font-size:12px;" v-if="label" ref="div">{{label}}</div>
    <div class="flex js ac f1 span-bor" ref="div" :style="newsValue.length > 0 ?{justifyContent: 'space-between'}:{justifyContent:'start-end'}">
      <div class="flex f1">
        <p v-if="newsValue.length > 0" style="background:#f0f2f5;border-radius: 4px;padding: 0 5px">
          {{newsValue[0].name?newsValue[0].name:newsValue[0].mobile}}
          <i class="el-icon-error pointer add-icon" @click="del" ref="i"></i>
        </p>
        <p ref="length" style="background:#f0f2f5;border-radius: 4px;padding: 0 5px;margin-left:5px;" v-if="newsValue.length > 1">+ {{newsValue.length - 1}}</p>
      </div>
      <i style="margin-left:10px;color:#409EFF" size="mini" class="button-new-tag el-icon-edit pointer" @click="edmit"></i>
    </div>
    <el-dialog @close="close" :top="top" width="70%" :visible.sync="dialogVisible">
      <dialog-item v-if="dialogVisible" :op="op" :io="io" :label="label" :newsValue="newsValue" :startValue.sync="startValue" :thead="thead" :dialogVisible.sync="dialogVisible" :admin="value"></dialog-item>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="res" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </loading-box>
</template>

<script>
  import DialogItem from './DialogItem.vue';
  export default {
    components: {
      DialogItem
    },
    props: {
      op: {
        type: Object,
        default () {
          return {}
        }
      },
      loadingText: {
        type: String,
        default: ''
      },
      thead: {
        type: Object,
        default () {
          return {
            name: {
              name: "姓名"
            },
            mobile: {
              name: "手机号"
            }
          }
        }
      },
      label: {
        type: String,
        default: ''
      },
      value: {
        type: [String, Object, Array],
        default () {
          return {}
        }
      },
      data: {
        type: [Object, Array],
        default () {
          return {}
        }
      },
    },
    data() {
      return {
        top: (window.innerHeight - 680) / 2 + 'px',
        startValue: [],
        newsValue: [],
        dialogVisible: false,
        io: false,
      }
    },
    watch: {
      dialogVisible(val) {
        console.log(val);
      },
      newsValue(val) {
        if (this.value instanceof Array) {
          this.$emit('input', val);
        } else if (this.value instanceof Object) {
          this.$emit('input', val[0]);
        } else {
          if (val[0]) {
            this.$emit('input', val[0]._id);
          }
        }
      }
    },
    methods: {
      close() {},
      res() {
        this.dialogVisible = false;
        this.newsValue = JSON.parse(JSON.stringify(this.startValue));
      },
      del() {
        console.log('del');
        this.newsValue.splice(0, 1);
      },
      edmit() {
        this.dialogVisible = true
      },
    },
    async created() {
      if (this.value instanceof Array) {
        this.io = true;
        if (this.value.length > 0) {
          this.newsValue = [];
          this.value.forEach(item => {
            this.newsValue.push({
              _id: item._id,
              name: item.name,
              mobile: item.mobile,
            })
          });
        } else {
          this.newsValue = [];
        }
      } else if (this.value instanceof Object) {
        this.io = false;
        if (Object.keys(this.value).length > 0) {
          this.newsValue = [];
          this.newsValue.push(this.value)
        } else {
          this.newsValue = [];
        }
      } else {
        this.io = false;
        if (this.value) {
          let res = await this.$api.curd({
            model: 'user',
            curdType: 'findOne',
            _id: this.value
          })
          this.newsValue.push({
            _id: res._id,
            mobile: item.mobile,
            name: res.name,
          })
        } else {
          this.newsValue = [];
        }
      }
      if (this.label === '主管理员') {
        console.log('!!!!', this.newsValue);
      }
    }
  }
</script>

<style scoped>
  .span-bor {
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    height: 28px;
    padding: 0 10px;
    border-radius: 4px;
    color: #909399;
    font-size: 12px;
  }
  .add-icon {
    color: #c0c4cc;
    margin-left: 5px;
  }
  .add-icon:hover {
    color: #909399;
  }
</style>