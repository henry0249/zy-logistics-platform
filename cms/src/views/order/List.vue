<template>
  <div>
    <el-table size="mini" show-overflow-tooltip  class-name="mylist" style="width: 100%;font-size:13px" :data="data" :height="height">
      <el-table-column type="index" width="30">
      </el-table-column>
      <el-table-column  :prop="key" :label="value.name" :width="''+(value.width||'')" v-for="(value, key) in thead" :key="key">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      height: {
        type: String,
        default: "calc(100vh - 50px)"
      },
      thead: {
        type: [Object, Array],
        default () {
          return {};
        }
      },
      data: {
        type: Array,
        default () {
          return [];
        }
      }
    }
  };
</script>

<style scoped>

</style>