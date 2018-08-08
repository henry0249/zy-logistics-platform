<template>
  <div class="flex ac g-form-item" :style="{width:(width || $parent.width)||'100%'}">
    <slot name="label">
      <div class="tf1" v-if="label" :style="{width:labelWidth || $parent.labelWidth,fontSize:fontSize}">
        {{label}}
      </div>
    </slot>
    <div style="position:relative" class="f1" v-if="!slotLoading" >
      <div class="disable-hide" v-if="$parent.edit===false || edit===false">

      </div>
      <slot>
        <el-select style="width:100%" :style="itemStyle" v-if="$attrs.select!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size" @change="change">
          <el-option v-for="item in json2arr($attrs.options)" :key="item._id||item.value || item.id" :label="item.name || item.label" :value="item._id||item.value">
          </el-option>
        </el-select>
        <el-input-number style="width:100%" :style="itemStyle" v-else-if="$attrs.number!==undefined" v-model="data" controls-position="right" v-bind="$attrs" :size="size||$parent.size"></el-input-number>
        <el-switch  :style="itemStyle" v-else-if="$attrs.switch!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size" @change="change"></el-switch>
        <el-time-select style="width:100%"  :style="itemStyle" v-else-if="$attrs.time!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size"></el-time-select>
        <el-date-picker style="width:100%" :style="itemStyle" v-else-if="$attrs.date!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size"></el-date-picker>
        <el-date-picker style="width:100%" :style="itemStyle" v-else-if="$attrs.datetime!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size" type="datetime"></el-date-picker>
        <el-color-picker style="width:100%" :style="itemStyle" v-else-if="$attrs.color!==undefined" v-model="data"></el-color-picker>
        <el-rate v-else-if="$attrs.rate!==undefined" v-model="data"></el-rate>
        <el-checkbox v-else-if="$attrs.checkbox!==undefined" v-model="data"></el-checkbox>
        <el-cascader style="width:100%" :style="itemStyle" v-else-if="$attrs.cascader!==undefined" :options="$attrs.options" v-model="data" v-bind="$attrs" :size="size||$parent.size" @change="change"></el-cascader>
        <el-cascader style="width:100%" :style="itemStyle" v-else-if="$attrs.area!==undefined && !areaLoading" :options="areaData" v-model="data" :props="{value:'_id',label:'name'}" v-bind="$attrs" :size="size||$parent.size" @change="areaChange"></el-cascader>
        <el-cascader style="width:100%" :style="itemStyle" v-else-if="$attrs.transfer!==undefined && !areaLoading" :options="transferData" v-model="data" :props="{value:'_id',label:'name'}" v-bind="$attrs" :size="size||$parent.size" @change="transferChange"></el-cascader>
        <!-- <el-select style="width:100%" v-else-if="$attrs.transfer!==undefined && !areaLoading" v-model="data" v-bind="$attrs" :size="size||$parent.size" @change="change">
          <el-option v-for="item in transferData" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select> -->
        <el-popover v-else-if="$attrs.input!==undefined && $attrs.popover!==undefined" placement="bottom" trigger="click">
          <el-input slot="reference" style="width:100%" :style="itemStyle" v-model="data" v-bind="$attrs" :size="size||$parent.size" @change="change"></el-input>
          <slot name="inputPopover">
          </slot>
        </el-popover>
        <div class="info" style="line-height:28px;padding:0 0px" :style="itemStyle" v-else-if="$attrs.text!==undefined">{{data}}</div>
        <el-input style="width:100%" :style="itemStyle" v-else v-model="data" v-bind="$attrs" :size="size||$parent.size" @change="change"></el-input>
      </slot>
    </div>
  </div>
</template>

<script>
import MyForm from "./MyForm";
export default {
  extends: MyForm,
  props: ["value", "label", "itemStyle"],
  data() {
    return {
      data: "",
      areaData: [],
      transferData: [],
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
    transferChange(val) {
      this.$emit("change", val);
    },
    async getAreaData() {
      this.areaLoading = true;
      if (this.$attrs.area !== undefined) {
        try {
          this.areaData = await this.$ajax("/area/cascader");
        } catch (error) {}
      }
      if (this.$attrs.transfer !== undefined) {
        try {
          this.transferData = await this.$ajax("/transfer/cascader");
        } catch (error) {}
      }
      this.areaLoading = false;
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
.disable-hide {
  position: absolute;
  height: 100%;
  width: 100%;
  background: transparent;
  z-index: 100;
  cursor: not-allowed;
}
</style>