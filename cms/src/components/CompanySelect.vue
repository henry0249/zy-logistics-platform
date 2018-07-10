<template>
  <div>
    <div class="flex ac">
      <div class="f1 tf1">{{dataFormat(data)}}</div>
      <i @click="dialogVisible=true" class="el-icon-edit pointer" style="color:#409EFF;margin-left:5px"></i>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="60%">
      <loading-box v-model="loadingText">
        <div class="flex jb">
          <div>已选公司：</div>
          <div class="f1">
            <el-tag size="mini" v-if="data._id">{{dataFormat(data)}}</el-tag>
            <div v-else>
              {{dataFormat(data)}}
            </div>
          </div>
          <i @click="refresh" class="el-icon-refresh pointer"></i>
        </div>
        <div style="height:50vh;overflow:hidden">
          <my-table v-if="!loadingText && dialogVisible" height="50vh" index border highlight-current-row @current-change="handleCurrentChange" size="mini" :thead="thead" :data.sync="tableData">
            <div slot="header" style="padding:10px 0">
              <my-form width="25%" size="mini">
                <div class="flex ac jb">
                  <my-form-item v-model="companyName" label="公司名称"></my-form-item>
                  <my-form-item v-model="companyNick"  label="公司简称"></my-form-item>
                  <my-form-item  v-model="companyType" select label="公司类型" :options="field.Company.type.option"></my-form-item>
                  <el-button type="primary" icon="el-icon-search" size="mini" @click="getTableData">搜索</el-button>
                </div>
              </my-form>
            </div>
            <div v-if="scope.prop === 'type'" slot-scope="scope">
              {{typeFormat(scope.row.type)}}
            </div>
          </my-table>
        </div>
        <div class="flex ac tr" style="margin-top:15px">
          <el-button type="danger" icon="el-icon-close" size="mini" @click="dialogVisible=false">关闭</el-button>
          <div class="f1"></div>
          <el-button type="success" icon="el-icon-check" size="mini" @click="sure">确认选择</el-button>
        </div>
      </loading-box>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "选择公司"
    },
    mutil: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: 10
    },
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      loadingText: "",
      thead: {
        code: "代码",
        name: "名称",
        nick: "简称",
        type: {
          name: "类型",
          slot: true
        }
      },
      tableData: [],
      companyName: "",
      companyNick: "",
      companyType: ""
    };
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.getTableData();
      }
    }
  },
  methods: {
    refresh() {
      this.companyName = "";
      this.companyNick = "";
      this.companyType = "";
      this.getTableData();
    },
    async getTableData() {
      this.loadingText = "加载中";
      try {
        this.tableData = [];
        let option = {};
        if (this.companyName) {
          option.name = {
            $regex: this.companyName
          };
        }
        if (this.companyNick) {
          option.nick = {
            $regex: this.companyNick
          };
        }
        if (this.companyType) {
          option.type = {
            $in: [this.companyType]
          };
        }
        this.tableData = await this.$ajax.post("/company/find", {
          limit: 0,
          ...option
        });
      } catch (error) {}
      this.loadingText = "";
    },
    typeFormat(type) {
      let res = [];
      type.forEach(item => {
        res.push(this.field.Company.type.option[item]);
      });
      if (res.length === 0) {
        return "-";
      }
      return res.join("、");
    },
    dataFormat(data) {
      if (!data._id) {
        return "未选择";
      }
      return data.nick || data.name || data.code;
    },
    handleCurrentChange(val) {
      this.$emit("update:data", val);
    },
    sure() {
      this.dialogVisible = false;
      this.$emit("change", this.data);
    }
  }
};
</script>

<style scoped>
</style>