<template>
  <div class="flex add-box">
    <div class="form-box">
      <el-form :model="ruleForm" label-position="left" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item v-for="(item,index) in list" :key="index" :label="item.keyValue" :prop="item.key">
          <el-input style="width:300px;" v-if="item.type == 'input'" v-model="ruleForm[item.key]"></el-input>
          <el-select style="width:300px;" v-if="item.type == 'select'" v-model="ruleForm[item.key]" placeholder="请选择">
            <el-option v-for="v in item.options" :key="v.id" :label="v.label" :value="v.value">
            </el-option>
          </el-select>
          <el-date-picker @change="timeChange" style="width:300px;" v-if="item.type == 'date'" v-model="ruleForm[item.key]" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import rules from './rules';
  import addKey from './addKey';
  export default {
    data() {
      return {
        ruleForm: {
          PublishingCompany: '',
          transportation: '',
          startAt: '',
          endAt: '',
          commodityType: '',
          price: '',
          tonnage: '',
          destination: '',
          from: '',
        },
        list: addKey,
        rules,
      };
    },
    methods: {
      timeChange(val) {
        console.log(val);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style scoped>
  .add-box {
    height: calc(100vh - 41px);
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .form-box {
    width: 600px;
  }
</style>
