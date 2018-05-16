<template>
  <div class="g-org-tree">
    <chart style="width:100%;height:100%" :options="options"></chart>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove"
        },
        series: [
          {
            type: "tree",
            data: [
              {
                name: "中源物流平台",
                children: [
                  {
                    name: "物流公司",
                    children: [
                      {
                        name: "负责人"
                      },
                      {
                        name: "管理人员"
                      },
                      {
                        name: "业务专员"
                      },
                      {
                        name: "财务文员"
                      }
                    ]
                  },
                  {
                    name: "发货厂商",
                    children: [
                      {
                        name: "负责人"
                      },
                      {
                        name: "管理人员"
                      },
                      {
                        name: "业务专员"
                      },
                      {
                        name: "财务文员"
                      }
                    ]
                  },
                  {
                    name: "贸易公司",
                    children: [
                      {
                        name: "负责人"
                      },
                      {
                        name: "管理人员"
                      },
                      {
                        name: "业务专员"
                      },
                      {
                        name: "财务文员"
                      }
                    ]
                  },
                  {
                    name: "平台负责人"
                  },
                  {
                    name: "平台管理员",
                    children: []
                  },
                  {
                    name: "平台业务员",
                    children: []
                  },
                  {
                    name: "平台调度员",
                    children: []
                  },
                  {
                    name: "平台财务员",
                    children: []
                  }
                ]
              }
            ],
            // layout:'radial',
            // top: "1%",
            // left: "12%",
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
      }
    };
  }
};
</script>

<style scoped>
.g-org-tree {
  height: 100%;
  width: 100%;
  margin:0 auto
}
</style>