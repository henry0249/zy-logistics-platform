<template>
  <div class="flex add-box" v-loading="loading">
    <div class="flex list-box" v-for="(item,index) in keyArr" :key="index">
      <span style="width:100px;display:inline-block;">{{item.keyValue}}</span>
      <el-input v-if="item.type == 'input'" v-model="item.value" :placeholder="'请输入'+item.keyValue" style="width:222px;"></el-input>
      <el-select v-else-if="item.type == 'select'" v-model="item.value" :placeholder="'请选择'+item.keyValue" style="width:222px;">
        <el-option v-for="v in item.options" :key="v.id" :label="v.label" :value="v.value">
        </el-option>
      </el-select>
      <el-upload v-else-if="item.type =='upload' " class="upload-demo" :action="item.action" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList2" list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <div class="flex arr-box" v-else-if="item.type == 'Arr'" style="width:380px;">
        <el-input v-for="(v,i) in item.options" :key="i" v-model="v.value" :placeholder="'标签'+i" style="width:70px;"></el-input>
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
  import AddKey from './AddKey';
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        fileList2: [],
        loading: false,
        keyArr: AddKey
      }
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      sub() {
        let str = ''
        this.keyArr.forEach(item => {
          if (item.value == null) {
            str += item.keyValue + '、'
          }
        });
        if (str.length > 0) {
          this.$alert(`${str.substr(0,str.length-1)}不能为空`, '提示', {
            confirmButtonText: '确定',
            callback: () => {
              return
            }
          })
        } else {
          this.add()
        }
      },
      async add() {
        this.loading = true
        let data = {
          model: 'goods',
          curdType: 'add',
        }
        this.keyArr.forEach(item => {
          data[item.key] = item.value
        });
        try {
          let res = await this.$api.curd(data)
          console.log(res);
        } catch (error) {}
        this.loading = false
      },
      async getData() {
        this.loading = true
        let data = {
          model: 'user',
          curdType: 'findOne',
          _id: this.user._id,
          populate: [{
            path: 'brand'
          }, {
            path: 'category'
          }, {
            path: 'company'
          }, {
            path: 'platform'
          }]
        }
        try {
          let res = await this.$api.curd(data)
          if (res.company.length > 0) {
            this.keyArr.forEach(keyItem => {
              if (keyItem.key == 'company') {
                res.company.forEach(item => {
                  item.value = item._id
                  item.label = item.name
                });
                keyItem.options = res.company
              }
            });
          }
        } catch (error) {}
        this.loading = false
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
    justify-content: flex-start;
    align-items: flex-start;
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
  .arr-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
</style>