<template>
  <div>
    <my-table height="100vh - 50px" edit  index selection op :loadmore="loadmore" :thead="thead" :data.sync="data">
      
    </my-table>
  </div>
</template>

<script>
import { taking } from "./field";
export default {
  data() {
    return {
      thead: taking,
      data: [
        {
          address: {
            name: "上海市普陀区金沙江路 1517 弄"
          }
        }
      ]
    };
  },
  methods: {
    async loadmore() {
      let p = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(666);
        }, 1000);
      });
      await p;
      return [
        {
          address: {
            name: "上海市"
          }
        }
      ];
    }
  }
};
</script>

<style scoped>
</style>