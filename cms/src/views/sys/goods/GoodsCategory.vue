<template>
  <div>
    <common-table path="/category/find" :thead="thead" :option="op">
      <div slot="header" class="jc js">
        <my-form-item size="mini" style="padding-right:10px;" @change="inputChange" input label="商品名" placeholder="请输入商品名" width="25%" v-model="input"></my-form-item>
        <!-- <my-form-item @change="categoryChange" label="选择类别" style="padding-right:10px;" filterable width="25%" size="mini" placeholder="选择分类" v-model="categoryData" :options="categoryArr" select></my-form-item> -->
      </div>
      <template slot-scope="scope">
          <i title="点击查看详情" class="pointer name-txt" v-if="scope.prop === 'name'" @click="see(scope)">{{scope.row['name']}}</i>
</template>
   </common-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
      op: {
        populate: [
          {
            path: "parent"
          }
        ]
      },
      categoryArr: [],
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
    tagType(index, arr) {
      let type = ["success", "info", "warning", "danger"];
      if (index <= arr.length - 1) {
        return type[index];
      } else {
        return type[index - arr.length - 1];
      }
    },
    see(val) {
      this.$router.push({
        path: "/sys/goods/category_edmit/" + val.row._id
      });
    },
    categoryChange(val) {},
    inputChange(val) {}
  },
  created() {}
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