<template>
  <div class="g-add-box" v-loading="loading" :element-loading-text="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
    <div class="flex list-box" v-for="item in keyArr" :key="item.id">
      <span style="width:100px">{{item.keyValue}}</span>
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
    <div v-if="str == 'goods'" class="flex list-box" v-for="v in price" :key="v.id">
      <span style="width:100px">{{v.keyValue}}</span>
      <el-input v-if="v.type == 'input'" v-model="v.value" :placeholder="`请输入${v.keyValue}`" style="width:222px;"></el-input>
    </div>
    <div class="flex list-box" style="">
      <el-button @click="$router.go(0)">取 消</el-button>
      <el-button type="success" @click="sub">提 交</el-button>
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
      str: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        loading: '',
        inputVisible: false,
        fileList2: [],
        inputValue: '',
        price: [{
          key: 'factory',
          keyValue: '出厂价',
          type: 'input',
          value: null,
        }, {
          key: 'sell',
          keyValue: '销售价',
          type: 'input',
          value: null,
        }, {
          key: 'transport',
          keyValue: '运输价',
          type: 'input',
          value: null,
        }],
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
      filterMethods(str) {
        if (str.indexOf('.') > -1) {
          let arr = str.splice('.')
          return arr[arr[0]][arr[1]]
        } else {
          return str
        }
      },
      async sub() {
        let io = true
        let data = {
          model: this.str,
          curdType: 'add',
        }
        this.keyArr.forEach(item => {
          if (item.value == null && item.key == 'name') {
            io = false
            this.$alert(`${item.keyValue}不能为空`, '提示', {
              confirmButtonText: '确定',
              callback: () => {
                return
              }
            })
          }
        });
        if (io) {
          this.loading = '加载中'
          this.keyArr.forEach(item => {
            if (item.type == 'Arr' && item.options.length > 0) {
              data[item.key] = item.options
            } else if (item.key.indexOf('.') != -1) {
              item.options.forEach(opItem => {
                if (opItem.value == item.value) {
                  item.value = opItem._id
                  data[item.key.split('.')[0]] = item.value
                }
              });
            } else {
              data[item.key] = item.value
            }
          });
          try {
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                if (data[key] == null) {
                  delete data[key]
                }
              }
            }
            console.log(data);
            let res = await this.$api.curd(data)
            console.log(res);
            if (this.str == 'goods') {
              for (let index = 0; index < this.price.length; index++) {
                let item = this.price[index]
                let options = {
                  model: 'price',
                  curdType: 'add',
                  type: item.key,
                  value: item.value,
                  goods: res._id
                }
                if (data.mfrs) {
                  options.mfrs = data.mfrs
                }
                if (item.value) {
                  try {
                    let price = await this.$api.curd(options)
                    console.log('price', price);
                  } catch (error) {}
                }
              }
            }
          } catch (error) {}
          this.loading = ''
          // this.$router.go(0)
        }
      }
    },
    created() {
      console.log('this.keyArr', this.keyArr);
    }
  }
</script>

<style scoped>
  .g-add-box {
    width: 100%;
    max-height: calc(85vh - 200px);
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
    width: calc(100% - 60px);
  }
  .list-box1 {
    width: 500px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
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