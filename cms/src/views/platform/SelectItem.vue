<template>
  <loading-box v-model="loadingText" class="flex ac js">
    <div style="width:60px;font-size:12px;" v-if="label" ref="div">{{label}}</div>
    <div class="flex js ac f1 span-bor">
      <p v-if="newsValue.length > 0" style="background:#f0f2f5;border-radius: 4px;padding: 0 5px">
        {{newsValue[0].name}}
        <i class="el-icon-error pointer add-icon" @click="del"></i>
      </p>
      <p style="background:#f0f2f5;border-radius: 4px;padding: 0 5px;margin-left:5px;" v-if="newsValue.length > 1">+ {{newsValue.length - 1}}</p>
    </div>
    <el-button style="margin-left:10px;" size="mini" class="button-new-tag" @click="edmit">编辑</el-button>
    <el-dialog @close="close" width="70%" :visible.sync="dialogVisible">
      <dialog-item v-if="dialogVisible" :io="io" :label="label" :newsValue="newsValue" :startValue.sync="startValue" :thead="thead" :dialogVisible.sync="dialogVisible" :admin="value"></dialog-item>
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
        type: [Object, Array],
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
        startValue: [],
        newsValue: [],
        dialogVisible: false,
        io:false,
      }
    },
    watch: {
      dialogVisible(val) {
        console.log(val);
      },
      newsValue(val) {
        this.$emit('input', val);
      },
      startValue(val) {
        console.log('111', val);
        // this.newsValue = val
      }
    },
    methods: {
      close() {},
      res() {
        this.dialogVisible = false;
        this.newsValue = this.startValue;
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
      if (this.label === '') {
        console.log(this.value instanceof Array);
      }
      if (this.value instanceof Array) {
        this.io = true;
        this.newsValue = [];
        this.value.forEach(item => {
          this.newsValue.push({
            _id: item._id,
            name: item.name,
          })
        });
      } else {
        this.io = false;
        this.newsValue = [];
        this.newsValue.push(this.value)
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