<template>
  <div class="edmit-box">
    <div class="edmit-list-box">
      <div class="edmit-span-box" v-for="item in keyArr" :key="item.id">
        <span class="edmit-span">{{item.keyValue}}</span>
        <el-input v-if="item.type == 'input'" v-model="item.value" :placeholder="`请输入${item.keyValue}`" style="width:222px;"></el-input>
        <el-select v-else-if="item.type == 'select'" v-model="item.value" :placeholder="'请选择'+item.keyValue" style="width:222px;">
          <el-option v-for="v in item.options" :key="v.id" :label="v.label" :value="v.value">
          </el-option>
        </el-select>
        <el-upload v-else-if="item.type =='upload' " class="upload-demo" :action="item.action" :file-list="fileList2" list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <div class="flex arr-box" v-else-if="item.type == 'Arr'" style="width:380px;">
          <el-tag :key="tag" v-for="tag in item.options" closable :disable-transitions="false" @close="handleClose(item.options,tag)">
            {{tag}}
          </el-tag>
          <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(item.options)" @blur="handleInputConfirm(item.options)">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">添加新标签</el-button>
        </div>
        <el-input type="textarea" autosize v-else-if="item.type == 'textarea'" v-model="item.value" :placeholder="'请输入'+item.keyValue" style="width:380px;"></el-input>
        <el-switch @change="switchChange" v-else-if="item.type == 'switch'" v-model="item.value" :active-text="item.options[0]" :inactive-text="item.options[1]">>
        </el-switch>
      </div>
    </div>
    <div class="edmit-btm-box">
      <el-button style="float:right" size="mini" type="success">提交修改</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      keyData: {
        type: Object,
        default () {
          return {}
        }
      },
      keyArr: {
        type: Array,
        default () {
          return []
        }
      },
      str: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        inputVisible: false,
        inputValue: '',
      }
    },
    methods: {
      switchChange(val) {
        console.log(val);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm(options) {
        let inputValue = this.inputValue;
        if (inputValue) {
          options.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
        console.log(options);
      },
      handleClose(options, tag) {
        options.splice(options.indexOf(tag), 1);
      },
    },
    created() {
      console.log('this.keyArr', this.keyArr);
      console.log('this.keyData', this.keyData);
    }
  }
</script>

<style scoped>
  .edmit-box {
    width: 100%;
    max-height: calc(85vh - 190px);
    overflow: auto;
  }
  .edmit-list-box {
    width: 100%;
    max-height: calc(100% - 30px);
    overflow: auto;
  }
  .edmit-span-box {
    float: left;
  }
  .edmit-span {
    width: 100%;
    display: block;
    float: left;
  }
  .edmit-btm-box {
    width: 100%;
    height: 30px
  }
</style>