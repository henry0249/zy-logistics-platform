<template>
  <div class="fex jc js">
    <my-form-item @change="inputChange" style="padding-right:10px;" width="33%" size="mini" v-model="input" placeholder="输入公司名称或别名搜索"></my-form-item>
    <my-form-item @change="typeChange" style="padding-right:10px;" collapse-tags label="公司类型" multiple width="33%" size="mini" placeholder="选择公司类型" v-model="typeData" :options="field.Company.type.option" select></my-form-item>
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
        typeData: '',
      }
    },
    methods: {
      inputChange(val) {
        let obj = JSON.parse(JSON.stringify(this.data));
        obj.$or = [{
          name: {
            $regex: val
          }
        }, {
          nick: {
            $regex: val
          }
        }]
        this.$emit('update:data', obj);
      },
      typeChange(val) {
        let obj = JSON.parse(JSON.stringify(this.data));
        if (val.length > 0) {
          obj.type = val;
        } else {
          delete obj.type;
        }
        this.$emit('update:data', obj);
      },
    },
    async created() {
      delete this.data.input;
      delete this.data.type;
    }
  }
</script>

<style scoped>

</style>