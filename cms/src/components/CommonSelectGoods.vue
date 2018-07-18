<template>
  <div class="fex jc js">
    <my-form-item @change="inputChange" style="padding-right:10px;" width="33%" size="mini" v-model="input" placeholder="输入名称搜索"></my-form-item>
    <my-form-item @change="companyChange" style="padding-right:10px;" filterable width="33%" size="mini" placeholder="选择生产厂商" v-model="companyData" :options="companyArr" select></my-form-item>
    <my-form-item @change="brandChange" style="padding-right:10px;" filterable width="33%" size="mini" placeholder="选择品牌" v-model="brand" :options="brandArr" select></my-form-item>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default () {
          return {}
        }
      },
    },
    data() {
      return {
        input: '',
        brand: '',
        brandArr: [],
        companyData: '',
        companyArr: [],
      }
    },
    methods: {
      inputChange(val) {
        let obj = JSON.parse(JSON.stringify(this.data));
        obj.input = val;
        this.$emit('update:data', obj);
      },
      companyChange(val) {
        let obj = JSON.parse(JSON.stringify(this.data));
        obj.mfrs = val;
        this.$emit('update:data', obj);
      },
      brandChange(val) {
        let obj = JSON.parse(JSON.stringify(this.data));
        obj.brand = val;
        this.$emit('update:data', obj);
      },
      async getBrand() {
        try {
          this.brandArr = await this.$api.curd({
            model: 'brand',
            curdType: 'find',
            limit: 0
          })
        } catch (error) {}
      },
      async getCompany() {
        try {
          this.companyArr = await this.$api.curd({
            model: 'company',
            curdType: 'find',
            limit: 0
          })
        } catch (error) {}
      },
    },
    async created() {
      await this.getBrand();
      await this.getCompany();
      delete this.data.input;
      delete this.data.brand;
      delete this.data.mfrs;
      console.log(this.data);
    }
  }
</script>

<style scoped>

</style>