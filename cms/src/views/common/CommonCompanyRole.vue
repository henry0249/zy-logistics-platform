<template>
  <loading-box style=" position: relative">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(value,key,index) in type" :name="key" :key="index" :label="value">
        <my-table max-height="300" :thead="thead" :data.sync="changeData" size="mini" border index op opWidth="45">
          <div slot="op" slot-scope="scope" class="jc">
            <remove-check @remove="remove(scope)"></remove-check>
          </div>
        </my-table>
      </el-tab-pane>
    </el-tabs>
    <div class="jc" style="height:40px;position: absolute;top:0;right:0">
      <el-tooltip class="item" effect="dark" content="快速添加所有管理人员" placement="top">
        <el-button style="padding:5px" type="warning" icon="el-icon-info" size="mini" @click="fastAdd">快速初始化</el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" :content="`添加${btmText}`" placement="top">
        <el-button style="padding:5px" type="success" icon="el-icon-plus" size="mini" @click="addUser"></el-button>
      </el-tooltip>
    </div>
    <el-dialog :title="`添加${btmText}`" width="70%" :visible.sync="dialogTableVisible">
      <div v-if="dialogTableVisible" class="js as" style="font-size:12px;">
        <div style="margin-right:10px;">已选择</div>
        <div v-if="currentValue.name || currentValue.mobile">{{currentValue.name || currentValue.mobile}}</div>
        <div v-else>未选择</div>
      </div>
      <common-table v-if="dialogTableVisible" style="padding:0" @current-change="currentChange" path="/user/find" :thead="thead" height="50vh" :option="option">
        <div slot="header">
          <my-form-item placeholder="搜索用户名" size="mini" width="250px" v-model="input" @change="inputChange"></my-form-item>
        </div>
      </common-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="res">确 定</el-button>
      </div>
    </el-dialog>
  </loading-box>
</template>

<script>
  export default {
    props: {
      startData: {
        type: Array,
        default () {
          return [];
        }
      },
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      removeList: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    data() {
      return {
        fastIo: false,
        currentValue: {},
        input: "",
        option: {},
        dialogTableVisible: false,
        activeName: "admin",
        newData: [],
        type: {
          admin: "管理员",
          salesman: "业务专员",
          beforeDispatchCheck: "调度前审核员",
          dispatcher: "调度专员",
          beforeSettleCheck: "结算前审核员",
          financial: "财务文员",
          documentClerk: "单据文员"
        },
        thead: {
          name: {
            name: "用户名",
            readOnly: true
          },
          mobile: {
            name: "手机号",
            readOnly: true
          }
        }
      };
    },
    watch: {
      newData: {
        handler(val) {
          this.$emit("update:data", val);
        },
        deep: true
      },
      changeData(val) {},
      dialogTableVisible(val) {
        if (!val) {
          this.currentValue = {};
        }
      }
    },
    computed: {
      btmText() {
        return this.type[this.activeName];
      },
      changeData() {
        let data = [];
        this.newData.forEach(item => {
          if (item.type === this.activeName) {
            data.push(item.user);
          }
        });
        return data;
      }
    },
    methods: {
      fastAdd() {
        this.dialogTableVisible = true;
        this.fastIo = true;
      },
      res() {
        if (Object.keys(this.currentValue).length > 0) {
          if (this.fastIo) {
            for (const key in this.type) {
              let obj = {};
              Object.assign(obj, {
                type: key,
                user: this.currentValue
              });
              this.newData.push(obj);
            }
            for (let index = 0; index < this.newData.length; index++) {
              for (let i = index + 1; i < this.newData.length; i++) {
                if (this.newData[index].type === this.newData[i].type && this.newData[index].user._id === this.newData[i].user._id) {
                  this.newData.splice(i, 1);
                }
              }
            }
          } else {
            let obj = {};
            Object.assign(obj, {
              type: this.activeName,
              user: this.currentValue
            });
            this.newData.push(obj);
          }
        }
        this.dialogTableVisible = false;
        this.fastIo = false;
      },
      currentChange(val) {
        let isChange = false;
        this.newData.forEach((item, index) => {
          if (item.type === this.activeName) {
            if (item.user._id === val._id) {
              isChange = true;
            }
          }
        });
        if (isChange && !this.fastIo) {
          this.$message.warn(`已选择该用户为${this.type[this.activeName]}`);
          this.currentValue = {};
        } else {
          this.currentValue = val;
        }
      },
      inputChange(val) {
        this.$set(this.option, "$or", [{
          name: {
            $regex: val
          }
        }]);
      },
      remove(scope) {
        this.newData.forEach((item, index) => {
          if (item.type === this.activeName && item.user._id === scope.row._id) {
            this.newData.splice(index, 1);
          }
        });
        if (scope.row._id) {
          let arr = [];
          arr.push(scope.row._id);
          this.$emit('update:removeList',arr);
        }
      },
      addUser() {
        this.dialogTableVisible = true;
      }
    },
    created() {
      this.newData = JSON.parse(JSON.stringify(this.startData));
    }
  };
</script>

<style scoped>
</style>