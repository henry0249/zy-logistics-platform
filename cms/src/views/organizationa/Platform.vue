<template>
  <loading-box class="g-container" v-model="loadingText">
    <div v-if="!platform" class="no-platform">
      <div v-if="!loadingText">
        <div>
          <icon size="30vw">meiyoushuju</icon>
        </div>
        <div style="margin-bottom:20px">
          没有找到平台数据
        </div>
        您可以
        <div v-ripple class="platform-init" @click="init">
          快速初始化
        </div>或
        <a class="platform-back" @click="$router.push('/home')">
                  返回主页
                </a>
      </div>
    </div>
    <div v-else>
      <div>
        <chart style="width:80%;height:600px;margin:0 auto" :options="options"></chart>
      </div>
      <!-- {{platform}} -->
    </div>
  </loading-box>
</template>

<script>
export default {
  data() {
    return {
      loadingText: "",
      platform: "",
      activeIndex: "1",
      options: {

        tooltip: {
          trigger: "item",
          triggerOn: "mousemove"
        },
        // grid:{
        //   containLabel:true,
        //   left:'10%'
        // },
        series: [
          {
            type: "tree",
            data: [],
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
  },
  methods: {
    init() {
      this.$prompt("请输入平台名称", "初始化平台以便进行管理", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "请输入平台名称",
        inputPattern: /^[\u4E00-\u9FA5\uF900-\uFA2D\w]+$/,
        inputErrorMessage: "平台名称不能为空"
      }).then(async ({ value }) => {
        this.loadingText = "正在初始化";
        try {
          this.platform = await this.$api.curd({
            model: "company",
            curdType: "set",
            name: value,
            isPlatform: true,
            vd: {
              name: value
            }
          });
        } catch (error) {}
        this.loadingText = "";
      });
    },
    getSubCompany(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  async created() {
    this.loadingText = "加载中";
    let populate = [
      {
        path: "creater"
      },
      {
        path: "owner"
      },
      {
        path: "admin"
      },
      {
        path: "salesman"
      },
      {
        path: "auditor"
      },
      {
        path: "financial"
      },
      {
        path: "dispatcher"
      }
    ];
    try {
      this.platform = await this.$api.curd({
        model: "company",
        curdType: "findOne",
        isPlatform: true,
        populate: populate
      });
      let serieData = [];
      serieData.push({
        name: this.platform.name,
        children: []
      });
      let subCompany = [
        {
          name: "物流公司",
          type: "logistics"
        },
        {
          name: "发货厂商",
          type: "shipper"
        },
        {
          name: "贸易公司",
          type: "trading"
        }
      ];
      let subUser = [
        {
          name: "负责人",
          key: "owner"
        },
        {
          name: "管理员",
          key: "admin"
        },
        {
          name: "业务员",
          key: "salesman"
        },
        {
          name: "审核员",
          key: "auditor"
        },
        {
          name: "财务员",
          key: "financial"
        }
      ];
      for (let i = 0; i < subCompany.length; i++) {
        let item = subCompany[i];
        let pushItem = {
          name: item.name,
          children: []
        };
        pushItem.children = await this.$api.curd({
          model: "company",
          curdType: "find",
          platform: this.company._id,
          type: {
            in: [item.type]
          },
          populate: populate
        });
        for (let j = 0; j < subUser.length; j++) {
          let subUserItem = subUser[j];
          let subUserPushItem = {
            name: subUserItem.name,
            children: []
          };
          pushItem.children.forEach(companyItem => {
            if (companyItem[subUserItem.key]) {
              if (companyItem[subUserItem.key] instanceof Array) {
                companyItem[subUserItem.key].forEach(companyItemItem => {
                  subUserPushItem.children.push({
                    name: companyItemItem.name || companyItemItem.mobile
                  });
                });
              } else {
                subUserPushItem.children.push({
                  name:
                    companyItem[subUserItem.key].name ||
                    companyItem[subUserItem.key].mobile
                });
              }
            }
          });
          pushItem.children.push(subUserPushItem);
        }
        serieData[0].children.push(pushItem);
      }

      for (let i = 0; i < subUser.length; i++) {
        let item = subUser[i];
        let pushItem = {
          name: item.name,
          children: []
        };
        if (this.platform[item.key]) {
          if (this.platform[item.key] instanceof Array) {
            this.platform[item.key].forEach(userItem => {
              pushItem.children.push({
                name: userItem.name || userItem.mobile
              });
            });
          } else {
            console.log(this.platform[item.key]);
            pushItem.children.push({
              name:
                this.platform[item.key].name || this.platform[item.key].mobile
            });
          }
        }
        serieData[0].children.push(pushItem);
      }
      this.options.series[0].data = serieData;
    } catch (error) {}
    this.loadingText = "";
  }
};
</script>

<style scoped>
.no-platform {
  margin: 0 auto;
  text-align: center;
}
.platform-init {
  margin-top: 20px;
  margin: 0 10px;
  display: inline-block;
  padding: 10px 15px;
  text-align: center;
  border-radius: 3px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
  color: #fff;
  background: #ef5350;
  cursor: pointer;
}
.platform-back {
  color: #aaa;
  margin-top: 15px;
  /* font-size: 10px; */
  cursor: pointer;
  color: #2196f3;
}
</style>