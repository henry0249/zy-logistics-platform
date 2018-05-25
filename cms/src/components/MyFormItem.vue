<template>
  <div class="flex ac g-form-item" :style="{width:(width || $parent.width)||'100%'}">
    <slot name="label">
      <div class="tf1" v-if="label" :style="{width:labelWidth || $parent.labelWidth,fontSize:fontSize}">
        {{label}}
      </div>
    </slot>
    <div class="f1">
      <slot>
        <el-input v-if="$attrs.input!==undefined" v-model="value" v-bind="$attrs" :size="size||$parent.size">
        </el-input>
        <el-select v-if="$attrs.select!==undefined" v-model="value" v-bind="$attrs" :size="size||$parent.size">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input-number v-if="$attrs.number!==undefined" v-model="value" v-bind="$attrs" :size="size||$parent.size">
        </el-input-number>
        <el-switch v-if="$attrs.switch!==undefined" v-model="value" v-bind="$attrs" :size="size||$parent.size">
        </el-switch>
        <el-time-select v-if="$attrs.time!==undefined" v-model="value" v-bind="$attrs" :size="size||$parent.size">
        </el-time-select>
        <el-date-picker v-if="$attrs.date!==undefined" v-model="value" v-bind="$attrs" :size="size||$parent.size">
        </el-date-picker>
        <el-date-picker v-if="$attrs.datetime!==undefined" v-model="value" v-bind="$attrs" :size="size||$parent.size" type="datetime">
        </el-date-picker>
        <el-color-picker v-if="$attrs.color!==undefined" v-model="value"></el-color-picker>
        <el-rate v-if="$attrs.rate!==undefined" v-model="value"></el-rate>
        <el-checkbox v-if="$attrs.checkbox!==undefined" v-model="value"></el-checkbox>
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
      type: Array,
      default() {
        return [];
      }
    },
    label: {
      type: String,
      default: ""
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
  },
  mounted() {
    console.log(this.$attrs);
  }
};
</script>

<style scoped>
.g-form-item {
  color: #606266;
}
</style>