<template>
  <div class="fex jc js">
    <my-form-item @change="inputChange" style="padding-right:10px;" width="33%" size="mini" v-model="input" :placeholder="`输入${type==='ship'?'船':'车牌'}号搜索`"></my-form-item>
    <my-form-item @change="typeChange" style="padding-right:10px;" width="33%" size="mini" collapse-tags placeholder="选择类型" v-model="typeData" :options="options()" multiple select></my-form-item>
    <my-form-item @change="companyChange" style="padding-right:10px;" filterable width="33%" size="mini" placeholder="选择公司" v-model="companyData" :options="companyArr" select></my-form-item>
  </div>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: ''
      },
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
        typeData: [],
        companyData:'',
        companyArr: [],
      }
    },
    computed: {
    },
    methods: {
      options() {
        let res = this.field[this.type.substring(0, 1).toUpperCase() + this.type.substring(1)].type.option;
        return res
      },
      inputChange(val) {
        let obj = JSON.parse(JSON.stringify(this.data));
        obj.$or = [{
          no: {
            $regex: val
          }
        }]
        this.$emit('update:data', obj);
      },
      companyChange(val) {
        let obj = JSON.parse(JSON.stringify(this.data));
        obj.company = val;
        this.$emit('update:data', obj);
      },
      typeChange(val) {
        let obj = JSON.parse(JSON.stringify(this.data));
        obj.type = val;
        this.$emit('update:data', obj);
      },
      async getCompany() {
        try {
          this.companyArr = await this.$api.curd({
            model: 'company',
            curdType: 'find',
            limit: 0,
            type: ['logistics']
          })
        } catch (error) {}
      },
    },
    async created() {
      await this.getCompany();
    }
  }
</script>

<style scoped>

</style>