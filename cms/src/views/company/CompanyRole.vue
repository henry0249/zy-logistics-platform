<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>角色管理</strong>
        </div>
        <common-alert style="margin:15px 0">公司角色</common-alert>
        <Role v-if="!loadingText" :startData="roleStartData" :data.sync="roleArr" :removeList.sync="removeList"></Role>
      </div>
      <div class="tr jb" style="margin-top:30px">
        <div>
          <el-button size="small" @click="back()">返 回</el-button>
        </div>
        <el-button size="small" type="primary" @click="sub">修 改</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  import Role from '../common/CommonCompanyRole.vue';
  export default {
    components: {
      Role
    },
    data() {
      return {
        loadingText: '',
        removeList: [],
        roleArr: [],
        roleStartData: [],
        type: {
          companyAdmin: '公司管理员',
          broker: '经纪人', //公司经纪人,区域划分,有提成信息
          salesman: '业务员', //审核修改订单信息
          salesmanManager: '业务经理', //审核修改订单信息
          tradeClerk: '贸易文员', //添加物流链
          dispatcher: '调度专员', //添加物流链,提交配送,确认配送完成
          dispatcherManager: '调度经理', //审核物流单
          logisticsClerk: '物流文员', //审核物流单
          documentClerk: '单据文员', //编辑贸易链和物流链结算相关
          documentClerkManager: '单据主管', //审核单据文员操作
          financial: '财务文员', //财务预审 ,按贸易链关系归集结算
          settle: '结算专员', //打款操作
          financialManager: '财务经理', //流水审核
          cashier: '出纳专员',
          invoiceCleck: '发票专员',
        },
      }
    },
    watch: {
      company: {
        handler(val) {
          // this.getRole();
          this.$router.push({
            path: '/company/edit'
          })
        },
        deep: true
      }
    },
    methods: {
      async getRole() {
        let data = [];
        for (const key in this.type) {
          if (this.type.hasOwnProperty(key)) {
            data.push(key);
          }
        }
        try {
          this.loadingText = '加载中...';
          this.roleStartData = await this.$api.company.getRole({
            limit: 0,
            type: {
              $in: data
            },
            company: this.company._id,
            populate: [{
              path: "user"
            }, {
              path: "area"
            }]
          });
        } catch (error) {}
        this.loadingText = '';
      },
      confirmation() {
        let returnIo = true;
        for (let index = 0; index < this.roleArr.length; index++) {
          if (this.roleArr[index].type !== 'companyAdmin' && this.roleArr[index].area.length === 0 && this.type[this.roleArr[index].type]) {
            this.$message.warn(`${this.field.Role.type.option[this.roleArr[index].type]}地区不能为空`);
            return returnIo = false;
          }
        }
        return returnIo;
      },
      async sub() {
        if (this.confirmation()) {
          try {
            this.loadingText = '修改中...';
            for (let index = 0; index < this.removeList.length; index++) {
              let delRole = await this.$api.company.deleteRole({
                _id: this.removeList[index],
              })
            }
            let data = [];
            this.roleArr.forEach(item => {
              let obj = {};
              let area = [];
              item.area.forEach(areaItem => {
                area.push(areaItem._id);
              });
              obj = JSON.parse(JSON.stringify(item));
              this.$set(obj, 'area', area);
              this.$set(obj, 'user', item.user._id);
              if (!obj._id) {
                this.$set(obj, 'company', this.company._id);
              }
              data.push(obj);
            });
            let res = await this.$api.company.roleMulti(data);
          } catch (error) {}
          this.loadingText = '';
          await this.getRole();
        }
      }
    },
    created() {
      this.getRole();
    }
  }
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