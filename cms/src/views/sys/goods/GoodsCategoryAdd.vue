<template>
  <loading-box v-model="loadingText">
    <goods-category-edit-item @sub="sub" haveParent :parentCategoryArr="parentCategoryArr">
    </goods-category-edit-item>
  </loading-box>
</template>

<script>
  import GoodsCategoryEditItem from "./GoodsCategoryEditItem.vue";
  export default {
    components: {
      GoodsCategoryEditItem
    },
    props: {
      sys: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        loadingText: "",
        parentCategoryArr: []
      };
    },
    methods: {
      async sub(val) {
        this.loadingText = "添加中";
        try {
          let op = {};
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
          if (!this.sys) op.company = this.company._id;
          let res = await this.$api.sys.addCategory(op);
          this.$message.success("添加成功！");
          let path = "/sys/goods/category";
          if (this.sys) path = '/goods/category';
          this.$router.push({
            path
          });
        } catch (error) {}
        this.loadingText = "";
      },
      async getParentCategory() {
        try {
          this.loadingText = "加载中";
          let data = {
            parent: {
              $exists: false
            }
          }
          if(!this.sys) data.company = this.company._id;
          this.parentCategoryArr = await this.$api.sys.getCategory(data);
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