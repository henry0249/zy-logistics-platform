<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>添加账户</strong>
        </div>
        <my-form size="mini" width="24%">
          <div class="jb">
            <my-form-item number :min="0" v-model="data.value" label="结算款"></my-form-item>
            <my-form-item number :min="0" v-model="data.prepaid" label="预付款"></my-form-item>
            <common-select-by-code v-if="relationType" width="24%" :disabled="true" company :data.sync="data.company" size="mini" placeholder="未选择" label="所属公司"></common-select-by-code>
            <common-select-by-code v-if="!relationType" width="24%" :disabled="true" user :data.sync="data.user" size="mini" placeholder="未选择" label="所属用户"></common-select-by-code>
            <common-select-by-code check width="24%" company :user-type.sync="type" :data.sync="data.relationCompany" size="mini" placeholder="未选择" label="关联单位"></common-select-by-code>
          </div>
          <div class="jb" style="margin-top:15px;">
          </div>
        </my-form>
      </div>
      <div class="tr jb" style="margin-top:30px">
        <div>
          <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        </div>
        <el-button size="small" type="primary" @click="sub">添 加</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  export default {
    data() {
      return {
        loadingText: '',
        type: '',
        data: {
          type: 'company',
          value: 0,
          prepaid: 0,
          user: {},
          company: {},
          relationCompany: {},
          relationUser: {},
        }
      }
    },
    computed: {
      relationType() {
        return this.$route.query.relationType === 'company';
      }
    },
    methods: {
      checkData() {
        let io = true;
        let data = {
          company: {
            key: 'relationCompany',
            warnText: '关联公司不能为空'
          },
          user: {
            key: 'relationUser',
            warnText: '关联用户不能为空'
          }
        }
        if (Object.keys(this.data[data[this.$route.query.type].key]).length === 0) {
          this.$message.warn(data[this.$route.query.type].warnText);
          return io = false;
        }
        return io;
      },
      sub() {
        console.log(this.data);
        console.log(this.type);
        if (this.checkData()) {
          this.setAccount();
        }
      },
      async setAccount() {
        try {
          this.loadingText = '添加中';
          let data = {
            value: this.data.value,
            prepaid: this.data.prepaid,
            type: this.data.type,
          };
          if (this.$route.query.type === 'company') {
            this.$set(data, 'company', this.data.company._id);
            delete data.user;
          } else {
            this.$set(data, 'user', this.data.user._id);
            delete data.company;
          }
          if (this.relationType) {
            this.$set(data, 'relationCompany', this.data.relationCompany._id);
            delete data.relationUser;
          } else {
            this.$set(data, 'relationUser', this.data.relationUser._id);
            delete data.relationCompany;
          }
          await this.$ajax.post('/account/set', data);
          this.$message.success('添加成功');
          this.$router.push({
            path: '/company/account',
            query: {
              show: false
            }
          })
        } catch (error) {}
        this.loadingText = '';
      }
    },
    created() {
      if (this.$route.query.type) {
        this.$set(this.data, 'type', this.$route.query.type);
      }
      this.$set(this.data, this.$route.query.type, this[this.$route.query.type]);
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