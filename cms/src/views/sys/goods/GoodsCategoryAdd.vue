<template>
  <loading-box v-model="loadingText">
    <goods-category-edmit-item @sub="sub" haveParent :parentCategoryArr="parentCategoryArr">
    </goods-category-edmit-item>
  </loading-box>
</template>

<script>
import GoodsCategoryEdmitItem from "./GoodsCategoryEdmitItem.vue";
export default {
  components: {
    GoodsCategoryEdmitItem
  },
  data() {
    return {
      loadingText: "",
      parentCategoryArr:[]
    };
  },
  methods: {
    async sub(val) {
      this.loadingText = "添加中";
      try {
        let op = {
          model: "category",
          curdType: "set"
        };
        Object.assign(op, {
          name: val.name,
          desc: val.desc,
          remark: val.remark
        });
        if (val.parent) {
          this.$set(op, "parent", val.parent);
        } else {
          delete op.parent;
        }
        let res = await this.$api.curd(op);
        this.$message.success("添加成功！");
        this.$router.push({
          path: "/sys/goods/category"
        });
      } catch (error) {}
      this.loadingText = "";
    },
    async getParentCategory() {
      this.loadingText = "加载中";
      try {
        this.parentCategoryArr = await this.$api.curd({
          model: "category",
          curdType: "find",
          parent: {
            $exists: false
          }
        });
      } catch (error) {}
      this.loadingText = "";
    }
  },
  async created() {
    await this.getParentCategory();
  }
};
</script>

<style scoped>
</style>