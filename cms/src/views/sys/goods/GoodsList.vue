<template>
  <loading-box v-model="loadingText">
    <common-table v-if="show" path="/goods/find" :thead="thead" :option="op">
      <div slot="header" class="jc js">
        <my-form-item size="mini" style="padding-right:10px;" @change="inputChange" input label="商品名" placeholder="请输入商品名" width="25%" v-model="input"></my-form-item>
        <my-form-item width='25%' label="选择品牌" @change="brandChange" style="padding-right:10px;" size="mini" collapse-tags placeholder="选择品牌" v-model="brandData" :options="brandArr" select></my-form-item>
        <my-form-item @change="categoryChange" label="选择分类" style="padding-right:10px;" filterable width="25%" size="mini" placeholder="选择分类" v-model="categoryData" :options="categoryArr" select></my-form-item>
        <div style="width:25%">
          <my-select :disabled="disabled" label="选择公司" :data.sync="companyData" placeholder="选择公司" company></my-select>
        </div>
        <!-- <my-form-item :disabled="disabled" @change="companyChange" label="选择公司" style="padding-right:10px;" filterable width="25%" size="mini" placeholder="选择公司" v-model="companyData" :options="companyArr" select></my-form-item> -->
      </div>
      <template slot-scope="scope" v-if="scope.prop === 'tag'||scope.prop === 'name'">
            <el-tag v-if="scope.prop === 'tag'" :type="tagType(index,scope.row['tag'])" style="margin-right:10px;" size="mini" v-for="(item,index) in scope.row['tag']" :key="item.id">{{item}}</el-tag>
            <i title="点击查看详情" class="pointer name-txt" v-if="scope.prop === 'name'" @click="see({type:'read',value:scope})">{{scope.row['name']}}</i>
</template>
    </common-table>
  </loading-box>
</template>

<script>
  export default {
    props: {
      sys: {
        type: Boolean,
        default: true
      },
      isShow: {
        type: Boolean,
        default: false
      },
      path: {
        type: String,
        default: "/sys/goods/edmit"
      },
      thead: {
        type: Object,
        default () {
          return {
            name: {
              readOnly: true,
              slot: true,
              name: "名称"
            },
            "brand.name": {
              readOnly: true,
              name: "品牌"
            },
            "category.name": {
              readOnly: true,
              name: "分类"
            },
            unit: {
              readOnly: true,
              name: "单位"
            },
            tag: {
              name: "标签",
              readOnly: true,
              slot: true
            }
          };
        }
      },
      option: {
        type: Object,
        default () {
          return {};
        }
      }
    },
    data() {
      return {
        disabled: false,
        show: true,
        op: {
          // company:'5b728c9aea70bf646696efb1'
        },
        input: "",
        brandData: "",
        categoryData: "",
        companyData: {},
        loadingText: "",
        brandArr: [],
        categoryArr: [],
        companyArr: []
      };
    },
    watch: {
      companyData(val){
        console.log(val);
      },
      loadingText(val) {
        if (val) {
          this.show = false;
        } else {
          this.show = true;
        }
      },
      company: {
        async handler(val) {
          if (!this.sys) {
            this.show = false;
            this.companyData = val;
            this.$set(this.op, "company", val._id);
            setTimeout(() => {
              this.show = true;
            }, 200);
            await this.getBrand();
          }
        },
        deep: true
      },
      isShow(val) {
        if (val) {
          this.show = false;
          setTimeout(() => {
            this.show = true;
          }, 200);
        }
      }
    },
    methods: {
      see(obj) {
        this.$router.push({
          path: this.path + "/" + obj.value.row._id
        });
      },
      tagType(index, arr) {
        let type = ["success", "info", "warning", "danger"];
        if (index <= arr.length - 1) {
          return type[index];
        } else {
          return type[index - arr.length - 1];
        }
      },
      inputChange(val) {
        if (val) {
          this.op.$or = [{
            name: {
              $regex: val
            }
          }];
        }
      },
      brandChange(val) {
        this.$set(this.op, "brand", val);
      },
      categoryChange(val) {
        this.$set(this.op, "category", val);
      },
      companyChange(val) {
        this.$set(this.op, "mfrs", val);
      },
      async getBrand() {
        try {
          let data = {
            model: "brand",
            curdType: "find"
          }
          if (!this.sys) {
            this.$set(data, 'company', this.company._id);
          }
          this.brandArr = await this.$api.curd(data);
        } catch (error) {}
      },
      async getCategory() {
        try {
          this.categoryArr = await this.$api.curd({
            model: "category",
            curdType: "find"
          });
        } catch (error) {}
      },
      async getCompany() {
        try {
          this.companyArr = await this.$api.curd({
            model: "company",
            curdType: "find"
          });
        } catch (error) {}
      }
    },
    async created() {
      this.loadingText = "加载中";
      await this.getBrand();
      await this.getCategory();
      // await this.getCompany();
      if (!this.sys) {
        this.disabled = true;
        this.companyData = this.company;
        this.$set(this.op, "company", this.company._id);
        this.show = false;
        setTimeout(() => {
          this.show = true;
        }, 200);
      }
      this.loadingText = "";
    }
  };
</script>

<style scoped>
  .goods-box {
    width: calc(100% - 40px);
    margin: 0 auto;
  }
  .name-txt {
    color: #42a5f5;
  }
  .name-txt:hover {
    text-decoration: underline;
  }
</style>