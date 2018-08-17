<template>
  <div class="fex jc js">
    <my-form-item @change="inputChange" style="padding-right:10px;" width="25%" size="mini" v-model="input" placeholder="输入名称搜索"></my-form-item>
    <!-- <my-form-item @change="companyChange" style="padding-right:10px;" filterable width="25%" size="mini" label="生产厂商" placeholder="选择生产厂商" v-model="companyData" :options="companyArr" select></my-form-item> -->
    <common-select style="padding-right:10px;" label="生产厂商" :data.sync="companyData" border width="25%" placeholder="选择生产厂商" type="company" size="mini" :option="companyOption"></common-select>
    <my-form-item @change="brandChange" style="padding-right:10px;" filterable width="25%" size="mini" label="品牌" placeholder="选择品牌" v-model="brand" :options="brandArr" select></my-form-item>
    <my-form-item @change="categoryChange" style="padding-right:10px;" filterable width="25%" size="mini" label="分类" placeholder="选择分类" v-model="category" :options="categoryArr" select></my-form-item>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      input: "",
      brand: "",
      brandArr: [],
      companyData: "",
      category: "",
      companyOption:{
        type:{
          $in:['shipper']
        }
      },
      companyArr: [],
      categoryArr: []
    };
  },
  methods: {
    inputChange(val) {
      let obj = JSON.parse(JSON.stringify(this.data));
      obj.$or = [
        {
          name: {
            $regex: val
          }
        }
      ];
      this.$emit("update:data", obj);
    },
    companyChange(val) {
      let obj = JSON.parse(JSON.stringify(this.data));
      obj.mfrs = val;
      this.$emit("update:data", obj);
    },
    brandChange(val) {
      let obj = JSON.parse(JSON.stringify(this.data));
      obj.brand = val;
      this.$emit("update:data", obj);
    },
    categoryChange(val) {
      let obj = JSON.parse(JSON.stringify(this.data));
      obj.category = val;
      this.$emit("update:data", obj);
    },
    async getBrand() {
      try {
        this.brandArr = await this.$api.curd({
          model: "brand",
          curdType: "find",
          limit: 0
        });
      } catch (error) {}
    },
    async getCompany() {
      try {
        this.companyArr = await this.$api.curd({
          model: "company",
          curdType: "find",
          limit: 0
        });
      } catch (error) {}
    },
    async getCategory() {
      try {
        this.companyArr = await this.$api.curd({
          model: "category",
          curdType: "find",
          limit: 0
        });
      } catch (error) {}
    }
  },
  async created() {
    await this.getBrand();
    await this.getCompany();
    delete this.data.input;
    delete this.data.brand;
    delete this.data.mfrs;
  }
};
</script>

<style scoped>
</style>