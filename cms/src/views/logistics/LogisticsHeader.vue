<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :name="item.company._id" v-for="item in this.roleArr" :key="item.company._id">
        <div slot="label" style="position: relative;">
          <div style="position:absolute;right:0;transform: translate(100%,0%)">
            <el-badge :value="item.count === 0?'':item.count">
            </el-badge>
          </div>
          <div style="font-size:14px;">{{item.company.name || item.company.nick}}</div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        default: ''
      },
      loadingText: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        activeName: '',
        roleArr: [],
      }
    },
    watch: {
      activeName(val) {
        this.$emit('update:name', val)
      }
    },
    methods: {
      handleClick(tab, event) {
        this.$emit('handle-click', tab);
      },
      async getCompanyByRole() {
        this.roleArr = await this.$api.curd({
          model: 'role',
          curdType: 'find',
          type: 'dispatcher',
          user: this.user._id,
          populate: [{
            path: 'company'
          }]
        })
        this.activeName = this.roleArr[0].company._id || '';
      },
      async getCountByHandle() {
        for (let index = 0; index < this.roleArr.length; index++) {
          let res = await this.$api.curd({
            model: 'logistics',
            curdType: 'count',
            state: {
              $nin: [5]
            },
            handle: this.roleArr[index].company._id
          });
          this.$set(this.roleArr[index], 'count', res);
        }
      }
    },
    async created() {
      try {
        this.$emit('update:loadingText', '加载中');
        await this.getCompanyByRole();
        if (this.roleArr.length > 0) {
          await this.getCountByHandle();
        }
      } catch (error) {
        console.log(error);
      }
      this.$emit('update:loadingText', '');
    }
  }
</script>

<style scoped>
  .c {
    position: absolute;
    transform: translate()
  }
</style>