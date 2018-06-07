<template>
  <div class="flex ac g-form-item" :style="{width:(width || $parent.width)||'100%'}">
    <slot name="label">
      <div class="tf1" v-if="label" :style="{width:labelWidth || $parent.labelWidth,fontSize:fontSize}">
        {{label}}
      </div>
    </slot>
    <div class="f1" v-if="!slotLoading">
      <slot>
        <el-select ref="select" style="width:100%" v-if="$attrs.select!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size" @change="change">
          <el-option v-for="item in json2arr($attrs.options)" :key="item._id||item.value || item.id" :label="item.name || item.label" :value="item._id||item.value">
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
        <el-cascader style="width:100%" v-if="$attrs.cascader!==undefined" :options="$attrs.options" v-model="data" v-bind="$attrs" :size="size||$parent.size" @change="change"></el-cascader>
        <el-cascader style="width:100%" v-if="$attrs.area!==undefined && !areaLoading" :options="areaData" v-model="data" :props="{value:'_id',label:'name'}" v-bind="$attrs" :size="size||$parent.size" @change="areaChange"></el-cascader>
      </slot>
    </div>
  </div>
</template>

<script>
import MyForm from "./MyForm";
export default {
  extends: MyForm,
  props: ["value", "label"],
  data() {
    return {
      data: "",
      areaData: [],
      areaLoading: true,
      slotLoading: true
    };
  },
  watch: {
    data(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.data = val;
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

  methods: {
    change(val) {
      this.$emit("change", val);
    },
    areaChange(val) {
      this.$emit("change", val);
    },
    async getAreaData() {
      if (this.$attrs.area !== undefined) {
        this.areaLoading = true;
        try {
          this.areaData = await this.$ajax("/area/cascader");
          this.areaLoading = false;
        } catch (error) {
          console.log(error);
        }
      }
    }
  },
  async created() {
    this.slotLoading = true;
    await this.getAreaData();
    this.data = this.value;
    setTimeout(() => {
      this.slotLoading = false;
    }, 50);
  }
};
</script>

<style scoped>
.g-form-item {
  color: #606266;
}
</style>