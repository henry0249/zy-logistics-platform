<template>
  <div class="see-box">
    <div class="flex list-box" v-for="(item,index) in keyArr" :key="index">
      <span style="width:100px">{{item.keyValue}}</span>
      <el-input v-if="item.type == 'input'" v-model="item.value" :placeholder="`请输入${item.keyValue}`" style="width:222px;"></el-input>
      <el-select v-else-if="item.type == 'select'" v-model="item.value" :placeholder="'请选择'+item.keyValue" style="width:222px;">
        <el-option v-for="v in item.options" :key="v.id" :label="v.label" :value="v.value">
        </el-option>
      </el-select>
      <el-upload v-else-if="item.type =='upload' " class="upload-demo" :action="item.action" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList2" list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <div class="flex arr-box" v-else-if="item.type == 'Arr'" style="width:380px;">
        <el-tag :key="tag" v-for="tag in item.options">
          {{tag}}
        </el-tag>
      </div>
      <el-input type="textarea" autosize v-else-if="item.type == 'textarea'" v-model="item.value" :placeholder="'请输入'+item.keyValue" style="width:380px;"></el-input>
    </div>
    <div class="flex list-box">
      <el-button @click="$router.go(0)">取消</el-button>
      <el-button type="success" @click="sub">成功按钮</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      keyArr: {
        type: Array,
        default () {
          return []
        }
      },
    },
  }
</script>

<style scoped>
  .see-box {
    width: 100%;
    max-height: calc(85vh - 114px);
    overflow: auto;
  }
  .list-box {
    width: 500px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 20px;
    margin-left: 30px;
  }
  .list-box:last-child {
    justify-content: flex-end;
    width: 480px;
  }
  .arr-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
  .el-tag+.el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>