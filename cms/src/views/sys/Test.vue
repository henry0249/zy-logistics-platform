<template>
  <div style="padding-left:30px;">
    <common-multi-selection user :data.sync="data" :label="label" width="50%" size="mini" border></common-multi-selection>
  </div>
</template>

<script>
export default {
  data() {
    return {
      label:'用户',
      data:[]
    };
  },
  watch: {
    data:{
      handler(val){
        console.log(val);
      },
      deep:true
    }
  },
  computed: {
    // data() {
    //   let data = [];
    //   for (let index = 0; index < 20; index++) {
    //     let obj = {};
    //     obj.name = "用户" + index;
    //     data.push(obj);
    //   }
    //   return data;
    // }
  }
};
</script>

<style scoped>
</style>