<template>
  <my-form size="mini" width="24%" style="margin:15px 0" v-if="!value">
    <div class="flex jb">
      <my-form-item multiple collapse-tags select v-model="companyData.type" label="公司类型" :options="field.Company.type.option"></my-form-item>
      <my-form-item input v-model="companyData.name" filterable label="公司全称"></my-form-item>
      <my-form-item input v-model="companyData.nick" filterable label="公司别称"></my-form-item>
      <my-form-item input v-model="companyData.mobile" filterable label="手机号码"></my-form-item>
    </div>
    <div class="flex jb" style="margin-top:20px;">
      <my-form-item input v-model="companyData.tel" filterable label="公司固话"></my-form-item>
      <my-form-item input v-model="companyData.code" filterable label="公司编号"></my-form-item>
      <common-select label="贸易链关联公司" :data.sync="companyData.businessRelationCompany" border width="24%" title="贸易链关联公司选择" type="company" size="mini"></common-select>
      <my-form-item switch v-model="companyData.self" label="自营"></my-form-item>
    </div>
    <div class="flex jb" style="margin-top:20px;">
      <common-select label="公司地区" width="24%" :data.sync="companyData.area" border title="所在区域" type="area" size="mini"></common-select>
      <my-form-item input width="74.5%" v-model="companyData.areaInfo" ref="addressInput" filterable label="详细地址"></my-form-item>
    </div>
  </my-form>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: "edmit"
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
      }
    },
    data() {
      return {
        roleDate: {},
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
          businessRelationCompany: []
        }
      };
    },
    watch: {
      companyData: {
        handler: function(val, oldVal) {
          if (this.type === "edmit") {
            if (oldVal._id) {
              this.$emit("update:data", val);
            }
          } else if (this.type === "add") {
            if (val.area._id) {
              this.$set(
                this.companyData,
                "areaInfo",
                val.area.province.name +
                val.area.city.name +
                val.area.county.name +
                val.area.name
              );
            }
            this.$emit("update:data", val);
          }
        },
        deep: true
      }
    },
    methods: {
      setCaretPosition(tObj, sPos) {
        console.log("1111");
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
      if (this.type === "edmit") {
        this.roleDate = JSON.parse(JSON.stringify(roleDate));
        this.companyData = JSON.parse(JSON.stringify(companyData));
      }
    }
  };
</script>

<style scoped>

</style>