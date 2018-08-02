<template>
  <div>
    <common-select label="选择" :data.sync="value1" @switchChange="switchChange" :changeType.sync="changeType" border width="25%" title="用户选择" type="company" size="mini"></common-select>
  </div>
</template>

<script>
  import {
    goodsThead,
    populate,
    or,
    addkey
  } from "./key.js";
  export default {
    data() {
      return {
        changeType:'',
        value2: {},
        value3: [],
        value: {
          email: "75776584@com",
          name: "用户2",
          mobile: "18877575234",
          _id: '5b233826ae796f83628d4065'
        },
        value1: [{
          no: '12233',
          email: "75776584@com",
          name: "用户1",
          mobile: "18877575234",
          _id: '5b233729ae796f83628d405d'
        }, {
          no: '334585',
          email: "75776584@com",
          name: "用户2",
          mobile: "18877575234",
          _id: '5b233826ae796f83628d4065'
        }, ],
        thead: goodsThead,
        option: {
          $or: [{
            name: {
              $regex: this.input
            }
          }]
        }
      }
    },
    watch: {
      changeType(val){
        console.log(val);
      }
    },
    methods: {
      switchChange(val){},
    }
  }
</script>

<style scoped>

</style>