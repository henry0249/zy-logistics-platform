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
    props: {
      sys: {
        type: Boolean,
        default: true
      },
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
          let res = await this.$api.sys.updateCategory(data)
          this.$message.success("修改成功！");
          let path = '/sys/goods/category';
          if (!this.sys) path = '/goods/category';
          this.$router.push({
            path: path
          });
        } catch (error) {}
      },
      async getCategoryById() {
        this.startData = await this.$api.sys.getCategoryFindOne({
          _id: this.$route.params._id
        });
        if (this.startData.parent) {
          this.haveParent = true;
        }
      },
      async getParentCategory() {
        let data = {
          limit: 0,
          parent: {
            $exists: false
          }
        };
        this.parentCategoryArr = await this.$api.sys.getCategory(data);
      }
    },
    async created() {
      try {
        this.loadingText = "加载中";
        await this.getCategoryById();
        await this.getParentCategory();
      } catch (error) {
        console.log(error);
      }
      this.loadingText = "";
    }
  };
</script>

<style scoped>

</style>