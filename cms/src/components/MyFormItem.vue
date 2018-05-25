<template>
  <div class="flex ac g-form-item" :style="{width:(width || $parent.width)||'100%'}">
    <slot name="label">
      <div class="tf1" v-if="label" :style="{width:labelWidth || $parent.labelWidth,fontSize:fontSize}">
        {{label}}
      </div>
    </slot>
    <div class="f1">
      <slot>
        <el-select style="width:100%" v-if="$attrs.select!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size">
          <el-option v-if="is('array',options)" v-for="(item,index) in options" :key="item._id||item.num||item.value||item.id" :label="item.label||item.name||item.mobile" :value="item._id||item.num||item.value||index">
          </el-option>
          <el-option v-if="is('json',options)" v-for="(item,key) in options" :key="key" :label="item" :value="key">
          </el-option>
        </el-select>
        <el-input style="width:100%" v-if="$attrs.input!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size"></el-input>
        <el-input-number style="width:100%" v-if="$attrs.number!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size"></el-input-number>
        <el-switch v-if="$attrs.switch!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size"></el-switch>
        <el-time-select style="width:100%" v-if="$attrs.time!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size"></el-time-select>
        <el-date-picker style="width:100%" v-if="$attrs.date!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size"></el-date-picker>
        <el-date-picker style="width:100%" v-if="$attrs.datetime!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size" type="datetime"></el-date-picker>
        <el-color-picker style="width:100%" v-if="$attrs.color!==undefined" v-model="data"></el-color-picker>
        <el-rate v-if="$attrs.rate!==undefined" v-model="data"></el-rate>
        <el-checkbox v-if="$attrs.checkbox!==undefined" v-model="data"></el-checkbox>
        <el-cascader style="width:100%" v-if="$attrs.cascader!==undefined" :options="options" v-model="data" v-bind="$attrs" :size="size||$parent.size"></el-cascader>
      </slot>
    </div>
  </div>
</template>

<script>
import MyForm from "./MyForm";
export default {
  extends: MyForm,
  props: {
    value: {},
    options: {
      type: [Array, Object],
      default() {
        return [];
      }
    },
    label: {
      type: String,
      default: ""
    }
  },
  created() {
    let defaultDataOptions = {
      select: "",
      input: "",
      number: 0,
      switch: false,
      time: "",
      date: "",
      datetime: "",
      color: "",
      rate: 0,
      cascader: []
    };
    for (const key in defaultDataOptions) {
      if (this.$attrs.hasOwnProperty(key)) {
        this.data = defaultDataOptions[key];
      }
    }
  },
  data() {
    return {
      data: ""
    };
  },
  watch: {
    data(val) {
      if (this.value !== undefined) {
        this.$emit("input", val);
      }
    }
  },
  computed: {
    fontSize() {
      let option = {
        large: "15px",
        medium: "14px",
        small: "13px",
        mini: "12px"
      };
      if (this.labelSize) {
        return this.labelSize;
      } else {
        return option[this.size || this.$parent.size] || "15px";
      }
    }
  }
};
</script>

<style scoped>
.g-form-item {
  color: #606266;
}
</style>