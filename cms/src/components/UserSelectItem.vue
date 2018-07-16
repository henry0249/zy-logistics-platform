<template>
  <div class="col-flex" style="width:100%;height:400px">
    <div class="js as">
      <span style="margin-right:10px;">已选择</span>
      <div class="f1" style="flex-wrap:wrap;max-height:120px;overflow: auto;" ref="div" v-if="tags.length > 0">
        <el-tag style="margin-right:10px;" @close="closeTag(tag)" size="mini" v-for="tag in tags" :key="tag.id" closable :type="tag.type">
          {{tagTxt(tag)}}
        </el-tag>
      </div>
      <span v-else style="color:#ccc;">未选择{{str}}</span>
    </div>
    <div class="f1" style="margin-top:20px;overflow: hidden;">
      <CommonTable style="padding:0" :height="tableHeight" :option="option" @selection-change="selectionChange" @current-change="currentChange" :selection="selection" :path="path" :thead="thead">
        <my-form-item size="mini" width='200px' :placeholder="placeholder" input v-model="input" slot="header"></my-form-item>
      </CommonTable>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      option: {
        type: Object,
        default () {
          return {}
        }
      },
      type: {
        type: String,
        default: ''
      },
      one: {
        type: Boolean,
        default: false
      },
      startData: {
        type: [Object, Array],
        default () {
          return {}
        }
      },
      data: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data() {
      return {
        selection: false,
        placeholder: '',
        tableHeight: '',
        divHeight: 0,
        tags: [],
        tableData: [],
        select: [],
        thead: {},
        path: '',
        input: '',
      }
    },
    watch: {
      input(val) {
        if (val) {
          if (this.type === 'user') {
            this.option['$or'] = [{
              name: {
                $regex: this.input
              }
            }, {
              mobile: {
                $regex: this.input
              }
            }, {
              email: {
                $regex: this.input
              }
            }]
          } else if (this.type === 'company') {
            this.option['$or'] = [{
              name: {
                $regex: this.input
              }
            }, {
              nick: {
                $regex: this.input
              }
            }]
          } else if (this.type === 'goods') {
            this.option['$or'] = [{
              name: {
                $regex: this.input
              }
            }]
          }
        }
      },
      divHeight(val) {
        console.log(val);
      },
      tableHeight(val) {
        console.log(val);
      },
      tags(val) {
        for (let index = 0; index < val.length; index++) {
          for (let i = index + 1; i < val.length; i++) {
            if (val[index]._id === val[i]._id) {
              val.splice(i, 1);
            }
          }
        };
        this.$emit('update:data', val);
      }
    },
    computed: {
      str() {
        if (this.type === 'user') {
          return '用户';
        } else if (this.type === 'company') {
          return '公司';
        } else if (this.type === 'goods') {
          return '商品';
        }
      }
    },
    methods: {
      selectionChange(val) {
        if (this.selection) {
          val.forEach(item => {
            this.tags.push(item);
          });
        }
      },
      currentChange(val) {
        if (!this.selection) {
          this.tags = [];
          this.tags.push(val);
        }
      },
      tagTxt(tag) {
        if (this.type === 'user') {
          return tag.name || tag.mobile || tag.email;
        } else if (this.type === 'company') {
          return tag.name || tag.nick;
        } else if (this.type === 'goods') {
          return tag.name;
        }
      },
      closeTag(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
      },
    },
    async created() {
      if (Object.prototype.toString.call(this.startData) === '[object Object]') {
        if (this.startData._id) {
          this.tags.push(this.startData);
        }
        this.selection = false;
      } else if (Object.prototype.toString.call(this.startData) === '[object Array]') {
        if (this.startData.length > 0) {
          this.startData.forEach(item => {
            this.tags.push(item);
          });
        }
        this.selection = true;
      }
      this.tableHeight = 740 - 120 - 320 + 'px';
      this.path = '/' + this.type + '/find';
      if (this.type === 'user') {
        this.thead = {
          name: {
            readOnly: true,
            name: '用户名'
          },
          mobile: {
            readOnly: true,
            name: '手机号'
          },
          email: {
            readOnly: true,
            name: '邮箱'
          }
        };
        this.placeholder = '请输入用户名、手机号、邮箱';
      } else if (this.type === 'company') {
        this.thead = {
          name: {
            readOnly: true,
            name: '公司名称'
          },
          nick: {
            readOnly: true,
            name: '公司别称'
          }
        };
        this.placeholder = '请输入公司名称或公司别称';
      } else if (this.type === 'goods') {
        this.thead = {
          name: {
            readOnly: true,
            name: '商品名'
          },
          'category.name': {
            readOnly: true,
            name: '分类'
          }
        };
        this.placeholder = '请输入商品名';
      }
    },
  }
</script>

<style scoped>
  .c {}
</style>