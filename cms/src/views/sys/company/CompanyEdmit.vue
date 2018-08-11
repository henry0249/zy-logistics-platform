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
        <company-role v-if="!loadingText" :removeData.sync="removeData" :data.sync="roleObj" :startRoleObj="startRoleObj" :showData.sync="show"></company-role>
        <common-alert style="margin:15px 0">车船信息</common-alert>
        <company-ship v-if="!loadingText" :startData="startShipObj" :removeObj.sync="shipRemoveObj" :isLogistics="isLogistics" :data.sync="shipObj"></company-ship>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        <el-button :disabled="disabled" size="small" type="primary" @click="sub">修 改</el-button>
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
      disabled: true,
      show: true,
      roleIo: false,
      shipIo: false,
      companyIo: false,
      isLogistics: false,
      companyArr: {},
      startCompanyArr: {},
      roleStartDate: {},
      startRoleObj: {
        admin: [],
        salesman: [],
        finishCheck: [],
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
        this.companyIo = true;
        this.disabled = false;
      },
      deep: true
    },
    roleObj: {
      handler(val, oldVal) {
        this.disabled = false;
        console.log("roleObj", val);
        this.roleIo = true;
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
    async sub() {
      try {
        this.loadingText = "更新中";
        let io = true;
        if (this.companyIo) {
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
          if (!company) {
            io = false;
          }
        }
        if (this.roleIo) {
          let roleOp = {};
          for (const key in this.removeData) {
            if (this.removeData[key].length > 0) {
              for (
                let index = 0;
                index < this.removeData[key].length;
                index++
              ) {
                let delRole = await this.$ajax.post(
                  "/role/delete?_id=" + this.removeData[key][index]
                );
              }
            }
          }
          for (const key in this.roleObj) {
            for (let index = 0; index < this.roleObj[key].length; index++) {
              if (!this.roleObj[key][index].roleId) {
                let addRole = await this.$ajax.post("/role/add", {
                  company: this.$route.params._id,
                  user: this.roleObj[key][index]._id,
                  type: key
                });
                if (!addRole) {
                  io = false;
                }
              }
            }
          }
        }
        if (this.shipIo) {
          console.log("1111");
          for (const key in this.shipObj) {
            console.log("2", key);
            console.log(this.data);
            for (let n = 0; n < this.data[key].length; n++) {
              console.log("3", n);
              for (let index = 0; index < this.shipObj[key].length; index++) {
                console.log("4", index);
                if (
                  this.shipObj[key][index]._id === this.data[key][n]._id
                ) {
                  console.log("5");
                  this.shipObj[key].splice(index, 1);
                  this.data[key].splice(n, 1);
                }
              }
              if (this.data[key].length > 0) {
                for (
                  let index = 0;
                  index < this.data[key].length;
                  index++
                ) {
                  let addShip = await this.$api.curd({
                    model: key,
                    curdType: "set",
                    name: this.data[key][index].name,
                    no: this.data[key][index].no,
                    owner: this.data[key][index].owner,
                    type: this.data[key][index].type,
                    company: this.$route.params._id
                  });
                }
              }
              if (this.shipObj[key].length > 0) {
                for (let index = 0; index < this.shipObj[key].length; index++) {
                  let res = await this.$api.curd({
                    model: key,
                    curdType: "update",
                    find: {
                      _id: this.shipObj[key][index]._id
                    },
                    update: {
                      name: this.shipObj[key][index].name,
                      no: this.shipObj[key][index].no,
                      owner: this.shipObj[key][index].owner,
                      type: this.shipObj[key][index].type
                    }
                  });
                  if (!res) {
                    io = false;
                  }
                }
              }
              if (this.shipRemoveObj[key].length > 0) {
                for (
                  let index = 0;
                  index < this.shipRemoveObj[key].length;
                  index++
                ) {
                  let del = await this.$ajax.post(
                    "/" + key + "/delete?_id=" + this.shipRemoveObj[key][index]
                  );
                  if (!del) {
                    io = false;
                  }
                }
              }
            }
          }
        }
        if (!io) {
          this.$confirm("更新失败", "提示", {
            confirmButtonText: "继续更新",
            cancelButtonText: "返回",
            type: "warning"
          })
            .then(() => {
              this.$router.go(0);
            })
            .catch(() => {
              this.$router.go(-1);
            });
        } else {
          this.$alert("更新成功！", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.$router.go(-1);
            }
          });
        }
      } catch (error) {}
      this.loadingText = "";
    },
    async getCompany() {
      try {
        this.startCompanyArr = await this.$api.curd({
          model: "company",
          curdType: "findOne",
          _id: this.$route.params._id,
          populate: [
            {
              path: "area"
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
        let role = await this.$api.curd({
          model: "role",
          curdType: "find",
          company: this.$route.params._id,
          populate: [
            {
              path: "user"
            }
          ]
        });
        role.forEach(roleItem => {
          for (const key in this.startRoleObj) {
            if (key === roleItem.type) {
              let obj = JSON.parse(JSON.stringify(roleItem.user));
              this.$set(obj, "roleId", roleItem._id);
              this.startRoleObj[key].push(obj);
            }
          }
        });
      } catch (error) {}
    },
    async getTruc() {
      try {
        let truckData = await this.$api.curd({
          model: "truck",
          curdType: "find",
          limit: 0,
          populate: [
            {
              path: "owner"
            }
          ]
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
          populate: [
            {
              path: "owner"
            }
          ]
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