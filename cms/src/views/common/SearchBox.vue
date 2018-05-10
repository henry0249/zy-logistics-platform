<template>
  <div class="flex ac">
    <el-input placeholder="请输入关键词进行搜索" v-model="value">
      <el-button icon="el-icon-menu" slot="prepend" v-popover:popover type="primary">搜索选项</el-button>
      <el-button @click="search" slot="append" icon="el-icon-search" type="primary">搜索</el-button>
    </el-input>
    <el-popover ref="popover" width="800" placement="bottom-start" style="padding:5px;font-size:14px">
      <div class="flex ac jb" style="padding:10px 0;flex-wrap: wrap">
        <div style="margin-bottom:10px" class="flex ac" v-for="(item,index) in filed" :key="index">
          <div style="width:60px">
            {{item.keyValue}}
          </div>
          <el-select style="margin-left:10px;width:170px" size="small" v-model="value" placeholder="请选择">
            <el-option v-for="v in item.options" :key="v.value" :label="v.label" :value="v.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
  import filed from "./filed";
  import {
    Select,
    Option,
    OptionGroup,
    Popover,
    Input,
    Button
  } from "element-ui";
  export default {
    components: {
      [Select.name]: Select,
      [Option.name]: Option,
      [OptionGroup.name]: OptionGroup,
      [Popover.name]: Popover,
      [Input.name]: Input,
      [Button.name]: Button
    },
    data() {
      return {
        filed: filed,
        loading: false,
        value: ''
      }
    },
    methods: {
      search() {}
    },
    created() {
      this.$powerFilter(this.user)
    }
  };
</script>

<style scoped>
  .g-input {
    border: 1px solid rgb(220, 223, 230);
    background: #fff;
    padding: 7px 5px;
    border-radius: 4px;
    margin-left: 10px;
    width: 160px;
  }
  .g-input input {
    background: none;
    border: none;
    outline: none;
    width: 40%;
    text-align: center;
  }
</style>