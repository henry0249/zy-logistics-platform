<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>账户管理</strong>
        </div>
        <div class="tab-box">
          <el-tabs type="border-card">
            <el-tab-pane v-for="item in data" :key="item.id" :label="item.toCompany.name">
              <div class="col-flex tab-height">
                <div class="tab-top">
                  <span>{{field.AccountChange.type.option[item.type]}}给{{item.toCompany.name}}</span>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </loading-box>
</template>

<script>
  export default {
    props: {
      sys: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        loadingText: '',
        data: [{
          toCompany: {
            name: 'A公司'
          },
          type: 0,
          value: 10000,
        }, {
          toCompany: {
            name: 'B公司'
          },
          type: 2,
          value: 10000,
        }, {
          toCompany: {
            name: 'C公司'
          },
          type: 3,
          value: 10000,
        }]
      }
    },
    methods: {
      async sub() {},
      async getAccount() {
        try {
          let _id = this.sys ? this.$route.parmas._id : this.company._id;
          this.loadingText = '加载中...';
          let account = await this.$ajax.post('/account/find', {
            company: _id
          })
        } catch (error) {}
        this.loadingText = '';
      }
    },
    created() {
      this.getAccount();
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
  .tab-height {
    height: calc(100vh - 50px - 70px - 62px - 53px - 40px - 30px - 30px);
    padding: 0 10px;
  }
  .tab-top {
    padding:0 0 15px 0;
    border-bottom: 1px solid #DCDFE6;
  }
</style>