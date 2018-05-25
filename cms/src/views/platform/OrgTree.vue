<template>
  <loading-box class="g-container" v-model="loadingText">
    <div style="width:75%;height:600px;margin: 0 auto">
      <chart style="width:100%;height:100%" :options="options"></chart>
    </div>
    <div style="width:75%;margin: 0 auto">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <el-tree class="filter-tree" :data="data" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree" :expand-on-click-node="false">
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <div>{{ node.label }}</div>
          <div v-if="!data.root">
            <el-button v-if="data.user || data.company || data.companyUser" @click="() => addNode(data)" icon="el-icon-plus" type="text" size="mini">
              添加
            </el-button>
            <el-button style="color:#F56C6C" v-if="!(data.user || data.company || data.companyUser)" @click="() => removeNode(data)" icon="el-icon-delete" type="text" size="mini">
              删除{{data.user}}
            </el-button>
          </div>
        </div>
      </el-tree>
    </div>
    <el-dialog width="35%" :title="'添加'+field.Company.type.option[addType]" :visible.sync="companyDialogTableVisible">
      <el-form ref="form" :model="companyForm" label-width="80px" size="small">
        <el-form-item label="类型">
          {{field.Company.type.option[addType]}}
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="companyForm.name"></el-input>
        </el-form-item>
        <el-form-item label="自营">
          <el-switch v-model="companyForm.self"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="companyFormSubmit">立即创建</el-button>
          <el-button @click="companyDialogTableVisible= false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="addType" :visible.sync="userDialogTableVisible">
      即将开放此功能
    </el-dialog>
  </loading-box>
</template>

<script>
export default {
  data() {
    return {
      loadingText: "",
      options: {
        title: {
          text: "平台架构图",
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove"
        },
        series: [
          {
            type: "tree",
            // expandAndCollapse: false,
            initialTreeDepth: 2,
            data: [],
            // layout:'radial',
            // top: "1%",
            left: "20%",
            right: "25%",
            // bottom: "1%",
            symbolSize: 7,
            label: {
              normal: {
                position: "left",
                verticalAlign: "middle",
                align: "right",
                fontSize: 12
              }
            },
            leaves: {
              label: {
                normal: {
                  position: "right",
                  verticalAlign: "middle",
                  align: "left"
                }
              }
            }
            // expandAndCollapse: true,
            // animationDuration: 550,
            // animationDurationUpdate: 750
          }
        ]
      },
      data: [],
      filterText: "",
      defaultProps: {
        children: "children",
        label: "name"
      },
      companyDialogTableVisible: false,
      userDialogTableVisible: false,
      addType: "",
      companyForm: {
        name: "",
        self: false
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    async getTreeData() {
      this.loadingText = "加载中...";
      try {
        let res = await this.$ajax.post("/platform/orgTree", {
          _id: this.platform._id
        });
        this.data = [res];
        this.options.series[0].data = this.data;
      } catch (error) {}
      this.loadingText = "";
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    addNode(data) {
      this.addType = data.type;
      console.log(data);
      if (data.company) {
        this.companyDialogTableVisible = true;
      } else if (data.user) {
        this.userDialogTableVisible = true;
      } else {
        this.$confirm(`无效的操作`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: false,
          type: "warning",
          center: true
        });
      }
    },
    removeNode(data) {
      this.$confirm(`即将开放此功能`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showCancelButton: false,
        type: "warning",
        center: true
      });
    },
    async companyFormSubmit() {
      if (!this.companyForm.name) {
        this.$message.error("公司名称不能为空!");
        return;
      }
      if (!this.platform._id) {
        this.$message.error("未找到平台!");
        return;
      }
      this.loadingText = "正在添加公司";
      this.companyDialogTableVisible = false;
      try {
        await this.$ajax.post("/company/set", {
          ...this.companyForm,
          platform: this.platform._id,
          type: [this.addType],
          vd: {
            name: this.companyForm.name
          }
        });
        this.$message.success("成功添加公司!");
        this.companyForm.name = "";
        this.companyForm.self = false;
        await this.getTreeData();
      } catch (error) {}
      this.loadingText = "";
    }
  },
  mounted() {
    this.getTreeData();
  }
};
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>