<template>
  <div>
    <my-table :loadmore="loadmore" index selection :thead="filed" :data.sync="data" :select.sync="select">
      
    </my-table>
  </div>
</template>

<script>
import filed from "./filed";
import List from "./List";
export default {
  components: {
    List
  },
  data() {
    return {
      filed: filed,
      data: [
        {
          address: "上海市普陀区金沙江路 1517 弄"
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
      return [];
    }
  }
};
</script>

<style scoped>

</style>