<template>
  <loading-box v-model="loadingText" class="role-box" style="position: relative;">
    <el-tabs v-model="activeName" type="card" style="box-shadow:none;">
      <el-tab-pane label="管理员" name="admin">
        <company-role-item :removeData.sync="startRemoveData.admin" :show.sync="startShowData" :data.sync="roleArr.admin" key="admin"></company-role-item>
      </el-tab-pane>
      <el-tab-pane label="业务专员" name="salesman">
        <company-role-item :removeData.sync="startRemoveData.salesman" :show.sync="startShowData" :data.sync="roleArr.salesman" key="salesman"></company-role-item>
      </el-tab-pane>
      <el-tab-pane label="完成审核员" name="finishCheck">
        <company-role-item :removeData.sync="startRemoveData.finishCheck" :show.sync="startShowData" :data.sync="roleArr.finishCheck" key="finishCheck"></company-role-item>
      </el-tab-pane>
      <el-tab-pane label="财务文员" name="financial">
        <company-role-item :removeData.sync="startRemoveData.financial" :show.sync="startShowData" :data.sync="roleArr.financial" key="financial"></company-role-item>
      </el-tab-pane>
      <el-tab-pane label="单据文员" name="documentClerk">
        <company-role-item :removeData.sync="startRemoveData.documentClerk" :show.sync="startShowData" :data.sync="roleArr.documentClerk" key="documentClerk"></company-role-item>
      </el-tab-pane>
    </el-tabs>
    <div class="jc" v-if="show()" style="position:absolute;top:0;right:0;height:40px;" title="添加用户">
      <el-button type="primary" @click="fastAdd" size="mini">快速初始化</el-button>
      <el-button type="success" @click="add" size="mini">添加{{userText()}}</el-button>
    </div>
    <el-dialog :title="`选择${userText()}`" width="50%" :visible.sync="dialogTableVisible">
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
      default: "edmit"
    },
    startRoleObj: {
      type: Object,
      default() {
        return {};
      }
    },
    removeData: {
      type: Object,
      default() {
        return {
          admin: [],
          salesman: [],
          finishCheck: [],
          financial: [],
          documentClerk: []
        };
      }
    },
    data: {
      type: Object,
      default() {
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
      fastAddIo: false,
      fastAddShow: false,
      startShowData: true,
      startRemoveData: {
        admin: [],
        salesman: [],
        finishCheck: [],
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
        finishCheck: [],
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
        if (this.type === "edmit") {
          let op =
            oldVal.admin.length === 0 &&
            oldVal.salesman.length === 0 &&
            oldVal.finishCheck.length === 0 &&
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
      for (
        let index = 0;
        index < this.roleArr[this.activeName].length;
        index++
      ) {
        for (let i = index + 1; i < this.roleArr[this.activeName].length; i++) {
          if (
            this.roleArr[this.activeName][index]._id ===
            this.roleArr[this.activeName][i]._id
          ) {
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
      }
      this.dialogTableVisible = false;
      this.$emit("update:showData", false);
    },
    selectionChange(val) {
      this.selectionArr = val;
    },
    inputChange(val) {
      if (val) {
        this.$set(this.option, "$or", [
          {
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
      } else if (this.activeName === "finishCheck") {
        return "完成审核员";
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
        this.activeName === "finishCheck" ||
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
    if (this.type === "edmit") {
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