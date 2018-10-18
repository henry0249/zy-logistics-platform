<template>
  <div>
    <el-tooltip effect="dark" content="仅可从本公司关联的公司中选择" placement="top">
      <my-form-item size="mini" v-model="currentCompany" select :options="list">
      </my-form-item>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: [Number, String, Array, Object],
      default: {}
    },
    data: {
      type: [Number, String, Array, Object],
      default: ""
    }
  },
  data() {
    return {
      list: [],
      currentCompany: ""
    };
  },
  watch: {
    currentCompany(val) {
      this.$emit("update:data", val);
    }
  },
  methods: {
    setlist() {
      console.log(this.order);
    }
  },
  mounted(){
    this.setlist();
  }
};
</script>

<style scoped>
</style>