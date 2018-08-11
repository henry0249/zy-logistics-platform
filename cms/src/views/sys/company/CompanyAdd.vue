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
        loadingText: '',
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
        },
      }
    },
    watch: {
      companyArr: {
        handler(val) {
          this.disabled = false;
          val.type.forEach(item => {
            if (item === 'logistics') {
              this.isLogistics = true;
            }
          });
        },
        deep: true
      }
    },
    methods: {
      sub() {
        if (this.confirmation()) {

        }else {
          console.log('1111');
        }
      },
      myAlert(str) {
        this.$alert(str, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            return false
          }
        });
      },
      confirmation() {
        if (!this.companyArr.name) {
          this.myAlert('公司名称不能为空');
          return false
        }
        if (!this.companyArr.nick) {
          this.myAlert('公司别称不能为空');
          return false
        }
        if (!this.companyArr.area) {
          this.myAlert('公司地区不能为空');
          return false
        }
        let roleKey = {
          admin: '管理员',
          salesman: '业务专员',
          finishCheck: '完成审核员',
          financial: '财务文员',
          documentClerk: '单据文员',
        };
        let str = '';
        for (const key in roleKey) {
          if (this.roleObj[key].length === 0) {
            str += roleKey[key] + '、';
          }
        }
        if (str) {
          this.myAlert(`最少选择一名${str.substr(0,str.length -1)}`);
          return false
        }
        if (this.isLogistics) {
          if (this.shipObj.ship.length === 0) {
            this.myAlert('最少有一条船');
            return false
          } else if (this.shipObj.ship.length === 0) {
            this.myAlert('最少有一辆车');
            return false
          }
        }
      }
    }
  }
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