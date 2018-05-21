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
            <el-button v-if="data.user || data.company || data.companyNode" @click="() => addNode(data)" icon="el-icon-plus" type="text" size="mini">
              添加
            </el-button>
            <el-button v-if="!(data.user || data.company)" @click="() => removeNode(data)" icon="el-icon-delete" type="text" size="mini">
              删除{{data.user}}
            </el-button>
          </div>
        </div>
      </el-tree>
    </div>
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
          series: [{
            type: "tree",
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
          }]
        },
        data: [],
        filterText: "",
        defaultProps: {
          children: "children",
          label: "name"
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
        console.log(data);
      },
      removeNode(data) {
        console.log(data);
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