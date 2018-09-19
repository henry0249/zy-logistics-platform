<template>
  <loading-box v-model="loadingText">
    <goods-category-edit-item v-if="!loadingText" :haveParent="haveParent" :parentCategoryArr="parentCategoryArr" type="edit" @sub="sub" :startData="startData">
    </goods-category-edit-item>
  </loading-box>
</template>

<script>
import GoodsCategoryEditItem from "./GoodsCategoryEditItem.vue";
export default {
  components: {
    GoodsCategoryEditItem
  },
  data() {
    return {
      loadingText: "",
      value: "",
      haveParent: false,
      startData: {},
      parentCategoryArr: []
    };
  },
  methods: {
    async sub(val) {
      try {
        let data = {
          model: "category",
          curdType: "update",
          find: {
            _id: this.$route.params._id
          }
        };
        this.$set(data, "update", {
          name: val.name,
          desc: val.desc,
          remark: val.remark
        });
        if (val.parent) {
          this.$set(data.update, "parent", val.parent);
        } else {
          delete data.update.parent;
        }
        let res = await this.$api.curd(data)
        this.$message.success("修改成功！");
        let path = '/sys/goods/category';
        if (!this.sys) {
          path = '/goods/category';
        }
        this.$router.push({
          path: path
        });
      } catch (error) {}
    },
    async getCategoryById() {
      this.startData = await this.$api.curd({
        model: "category",
        curdType: "findOne",
        _id: this.$route.params._id
      });
      if (this.startData.parent) {
        this.haveParent = true;
      }
    },
    async getParentCategory() {
      this.parentCategoryArr = await this.$api.curd({
        model: "category",
        curdType: "find",
        parent: {
          $exists: false
        }
      });
    }
  },
  async created() {
    try {
      this.loadingText = "加载中";
      await this.getCategoryById();
      await this.getParentCategory();
    } catch (error) {}
    this.loadingText = "";
  }
};
</script>

<style scoped>
</style>