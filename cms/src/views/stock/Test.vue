<template>
  <loading-box v-model="loadingText">
    <div class="flex jb" style="padding:15px 3%;width:100%">
      <div style="width:30%">
        <div class="flex ac jb">
          <div class="blue">
            <i class="el-icon-menu el-icon--right"></i>当前库存
          </div>
          <div class="info">
            <i class="el-icon-time el-icon--right"></i>更新于<span style="color:#ccc">{{updateAt|formatTime}}</span>
          </div>
        </div>
        <div class="flex ac jb" style="line-height:130px;padding:0px 10%">
          <div>
            <el-tooltip effect="dark" content="损耗" placement="top">
              <i class="el-icon-remove-outline danger pointer" style="font-size:18px"></i>
            </el-tooltip>
          </div>
          <div class="info f1 tc" style="font-size:70px">
            111
          </div>
          <div>
            <el-tooltip effect="dark" content="增益" placement="top">
              <i class="el-icon-circle-plus-outline success pointer" style="font-size:18px"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="flex ac jb" style="padding:0 1px">
          <div class="line"></div>
          <div class="pointer blue">入库</div>
          <div class="line"></div>
          <div class="pointer danger">出库</div>
          <div class="line"></div>
          <div class="pointer warning">盘点</div>
          <div class="line"></div>
        </div>
        <el-alert :title="company.name" type="info" center style="margin:25px 0" :closable="false">
        </el-alert>
        <div class="flex ac jb">
          <div class="info"><i class="el-icon-date el-icon--right"></i>库存变化记录</div>
          <div></div>
          <div>
            <el-select v-model="historyType" placeholder="请选择" size="mini">
              <el-option v-for="item in historyTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div style="width:67%">
        <div style="width:100%;height:300px;margin: 0 auto">
          <chart style="width:100%;height:100%" :options="options"></chart>
        </div>
      </div>
    </div>
    <div>
      <common-table :path="path" :thead="thead" height="100vh - 390px" style="padding:0 3%">

      </common-table>
    </div>
  </loading-box>
</template>

<script>
export default {
  data() {
    return {
      loadingText: "",
      updateAt: new Date(),
      historyType: "week",
      historyTypeOptions: [
        {
          value: "week",
          label: "最近一周"
        },
        {
          value: "month",
          label: "最近一月"
        },
        {
          value: "quarter",
          label: "最近一季度"
        },
        {
          value: "year",
          label: "最近一年"
        }
      ],
      options: {
        // title: {
        //   text: "堆叠区域图"
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          left: "center",
          data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "2%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "邮件营销",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {}
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "联盟广告",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {}
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "视频广告",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {}
            },
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "直接访问",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {}
            },
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "搜索引擎",
            type: "line",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: {
              normal: {}
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      },
      path: "/stock/find",
      thead: {
        type: {
          name: "变化类型",
        },
        num: {
          name: "数量",
        },
        new: {
          name: "操作后库存",
        },
        dv: {
          name: "差值",
        },
        createdAt: {
          name: "操作日期",
        }
      }
    };
  }
};
</script>

<style scoped>
.line {
  height: 20px;
  width: 1px;
  background: #ccc;
}
</style>