<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>公司信息</strong>
        </div>
        <company-edit v-if="!loadingText" :data.sync="data" :startData="initData" :business-relation.sync="businessRelation" :transport-trains-relation.sync="transportTrainsRelation"></company-edit>
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
  import CompanyEdit from '../sys/company/CompanyEditItem.vue';
  export default {
    components: {
      CompanyEdit
    },
    data() {
      return {
        loadingText: '',
        show: true,
        data: {},
        initData: {},
        transportTrainsRelation: {},
        businessRelation: {},
        transportRemove: [],
        businessRemove: []
      }
    },
    watch: {
      company: {
        handler(val) {
          this.getCompany()
        },
        deep: true
      }
    },
    methods: {
      confirmation() {
        let returnIo = true;
        if (!this.data.name) {
          this.$message.warn("公司名称不能为空");
          return returnIo = false;
        } else if (!this.data.nick) {
          this.$message.warn("公司别称不能为空");
          return returnIo = false;
        } else if (!this.data.area._id) {
          this.$message.warn("公司地区不能为空");
          return returnIo = false;
        } else if (!(/^1[34578]\d{9}$/.test(this.data.mobile))) {
          this.$message.warn("手机号码格式不正确！");
          return returnIo = false;
        } else if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(this.data.tel)) {
          this.$message.warn("公司固话格式不正确！");
          return returnIo = false;
        }
        return returnIo;
      },
      async sub() {
        if (this.confirmation()) {
          try {
            this.loadingText = '修改中...';
            let update = {
              name: this.data.name,
              areaInfo: this.data.areaInfo,
              area: this.data.area._id,
              code: this.data.code,
              mobile: this.data.mobile,
              nick: this.data.nick,
              self: this.data.self,
              tel: this.data.tel,
              type: this.data.type,
            }
            let transportData = [];
            let businessData = [];
            this.transportTrainsRelation.transportTrainsRelationCompany.forEach(item => {
              transportData.push(item._id);
            });
            this.businessRelation.businessRelationCompany.forEach(item => {
              businessData.push(item._id);
            });
            this.$set(update, 'transportTrainsRelationCompany', transportData);
            this.$set(update, 'businessRelationCompany', businessData);
            let updateCompany = await this.$ajax.post('/company/update', {
              find: {
                _id: this.company._id
              },
              update
            })
            await this.getCompany();
          } catch (error) {}
          this.loadingText = '';
        }
      },
      async getCompany() {
        try {
          this.loadingText = '加载中..';
          this.initData = await this.$api.curd({
            model: "company",
            curdType: "findOne",
            _id: this.company._id,
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
              },
              {
                path: "transportTrainsRelationCompany"
              }
            ]
          });
          this.$set(this.transportTrainsRelation, 'relationCode', '');
          this.$set(this.transportTrainsRelation, 'transportTrainsRelationCompany', this.initData.transportTrainsRelationCompany);
          this.$set(this.businessRelation, 'relationCode', '');
          this.$set(this.businessRelation, 'businessRelationCompany', this.initData.businessRelationCompany);
        } catch (error) {}
        this.loadingText = '';
      }
    },
    created() {
      this.getCompany();
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