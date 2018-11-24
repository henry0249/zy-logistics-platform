<template>
  <loading-box class="g-order-create">
    <my-nav :active-name.sync="activeName" @select="select" :options="options"></my-nav>
    <loading-box class="g-order" v-model="loadingText">
      <company-edit-item v-if="activeName === 'information' && !loadingText" :data.sync="infoData" :startData="initInfoData" :business-relation.sync="businessRelation" :transport-trains-relation.sync="transportTrainsRelation"></company-edit-item>
    </loading-box>
  </loading-box>
</template>

<script>
  import CompanyEditItem from "./CompanyEditItem.vue";
  import CommonCompanyRole from "../../common/CommonCompanyRole.vue";
  import MyNav from "../../common/MyNav.vue";
  import CompanyShip from "./CompanyShip.vue";
  export default {
    components: {
      CompanyEditItem,
      CompanyShip,
      CommonCompanyRole,
      MyNav
    },
    props: {
      sys: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        activeName: 'information',
        loadingText: "",
        infoData: {},
        initInfoData: {},
        businessRelation: {},
        transportTrainsRelation: {},
        options: {
          information: {
            label: '公司信息',
            get: 'getCompany'
          },
          relationCode: {
            label: '关联代码',
            get: 'getRelationCode'
          },
          account: {
            label: '账户管理',
            get: 'getAccount'
          },
          role: {
            label: '角色管理',
            get: 'getRole'
          }
        },
      };
    },
    methods: {
      select(val) {},
      async getCompany() {
        this.initInfoData = await this.$api.sys.getCompanyFindOne({
          _id: this.$route.params._id,
          populate: [{
            path: 'businessRelationCompany'
          }, {
            path: 'transportTrainsRelationCompany'
          }, {
            path: 'area',
            populate: [{
                path: 'province'
              },
              {
                path: 'county'
              }, {
                path: 'city'
              }
            ]
          }]
        })
        this.$set(this.transportTrainsRelation, 'relationCode', '');
        this.$set(this.transportTrainsRelation, 'transportTrainsRelationCompany', this.initInfoData.transportTrainsRelationCompany);
        this.$set(this.businessRelation, 'relationCode', '');
        this.$set(this.businessRelation, 'businessRelationCompany', this.initInfoData.businessRelationCompany);
      },
      async getRole() {},
      async getAccount() {},
      async getRelationCode() {},
    },
    async created() {
      try {
        this.loadingText = '加载中';
        // await this[this.options[this.activeName].get]();
        await this.getCompany();
      } catch (error) {
        console.log(error);
      }
      this.loadingText = '';
    }
  };
</script>

<style scoped>
  .g-order-create {
    padding: 0 1% 1% 1%;
  }
  .g-order {
    max-height: calc(100vh - 50px - 35px - 35px - 57px);
  }
</style>