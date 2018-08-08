<template>
  <my-form size="mini" width="24%" style="margin:15px 0" v-if="!value">
    <div class="flex jb">
      <my-form-item input v-model="companyData.name" filterable label="公司全称"></my-form-item>
      <my-form-item input v-model="companyData.nick" filterable label="公司别称"></my-form-item>
      <my-form-item input v-model="companyData.code" filterable label="公司编号"></my-form-item>
      <my-form-item input v-model="companyData.mobile" filterable label="手机号码"></my-form-item>
    </div>
    <div class="flex jb" style="margin-top:20px;">
      <my-form-item input v-model="companyData.tel" filterable label="公司固话"></my-form-item>
      <common-select label="公司地区" :data.sync="companyData.area" border width="24%" title="地区选择" type="area" size="mini"></common-select>
      <my-form-item input v-model="companyData.address" filterable label="公司地址"></my-form-item>
      <my-form-item multiple collapse-tags select v-model="companyData.type" label="公司类型" :options="field.Company.type.option"></my-form-item>
    </div>
    <div class="flex jb" style="margin-top:20px;">
      <common-select label="管理员" :data.sync="roleDate.admin" border width="24%" title="管理员选择" type="user" size="mini"></common-select>
      <common-select label="业务专员" :data.sync="roleDate.salesman" border width="24%" title="业务专员选择" type="user" size="mini"></common-select>
      <common-select label="完成审核员" :data.sync="roleDate.finishCheck" border width="24%" title="完成审核员选择" type="user" size="mini"></common-select>
      <common-select label="财务文员" :data.sync="roleDate.financial" border width="24%" title="财务文员选择" type="user" size="mini"></common-select>
    </div>
    <div class="flex jb" style="margin-top:20px;">
      <common-select label="单据文员" :data.sync="roleDate.documentClerk" border width="24%" title="单据文员选择" type="user" size="mini"></common-select>
      <common-select label="贸易链关联公司" :data.sync="companyData.businessRelationCompany" border width="24%" title="贸易链关联公司选择" type="company" size="mini"></common-select>
      <my-form-item switch v-model="companyData.self" label="自营"></my-form-item>
      <div style="width:24%;"></div>
    </div>
  </my-form>
</template>

<script>
  export default {
    props: {
      value: {
        type: String,
        default: ''
      },
      data: {
        type: Object,
        default () {
          return {}
        }
      },
      startData: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data() {
      return {
        roleDate: {
          admin: [],
          salesman: [],
          finishCheck: [],
          financial: [],
          documentClerk: [],
        },
        companyData: {
          name: '',
          nick: '',
          code: '',
          mobile: '',
          type: [],
          tel: '',
          self: false,
          address: '',
          area: {},
          businessRelationCompany: [],
        }
      }
    }
  }
</script>

<style scoped>

</style>