<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>添加公司</strong>
        </div>
        <common-alert style="margin:15px 0">公司信息</common-alert>
        <company-edit-item v-if="!loadingText" type="add" v-model="loadingText" :data.sync="companyArr"></company-edit-item>
        <common-alert style="margin:15px 0">公司角色</common-alert>
        <common-company-role :data.sync="roleArr" :removeList="removeList"></common-company-role>
        <common-alert style="margin:15px 0">{{isLogistics?'车船信息':'车船信息 (该公司不是物流公司，无车船信息)'}}</common-alert>
        <company-ship v-if="!loadingText&&isLogistics" type="add" :isLogistics="isLogistics" :data.sync="shipObj"></company-ship>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        <el-button size="small" type="primary" @click="sub">添 加</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  import CompanyEditItem from "./CompanyEditItem.vue";
  import CompanyShip from "./CompanyShip.vue";
  import CommonCompanyRole from "../../common/CommonCompanyRole.vue";
  export default {
    components: {
      CompanyEditItem,
      CommonCompanyRole,
      CompanyShip
    },
    data() {
      return {
        loadingText: "",
        show: true,
        disabled: true,
        isLogistics: false,
        removeList: [],
        companyArr: {},
        roleArr: [],
        roleObj: {
          admin: [],
          salesman: [],
          beforeDispatchCheck: [],
          dispatcher: [],
          beforeSettleCheck: [],
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
      "companyArr.type" (val) {
        let io = false;
        val.forEach(item => {
          if (item === "logistics") {
            io = true;
          }
        });
        this.isLogistics = io;
      },
      roleObj: {
        handler(val) {},
        deep: true
      },
      companyArr: {
        handler(val) {
          this.disabled = false;
        },
        deep: true
      }
    },
    methods: {
      async sub() {
        this.loadingText = "添加中";
        if (this.confirmation()) {
          try {
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
            for (let index = 0; index < this.removeList.length; index++) {
              let delRole = await this.$api.curd({
                model: 'role',
                curdType: 'delete',
                _id: this.removeList[index]
              })
            }
            for (let index = 0; index < this.roleArr.length; index++) {
              let setRole = await this.$api.curd({
                model: 'role',
                curdType: 'set',
                company: res._id,
                type: this.roleArr[index].type,
                user: this.roleArr[index].user._id
              })
            }
            for (const key in this.shipObj) {
              for (let index = 0; index < this.shipObj[key].length; index++) {
                let set = await this.$api.curd({
                  model: key,
                  curdType: 'set',
                  no: this.shipObj[key][index].no,
                  owner: this.shipObj[key][index].owner._id,
                  no: this.shipObj[key][index].no,
                  company: res._id
                })
              }
            }
            this.$message.success("添加成功！");
            this.$router.go('/sys/company');
          } catch (error) {}
        }
        this.loadingText = "";
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