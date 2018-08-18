<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>公司详情</strong>
        </div>
        <common-alert style="margin:15px 0">公司信息</common-alert>
        <company-edmit-item v-if="!loadingText" v-model="loadingText" :data.sync="companyArr" :startData="startCompanyArr"></company-edmit-item>
        <common-alert style="margin:15px 0">公司角色</common-alert>
        <common-company-role v-if="!loadingText" :startData="roleStartData" :data.sync="roleArr" :removeList="removeList"></common-company-role>
        <common-alert style="margin:15px 0">{{isLogistics?'车船信息':'车船信息 (该公司不是物流公司，无车船信息)'}}</common-alert>
        <company-ship v-if="!loadingText&&isLogistics" :startData="startShipObj" :removeObj.sync="shipRemoveObj" :isLogistics="isLogistics" :data.sync="shipObj"></company-ship>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        <el-button size="small" type="primary" @click="sub">修 改</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  import CompanyEdmitItem from "./CompanyEdmitItem.vue";
  import CommonCompanyRole from "../../common/CommonCompanyRole.vue";
  import CompanyShip from "./CompanyShip.vue";
  export default {
    components: {
      CompanyEdmitItem,
      CompanyShip,
      CommonCompanyRole
    },
    data() {
      return {
        loadingText: "",
        disabled: true,
        show: true,
        roleIo: false,
        shipIo: false,
        isLogistics: false,
        companyArr: {},
        roleStartData: [],
        roleArr: [],
        removeList: [],
        startCompanyArr: {},
        roleStartDate: {},
        startRoleObj: {
          admin: [],
          salesman: [],
          beforeDispatchCheck: [],
          dispatcher: [],
          beforeSettleCheck: [],
          financial: [],
          documentClerk: []
        },
        haveRole: [],
        roleObj: {},
        shipObj: {},
        startShipObj: {},
        removeData: {},
        shipRemoveObj: {}
      };
    },
    watch: {
      companyArr: {
        handler(val, oldVal) {
          if (val.type.length > 0) {}
          this.disabled = false;
        },
        deep: true
      },
      shipObj: {
        handler(val) {
          console.log("shipObj", val);
          this.disabled = false;
          this.shipIo = true;
        },
        deep: true
      },
      show(val) {
        this.disabled = val;
      }
    },
    methods: {
      myAlert(str) {
        this.$message.warn(str);
        // this.$alert(str, "提示", {
        //   confirmButtonText: "确定"
        // });
      },
      confirmation() {
        let returnIo = true;
        if (!this.companyArr.name) {
          this.myAlert("公司名称不能为空");
          returnIo = false;
        } else if (!this.companyArr.nick) {
          this.myAlert("公司别称不能为空");
          returnIo = false;
        } else if (!this.companyArr.area._id) {
          this.myAlert("公司地区不能为空");
          returnIo = false;
        }else if (!(/^1[34578]\d{9}$/.test(this.companyArr.mobile))) {
          this.myAlert("手机号码格式不正确！");
          returnIo = false;
        }else if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(this.companyArr.tel)) {
          this.myAlert("公司固话格式不正确！");
          returnIo = false;
        }
        return returnIo;
      },
      async sub() {
        if (this.confirmation()) {
          try {
            this.loadingText = "更新中";
            let companyOp = JSON.parse(JSON.stringify(this.companyArr));
            delete companyOp._id;
            let company = await this.$api.curd({
              model: "company",
              curdType: "update",
              find: {
                _id: this.$route.params._id
              },
              update: companyOp
            });
            console.log('111');
            for (let index = 0; index < this.removeList.length; index++) {
              let delRole = await this.$api.curd({
                model: 'role',
                curdType: 'delete',
                _id: this.removeList[index]
              })
            }
            console.log('2222');
            for (let index = 0; index < this.roleArr.length; index++) {
              if (!this.roleArr[index]._id) {
                console.log(index);
                console.log(this.roleArr[index].type);
                let setRole = await this.$api.curd({
                  model: 'role',
                  curdType: 'set',
                  company: this.$route.params._id,
                  type: this.roleArr[index].type,
                  user: this.roleArr[index].user._id
                })
              }
            }
            for (const key in this.shipObj) {
              let updateArr = [];
              let data = JSON.parse(JSON.stringify(this.data[key]));
              if (this.data[key].length > 0) {
                for (let n = 0; n < this.data[key].length; n++) {
                  for (let index = 0; index < this.shipObj[key].length; index++) {
                    if (this.shipObj[key][index]._id === this.data[key][n]._id) {
                      updateArr.push(this.data[key][n]);
                    }
                  }
                }
                if (updateArr.length > 0) {
                  for (let index = 0; index < updateArr.length; index++) {
                    for (let i = 0; i < this.shipObj[key].length; i++) {
                      if (this.shipObj[key][i]._id === updateArr[index]._id) {
                        let res = await this.$api.curd({
                          model: key,
                          curdType: "update",
                          find: {
                            _id: this.shipObj[key][i]._id
                          },
                          update: {
                            name: this.shipObj[key][i].name,
                            no: this.shipObj[key][i].no,
                            owner: this.shipObj[key][i].owner,
                            type: this.shipObj[key][i].type
                          }
                        });
                      }
                    }
                  }
                  let delArr = [];
                  let copyData = JSON.parse(JSON.stringify(this.data[key]));
                  copyData.forEach((dataItem, index) => {
                    let delIo = false;
                    updateArr.forEach((upItem, i) => {
                      if (upItem._id === dataItem._id) {
                        delIo = true;
                        return;
                      }
                    });
                    if (delIo) {
                      copyData.splice(index, 1);
                    }
                  });
                  if (copyData.length > 0) {
                    for (let i = 0; i < copyData.length; i++) {
                      let delShip = await this.$ajax.post(
                        "/" + key + "/delete?_id=" + copyData[i]._id
                      );
                    }
                  }
                } else {
                  if (this.data[key].length > 0) {
                    for (let index = 0; index < this.data[key].length; index++) {
                      let res = await this.$ajax.post(
                        "/" + key + "/delete?_id=" + this.data[key][index]._id
                      );
                    }
                  }
                }
                for (let index = 0; index < this.shipObj[key].length; index++) {
                  if (!this.shipObj[key][index]._id) {
                    let addShip = await this.$api.curd({
                      model: key,
                      curdType: "set",
                      name: this.shipObj[key][index].name,
                      no: this.shipObj[key][index].no,
                      owner: this.shipObj[key][index].owner,
                      type: this.shipObj[key][index].type,
                      company: this.$route.params._id
                    });
                  }
                }
              } else {
                if (this.shipObj[key].length > 0) {
                  for (let index = 0; index < this.shipObj[key].length; index++) {
                    let res = await this.$api.curd({
                      model: key,
                      curdType: "set",
                      name: this.shipObj[key][index].name,
                      no: this.shipObj[key][index].no,
                      owner: this.shipObj[key][index].owner,
                      type: this.shipObj[key][index].type,
                      company: this.$route.params._id
                    });
                  }
                }
              }
            }
            this.$message.success("更新成功！");
            this.$router.push({
              path: "/sys/company"
            });
          } catch (error) {
            console.log(error);
          }
          this.loadingText = "";
        }
      },
      async getCompany() {
        try {
          this.startCompanyArr = await this.$api.curd({
            model: "company",
            curdType: "findOne",
            _id: this.$route.params._id,
            populate: [{
                path: "area",
                populate: [{
                  path: 'province'
                },
                {
                  path: 'county'
                },{
                  path: 'city'
                }]
              },
              {
                path: "businessRelationCompany"
              }
            ]
          });
          this.startCompanyArr.type.forEach(item => {
            if (item === "logistics") {
              this.isLogistics = true;
            }
          });
        } catch (error) {}
      },
      async getRole() {
        try {
          this.roleStartData = await this.$api.curd({
            model: "role",
            curdType: "find",
            limit: 0,
            company: this.$route.params._id,
            populate: [{
              path: "user"
            }]
          });
        } catch (error) {}
      },
      async getTruc() {
        try {
          let truckData = await this.$api.curd({
            model: "truck",
            curdType: "find",
            limit: 0,
            company: this.$route.params._id,
            populate: [{
              path: "owner"
            }]
          });
          if (truckData.length > 0) {
            let data = [];
            truckData.forEach(item => {
              data.push(item._id);
            });
            this.$set(this.startShipObj, "truck", truckData);
          } else {
            this.$set(this.startShipObj, "truck", []);
          }
        } catch (error) {}
      },
      async getShip() {
        try {
          let shipData = await this.$api.curd({
            model: "ship",
            curdType: "find",
            limit: 0,
            company: this.$route.params._id,
            populate: [{
              path: "owner"
            }]
          });
          if (shipData.length > 0) {
            let data = [];
            shipData.forEach(item => {
              data.push(item._id);
            });
            this.$set(this.startShipObj, "ship", shipData);
          } else {
            this.$set(this.startShipObj, "ship", []);
          }
        } catch (error) {}
      },
      test() {
        console.log(this.companyArr);
      }
    },
    async created() {
      this.loadingText = "加载中";
      await this.getCompany();
      await this.getRole();
      await this.getTruc();
      await this.getShip();
      this.data = JSON.parse(JSON.stringify(this.startShipObj));
      this.loadingText = "";
    }
  };
</script>

<style scoped>
  .g-order-create {
    padding: 3% 5%;
  }
  .g-order {
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>