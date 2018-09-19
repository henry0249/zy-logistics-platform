<template>
  <loading-box v-model="loadingText" class="role-box" style="position: relative;">
    <el-tabs v-model="activeName" style="box-shadow:none;">
      <el-tab-pane :label="value" :name="k" v-for="(value,k) in key" :key="k">
        <company-role-item style="margin-top:15px;" :removeData.sync="startRemoveData[k]" :show.sync="startShowData" :data.sync="roleArr[k]" :key="k"></company-role-item>
      </el-tab-pane>
    </el-tabs>
    <div class="jc" v-if="show()" style="position:absolute;top:0;right:0;height:40px;">
      <el-button type="primary" @click="fastAdd" size="mini">快速初始化</el-button>
      <el-button type="success" @click="add" :title="`添加${userText()}`" size="mini">{{userText()}}<i class="el-icon-plus el-icon--right"></i></el-button>
    </div>
    <el-dialog :title="`选择${userText()}`" width="70%" :visible.sync="dialogTableVisible">
      <common-table v-if="dialogTableVisible" path="/user/find" @selection-change="selectionChange" :height="tableHeight" :thead="thead" selection :option="option">
        <div slot="header">
          <my-form-item input v-model="input" @change="inputChange" width="300px" size="mini" filterable placeholder="搜索用户名或者手机号码"></my-form-item>
        </div>
      </common-table>
      <div slot="footer" class="dialog-footer jb">
        <el-button size="mini" @click="res">取 消</el-button>
        <el-button size="mini" type="primary" :disabled="btmDisabled" @click="go">确 定</el-button>
      </div>
    </el-dialog>
  </loading-box>
</template>

<script>
  import CompanyRoleItem from "./CompanyRoleItem.vue";
  export default {
    components: {
      CompanyRoleItem
    },
    props: {
      type: {
        type: String,
        default: "edit"
      },
      startRoleObj: {
        type: Object,
        default () {
          return {};
        }
      },
      removeData: {
        type: Object,
        default () {
          return {
            admin: [],
            salesman: [],
            beforeDispatchCheck: [],
            dispatcher: [],
            beforeSettleCheck: [],
            financial: [],
            documentClerk: []
          };
        }
      },
      data: {
        type: Object,
        default () {
          return {};
        }
      },
      showData: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        key: {
          admin: "管理员",
          salesman: "业务专员",
          beforeDispatchCheck: "调度前审核员",
          dispatcher: "调度专员",
          beforeSettleCheck: "结算前审核员",
          financial: "财务文员",
          documentClerk: "单据文员"
        },
        fastAddIo: false,
        fastAddShow: false,
        startShowData: true,
        startRemoveData: {
          admin: [],
          salesman: [],
          beforeDispatchCheck: [],
          dispatcher: [],
          beforeSettleCheck: [],
          financial: [],
          documentClerk: []
        },
        btmIo: false,
        btmDisabled: true,
        selectionArr: [],
        option: {},
        tableHeight: "",
        input: "",
        activeName: "admin",
        loadingText: "",
        dialogTableVisible: false,
        roleArr: {
          admin: [],
          salesman: [],
          beforeDispatchCheck: [],
          dispatcher: [],
          beforeSettleCheck: [],
          financial: [],
          documentClerk: []
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
      startShowData(val) {
        this.$emit("update:showData", val);
      },
      startRemoveData: {
        handler(val) {
          this.$emit("update:removeData", val);
        },
        deep: true
      },
      roleArr: {
        handler(val, oldVal) {
          for (const key in val) {
            for (let index = 0; index < val[key].length; index++) {
              for (let i = index + 1; i < val[key].length; i++) {
                if (val[key][i]._id === val[key][index]._id) {
                  val[key].splice(i, 1);
                }
              }
            }
          }
          if (this.type === "edit") {
            let op =
              oldVal.admin.length === 0 &&
              oldVal.salesman.length === 0 &&
              oldVal.beforeDispatchCheck.length === 0 &&
              oldVal.dispatcher.length === 0 &&
              oldVal.beforeSettleCheck.length === 0 &&
              oldVal.financial.length === 0 &&
              oldVal.documentClerk.length === 0;
            if (!op) {
              this.$emit("update:data", val);
            }
          } else if (this.type === "add") {
            this.$emit("update:data", val);
            if (val.admin.length > 0) {
              this.fastAddShow = true;
            } else {
              this.fastAddShow = false;
            }
          }
        },
        deep: true
      },
      activeName(val, oldVal) {},
      selectionArr(val) {
        if (val.length > 0) {
          this.btmDisabled = false;
        } else {
          this.btmDisabled = true;
        }
      },
      dialogTableVisible(val) {
        if (!val) {
          this.selectionArr = [];
        }
      }
    },
    methods: {
      fastAdd() {
        this.fastAddIo = true;
        this.add();
      },
      res() {
        this.dialogTableVisible = false;
      },
      go() {
        this.selectionArr.forEach(item => {
          this.roleArr[this.activeName].push(item);
        });
        for (let index = 0; index < this.roleArr[this.activeName].length; index++) {
          for (let i = index + 1; i < this.roleArr[this.activeName].length; i++) {
            if (this.roleArr[this.activeName][index]._id === this.roleArr[this.activeName][i]._id) {
              this.roleArr[this.activeName].splice(i, 1);
            }
          }
        }
        if (this.fastAddIo) {
          for (const key in this.roleArr) {
            this.selectionArr.forEach(item => {
              this.roleArr[key].push(item);
            });
          }
          for (const key in this.roleArr) {
            for (let index = 0; index < this.roleArr[key].length; index++) {
              for (let i = index + 1; i < this.roleArr[key].length; i++) {
                if (this.roleArr[key][index]._id === this.roleArr[key][i]._id) {
                  this.roleArr[key].splice(i, 1);
                }
              }
            }
          }
        }
        this.dialogTableVisible = false;
        this.$emit("update:showData", false);
        this.fastAddIo = false;
      },
      selectionChange(val) {
        this.selectionArr = val;
      },
      inputChange(val) {
        if (val) {
          this.$set(this.option, "$or", [{
              name: {
                $regex: val
              }
            },
            {
              mobile: {
                $regex: val
              }
            }
          ]);
        } else {
          delete this.option.$or;
        }
      },
      userText() {
        if (this.activeName === "admin") {
          return "管理员";
        } else if (this.activeName === "salesman") {
          return "业务专员";
        } else if (this.activeName === "beforeDispatchCheck") {
          return "调度前审核员";
        } else if (this.activeName === "dispatcher") {
          return "审核专员";
        } else if (this.activeName === "beforeSettleCheck") {
          return "结算前审核员";
        } else if (this.activeName === "financial") {
          return "财务文员";
        } else if (this.activeName === "documentClerk") {
          return "单据文员";
        } else {
          return "";
        }
      },
      show() {
        if (
          this.activeName === "admin" ||
          this.activeName === "salesman" ||
          this.activeName === "beforeDispatchCheck" ||
          this.activeName === "dispatcher" ||
          this.activeName === "beforeSettleCheck" ||
          this.activeName === "financial" ||
          this.activeName === "documentClerk"
        ) {
          return true;
        }
      },
      add() {
        if (this.show()) {
          this.dialogTableVisible = true;
        }
      }
    },
    mounted() {
      this.tableHeight =
        document.documentElement.clientHeight * 0.7 - 114 - 58 + "px";
    },
    async created() {
      if (this.type === "edit") {
        this.roleArr = JSON.parse(JSON.stringify(this.startRoleObj));
      }
    }
  };
</script>

<style scoped>
  .role-box {
    position: relative;
  }
</style>