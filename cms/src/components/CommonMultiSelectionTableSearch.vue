<template>
  <div>
    <my-form-item width="250px" size="mini" input v-model="input" @change="inputChange" filterable :placeholder="key[type].placeholder"></my-form-item>
  </div>
</template>

<script>
  import CommonMultiSelection from "./CommonMultiSelection.js";
  export default {
    props: {
      data: {
        type: Object,
        default () {
          return {}
        }
      },
      type: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        input: '',
        key: CommonMultiSelection
      }
    },
    methods: {
      inputChange(val) {
        let data = {};
        if (val) {
          data.$or = []
          this.key[this.type].searchOption.forEach(item => {
            let obj = {};
            this.$set(obj,item,{
              $regex: val
            })
            data.$or.push(obj);
          });
        } else {
          delete data.$or;
        }
        this.$emit('update:data', data);
      }
    }
  }
</script>

<style scoped>

</style>