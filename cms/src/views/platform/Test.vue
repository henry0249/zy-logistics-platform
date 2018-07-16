<template>
  <div>
    <user-select label="选择" :data.sync="value1" border width="25%" title="用户选择" type="user"></user-select>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: {
          email: "75776584@com",
          name: "用户2",
          mobile: "18877575234",
          _id: '5b233826ae796f83628d4065'
        },
        value1: [{
          email: "75776584@com",
          name: "用户1",
          mobile: "18877575234",
          _id: '5b233729ae796f83628d405d'
        }, {
          email: "75776584@com",
          name: "用户2",
          mobile: "18877575234",
          _id: '5b233826ae796f83628d4065'
        }, ]
      }
    },
    watch: {
      value1(val){
        console.log('!!',val);
      }
    }
  }
</script>

<style scoped>

</style>