<template>
  <div :style="{fontSize}">
    <div class="jc jb" style="margin-bottom:5px;">
      <div class="jc js" style="width:50%;">
        <div v-if="$attrs.label" class="tf1" :title="$attrs.label">
          <span class="tf1" :style="{display:'block',width:labelWidth,fontSize}">{{$attrs.label}}</span>
        </div>
        <div :style="{fontSize}" style="margin-left:5px;flex:0 0 150px">/共选
          <span class="success">{{this.checkData.length}}</span> 家公司
        </div>
      </div>
      <div class="jc pointer" @click="dialogTableVisible = true">
        <div class="success">添加公司</div>
        <i class="el-icon-plus success"></i>
      </div>
    </div>
    <div class="bottom-box">
      <div v-if="checkData.length > 0" class="jc js" style="flex-wrap: wrap">
        <div class="tag-box" :style="{fontSize:fontSize}" v-for="(item,index) in checkData" :key="index">
          <span>{{item.no || item.name || item.nick || item.mobile}}</span>
          <i class="el-icon-error pointer del" :title="title" @click="delTag(index)"></i>
        </div>
      </div>
      <div v-else style="height:32px;line-height:32px;color:#c0c4cc;">未选择</div>
    </div>
    <el-dialog :title="`添加公司`" width="70%" top="15vh" :visible.sync="dialogTableVisible">
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
        <div style="height:calc(50vh - 50px)">
          <my-table v-if="!loadingText" selection border stripe size="mini" height="50vh - 50px" @selection-change="selectionChange" :thead="thead" :data="tableData">
            <div slot="header" class="jc jb" style="margin:10px 0">
              <my-form-item size="mini" width="250px" v-model="input" @change="inputChange" placeholder="输入公司关联代码"></my-form-item>
              <el-button size="mini" type="primary" @click="search">搜 索</el-button>
            </div>
            <div slot-scope="scope" v-if="scope.prop === 'type'">
              <div v-if="scope.row[scope.prop].length > 0">
                <el-tag size="mini" v-for="item in scope.row[scope.prop]" :key="item.id">{{field.Company.type.option[item]}}</el-tag>
              </div>
              <div v-if="scope.row[scope.prop].length === 0">11</div>
            </div>
          </my-table>
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
  export default {
    props: {
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
        type: Array,
        default () {
          return [];
        }
      },
      option: {
        type: Object,
        default () {
          return {};
        }
      }
    },
    data() {
      return {
        checkData: [],
        loadingText: '',
        dialogTableVisible: false,
        input: '',
        op: {},
        tableData: [],
        thead: {
          name: {
            readOnly: true,
            name: '公司名称'
          },
          nick: {
            readOnly: true,
            name: '公司别称'
          },
          type: {
            readOnly: true,
            slot: true,
            name: '公司类型'
          }
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
      }
    },
    methods: {
      async search() {
        this.tableData = [];
        try {
          this.loadingText = '搜索中...';
          let res = await this.$ajax.post('/relationCode/findOne', {
            value: this.input,
            populate: [{
              path: 'company'
            }]
          });
          this.tableData.push(res.company);
          this.duplication(this.tableData);
        } catch (error) {}
        this.loadingText = '';
      },
      delTag(index) {
        this.checkData.splice(index, 1);
      },
      selectionChange(val) {
        console.log(val);
      },
      inputChange(val) {
        console.log(val);
      },
      duplication(val) {
        for (let index = 0; index < val.length; index++) {
          for (let i = index + 1; i < val.length; i++) {
            if (val[index] === val[i]) {
              val.splice(i, 1);
            }
          }
        }
      },
      go() {}
    },
    created() {
      if (Object.keys(this.option).length > 0) {
        this.op = JSON.parse(JSON.stringify(this.option));
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
</style>