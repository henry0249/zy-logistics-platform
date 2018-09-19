<template>
  <loading-box v-model="loadingText" class="flex ac js">
    <div style="width:60px;font-size:12px;" v-if="label">{{label}}</div>
    <div class="flex js ac f1 span-bor">
      <p style="background:#f0f2f5;border-radius: 4px;padding: 0 5px" v-if="newsValue.length>0">
        {{newsValue[0].name}}
        <i class="el-icon-error pointer add-icon" @click="del"></i>
      </p>
      <p style="background:#f0f2f5;border-radius: 4px;padding: 0 5px;margin-left:5px;" v-if="newsValue.length > 1">+ {{newsValue.length - 1}}</p>
    </div>
    <el-button style="margin-left:10px;" size="mini" class="button-new-tag" @click="edit">编辑</el-button>
    <el-dialog width="70%" :visible.sync="dialogVisible">
      <dialog-item :tagValue.sync="newsValue" :loadingText.sync="loadingText" :thead="thead" :dialogVisible.sync="dialogVisible" v-model="io"></dialog-item>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false" type="primary">确 定</el-button>
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
      value: {
        type: [Object, Array],
        default () {
          return []
        }
      },
      label: {
        type: String,
        default: ''
      },
      str: {
        type: String,
        default: ''
      },
      loadingText: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        // loadingText: '',
        dialogVisible: false,
        newsValue: [],
        io:false,
      }
    },
    watch: {
      async label(val) {
        await this.changeNewsValue();
      },
      newsValue(val, oldVal) {
        if (this.value instanceof Array) {
          this.$emit('input', val)
        } else {
          this.$emit('input', {
            _id: val._id,
            name: val.name,
          })
        }
      },
      value(val) {
        if (this.value instanceof Array) {
          this.io = true;
        } else {
          this.io = false;
        }
      }
    },
    methods: {
      del() {
        console.log('11111');
        this.newsValue.splice(0, 1);
        if (this.value instanceof Array) {
          this.value.splice(0, 1)
        } else {
          this.value = {}
        }
      },
      edit() {
        this.dialogVisible = true
      }
    },
    async created() {
      if (this.value instanceof Array) {
        this.io = true;
        this.newsValue = []
        this.value.forEach(item => {
          this.newsValue.push({
            _id: item._id,
            name: item.name,
          })
        });
      } else {
        this.io = false;
        this.newsValue.push({
          _id: this.value._id,
          name: this.value.name,
        })
      }
      console.log('!!!!!',this.io);
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