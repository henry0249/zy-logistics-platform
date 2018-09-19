<template>
  <my-form size="mini" width="24%" style="margin:15px 0">
    <div class="flex jb">
      <my-form-item input v-model="userData.name" filterable label="用户名"></my-form-item>
      <my-form-item size="mini" input v-model="userData.mobile" label="手机号"></my-form-item>
      <my-form-item size="mini" input v-model="userData.type" label="类型"></my-form-item>
      <my-form-item size="mini" input v-model="userData.email" filterable label="邮箱"></my-form-item>
    </div>
    <div class="flex jb" style="margin-top:15px;">
      <div style="width:24%">
        <my-select label="推荐人" :data.sync="userData.recommendedByUser" user></my-select>
      </div>
      <div style="width:24%">
        <my-select label="上级" :data.sync="userData.superior" user></my-select>
      </div>
      <div style="width:24%">
        <my-select label="父级" :data.sync="userData.parent" user></my-select>
      </div>
      <div style="width:24%;"></div>
    </div>
    <div class="flex jb" style="margin-top:15px;">
      <common-multi-selection label="所在区域" :data.sync="userData.area" border title="所在区域" area size="mini"></common-multi-selection>
    </div>
    <div class="flex jb" style="margin-top:15px;">
      <div class="flex jc js edit-tag" style="flex:0 0 25%;">
        <div style="width:60px;fontSize:12px;">标签</div>
        <el-tag size="mini" style="margin-right:10px;" :key="tag" v-for="tag in userData.tag" closable :disable-transitions="false" @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input size="mini" style="width:60px" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
        </el-input>
        <el-button size="mini" v-else class="button-new-tag" @click="showInput">添加</el-button>
      </div>
    </div>
  </my-form>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: ""
      },
      data: {
        type: Object,
        default () {
          return {};
        }
      },
      startData: {
        type: Object,
        default () {
          return {};
        }
      }
    },
    data() {
      return {
        value1: [],
        inputValue: "",
        inputVisible: false,
        userData: {
          name: "",
          mobile: "",
          type: "",
          email: "",
          area: [],
          recommendedByUser: {},
          superior: {},
          parent: {},
          tag: []
        }
      };
    },
    watch: {
      userData: {
        handler(val, oldVal) {
          if (this.type === "add") {
            this.$emit("update:data", val);
          } else if (this.type === "edit") {
            if (oldVal._id) {
              this.$emit("update:data", val);
            }
          }
        },
        deep: true
      }
    },
    methods: {
      handleClose(tag) {
        this.userData.tag.splice(this.userData.tag.indexOf(tag), 1);
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.userData.tag.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = "";
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      }
    },
    created() {
      if (this.type === "edit") {
        this.userData = JSON.parse(JSON.stringify(this.startData));
      }
    }
  };
</script>

<style scoped>

</style>