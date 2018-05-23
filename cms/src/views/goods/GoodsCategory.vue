<template>
  <common-list :title="name" :tableHeader="tableHeader" str="category" :key-arr="keyArr" :populate="populate">
    <el-button slot-scope="scope" slot="operation" size="mini" @click="test(scope)">超小按钮</el-button>
    <!-- <category-add str="category" :key-arr="keyArr" slot="addModel"></category-add> -->
  </common-list>
</template>

<script>
  import CommonList from "../common/CommonList.vue";
  // import CategoryAdd from "./AddModel.vue";
  export default {
    components: {
      CommonList,
      // CategoryAdd
    },
    data() {
      return {
        name: '',
        tableHeader: [],
        populate: [{
          path: 'parent'
        }],
        tableHeader1: [{
            key: "name",
            keyValue: "分类名"
          },
          {
            key: "desc",
            keyValue: "描述"
          },
          {
            key: "remark",
            keyValue: "备注"
          }
        ],
        tableHeader2: [{
            key: "name",
            keyValue: "分类名"
          },
          {
            key: "desc",
            keyValue: "描述"
          },
          {
            key: "remark",
            keyValue: "备注"
          }, {
            key: "parent.name",
            keyValue: "上级分类"
          }
        ],
        keyArr: [],
        keyArr1: [{
            key: "name",
            keyValue: "分类名",
            value: null,
            type: "input"
          },
          // {
          //   key: 'cover',
          //   value: null,
          //   type: 'upload',
          //   action: 'https://yixiu.natappvip.cc/upload/',
          //   keyValue: '封面'
          // },
          {
            key: "desc",
            keyValue: "描述",
            value: null,
            type: "textarea"
          },
          {
            key: "remark",
            keyValue: "备注",
            value: null,
            type: "textarea"
          }
        ],
        keyArr2: [{
            key: "name",
            keyValue: "分类名",
            value: null,
            type: "input"
          },
          // {
          //   key: 'cover',
          //   value: null,
          //   type: 'upload',
          //   action: 'https://yixiu.natappvip.cc/upload/',
          //   keyValue: '封面'
          // },
          {
            key: "desc",
            keyValue: "描述",
            value: null,
            type: "textarea"
          },
          {
            key: "remark",
            keyValue: "备注",
            value: null,
            type: "textarea"
          }, {
            key: 'parent.name',
            value: null,
            type: 'select',
            keyValue: '上级分类',
            options: []
          }
        ],
      };
    },
    watch: {
      $route(val) {
        console.log('route', val.path);
        this.op(val.path)
      }
    },
    methods: {
      test(row) {
        console.log(row);
      },
      async op(op) {
        console.log(op);
        if (op == "/goods/category/2") {
          console.log('222222222');
          this.name = '二级分类'
          try {
            console.log(3333333);
            let res = await this.$api.curd({
              model: 'category',
              curdType: 'find',
              parent: {
                $exists: false
              }
            })
            console.log('res', res);
            res.forEach(item => {
              item.value = item._id
              item.label = item.name
            });
            this.tableHeader = this.tableHeader2
            this.keyArr2.forEach(keyItem => {
              if (keyItem.key == 'parent.name') {
                keyItem.options = res
              }
            });
            this.keyArr = this.keyArr2
            console.log(this.keyArr);
          } catch (error) {}
        } else {
          console.log(111111111);
          let i = null
          this.name = '一级分类'
          this.tableHeader = this.tableHeader1
          this.keyArr = this.keyArr1
        }
        console.log('this.keyArr', this.keyArr);
      }
    },
    created() {
      this.op(this.$route.path)
    }
  };
</script>

<style scoped>

</style>