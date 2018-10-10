<template>
  <div>
    <common-table style="padding:0 1%" height="calc(100vh - 50px - 35px - 35px)" v-if="show" path="/brand/find" :thead="thead" :option="op">
      <div slot="header" class="jc js">
        <my-form-item size="mini" style="padding-right:10px;" @change="inputChange" input label="品牌名" placeholder="请输入品牌名" width="25%" v-model="input"></my-form-item>
        <div style="width:25%">
          <my-select :disabled="disabled" label="选择公司" :data.sync="companyData" placeholder="选择公司" company></my-select>
        </div>
      </div>
      <template slot-scope="scope">
          <el-tag v-if="scope.prop === 'tag'" :type="tagType(index,scope.row['tag'])" style="margin-right:10px;" size="mini" v-for="(item,index) in scope.row['tag']" :key="item.id">{{item}}</el-tag>
          <el-tag v-if="scope.prop === 'category'" :type="tagType(index,scope.row['category'])" style="margin-right:10px;" size="mini" v-for="(item,index) in scope.row['category']" :key="item.id">{{item.name}}</el-tag>
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
      option: {
        type: Object,
        default () {
          return {}
        }
      },
    },
    data() {
      return {
        disabled: false,
        companyData: {},
        show: true,
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
    watch: {
      companyData: {
        handler(val) {
          this.$set(this.op, 'company', val._id);
        },
        deep: true
      },
      company: {
        handler(val) {
          if (!this.sys) {
            this.show = false;
            this.companyData = val;
            this.$set(this.op, 'company', val._id);
            setTimeout(() => {
              this.show = true;
            }, 200);
          }
        },
        deep: true
      }
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
        let path = '/sys/goods/brand_edit/';
        if (!this.sys) {
          path = '/goods/brand_edit/';
        }
        this.$router.push({
          path: path + val.row._id,
          query: {
            parentPath: this.$route.path,
            parentName: this.$route.name
          }
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
          this.$set(this.op, key, this.option[key]);
        }
      }
      if (!this.sys) {
        this.companyData = this.company;
        this.$set(this.op, 'company', this.company._id);
        this.disabled = true;
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