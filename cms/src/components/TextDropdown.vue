<template>
  <el-dropdown @command="handleCommand" trigger="click">
    <div style="font-size:12px">
      <span :style="{color:label(value).color}">{{label(value).text}}</span>
      <i class="el-icon-caret-bottom info"></i>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="dropdownItem in json2arr(options)" :key="dropdownItem._id||dropdownItem.value || dropdownItem.id" :command="JSON.stringify(dropdownItem)" :disabled="dropdownItem.disabled">
        <span :style="{color:label(dropdownItem.value).color}">{{label(dropdownItem.value).text}}</span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: 0
    },
    options: {
      type: [Object, Array],
      default() {
        return {};
      }
    },
    color:{
      type: [Object, Array],
      default() {
        return [];
      }
    }
  },
  computed: {
    
  },
  methods: {
    label(value) {
      let res = {
        text: "未选",
        color: "#606266"
      };
      let arr = this.json2arr(this.options);
      arr.forEach((item, index) => {
        if (item.value == value) {
          res.text = item.name || item.label;
          if (this.color[index]) {
            res.color = this.color[index]
          }
        }
      });
      return res;
    },
    handleCommand(item) {
      let val = JSON.parse(item);
      this.$emit("input", val.value);
    }
  }
};
</script>

<style scoped>
</style>