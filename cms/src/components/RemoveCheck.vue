<template>
  <el-popover placement="top" width="180" v-model="visible">
    <slot>
      <div style="padding:10px 0">
        删除操作无法恢复,是否确定删除？
      </div>
    </slot>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" type="text" @click="cancel">取消</el-button>
      <el-button type="danger" size="mini" @click="remove">确定删除</el-button>
    </div>
    <span class="pointer" slot="reference" :style="{color:color}">
      {{label}}
      <i class="el-icon-delete"></i>
    </span>
  </el-popover>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "#F56C6C"
    }
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    remove() {
      this.visible = false;
      this.$emit("remove");
    },
    cancel() {
      this.visible = false;
      this.$emit("cancel");
    }
  }
};
</script>

<style scoped>
</style>