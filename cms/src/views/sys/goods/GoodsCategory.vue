<template>
  <div>
    <common-table path="/category/find" style="padding:0 1%" height="calc(100vh - 50px - 35px - 35px)" :thead="thead" :option="op">
      <div slot="header" class="jc js">
        <my-form-item size="mini" style="padding-right:10px;" @change="inputChange" input label="分类名" placeholder="请输入分类名" width="250px" v-model="input"></my-form-item>
        <my-form-item @change="categoryCheckChange" label="选择分类类型" style="padding-right:10px;" filterable width="250px" size="mini" placeholder="选择分类类型" v-model="categoryCheck" :options="categoryOption" select></my-form-item>
        <my-form-item :disabled="disabled" @change="categoryChange" label="选择上级分类" style="padding-right:10px;" filterable width="250px" size="mini" placeholder="选择上级分类" v-model="categoryData" :options="categoryArr" select></my-form-item>
      </div>
      <template slot-scope="scope">
            <div title="点击查看详情" class="pointer name-txt" v-if="scope.prop === 'name'" @click="see(scope)">{{setName(scope)}}</div>
</template>
   </common-table>
  </div>
</template>

<script>
  export default {
    props: {
      sys: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        input: "",
        op: {
          populate: [{
            path: "parent"
          }]
        },
        disabled: false,
        categoryData: '',
        categoryArr: [],
        categoryCheck: null,
        categoryOption: [{
            label: '一级分类',
            _id: 1
          },
          {
            label: '二级分类',
            _id: 2
          }
        ],
        thead: {
          name: {
            name: "分类名",
            slot: true
          },
          desc: {
            name: "描述"
          },
          remark: {
            name: "备注"
          },
          "parent.name": {
            name: "上级分类"
          }
        }
      };
    },
    methods: {
      setName(scope) {
        return scope.row.name || scope.row.nick || scope.row.mobile || scope.row._id;
      },
      tagType(index, arr) {
        let type = ["success", "info", "warning", "danger"];
        if (index <= arr.length - 1) {
          return type[index];
        } else {
          return type[index - arr.length - 1];
        }
      },
      see(val) {
        let data = '/sys/goods/category_edit/';
        if (!this.sys) {
          data = '/goods/category_edit/'
        }
        this.$router.push({
          path: data + val.row._id,
          query:{
            parentPath:this.$route.path,
            parentName:this.$route.name
          }
        });
      },
      categoryCheckChange(val) {
        let data = false;
        if (val === 2) {
          data = true;
          this.disabled = false;
        } else {
          this.disabled = true;
        }
        this.$set(this.op, 'parent', {
          $exists: data
        })
      },
      categoryChange(val) {
        if (val) {
          this.$set(this.op, 'parent', val);
        } else {
          delete this.op.parent;
        }
      },
      inputChange(val) {
        if (val) {
          this.$set(this.op, '$or', [{
            name: {
              $regex: val
            }
          }]);
        } else {
          delete this.op.$or;
        }
      },
      async getParentCategory() {
        let data = {
          model: 'category',
          curdType: 'find',
          limit: 0,
          parent: {
            $exists: false
          }
        };
        this.categoryArr = await this.$api.curd(data);
      }
    },
    async created() {
      try {
        await this.getParentCategory();
      } catch (error) {}
    }
  };
</script>

<style scoped>
  .name-txt {
    color: #42a5f5;
  }
  .name-txt:hover {
    text-decoration: underline;
  }
</style>