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
        <el-tag :key="tag" v-for="tag in item.options" closable :disable-transitions="false" @close="handleClose(item.options,tag)">
          {{tag}}
        </el-tag>
        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(item.options)" @blur="handleInputConfirm(item.options)">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">添加新标签</el-button>
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
        inputVisible: false,
        inputValue: '',
        keyArr: AddKey
      }
    },
    methods: {
      handleClose(options, tag) {
        options.splice(options.indexOf(tag), 1);
        console.log(options);
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
        let key = [{
          key: 'brand',
        }, {
          key: 'category',
        }]
        let data = {
          model: 'user',
          curdType: 'findOne',
          _id: this.user._id,
          populate: [{
            path: 'company'
          }, {
            path: 'platform'
          }]
        }
        try {
          let res = await this.$api.curd(data)
          console.log(res);
          let obj = {}
          for (let index = 0; index < key.length; index++) {
            let keyRes = await this.$api.curd({
              model: key[index].key,
              curdType: 'find',
            })
            this.keyArr.forEach(keyItem => {
              if (keyItem.key == key[index].key) {
                keyRes.forEach(resItem => {
                  keyItem.value = resItem._id
                  keyItem.label = resItem.name
                });
              }
            });
          }
          this.keyArr.forEach(keyItem => {
            data.populate.forEach(item => {
              if (keyItem.key == item.path) {
                res[item.path].forEach(resItem => {
                  let arr = {}
                  arr.value = resItem._id
                  arr.label = resItem.name
                  keyItem.options.push(arr)
                });
              }
            });
          })
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