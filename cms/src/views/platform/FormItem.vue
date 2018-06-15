<template>
  <my-form v-if="!value" slot="form" size="mini" width="24%" style="margin:15px 0">
    <div class="flex form-box">
      <my-form-item class="form-right" input v-model="userObj.name" filterable label="用户名称"></my-form-item>
      <my-form-item class="form-right" input v-model="userObj.mobile" filterable label="手机号"></my-form-item>
      <my-form-item class="form-right" input v-model="userObj.type" filterable label="类型"></my-form-item>
      <my-form-item input v-model="userObj.email" filterable label="邮箱"></my-form-item>
    </div>
    <div class="flex form-box" style="margin-top:20px;">
      <my-form-item class="form-right" input v-model.number="userObj.balance" filterable label="账户余额"></my-form-item>
      <my-form-item class="form-right" size="mini" label="平台" multiple collapse-tags select v-model="userObj.platform" filterable :options="platformArr"></my-form-item>
      <my-form-item class="form-right" size="mini" label="公司" multiple collapse-tags select v-model="userObj.company" filterable :options="companyArr"></my-form-item>
      <div class="flex edmit-tag" style="flex:0 0 24%;">
        <div style="width:60px;fontSize:12px;">标签</div>
        <el-tag size="mini" style="margin-right:10px;" :key="tag" v-for="tag in userObj.tag" closable :disable-transitions="false" @close="handleClose(userObj.tag,tag)">
          {{tag}}
        </el-tag>
        <el-input style="width:60px" size="mini" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" @keyup.enter.native="handleInputConfirm(userObj.tag)" @blur="handleInputConfirm(userObj.tag)">
        </el-input>
        <el-button size="mini" v-else class="button-new-tag" @click="showInput">添加</el-button>
      </div>
    </div>
    <div class="flex form-box" style="margin-top:20px;">
      <my-form-item class="form-right" size="mini" label="推荐人" select v-model="userObj.recommendedByUser" filterable :options="userArr"></my-form-item>
      <my-form-item class="form-right" size="mini" label="上级" select v-model="userObj.superior" filterable :options="userArr"></my-form-item>
      <my-form-item class="form-right" size="mini" label="父级" select v-model="userObj.parent" filterable :options="userArr"></my-form-item>
      <my-form-item size="mini" label="角色" multiple collapse-tags select v-model="userObj.role" filterable :options="field.User.role.option"></my-form-item>
    </div>
    <div class="flex form-box" style="margin-top:20px;">
      <div style="flex:0 0 60px;fontSize:12px;">所在区域</div>
      <my-form-item @change="changeCascader($event,index)" class="form-right" v-for="(item,index) in userObj.area" :key="index" size="mini" width="calc(24% - 60px)" filterable :change-on-select="true" v-model="item.value" area placeholder="选择区域"></my-form-item>
      <el-button size="mini" class="button-new-tag" @click="test">添加</el-button>
    </div>
    <div style="margin-top:20px;">地址列表</div>
    <my-table style="margin-top:20px;" border index size="mini" :thead="thead" edit :data.sync="data" op>
      <div slot="op" slot-scope="scope">
        <i v-if="data.length>1" title="删除该地区" class="pointer" style="margin-right:10px" @click="delAdr(scope['index'],data)">
          <icon size="16px">icon-ec1</icon>
        </i>
        <i v-if="scope['index'] === data.length - 1" title="增加一个地址" class="pointer" @click="addAdr(data)">
          <icon size="16px">icon-54</icon>
        </i>
      </div>
      <template slot-scope="scope" v-if="scope.column.property === 'default' || scope.column.property === 'area'">
        <my-form-item @change="change($event,scope.index)" size="mini" v-if="scope.column.property === 'default'" active-text="设为默认地址"
          inactive-text="非默认地址" switch v-model="scope.row[scope.column.property]"></my-form-item>
        <my-form-item size="mini" v-if="scope.column.property === 'area'" filterable :change-on-select="true" v-model="scope.row[scope.column.property]" area placeholder="选择区域"></my-form-item>
      </template>
    </my-table>
  </my-form>
</template>

<script>
  export default {
    props: {
      value:{
        type:String,
        default:''
      },
      userObj: {
        type: Object,
        default(){
          return {}
        }
      },
      thead: {
        type: Object,
        default(){
          return {}
        }
      },
      data: {
        type: Array,
        default(){
          return []
        }
      },
      platformArr:{
        type:Array,
        default(){
          return []
        }
      },
      companyArr:{
        type:Array,
        default(){
          return []
        }
      },
      userArr:{
        type:Array,
        default(){
          return []
        }
      }
    },
    data () {
      return {
        inputVisible: false,
        inputValue: "",
        areaArr:[]
      }
    },
    watch: {
      'userObj.name'(val){
        console.log(val);
        this.data.forEach(item => {
          item.contactName = val
        });
      },
      'userObj.mobile'(val){
        this.data.forEach(item => {
          item.contactMobile = val
        });
      },
      data(val){
        this.$emit('update:data',val)        
      },
      userObj(val){
        this.$emit('update:userObj',val)        
      }
    },
    methods: {
      async changeCascader(event,index){
        console.log(event,index);
        console.log(event.length);
        if (event.length === 4) {
          let area = await this.$api.curd({
            model:'area',
            curdType:'findOne',
            _id:event[3],
            populate:[
              {path:'province'},
              {path:'city'},
              {path:'county'},
              ]
          })
          if (this.areaArr.length>0) {
            
          }else{
            let obj = {
              label:area.province.name,
              value:area.province._id,
              children:[{
                label:area.city.name,
                value:area.city._id,
                children:[{
                  label:area.county.name,
                  value:area.county._id,
                }]
              }]
            }
          }
          console.log(area);
        }

      },
      test(){
        this.userObj.area.push({value:[]})
      },
      change(event,index){
        console.log(event,index);
        this.data.forEach((item,i) => {
          if (index !== i && item.default === true) {
            this.$alert(`只能拥有一个默认地址`, "提示", {
            confirmButtonText: "确定",
            callback: () => {
              this.data[index].default = false
            }
          });
          }
        });
      },
      delAdr(i,arr) {
        if (arr.length > 1) {
          arr.splice(i, 1);
        } else {
          this.$alert(`至少有一个`, "提示", {
            confirmButtonText: "确定",
            callback: () => {
              return;
            }
          });
        }
      },
      addAdr(arr) {
        let obj = JSON.parse(JSON.stringify(arr[arr.length - 1]));
        obj.default = false
        arr.push(obj);
      },
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
</style>