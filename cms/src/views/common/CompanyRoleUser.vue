<template>
  <loading-box v-model="loadingText">
    <div style="position:relative">
      <el-tabs v-model="activeType">
        <el-tab-pane v-for="(value,key) in type" :key="key" :label="value" :name="key">
          <div style="height:300px">
            <my-table height="300px" :data="roleTypeArr(key)" :thead="thead" size="mini" border op opWidth="45">
              <div class="tc" slot="op" slot-scope="scope">
                <remove-check @remove="remove(scope.row)"></remove-check>
              </div>
              <div slot-scope="scope">
                <my-select v-if="scope.prop === 'userName'" user :data.sync="scope.row.user" @change="selectChange"></my-select>
                <div v-if="scope.prop === 'userMobile'">
                  {{scope.row.user.mobile || '-'}}
                </div>
                <div v-if="scope.prop === 'type'">
                  {{type[scope.row.type]}}
                </div>
              </div>
            </my-table>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="tool flex ac">
        <el-tooltip v-if="role.length === 0" class="item" effect="dark" content="快速添加所有管理人员" placement="top">
          <el-button style="padding:5px" type="warning" icon="el-icon-info" size="mini" @click="quickAddDialog = true">快速初始化</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="`添加${type[activeType]}`" placement="top">
          <el-button style="padding:5px" type="success" icon="el-icon-plus" size="mini" @click="add"></el-button>
        </el-tooltip>
      </div>
    </div>
    <el-dialog title="快速添加所有管理人员" :visible.sync="quickAddDialog" width="30%">
      <div>
        <el-alert title="选择的用户,将担任公司所有管理角色" type="warning" center show-icon :closable="false">
        </el-alert>
        <div style="margin-top:15px">
          <my-select user :data.sync="quickUser"></my-select>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quickAddDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="quickAdd" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </loading-box>
</template>

<script>
export default {
  props: {
    data: {
      type: [Array],
      default() {
        return [];
      }
    },
    removelist: {
      type: [Array],
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      loadingText: "",
      role: [],
      type: {
        admin: "管理员",
        salesman: "业务专员",
        beforeDispatchCheck: "调度前审核员",
        dispatcher: "调度专员",
        beforeSettleCheck: "结算前审核员",
        financial: "财务文员",
        documentClerk: "单据文员"
      },
      activeType: "admin",
      thead: {
        userName: {
          name: "用户名",
          slot: true
        },
        userMobile: {
          name: "手机号",
          slot: true
        },
        type: {
          name: "类型",
          slot: true
        }
      },
      quickAddDialog: false,
      quickUser: {}
    };
  },
  watch: {
    role: {
      handler: function(val) {
        this.$emit("update:data", val);
      },
      deep: true
    }
  },
  methods: {
    pushItem() {
      this.role.push({
        type: this.activeType,
        user: {}
      });
    },
    roleTypeArr(type) {
      let res = [];
      this.role.forEach(item => {
        if (item.type === type) {
          res.push(item);
        }
      });
      return res;
    },
    quickAdd() {
      this.quickAddDialog = false;
      for (const key in this.type) {
        this.role.push({
          type: key,
          user: this.quickUser
        });
      }
    },
    add() {
      if (this.role.length > 0) {
        let lastRole = this.role[this.role.length - 1];
        if (!lastRole.user._id) {
          this.$message.warning(`${this.type[lastRole.type]}尚未完成添加`);
          return;
        }
      }
      this.pushItem();
    },
    async remove(item) {
      let index = this.role.indexOf(item);
      if (item._id) {
        if (!this.removelist.includes(item._id)) {
          this.removelist.push(item._id);
        }
      } else {
        this.role.splice(index, 1);
      }
    },
    selectChange(val) {
      let currentRoleArr = this.roleTypeArr(this.activeType);
      if (currentRoleArr.length > 1) {

        let lastRole = currentRoleArr[currentRoleArr.length - 1 - 1];
        if (
          lastRole.user._id === val._id &&
          this.activeType === lastRole.type
        ) {
          this.$message.warning(`${this.type[lastRole.type]}已存在相同用户`);
          currentRoleArr[currentRoleArr.length - 1].user = {};
        }
      }
    }
  },
  mounted() {
    if (this.val && this.val.length > 0) {
      this.role = JSON.parse(JSON.stringify(this.val));
    }
  }
};
</script>

<style scoped>
.tool {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px 0;
}
</style>