<template>
  <div>
    <div class="flex form-box">
      <my-form-item width="24%" size="mini" class="form-right" input v-model="obj.name" filterable label="用户名称"></my-form-item>
      <my-form-item width="24%" size="mini" class="form-right" input v-model="obj.mobile" filterable label="手机号"></my-form-item>
      <my-form-item width="24%" size="mini" class="form-right" input v-model="obj.type" filterable label="类型"></my-form-item>
      <my-form-item width="24%" size="mini" input v-model="obj.email" filterable label="邮箱"></my-form-item>
    </div>
    <div class="flex form-box" style="margin-top:20px;">
      <!-- <my-form-item class="form-right" size="mini" input v-model.number="obj.balance" filterable label="账户余额"></my-form-item> -->
      <my-form-item width="24%" class="form-right" size="mini" label="平台" multiple collapse-tags select v-model="obj.platform" filterable :options="platformArr"></my-form-item>
      <my-form-item width="24%" class="form-right" size="mini" label="公司" multiple collapse-tags select v-model="obj.company" filterable :options="companyArr"></my-form-item>
      <div class="flex edmit-tag" style="flex:0 0 24%;">
        <div style="width:60px;fontSize:12px;">标签</div>
        <el-tag size="mini" style="margin-right:10px;" :key="tag" v-for="tag in obj.tag" closable :disable-transitions="false" @close="handleClose(obj.tag,tag)">
          {{tag}}
        </el-tag>
        <el-input style="width:60px" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" @keyup.enter.native="handleInputConfirm(obj.tag)" @blur="handleInputConfirm(obj.tag)">
        </el-input>
        <el-button size="mini" v-else class="button-new-tag" @click="showInput">添加</el-button>
      </div>
    </div>
    <div class="flex form-box" style="margin-top:20px;">
      <!-- <my-form-item width="24%"  class="form-right" size="mini" label="推荐人" select v-model="obj.recommendedByUser" filterable :options="newUserArr"></my-form-item> -->
      <select-item style="width:24%;margin-right:20px;" v-once v-model="obj.recommendedByUser" label="推荐人" :loadingText="value"></select-item>
      <!-- <my-form-item class="form-right" size="mini" label="上级" select v-model="obj.superior" filterable :options="newUserArr"></my-form-item>
      <my-form-item class="form-right" size="mini" label="父级" select v-model="obj.parent" filterable :options="newUserArr"></my-form-item> -->
      <my-form-item width="24%" size="mini" label="角色" multiple collapse-tags select v-model="obj.role" filterable :options="field.User.role.option"></my-form-item>
    </div>
    <div class="flex form-box" style="margin-top:20px;">
      <div style="flex:0 0 60px;fontSize:12px;">可选区域</div>
      <my-form-item @change="changeCascader($event,index)" clearable class="form-right" v-for="(item,index) in arr" :key="index" size="mini" width="calc(24% - 60px)" filterable :change-on-select="true" v-model="item.value" area placeholder="选择区域"></my-form-item>
      <el-button size="mini" class="button-new-tag" @click="test">添加</el-button>
    </div>
  </div>
</template>

<script>
  import SelectItem from './SelectItem.vue';
  export default {
    components: {
      SelectItem
    },
    props: {
      value:{
        type:String,
        default:''
      },
      startAreaArr: {
        type: Array,
        default () {
          return []
        }
      },
      areaArr: {
        type: Array,
        default () {
          return []
        }
      },
      userObj: {
        type: Object,
        default () {
          return {}
        }
      },
      startObj: {
        type: Object,
        default () {
          return {}
        }
      },
      platformArr: {
        type: Array,
        default () {
          return []
        }
      },
      companyArr: {
        type: Array,
        default () {
          return []
        }
      },
      userArr: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data() {
      return {
        testtag: [],
        obj: {},
        inputVisible: false,
        inputValue: "",
        arr: [],
        newUserArr: [],
      }
    },
    watch: {
      arr: {
        handler(val) {
          console.log('arr', val);
          let arr = [];
          val.forEach(item => {
            if (item.value[3]) {
              arr.push(item.value[3]);
            }
          });
          console.log('areaArr', arr);
          if (arr.length > 0) {
            this.$emit('update:areaArr', arr);
          }
        },
        deep: true
      },
      obj: {
        handler(val, old) {
          if (val && old) {
            this.$emit('update:userObj', val);
          }
        },
        deep: true
      }
    },
    methods: {
      testclick() {
        console.log(1111);
      },
      async changeCascader(event, index) {
        if (event.length === 4) {
          this.$emit('changeArea', {
            event,
            index
          })
        } else if (event.length === 0) {
          this.arr.splice(index, 1);
        }
      },
      test() {
        console.log(111);
        this.arr.push({
          value: []
        })
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      }
    },
    created() {
      this.userArr.forEach(item => {
        if (item.name) {
          this.newUserArr.push({
            name: item.name,
            _id: item._id,
          })
        } else {
          if (item.mobile) {
            this.newUserArr.push({
              name: item.mobile,
              _id: item._id,
            })
          } else {
            this.newUserArr.push({
              name: '——',
              _id: item._id,
            })
          }
        }
      });
      this.arr = JSON.parse(JSON.stringify(this.startAreaArr));
      for (const key in this.startObj) {
        if (key === 'area') {} else {
          this.$set(this.obj, key, this.startObj[key]);
        }
      }
    }
  }
</script>

<style scoped>
  .form-right {
    margin-right: 20px;
  }
  .form-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .edmit-tag {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .area-select {
    position: relative;
  }
  .area-select-i {
    position: absolute;
    top: 0;
    right: 0;
    display: none;
    color: #909399;
  }
  .area-select:hover .area-select-i {
    display: block;
  }
</style>