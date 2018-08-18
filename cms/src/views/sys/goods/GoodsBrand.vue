<template>
  <div>
    <common-table path="/brand/find" :thead="thead" :option="op">
      <div slot="header" class="jc js">
        <my-form-item size="mini" style="padding-right:10px;" @change="inputChange" input label="商品名" placeholder="请输入品牌名" width="25%" v-model="input"></my-form-item>
      </div>
      <template slot-scope="scope">
        <el-tag v-if="scope.prop === 'tag'" :type="tagType(index,scope.row['tag'])" style="margin-right:10px;" size="mini" v-for="(item,index) in scope.row['tag']" :key="item.id">{{item}}</el-tag>
        <el-tag v-if="scope.prop === 'category'" :type="tagType(index,scope.row['category'])" style="margin-right:10px;" size="mini" v-for="(item,index) in scope.row['category']" :key="item.id">{{item.name}}</el-tag>
        <i title="点击查看详情" class="pointer name-txt" v-if="scope.prop === 'name'" @click="see(scope)">{{scope.row['name']}}</i>
      </template>
   </common-table>
  </div>
</template>

<script>
  export default {
    props: {
      option: {
        type: Object,
        default () {
          return {}
        }
      },
    },
    data() {
      return {
        input: "",
        op: {
          populate: [{
              path: "category"
            },
            {
              path: "company"
            }
          ]
        },
        categoryArr: [],
        thead: {
          name: {
            name: "品牌名",
            slot: true
          },
          type: {
            name: "类型"
          },
          tag: {
            name: "标签",
            slot: true
          },
          category: {
            name: "所属分类",
            slot: true
          },
          "company.name": {
            name: "所属公司"
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
          path: "/sys/goods/brand_edmit/" + val.row._id
        });
      },
      categoryChange(val) {},
      inputChange(val) {
        this.$set(this.op, '$or', [{
          name: {
            $regex: val
          }
        }])
      }
    },
    created() {
      if (Object.keys(this.option).length > 0) {
        for (const key in this.option) {
          this.$set(this.op,key,this.option[key]);
        }
      }
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