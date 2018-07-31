<template>
  <div class="col-flex" style="width:100%;height:400px">
    <div class="js as" ref="div">
      <span style="margin-right:10px;">已选择</span>
      <div class="f1" style="flex-wrap:wrap;max-height:120px;overflow: auto;" ref="div" v-if="tags.length > 0">
        <el-tag style="margin-right:10px;" @close="closeTag(tag)" size="mini" v-for="tag in tags" :key="tag.id" closable>
          {{tagTxt(tag)}}
        </el-tag>
      </div>
      <span v-else style="color:#ccc;">未选择{{str}}</span>
    </div>
    <div class="f1" style="margin-top:20px;overflow: hidden;">
      <div class="flex jc js" v-if="isSwitch" ref="switchHeight">
        <p style="margin-right:10px;">选择类型</p>
        <el-radio-group v-model="radio" @change="switchChange" size="mini">
          <el-radio-button :label="type">{{activeText}}</el-radio-button>
          <el-radio-button :label="typeComputed">{{inactiveText}}</el-radio-button>
        </el-radio-group>
      </div>
      <common-table key="1" v-if="value" style="padding:0" :height="tableHeight" :option="option" @selection-change="selectionChange" @current-change="currentChange" :selection="selection" :path="path" :thead="thead">
        <common-select-area v-if="type === 'area'" slot="header" :areaData.sync="areaData"></common-select-area>
        <common-select-ship v-else-if="type === 'ship'|| type === 'truck'" slot="header" :type="type" :data.sync="shipData"></common-select-ship>
        <common-select-goods v-else-if="type === 'goods'" slot="header" :data.sync="goodsData"></common-select-goods>
        <my-form-item v-else size="mini" width='200px' :placeholder="placeholder" input v-model="input" slot="header"></my-form-item>
      </common-table>
      <common-table key="2" v-if="!value" style="padding:0" :height="tableHeight" :option="option" @selection-change="selectionChange" @current-change="currentChange" :selection="selection" :path="elsePath" :thead="elseThead">
        <common-select-ship v-if="type === 'ship'|| type === 'truck'" slot="header" :type="type" :data.sync="shipData"></common-select-ship> -->
        <my-form-item v-if="type === 'user'|| type === 'company'" size="mini" width='200px' :placeholder="elsePlaceholder" input v-model="input" slot="header"></my-form-item>
      </common-table>
    </div>
  </div>
</template>

<script>
  import commonSelect from './CommonSelect.js';
  export default {
    props: {
      isSwitch: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ''
      },
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
        radio: '',
        tableIO: true,
        value: true,
        selection: false,
        tableHeight: '',
        divHeight: 0,
        tags: [],
        tableData: [],
        select: [],
        thead: {},
        path: '',
        input: '',
        areaData: {},
        goodsData: {},
        shipData: {},
        commonSelect
      }
    },
    watch: {
      shipData(val) {
        if (Object.keys(val).length > 0) {
          console.log(val);
          for (const key in val) {
            this.option[key] = val[key];
          }
        } else {
          delete this.option.input;
          delete this.option.no;
          delete this.option.company;
        }
      },
      goodsData(val) {
        if (Object.keys(val).length > 0) {
          console.log(val);
          for (const key in val) {
            this.option[key] = val[key];
          }
          console.log(this.option);
        } else {
          delete this.option.input;
          delete this.option.brand;
          delete this.option.mfrs;
        }
      },
      areaData(val) {
        if (Object.keys(val).length > 0) {
          for (const key in val) {
            this.option[key] = val[key];
          }
        }
      },
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
          } else if (this.type === 'area') {
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
      elsePlaceholder() {
        if (this.type === 'user') {
          if (this.value) {
            return '输入用户名、手机号或邮箱';
          } else {
            return '输入公司名称或别称';
          }
        } else if (this.type === 'company') {
          if (this.value) {
            return '输入公司名称或别称';
          } else {
            return '输入用户名、手机号或邮箱';
          }
        } else if (this.type === 'truck') {
          if (this.value) {
            return '输入车牌号';
          } else {
            return '输入船号';
          }
        } else if (this.type === 'ship') {
          if (this.value) {
            return '输入船号';
          } else {
            return '输入车牌号';
          }
        }
      },
      elseThead() {
        if (this.type === 'user') {
          return this.commonSelect.company.thead;
        } else if (this.type === 'company') {
          return this.commonSelect.user.thead;
        } else if (this.type === 'truck') {
          return this.commonSelect.ship.thead;
        } else if (this.type === 'ship') {
          return this.commonSelect.truck.thead;
        }
      },
      typeComputed() {
        if (this.type === 'user') {
          return 'company';
        } else if (this.type === 'company') {
          return 'user';
        } else if (this.type === 'truck') {
          return 'ship';
        } else if (this.type === 'ship') {
          return 'truck';
        }
      },
      elsePath() {
        if (this.type === 'user') {
          return '/company/find';
        } else if (this.type === 'company') {
          return '/user/find';
        } else if (this.type === 'truck') {
          return '/ship/find';
        } else if (this.type === 'ship') {
          return '/truck/find';
        }
      },
      switchIO() {
        let op = this.type === 'user' || this.type === 'company' || this.type === 'truck' || this.type === 'ship'
        if (op) {
          return true
        } else {
          return false
        }
      },
      inactiveText() {
        if (this.type === 'user') {
          return '公司'
        } else if (this.type === 'company') {
          return '用户'
        } else if (this.type === 'ship') {
          return '车辆'
        } else if (this.type === 'truck') {
          return '船只'
        }
      },
      activeText() {
        if (this.type === 'user') {
          return '用户'
        } else if (this.type === 'company') {
          return '公司'
        } else if (this.type === 'ship') {
          return '船只'
        } else if (this.type === 'truck') {
          return '车辆'
        }
      },
      str() {
        if (this.type === 'user') {
          return '用户';
        } else if (this.type === 'company') {
          return '公司';
        } else if (this.type === 'goods') {
          return '商品';
        } else if (this.type === 'ship') {
          return '船只';
        } else if (this.type === 'truck') {
          return '车辆';
        }
      }
    },
    methods: {
      radioChange(val) {
        console.log(val);
      },
      switchChange(val) {
        this.input = '';
        console.log(this.commonSelect);
        for (const key in this.commonSelect) {
          this.commonSelect[key].option.forEach(item => {
            delete this.option[item];
          });
        }
        this.value = this.type === val;
        if (this.type === val) {
          if (this.type === 'company') {
            this.$set(this.option, 'populate', 'platform');
          } else if (this.type === 'user') {
            this.$set(this.option, 'populate', 'platform');
          } else if (this.type === 'ship') {
            this.$set(this.option, 'populate', 'owner');
          } else if (this.type === 'truck') {
            this.$set(this.option, 'populate', 'owner');
          }
        } else {}
        console.log(this.option);
        this.$emit('switchChange', val);
      },
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
        } else if (this.type === 'area') {
          return tag.name;
        } else if (this.type === 'ship') {
          return tag.no;
        } else if (this.type === 'truck') {
          return tag.no;
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
      this.$nextTick(() => {
        if (this.isSwitch) {
          this.tableHeight = 740 - this.$refs.div.offsetHeight - 372 - this.$refs.switchHeight.offsetHeight + 'px';
        } else {
          this.tableHeight = 740 - this.$refs.div.offsetHeight - 372 + 'px';
        }
      })
      this.path = '/' + this.type + '/find';
      for (const key in this.commonSelect) {
        if (key === this.type) {
          console.log('type', this.type);
          console.log('key', key);
          console.log('this.commonSelect[key].option', this.commonSelect[key].option);
          this.thead = this.commonSelect[key].thead;
          this.commonSelect[key].option.forEach(item => {
            delete this.option[item];
            console.log(this.option);
          });
          if (this.commonSelect[key].populate) {
            this.option.populate = this.commonSelect[key].populate;
          }
        }
      };
      if (this.type === 'user') {
        this.radio = 'user';
      } else if (this.type === 'company') {
        this.radio = 'company';
      } else if (this.type === 'ship') {
        this.radio = 'ship';
      } else if (this.type === 'truck') {
        this.radio = 'truck';
      }
    }
  }
</script>

<style scoped>

</style>