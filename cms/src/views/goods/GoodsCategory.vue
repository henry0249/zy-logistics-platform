<template>
  <common-list title="分类" :tableHeader="tableHeader" str="category">
    <el-button slot-scope="scope" slot="operation" size="mini" @click="test(scope)">超小按钮</el-button>
    <category-add str="category" :key-arr="keyArr" slot="addModel" :keyArr="keyArr"></category-add>
  </common-list>
</template>

<script>
  import CommonList from '../common/CommonList.vue';
  import CategoryAdd from './AddModel.vue';
  export default {
    components: {
      CommonList,
      CategoryAdd
    },
    data() {
      return {
        tableHeader: [{
          key: 'name',
          keyValue: '分类名'
        }, {
          key: 'desc',
          keyValue: '描述'
        }, {
          key: 'remark',
          keyValue: '备注'
        }],
        keyArr: [{
            key: 'name',
            keyValue: '分类名',
            value: null,
            type: 'input'
          },
          // {
          //   key: 'cover',
          //   value: null,
          //   type: 'upload',
          //   action: 'https://yixiu.natappvip.cc/upload/',
          //   keyValue: '封面'
          // },
          {
            key: 'desc',
            keyValue: '描述',
            value: null,
            type: 'textarea'
          }, {
            key: 'remark',
            keyValue: '备注',
            value: null,
            type: 'textarea'
          }
        ]
      }
    },
    methods: {
      test(row) {
        console.log(row);
      }
    }
  }
</script>

<style scoped>

</style>