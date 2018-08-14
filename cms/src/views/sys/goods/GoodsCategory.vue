<template>
  <div>
    <common-table path="/goods/find" :thead="thead" :option="op">
      <div slot="header" class="jc js">
        <my-form-item size="mini" style="padding-right:10px;" @change="inputChange" input label="商品名" placeholder="请输入商品名" width="25%" v-model="input"></my-form-item>
        <my-form-item @change="categoryChange" label="选择类别" style="padding-right:10px;" filterable width="25%" size="mini" placeholder="选择分类" v-model="categoryData" :options="categoryArr" select></my-form-item>
      </div>
      <template slot-scope="scope" v-if="scope.prop === 'tag'||scope.prop === 'name'">
        <el-tag v-if="scope.prop === 'tag'" :type="tagType(index,scope.row['tag'])" style="margin-right:10px;" size="mini" v-for="(item,index) in scope.row['tag']" :key="item.id">{{item}}</el-tag>
        <i title="点击查看详情" class="pointer name-txt" v-if="scope.prop === 'name'" @click="see({type:'read',value:scope})">{{scope.row['name']}}</i>
      </template>
   </common-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        input:'',
        op: {},
        categoryArr:[],
        thead: {
          name: {
            name: '分类名'
          },
          desc: {
            name: '描述'
          },
          remark: {
            name: '备注'
          },
          parent: {
            name: '上级分类',
            slot: true
          }
        }
      }
    },
    methods: {
      categoryChange(val){},
      inputChange(val){

      }
    },
    created () {
      
    }
  }
</script>

<style scoped>

</style>