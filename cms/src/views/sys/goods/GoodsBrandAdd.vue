<template>
  <loading-box v-model="loadingText">
    <goods-brand-edit-item v-if="!loadingText" :sys="sys" @sub="sub" :categoryArr="categoryArr"></goods-brand-edit-item>
  </loading-box>
</template>

<script>
  import GoodsBrandEditItem from "./GoodsBrandEditItem.vue";
  export default {
    components: {
      GoodsBrandEditItem
    },
    props: {
      sys: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        loadingText: "",
        companyArr: [],
        categoryArr: []
      };
    },
    methods: {
      async getCategory() {
        let data = {
          limit: 0,
          populate: [{
            path: "company"
          }]
        }
        if(!this.sys) data.company = this.comapny._id;
        this.categoryArr = await this.$api.sys.getCategory(data);
      },
      confirmation(val) {
        let returnIo = true;
        if (!val.name) {
          this.$message.warn("品牌名是必填的！");
          returnIo = false;
        } else if (!val.category) {
          this.$message.success("所属分类是必选的！");
          returnIo = false;
        }
        return returnIo;
      },
      async sub(val) {
        if (this.confirmation(val)) {
          try {
            this.loadingText = "添加中";
            let data = {
              name: val.name,
              type: val.type,
              tag: val.tag,
              category: val.category
            };
            if (Object.keys(val.company).length > 0) {
              this.$set(data, "company", val.company._id);
            } else {
              delete data.company;
            }
            let res = await this.$api.sys.addBrand(data);
            this.$message.success("添加成功");
            let path = this.sys ? '/sys/goods/brand' : '/goods/brand'
            this.$router.push({
              path
            });
          } catch (error) {}
          this.loadingText = "";
        }
      }
    },
    async created() {
      this.loadingText = "加载中";
      try {
        await this.getCategory();
      } catch (error) {}
      this.loadingText = "";
    }
  };
</script>

<style scoped>

</style>