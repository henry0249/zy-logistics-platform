<template>
  <div>
    <List index selection :thead="filed" :data="data">
      <template v-if="column.property === 'goods'" slot-scope="{row,column,index}">
        单位登记我的几位大家玩i大家玩i大家玩i低价位焦点网ID就
      </template>
    </List>
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
          address: "上海市普陀"
        },
        {
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  }
};
</script>

<style scoped>

</style>