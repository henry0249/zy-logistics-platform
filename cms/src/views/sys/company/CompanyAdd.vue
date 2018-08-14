<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>添加公司</strong>
        </div>
        <common-alert style="margin:15px 0">公司信息</common-alert>
        <company-edmit-item v-if="!loadingText" type="add" v-model="loadingText" :data.sync="companyArr"></company-edmit-item>
        <common-alert style="margin:15px 0">公司角色</common-alert>
        <company-role v-if="!loadingText" type="add" :data.sync="roleObj" :showData.sync="show"></company-role>
        <common-alert style="margin:15px 0">车船信息</common-alert>
        <company-ship v-if="!loadingText" type="add" :isLogistics="isLogistics" :data.sync="shipObj"></company-ship>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        <el-button :disabled="disabled" size="small" type="primary" @click="sub">添 加</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
import CompanyEdmitItem from "./CompanyEdmitItem.vue";
import CompanyRole from "./CompanyRole.vue";
import CompanyShip from "./CompanyShip.vue";
export default {
  components: {
    CompanyEdmitItem,
    CompanyRole,
    CompanyShip
  },
  data() {
    return {
      loadingText: "",
      show: true,
      disabled: true,
      isLogistics: false,
      companyArr: {},
      roleObj: {
        admin: [],
        salesman: [],
        finishCheck: [],
        financial: [],
        documentClerk: []
      },
      shipObj: {
        ship: [],
        truck: []
      }
    };
  },
  watch: {
    roleObj: {
      handler(val) {
      },
      deep: true
    },
    companyArr: {
      handler(val) {
        this.disabled = false;
        val.type.forEach(item => {
          if (item === "logistics") {
            this.isLogistics = true;
          }
        });
      },
      deep: true
    }
  },
  methods: {
    async sub() {
      let isSuccess = true;
      if (this.confirmation()) {
        try {
          this.loadingText = "添加中";
          let companyOp = {
            model: "company",
            curdType: "set",
            name: this.companyArr.name,
            nick: this.companyArr.nick,
            code: this.companyArr.code,
            mobile: this.companyArr.mobile,
            tel: this.companyArr.tel,
            type: this.companyArr.type,
            self: this.companyArr.self,
            areaInfo: this.companyArr.areaInfo,
            area: this.companyArr.area._id
          };
          if (this.companyArr.businessRelationCompany.length > 0) {
            companyOp.businessRelationCompany = [];
            this.companyArr.businessRelationCompany.forEach(item => {
              companyOp.businessRelationCompany.push(item._id);
            });
          } else {
            delete companyOp.businessRelationCompany;
          }
          let res = await this.$api.curd(companyOp);
          if (res) {
            for (const key in this.roleObj) {
              for (let index = 0; index < this.roleObj[key].length; index++) {
                let addrole = await this.$api.curd({
                  model: "role",
                  curdType: "set",
                  user: this.roleObj[key][index]._id,
                  company: res._id,
                  type: key
                });
                if (!addrole) {
                  isSuccess = false;
                }
              }
            }
            for (const key in this.shipObj) {
              if (this.shipObj[key].length > 0) {
                for (let index = 0; index < this.shipObj[key].length; index++) {
                  let shipAdd = await this.$api.curd({
                    model: key,
                    curdType: "set",
                    no: this.shipObj[key][index].no,
                    owner: this.shipObj[key][index].owner,
                    type: this.shipObj[key][index].type,
                    company: res._id
                  });
                  if (!shipAdd) {
                    isSuccess = false;
                  }
                }
              }
            }
          } else {
            isSuccess = false;
          }
        } catch (error) {}
        this.loadingText = "";
        if (isSuccess) {
          this.$alert("添加成功！", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.$router.go(-1);
            }
          });
        } else {
          this.$confirm("添加失败", "提示", {
            confirmButtonText: "继续添加",
            cancelButtonText: "返回列表",
            type: "warning"
          })
            .then(() => {
              this.$router.go(0);
            })
            .catch(() => {
              this.$router.go(-1);
            });
        }
      }
    },
    myAlert(str) {
      this.$alert(str, "提示", {
        confirmButtonText: "确定"
      });
    },
    confirmation() {
      let returnIo = true;
      let roleKey = {
        admin: "管理员",
        salesman: "业务专员",
        finishCheck: "完成审核员",
        financial: "财务文员",
        documentClerk: "单据文员"
      };
      let str = "";
      for (const key in roleKey) {
        if (this.roleObj[key].length === 0) {
          str += roleKey[key] + "、";
        }
      }
      if (!this.companyArr.name) {
        this.myAlert("公司名称不能为空");
        returnIo = false;
      } else if (!this.companyArr.nick) {
        this.myAlert("公司别称不能为空");
        returnIo = false;
      } else if (!this.companyArr.area._id) {
        this.myAlert("公司地区不能为空");
        returnIo = false;
      } else if (str) {
        this.myAlert(`最少选择一名${str.substr(0, str.length - 1)}`);
        returnIo = false;
      }
      // else if (this.isLogistics) {
      //   if (this.shipObj.ship.length === 0) {
      //     this.myAlert("最少有一条船");
      //     returnIo = false;
      //   } else if (this.shipObj.ship.length === 0) {
      //     this.myAlert("最少有一辆车");
      //     returnIo = false;
      //   }
      // }
      return returnIo;
    }
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