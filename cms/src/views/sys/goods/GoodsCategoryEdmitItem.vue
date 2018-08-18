<template>
  <div class="g-order-create">
    <div class="g-order">
      <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
        <strong>{{type === 'add'?'添加分类':'分类详情'}}</strong>
      </div>
      <common-alert style="margin:15px 0">分类信息</common-alert>
      <my-form size="mini" width="24%" style="margin:15px 0">
        <div class="flex jb">
          <my-form-item input v-model="categoryData.name" filterable label="分类名"></my-form-item>
          <my-form-item input v-model="categoryData.desc" filterable label="描述"></my-form-item>
          <my-form-item input v-model="categoryData.remark" filterable label="备注"></my-form-item>
          <my-form-item collapse-tags v-if="haveParent" select v-model="categoryData.parent" label="父级分类" :options="parentCategoryArr"></my-form-item>
          <div style="width:24%" v-if="!haveParent"></div>
        </div>
      </my-form>
    </div>
    <div class="tr" style="margin-top:30px">
      <el-button size="small" @click="$router.go(-1)">返 回</el-button>
      <el-button size="small" type="primary" @click="sub">{{type === 'add'?'添 加':'修 改'}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    haveParent:{
      type:Boolean,
      default:false
    },
    parentCategoryArr: {
      type: Array,
      default() {
        return [];
      }
    },
    type: {
      type: String,
      default: "add"
    },
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    startData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      loadingText: "",
      categoryData: {
        name: "",
        desc: "",
        remark: "",
        parent: ""
      }
    };
  },
  methods: {
    async sub() {
      this.$emit("sub", this.categoryData);
    }
  },
  created() {
    if (this.type === "edmit") {
      this.categoryData = JSON.parse(JSON.stringify(this.startData));
      console.log(this.startData);
    }
  }
};
</script>

<style scoped>
.g-order-create {
  padding: 3% 5%;
}
.g-order {
  margin: 0 auto;
  padding: 30px;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>