<template>
  <div>
    <el-select v-model="value5" multiple placeholder="请选择">
      <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item._id">
      </el-option>
    </el-select>
    <my-form-item style="margin-top:20px" multiple select v-model="value6" label="分类" :options="options1">
    </my-form-item>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value5: ['1'],
        options: [{
          _id: '1',
          name: '11'
        }, {
          _id: '2',
          name: '22'
        }, {
          _id: '3',
          name: '33'
        }, {
          _id: '4',
          name: '44'
        }],
        value6: ['1'],
        options1: [{
          _id: '1',
          name: '11'
        }, {
          _id: '2',
          name: '22'
        }, {
          _id: '3',
          name: '33'
        }, {
          _id: '4',
          name: '44'
        }]
      }
    }
  }
</script>

<style scoped>

</style>