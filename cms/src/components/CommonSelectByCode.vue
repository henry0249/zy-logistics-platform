<template>
  <div :style="{fontSize,width:$attrs.width || '100%'}">
    <div v-if="isArray" class="jc jb" style="margin-bottom:5px;">
      <div class="jc js" style="width:50%;">
        <div v-if="$attrs.label" class="tf1" :title="$attrs.label">
          <span class="" :style="{display:'block',fontSize}">{{$attrs.label}}</span>
        </div>
        <div :style="{fontSize}" style="margin-left:5px;flex:0 0 150px">/共选
          <span class="success">{{checkData.length}}</span> 家公司
        </div>
      </div>
      <div class="jc pointer" @click="dialogTableVisible = true">
        <div class="success">添加公司</div>
        <i class="el-icon-plus success"></i>
      </div>
    </div>
    <div v-if="isArray" class="bottom-box">
      <div v-if="checkData.length > 0" class="jc js" style="flex-wrap: wrap">
        <div class="tag-box" :style="{fontSize:fontSize}" v-for="(item,index) in checkData" :key="index">
          <span>{{item.no || item.name || item.nick || item.mobile}}</span>
          <i class="el-icon-error pointer del" title="删除该公司" @click="delTag(index)"></i>
        </div>
      </div>
      <div v-else style="height:32px;line-height:32px;color:#c0c4cc;">未选择</div>
    </div>
    <div v-if="!isArray">
      <my-form-item :label="$attrs.label" :size="size||$parent.size">
        <div slot="label">
          {{$attrs.label}}
        </div>
        <div class="jc js">
          <div v-if="check" class="f1">
            <text-dropdown v-model="value" :color="['#E6A23C','#409EFF','#67C23A']" :options="checkOption"></text-dropdown>
          </div>
          <div style="position:relative" @click="clickInputt">
            <el-input v-if="show" :readonly="readonly" style="width:100%" :value="text" v-bind="$attrs" :placeholder="$attrs.placeholder" :size="size||$parent.size" class="input-with-select blue">
              <i slot="suffix" class="el-input__icon el-icon-edit" :class="$attrs.disabled?'info':'blue'"></i>
            </el-input>
            <el-input v-else ref="input" :readonly="$attrs.disabled" style="width:100%" v-model="inputValue" v-bind="$attrs" :placeholder="$attrs.placeholder" :size="size||$parent.size" class="input-with-select blue"></el-input>
          </div>
        </div>
      </my-form-item>
    </div>
    <el-dialog :title="`添加${commonData.name[typeStr]}`" width="70%" top="15vh" :visible.sync="dialogTableVisible">
      <loading-box v-model="loadingText">
        <div class="as js" ref="tag">
          <div :style="{fontSize:fontSize,flex:'0 0 80px'}">已选择：</div>
          <div style="flex-wrap:wrap;max-height:50px;overflow:auto;">
            <el-tag style="margin-right:5px;" v-if="checkData.length > 0" :key="index" size="mini" v-for="(tag,index) in checkData" closable :disable-transitions="false" @close="handleClose(tag,index)">
              {{tag.no || tag.name || tag.nick || tag.mobile}}
            </el-tag>
            <div :style="{fontSize:fontSize}" v-if="checkData.length <= 0">未选择</div>
          </div>
        </div>
        <div v-if="dialogTableVisible">
          <div class="jc jb searchBox">
            <div class="jc js">
              <my-form-item v-if="typeStr === 'company' && type" size="mini" width="250px" v-model="input" placeholder="输入公司关联代码"></my-form-item>
              <my-form-item v-if="typeStr === 'company' && !type" size="mini" width="250px" v-model="nickInput" placeholder="输入公司全称、简称或者公司代码"></my-form-item>
              <my-form-item v-if="typeStr === 'user'" size="mini" width="250px" v-model="mobile" placeholder="输入手机号"></my-form-item>
            </div>
            <el-button size="mini" type="primary" @click="search">搜 索</el-button>
          </div>
          <el-table @cell-click="cellClick" v-if="dialogTableVisible" border stripe size="mini" :data="tableData">
            <template  v-for="(item, key) in thead">
              <el-table-column v-if="key === 'type'" show-overflow-tooltip :prop="key" :label="is('json',item)?item.name:item" :width="''+(item.width||'')" :key="key">
                <template slot-scope="scope">
                  <el-tag size="mini" v-for="v in scope.row.type" :key="v.id">{{field.Company.type.option[v]}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column v-else show-overflow-tooltip :prop="key" :label="is('json',item)?item.name:item" :width="''+(item.width||'')" :key="key">
              </el-table-column>
            </template>
          </el-table>
        </div>
      </loading-box>
      <div slot="footer" class="jb">
        <el-button size="mini" @click="dialogTableVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="go">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import commonData from './CommonSelectByCode.js';
  export default {
    props: {
      userType: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: ''
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
        default: "60px"
      },
      data: {
        type: [Array, Object, String],
        default () {
          return [];
        }
      },
      option: {
        type: Object,
        default () {
          return {};
        }
      },
      check: {
        type: Boolean,
        default: false
      },
      code: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        commonData,
        ischange: false,
        readonly: false,
        show: true,
        inputValue: '',
        value: 'company',
        mobile: '',
        typeStr: '',
        checkData: [],
        loadingText: '',
        dialogTableVisible: false,
        input: '',
        nickInput: '',
        op: {},
        thead: {},
        tableData: [],
        checkOption: [{
          label: '用户',
          value: 'user'
        }, {
          label: '公司',
          value: 'company'
        }, {
          label: '手机',
          value: 'mobile'
        }],
        key: {
          transportTrainsRelationCompany: {
            name: 'transportTrainsRelationCompany'
          },
          businessRelationCompany: {
            name: "businessRelationCompany"
          }
        }
      }
    },
    watch: {
      inputValue(val) {
        if (this.show === false) {
          this.$emit('update:data', val);
        }
      },
      dialogTableVisible(val) {
        this.tableData = [];
        this.input = '';
        this.mobile = '';
        this.nickInput = '';
      },
      checkData: {
        handler(val) {
          this.ischange = true;
        },
        deep: true
      },
      value(val) {
        this.$emit('update:userType', val);
        this.typeStr = val;
        this.checkData = [];
        this.inputValue = '';
        if (val !== 'mobile') {
          this.show = true;
        } else {
          this.show = false;
        }
      },
      typeStr(val) {
        this.thead = this.commonData.thead[val];
      }
    },
    computed: {
      text() {
        if (this.checkData.length > 0) {
          return this.checkData[this.checkData.length - 1].name;
        } else {
          return '未选择'
        }
      },
      isArray() {
        if (this.is('array', this.data)) {
          return true;
        } else {
          return false;
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
      }
    },
    methods: {
      clickInputt() {
        if (this.value !== 'mobile') {
          if (!this.$attrs.disabled) {
            this.dialogTableVisible = true;
          }
        }
      },
      handleClose(tag, index) {
        this.checkData.splice(index, 1);
      },
      async search() {
        if (this.input || this.mobile || this.nickInput) {
          this.tableData = [];
          try {
            this.loadingText = '搜索中...';
            if (this.typeStr === 'company' && this.type) {
              let res = await this.$ajax.post('/relationCode/findOne', {
                value: this.input,
                populate: [{
                  path: 'company'
                }]
              });
              this.tableData.push(res.company);
            } else if (this.typeStr === 'user') {
              let res = await this.$ajax.post('/user/findOne', {
                mobile: this.mobile,
                populate: [{
                  path: 'company'
                }]
              });
              this.tableData.push(res);
            } else if (this.typeStr === 'company' && !this.type) {
              let res = await this.$ajax.post('/company/findOne', {
                $or: [{
                  name: this.nickInput
                }, {
                  nick: this.nickInput
                }, {
                  code: this.nickInput
                }]
              });
              this.tableData.push(res);
            }
            this.duplication(this.tableData);
          } catch (error) {}
          this.loadingText = '';
        }
      },
      delTag(index) {
        this.checkData.splice(index, 1);
        this.$emit('update:data', this.checkData);
      },
      cellClick(row, column, cell, event) {
        console.log(row);
        let io = true;
        this.checkData.forEach(item => {
          if (row._id === item._id) {
            this.$message.warn(`已选择该${this.typeStr === 'company'?'公司':'用户'}`);
            io = false;
          }
        });
        if (io) {
          if (this.isArray) {
            this.checkData.push(row);
            this.checkData = this.duplication(this.checkData);
          } else {
            this.checkData = [];
            this.checkData.push(row);
          }
        }
      },
      inputChange(val) {
        console.log(val);
      },
      mobileChange(val) {},
      duplication(val) {
        let data = val;
        for (let index = 0; index < data.length; index++) {
          for (let i = index + 1; i < data.length; i++) {
            if (JSON.stringify(data[index]) === JSON.stringify(data[i])) {
              data.splice(i, 1);
              this.$message.warn(`已选择该${this.commonData.name}`);
            }
          }
        }
        return data;
      },
      async go() {
        if (this.ischange) {
          if (this.isArray) {
            if (this.type) {
              try {
                this.loadingText = '更新中...';
                let update = {
                  _id: this.company._id,
                  relationCode: this.input
                }
                let data = [];
                this.checkData.forEach(item => {
                  data.push(item._id);
                });
                for (const key in this.key) {
                  if (this.key.hasOwnProperty(key)) {
                    if (this.type === key) {
                      this.$set(update, key, data);
                    }
                  }
                }
                await this.$ajax.post('/company/update', update);
              } catch (error) {}
              this.loadingText = '';
            }
            this.$emit('update:data', this.checkData);
          } else {
            if (this.checkData.length > 0) {
              this.$emit('update:data', this.checkData[this.checkData.length - 1]);
            } else {
              this.$emit('update:data', {});
            }
          }
        }
        this.dialogTableVisible = false;
      }
    },
    created() {
      if (Object.keys(this.option).length > 0) {
        this.op = JSON.parse(JSON.stringify(this.option));
      }
      if (this.isArray) {
        if (this.data.length > 0) {
          this.checkData = JSON.parse(JSON.stringify(this.data));
        }
      } else {
        if (Object.keys(this.data).length > 0) {
          this.checkData = [];
          this.checkData.push(this.data);
        }
      }
      for (const key in this.$attrs) {
        if (key === 'user') {
          this.typeStr = key;
        }
        if (key === 'company') {
          this.typeStr = key;
        }
      };
      this.value = this.typeStr;
      this.$emit('update:userType', this.typeStr);
      this.thead = this.commonData.thead[this.typeStr];
      if (this.$attrs.disabled) {
        let checkOptionData = [];
        this.checkOption.forEach(item => {
          let obj = item;
          this.$set(obj, 'disabled', true);
          checkOptionData.push(obj);
        });
        this.checkOption = checkOptionData;
      }
    }
  }
</script>

<style scoped>
  .bottom-box {
    padding: 5px 5px 5px 10px;
    max-height: 82px;
    min-height: 42px;
    overflow: auto;
    box-sizing: border-box;
    border: 1px solid #DCDFE6;
    border-radius: 5px;
  }
  .tag-box {
    margin: 3px 10px 3px 0;
    padding: 3px 10px;
    border: 1px solid #EBEEF5;
    box-sizing: border-box;
    border-radius: 4px
  }
  .table-style {
    margin-top: 10px;
    padding: 0px;
    width: 100%;
  }
  .del {
    color: #c0c4cc;
    margin-left: 5px;
  }
  .del:hover {
    color: #909399;
  }
  .searchBox {
    height: 28px;
    margin: 10px 0;
  }
</style>