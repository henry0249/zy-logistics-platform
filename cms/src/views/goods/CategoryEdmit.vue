<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <my-form size="mini" width="48%" style="margin:15px 0" v-if="!loadingText">
          <div class="flex form-box">
            <my-form-item style="margin-top:20px" class="form-right" input v-model="category.name" filterable label="分类名">
            </my-form-item>
            <my-form-item v-if="str === '/goods/category/2'" style="margin-top:20px" select v-model="categoryId" label="上级分类" :options="parent">
            </my-form-item>
            <my-form-item style="margin-top:20px" :class="str === '/goods/category/2'?'form-right':''" input type="textarea" autosize v-model="category.desc" filterable label="描述">
            </my-form-item>
            <my-form-item style="margin-top:20px" input type="textarea" autosize v-model="category.remark" filterable label="备注">
            </my-form-item>
          </div>
        </my-form>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="sub">修 改</el-button>
      </div>
    </div>
  </loading-box>
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
      show: {
        type: Boolean,
        default: false
      },
      str: {
        type: String,
        default: ''
      },
      categoryId: {
        type: String,
        default: ''
      },
      parent: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data() {
      return {
        loadingText: '',
        category: {
          name: '',
          cover: '',
          desc: '',
          remark: '',
          parent: ''
        },
      }
    },
    watch: {
      keyData(val) {
        console.log(val);
        this.loadingText = 'sss'
        this.category = Object.assign({}, this.category, {
          name: val.name,
          remark: val.remark,
          desc: val.desc,
        })
        this.loadingText = ''
      }
    },
    methods: {
      async sub() {
        try {
          this.loadingText = '加载中';
          let update = {
            name: this.category.name,
            desc: this.category.desc,
            remark: this.category.remark,
          }
          if (this.str === '/goods/category/2') {
            update.parent = this.categoryId
          }
          let res = await this.$api.curd({
            model: 'category',
            curdType: 'update',
            find: {
              _id: this.keyData._id
            },
            update
          })
          console.log(res);
        } catch (error) {
          console.log(error);
        }
        this.loadingText = '';
        this.$alert('修改成功', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.go(0)
          }
        });
      },
      cancel() {
        this.$emit('update:show', false)
      },
      async getData() {
        try {
          this.loadingText = '加载中';
          let data = {
            model: 'category',
            curdType: 'find',
          }
          let res = await this.$api.curd(data)
          console.log('res', res);
          res.forEach(resItem => {
            let obj = {}
            obj.name = resItem.name
            obj._id = resItem._id
            this.parent.push(obj)
          });
        } catch (error) {
          console.log(error);
        }
        this.loadingText = '';
      },
    },
    async created() {
      for (const key in this.category) {
        if (this.category.hasOwnProperty(key)) {
          if (key === 'parent' && this.str === '/goods/category/2') {
            this.category[key] = this.keyData[key]._id
          } else {
            this.category[key] = this.keyData[key]
          }
        }
      }
      // await this.getData()
    }
  }
</script>

<style scoped>
  .g-order {
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
  .form-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
  .form-right {
    margin-right: 20px
  }
</style>