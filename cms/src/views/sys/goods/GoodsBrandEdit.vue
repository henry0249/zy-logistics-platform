<template>
  <loading-box v-model="loadingText">
    <goods-brand-edit-item :sys="sys" v-if="!loadingText" @sub="sub" type="edit" :startData="startData" :categoryArr="categoryArr"></goods-brand-edit-item>
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
      },
    },
    data() {
      return {
        loadingText: "",
        startData: {},
        categoryArr: []
      };
    },
    methods: {
      async sub(val) {
        if (this.confirmation(val)) {
          try {
            let data = {
              find: {
                _id: this.$route.params._id
              }
            };
            this.$set(data, "update", {
              name: val.name,
              type: val.type,
              tag: val.tag,
              category: val.category
            });
            if (val.company) {
              this.$set(data.update, "company", val.company._id);
            } else {
              delete data.update.company;
            }
            let res = await this.$api.sys.updateBrand(data);
            this.$message.success("修改成功！");
            let path = '/sys/goods/brand';
            if (!this.sys) path = '/goods/brand';
            this.$router.push({
              path
            });
          } catch (error) {}
        }
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
      async getBrandById() {
        this.startData = await this.$api.sys.getBrandFindOne({
          _id: this.$route.params._id,
          populate: [{
            path: "company"
          }]
        });
      },
      async getCategory() {
        this.categoryArr = await this.$api.sys.getCategory({
          populate: [{
            path: "company"
          }]
        });
      }
    },
    async created() {
      try {
        this.loadingText = "加载中";
        await this.getBrandById();
        await this.getCategory();
      } catch (error) {}
      this.loadingText = "";
    }
  };
</script>

<style scoped>

</style>