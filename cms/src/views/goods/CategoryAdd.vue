<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <my-form size="mini" width="48%" style="margin:15px 0" v-if="!loadingText">
          <div class="flex form-box">
            <my-form-item style="margin-top:20px" class="form-right" input v-model="category.name" filterable label="分类名">
            </my-form-item>
            <my-form-item v-if="parent.length >0 && $route.path ==='/goods/category/2'" style="margin-top:20px" select v-model="category.parent" label="上级分类" :options="parent">
            </my-form-item>
            <my-form-item style="margin-top:20px" type="textarea" autosize class="form-right" input v-model="category.desc" filterable label="描述">
            </my-form-item>
            <my-form-item style="margin-top:20px" type="textarea" autosize input v-model="category.remark" filterable label="备注">
            </my-form-item>
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
    props: {
      parent: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    data() {
      return {
        loadingText: "",
        category: {
          name: "",
          cover: "",
          desc: "",
          remark: "",
          parent: ""
        },
        inputVisible: false,
        inputValue: ""
      };
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
        this.$emit("update:show", false);
      },
      async sub() {
        if (this.category.name) {
          try {
            this.loadingText = "加载中";
            let data = {
              model: "category",
              curdType: "add",
              name: this.category.name,
              desc: this.category.desc,
              remark: this.category.remark
            };
            if (this.category.parent) {
              data.parent = this.category.parent;
            }
            let res = await this.$api.curd(data);
            console.log(res);
            if (res) {
              this.$alert("添加成功", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                  this.$router.go(0);
                }
              });
            }
          } catch (error) {}
          this.loadingText = "";
        } else {
          this.$alert("名称必填", "提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        }
      }
    }
  };
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
    margin-right: 20px;
  }
  .edmit-tag {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 20px;
  }
</style>