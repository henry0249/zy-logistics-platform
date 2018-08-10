<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>公司详情</strong>
        </div>
        <common-alert style="margin:15px 0">公司信息</common-alert>
        <company-edmit-item v-if="!loadingText" v-model="loadingText" :show.sync="show" :data.sync="companyArr" :startData="startCompanyArr" :roleStartDate="roleStartDate" :roleArr.sync="roleArr"></company-edmit-item>
        <common-alert style="margin:15px 0">公司角色</common-alert>
        <company-role :removeData.sync="removeData" :data.sync="roleObj" :showData.sync="show"></company-role>
        <common-alert style="margin:15px 0">车船信息</common-alert>
        <company-ship></company-ship>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        <el-button :disabled="disabled" size="small" type="primary" @click="sub">修 改</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  import CompanyEdmitItem from './CompanyEdmitItem';
  import CompanyRole from './CompanyRole.vue';
  import CompanyShip from './CompanyShip.vue';
  export default {
    components: {
      CompanyEdmitItem,
      CompanyRole,
      CompanyShip
    },
    data() {
      return {
        loadingText: '',
        disabled: true,
        show: true,
        companyArr: {},
        startCompanyArr: {},
        roleStartDate: {},
        roleArr: {},
        haveRole: [],
        roleObj: {},
        removeData: {},
      }
    },
    watch: {
      show(val) {
        this.disabled = val;
      }
    },
    methods: {
      async sub() {
        console.log(this.roleObj);
        console.log(this.companyArr, this.roleArr);
        try {
          let io = true;
          let companyOp = JSON.parse(JSON.stringify(this.companyArr));
          delete companyOp._id;
          let company = await this.$api.curd({
            model: 'company',
            curdType: 'update',
            find: {
              _id: this.$route.params._id
            },
            update: companyOp
          });
          if (company) {
            let roleOp = {};
            for (const key in this.removeData) {
              if (this.removeData[key].length > 0) {
                for (let index = 0; index < this.removeData[key].length; index++) {
                  let delRole = await this.$ajax.post('/role/delete?_id=' + this.removeData[key][index]);
                }
              }
            }
            for (const key in this.roleObj) {
              for (let index = 0; index < this.roleObj[key].length; index++) {
                if (!this.roleObj[key][index].roleId) {
                  let addRole = await this.$ajax.post('/role/add',{
                    company:this.$route.params._id,
                    user:this.roleObj[key][index]._id,
                    type:key
                  })
                }
              }
            }
          } else {}
        } catch (error) {}
      },
      async getCompany() {
        try {
          this.startCompanyArr = await this.$api.curd({
            model: 'company',
            curdType: 'findOne',
            _id: this.$route.params._id,
            populate: [{
              path: 'area'
            }]
          })
        } catch (error) {}
      },
      // async getCompanyRole() {
      //   try {
      //     let res = await this.$api.curd({
      //       model: 'role',
      //       curdType: 'find',
      //       company: this.$route.params._id,
      //       populate: [{
      //         path: 'user'
      //       }]
      //     })
      //     this.roleStartDate = {
      //       admin: [],
      //       salesman: [],
      //       finishCheck: [],
      //       financial: [],
      //       documentClerk: [],
      //     }
      //     res.forEach(resItem => {
      //       if (resItem.type === admin) {
      //         this.roleStartDate.admin.push(resItem);
      //         this.haveRole.push('admin');
      //       }
      //       if (resItem.type === salesman) {
      //         this.roleStartDate.salesman.push(resItem);
      //         this.haveRole.push('salesman');
      //       }
      //       if (resItem.type === finishCheck) {
      //         this.roleStartDate.finishCheck.push(resItem);
      //         this.haveRole.push('finishCheck');
      //       }
      //       if (resItem.type === financial) {
      //         this.roleStartDate.financial.push(resItem);
      //         this.haveRole.push('financial');
      //       }
      //       if (resItem.type === documentClerk) {
      //         this.roleStartDate.documentClerk.push(resItem);
      //         this.haveRole.push('documentClerk');
      //       }
      //     });
      //   } catch (error) {}
      // }
    },
    async created() {
      this.loadingText = '加载中';
      await this.getCompany();
      // await this.getCompanyRole();
      this.loadingText = '';
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