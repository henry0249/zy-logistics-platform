<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <my-form size="mini" width="30%" style="margin:15px 0" v-if="!loadingText">
          <div class="flex form-box">
            <my-form-item style="margin-top:20px" class="form-right" input v-model="brand.name" filterable label="品牌名">
            </my-form-item>
            <my-form-item style="margin-top:20px" class="form-right" input v-model="brand.type" filterable label="类型">
            </my-form-item>
            <my-form-item style="margin-top:20px" multiple select v-model="brand.category" label="分类" :options="category">
            </my-form-item>
          </div>
          <div class="flex edmit-tag">
            <i style="width:60px">标签</i>
            <el-tag size="mini" style="margin-right:10px;" :key="tag" v-for="tag in brand.tag" closable :disable-transitions="false" @close="handleClose(brand.tag,tag)">
              {{tag}}
            </el-tag>
            <el-input style="width:60px" size="mini" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" @keyup.enter.native="handleInputConfirm(brand.tag)" @blur="handleInputConfirm(brand.tag)">
            </el-input>
            <el-button size="mini" v-else class="button-new-tag" @click="showInput">添加标签</el-button>
          </div>
        </my-form>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="sub">确 定</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  export default {
    data() {
      return {
        loadingText: '',
        brand: {
          name: '',
          cover: '',
          type: '',
          category: [],
          tag: []
        },
        category: [],
        inputVisible: false,
        inputValue: "",
      }
    },
    methods: {
      handleInputConfirm(options) {
        let inputValue = this.inputValue;
        if (inputValue) {
          options.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = "";
      },
      handleClose(options, tag) {
        options.splice(options.indexOf(tag), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      cancel() {
        this.$emit('update:show', false)
      },
      async sub() {
        if (this.brand.name) {
          try {
            this.loadingText = '加载中';
            let res = await this.$api.curd({
              model: 'brand',
              curdType: 'add',
              name: this.brand.name,
              type: this.brand.type,
              category: this.brand.category,
              tag: this.brand.tag,
            })
            console.log(res);
          } catch (error) {}
          this.loadingText = '';
          this.$router.go(0)
        } else {
          this.$alert('名称必填', '提示', {
            confirmButtonText: '确定',
            callback: action => {}
          });
        }
      },
      async getCategory() {
        try {
          let res = await this.$api.curd({
            model: 'category',
            curdType: 'find',
          })
          res.forEach(resItem => {
            let obj = {}
            obj._id = resItem._id
            obj.name = resItem.name
            this.category.push(obj)
          });
        } catch (error) {}
      }
    },
    async created() {
      await this.getCategory()
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
  .edmit-tag {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 20px;
  }
</style>