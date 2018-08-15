<template>
  <loading-box v-model="loadingText">
    <goods-brand-edmit-item v-if="!loadingText" @sub="sub" :categoryArr="categoryArr"></goods-brand-edmit-item>
  </loading-box>
</template>

<script>
  import GoodsBrandEdmitItem from "./GoodsBrandEdmitItem.vue";
  export default {
    components: {
      GoodsBrandEdmitItem
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
        this.categoryArr = await this.$api.curd({
          model: "category",
          curdType: "find",
          populate: [{
            path: "company"
          }]
        });
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
        // console.log(Object.keys(val.company).length > 0);
        if (this.confirmation(val)) {
          try {
            this.loadingText = "添加中";
            let data = {
              model: "brand",
              curdType: "set",
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
            let res = await this.$api.curd(data);
            this.$message.success("添加成功");
            this.$router.push({
              path: "/sys/goods/brand"
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