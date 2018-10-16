<template>
  <loading-box v-model="loadingText" v-if="show">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>公司详情</strong>
        </div>
        <common-alert style="margin:15px 0">公司信息</common-alert>
        <company-edit-item v-if="!loadingText" v-model="loadingText" :data.sync="companyArr" :startData="startCompanyArr"></company-edit-item>
        <common-alert style="margin:15px 0">公司角色</common-alert>
        <common-company-role v-if="!loadingText" :startData="roleStartData" :data.sync="roleArr" :removeList.sync="removeList"></common-company-role>
        <common-alert style="margin:15px 0">{{isLogistics?'车船信息':'车船信息 (该公司不是物流公司，无车船信息)'}}</common-alert>
        <company-ship v-if="!loadingText&&isLogistics" :startData="startShipObj" :removeObj.sync="shipRemoveObj" :isLogistics="isLogistics" :data.sync="shipObj"></company-ship>
      </div>
      <div class="tr jb" style="margin-top:30px">
        <div>
          <el-button size="small" @click="$router.go(-1)">返 回</el-button>
          <el-button size="small" @click="goAccount">账户管理</el-button>
        </div>
        <el-button size="small" type="primary" @click="sub">修 改</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  import CompanyEditItem from "./CompanyEditItem.vue";
  import CommonCompanyRole from "../../common/CommonCompanyRole.vue";
  import CompanyShip from "./CompanyShip.vue";
  export default {
    components: {
      CompanyEditItem,
      CompanyShip,
      CommonCompanyRole
    },
    props: {
      sys: {
        type: Boolean,
        default: true
      }
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
      company: {
        async handler(val) {
          if (!this.sys) {
            this.show = false;
            this.$nextTick(() => {
              this.show = true;
            });
            if (val.type === 'logistics') {
              this.isLogistics = true;
            } else {
              this.isLogistics = false;
            }
          }
          try {
            this.loadingText = "加载中";
            await this.getCompany();
            await this.getRole();
            await this.getTruc();
            await this.getShip();
            this.data = JSON.parse(JSON.stringify(this.startShipObj));
          } catch (error) {}
          this.loadingText = "";
        },
        deep: true
      },
      companyArr: {
        handler(val, oldVal) {
          let isLogistics = false;
          val.type.forEach(item => {
            if (item === 'logistics') {
              isLogistics = true;
            }
          });
          this.isLogistics = isLogistics;
        },
        deep: true
      },
      shipObj: {
        handler(val) {
          this.disabled = false;
          this.shipIo = true;
        },
        deep: true
      },
    },
    methods: {
      goAccount() {
        let path = '/sys/company/account';
        this.$router.push({
          path,
          query:{
            company:this.startCompanyArr._id,
            parentPath:this.$route.path,
            parentName:this.$route.name
          }
        });
      },
      myAlert(str) {
        this.$message.warn(str);
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
        } else if (!(/^1[34578]\d{9}$/.test(this.companyArr.mobile))) {
          this.myAlert("手机号码格式不正确！");
          returnIo = false;
        } else if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(this.companyArr.tel)) {
          this.myAlert("公司固话格式不正确！");
          returnIo = false;
        }
        return returnIo;
      },
      async sub() {
        if (this.confirmation()) {
          try {
            let _id = this.sys ? this.$route.params._id : this.company._id;
            this.loadingText = "更新中";
            let companyOp = JSON.parse(JSON.stringify(this.companyArr));
            delete companyOp._id;
            console.log(companyOp);
            if (companyOp.businessRelationCompany.length > 0) {
              let data = [];
              companyOp.businessRelationCompany.forEach(item => {
                data.push(item._id);
              });
              this.$set(companyOp, 'businessRelationCompany', data);
            }
            if (companyOp.transportTrainsRelationCompany.length > 0) {
              let data = [];
              companyOp.transportTrainsRelationCompany.forEach(item => {
                data.push(item._id);
              });
              this.$set(companyOp, 'transportTrainsRelationCompany', data);
            }
            let company = await this.$api.curd({
              model: "company",
              curdType: "update",
              find: {
                _id
              },
              update: companyOp
            });
            for (let index = 0; index < this.removeList.length; index++) {
              let delRole = await this.$api.curd({
                model: 'role',
                curdType: 'delete',
                user: this.removeList[index],
                company: _id
              })
            }
            for (let index = 0; index < this.roleArr.length; index++) {
              if (!this.roleArr[index]._id) {
                let setRole = await this.$api.curd({
                  model: 'role',
                  curdType: 'set',
                  company: _id,
                  type: this.roleArr[index].type,
                  user: this.roleArr[index].user._id,
                  area: this.roleArr[index].area._id
                })
              } else {
                let updateOp = {
                  model: 'role',
                  curdType: 'update',
                  find: {
                    _id: this.roleArr[index]._id
                  },
                  update: {}
                };
                if (this.roleArr[index].area.length > 0) {
                  let areaData = [];
                  this.roleArr[index].area.forEach(areaItem => {
                    areaData.push(areaItem._id);
                  });
                  this.$set(updateOp, 'update', {
                    area: areaData
                  })
                  let updateRole = await this.$api.curd(updateOp);
                }
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
                      company: _id
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
                      company: _id
                    });
                  }
                }
              }
            }
            this.$message.success("更新成功！");
            if (this.sys) {
              this.$router.push({
                path: '/sys/company'
              });
            } else {
              this.show = false;
              await this.getCompany();
              await this.getRole();
              await this.getTruc();
              await this.getShip();
              this.data = JSON.parse(JSON.stringify(this.startShipObj));
              this.show = true;
            }
          } catch (error) {}
          this.loadingText = "";
        }
      },
      async getCompany() {
        let _id = this.sys ? this.$route.params._id : this.company._id;
        this.startCompanyArr = await this.$api.curd({
          model: "company",
          curdType: "findOne",
          _id: _id,
          populate: [{
              path: "area",
              populate: [{
                  path: 'province'
                },
                {
                  path: 'county'
                }, {
                  path: 'city'
                }
              ]
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
      },
      async getRole() {
        let _id = this.sys ? this.$route.params._id : this.company._id;
        this.roleStartData = await this.$api.curd({
          model: "role",
          curdType: "find",
          limit: 0,
          company: _id,
          populate: [{
            path: "user"
          }, {
            path: "area"
          }]
        });
      },
      async getTruc() {
        let _id = this.sys ? this.$route.params._id : this.company._id;
        let truckData = await this.$api.curd({
          model: "truck",
          curdType: "find",
          limit: 0,
          company: _id,
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
      },
      async getShip() {
        let _id = this.sys ? this.$route.params._id : this.company._id;
        let shipData = await this.$api.curd({
          model: "ship",
          curdType: "find",
          limit: 0,
          company: _id,
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
      },
      async getAccount() {
        this.accountData = await this.$api.curd({
          model:'account',
          curdType:'findOne',
          company:this.startCompanyArr._id
        })
      }
    },
    async created() {
      try {
        this.loadingText = "加载中";
        await this.getCompany();
        await this.getRole();
        await this.getTruc();
        await this.getShip();
        await this.getAccount();
        this.data = JSON.parse(JSON.stringify(this.startShipObj));
        this.loadingText = "";
      } catch (error) {
      }
    }
  };
</script>

<style scoped>
  .g-order-create {
    padding: 0 1% 1% 1%;
  }
  .g-order {
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>