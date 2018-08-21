<template>
  <div class="js as">
    <div style="padding:0 5%;width:100%;">
      <div class="jc je" style="height:40px;">
        <el-button type="success" @click="add" :title="`添加${userText()}`" size="mini">{{userText()}}<i class="el-icon-plus el-icon--right"></i></el-button>
      </div>
      <my-table height="100vh - 90px" border index :thead="thead" :data.sync="data" size="mini">
      </my-table>
      <el-dialog :title="`选择${userText()}`" width="70%" :visible.sync="dialogTableVisible">
        <common-table v-if="dialogTableVisible" path="/user/find" @selection-change="selectionChange" :height="tableHeight" :thead="thead" selection :option="option">
          <div slot="header">
            <my-form-item input v-model="input" @change="inputChange" width="300px" size="mini" filterable placeholder="搜索用户名或者手机号码"></my-form-item>
          </div>
        </common-table>
        <div slot="footer" class="dialog-footer jb">
          <el-button size="mini" @click="res">取 消</el-button>
          <el-button size="mini" type="primary" @click="go">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import CompanyRoleItem from "../company/CompanyRoleItem.vue";
  export default {
    components: {
      CompanyRoleItem
    },
    props: {
      type: {
        type: String,
        default: 'sysSalesman'
      },
    },
    data() {
      return {
        tableHeight:'',
        option:{},
        selectionArr: [],
        dialogTableVisible: false,
        data: [],
        input: "",
        op: {},
        key: {
          sysSalesman: '系统业务员',
          sysDispatcher: '系统调度员',
        },
        thead: {
          name: {
            name: "用户名",
            slot: true
          },
          mobile: {
            name: "手机号"
          },
          tag: {
            name: "标签",
            slot: true
          }
        }
      }
    },
    methods: {
      selectionChange(val) {
        this.selectionArr = val;
      },
      res() {
        this.dialogTableVisible = false;
      },
      userText() {
        return this.key[this.type];
      },
      inputChange(val) {},
      tagType(index, arr) {
        let type = ["success", "info", "warning", "danger"];
        if (index <= arr.length - 1) {
          return type[index];
        } else {
          return type[index - arr.length - 1];
        }
      },
      add() {
        this.dialogTableVisible = true;
      },
      go() {//未完
        this.selectionArr.forEach(item => {
          this.data.push(item);
        });
        for (let index = 0; index < this.data.length; index++) {
          for (let i = index + 1; i < this.data.length; i++) {
            if (this.data[index]._id === this.data[i]._id) {
              this.data.splice(i, 1);
            }
          }
        }
        this.dialogTableVisible = false;
      },
      see(scope) {},
      async getData() {
        this.data = await this.$api.curd({
          model: 'role',
          curdType: 'find',
          type: this.type
        })
      }
    },
    mounted() {
      this.tableHeight =
        document.documentElement.clientHeight * 0.7 - 114 - 58 + "px";
    },
    async created() {
      try {} catch (error) {}
    }
  }
</script>

<style scoped>
  .name-txt {
    color: #42a5f5;
  }
  .name-txt:hover {
    text-decoration: underline;
  }
</style>