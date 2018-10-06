<template>
  <div class="g-order-create">
    <div class="g-order">
      <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
        <strong>{{type === 'add'?'添加品牌':'分类详情'}}</strong>
      </div>
      <common-alert style="margin:15px 0">分类信息</common-alert>
      <my-form size="mini" width="24%" style="margin:15px 0">
        <div class="flex jb">
          <my-form-item input v-model="brandData.name" filterable label="品牌名"></my-form-item>
          <my-form-item input v-model="brandData.type" filterable label="类型"></my-form-item>
          <my-form-item multiple collapse-tags select v-model="brandData.category" label="所属分类" :options="categoryArr"></my-form-item>
          <div style="width:24%">
            <my-select :disabled="disabled" label="所属公司" :data.sync="brandData.company" company></my-select>
          </div>
        </div>
        <div class="flex form-box" style="margin-top:20px;">
          <div class="flex jc js">
            <span style="width:60px;font-size: 12px;">标签</span>
            <el-tag size="mini" style="margin-right:5px;" :key="tag.id" v-for="tag in brandData.tag" closable :disable-transitions="false" @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input style="width:60px" size="mini" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="mini" @click="showInput">添加标签</el-button>
          </div>
        </div>
      </my-form>
    </div>
    <div class="tr" style="margin-top:30px">
      <el-button size="small" @click="$router.go(-1)">返 回</el-button>
      <el-button size="small" type="primary" @click="sub">{{type === 'add'?'添加':'修改'}}</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      sys: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        default: "add"
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
      },
      companyArr: {
        type: Array,
        default () {
          return [];
        }
      },
      categoryArr: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    data() {
      return {
        disabled: false,
        inputValue: '',
        inputVisible: false,
        brandData: {
          name: "",
          tag: [],
          type: "",
          category: [],
          company: {}
        }
      };
    },
    watch: {
      company: {
        handler(val) {
          if (!this.sys) {
            this.$set(this.brandData, 'company', val);
            if (this.type === 'edit') {
              this.$router.push({path:'/goods/brand'})
            }
          }
        },
        deep: true
      }
    },
    methods: {
      handleClose(tag) {
        this.brandData.tag.splice(this.brandData.tag.indexOf(tag), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.brandData.tag.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = "";
      },
      sub() {
        this.$emit('sub', this.brandData);
      }
    },
    created() {
      if (this.type === 'edit') {
        this.brandData = JSON.parse(JSON.stringify(this.startData));
      }
      if (!this.sys) {
        this.$set(this.brandData, 'company', this.company);
        this.disabled = true;
      }
    }
  };
</script>

<style scoped>
  .g-order-create {
    padding: 0 1% 1% 1%;
  }
  .g-order {
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>