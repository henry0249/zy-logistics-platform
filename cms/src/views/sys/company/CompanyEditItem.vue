<template>
  <my-form size="mini" width="24%" style="margin:15px 0" v-if="!value">
    <div class="flex jb">
      <my-form-item multiple collapse-tags select v-model="companyData.type" label="公司类型" :options="field.Company.type.option"></my-form-item>
      <my-form-item input v-model="companyData.name" filterable label="公司名称"></my-form-item>
      <my-form-item input v-model="companyData.nick" filterable label="公司简称"></my-form-item>
      <my-form-item input v-model="companyData.mobile" filterable label="手机号码"></my-form-item>
    </div>
    <div class="flex jb" style="margin-top:15px;">
      <my-form-item input v-model="companyData.tel" filterable label="公司固话"></my-form-item>
      <my-form-item input v-model="companyData.code" filterable label="公司编号"></my-form-item>
      <my-form-item switch v-model="companyData.self" label="自营"></my-form-item>
      <div style="width:24%">
        <my-select label="公司地区" :data.sync="companyData.area" area></my-select>
      </div>
    </div>
    <div class="flex jb" style="margin-top:15px;">
      <my-form-item input width="100%" v-model="companyData.areaInfo" ref="addressInput" filterable label="详细地址"></my-form-item>
    </div>
    <div class="flex jb" style="margin-top:15px;">
      <common-select-by-code label="贸易链关联公司" type="businessRelationCompany" userType="company" :data.sync="business.businessRelationCompany" title="贸易链关联公司选择" company size="mini"></common-select-by-code>
    </div>
    <div class="flex jb" style="margin-top:15px;">
      <common-select-by-code label="物流链关联公司" border type="transportTrainsRelationCompany" userType="company" :data.sync="transport.transportTrainsRelationCompany" title="物流链关联公司选择" company size="mini"></common-select-by-code>
    </div>
  </my-form>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: "edit"
      },
      show: {
        type: Boolean,
        default: true
      },
      value: {
        type: String,
        default: ""
      },
      data: {
        type: Object,
        default () {
          return {};
        }
      },
      startData: {
        type: Object,
        default () {
          return {};
        }
      },
      businessRelation: {
        type: Object,
        default () {
          return {
            businessRelationCompany: [],
            relationCode: '',
          };
        }
      },
      transportTrainsRelation: {
        type: Object,
        default () {
          return {
            transportTrainsRelationCompany: [],
            relationCode: '',
          };
        }
      },
    },
    data() {
      return {
        roleDate: {},
        business: {
          businessRelationCompany: [],
          relationCode: '',
        },
        transport: {
          transportTrainsRelationCompany: [],
          relationCode: '',
        },
        companyData: {
          name: "",
          nick: "",
          code: "",
          mobile: "",
          type: [],
          tel: "",
          self: false,
          areaInfo: "",
          area: {},
          transportTrainsRelation: {
            transportTrainsRelationCompany: [],
            relationCode: ''
          }
        }
      };
    },
    watch: {
      business: {
        handler(val) {
          this.$emit('update:businessRelation', val);
        },
        deep: true
      },
      transport: {
        handler(val) {
          this.$emit('update:transportTrainsRelation', val);
        },
        deep: true
      },
      'companyData.area' (val) {
        let areaInfo = val.province.name + val.city.name + val.county.name + val.name
        this.$set(this.companyData, 'areaInfo', areaInfo)
      },
      companyData: {
        handler: function(val, oldVal) {
          console.log(val);
          this.$emit("update:data", val);
        },
        deep: true
      }
    },
    methods: {
      setCaretPosition(tObj, sPos) {
        if (tObj.setSelectionRange) {
          setTimeout(function() {
            tObj.setSelectionRange(sPos, sPos);
            tObj.focus();
          }, 0);
        } else if (tObj.createTextRange) {
          var rng = tObj.createTextRange();
          rng.move("character", sPos);
          rng.select();
        }
      }
    },
    created() {
      let companyData = {};
      let roleDate = {};
      for (const key in this.companyData) {
        this.$set(companyData, key, this.startData[key]);
      }
      this.$set(companyData, "_id", this.startData._id);
      for (const key in this.roleStartDate) {
        if (this.roleStartDate[key].length > 0) {
          this.roleStartDate[key].forEach(item => {
            let obj = {};
            obj = item.user;
            obj.roleId = item._id;
            roleDate[key].push(obj);
          });
        } else {
          roleDate[key] = [];
        }
      }
      if (this.type === "edit") {
        this.roleDate = JSON.parse(JSON.stringify(roleDate));
        this.companyData = JSON.parse(JSON.stringify(companyData));
      }
      this.business = JSON.parse(JSON.stringify(this.businessRelation));
      this.transport = JSON.parse(JSON.stringify(this.transportTrainsRelation));
    }
  };
</script>

<style scoped>

</style>