<template>
  <loading-box style=" position: relative">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(value,key,index) in type" :name="key" :key="index" :label="value">
        <my-table max-height="300" :thead="thead" :data.sync="changeData" size="mini" border index op opWidth="45">
          <div slot="op" slot-scope="scope" class="jc">
            <remove-check @remove="remove(scope)"></remove-check>
          </div>
          <div slot-scope="scope">
            <my-select v-if="scope.prop === 'area'" area :data.sync="scope.row[scope.prop]" multi size="mini"></my-select>
            <my-form-item number v-if="scope.prop === 'bonus'" :min="0" :max="100" v-model="scope.row[scope.prop]" size="mini"></my-form-item>
          </div>
        </my-table>
      </el-tab-pane>
    </el-tabs>
    <div class="jc" style="height:40px;position: absolute;top:-33.5px;right:0;transform: translate(0,-50%);">
      <el-tooltip class="item" effect="dark" content="快速添加所有管理人员" placement="top">
        <el-button style="padding:5px" type="warning" icon="el-icon-info" size="mini" @click="fastAdd">快速初始化</el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" :content="`添加${btmText}`" placement="top">
        <el-button style="padding:5px" type="success" icon="el-icon-plus" size="mini" @click="addUser">添加{{btmText}}</el-button>
      </el-tooltip>
    </div>
    <el-dialog :title="`添加${btmText}`" width="70%" :visible.sync="dialogTableVisible">
      <div v-if="dialogTableVisible" class="js as" style="font-size:12px;">
        <div style="margin-right:10px;">已选择</div>
        <div v-if="currentValue.name || currentValue.mobile">{{currentValue.name || currentValue.mobile}}</div>
        <div v-else>未选择</div>
      </div>
      <common-table v-if="dialogTableVisible" style="padding:0" @current-change="currentChange" path="/user/find" :thead="userThead" height="50vh" :option="option">
        <div slot="header">
          <my-form-item placeholder="搜索用户名" size="mini" width="250px" v-model="input" @change="inputChange"></my-form-item>
        </div>
      </common-table>
      <el-dialog width="30%" title="添加地区" :visible.sync="innerVisible" append-to-body>
        <my-select :data.sync="area" multi area></my-select>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancel">取 消</el-button>
          <el-button type="primary" size="mini" @click="resArea">确 定</el-button>
        </div>
      </el-dialog>
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
        area: [],
        dialogTableVisible: false,
        innerVisible: false,
        activeName: "companyAdmin",
        newData: [],
        type: {
          companyAdmin: '公司管理员',
          broker: '经纪人', //公司经纪人,区域划分,有提成信息
          salesman: '业务员', //审核修改订单信息
          salesmanManager: '业务经理', //审核修改订单信息
          tradeClerk: '贸易文员', //添加物流链
          dispatcher: '调度专员', //添加物流链,提交配送,确认配送完成
          dispatcherManager: '调度经理', //审核物流单
          logisticsClerk: '物流文员', //审核物流单
          documentClerk: '单据文员', //编辑贸易链和物流链结算相关
          documentClerkManager: '单据主管', //审核单据文员操作
          financial: '财务文员', //财务预审 ,按贸易链关系归集结算
          settle: '结算专员', //打款操作
          financialManager: '财务经理', //流水审核
          cashier: '出纳专员',
          invoiceCleck: '发票专员',
        },
      };
    },
    watch: {
      innerVisible(val) {
        if (!val) {
          this.area = [];
        }
      },
      newData: {
        handler(val) {
          this.$emit("update:data", val);
        },
        deep: true
      },
      dialogTableVisible(val) {
        if (!val) {
          this.currentValue = {};
        }
      }
    },
    computed: {
      userThead() {
        return {
          'name': {
            name: "用户名",
            readOnly: true
          },
          'mobile': {
            name: "手机号",
            readOnly: true
          }
        }
      },
      thead() {
        let thead = {
          'user.name': {
            name: "用户名",
            readOnly: true
          },
          'user.mobile': {
            name: "手机号",
            readOnly: true
          }
        }
        if (this.activeName === 'companyAdmin') {
          delete thead.area;
        } else {
          this.$set(thead, 'area', {
            name: "地区",
            readOnly: true,
            slot: true
          });
          if (this.activeName === 'broker') {
            this.$set(thead, 'bonus', {
              name: "提成",
              readOnly: true,
              slot: true
            });
          } else {
            delete thead.bonus;
          }
        }
        return thead;
      },
      btmText() {
        return this.type[this.activeName];
      },
      changeData() {
        let data = [];
        this.newData.forEach(item => {
          if (item.type === this.activeName) {
            data.push(item);
          }
        });
        return data;
      }
    },
    methods: {
      cancel() {
        this.innerVisible = false;
        this.area = [];
      },
      resArea() {
        this.newData.forEach((newDataItem, index) => {
          if (newDataItem.type !== 'companyAdmin' && newDataItem.area.length === 0 || !newDataItem.area) {
            this.$set(this.newData[index], 'area', this.area);
          }
        });
        this.innerVisible = false;
        this.dialogTableVisible = false;
      },
      fastAdd() {
        this.dialogTableVisible = true;
        this.fastIo = true;
      },
      repeat(val) {
        let data = val;
        for (let index = 0; index < data.length; index++) {
          for (let i = index + 1; i < data.length; i++) {
            if (data[index].type === data[i].type && data[index].user._id === data[i].user._id) {
              data.splice(i, 1);
            }
          }
        }
        return data;
      },
      res() {
        if (Object.keys(this.currentValue).length > 0) {
          if (this.fastIo) {
            for (const key in this.type) {
              let obj = {
                type: key,
                user: this.currentValue,
              };
              if (key !== 'companyAdmin') {
                this.$set(obj, 'area', []);
              }
              this.newData.push(obj);
              this.innerVisible = true;
            }
          } else {
            let obj = {
              type: this.activeName,
              user: this.currentValue,
              area: []
            };
            if (this.activeName === 'broker') {
              this.$set(obj, 'bonus', 0);
            }
            this.newData.push(obj);
            this.dialogTableVisible = false;
          }
        }
        this.newData = this.repeat(this.newData);
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
          this.$set(this.currentValue, 'stockArea', []);
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
          if (item.type === this.activeName && item._id === scope.row._id) {
            this.newData.splice(index, 1);
          }
        });
        if (scope.row._id) {
          let arr = [];
          arr.push(scope.row._id);
          this.$emit('update:removeList', arr);
        }
      },
      addUser() {
        this.dialogTableVisible = true;
      }
    },
    created() {
      if (this.startData.length > 0) {
        this.newData = JSON.parse(JSON.stringify(this.startData));
      }
    }
  };
</script>

<style scoped>

</style>