<template>
  <loading-box v-model="loadingText" class="js as">
    <div style="padding:0 5%;width:100%;">
      <div class="jc je" style="height:40px;">
        <el-button type="success" @click="add" :title="`添加${userText()}`" size="mini">{{userText()}}<i class="el-icon-plus el-icon--right"></i></el-button>
      </div>
      <my-table :loadmore="loadmore" v-if="!loadingText" height="100vh - 90px" opWidth="45px" border index :thead="thead" :data.sync="data" size="mini" op>
        <div slot="op" class="jc" slot-scope="scope">
          <remove-check @remove="remove(scope)"></remove-check>
        </div>
        <template slot-scope="scope">
                  <el-tag v-if="scope.prop === 'user.tag'" :type="tagType(index,scope.row['tag'])" style="margin-right:10px;" size="mini" v-for="(item,index) in scope.row['user.tag']" :key="item.id">{{scope.row['user.tag']}}</el-tag>
</template>
      </my-table>
      <el-dialog :title="`选择${userText()}`" width="70%" :visible.sync="dialogTableVisible">
        <common-table style="padding:0" v-if="dialogTableVisible" path="/user/find" @selection-change="selectionChange" :height="tableHeight" :thead="userThead" selection :option="option">
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
  </loading-box>
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
        loadingText: '',
        tableHeight: '',
        option: {},
        selectionArr: [],
        dialogTableVisible: false,
        data: [],
        input: "",
        op: {},
        key: {
          sysSalesman: '系统业务员',
          sysDispatcher: '系统调度员',
        },
        userThead: {
          name: {
            name: "用户名",
          },
          mobile: {
            name: "手机号"
          }
        },
        thead: {
          'user.name': {
            name: "用户名",
          },
          'user.mobile': {
            name: "手机号"
          }
        }
      }
    },
    methods: {
      async loadmore(){
        let data = {
          model:'role',
          curdType:'find',
          type:this.type,
          skip:this.data.length,
          populate:[{path:'user'}]
        }
        let res = await this.$api.curd(data);
        return res;
      },
      async remove(scope) {
        if (scope.row._id) {
          this.loadingText = '删除中';
          try {
            let del = await this.$api.curd({
              model: 'role',
              curdType: 'delete',
              _id: scope.row._id
            })
            this.$message.success('删除成功！');
            await this.getData()
          } catch (error) {}
          this.loadingText = '';
        }
        this.data.splice(scope.index, 1);
      },
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
      async addRole() {
        try {
          this.loadingText = '添加中';
          this.selectionArr.forEach(item => {
            let obj = {
              type: this.type,
            }
            this.$set(obj, 'user', item);
            this.data.push(obj);
          });
          for (let index = 0; index < this.data.length; index++) {
            for (let i = index + 1; i < this.data.length; i++) {
              if (this.data[index].user._id === this.data[i].user._id) {
                this.data.splice(i, 1);
              }
            }
          }
          for (let index = 0; index < this.data.length; index++) {
            if (!this.data[index]._id) {
              let setRole = await this.$api.curd({
                model: 'role',
                curdType: 'set',
                type: this.type,
                user: this.data[index].user._id
              })
            }
          }
          this.$message.success('添加成功！');
          await this.getData();
        } catch (error) {}
        this.loadingText = '';
      },
      go() {
        this.$confirm(`是否添加${this.key[this.type]}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.addRole();
        }).catch(() => {});
        this.dialogTableVisible = false;
      },
      see(scope) {},
      async getData() {
        try {
          this.loadingText = '加载中';
          this.data = await this.$api.curd({
            model: 'role',
            curdType: 'find',
            type: this.type,
            populate: [{
              path: 'user'
            }]
          })
        } catch (error) {}
        this.loadingText = '';
      }
    },
    mounted() {
      this.tableHeight =
        document.documentElement.clientHeight * 0.7 - 114 - 58 + "px";
    },
    async created() {
      await this.getData();
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