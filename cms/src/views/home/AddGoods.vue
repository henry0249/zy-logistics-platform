<template>
  <div class="add-box">
    <div class="list-box" v-for="(item,index) in keyArr" :key="index">
      <span>{{item.keyValue}}</span>
      <el-input v-if="item.type == 'input'" v-model="item.value" :placeholder="'请输入'+item.keyValue"></el-input>
      <el-select v-if="item.type == 'select'" v-model="value" :placeholder="'请选择'+item.keyValue">
        <el-option v-for="v in item.options" :key="v.value" :label="v.label" :value="v.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        keyArr: [{
          key: 'brand',
          value: '',
          type: 'input',
          keyValue: '品牌'
        }, {
          key: 'name',
          value: '',
          value: '',
          type: 'input',
          keyValue: '名字'
        }, {
          key: 'company',
          value: '',
          type: 'select',
          keyValue: '发布公司',
          options: []
        }]
      }
    },
    methods: {
      async getData() {
        let data = {
          model: 'company',
          curdType: 'find',
          admin: {
            $in: [this.user]
          }
        }
        try {
          let res = await this.$api.curd(data)
          console.log(res);
        } catch (error) {}
      }
    },
    created() {
      this.getData()
    }
  }
</script>

<style scoped>
  .add-box {
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .list-box {
    width: 500px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
</style>